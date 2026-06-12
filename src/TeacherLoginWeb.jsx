import { useState, useRef, useEffect } from "react";
import { dbGet } from "./firebase";

export default function TeacherLoginWeb({ school, schoolCode, onLogin, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const starsRef = useRef(null);

  // ─── RENKLER ─────────────────────────────────────────────────
  const C = {
    bg: "#0f1117",
    surface: "#181c27",
    card: "#1e2335",
    border: "#2a3050",
    accent: "#4f8ef7",
    accentSoft: "rgba(79,142,247,0.12)",
    green: "#34d399",
    greenSoft: "rgba(52,211,153,0.12)",
    yellow: "#fbbf24",
    yellowSoft: "rgba(251,191,36,0.12)",
    red: "#f87171",
    redSoft: "rgba(248,113,113,0.12)",
    purple: "#a78bfa",
    purpleSoft: "rgba(167,139,250,0.12)",
    text: "#e8eaf0",
    textMuted: "#7a85a0",
    textDim: "#4a5270",
  };

  // Aurora arka plan
  useEffect(() => {
    const c = starsRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let raf;
    const resize = () => {
      c.width = c.offsetWidth;
      c.height = c.offsetHeight;
    };
    resize();
    const stars = [];
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random() * 0.5,
        r: Math.random() * 1.3 + 0.3,
        tw: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.02 + 0.005,
      });
    }
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const s of stars) {
        if (!reduce) s.tw += s.sp;
        const a = 0.35 + Math.abs(Math.sin(s.tw)) * 0.5;
        ctx.beginPath();
        ctx.arc(s.x * c.width, s.y * c.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255," + a + ")";
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleLogin = async () => {
    if (!username || !password) return;
    setLoading(true);
    setError("");
    try {
      const users = await dbGet(`schools/${schoolCode}/users`);
      if (!users) {
        setError("Kullanıcı bulunamadı.");
        setLoading(false);
        return;
      }
      const entry = Object.entries(users).find(
        ([, u]) => u.username === username.trim() && u.password === password && u.role === "teacher"
      );
      if (!entry) {
        setError("Kullanıcı adı veya şifre hatalı.");
        setLoading(false);
        return;
      }
      const [uid, userData] = entry;
      onLogin({
        role: userData.role,
        user: { id: uid, ...userData },
        school,
        schoolCode,
      });
    } catch (e) {
      setError("Giriş hatası: " + e.message);
    }
    setLoading(false);
  };

  const inp = {
    width: "100%",
    background: C.card,
    border: `1.5px solid ${C.border}`,
    borderRadius: 12,
    padding: "13px 16px",
    color: C.text,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  const lbl = {
    fontSize: 12,
    color: C.textMuted,
    marginBottom: 6,
    fontWeight: 600,
    display: "block",
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, position: "relative", overflow: "hidden", display: "flex" }}>
      {/* AURORA ARKA PLAN */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <canvas ref={starsRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "10%",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(167,139,250,0.4), transparent 70%)",
            filter: "blur(80px)",
            animation: "float 20s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30%",
            right: "-100px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(79,142,247,0.3), transparent 70%)",
            filter: "blur(80px)",
            animation: "float 15s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* HEADER */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          background: `linear-gradient(to bottom, ${C.surface}99, transparent)`,
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: `linear-gradient(135deg,${C.purple},${C.accent})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            🏫
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>TaskiPro</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>Okul Yönetim</div>
          </div>
        </div>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: C.textMuted,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ← Geri
        </button>
      </div>

      {/* CONTENT */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}
      >
        <div style={{ width: "100%", maxWidth: 500 }}>
          {/* FORM CARD */}
          <div
            style={{
              background: C.card,
              borderRadius: 20,
              padding: 40,
              border: `1px solid ${C.border}`,
              backdropFilter: "blur(10px)",
            }}
          >
            <div style={{ marginBottom: 32, textAlign: "center" }}>
              <div
                style={{
                  display: "inline-block",
                  background: C.purpleSoft,
                  border: `2px solid ${C.purple}33`,
                  borderRadius: 14,
                  padding: "10px 16px",
                  marginBottom: 20,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: C.purple }}>
                  👨‍🏫 Öğretmen
                </div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: C.text, marginBottom: 6 }}>
                Giriş Yapınız
              </div>
              <div style={{ fontSize: 13, color: C.textMuted }}>
                {school.name}
              </div>
            </div>

            {/* FORM */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Kullanıcı Adı */}
              <div>
                <label style={lbl}>KULLANICI ADI</label>
                <input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  placeholder="Öğretmen adınızı girin"
                  style={inp}
                />
              </div>

              {/* Şifre */}
              <div>
                <label style={lbl}>ŞİFRE</label>
                <div style={{ position: "relative" }}>
                  <input
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    style={inp}
                  />
                  <button
                    onClick={() => setShowPass((p) => !p)}
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: C.textMuted,
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    {showPass ? "Gizle" : "Göster"}
                  </button>
                </div>
              </div>

              {/* Hata Mesajı */}
              {error && (
                <div
                  style={{
                    background: C.redSoft,
                    border: `1px solid ${C.red}44`,
                    borderRadius: 10,
                    padding: "10px 12px",
                    fontSize: 13,
                    color: C.red,
                  }}
                >
                  ⚠ {error}
                </div>
              )}

              {/* Giriş Yap Butonu */}
              <button
                onClick={handleLogin}
                disabled={loading || !username || !password}
                style={{
                  background: `linear-gradient(135deg,${C.purple},${C.accent})`,
                  border: "none",
                  color: "#fff",
                  borderRadius: 12,
                  padding: 14,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: username && password ? "pointer" : "default",
                  marginTop: 8,
                  opacity: loading ? 0.7 : 1,
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  if (!loading && username && password) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </button>
            </div>

            {/* İPUCU */}
            <div
              style={{
                background: C.greenSoft,
                border: `1px solid ${C.green}44`,
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 12,
                color: C.green,
                marginTop: 18,
                textAlign: "center",
              }}
            >
              💡 Kullanıcı adı ve şifresi için okul yöneticisine başvurunuz.
            </div>
          </div>

          {/* ALT METIN */}
          <div
            style={{
              textAlign: "center",
              marginTop: 24,
              fontSize: 12,
              color: C.textMuted,
            }}
          >
            Sorun yaşıyorsanız →{" "}
            <a href="mailto:info@taskipro.com" style={{ color: C.purple, textDecoration: "none" }}>
              info@taskipro.com
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }
      `}</style>
    </div>
  );
}
