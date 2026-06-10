import { useState } from "react";

// ─── RENKLER (App.js ile aynı palet) ─────────────────────────
const C = {
  bg: "#0f1117", surface: "#181c27", card: "#1e2335", border: "#2a3050",
  accent: "#4f8ef7", accentSoft: "rgba(79,142,247,0.12)",
  green: "#34d399", greenSoft: "rgba(52,211,153,0.12)",
  yellow: "#fbbf24", yellowSoft: "rgba(251,191,36,0.12)",
  red: "#f87171", redSoft: "rgba(248,113,113,0.12)",
  purple: "#a78bfa", purpleSoft: "rgba(167,139,250,0.12)",
  text: "#e8eaf0", textMuted: "#7a85a0", textDim: "#4a5270",
};

const GRAD = `linear-gradient(135deg,${C.accent},#7c3aed)`;

// ─── KÜÇÜK PARÇALAR ──────────────────────────────────────────
function Pill({ children }) {
  return <span style={{ display:"inline-block", padding:"6px 16px", borderRadius:100, background:C.accentSoft, border:`1px solid ${C.accent}33`, color:C.accent, fontSize:12, fontWeight:700, marginBottom:16 }}>{children}</span>;
}

function SecHead({ pill, title, sub, center }) {
  return (
    <div style={{ textAlign:center?"center":"left", marginBottom:center?48:36, ...(center?{maxWidth:560,margin:"0 auto 48px"}:{}) }}>
      <Pill>{pill}</Pill>
      <div style={{ fontSize:32, fontWeight:900, color:C.text, lineHeight:1.18, letterSpacing:-0.5, marginBottom:12 }}>{title}</div>
      {sub && <div style={{ fontSize:15, color:C.textMuted, lineHeight:1.7 }}>{sub}</div>}
    </div>
  );
}

function FaqItem({ q, a, open, onClick }) {
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, marginBottom:10, overflow:"hidden" }}>
      <div onClick={onClick} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, padding:"18px 20px", cursor:"pointer" }}>
        <span style={{ fontWeight:700, fontSize:15, color:C.text }}>{q}</span>
        <span style={{ fontSize:20, color:open?C.accent:C.textDim, transform:open?"rotate(45deg)":"none", transition:"transform 0.2s", flexShrink:0 }}>+</span>
      </div>
      {open && <div style={{ padding:"0 20px 18px", fontSize:14, color:C.textMuted, lineHeight:1.7 }}>{a}</div>}
    </div>
  );
}

// ─── ÖZELLİK VERİSİ ──────────────────────────────────────────
const FEATURES = [
  { icon:"📂", title:"Kategori Sistemi", color:C.accent, desc:"Görevleri 'Önemli Günler', 'Evrak Teslimi', 'MEB Projeleri' gibi kategorilere ayırın. Her şey yerli yerinde." },
  { icon:"📋", title:"Görev Takibi", color:C.purple, desc:"Bekliyor, devam ediyor, tamamlandı, gecikmiş — her görevin durumu renkli kartlarla anında görünür." },
  { icon:"👥", title:"Öğretmen Yönetimi", color:C.green, desc:"Öğretmenleri ekleyin, görevleri kişilere atayın. Kim hangi görevden sorumlu, herkes bilir." },
  { icon:"🔔", title:"Hatırlatma Sistemi", color:C.yellow, desc:"Son teslime 5, 3, 1 gün kala otomatik hatırlatma. Hiçbir önemli gün veya teslim unutulmaz." },
  { icon:"🚨", title:"Gecikme Uyarısı", color:C.red, desc:"Tarihi geçen görevler kırmızı ile işaretlenir ve panonun üstüne taşınır. Sorunlar büyümeden görün." },
  { icon:"📱", title:"Her Cihazda", color:C.accent, desc:"Telefon, tablet, bilgisayar — kurulum gerektirmez, tarayıcıdan açılır. Öğretmenler odasında da, evde de." },
];

const FAQS = [
  { q:"Kurum kodu nedir, nasıl alırım?", a:"Okulunuzu kaydederken kendi belirlediğiniz (örneğin MEB kurum kodunuz olan) kodu girersiniz. Bu kod okulunuzun giriş kodu olur; öğretmen ve idare bu kodla sisteme girer." },
  { q:"Öğretmenler nasıl giriş yapar?", a:"Her kullanıcı kurum kodu, kullanıcı adı ve şifresiyle giriş yapar. Müdür yeni öğretmen eklediğinde onlara kullanıcı adı ve şifre tanımlar." },
  { q:"Verilerimiz güvende mi?", a:"Her okulun verisi kendi kurum kodu altında ayrı tutulur ve güvenli altyapıda saklanır. KVKK uyumlu çalışıyoruz; verileriniz üçüncü taraflarla paylaşılmaz." },
  { q:"Telefondan kullanabilir miyim?", a:"Evet. Sistem tarayıcı üzerinden çalışır ve mobil uyumludur — telefon, tablet ve bilgisayarda aynı deneyimi sunar. Uygulama indirmenize gerek yoktur." },
  { q:"Planımın süresi dolunca ne olur?", a:"Hiçbir veriniz silinmez. Okulunuz ücretsiz plana geçer; tüm görev, kategori ve öğretmen kayıtlarınız görünür kalır. Yalnızca ücretsiz plan limitlerinin üzerindeki yeni eklemeler durur." },
];

