# ThinkOva — Complete Backend Architecture Plan

## Executive Summary
Thinkova is an in-school cohort-based AI education program for school students (Grades 5–8) delivered through partner school computer labs. This document defines a production-ready, highly concurrent backend architecture covering:
- **Dual-Database Strategy** (School Management DB & Student/Commerce DB)
- **School-UID & Name Auto-Resolution Engine**
- **High Concurrency & Seat Race-Condition Prevention**
- **Automated Email Cron Jobs & Transactional Lifecycle**
- **WhatsApp Messaging & Weekly Assessment Pipelines**
- **Passwordless OTP Authentication & RBAC Route Management**

---

## 1. System Architecture Overview

```mermaid
flowchart TB
    subgraph Clients["Client Applications"]
        ParentWeb["Parent Portal (Web/Mobile)"]
        TutorWeb["Tutor Portal"]
        SchoolWeb["School Management Portal"]
        AdminWeb["Operations Admin"]
    end

    subgraph Edge["Edge & Gateway Layer"]
        CDN["Cloudflare Edge / CDN"]
        APIGW["Next.js API Gateway & Edge Middleware (RBAC & Auth)"]
        RedisPool["Redis Cluster (Locks, OTP, Caching, BullMQ)"]
    end

    subgraph Services["Core Application Services"]
        AuthSvc["Auth & Identity Service (Phone/Email OTP)"]
        SchoolSvc["School & Batch Management Service"]
        CommerceSvc["Student, Enrollment & Payment Service"]
        NotifySvc["Notification & Event Worker (Inngest / BullMQ)"]
    end

    subgraph Storage["Data & Storage Layer"]
        SchoolDB[("DB 1: School & Operations DB (PostgreSQL)")]
        CommerceDB[("DB 2: Students & Commerce DB (PostgreSQL)")]
        S3Bucket[("Object Storage (Cloudflare R2 / AWS S3)")]
    end

    subgraph Gateways["Third-Party Gateways"]
        Razorpay["Razorpay / Cashfree (Payments)"]
        WhatsAppAPI["WhatsApp Business API (WATI / Interakt)"]
        EmailGateway["Transactional Email (Resend / AWS SES)"]
    end

    Clients --> CDN --> APIGW
    APIGW --> RedisPool
    APIGW --> AuthSvc
    APIGW --> SchoolSvc
    APIGW --> CommerceSvc

    SchoolSvc --> SchoolDB
    CommerceSvc --> CommerceDB
    CommerceSvc --> RedisPool

    CommerceSvc -. Event Bus .-> NotifySvc
    NotifySvc --> RedisPool
    NotifySvc --> Razorpay
    NotifySvc --> WhatsAppAPI
    NotifySvc --> EmailGateway
    CommerceSvc --> S3Bucket
```

---

## 2. Dual-Database Strategy & Schemas

### Architectural Rationale
Separating the **School Management** domain from the **Student & Commerce** domain provides:
1. **Security & Compliance:** Student PII (COPPA / DPDP regulations) is isolated from B2B partner agreements and financial commission ledgers.
2. **Scalability:** The Student/Commerce database handles 98% of peak write operations (enrolment bursts, checkout concurrency, cart expirations), without locking administrative school tables.
3. **Decoupled Life Cycle:** B2B school onboarding operates on an institutional timeline, while B2C student transactions are event-driven.

---

### Database 1: `schools_db` (School & Institutional Management)

This database manages partner schools, campus facilities, computer lab constraints, tutor assignments, and cohort batch schedules.

