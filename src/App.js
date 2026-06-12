import { useState, useEffect, useCallback } from "react";
import { dbGet, dbSet, dbPush, dbUpdate, dbDelete, dbListen } from "./firebase";
import Landing from "./Landing";
import RoleSelector from "./RoleSelector";
import AdminLoginWeb from "./AdminLoginWeb";
import TeacherLoginWeb from "./TeacherLoginWeb";

// ─── RENKLER ─────────────────────────────────────────────────
const C = {
  bg: "#0f1117", surface: "#181c27", card: "#1e2335", border: "#2a3050",
  accent: "#4f8ef7", accentSoft: "rgba(79,142,247,0.12)",
  green: "#34d399", greenSoft: "rgba(52,211,153,0.12)",
  yellow: "#fbbf24", yellowSoft: "rgba(251,191,36,0.12)",
  red: "#f87171", redSoft: "rgba(248,113,113,0.12)",
  purple: "#a78bfa", purpleSoft: "rgba(167,139,250,0.12)",
  text: "#e8eaf0", textMuted: "#7a85a0", textDim: "#4a5270",
};

// ... (Tüm STATUS, PRIORITY, PLANS vb constants aynen kalır - satır 16-49) ...

// ─── GİRİŞ ───────────────────────────────────────────────────
function LoginScreen({ onLogin, onSetup, onBack }) {
  // ... (Tüm mobil LoginScreen kodu aynen kalır - satır 143-221) ...
}

// ─── OKUL KAYIT ───────────────────────────────────────────────
function SchoolSetup({ onDone, onBack }) {
  // ... (Tüm mobil SchoolSetup kodu aynen kalır - satır 224-290) ...
}

// ... (Tüm Admin Panel, Teacher Panel, Report vb fonksiyonlar aynen kalır) ...

// ─── ANA UYGULAMA ─────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(() => {
    try { const s = localStorage.getItem("okul_session"); return s ? JSON.parse(s) : null; } catch { return null; }
  });

  // View State
  const [view, setView] = useState("landing");
  const [selectedRole, setSelectedRole] = useState(null); // "admin" | "teacher"
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);

  // Device Type Detection (768px = mobil/tablet sınırı)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelectRole = (role, school, code) => {
    setSelectedRole(role);
    setSelectedSchool(school);
    setSelectedCode(code);
    if (role === "admin") {
      setView("adminLoginWeb");
    } else {
      setView("teacherLoginWeb");
    }
  };

  const handleLogin = (s) => {
    setSession(s);
    try { localStorage.setItem("okul_session", JSON.stringify(s)); } catch {}
  };

  const handleLogout = () => {
    setSession(null);
    setView("landing");
    setSelectedRole(null);
    setSelectedSchool(null);
    setSelectedCode(null);
    try { localStorage.removeItem("okul_session"); } catch {}
  };

  // ─── SESSION KONTROLÜ ───────────────────────────
  // Giriş yapılmışsa direkt panele git
  if (session) {
    if (session.role === "teacher") return <TeacherPanel session={session} onLogout={handleLogout} />;
    return <AdminPanel session={session} onLogout={handleLogout} />;
  }

  // ─── DESKTOP WEB LOGIN SAYFASI ───────────────────────────
  if (!isMobile && view === "adminLoginWeb" && selectedSchool && selectedCode) {
    return (
      <AdminLoginWeb
        school={selectedSchool}
        schoolCode={selectedCode}
        onLogin={handleLogin}
        onBack={() => setView("roleSelect")}
      />
    );
  }

  if (!isMobile && view === "teacherLoginWeb" && selectedSchool && selectedCode) {
    return (
      <TeacherLoginWeb
        school={selectedSchool}
        schoolCode={selectedCode}
        onLogin={handleLogin}
        onBack={() => setView("roleSelect")}
      />
    );
  }

  // ─── DESKTOP WEB ROL SEÇİMİ ───────────────────────────
  if (!isMobile && view === "roleSelect") {
    return (
      <RoleSelector
        onSelectRole={handleSelectRole}
        onBack={() => setView("landing")}
      />
    );
  }

  // ─── MOBİL LOGIN SAYFASI (ESKI SİSTEM) ───────────────────────────
  if (isMobile && view === "login") {
    return <LoginScreen onLogin={handleLogin} onSetup={() => setView("setup")} onBack={() => setView("landing")} />;
  }

  if (isMobile && view === "setup") {
    return <SchoolSetup onDone={() => setView("login")} onBack={() => setView("landing")} />;
  }

  // ─── LANDING SAYFASI ───────────────────────────
  return (
    <Landing
      onLogin={() => setView(isMobile ? "login" : "roleSelect")}
      onSetup={() => setView("setup")}
    />
  );
}