// ─── LANDING ─────────────────────────────────────────────────
export default function Landing({ onLogin, onSetup }) {
  const [faqOpen, setFaqOpen] = useState(0);

  const btnGrad = { background:GRAD, border:"none", color:"#fff", borderRadius:12, padding:"13px 26px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" };
  const btnSoft = { background:C.card, border:`1px solid ${C.border}`, color:C.text, borderRadius:12, padding:"13px 26px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", color:C.text, fontFamily:"'Segoe UI',system-ui,sans-serif" }}>

      {/* NAV */}
      <div style={{ position:"sticky", top:0, zIndex:50, background:"rgba(15,17,23,0.85)", backdropFilter:"blur(12px)", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:1080, margin:"0 auto", padding:"0 20px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🏫</div>
            <span style={{ fontWeight:900, fontSize:18 }}>Taski<span style={{ color:C.purple }}>Pro</span></span>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={onLogin} style={{ ...btnSoft, padding:"9px 18px", fontSize:14 }}>Kurum Girişi</button>
            <button onClick={onSetup} style={{ ...btnGrad, padding:"9px 18px", fontSize:14 }}>Okul Kaydı</button>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={{ maxWidth:1080, margin:"0 auto", padding:"72px 20px 56px", textAlign:"center", position:"relative" }}>
        <Pill>🎓 Okullar için görev takip sistemi</Pill>
        <div style={{ fontSize:46, fontWeight:900, lineHeight:1.1, letterSpacing:-1.5, maxWidth:760, margin:"0 auto 18px" }}>
          Okulunuzun tüm görevleri <span style={{ background:GRAD, WebkitBackgroundClip:"text", backgroundClip:"text", color:"transparent" }}>tek ekranda</span>
        </div>
        <div style={{ fontSize:17, color:C.textMuted, maxWidth:520, margin:"0 auto 32px", lineHeight:1.7 }}>
          Görevleri kategorilere ayırın, öğretmenlere atayın, önemli gün ve teslimleri takip edin. Müdür planlar, ekip uygular.
        </div>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:20 }}>
          <button onClick={onSetup} style={{ ...btnGrad, padding:"15px 32px", fontSize:16 }}>Okulunuzu Ücretsiz Kaydedin</button>
          <button onClick={onLogin} style={{ ...btnSoft, padding:"15px 32px", fontSize:16 }}>Kurum Girişi →</button>
        </div>
        <div style={{ fontSize:13, color:C.textDim, fontWeight:600 }}>
          <span style={{ color:C.green }}>✓</span> Kurulum gerektirmez &nbsp;·&nbsp; <span style={{ color:C.green }}>✓</span> Kurum koduyla saniyeler içinde giriş
        </div>

        {/* mini dashboard önizleme */}
        <div style={{ maxWidth:420, margin:"48px auto 0", background:"#14161e", border:`1px solid ${C.border}`, borderRadius:20, padding:20, textAlign:"left", boxShadow:"0 30px 70px rgba(0,0,0,0.5)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, background:C.card, borderRadius:12, padding:"10px 12px", marginBottom:16 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🏫</div>
            <div><div style={{ fontWeight:800, fontSize:13 }}>Hanife Murat Ortaokulu</div><div style={{ fontSize:11, color:C.textDim }}>Okul Müdürü · 720691</div></div>
          </div>
          <div style={{ fontSize:18, fontWeight:900, marginBottom:12 }}>Genel Bakış</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[{n:"4",l:"Kategori",c:C.accent},{n:"2",l:"Toplam Görev",c:C.purple},{n:"1",l:"Tamamlanan",c:C.green},{n:"0",l:"Gecikmiş",c:C.red}].map(s=>(
              <div key={s.l} style={{ background:C.card, borderRadius:12, padding:14, borderLeft:`4px solid ${s.c}` }}>
                <div style={{ fontSize:26, fontWeight:900, color:s.c, lineHeight:1 }}>{s.n}</div>
                <div style={{ fontSize:12, color:C.textMuted, fontWeight:700, marginTop:4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ÖZELLİKLER */}
      <div style={{ maxWidth:1080, margin:"0 auto", padding:"56px 20px" }}>
        <SecHead center pill="🧩 Özellikler" title="Okul yönetiminin ihtiyacı olan her şey" sub="Karmaşık kurumsal yazılımlar değil — okullar için tasarlanmış sade ve hızlı bir sistem." />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
          {FEATURES.map(f=>(
            <div key={f.title} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:"28px 24px", borderTop:`4px solid ${f.color}` }}>
              <div style={{ fontSize:28, marginBottom:14 }}>{f.icon}</div>
              <div style={{ fontWeight:800, fontSize:17, marginBottom:8 }}>{f.title}</div>
              <div style={{ fontSize:14, color:C.textMuted, lineHeight:1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FİYAT */}
      <div style={{ maxWidth:1080, margin:"0 auto", padding:"56px 20px" }}>
        <SecHead center pill="💜 Fiyat" title="Her okula uygun bir plan" sub="Okul başına tek yıllık ödeme — kullanıcı başı ücret yok. Eğitim-öğretim yılı boyunca geçerli." />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16, alignItems:"stretch" }}>

          {[
            { name:"🌱 Ücretsiz", price:"₺0", per:"sonsuza kadar ücretsiz", feats:["10 öğretmene kadar","4 kategori, 25 aktif görev","Görev atama ve durum takibi","Hatırlatma sistemi"], btn:"Ücretsiz Başla", feat:false },
            { name:"🏫 Okul", price:"₺2.990", per:"okul / eğitim yılı", feats:["25 öğretmene kadar","Sınırsız kategori ve görev","Öğretmene anlık bildirim 🔔","Gecikme uyarıları","E-posta desteği"], btn:"Okul Planına Geç", feat:true },
            { name:"🚀 Okul+", price:"₺5.990", per:"okul / eğitim yılı", feats:["Sınırsız öğretmen","Okul planının tamamı","Dönemlik raporlar (PDF)","Geçmiş yıl arşivi","Öncelikli destek"], btn:"Okul+ Planına Geç", feat:false },
          ].map(p=>(
            <div key={p.name} style={{ background:C.card, border:p.feat?`2px solid ${C.accent}`:`1px solid ${C.border}`, borderRadius:20, padding:"32px 26px", display:"flex", flexDirection:"column", position:"relative" }}>
              {p.feat && <div style={{ position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)", background:GRAD, color:"#fff", fontSize:12, fontWeight:800, padding:"4px 16px", borderRadius:100, whiteSpace:"nowrap" }}>⭐ En Popüler</div>}
              <div style={{ fontWeight:800, fontSize:15, color:C.textMuted, marginBottom:12 }}>{p.name}</div>
              <div style={{ fontSize:40, fontWeight:900, letterSpacing:-1, lineHeight:1, color:p.name.includes("Ücretsiz")?C.green:C.text }}>{p.price}</div>
              <div style={{ fontSize:13, color:C.textDim, fontWeight:600, margin:"8px 0 24px" }}>{p.per}</div>
              <div style={{ flex:1, marginBottom:24 }}>
                {p.feats.map(f=>(
                  <div key={f} style={{ display:"flex", gap:10, alignItems:"baseline", fontSize:14, color:C.textMuted, fontWeight:600, padding:"7px 0" }}>
                    <span style={{ color:C.green, fontWeight:900, flexShrink:0 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <button onClick={onSetup} style={p.feat?btnGrad:btnSoft}>{p.btn}</button>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", fontSize:13, color:C.textDim, fontWeight:600, marginTop:20, lineHeight:1.7 }}>
          Ödemeler havale/EFT ile yapılır, e-arşiv fatura kesilir. Plan süresi dolduğunda verileriniz silinmez; okul ücretsiz plana geçer ve tüm kayıtlarınız korunur.
        </div>
      </div>

      {/* SSS */}
      <div style={{ maxWidth:720, margin:"0 auto", padding:"56px 20px" }}>
        <SecHead center pill="❓ SSS" title="Sık sorulan sorular" />
        {FAQS.map((f,i)=>(
          <FaqItem key={i} q={f.q} a={f.a} open={faqOpen===i} onClick={()=>setFaqOpen(faqOpen===i?-1:i)} />
        ))}
      </div>

      {/* CTA */}
      <div style={{ maxWidth:1080, margin:"0 auto", padding:"0 20px 64px" }}>
        <div style={{ background:GRAD, borderRadius:24, padding:"56px 32px", textAlign:"center" }}>
          <div style={{ fontSize:34, fontWeight:900, color:"#fff", letterSpacing:-0.5, marginBottom:12 }}>Okulunuzu bugün kaydedin 🎉</div>
          <div style={{ fontSize:16, color:"rgba(255,255,255,0.85)", fontWeight:600, marginBottom:28 }}>2 dakikada kurulum, sonsuza kadar ücretsiz başlangıç planı.</div>
          <button onClick={onSetup} style={{ background:"#fff", border:"none", color:"#6d28d9", borderRadius:14, padding:"15px 36px", fontSize:16, fontWeight:900, cursor:"pointer", fontFamily:"inherit" }}>Hemen Ücretsiz Başla →</button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop:`1px solid ${C.border}`, padding:"32px 20px", textAlign:"center" }}>
        <div style={{ fontSize:13, color:C.textDim, fontWeight:600 }}>© 2026 TaskiPro · taskipro.com — Türkiye'de okullar için 💜 ile yapıldı</div>
      </div>

    </div>
  );
}