```mermaid
erDiagram
    SCHOOL ||--o{ SCHOOL_ALIAS : has
    SCHOOL ||--o{ COHORT_BATCH : hosts
    TUTOR ||--o{ COHORT_BATCH : instructs

    SCHOOL {
        uuid id PK
        string school_uid UK "e.g. SCH-PUN-042 / DPS-PUNE"
        string official_name
        string slug UK
        string city
        string state
        string board "CBSE | ICSE | STATE | IB"
        string lab_room_number
        int lab_capacity "Max lab machines (e.g. 30)"
        string coordinator_name
        string coordinator_phone
        string coordinator_email
        decimal partner_commission_pct "e.g. 15.00%"
        enum status "ACTIVE | PENDING | ARCHIVED"
        timestamp created_at
    }

    SCHOOL_ALIAS {
        uuid id PK
        uuid school_id FK
        string alias_name "e.g. Delhi Public School Pune, DPS Mohammadwadi"
        tsvector search_vector "Full-text search index"
    }

    TUTOR {
        uuid id PK
        string full_name
        string email UK
        string phone UK
        string bio
        string photo_url
        boolean background_verified
        enum status "ACTIVE | INACTIVE"
        timestamp created_at
    }

    COHORT_BATCH {
        uuid id PK
        uuid school_id FK
        uuid tutor_id FK
        string batch_code UK "e.g. DPS-PUN-B1-2027"
        int[] grade_levels "e.g. [5, 6, 7, 8]"
        string day_of_week "e.g. Wednesday"
        time start_time "e.g. 14:30"
        time end_time "e.g. 16:00"
        int max_capacity "Hard capped at 25"
        int confirmed_students_count "Default 0"
        date start_date
        date level_5_date "Threshold for 2nd installment"
        date demo_day_date
        enum status "UPCOMING | RUNNING | COMPLETED"
        timestamp created_at
    }
```

---

### Database 2: `students_commerce_db` (Parents, Students & Financials)

This database handles parent user accounts, student/ward profiles, orders, installment payment schedules, refunds, and weekly assessments.

```mermaid
erDiagram
    USER ||--o{ STUDENT : parents
    STUDENT ||--o{ ENROLLMENT : has
    ENROLLMENT ||--o{ ORDER : generates
    ORDER ||--o{ PAYMENT : fulfills
    PAYMENT ||--o{ REFUND : records
    STUDENT ||--o{ ASSESSMENT : receives

    USER {
        uuid id PK
        string phone UK "WhatsApp verified number"
        string email UK
        string username "Fallback to email if not provided"
        enum role "PARENT | TUTOR | SCHOOL_ADMIN | SUPER_ADMIN"
        boolean is_phone_verified
        boolean is_email_verified
        timestamp consent_timestamp "DPDP legal compliance"
        timestamp created_at
    }

    STUDENT {
        uuid id PK
        uuid parent_user_id FK
        string full_name
        string school_uid "Reference to schools_db"
        string school_name_snapshot "Denormalized for fallback"
        int current_grade "5 | 6 | 7 | 8"
        string section "e.g. 6-B"
        timestamp created_at
    }

    ENROLLMENT {
        uuid id PK
        uuid student_id FK
        uuid cohort_batch_id "Reference to schools_db"
        string school_uid
        enum payment_plan "FULL | INSTALLMENTS"
        enum enrollment_status "PENDING_PAYMENT | ENROLLED | DROPPED | REFUNDED"
        int current_level "1 to 8"
        timestamp enrolled_at
    }

    ORDER {
        uuid id PK
        uuid enrollment_id FK
        uuid user_id FK
        enum order_type "FULL_PAYMENT | INSTALLMENT_1 | INSTALLMENT_2"
        int amount_in_paise "499900 or 250000"
        enum status "AWAITING_PAYMENT | PAID | FAILED | EXPIRED"
        timestamp abandoned_alert_sent_at
        timestamp expires_at
        timestamp created_at
    }

    PAYMENT {
        uuid id PK
        uuid order_id FK
        string gateway "RAZORPAY | CASHFREE"
        string gateway_order_id UK
        string gateway_payment_id UK
        string payment_method "UPI | CARD | NETBANKING"
        int amount_in_paise
        enum status "SUCCESS | FAILED | REFUNDED"
        timestamp paid_at
    }

    REFUND {
        uuid id PK
        uuid payment_id FK
        uuid enrollment_id FK
        int amount_in_paise
        enum reason "DEMO_DAY_GUARANTEE | CLIENT_WITHDRAWAL | BATCH_CANCELLED"
        enum initiated_by "CLIENT | MANAGEMENT"
        string gateway_refund_id
        enum status "INITIATED | PROCESSING | COMPLETED | FAILED"
        timestamp initiated_at
        timestamp completed_at
    }

    ASSESSMENT {
        uuid id PK
        uuid student_id FK
        int level_number "1 to 8"
        enum attendance "PRESENT | ABSENT"
        string project_title
        string project_artifact_url
        int tutor_score "1 to 5"
        text tutor_feedback
        boolean safety_pledge_verified
        timestamp report_sent_whatsapp_at
        timestamp created_at
    }
```

