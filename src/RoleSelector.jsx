import { useState, useRef, useEffect } from "react";
import { dbGet } from "./firebase";

export default function RoleSelector({ onSelectRole, onBack }) {
  const [step, setStep] = useState("code"); // "code" | "role"
  const [code, setCode] = useState("");
  const [school, setSchool] = useState(null);
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

  const handleCodeSubmit = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data = await dbGet(`schools/${code.trim()}`);
      if (!data) {
        setError("Kurum kodu bulunamadı.");
        setLoading(false);
        return;
      }
      setSchool({ id: code.trim(), ...data });
      setStep("role");
    } catch (e) {
      setError("Bağlantı hatası. İnternet bağlantınızı kontrol edin.");
    }
    setLoading(false);
  };

  const handleSelectRole = (role) => {
    onSelectRole(role, { id: school.id, ...school }, code.trim());
  };

  const inp = {
    width: "100%",
    background: C.card,
    border: `1.5px solid ${C.border}`,
    borderRadius: 12,
    padding: "13px 16px",
    color: C.text,
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, position: "relative", overflow: "hidden" }}>
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
            background: "radial-gradient(circle, rgba(79,142,247,0.4), transparent 70%)",
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
            background: "radial-gradient(circle, rgba(167,139,250,0.3), transparent 70%)",
            filter: "blur(80px)",
            animation: "float 15s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* İçerik */}
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              background: "none",
              border: "none",
              color: C.textMuted,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ← Ana Sayfa
          </button>
        )}

        {step === "code" ? (
          // KURUM KODU ADIMI
          <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
            <div style={{ marginBottom: 32 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 24,
                  background: `linear-gradient(135deg,${C.accent},#7c3aed)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  margin: "0 auto 14px",
                }}
              >
                🏫
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.text, marginBottom: 8 }}>
                TaskiPro
              </div>
              <div style={{ fontSize: 13, color: C.textMuted }}>
                Okul Yönetim Sistemi
              </div>
            </div>

            <div
              style={{
                background: C.card,
                borderRadius: 20,
                padding: 28,
                border: `1px solid ${C.border}`,
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 6 }}>
                Kurum Kodunuzu Girin
              </div>
              <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 18 }}>
                Okulunuzun 6 haneli kodunu giriniz.
              </div>

              <div style={{ marginBottom: 6 }}>
                <label style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, display: "block", marginBottom: 6 }}>
                  KURUM KODU
                </label>
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleCodeSubmit()}
                  placeholder="Örn: 720691"
                  style={{
                    ...inp,
                    letterSpacing: 3,
                    fontSize: 18,
                    fontWeight: 700,
                    textAlign: "center",
                    marginBottom: 14,
                  }}
                />
              </div>

              {error && (
                <div
                  style={{
                    background: C.redSoft,
                    border: `1px solid ${C.red}44`,
                    borderRadius: 10,
                    padding: "9px 12px",
                    fontSize: 12,
                    color: C.red,
                    marginBottom: 14,
                  }}
                >
                  ⚠ {error}
                </div>
              )}

              <button
                onClick={handleCodeSubmit}
                disabled={loading}
                style={{
                  width: "100%",
                  background: `linear-gradient(135deg,${C.accent},#7c3aed)`,
                  border: "none",
                  color: "#fff",
                  borderRadius: 12,
                  padding: 13,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Kontrol ediliyor..." : "Devam Et →"}
              </button>
            </div>
          </div>
        ) : (
          // ROL SEÇİMİ ADIMI
          <div style={{ width: "100%", maxWidth: 700, textAlign: "center" }}>
            <div style={{ marginBottom: 32 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: C.accentSoft,
                  border: `1px solid ${C.accent}33`,
                  borderRadius: 16,
                  padding: "10px 18px",
                  marginBottom: 16,
                }}
              >
                <span style={{ fontSize: 20 }}>🏫</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.accent }}>
                    {school.name}
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>
                    {school.city} · {code}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 24, fontWeight: 900, color: C.text, marginBottom: 8 }}>
                Rol Seçiniz
              </div>
              <div style={{ fontSize: 13, color: C.textMuted }}>
                Giriş yapacağınız hesap türünü seçiniz.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              {/* MÜDÜR CARD */}
              <button
                onClick={() => handleSelectRole("admin")}
                style={{
                  background: C.card,
                  border: `2px solid ${C.border}`,
                  borderRadius: 16,
                  padding: 28,
                  cursor: "pointer",
                  transition: "all 0.3s",
                  color: "inherit",
                  fontSize: "inherit",
                  fontFamily: "inherit",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.accent;
                  e.currentTarget.style.background = C.accentSoft;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.background = C.card;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍💼</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 6 }}>
                  Okul Müdürü
                </div>
                <div style={{ fontSize: 12, color: C.textMuted }}>
                  Tüm görevleri ve öğretmenleri yönetme
                </div>
              </button>

              {/* ÖĞRETMEN CARD */}
              <button
                onClick={() => handleSelectRole("teacher")}
                style={{
                  background: C.card,
                  border: `2px solid ${C.border}`,
                  borderRadius: 16,
                  padding: 28,
                  cursor: "pointer",
                  transition: "all 0.3s",
                  color: "inherit",
                  fontSize: "inherit",
                  fontFamily: "inherit",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.purple;
                  e.currentTarget.style.background = C.purpleSoft;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.background = C.card;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍🏫</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 6 }}>
                  Öğretmen
                </div>
                <div style={{ fontSize: 12, color: C.textMuted }}>
                  Atanan görevleri takip etme
                </div>
              </button>
            </div>

            <button
              onClick={() => {
                setStep("code");
                setSchool(null);
                setCode("");
                setError("");
              }}
              style={{
                background: "none",
                border: "none",
                color: C.textMuted,
                fontSize: 12,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Kurum kodunu değiştir
            </button>
          </div>
        )}

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(30px); }
          }
        `}</style>
      </div>
    </div>
  );
}
