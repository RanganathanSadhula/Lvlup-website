export interface WeeklyPlanItem {
  week: number;
  title: string;
  subtitle: string;
  tags?: string[];
}

export interface Course {
  id: string;
  title: string;
  trackId: string;
  trackName: string;
  grades: string;
  minGrade: number;
  maxGrade: number;
  duration: string;
  price: number;
  priceFormatted: string;
  twoPartsPriceFormatted: string;
  firstPartFormatted: string;
  secondPartFormatted: string;
  nextBatch: string;
  summary: string;
  whatTheyBuild: string;
  image: string;
  heroImage?: string;
  popularTag?: string;
  kitIncluded?: boolean;
  classSchedule?: string;
  location?: string;
  seatsLeft?: number;
  demoDayPromise?: string;
  demoDayTests?: string[];
  tutor?: {
    name: string;
    title: string;
    bio: string;
    avatar?: string;
  };
  weeklyPlan?: WeeklyPlanItem[];
}

export interface Track {
  id: string;
  name: string;
  slug: string;
  filterLabel: string;
  tagline: string;
  description: string;
  priceRange: string;
  minPrice: number;
  gradeRange: string;
  image: string;
  courses: Course[];
}

export const tracksData: Track[] = [
  {
    id: "robotics",
    name: "Robotics",
    slug: "robots",
    filterLabel: "Robotics",
    tagline: "Build a rover that sees a wall and steers around it.",
    description: "Build a rover that sees a wall and steers around it. Kits stay at school, so there is nothing to buy.",
    priceRange: "₹5,499 – ₹6,999",
    minPrice: 5499,
    gradeRange: "Grades 5–11",
    image: "/images/tracks-rover.png",
    courses: [
      {
        id: "robotics-starter",
        title: "Robotics Starter: Build a Rover",
        trackId: "robotics",
        trackName: "Robotics",
        grades: "Grades 5–7",
        minGrade: 5,
        maxGrade: 7,
        duration: "6 weeks",
        price: 5499,
        priceFormatted: "₹5,499",
        twoPartsPriceFormatted: "₹5,999",
        firstPartFormatted: "₹3,000",
        secondPartFormatted: "₹2,999",
        nextBatch: "Starts 6 Dec",
        summary: "A rover that drives on its own, sees a wall 20 cm away and steers around it.",
        whatTheyBuild: "A rover that sees a wall and steers around it",
        image: "/images/rover-color.png",
        heroImage: "/images/course-rover-girl.jpg",
        popularTag: "Popular in Grade 6",
        kitIncluded: true,
        classSchedule: "90-min class, Saturdays",
        location: "Banyan Grove School lab",
        seatsLeft: 7,
        demoDayPromise: "A rover that drives on its own, sees a wall 20 cm away and steers around it.",
        demoDayTests: [
          "Drives 2 metres in a straight line on its own",
          "Stops or turns before a wall 20 cm away",
        ],
        tutor: {
          name: "Rohan Mehta",
          title: "Robotics tutor",
          bio: "background-checked · ran 30+ clubs",
          avatar: "/images/tutors/rohan.jpg",
        },
        weeklyPlan: [
          {
            week: 1,
            title: "Meet the parts, and the safety pledge",
            subtitle: "You'll have: A wired chassis and a signed safety pledge",
            tags: [
              "Parts of a robot",
              "Batteries and safe wiring",
              "How motors turn wheels",
              "Reading a build plan",
              "The safety pledge",
            ],
          },
          {
            week: 2,
            title: "Motors, wheels and power",
            subtitle: "You'll have: Wheels that turn on command",
            tags: ["Motor controllers", "Polarity & rotation", "DC motor current draw"],
          },
          {
            week: 3,
            title: "Your first drive program",
            subtitle: "You'll have: The rover drives a square",
            tags: ["Timed drive states", "Precision 90-degree pivot", "Square perimeter trace"],
          },
          {
            week: 4,
            title: "Add a distance sensor",
            subtitle: "You'll have: It measures how far the wall is",
            tags: ["Ultrasonic pulses", "Real-time range finding", "Echo pin timing"],
          },
          {
            week: 5,
            title: "Dodge obstacles on its own",
            subtitle: "You'll have: It stops and turns before a wall",
            tags: ["Proximity threshold", "Evasive reverse & turn", "Continuous obstacle evasion"],
          },
          {
            week: 6,
            title: "Rover challenge for parents",
            subtitle: "You'll have: Demo day: two tests, live",
            tags: ["Straight-line sprint", "20 cm wall emergency stop", "Parent live defense"],
          },
        ],
      },
      {
        id: "smart-robots-sensors",
        title: "Smart Robots with Sensors",
        trackId: "robotics",
        trackName: "Robotics",
        grades: "Grades 8–11",
        minGrade: 8,
        maxGrade: 11,
        duration: "8 weeks",
        price: 6999,
        priceFormatted: "₹6,999",
        twoPartsPriceFormatted: "₹7,499",
        firstPartFormatted: "₹3,750",
        secondPartFormatted: "₹3,749",
        nextBatch: "Starts 6 Dec",
        summary: "Multi-sensor telemetry, servo arms, and calibrated PID motor feedback.",
        whatTheyBuild: "A multi-sensor search-and-retrieve robotic rover",
        image: "/images/tracks-rover.png",
        kitIncluded: true,
        classSchedule: "90-min class, Saturdays",
        location: "Banyan Grove School lab",
        seatsLeft: 5,
      },
    ],
  },
  {
    id: "electronics",
    name: "Electronics & IoT",
    slug: "electronics",
    filterLabel: "Electronics & IoT",
    tagline: "An alarm that knows when the room gets stuffy.",
    description: "Circuit breadboarding, microcontrollers, environmental sensors, and real-time alerts.",
    priceRange: "₹4,999 – ₹6,499",
    minPrice: 4999,
    gradeRange: "Grades 6–11",
    image: "/images/tracks-electronics.png",
    courses: [
      {
        id: "electronics-starter",
        title: "Sensors and Smart Alarms",
        trackId: "electronics",
        trackName: "Electronics & IoT",
        grades: "Grades 6–9",
        minGrade: 6,
        maxGrade: 9,
        duration: "6 weeks",
        price: 4999,
        priceFormatted: "₹4,999",
        twoPartsPriceFormatted: "₹5,499",
        firstPartFormatted: "₹2,500",
        secondPartFormatted: "₹2,999",
        nextBatch: "Starts 8 Dec",
        summary: "An alarm that knows when the room gets stuffy.",
        whatTheyBuild: "An alarm that knows when the room gets stuffy",
        image: "/images/tracks-electronics.png",
        kitIncluded: true,
        classSchedule: "90-min class, Sundays",
        location: "Banyan Grove School lab",
        seatsLeft: 9,
        demoDayPromise: "An environmental monitor that detects air quality drops and sounds an alarm.",
        demoDayTests: [
          "Triggers buzzer when temperature or humidity thresholds exceed limit",
          "Transmits telemetry readout over local bus",
        ],
        weeklyPlan: [
          { week: 1, title: "Breadboards, LEDs and Current", subtitle: "You'll have: A safe dual-LED indicator circuit", tags: ["Resistors", "Ohm's law in practice", "Safe wiring"] },
          { week: 2, title: "Sound & Threshold Alarms", subtitle: "You'll have: A sound-activated buzzer", tags: ["Piezo buzzers", "Microphone modules", "Sensitivity pots"] },
          { week: 3, title: "Air & Temperature Probes", subtitle: "You'll have: Live temperature sensor readout", tags: ["DHT sensors", "Analog-to-digital readouts", "Calibration"] },
          { week: 4, title: "State Machines & Alert Logic", subtitle: "You'll have: Multi-condition alarm alerts", tags: ["Boolean conditions", "Hysteresis filters", "Failsafe resets"] },
          { week: 5, title: "Enclosure Wiring & Soldering Safety", subtitle: "You'll have: Packaged alarm ready for testing", tags: ["Custom cases", "Terminal blocks", "Battery harness"] },
          { week: 6, title: "Demo Day Room Defense", subtitle: "You'll have: Live room alert defense before tutors", tags: ["Stuffy air simulation", "Live parent test", "Certificate defense"] },
        ],
      },
      {
        id: "electronics-iot",
        title: "IoT: Build a Smart Home Device",
        trackId: "electronics",
        trackName: "Electronics & IoT",
        grades: "Grades 9–11",
        minGrade: 9,
        maxGrade: 11,
        duration: "8 weeks",
        price: 6499,
        priceFormatted: "₹6,499",
        twoPartsPriceFormatted: "₹6,999",
        firstPartFormatted: "₹3,500",
        secondPartFormatted: "₹3,499",
        nextBatch: "Older grades",
        summary: "A plant that waters itself.",
        whatTheyBuild: "A plant that waters itself",
        image: "/images/tracks-iot-plant.jpg",
        kitIncluded: true,
        classSchedule: "90-min class, Sundays",
        location: "Banyan Grove School lab",
        seatsLeft: 6,
      },
    ],
  },
  {
    id: "ai",
    name: "AI & Agents",
    slug: "ai",
    filterLabel: "AI & Agents",
    tagline: "A study helper that quizzes you and explains mistakes.",
    description: "Prompt engineering, verified guardrails, vector retrieval, and custom AI study bots.",
    priceRange: "₹4,499 – ₹5,499",
    minPrice: 4499,
    gradeRange: "Grades 5–11",
    image: "/images/tracks-ai.png",
    courses: [
      {
        id: "ai-study-helper",
        title: "AI for Young Creators",
        trackId: "ai",
        trackName: "AI & Agents",
        grades: "Grades 5–7",
        minGrade: 5,
        maxGrade: 7,
        duration: "8 weeks",
        price: 4499,
        priceFormatted: "₹4,499",
        twoPartsPriceFormatted: "₹4,999",
        firstPartFormatted: "₹2,500",
        secondPartFormatted: "₹2,499",
        nextBatch: "Enrolled",
        summary: "A study helper that quizzes you and explains mistakes.",
        whatTheyBuild: "A study helper that quizzes you",
        image: "/images/tracks-ai.png",
        heroImage: "/images/explore-student-ai.jpg",
        kitIncluded: false,
        classSchedule: "90-min class, Thursdays 6:00 PM",
        location: "Virtual & School Lab",
        seatsLeft: 12,
        demoDayPromise: "An interactive chatbot study buddy that explains math and science topics step-by-step.",
        demoDayTests: [
          "Quizzes a peer on 3 science questions with custom feedback",
          "Safely rejects questions outside study syllabus",
        ],
        weeklyPlan: [
          { week: 1, title: "How Language Models Think", subtitle: "You'll have: First conversational prompt with guardrails", tags: ["Prompts", "System tokens", "Child safety guidelines"] },
          { week: 2, title: "Building the Study Buddy Persona", subtitle: "You'll have: Bot personality and tone defined", tags: ["Persona tuning", "Encouraging hints", "Clarification turns"] },
          { week: 3, title: "Interactive Quiz Branching", subtitle: "You'll have: Multi-option questions with real-time scoring", tags: ["Decision trees", "Score trackers", "Adaptive hints"] },
          { week: 4, title: "Connecting Notes & Syllabus Knowledge", subtitle: "You'll have: Custom chapter Q&A retrieval", tags: ["Syllabus indexing", "Factual grounding", "No hallucination checks"] },
          { week: 5, title: "Stress Testing & Safety Guardrails", subtitle: "You'll have: Robust error recovery when inputs fail", tags: ["Edge cases", "Input sanity filters", "Polite redirects"] },
          { week: 6, title: "School Demo Day Showcase", subtitle: "You'll have: Live classmate study buddy trial", tags: ["Peer trial", "Parent review", "Graduation certificate"] },
        ],
      },
      {
        id: "ai-autonomous-agents",
        title: "Autonomous Agents & Fact Checkers",
        trackId: "ai",
        trackName: "AI & Agents",
        grades: "Grades 8–11",
        minGrade: 8,
        maxGrade: 11,
        duration: "8 weeks",
        price: 5499,
        priceFormatted: "₹5,499",
        twoPartsPriceFormatted: "₹5,999",
        firstPartFormatted: "₹3,000",
        secondPartFormatted: "₹2,999",
        nextBatch: "Starts 6 Dec",
        summary: "Multi-step tool calling, API integration, data scraping filters, and hallucinations verification.",
        whatTheyBuild: "An autonomous research agent that verifies sources and flags fake news",
        image: "/images/tracks-ai.png",
        kitIncluded: false,
        classSchedule: "90-min class, Thursdays",
        location: "Virtual & School Lab",
        seatsLeft: 8,
      },
    ],
  },
  {
    id: "games",
    name: "Game Design",
    slug: "games",
    filterLabel: "Game Design",
    tagline: "A level your friends can actually play.",
    description: "Physics mechanics, character states, level design, and polished retro game loops.",
    priceRange: "₹3,999 – ₹4,999",
    minPrice: 3999,
    gradeRange: "Grades 5–11",
    image: "/images/tracks-games.png",
    courses: [
      {
        id: "game-design-starter",
        title: "Design a Playable Game",
        trackId: "games",
        trackName: "Game Design",
        grades: "Grades 5–7",
        minGrade: 5,
        maxGrade: 7,
        duration: "6 weeks",
        price: 3999,
        priceFormatted: "₹3,999",
        twoPartsPriceFormatted: "₹4,499",
        firstPartFormatted: "₹2,250",
        secondPartFormatted: "₹2,249",
        nextBatch: "Starts 13 Dec",
        summary: "A maze game your friends can play.",
        whatTheyBuild: "A maze game your friends can play",
        image: "/images/tracks-games.png",
        kitIncluded: false,
        classSchedule: "90-min class, Saturdays",
        location: "Banyan Grove School lab",
        seatsLeft: 10,
        demoDayPromise: "A complete 2D arcade platformer with smooth collision, collectible gems, and win/loss screens.",
        demoDayTests: [
          "Player controls character through 2 full levels without crashes",
          "Passes play-test by 3 classmates who beat level 1",
        ],
        weeklyPlan: [
          { week: 1, title: "Game Loop & Character Sprites", subtitle: "You'll have: Character moving on 60fps screen", tags: ["Coordinate grid", "Sprite animations", "Key inputs"] },
          { week: 2, title: "Solid Platforms & Gravity Physics", subtitle: "You'll have: Jumping and collision boxes", tags: ["AABB bounding boxes", "Velocity vs acceleration", "Jump arc"] },
          { week: 3, title: "Coins, Keys & Collectibles", subtitle: "You'll have: Score counter and pickup sound effects", tags: ["Item states", "HUD displays", "Audio triggers"] },
          { week: 4, title: "Moving Hazards & Enemies", subtitle: "You'll have: Patrolling enemies and health loss", tags: ["Patrol paths", "Invulnerability frames", "Respawn checkpoints"] },
          { week: 5, title: "Level Polish & Boss Encounter", subtitle: "You'll have: 2 full levels and boss puzzle", tags: ["Level pacing", "Boss attack patterns", "Victory conditions"] },
          { week: 6, title: "Playable Arcade Showcase", subtitle: "You'll have: Friends and parents play your game live", tags: ["Game balance", "Peer review tournament", "Web link publish"] },
        ],
      },
      {
        id: "game-design-advanced",
        title: "3D Worlds & Combat Mechanics",
        trackId: "games",
        trackName: "Game Design",
        grades: "Grades 8–11",
        minGrade: 8,
        maxGrade: 11,
        duration: "8 weeks",
        price: 4999,
        priceFormatted: "₹4,999",
        twoPartsPriceFormatted: "₹5,499",
        firstPartFormatted: "₹2,750",
        secondPartFormatted: "₹2,749",
        nextBatch: "Starts 6 Dec",
        summary: "Raycasting, lighting shaders, inventory systems, and procedural dungeon generation.",
        whatTheyBuild: "A fully playable 3D third-person exploration game",
        image: "/images/tracks-games.png",
        kitIncluded: false,
        classSchedule: "90-min class, Saturdays",
        location: "Banyan Grove School lab",
        seatsLeft: 7,
      },
    ],
  },
  {
    id: "design",
    name: "Product & 3D Design",
    slug: "design",
    filterLabel: "Product & 3D",
    tagline: "A lamp, sketched, modelled and prototyped.",
    description: "Parametric CAD modeling, spatial ergonomics, rapid iteration, and physical prototyping.",
    priceRange: "₹3,999 – ₹5,999",
    minPrice: 3999,
    gradeRange: "Grades 6–11",
    image: "/images/tracks-product.png",
    courses: [
      {
        id: "design-starter",
        title: "Design a Real Product",
        trackId: "design",
        trackName: "Product & 3D Design",
        grades: "Grades 6–9",
        minGrade: 6,
        maxGrade: 9,
        duration: "6 weeks",
        price: 3999,
        priceFormatted: "₹3,999",
        twoPartsPriceFormatted: "₹4,499",
        firstPartFormatted: "₹2,250",
        secondPartFormatted: "₹2,249",
        nextBatch: "Starts 15 Dec",
        summary: "A desk lamp, sketched, modelled and built.",
        whatTheyBuild: "A desk lamp, sketched, modelled and built",
        image: "/images/tracks-product.png",
        kitIncluded: false,
        classSchedule: "90-min class, Sundays",
        location: "Banyan Grove School lab",
        seatsLeft: 8,
        demoDayPromise: "A functional CAD-modelled articulated desk lamp ready for 3D printing and assembly.",
        demoDayTests: [
          "CAD model passes slicing test with zero non-manifold errors",
          "Physical pivot joint holds position without slipping",
        ],
        weeklyPlan: [
          { week: 1, title: "Orthographic Sketching & Ergonomics", subtitle: "You'll have: 3 perspective sketches of desk lamp", tags: ["Top/Front/Side views", "Dimensioning", "Human factors"] },
          { week: 2, title: "Parametric 2D Profiles & Constrained Sketches", subtitle: "You'll have: Parametric CAD base profile", tags: ["Geometric constraints", "Fillets & chamfers", "Extrusion depths"] },
          { week: 3, title: "Articulated Hinges & Snap-Fit Tolerances", subtitle: "You'll have: Interlocking swivel joint CAD model", tags: ["Tolerances & clearances", "Revolving cuts", "Interference check"] },
          { week: 4, title: "Lamp Shade & Socket Architecture", subtitle: "You'll have: Complete shade and wire pathway", tags: ["Shelling & hollows", "Heat vents", "Wire channel clearance"] },
          { week: 5, title: "Render & 3D Slicing Optimization", subtitle: "You'll have: Photorealistic studio render & STL file", tags: ["Material rendering", "Infill percentages", "Print bed orientation"] },
          { week: 6, title: "Physical Assembly & Demo Day Defense", subtitle: "You'll have: Working physical model illuminated live", tags: ["Bolt assembly", "Switch check", "Peer showcase"] },
        ],
      },
      {
        id: "design-advanced",
        title: "Industrial Product Engineering",
        trackId: "design",
        trackName: "Product & 3D Design",
        grades: "Grades 9–11",
        minGrade: 9,
        maxGrade: 11,
        duration: "8 weeks",
        price: 5999,
        priceFormatted: "₹5,999",
        twoPartsPriceFormatted: "₹6,499",
        firstPartFormatted: "₹3,250",
        secondPartFormatted: "₹3,249",
        nextBatch: "Starts 6 Dec",
        summary: "Snap-fit joints, stress analysis, ergonomic handle contours, and multi-part product assemblies.",
        whatTheyBuild: "A working mechanical gadget prototype with functional moving linkages",
        image: "/images/tracks-product.png",
        kitIncluded: false,
        classSchedule: "90-min class, Sundays",
        location: "Banyan Grove School lab",
        seatsLeft: 5,
      },
    ],
  },
];

export const allCourses: Course[] = tracksData.flatMap((t) => t.courses);

export function getCourseById(id: string): Course {
  const normalized = id.toLowerCase().trim();
  const found = allCourses.find((c) => c.id.toLowerCase() === normalized);
  if (found) return found;

  const defaultCourse = tracksData[0]?.courses[0] ?? allCourses[0]!;

  // Handle common aliases
  if (normalized.includes("robot")) return tracksData[0]?.courses[0] ?? defaultCourse;
  if (normalized.includes("game")) return tracksData[3]?.courses[0] ?? defaultCourse;
  if (normalized.includes("sensor") || normalized.includes("electron")) return tracksData[1]?.courses[0] ?? defaultCourse;
  if (normalized.includes("ai") || normalized.includes("creator") || normalized.includes("study")) return tracksData[2]?.courses[0] ?? defaultCourse;
  if (normalized.includes("design") || normalized.includes("product") || normalized.includes("lamp")) return tracksData[4]?.courses[0] ?? defaultCourse;

  return defaultCourse;
}

export function getTrackById(id: string): Track {
  const normalized = id.toLowerCase().trim();
  const found = tracksData.find((t) => t.id === normalized || t.slug === normalized);
  return found ?? tracksData[0]!;
}