---

## 3. School Identification & Parent Resolution Engine

To prevent parents from failing registration if they do not remember the `School-UID` from their school circular:

```mermaid
sequenceDiagram
    autonumber
    actor Parent as Parent (Registration Form)
    participant API as /api/schools/resolve
    participant Redis as Redis Cache (School Index)
    participant SchoolDB as schools_db

    Parent->>API: Input: "DPS Pune" OR "SCH-PUN-042"
    API->>Redis: Check exact match (Key: school:uid:{val})
    alt Exact School-UID Found
        Redis-->>API: Returns School Metadata & Active Batches
    else Fuzzy Search by Name
        API->>SchoolDB: Query trigram match & aliases (similarity > 0.4)
        SchoolDB-->>API: Returns top 3 candidate schools with cities
    end
    API-->>Parent: Returns Resolved School UID & Name Confirmation
    Parent->>Parent: Selects verified school -> proceeds to student grade & fee
```

### API Implementation: `GET /api/schools/resolve`
1. **Primary Match (Exact UID):** Case-insensitive check on `school_uid` (e.g., `DPS-PUNE`).
2. **Fallback Match (Fuzzy Name):** Uses PostgreSQL `pg_trgm` similarity index over `official_name` and `school_aliases`.
3. **Payload returned:**
```json
{
  "schoolUid": "SCH-PUN-042",
  "name": "Delhi Public School, Mohammadwadi",
  "city": "Pune",
  "eligibleGrades": [5, 6, 7, 8],
  "upcomingBatches": [
    { "batchId": "uuid-1", "day": "Wednesday", "time": "14:30", "seatsRemaining": 7 }
  ]
}
```

---

## 4. API Concurrency & Scalability Architecture

### Peak Spike Problem
When a school sends out a WhatsApp circular to 1,500 parents simultaneously, hundreds of parents reach the checkout page at once. Each batch is strictly capped at **25 students**.

```mermaid
flowchart LR
    Request["Parent Initiates Enrolment"] --> RedisLock{"Acquire Seat Lock in Redis<br/>SET cohort:{id}:seat:{uid} EX 900 NX"}
    RedisLock -->|Lock Acquired| RazorpayOrder["Create Razorpay Order<br/>(15-Minute Seat Hold)"]
    RedisLock -->|Batch Full (Count >= 25)| Waitlist["Prompt Parent:<br/>Join Waitlist / Next Cohort"]
    RazorpayOrder --> PaymentWait{"Payment Completed within 15 Min?"}
    PaymentWait -->|Yes: Webhook Received| Confirm["Finalize DB Seat<br/>Mark ENROLLED"]
    PaymentWait -->|No: Lock Expires| ReleaseLock["Redis TTL Evicts Lock<br/>Seat Becomes Available"]
```

### Concurrency Guarantees:
1. **Atomic Distributed Locks:** Redis `SET resource_key my_random_value NX PX 900000` reserves a seat for 15 minutes while the parent completes the UPI/Card transaction.
2. **Database Idempotency:** Webhook processing checks `gateway_payment_id` with `INSERT ... ON CONFLICT (gateway_payment_id) DO NOTHING` to prevent double-charging or duplicate bookings.
3. **Connection Pooling:** Use PgBouncer or AWS RDS Proxy in front of PostgreSQL to prevent serverless Lambda/Edge function connection exhaustion during traffic surges.

---

## 5. Automated Email Cron Jobs & Lifecycle

All cron and delayed jobs are managed via an event-driven scheduler (such as **Inngest** or **BullMQ + Redis**):

