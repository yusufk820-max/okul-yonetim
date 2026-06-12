import { useState, useRef, useEffect } from "react";

export default function Landing({ onLogin, onSetup, language = "tr", onLanguageChange }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [modal, setModal] = useState(null); // "iletisim" | "yardim" | null
  const starsRef = useRef(null);

  // Translation Helper
  const t = (key) => {
    const translations = {
      tr: {
        // NAV
        nasil: "Nasıl Çalışır",
        ozellikler: "Özellikler",
        fiyat: "Fiyat",
        sss: "SSS",
        kurumGirisi: "Kurum Girişi",
        okulKaydi: "Okul Kaydı",
        
        // HERO
        hero1: "Okulunuzun tüm görevleri",
        hero2: "tek ekranda",
        heroDesc: "TaskiPro ile okul yönetimi artık çok kolay: görevleri kategorilere ayırın, öğretmenlere atayın, önemli gün ve haftaları takip edin. Müdürler planlar, ekip uygular.",
        heroBtn1: "Okulunuzu Ücretsiz Kaydedin",
        heroBtn2: "Nasıl Çalışır? →",
        heroNote: "Kurulum gerektirmez",
        heroNote2: "Kurum koduyla saniyeler içinde giriş",
        
        // FEATURES
        feature1Title: "3 adımda okulunuz hazır",
        feature1Desc: "Başlayın, öğretmen ekleyin, görev verin. Hepsi bu kadar.",
        feature2Title: "Görev Takip Sistemi",
        feature2Desc: "Bekliyor, tamamlandı, gecikmiş — her görevin durumu renkli kartlarla anında görünür.",
        feature3Title: "Önemli Gün Hatırlatıcı",
        feature3Desc: "23 Nisan, 19 Mayıs, yıl sonu törenleri... Belirli gün ve haftalara kalan süre otomatik takip edilir.",
        feature4Title: "Gecikme Uyarısı",
        feature4Desc: "Tamamlanmayan görevler otomatik uyarı oluşturur, hiçbir şey unutulmaz.",
        
        // PRICING
        ucretSiz: "Ücretsiz",
        baslangic: "Başlangıç Planı",
        ucretSizBas: "2 dakikada kurulum, sonsuza kadar ücretsiz başlangıç planı.",
        ogretmenSay: "10 öğretmene kadar",
        kategoriGorev: "4 kategori, 25 aktif görev",
        kurumKodu: "Kurum kodu ile giriş",
        okulPlan: "Okul Planı",
        aylık: "₺99/Ay",
        ogretmen25: "25 öğretmene kadar",
        sınırlıKategori: "Sınırsız kategori ve görev",
        bildirim: "Öğretmene anlık bildirim 🔔",
        ozet: "Gecikme uyarıları ve özet panosu",
        destek: "E-posta desteği",
        okulPlus: "Okul+ Planı",
        aylık399: "₺399/Ay",
        ogretmen100: "100+ öğretmen",
        arşiv: "Geçmiş yıl arşivi",
        raporlar: "Dönemlik raporlar (PDF)",
        oncelikliDestek: "Öncelikli destek",
        basla: "Ücretsiz Başla",
        gecAl: "Okul Planına Geç",
        
        // FAQ
        faqTitle: "Sık Sorulan Sorular",
        faqDesc: "Merak ettiklerinizin yanıtlarını bulun",
        
        // FOOTER
        iletisim: "İletişim",
        yardimMerkezi: "Yardım Merkezi",
        telif: "© 2026 TaskiPro",
        haklar: "Tüm hakları saklıdır.",
        mail: "info@taskipro.com"
      },
      en: {
        // NAV
        nasil: "How It Works",
        ozellikler: "Features",
        fiyat: "Pricing",
        sss: "FAQ",
        kurumGirisi: "School Login",
        okulKaydi: "Register School",
        
        // HERO
        hero1: "All your school tasks",
        hero2: "on one screen",
        heroDesc: "With TaskiPro, school management is easy: organize tasks, assign to teachers, track important dates. Principals plan, teams execute.",
        heroBtn1: "Register Your School Free",
        heroBtn2: "How It Works? →",
        heroNote: "No setup required",
        heroNote2: "Login in seconds with school code",
        
        // FEATURES
        feature1Title: "Ready in 3 steps",
        feature1Desc: "Start, add teachers, assign tasks. That's it.",
        feature2Title: "Task Tracking System",
        feature2Desc: "Pending, completed, overdue — every task status is visible with colored cards instantly.",
        feature3Title: "Important Date Reminders",
        feature3Desc: "National holidays, celebrations, year-end events — automatic tracking ensures nothing is forgotten.",
        feature4Title: "Overdue Alerts",
        feature4Desc: "Unfinished tasks automatically trigger alerts so nothing slips through.",
        
        // PRICING
        ucretSiz: "Free",
        baslangic: "Starter Plan",
        ucretSizBas: "Setup in 2 minutes, free forever starter plan.",
        ogretmenSay: "Up to 10 teachers",
        kategoriGorev: "4 categories, 25 active tasks",
        kurumKodu: "School code login",
        okulPlan: "School Plan",
        aylık: "₺99/Month",
        ogretmen25: "Up to 25 teachers",
        sınırlıKategori: "Unlimited categories and tasks",
        bildirim: "Instant teacher notifications 🔔",
        ozet: "Overdue alerts & summary dashboard",
        destek: "Email support",
        okulPlus: "School+ Plan",
        aylık399: "₺399/Month",
        ogretmen100: "100+ teachers",
        arşiv: "Previous year archive",
        raporlar: "Term reports (PDF)",
        oncelikliDestek: "Priority support",
        basla: "Get Started Free",
        gecAl: "Upgrade to School Plan",
        
        // FAQ
        faqTitle: "Frequently Asked Questions",
        faqDesc: "Find answers to your questions",
        
        // FOOTER
        iletisim: "Contact",
        yardimMerkezi: "Help Center",
        telif: "© 2026 TaskiPro",
        haklar: "All rights reserved.",
        mail: "info@taskipro.com"
      }
    };
    return translations[language]?.[key] || translations["tr"][key] || key;
  };

  useEffect(() => {
    const c = starsRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let raf;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    const stars = [];
    for (let i = 0; i < 90; i++) {
      stars.push({ x: Math.random(), y: Math.random() * 0.5, r: Math.random() * 1.3 + 0.3, tw: Math.random() * Math.PI * 2, sp: Math.random() * 0.02 + 0.005 });
    }
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const s of stars) {
        if (!reduce) s.tw += s.sp;
        const a = 0.35 + Math.abs(Math.sin(s.tw)) * 0.5;
        ctx.fillStyle = `rgba(232,234,240,${a})`;
        ctx.fillRect(s.x * c.width - s.r / 2, s.y * c.height - s.r / 2, s.r, s.r);
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const C = { bg: "#0f1117", surface: "#181c27", card: "#1e2335", border: "#2a3050", accent: "#4f8ef7", accentSoft: "rgba(79,142,247,0.12)", green: "#34d399", purple: "#a78bfa", yellow: "#fbbf24", red: "#f87171", text: "#e8eaf0", textMuted: "#7a85a0", textDim: "#4a5270" };
  const faqItems = [
    { q: "TaskiPro nedir?", a: "TaskiPro, okullar için tasarlanmış görev takip ve yönetim sistemidir. Müdürler merkezi dashboard'dan görevleri yönetir, öğretmenlere atanır ve tüm süreci takip edilir." },
    { q: "Ne kadar malı?", a: "TaskiPro'nun üç planı vardır: Ücretsiz (10 öğretmen, 25 görev), Okul (25 öğretmen, ₺99/ay) ve Okul+ (100+ öğretmen, ₺399/ay)." },
    { q: "Kurulum kaç günü alır?", a: "2 dakikada başlayabilirsiniz. Okul bilgilerinizi girin, kurum kodu oluştur, öğretmenleri davet edin — hepsi bu kadar!" },
    { q: "Öğretmenler nasıl giriş yapıyor?", a: "Öğretmenler kurum kodunu ve şifrelerini girerek giriş yapıyorlar. Hiç başka kurulum gerekmez, sadece 30 saniyede hazır." },
  ];

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", overflow: "hidden" }}>
      <canvas ref={starsRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />
      
      <div className="tp-content">

        {/* NAV */}
        <nav>
          <div className="wrap nav-inner">
            <button className="logo" onClick={() => scrollTo("top")}>
              <span className="logo-icon">🏫</span>
              <span className="logo-text">Taski<span>Pro</span></span>
            </button>
            <ul className="nav-links">
              <li><button onClick={() => scrollTo("nasil")}>{t("nasil")}</button></li>
              <li><button onClick={() => scrollTo("ozellikler")}>{t("ozellikler")}</button></li>
              <li><button onClick={() => scrollTo("fiyat")}>{t("fiyat")}</button></li>
              <li><button onClick={() => scrollTo("sss")}>{t("sss")}</button></li>
            </ul>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => onLanguageChange && onLanguageChange("tr")} style={{ padding: "6px 12px", borderRadius: 8, border: language === "tr" ? "2px solid #4f8ef7" : "1px solid rgba(255,255,255,0.2)", background: language === "tr" ? "rgba(79,142,247,0.12)" : "transparent", color: language === "tr" ? "#4f8ef7" : "#e8eaf0", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>🇹🇷 TR</button>
                <button onClick={() => onLanguageChange && onLanguageChange("en")} style={{ padding: "6px 12px", borderRadius: 8, border: language === "en" ? "2px solid #4f8ef7" : "1px solid rgba(255,255,255,0.2)", background: language === "en" ? "rgba(79,142,247,0.12)" : "transparent", color: language === "en" ? "#4f8ef7" : "#e8eaf0", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>🇬🇧 EN</button>
              </div>
              <button className="btn-soft" onClick={onLogin}>{t("kurumGirisi")}</button>
              <button className="btn-grad" onClick={onSetup}>{t("okulKaydi")}</button>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section id="top">
          <div className="wrap hero-grid">
            <div>
              <span className="hero-badge">🎓 Okullar için görev takip sistemi</span>
              <h1>{t("hero1")} <span className="grad-text">{t("hero2")}</span></h1>
              <p className="hero-sub">
                {t("heroDesc")}
              </p>
              <div className="hero-actions">
                <button className="btn-grad btn-big" onClick={onSetup}>{t("heroBtn1")}</button>
                <button className="btn-soft btn-big" onClick={() => scrollTo("nasil")}>{t("heroBtn2")}</button>
              </div>
              <p className="hero-note"><span className="check">✓</span> {t("heroNote")} &nbsp;·&nbsp; <span className="check">✓</span> {t("heroNote2")}</p>
            </div>

            {/* APP MOCKUP */}
            <div className="mock-stage">
              <div className="float-chip chip1">✓ Görev tamamlandı</div>
              <div className="float-chip chip2">🔔 21 gün kaldı</div>
              <div className="app-card">
                <div className="app-head">
                  <div className="app-school">
                    <span className="app-school-icon">🏫</span>
                    <div>
                      <div className="app-school-name">Hanife Murat Ortaokulu</div>
                      <div className="app-school-sub">Okul Müdürü · 720691</div>
                    </div>
                  </div>
                  <span className="app-exit">Çıkış</span>
                </div>

                <h2 className="app-title">Genel Bakış</h2>
                <p className="app-subtitle">Hanife Murat Ortaokulu</p>

                <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 120, background: C.surface, padding: 16, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Tamamlanmış</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: C.green }}>12</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 120, background: C.surface, padding: 16, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Beklemede</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: C.accent }}>8</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 120, background: C.surface, padding: 16, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Gecikmiş</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: C.red }}>3</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="ozellikler">
          <div className="wrap">
            <h2>Neler Kazanırsınız?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>⚡ 3 Adımda Başlayın</h3>
                <p>{t("feature1Desc")}</p>
              </div>
              <div className="feature-card">
                <h3>📋 Görev Takip</h3>
                <p>{t("feature2Desc")}</p>
              </div>
              <div className="feature-card">
                <h3>🗓️ Önemli Gün Takibi</h3>
                <p>{t("feature3Desc")}</p>
              </div>
              <div className="feature-card">
                <h3>🔔 Gecikme Uyarısı</h3>
                <p>{t("feature4Desc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="fiyat">
          <div className="wrap">
            <h2>Planlarımız</h2>
            <div className="pricing-grid">
              <div className="pricing-card">
                <h4>{t("ucretSiz")}</h4>
                <p className="price">₺0</p>
                <p className="desc">{t("ucretSizBas")}</p>
                <ul>
                  <li>{t("ogretmenSay")}</li>
                  <li>{t("kategoriGorev")}</li>
                  <li>Görev atama</li>
                  <li>{t("kurumKodu")}</li>
                </ul>
                <button className="btn-soft btn-block">{t("basla")}</button>
              </div>

              <div className="pricing-card featured">
                <h4>{t("okulPlan")}</h4>
                <p className="price">{t("aylık")}</p>
                <ul>
                  <li>{t("ogretmen25")}</li>
                  <li>{t("sınırlıKategori")}</li>
                  <li>{t("bildirim")}</li>
                  <li>{t("ozet")}</li>
                </ul>
                <button className="btn-grad btn-block">{t("gecAl")}</button>
              </div>

              <div className="pricing-card">
                <h4>{t("okulPlus")}</h4>
                <p className="price">{t("aylık399")}</p>
                <ul>
                  <li>{t("ogretmen100")}</li>
                  <li>{t("raporlar")}</li>
                  <li>{t("arşiv")}</li>
                  <li>{t("oncelikliDestek")}</li>
                </ul>
                <button className="btn-soft btn-block">{t("gecAl")}</button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="sss">
          <div className="wrap">
            <h2>{t("faqTitle")}</h2>
            <p className="sec-desc">{t("faqDesc")}</p>
            <div className="faq-list">
              {faqItems.map((item, i) => (
                <div key={i} className="faq-item">
                  <button onClick={() => toggleFaq(i)} className="faq-q">
                    <span>{item.q}</span>
                    <span className={`arrow ${openFaq === i ? "open" : ""}`}>▸</span>
                  </button>
                  {openFaq === i && <div className="faq-a">{item.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <div className="wrap">
            <p>© 2026 TaskiPro — Tüm hakları saklıdır.</p>
            <p>İletişim: <a href="mailto:info@taskipro.com">info@taskipro.com</a></p>
          </div>
        </footer>
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Inter", -apple-system, sans-serif; background: ${C.bg}; color: ${C.text}; }
        .tp-content { position: relative; z-index: 1; }
        .wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        
        nav { background: rgba(15,17,23,0.7); backdrop-filter: blur(10px); border-bottom: 1px solid ${C.border}; position: sticky; top: 0; z-index: 100; }
        .nav-inner { display: flex; justify-content: space-between; align-items: center; height: 64px; }
        .logo { background: none; border: none; color: ${C.text}; cursor: pointer; font-size: 18px; font-weight: 900; display: flex; align-items: center; gap: 8px; transition: transform 0.2s; }
        .logo:hover { transform: scale(1.05); }
        .logo-icon { font-size: 24px; }
        .logo-text span { color: ${C.accent}; }
        .nav-links { display: flex; list-style: none; gap: 32px; }
        .nav-links button { background: none; border: none; color: ${C.textMuted}; cursor: pointer; font-size: 14px; transition: color 0.2s; }
        .nav-links button:hover { color: ${C.accent}; }
        
        section { padding: 80px 0; border-top: 1px solid ${C.border}; }
        section h2 { font-size: 36px; margin-bottom: 48px; text-align: center; }
        .sec-desc { text-align: center; color: ${C.textMuted}; margin-bottom: 40px; }
        
        .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }
        .hero-badge { display: inline-block; background: ${C.accentSoft}; color: ${C.accent}; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-bottom: 16px; }
        .hero-grid h1 { font-size: 48px; line-height: 1.2; margin-bottom: 20px; }
        .grad-text { background: linear-gradient(135deg, ${C.accent}, ${C.purple}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-sub { font-size: 16px; color: ${C.textMuted}; line-height: 1.6; margin-bottom: 24px; }
        .hero-actions { display: flex; gap: 16px; margin-bottom: 24px; }
        .btn-grad { background: linear-gradient(135deg, ${C.accent}, ${C.purple}); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: transform 0.2s; }
        .btn-grad:hover { transform: translateY(-2px); }
        .btn-soft { background: ${C.surface}; color: ${C.text}; border: 1px solid ${C.border}; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-soft:hover { border-color: ${C.accent}; color: ${C.accent}; }
        .btn-big { padding: 16px 32px; font-size: 16px; }
        .btn-block { width: 100%; margin-top: 20px; }
        .hero-note { font-size: 13px; color: ${C.textMuted}; }
        .check { color: ${C.green}; }
        
        .mock-stage { position: relative; }
        .float-chip { position: absolute; background: ${C.card}; border: 1px solid ${C.border}; padding: 12px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; backdrop-filter: blur(10px); }
        .chip1 { top: 20px; left: 20px; color: ${C.green}; }
        .chip2 { bottom: 40px; right: 30px; color: ${C.yellow}; }
        .app-card { background: ${C.card}; border: 1px solid ${C.border}; border-radius: 12px; padding: 20px; margin-top: 40px; }
        .app-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid ${C.border}; }
        .app-school { display: flex; gap: 12px; align-items: center; }
        .app-school-icon { font-size: 32px; }
        .app-school-name { font-weight: 700; }
        .app-school-sub { font-size: 12px; color: ${C.textMuted}; }
        .app-title { font-size: 20px; margin-bottom: 4px; }
        .app-subtitle { font-size: 12px; color: ${C.textMuted}; }
        
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; }
        .feature-card { background: ${C.surface}; border: 1px solid ${C.border}; padding: 32px; border-radius: 12px; transition: all 0.3s; }
        .feature-card:hover { transform: translateY(-4px); border-color: ${C.accent}; }
        .feature-card h3 { margin-bottom: 12px; font-size: 18px; }
        .feature-card p { color: ${C.textMuted}; line-height: 1.6; }
        
        .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
        .pricing-card { background: ${C.surface}; border: 1px solid ${C.border}; padding: 32px; border-radius: 12px; text-align: center; transition: all 0.3s; }
        .pricing-card.featured { border-color: ${C.accent}; transform: scale(1.05); }
        .pricing-card h4 { font-size: 20px; margin-bottom: 8px; }
        .price { font-size: 32px; font-weight: 900; color: ${C.accent}; margin-bottom: 8px; }
        .pricing-card ul { list-style: none; text-align: left; margin: 20px 0; font-size: 14px; color: ${C.textMuted}; }
        .pricing-card li { padding: 8px 0; border-bottom: 1px solid ${C.border}; }
        
        .faq-list { max-width: 700px; margin: 0 auto; }
        .faq-item { margin-bottom: 16px; border: 1px solid ${C.border}; border-radius: 8px; overflow: hidden; }
        .faq-q { width: 100%; background: ${C.surface}; border: none; padding: 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: ${C.text}; transition: all 0.2s; }
        .faq-q:hover { background: ${C.card}; }
        .arrow { transition: transform 0.3s; }
        .arrow.open { transform: rotate(90deg); }
        .faq-a { background: ${C.card}; padding: 16px; color: ${C.textMuted}; line-height: 1.6; border-top: 1px solid ${C.border}; }
        
        footer { background: ${C.surface}; border-top: 1px solid ${C.border}; padding: 40px 0; text-align: center; margin-top: 80px; }
        footer p { margin: 8px 0; font-size: 13px; color: ${C.textMuted}; }
        footer a { color: ${C.accent}; text-decoration: none; }
        
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr; }
          .hero-grid h1 { font-size: 32px; }
          .hero-actions { flex-direction: column; }
          .nav-links { gap: 16px; font-size: 12px; }
        }
      `}</style>
    </div>
  );
}
