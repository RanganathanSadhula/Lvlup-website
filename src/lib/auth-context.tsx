"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface StudentProfile {
  id: string;
  fullName: string;
  parentUserId: string;
  schoolUid: string;
  schoolName?: string;
  currentGrade: number;
  section?: string;
  preferredTrack?: string;
  priorExperience?: string;
  isEnrolled?: boolean;
  activeEnrollment?: {
    id: string;
    status: string;
    currentLevel?: number;
    paymentPlan?: string;
  } | null;
}

export interface ParentUser {
  id: string;
  fullName?: string;
  username: string;
  email: string;
  phone: string;
  role: string;
}

interface AuthContextType {
  user: ParentUser | null;
  students: StudentProfile[];
  activeStudent: StudentProfile | null;
  isLoading: boolean;
  login: (identifier: string) => Promise<{ success: boolean; redirectTo: string; error?: string }>;
  signup: (payload: { fullName: string; email: string; phone: string; whatsappUpdates?: boolean }) => Promise<{ success: boolean; redirectTo: string; error?: string }>;
  loginWithGoogle: (payload?: { email?: string; name?: string }) => Promise<{ success: boolean; redirectTo: string; error?: string }>;
  logout: () => Promise<void>;
  addStudent: (studentData: { fullName: string; currentGrade: number; schoolName: string; preferredTrack?: string; priorExperience?: string }) => Promise<{ success: boolean; student?: StudentProfile; recommendedEnrollUrl?: string; error?: string }>;
  setActiveStudent: (student: StudentProfile | null) => void;
  refreshStudents: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = "thinkova_parent_profile";
const LOCAL_STORAGE_ACTIVE_STUDENT_KEY = "thinkova_active_student_profile";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ParentUser | null>(null);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [activeStudent, setActiveStudentState] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load active session from server and synchronize device localStorage
  const initSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setStudents(data.students || []);
          if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
          }

          // Restore active student from localStorage if available
          const savedActiveStudent = typeof window !== "undefined" ? localStorage.getItem(LOCAL_STORAGE_ACTIVE_STUDENT_KEY) : null;
          if (savedActiveStudent) {
            try {
              const parsed = JSON.parse(savedActiveStudent);
              const matched = (data.students || []).find((s: StudentProfile) => s.id === parsed.id);
              setActiveStudentState(matched || data.students?.[0] || null);
            } catch {
              setActiveStudentState(data.students?.[0] || null);
            }
          } else if (data.students?.length > 0) {
            setActiveStudentState(data.students[0]);
          }
          return;
        }
      }
    } catch (e) {
      console.warn("[Auth Context] Failed to fetch /api/auth/me:", e);
    }

    // Fallback: Check localStorage for device persistence
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setUser(parsed);
        } catch {
          setUser(null);
        }
      }
    }
  }, []);

  useEffect(() => {
    initSession().finally(() => setIsLoading(false));
  }, [initSession]);

  const setActiveStudent = (student: StudentProfile | null) => {
    setActiveStudentState(student);
    if (typeof window !== "undefined") {
      if (student) {
        localStorage.setItem(LOCAL_STORAGE_ACTIVE_STUDENT_KEY, JSON.stringify(student));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_ACTIVE_STUDENT_KEY);
      }
    }
  };

  const refreshStudents = async () => {
    try {
      const res = await fetch("/api/students", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.students) {
          setStudents(data.students);
        }
      }
    } catch (e) {
      console.warn("[Auth Context] Error refreshing students:", e);
    }
  };

  const login = async (identifier: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, redirectTo: "", error: data.error || "Login failed" };
      }
      setUser(data.user);
      setStudents(data.students || []);
      if (data.students?.length > 0) {
        setActiveStudent(data.students[0]);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
      }
      return { success: true, redirectTo: data.redirectTo || "/who-is-learning" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      return { success: false, redirectTo: "", error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (payload: { fullName: string; email: string; phone: string; whatsappUpdates?: boolean }) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, redirectTo: "", error: data.error || "Signup failed" };
      }
      setUser(data.user);
      setStudents([]);
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
      }
      return { success: true, redirectTo: data.redirectTo || "/tell-us-child" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      return { success: false, redirectTo: "", error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (payload?: { email?: string; name?: string }) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload || {}),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, redirectTo: "", error: data.error || "Google sign-in failed" };
      }
      setUser(data.user);
      setStudents(data.students || []);
      if (data.students?.length > 0) {
        setActiveStudent(data.students[0]);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
      }
      return { success: true, redirectTo: data.redirectTo || "/who-is-learning" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      return { success: false, redirectTo: "", error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore
    }
    setUser(null);
    setStudents([]);
    setActiveStudent(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      localStorage.removeItem(LOCAL_STORAGE_ACTIVE_STUDENT_KEY);
    }
    router.push("/login");
  };

  const addStudent = async (studentData: {
    fullName: string;
    currentGrade: number;
    schoolName: string;
    preferredTrack?: string;
    priorExperience?: string;
  }) => {
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Failed to save student profile" };
      }

      const newStudent: StudentProfile = {
        ...data.student,
        isEnrolled: false,
        activeEnrollment: null,
      };

      setStudents((prev) => [...prev, newStudent]);
      setActiveStudent(newStudent);

      return {
        success: true,
        student: newStudent,
        recommendedEnrollUrl: data.recommendedEnrollUrl,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      return { success: false, error: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        students,
        activeStudent,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        logout,
        addStudent,
        setActiveStudent,
        refreshStudents,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