```mermaid
stateDiagram-v2
    [*] --> CartCreated: Parent initiates enrolment
    CartCreated --> AwaitingPayment: Order created
    AwaitingPayment --> PaymentSuccess: Webhook (Paid)
    AwaitingPayment --> AbandonedCart1Hr: 60 Minutes elapse without payment
    AbandonedCart1Hr --> RecoveryEmailSent: Trigger Job #2

    PaymentSuccess --> EnrolledSuccess: Student added to School DB roster
    EnrolledSuccess --> WelcomeEmailSent: Trigger Job #1

    AwaitingPayment --> PaymentFailed: Gateway decline
    PaymentFailed --> FailureEmailSent: Trigger Job #3

    EnrolledSuccess --> InstallmentCheck: If chosen 2-part plan
    InstallmentCheck --> InstallmentDueReminder: 3 Days before Level 5
    InstallmentDueReminder --> ReminderEmailSent: Trigger Job #4

    EnrolledSuccess --> RefundTriggered: Client / Admin initiates refund
    RefundTriggered --> RefundEmailSent: Trigger Job #5
```

### Detailed Job Specifications:

| Job Name | Trigger / Schedule | Target Recipient | Payload & Action |
|---|---|---|---|
| **1. Enrolment Success** | Instant event on `order.paid` + Roster entry | Parent Email | Welcome pack, student ID, school lab schedule, tutor introduction, orientation date. |
| **2. Cart Abandoned (> 1 Hour)** | Delayed check scheduled at `order.created + 60m` | Parent Email | *"Your child's seat in [School Name] is held for a limited time. Click here to resume payment."* |
| **3. Payment / Enrolment Failure** | Instant event on `payment.failed` webhook | Parent Email | Transaction failure code, explanation (e.g. bank timeout), and 1-click retry payment link. |
| **4. Installment 2 Due (3 Days Prior)** | Daily Cron running at 09:00 AM IST | Installment plan parents | Filters students at Level 4 where Level 5 starts in 3 days. Includes direct ₹2,499 UPI payment link. |
| **5. Refund Notification** | Instant event on `refund.initiated` | Parent Email | Refund reference number, amount (e.g. ₹2,499 demo-day guarantee or full), and bank credit ETA (5–7 days). |

---

## 6. WhatsApp Messaging Engine & Weekly Assessments

Indian parents interact with WhatsApp significantly more reliably than email. The WhatsApp service integrates with **WATI / Interakt / Gupshup** using official Meta templates:

```mermaid
sequenceDiagram
    autonumber
    actor Parent as Parent WhatsApp
    participant Svc as Notification Service
    participant Tutor as Tutor App
    participant DB as students_commerce_db

    Note over Svc,Parent: Event 1: Enrolment Confirmation
    Svc->>Parent: "Hi {Parent}! {Student} is confirmed for ThinkOva at {School} starting {Date}."

    Note over Tutor,Parent: Event 2: Weekly Assessment Report (Levels 2, 4, 6)
    Tutor->>DB: Records attendance, score (1-5), and project artifact
    DB->>Svc: Trigger event: assessment.published
    Svc->>Parent: "Level {N} Complete! 🚀 {Student} built {ProjectName}. View report & tutor note: {Link}"

    Note over Svc,Parent: Event 3: De-enrolment / Refund Notice
    Svc->>Parent: "Update on {Student}'s enrolment: De-enrolment processed. Refund of ₹{Amount} initiated."
```

### Outbound WhatsApp Routes:
1. `POST /api/webhooks/whatsapp/inbound`: Receives incoming parent replies (`STOP`, queries) and updates consent preferences.
2. `POST /api/notifications/whatsapp/enrollment-confirmed`: Sends instant receipt + circular confirmation.
3. `POST /api/notifications/whatsapp/weekly-report`: Dispatches weekly milestone cards after Levels 2, 4, 6, and Demo Day.
4. `POST /api/notifications/whatsapp/installment-alert`: Direct WhatsApp payment prompt for Installment 2.

---

## 7. Authentication, OTP & Route Management System

