import { useState, useRef, useEffect } from "react";

export default function Landing({ onLogin, onSetup, language = "tr", onLanguageChange }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [modal, setModal] = useState(null); // "iletisim" | "yardim" | null
  const starsRef = useRef(null);

  // Translation Helper
  const t = (key) => {
    const translations = {
      tr: {
        nasil: "Nasıl Çalışır",
        ozellikler: "Özellikler",
        fiyat: "Fiyat",
        sss: "SSS",
        kurumGirisi: "Kurum Girişi",
        okulKaydi: "Okul Kaydı",
        hero1: "Okulunuzun tüm görevleri",
        hero2: "tek ekranda",
        heroDesc: "TaskiPro ile okul yönetimi artık çok kolay: görevleri kategorilere ayırın, öğretmenlere atayın, önemli gün ve haftaları takip edin. Müdürler planlar, ekip uygular.",
        heroBtn1: "Okulunuzu Ücretsiz Kaydedin",
        heroBtn2: "Nasıl Çalışır? →",
        heroNote: "Kurulum gerektirmez",
        heroNote2: "Kurum koduyla saniyeler içinde giriş"
      },
      en: {
        nasil: "How It Works",
        ozellikler: "Features",
        fiyat: "Pricing",
        sss: "FAQ",
        kurumGirisi: "School Login",
        okulKaydi: "Register School",
        hero1: "All your school tasks",
        hero2: "on one screen",
        heroDesc: "With TaskiPro, school management is now easy: organize tasks by category, assign to teachers, and track important days. Principals plan, teams execute.",
        heroBtn1: "Register Your School Free",
        heroBtn2: "How It Works? →",
        heroNote: "No setup required",
        heroNote2: "Login in seconds with school code"
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
        ctx.beginPath();
        ctx.arc(s.x * c.width, s.y * c.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255," + a + ")";
        ctx.fill();
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
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="tp-root">
      <style>{CSS}</style>

      {/* AURORA ARKA PLAN */}
      <div className="aurora-bg" aria-hidden="true">
        <canvas ref={starsRef} className="aurora-stars" />
        <div className="curtain c1" />
        <div className="curtain c2" />
        <div className="curtain c3" />
        <div className="curtain c4" />
        <div className="curtain c5" />
        <div className="curtain c6" />
      </div>

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
        <header className="hero" id="top">
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

                <div className="stat-grid">
                  <div className="stat-box b"><div className="stat-n">4</div><div className="stat-l">Kategori</div></div>
                  <div className="stat-box v"><div className="stat-n">2</div><div className="stat-l">Toplam Görev</div></div>
                  <div className="stat-box g"><div className="stat-n">1</div><div className="stat-l">Tamamlanan</div></div>
                  <div className="stat-box r"><div className="stat-n">0</div><div className="stat-l">Gecikmiş</div></div>
                </div>

                <div className="app-sec-head">
                  <span className="app-sec-title">Yaklaşan Görevler</span>
                  <span className="app-link">Tümünü Gör →</span>
                </div>

                <div className="task-card">
                  <span className="task-medal">🏅</span>
                  <div className="task-info">
                    <div className="task-name">23 Nisan kutlamaları</div>
                    <div className="task-cat">Önemli Günler ve Haftalar</div>
                  </div>
                  <div className="task-status">
                    <span className="badge-wait">Bekliyor</span>
                    <div className="task-days">21g kaldı</div>
                  </div>
                </div>

                <div className="app-tabbar">
                  <div className="tab on"><span className="tab-ic">🏠</span> Ana Sayfa</div>
                  <div className="tab"><span className="tab-ic">📋</span> Görevler</div>
                  <div className="tab"><span className="tab-ic">👥</span> Öğretmenler</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* HOW IT WORKS */}
        <section id="nasil">
          <div className="wrap">
            <div className="sec-center">
              <span className="sec-pill">⚡ Nasıl Çalışır</span>
              <h2 className="sec-title">3 adımda okulunuz hazır</h2>
              <p className="sec-sub">Teknik bilgi gerekmez. Okulunuzu kaydedin, kodunuzu paylaşın, çalışmaya başlayın.</p>
            </div>
            <div className="steps-grid">
              <div className="step-card">
                <span className="step-num">1</span>
                <div className="step-icon si-grad">🏫</div>
                <h3 className="step-title">Okulunuzu kaydedin</h3>
                <p className="step-desc">Okul adınızı ve kurum kodunuzu girin. Hepsi bu kadar — e-posta doğrulama, uzun formlar yok.</p>
              </div>
              <div className="step-card">
                <span className="step-num">2</span>
                <div className="step-icon si-blue">🔑</div>
                <h3 className="step-title">Kodu ekibinizle paylaşın</h3>
                <p className="step-desc">Müdür yardımcıları ve öğretmenler kurum koduyla giriş yapar. Herkes kendi rolüne uygun ekranı görür.</p>
              </div>
              <div className="step-card">
                <span className="step-num">3</span>
                <div className="step-icon si-green">✅</div>
                <h3 className="step-title">Görevleri yönetin</h3>
                <p className="step-desc">Kategoriler oluşturun, görevleri atayın, son tarihleri belirleyin. Kim ne yapıyor, ne zaman bitiyor — tek bakışta görün.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="ozellikler" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sec-center">
              <span className="sec-pill">🧩 Özellikler</span>
              <h2 className="sec-title">Okul yönetiminin ihtiyacı olan her şey</h2>
              <p className="sec-sub">Karmaşık kurumsal yazılımlar değil — okullar için tasarlanmış, sade ve hızlı bir sistem.</p>
            </div>
            <div className="features-grid">
              <div className="feat-card c-blue"><span className="feat-emoji">📂</span><h3 className="feat-title">Kategori Sistemi</h3><p className="feat-desc">Görevleri "Önemli Günler ve Haftalar", "Tören Hazırlıkları", "Evrak İşleri" gibi kategorilere ayırın. Her şey yerli yerinde.</p></div>
              <div className="feat-card c-violet"><span className="feat-emoji">📋</span><h3 className="feat-title">Görev Takibi</h3><p className="feat-desc">Bekliyor, tamamlandı, gecikmiş — her görevin durumu renkli kartlarla anında görünür. Kalan gün sayısı otomatik hesaplanır.</p></div>
              <div className="feat-card c-green"><span className="feat-emoji">👥</span><h3 className="feat-title">Öğretmen Yönetimi</h3><p className="feat-desc">Öğretmenleri sisteme ekleyin, görevleri kişilere atayın. Kim hangi görevden sorumlu, herkes bilsin.</p></div>
              <div className="feat-card c-amber"><span className="feat-emoji">🗓️</span><h3 className="feat-title">Önemli Gün Hatırlatıcısı</h3><p className="feat-desc">23 Nisan, 19 Mayıs, yıl sonu törenleri... Belirli gün ve haftalara kalan süre otomatik takip edilir, hiçbir kutlama unutulmaz.</p></div>
              <div className="feat-card c-red"><span className="feat-emoji">🚨</span><h3 className="feat-title">Gecikme Uyarısı</h3><p className="feat-desc">Tarihi geçen görevler kırmızı ile işaretlenir ve panonun en üstüne taşınır. Sorunlar büyümeden görün.</p></div>
              <div className="feat-card c-indigo"><span className="feat-emoji">📱</span><h3 className="feat-title">Her Cihazda Çalışır</h3><p className="feat-desc">Telefon, tablet, bilgisayar — kurulum gerektirmez, tarayıcıdan açılır. Öğretmenler odasında da, evde de erişilebilir.</p></div>
            </div>
          </div>
        </section>

        {/* ROLES */}
        <section style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sec-center">
              <span className="sec-pill">🎭 Roller</span>
              <h2 className="sec-title">Herkesin kendi ekranı</h2>
            </div>
            <div className="roles">
              <div className="role-card rc1">
                <span className="role-emoji">👨‍💼</span>
                <h3 className="role-title">Okul Müdürü</h3>
                <p className="role-desc">Tüm okulun kontrol paneli sizde. Planlamayı yapın, gerisini sistem takip etsin.</p>
                <ul className="role-list">
                  <li>Kategori ve görev oluşturma</li>
                  <li>Öğretmenlere görev atama</li>
                  <li>Genel bakış istatistikleri</li>
                  <li>Gecikme ve durum raporları</li>
                </ul>
              </div>
              <div className="role-card rc2">
                <span className="role-emoji">👩‍🏫</span>
                <h3 className="role-title">Öğretmenler</h3>
                <p className="role-desc">Sadece sizi ilgilendiren görevleri görün. Sade, hızlı, kafa karıştırmayan bir ekran.</p>
                <ul className="role-list">
                  <li>Kendine atanan görevleri görme</li>
                  <li>Görev tamamlama bildirimi</li>
                  <li>Yaklaşan tarih hatırlatmaları</li>
                  <li>Tek tıkla kurum koduyla giriş</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CODE LOGIN */}
        <section className="code-sec">
          <div className="wrap code-grid">
            <div className="code-mock">
              <div className="code-mock-icon">🏫</div>
              <h3>Okul Yönetim</h3>
              <p className="code-mock-sub">Görev Takip Sistemi</p>
              <p className="code-label">KURUM KODU</p>
              <div className="code-input">Örn: 720691</div>
              <div className="code-btn">Devam Et →</div>
            </div>
            <div>
              <span className="sec-pill">🔑 Kurum Kodu</span>
              <h2 className="sec-title">Şifre yok, karmaşa yok.<br />Sadece bir kod.</h2>
              <ul className="code-points">
                <li><span className="cp-icon">⚡</span><div><b>Saniyeler içinde giriş</b><p>E-posta, şifre, doğrulama maili derdi yok. Kurum kodunu girin, çalışmaya başlayın.</p></div></li>
                <li><span className="cp-icon">🧑‍🏫</span><div><b>Öğretmen dostu</b><p>Teknolojiyle arası iyi olmayan personel bile ilk denemede giriş yapar. Eğitim gerekmez.</p></div></li>
                <li><span className="cp-icon">🔒</span><div><b>Okula özel alan</b><p>Her kurum kodu kendi izole alanını açar. Verileriniz yalnızca sizin okulunuza aittir.</p></div></li>
              </ul>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="fiyat">
          <div className="wrap">
            <div className="sec-center">
              <span className="sec-pill">💜 Fiyat</span>
              <h2 className="sec-title">Her okula uygun bir plan</h2>
              <p className="sec-sub">Okul başına tek yıllık ödeme — kullanıcı başı ücret yok. Eğitim-öğretim yılı boyunca geçerli.</p>
            </div>
            <div className="price-grid">
              <div className="price-card">
                <p className="price-name">🌱 Ücretsiz</p>
                <div className="price-num"><sup>₺</sup>0</div>
                <p className="price-per">sonsuza kadar ücretsiz</p>
                <ul className="price-feats">
                  <li>10 öğretmene kadar</li>
                  <li>4 kategori, 25 aktif görev</li>
                  <li>Görev atama ve durum takibi</li>
                  <li>Önemli gün hatırlatıcısı</li>
                  <li>Kurum kodu ile giriş</li>
                </ul>
                <button className="btn-soft" style={{ textAlign: "center" }} onClick={onSetup}>Ücretsiz Başla</button>
              </div>
              <div className="price-card feat">
                <span className="price-pop">⭐ En Popüler</span>
                <p className="price-name">🏫 Okul</p>
                <div className="price-num"><sup>₺</sup>2.990</div>
                <p className="price-per">okul / eğitim yılı</p>
                <ul className="price-feats">
                  <li>25 öğretmene kadar</li>
                  <li>Sınırsız kategori ve görev</li>
                  <li>Öğretmene anlık bildirim 🔔</li>
                  <li>Gecikme uyarıları ve özet panosu</li>
                  <li>E-posta desteği</li>
                </ul>
                <button className="btn-grad" style={{ textAlign: "center" }} onClick={onSetup}>Okul Planına Geç</button>
              </div>
              <div className="price-card">
                <p className="price-name">🚀 Okul+</p>
                <div className="price-num"><sup>₺</sup>5.990</div>
                <p className="price-per">okul / eğitim yılı</p>
                <ul className="price-feats">
                  <li>Sınırsız öğretmen</li>
                  <li>Okul planının tamamı dahil</li>
                  <li>Dönemlik raporlar (PDF)</li>
                  <li>Geçmiş yıl arşivi</li>
                  <li>Öncelikli destek</li>
                </ul>
                <button className="btn-soft" style={{ textAlign: "center" }} onClick={onSetup}>Okul+ Planına Geç</button>
              </div>
            </div>

            {/* COMPARISON TABLE */}
            <div className="compare-wrap">
              <table className="compare">
                <thead>
                  <tr>
                    <th>Özellik</th>
                    <th>🌱 Ücretsiz</th>
                    <th className="feat-col-h">🏫 Okul</th>
                    <th>🚀 Okul+</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Öğretmen sayısı</td><td className="cmp-val">10</td><td className="feat-col cmp-val">25</td><td className="cmp-val">Sınırsız</td></tr>
                  <tr><td>Görev / kategori limiti</td><td className="cmp-val">25 görev · 4 kategori</td><td className="feat-col cmp-val">Sınırsız</td><td className="cmp-val">Sınırsız</td></tr>
                  <tr><td>Görev atama ve durum takibi</td><td><span className="cmp-yes">✓</span></td><td className="feat-col"><span className="cmp-yes">✓</span></td><td><span className="cmp-yes">✓</span></td></tr>
                  <tr><td>Önemli gün hatırlatıcısı</td><td><span className="cmp-yes">✓</span></td><td className="feat-col"><span className="cmp-yes">✓</span></td><td><span className="cmp-yes">✓</span></td></tr>
                  <tr><td>Öğretmene bildirim (görev atandı / tarih yaklaşıyor)</td><td><span className="cmp-no">—</span></td><td className="feat-col"><span className="cmp-yes">✓</span></td><td><span className="cmp-yes">✓</span></td></tr>
                  <tr><td>Gecikme uyarıları ve özet panosu</td><td><span className="cmp-no">—</span></td><td className="feat-col"><span className="cmp-yes">✓</span></td><td><span className="cmp-yes">✓</span></td></tr>
                  <tr><td>Dönemlik rapor (PDF)</td><td><span className="cmp-no">—</span></td><td className="feat-col"><span className="cmp-no">—</span></td><td><span className="cmp-yes">✓</span></td></tr>
                  <tr><td>Geçmiş yıl arşivi</td><td><span className="cmp-no">—</span></td><td className="feat-col"><span className="cmp-no">—</span></td><td><span className="cmp-yes">✓</span></td></tr>
                  <tr><td>Destek</td><td className="cmp-val">Topluluk</td><td className="feat-col cmp-val">E-posta</td><td className="cmp-val">Öncelikli</td></tr>
                </tbody>
              </table>
            </div>
            <p className="price-note">Ödemeler havale/EFT ile yapılır, e-arşiv fatura kesilir. Plan süresi dolduğunda verileriniz silinmez; okul ücretsiz plana geçer ve mevcut tüm kayıtlarınız korunur.</p>
          </div>
        </section>

        {/* FAQ */}
        <section id="sss" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sec-center">
              <span className="sec-pill">❓ SSS</span>
              <h2 className="sec-title">Sık sorulan sorular</h2>
            </div>
            <div className="faq-list">
              {FAQS.map((f, i) => (
                <div key={i} className={"faq-item" + (openFaq === i ? " open" : "")}>
                  <div className="faq-q" onClick={() => toggleFaq(i)}>
                    {f.q}
                    <span className="faq-arrow">+</span>
                  </div>
                  <div className="faq-a"><div className="faq-a-in">{f.a}</div></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="cta-box">
              <h2>Okulunuzu bugün kaydedin 🎉</h2>
              <p>2 dakikada kurulum, sonsuza kadar ücretsiz başlangıç planı.</p>
              <button className="btn-white" onClick={onSetup}>Hemen Ücretsiz Başla →</button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <div className="wrap">
            <div className="foot-grid">
              <div>
                <button className="logo" onClick={() => scrollTo("top")}>
                  <span className="logo-icon">🏫</span>
                  <span className="logo-text">Taski<span>Pro</span></span>
                </button>
                <p className="foot-tag">Okullar için görev takip sistemi. Planlayın, atayın, takip edin.</p>
              </div>
              <div className="foot-col">
                <h4>Ürün</h4>
                <ul>
                  <li><button onClick={() => scrollTo("nasil")}>Nasıl Çalışır</button></li>
                  <li><button onClick={() => scrollTo("ozellikler")}>Özellikler</button></li>
                  <li><button onClick={() => scrollTo("fiyat")}>Fiyat</button></li>
                </ul>
              </div>
              <div className="foot-col">
                <h4>Destek</h4>
                <ul>
                  <li><button onClick={() => scrollTo("sss")}>SSS</button></li>
                  <li><button onClick={() => setModal("yardim")}>Yardım Merkezi</button></li>
                  <li><button onClick={() => setModal("iletisim")}>İletişim</button></li>
                </ul>
              </div>
              <div className="foot-col">
                <h4>Yasal</h4>
                <ul>
                  <li><button>Gizlilik Politikası</button></li>
                  <li><button>Kullanım Koşulları</button></li>
                  <li><button>KVKK</button></li>
                </ul>
              </div>
            </div>
            <div className="foot-bottom">
              <span>© 2026 TaskiPro · taskipro.com — Tüm hakları saklıdır.</span>
              <span>İletişim: <a href="mailto:info@taskipro.com" style={{ color:"#a78bfa", textDecoration:"none", fontWeight:700 }}>info@taskipro.com</a></span>
            </div>
          </div>
        </footer>

        {/* BİLGİ PENCERELERİ */}
        {modal && (
          <div onClick={() => setModal(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, zIndex:1000 }}>
            <div onClick={(e)=>e.stopPropagation()} style={{ background:"#161922", border:"1px solid rgba(148,163,213,0.18)", borderRadius:20, padding:28, maxWidth:420, width:"100%", maxHeight:"85vh", overflowY:"auto", color:"#e8eaf0", fontFamily:"'Nunito',system-ui,sans-serif" }}>
              {modal === "iletisim" ? (
                <>
                  <div style={{ fontSize:22, fontWeight:900, marginBottom:6 }}>İletişim</div>
                  <div style={{ fontSize:14, color:"#9ca3bd", lineHeight:1.7, marginBottom:20 }}>Sorularınız, talepleriniz ve destek ihtiyaçlarınız için bize her zaman ulaşabilirsiniz. En kısa sürede dönüş yapıyoruz.</div>
                  <div style={{ background:"#1e2230", borderRadius:14, padding:18, marginBottom:18 }}>
                    <div style={{ fontSize:12, color:"#5d6478", fontWeight:700, marginBottom:6 }}>E-POSTA</div>
                    <a href="mailto:info@taskipro.com" style={{ fontSize:16, fontWeight:800, color:"#a78bfa", textDecoration:"none" }}>info@taskipro.com</a>
                    <div style={{ fontSize:13, color:"#9ca3bd", marginTop:14, lineHeight:1.6 }}>Genel bilgi, teknik destek, plan ve ödeme işlemleri — hepsi bu adres üzerinden yürütülür.</div>
                  </div>
                  <div style={{ fontSize:13, color:"#7a85a0", lineHeight:1.7 }}>📍 Türkiye'deki okullar için geliştirilmiştir.<br/>🕐 Genellikle 1 iş günü içinde yanıt veriyoruz.</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize:22, fontWeight:900, marginBottom:6 }}>Yardım Merkezi</div>
                  <div style={{ fontSize:14, color:"#9ca3bd", lineHeight:1.7, marginBottom:20 }}>TaskiPro'yu kullanırken aklınıza takılanlar için hızlı rehber. Daha fazlası için SSS bölümüne göz atabilir ya da bize yazabilirsiniz.</div>
                  {[
                    ["🏫 Okul kaydı nasıl yapılır?", "Ana sayfadaki \"Okul Kaydı\" butonundan okul adınızı ve kurum kodunuzu girerek saniyeler içinde kaydolabilirsiniz."],
                    ["🔑 Öğretmenler nasıl giriş yapar?", "Müdür öğretmeni eklerken bir başlangıç şifresi verir. Öğretmen ilk girişte kendi şifresini belirler."],
                    ["📊 Performans raporu nerede?", "Yönetici panelindeki \"Performans Raporu\" bölümünden öğretmen bazlı dönemlik özetlere ulaşabilirsiniz (Okul+ planı)."],
                    ["💳 Plan nasıl yükseltilir?", "Panelde plan rozetine tıklayın, istediğiniz planı seçin ve havale bilgileriyle ödemenizi yapın."],
                  ].map(([q,a])=>(
                    <div key={q} style={{ background:"#1e2230", borderRadius:12, padding:14, marginBottom:10 }}>
                      <div style={{ fontSize:14, fontWeight:800, marginBottom:5 }}>{q}</div>
                      <div style={{ fontSize:13, color:"#9ca3bd", lineHeight:1.6 }}>{a}</div>
                    </div>
                  ))}
                  <div style={{ fontSize:13, color:"#7a85a0", lineHeight:1.7, marginTop:8 }}>Başka bir sorunuz mu var? <a href="mailto:info@taskipro.com" style={{ color:"#a78bfa", fontWeight:700, textDecoration:"none" }}>info@taskipro.com</a> adresinden bize yazın.</div>
                </>
              )}
              <button onClick={() => setModal(null)} style={{ width:"100%", marginTop:20, background:"linear-gradient(135deg,#4f8ef7,#7c3aed)", border:"none", color:"#fff", borderRadius:12, padding:12, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Kapat</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const FAQS = [
  { q: "Kurum kodu nedir, nasıl alırım?", a: "Okulunuzu kaydederken kendi belirlediğiniz (örneğin MEB kurum kodunuz olan) kodu girersiniz. Bu kod okulunuzun giriş kodu olur; herkes bu kodla okulunuzun alanına giriş yapar." },
  { q: "Öğretmenler için ayrı hesap açmak gerekiyor mu?", a: "Müdür yeni öğretmen eklediğinde onlara kullanıcı adı ve şifre tanımlar. Herkes kurum kodu + kullanıcı adı + şifresiyle giriş yapar — bu sayede her okulun verisi kendi alanında kalır." },
  { q: "Verilerimiz güvende mi?", a: "Her okulun verisi kendi kurum kodu altında izole tutulur ve güvenli altyapıda saklanır. KVKK uyumlu çalışıyoruz; verileriniz üçüncü taraflarla asla paylaşılmaz." },
  { q: "Telefondan kullanabilir miyim?", a: "Evet. TaskiPro tarayıcı üzerinden çalışır ve mobil uyumludur — telefon, tablet ve bilgisayarda aynı deneyimi sunar. Uygulama indirmenize gerek yoktur." },
  { q: "Yıllık planımın süresi dolunca ne olur?", a: "Hiçbir veriniz silinmez. Okulunuz otomatik olarak ücretsiz plana geçer; mevcut tüm görev, kategori ve öğretmen kayıtlarınız görünür kalır. Yalnızca ücretsiz plan limitlerinin üzerindeki yeni ekleme işlemleri durur. Süre dolmadan 30 gün önce panelinizde hatırlatma görürsünüz." },
  { q: "Ücretsiz plandan ücretli plana geçiş zor mu?", a: "Tek tık. Mevcut tüm görevleriniz, kategorileriniz ve öğretmen listeniz olduğu gibi korunur; sadece limitler kalkar. İstediğiniz zaman tekrar ücretsiz plana dönebilirsiniz." },
];

const CSS = `
  .tp-root *, .tp-root *::before, .tp-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .tp-root {
    --bg: #0E1015; --card: #1A1E2B; --card2: #20243345; --card-solid: #1E2230;
    --line: rgba(148,163,213,0.12); --line2: rgba(148,163,213,0.22);
    --text: #F1F3FA; --text2: #9CA3BD; --text3: #5D6478;
    --grad: linear-gradient(115deg, #5B7CFA 0%, #8B5CF6 55%, #A855F7 100%);
    --indigo: #6D7BFA; --violet: #A78BFA; --blue: #60A5FA; --green: #4ADE80; --red: #FB7185; --amber: #FBBF24;
    font-family: 'Nunito', system-ui, sans-serif;
    background: linear-gradient(to bottom, #0d0a1a 0%, #0a0d1a 55%, #0E1015 100%);
    color: var(--text); line-height: 1.6; position: relative; overflow: hidden;
  }
  .tp-root ::selection { background: #8B5CF6; color: white; }
  .tp-root .wrap { max-width: 1140px; margin: 0 auto; padding: 0 24px; }

  .aurora-bg { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
  .aurora-stars { position: absolute; inset: 0; width: 100%; height: 100%; }
  .curtain { position: absolute; top: -15%; height: 75%; filter: blur(55px); border-radius: 50%; will-change: transform, opacity; }
  .curtain.c1 { left:2%;  width:220px; background:linear-gradient(to bottom,rgba(52,211,153,0.5),rgba(52,211,153,0.2) 45%,transparent 80%); animation:sway1 15s ease-in-out infinite; }
  .curtain.c2 { left:20%; width:260px; background:linear-gradient(to bottom,rgba(34,211,238,0.5),rgba(124,58,237,0.22) 50%,transparent 82%); animation:sway2 19s ease-in-out infinite; }
  .curtain.c3 { left:40%; width:300px; background:linear-gradient(to bottom,rgba(167,139,250,0.55),rgba(124,58,237,0.25) 48%,transparent 80%); animation:sway3 17s ease-in-out infinite; }
  .curtain.c4 { left:58%; width:260px; background:linear-gradient(to bottom,rgba(74,222,128,0.45),rgba(34,211,238,0.2) 50%,transparent 82%); animation:sway4 21s ease-in-out infinite; }
  .curtain.c5 { left:74%; width:280px; background:linear-gradient(to bottom,rgba(124,58,237,0.5),rgba(167,139,250,0.2) 50%,transparent 80%); animation:sway5 16s ease-in-out infinite; }
  .curtain.c6 { left:88%; width:220px; background:linear-gradient(to bottom,rgba(52,211,153,0.42),rgba(34,211,238,0.16) 50%,transparent 80%); animation:sway6 18s ease-in-out infinite; }
  @keyframes sway1 {0%,100%{transform:translateX(0) scaleY(1) scaleX(1);opacity:.6}50%{transform:translateX(40px) scaleY(1.12) scaleX(.8);opacity:.9}}
  @keyframes sway2 {0%,100%{transform:translateX(0) scaleY(1) scaleX(1);opacity:.5}50%{transform:translateX(-35px) scaleY(1.18) scaleX(1.2);opacity:.8}}
  @keyframes sway3 {0%,100%{transform:translateX(0) scaleY(1) scaleX(1);opacity:.65}50%{transform:translateX(45px) scaleY(.9) scaleX(.85);opacity:.95}}
  @keyframes sway4 {0%,100%{transform:translateX(0) scaleY(1) scaleX(1);opacity:.45}50%{transform:translateX(-45px) scaleY(1.15) scaleX(1.1);opacity:.75}}
  @keyframes sway5 {0%,100%{transform:translateX(0) scaleY(1) scaleX(1);opacity:.55}50%{transform:translateX(38px) scaleY(1.1) scaleX(.9);opacity:.85}}
  @keyframes sway6 {0%,100%{transform:translateX(0) scaleY(1) scaleX(1);opacity:.45}50%{transform:translateX(-30px) scaleY(1.14) scaleX(1.15);opacity:.75}}
  @media (prefers-reduced-motion: reduce) { .tp-root .curtain { animation: none !important; } .tp-root .float-chip { animation: none; } }

  .tp-content { position: relative; z-index: 1; }

  .tp-root nav { position: sticky; top: 0; z-index: 100; background: rgba(13,10,26,0.8); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(120,120,160,0.15); }
  .tp-root .nav-inner { display: flex; align-items: center; justify-content: space-between; height: 70px; }
  .tp-root .logo { display: flex; align-items: center; gap: 12px; background: none; border: none; cursor: pointer; font-family: inherit; }
  .tp-root .logo-icon { width: 40px; height: 40px; border-radius: 12px; background: var(--grad); display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .tp-root .logo-text { font-weight: 900; font-size: 20px; color: var(--text); }
  .tp-root .logo-text span { color: var(--violet); }
  .tp-root .nav-links { display: flex; gap: 34px; list-style: none; }
  .tp-root .nav-links button { font-size: 15px; font-weight: 700; color: var(--text2); background: none; border: none; cursor: pointer; font-family: inherit; transition: color 0.2s; }
  .tp-root .nav-links button:hover { color: var(--text); }

  .tp-root .btn-grad { padding: 11px 26px; border-radius: 14px; background: var(--grad); color: white; font-family: inherit; font-size: 15px; font-weight: 800; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 8px 24px rgba(139,92,246,0.3); }
  .tp-root .btn-grad:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(139,92,246,0.45); }
  .tp-root .btn-soft { padding: 11px 26px; border-radius: 14px; background: rgba(30,35,53,0.6); border: 1px solid var(--line2); color: var(--text); font-family: inherit; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .tp-root .btn-soft:hover { border-color: var(--violet); color: var(--violet); }

  .tp-root .hero { position: relative; padding: 90px 0 70px; }
  .tp-root .hero-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 64px; align-items: center; position: relative; }
  .tp-root .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 7px 18px; border-radius: 100px; background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.3); color: var(--violet); font-size: 13px; font-weight: 800; margin-bottom: 24px; }
  .tp-root .hero h1 { font-weight: 900; font-size: clamp(36px, 5vw, 56px); line-height: 1.12; letter-spacing: -1px; margin-bottom: 20px; }
  .tp-root .hero h1 .grad-text { background: linear-gradient(135deg,#34d399,#22d3ee,#a78bfa); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .tp-root .hero-sub { font-size: 17px; font-weight: 500; color: var(--text2); max-width: 480px; line-height: 1.75; margin-bottom: 36px; }
  .tp-root .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 28px; }
  .tp-root .btn-big { padding: 15px 34px; font-size: 16px; border-radius: 16px; }
  .tp-root .hero-note { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--text3); }
  .tp-root .hero-note .check { color: var(--green); }

  .tp-root .mock-stage { position: relative; display: flex; justify-content: center; }
  .tp-root .app-card { width: 100%; max-width: 420px; background: #14161E; border: 1px solid var(--line2); border-radius: 28px; padding: 24px; box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(139,92,246,0.08); }
  .tp-root .app-head { display: flex; align-items: center; justify-content: space-between; background: var(--card); border-radius: 16px; padding: 14px 16px; margin-bottom: 24px; }
  .tp-root .app-school { display: flex; align-items: center; gap: 12px; }
  .tp-root .app-school-icon { width: 42px; height: 42px; border-radius: 12px; background: var(--grad); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .tp-root .app-school-name { font-weight: 800; font-size: 15px; color: var(--text); line-height: 1.3; }
  .tp-root .app-school-sub { font-size: 12px; font-weight: 600; color: var(--text3); }
  .tp-root .app-exit { font-size: 12px; font-weight: 700; color: var(--text2); padding: 7px 14px; border: 1px solid var(--line2); border-radius: 10px; }
  .tp-root .app-title { font-weight: 900; font-size: 26px; margin-bottom: 4px; }
  .tp-root .app-subtitle { font-size: 14px; font-weight: 600; color: var(--text3); margin-bottom: 20px; }
  .tp-root .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .tp-root .stat-box { background: var(--card); border-radius: 16px; padding: 18px; border-left: 4px solid; }
  .tp-root .stat-box.b { border-color: var(--blue); } .tp-root .stat-box.v { border-color: var(--violet); }
  .tp-root .stat-box.g { border-color: var(--green); } .tp-root .stat-box.r { border-color: var(--red); }
  .tp-root .stat-n { font-weight: 900; font-size: 30px; line-height: 1; margin-bottom: 6px; }
  .tp-root .stat-box.b .stat-n { color: var(--blue); } .tp-root .stat-box.v .stat-n { color: var(--violet); }
  .tp-root .stat-box.g .stat-n { color: var(--green); } .tp-root .stat-box.r .stat-n { color: var(--red); }
  .tp-root .stat-l { font-size: 13px; font-weight: 700; color: var(--text2); }
  .tp-root .app-sec-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
  .tp-root .app-sec-title { font-weight: 800; font-size: 16px; }
  .tp-root .app-link { font-size: 13px; font-weight: 700; color: var(--blue); }
  .tp-root .task-card { display: flex; align-items: center; gap: 12px; background: var(--card); border-radius: 14px; padding: 14px; }
  .tp-root .task-medal { width: 38px; height: 38px; border-radius: 11px; background: rgba(96,165,250,0.12); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .tp-root .task-info { flex: 1; min-width: 0; }
  .tp-root .task-name { font-weight: 800; font-size: 14px; color: var(--text); }
  .tp-root .task-cat { font-size: 12px; font-weight: 600; color: var(--text3); }
  .tp-root .task-status { text-align: right; flex-shrink: 0; }
  .tp-root .badge-wait { display: inline-block; font-size: 11px; font-weight: 800; color: var(--amber); background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.3); padding: 4px 10px; border-radius: 8px; }
  .tp-root .task-days { font-size: 11px; font-weight: 600; color: var(--text3); margin-top: 4px; }
  .tp-root .app-tabbar { display: flex; justify-content: space-around; background: var(--card); border-radius: 16px; padding: 12px; margin-top: 20px; }
  .tp-root .tab { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; color: var(--text3); }
  .tp-root .tab.on { color: var(--blue); }
  .tp-root .tab-ic { font-size: 18px; }

  .tp-root .float-chip { position: absolute; background: var(--card-solid); border: 1px solid var(--line2); border-radius: 14px; padding: 10px 16px; font-size: 13px; font-weight: 800; display: flex; align-items: center; gap: 8px; box-shadow: 0 16px 40px rgba(0,0,0,0.5); animation: floaty 5s ease-in-out infinite; z-index: 2; }
  @keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  .tp-root .chip1 { top: 8%; left: -12px; color: var(--green); }
  .tp-root .chip2 { bottom: 14%; right: -16px; color: var(--violet); animation-delay: 2.5s; }

  .tp-root section { padding: 88px 0; }
  .tp-root .sec-center { text-align: center; margin-bottom: 56px; }
  .tp-root .sec-pill { display: inline-block; padding: 6px 18px; border-radius: 100px; background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.25); color: var(--blue); font-size: 13px; font-weight: 800; margin-bottom: 18px; }
  .tp-root .sec-title { font-weight: 900; font-size: clamp(28px, 4vw, 42px); letter-spacing: -0.8px; line-height: 1.18; margin-bottom: 14px; }
  .tp-root .sec-sub { font-size: 16px; font-weight: 500; color: var(--text2); max-width: 560px; margin: 0 auto; line-height: 1.75; }

  .tp-root .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .tp-root .step-card { background: rgba(26,30,43,0.7); border: 1px solid var(--line); border-radius: 22px; padding: 32px 28px; position: relative; transition: all 0.25s; }
  .tp-root .step-card:hover { transform: translateY(-4px); border-color: var(--line2); }
  .tp-root .step-num { position: absolute; top: 24px; right: 28px; font-weight: 900; font-size: 40px; color: rgba(148,163,213,0.1); line-height: 1; }
  .tp-root .step-icon { width: 52px; height: 52px; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 20px; }
  .tp-root .si-grad { background: var(--grad); } .tp-root .si-blue { background: rgba(96,165,250,0.14); } .tp-root .si-green { background: rgba(74,222,128,0.12); }
  .tp-root .step-title { font-weight: 800; font-size: 18px; margin-bottom: 10px; }
  .tp-root .step-desc { font-size: 14px; font-weight: 500; color: var(--text2); line-height: 1.7; }

  .tp-root .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .tp-root .feat-card { background: rgba(26,30,43,0.7); border: 1px solid var(--line); border-radius: 22px; padding: 30px 26px; border-top: 4px solid; transition: transform 0.25s; }
  .tp-root .feat-card:hover { transform: translateY(-4px); }
  .tp-root .feat-card.c-blue { border-top-color: var(--blue); } .tp-root .feat-card.c-violet { border-top-color: var(--violet); }
  .tp-root .feat-card.c-green { border-top-color: var(--green); } .tp-root .feat-card.c-red { border-top-color: var(--red); }
  .tp-root .feat-card.c-amber { border-top-color: var(--amber); } .tp-root .feat-card.c-indigo { border-top-color: var(--indigo); }
  .tp-root .feat-emoji { font-size: 28px; margin-bottom: 16px; display: block; }
  .tp-root .feat-title { font-weight: 800; font-size: 17px; margin-bottom: 8px; }
  .tp-root .feat-desc { font-size: 14px; font-weight: 500; color: var(--text2); line-height: 1.7; }

  .tp-root .roles { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .tp-root .role-card { background: rgba(26,30,43,0.7); border: 1px solid var(--line); border-radius: 24px; padding: 38px 34px; position: relative; overflow: hidden; }
  .tp-root .role-card::before { content: ''; position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; border-radius: 50%; pointer-events: none; }
  .tp-root .role-card.rc1::before { background: radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%); }
  .tp-root .role-card.rc2::before { background: radial-gradient(circle, rgba(96,165,250,0.13), transparent 70%); }
  .tp-root .role-emoji { font-size: 34px; margin-bottom: 18px; display: block; }
  .tp-root .role-title { font-weight: 900; font-size: 22px; margin-bottom: 12px; }
  .tp-root .role-desc { font-size: 15px; font-weight: 500; color: var(--text2); line-height: 1.75; margin-bottom: 22px; }
  .tp-root .role-list { list-style: none; }
  .tp-root .role-list li { display: flex; gap: 10px; align-items: baseline; font-size: 14px; font-weight: 600; color: var(--text2); padding: 7px 0; }
  .tp-root .role-list li::before { content: '✓'; color: var(--green); font-weight: 900; flex-shrink: 0; }

  .tp-root .code-sec { background: var(--card2); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
  .tp-root .code-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
  .tp-root .code-mock { background: #14161E; border: 1px solid var(--line2); border-radius: 24px; padding: 40px 36px; max-width: 400px; box-shadow: 0 30px 80px rgba(0,0,0,0.5); }
  .tp-root .code-mock-icon { width: 64px; height: 64px; border-radius: 18px; background: var(--grad); display: flex; align-items: center; justify-content: center; font-size: 30px; margin: 0 auto 18px; }
  .tp-root .code-mock h3 { text-align: center; font-weight: 900; font-size: 22px; margin-bottom: 4px; }
  .tp-root .code-mock-sub { text-align: center; font-size: 13px; font-weight: 600; color: var(--text3); margin-bottom: 28px; }
  .tp-root .code-label { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: var(--text3); margin-bottom: 8px; }
  .tp-root .code-input { background: var(--card); border: 1px solid var(--line2); border-radius: 14px; padding: 16px; text-align: center; font-size: 20px; font-weight: 700; letter-spacing: 6px; color: var(--text3); margin-bottom: 16px; }
  .tp-root .code-btn { display: block; background: var(--grad); border-radius: 14px; padding: 15px; text-align: center; color: white; font-weight: 800; font-size: 16px; }
  .tp-root .code-points { list-style: none; margin-top: 30px; }
  .tp-root .code-points li { display: flex; gap: 16px; padding: 14px 0; align-items: flex-start; }
  .tp-root .cp-icon { width: 40px; height: 40px; border-radius: 12px; background: rgba(139,92,246,0.12); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .tp-root .code-points b { display: block; font-weight: 800; font-size: 16px; margin-bottom: 3px; }
  .tp-root .code-points p { font-size: 14px; font-weight: 500; color: var(--text2); line-height: 1.65; }

  .tp-root .price-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: stretch; }
  .tp-root .price-card { background: rgba(26,30,43,0.7); border: 1px solid var(--line); border-radius: 24px; padding: 36px 30px; display: flex; flex-direction: column; position: relative; }
  .tp-root .price-card.feat { border: 2px solid transparent; background: linear-gradient(var(--card), var(--card)) padding-box, var(--grad) border-box; }
  .tp-root .price-pop { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--grad); color: white; font-size: 12px; font-weight: 800; padding: 5px 18px; border-radius: 100px; white-space: nowrap; }
  .tp-root .price-name { font-weight: 800; font-size: 15px; color: var(--text2); margin-bottom: 14px; }
  .tp-root .price-num { font-weight: 900; font-size: 44px; line-height: 1; letter-spacing: -1px; }
  .tp-root .price-num sup { font-size: 20px; vertical-align: 18px; }
  .tp-root .price-per { font-size: 13px; font-weight: 600; color: var(--text3); margin: 8px 0 26px; }
  .tp-root .price-feats { list-style: none; flex: 1; margin-bottom: 28px; }
  .tp-root .price-feats li { display: flex; gap: 10px; align-items: baseline; font-size: 14px; font-weight: 600; color: var(--text2); padding: 8px 0; }
  .tp-root .price-feats li::before { content: '✓'; color: var(--green); font-weight: 900; flex-shrink: 0; }

  .tp-root .compare-wrap { margin-top: 56px; background: rgba(26,30,43,0.7); border: 1px solid var(--line); border-radius: 22px; overflow-x: auto; }
  .tp-root .compare { width: 100%; border-collapse: collapse; min-width: 640px; }
  .tp-root .compare th, .tp-root .compare td { padding: 16px 20px; text-align: center; font-size: 14px; border-bottom: 1px solid var(--line); }
  .tp-root .compare tr:last-child td { border-bottom: none; }
  .tp-root .compare th { font-weight: 800; font-size: 15px; color: var(--text); background: rgba(148,163,213,0.04); }
  .tp-root .compare th.feat-col-h { background: rgba(139,92,246,0.1); color: var(--violet); }
  .tp-root .compare td.feat-col { background: rgba(139,92,246,0.05); }
  .tp-root .compare td:first-child, .tp-root .compare th:first-child { text-align: left; font-weight: 700; color: var(--text2); }
  .tp-root .compare td { font-weight: 600; color: var(--text2); }
  .tp-root .cmp-yes { color: var(--green); font-weight: 900; font-size: 16px; }
  .tp-root .cmp-no { color: var(--text3); font-weight: 700; }
  .tp-root .cmp-val { color: var(--text); font-weight: 800; }
  .tp-root .price-note { text-align: center; font-size: 13px; font-weight: 600; color: var(--text3); margin-top: 20px; }

  .tp-root .faq-list { max-width: 720px; margin: 0 auto; }
  .tp-root .faq-item { background: rgba(26,30,43,0.7); border: 1px solid var(--line); border-radius: 18px; margin-bottom: 12px; overflow: hidden; }
  .tp-root .faq-q { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 24px; cursor: pointer; user-select: none; font-weight: 800; font-size: 16px; }
  .tp-root .faq-q:hover { color: var(--violet); }
  .tp-root .faq-arrow { font-size: 20px; color: var(--text3); transition: transform 0.25s; flex-shrink: 0; }
  .tp-root .faq-item.open .faq-arrow { transform: rotate(45deg); color: var(--violet); }
  .tp-root .faq-a { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
  .tp-root .faq-a-in { padding: 0 24px 22px; font-size: 15px; font-weight: 500; color: var(--text2); line-height: 1.8; }
  .tp-root .faq-item.open .faq-a { max-height: 320px; }

  .tp-root .cta-box { background: var(--grad); border-radius: 28px; padding: 64px 48px; text-align: center; position: relative; overflow: hidden; }
  .tp-root .cta-box::before { content: ''; position: absolute; top: -100px; right: -100px; width: 320px; height: 320px; border-radius: 50%; background: rgba(255,255,255,0.1); }
  .tp-root .cta-box::after { content: ''; position: absolute; bottom: -120px; left: -80px; width: 280px; height: 280px; border-radius: 50%; background: rgba(255,255,255,0.07); }
  .tp-root .cta-box h2 { font-weight: 900; font-size: clamp(26px, 4vw, 40px); color: white; margin-bottom: 14px; position: relative; letter-spacing: -0.5px; }
  .tp-root .cta-box p { font-size: 16px; font-weight: 600; color: rgba(255,255,255,0.85); margin-bottom: 34px; position: relative; }
  .tp-root .btn-white { padding: 15px 38px; border-radius: 16px; background: white; color: #6D28D9; font-family: inherit; font-size: 16px; font-weight: 900; transition: all 0.2s; position: relative; border: none; cursor: pointer; }
  .tp-root .btn-white:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,0,0,0.25); }

  .tp-root footer { border-top: 1px solid var(--line); padding: 56px 0 32px; }
  .tp-root .foot-grid { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 44px; }
  .tp-root .foot-tag { font-size: 14px; font-weight: 500; color: var(--text2); line-height: 1.7; margin-top: 14px; max-width: 260px; }
  .tp-root .foot-col h4 { font-size: 13px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: var(--text3); margin-bottom: 16px; }
  .tp-root .foot-col ul { list-style: none; }
  .tp-root .foot-col li { margin-bottom: 11px; }
  .tp-root .foot-col button { font-size: 14px; font-weight: 600; color: var(--text2); background: none; border: none; cursor: pointer; font-family: inherit; padding: 0; transition: color 0.2s; }
  .tp-root .foot-col button:hover { color: var(--violet); }
  .tp-root .foot-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 26px; border-top: 1px solid var(--line); font-size: 13px; font-weight: 600; color: var(--text3); flex-wrap: wrap; gap: 12px; }

  @media (max-width: 960px) {
    .tp-root .hero-grid { grid-template-columns: 1fr; gap: 48px; }
    .tp-root .steps-grid, .tp-root .features-grid, .tp-root .price-grid { grid-template-columns: 1fr 1fr; }
    .tp-root .roles { grid-template-columns: 1fr; }
    .tp-root .code-grid { grid-template-columns: 1fr; gap: 40px; }
    .tp-root .code-mock { margin: 0 auto; }
    .tp-root .foot-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 620px) {
    .tp-root .nav-links { display: none; }
    .tp-root .steps-grid, .tp-root .features-grid, .tp-root .price-grid { grid-template-columns: 1fr; }
    .tp-root .hero { padding: 56px 0 48px; }
    .tp-root section { padding: 60px 0; }
    .tp-root .float-chip { display: none; }
    .tp-root .cta-box { padding: 44px 24px; }
    .tp-root .hero-actions { flex-direction: column; }
  }
`;