### Passwordless OTP Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Parent / Tutor / Admin
    participant Auth as /api/auth/otp/send
    participant Redis as Redis (TTL: 300s)
    participant SMS as SMS / WhatsApp Gateway
    participant Verify as /api/auth/otp/verify
    participant JWT as Session Engine

    User->>Auth: Enters Phone (+91...) OR Email
    Auth->>Redis: Generate 6-digit cryptographic OTP, Store with Rate Limit (3 attempts)
    Auth->>SMS: Dispatch OTP via WhatsApp/SMS or Email
    SMS-->>User: Delivers OTP: 492817
    User->>Verify: Enters OTP
    Verify->>Redis: Validate OTP & Consume
    Verify->>JWT: Issue HttpOnly Secure Session Cookie + RBAC Role
    JWT-->>User: Redirect to Role-Specific Dashboard
```

### Username Fallback Logic
```typescript
function resolveUsername(input: { username?: string; email: string }): string {
  if (input.username && input.username.trim().length >= 3) {
    return input.username.trim().toLowerCase();
  }
  // Fallback: Default username to email address
  return input.email.trim().toLowerCase();
}
```

### RBAC Route Protection (Next.js Middleware)

```
/
├── (public)
│   ├── /                         -> Landing Page
│   ├── /auth/login               -> OTP Login (Phone / Email)
│   ├── /enrol                    -> School UID / Name Enrolment Flow
│   └── /legal/[slug]             -> Policies & Curriculum PDF
│
├── /parent (Role: PARENT)
│   ├── /parent/dashboard         -> Enrolled children overview
│   ├── /parent/progress/[id]     -> Weekly level tracker & project artifacts
│   └── /parent/payments          -> Installment 2 pay button & invoices
│
├── /tutor (Role: TUTOR)
│   ├── /tutor/batches            -> Assigned school computer lab batches
│   ├── /tutor/attendance         -> Weekly 90-min session attendance marking
│   └── /tutor/assessments        -> Grade Level 1-8 project submissions
│
├── /school (Role: SCHOOL_ADMIN)
│   ├── /school/roster            -> List of enrolled students by grade
│   ├── /school/lab-schedule      -> Computer lab timing & assigned tutor
│   └── /school/partner-fees      -> Accumulated school revenue-share report
│
└── /admin (Role: SUPER_ADMIN)
    ├── /admin/schools            -> School onboarding & UID generator
    ├── /admin/tutors             -> Tutor vetting & batch assignment
    ├── /admin/finance            -> Razorpay reconciliations & refund processing
    └── /admin/cron-logs          -> Queue health & WhatsApp delivery audits
```

---

## 8. Potential Bottlenecks & Mitigations

| Area | Potential Bottleneck | Mitigation Strategy |
|---|---|---|
| **School UID Entry** | Parent typos or missing circular information. | Fuzzy search fallback (`pg_trgm`) resolving school name + city seamlessly. |
| **Seat Overbooking** | Simultaneous checkout for the final 25th seat in a batch. | Redis distributed lock (`SET NX EX 900`) reserving the seat during checkout. |
| **Webhook Timeouts** | Razorpay webhooks failing under concurrent traffic. | Acknowledge webhook immediately (`200 OK`) and push event into BullMQ background queue. |
| **WhatsApp Rate Limits** | Meta API enforces rate limits on bulk template dispatch. | Queue throttling with jitter (maximum 30 messages/second per number). |
| **Database Contention** | Heavy reporting and assessment queries impacting payments. | Separate read-replicas for school coordinators and administrative queries. |

---

## 9. Implementation Roadmap

```mermaid
gantt
    title Thinkova Backend Implementation Phases
    dateFormat  YYYY-MM-DD
    section Phase 1: Core Data & Resolution
    Dual PostgreSQL Setup & Prisma Schemas :2026-11-10, 7d
    School-UID & Fuzzy Name Resolution API  :2026-11-17, 5d
    Passwordless OTP Auth (Phone/Email)    :2026-11-22, 6d
    section Phase 2: Commerce & Concurrency
    Seat Locking via Redis (Max 25 Seats)  :2026-11-28, 5d
    Razorpay Split Installments & Webhooks :2026-12-03, 7d
    Refund Engine (Demo Day Guarantee)     :2026-12-10, 4d
    section Phase 3: Automation & Portals
    BullMQ / Inngest 5 Email Cron Workflows :2026-12-14, 6d
    WhatsApp Weekly Assessment Pipeline     :2026-12-20, 6d
    Tutor & School Coordinator Portals      :2026-12-26, 8d
```

