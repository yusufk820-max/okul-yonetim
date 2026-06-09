import { useState, useEffect, useCallback } from "react";
import { dbGet, dbSet, dbPush, dbUpdate, dbDelete, dbListen } from "./firebase";

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

const STATUS = {
  bekliyor:   { label: "Bekliyor",     color: C.yellow, bg: C.yellowSoft, dot: "●" },
  devam:      { label: "Devam Ediyor", color: C.accent, bg: C.accentSoft, dot: "●" },
  tamamlandı: { label: "Tamamlandı",   color: C.green,  bg: C.greenSoft,  dot: "✓" },
  gecikmiş:   { label: "Gecikmiş",     color: C.red,    bg: C.redSoft,    dot: "!" },
};

const PRIORITY = {
  yüksek: { label: "Yüksek", color: C.red },
  orta:   { label: "Orta",   color: C.yellow },
  düşük:  { label: "Düşük",  color: C.green },
};

const AVATAR_COLORS = [C.accent, C.purple, "#34d399", "#f97316", "#ec4899"];
const REMINDER_OPTS = [5, 4, 3, 2, 1];

// ─── YARDIMCILAR ─────────────────────────────────────────────
const fmtDate = d => { if (!d) return ""; const [y,m,day] = d.split("-"); return `${day}.${m}.${y}`; };
const daysLeft = d => { const n = new Date(); n.setHours(0,0,0,0); return Math.ceil((new Date(d)-n)/86400000); };
const fmtRDate = d => `${String(d.getDate()).padStart(2,"0")}.${String(d.getMonth()+1).padStart(2,"0")}.${d.getFullYear()}`;

function objToArr(obj) {
  if (!obj || typeof obj !== "object") return [];
  return Object.entries(obj).map(([id, val]) => ({ id, ...val }));
}

// ─── UI PARÇALARI ─────────────────────────────────────────────
function Avatar({ initials="?", size=38, idx=0 }) {
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  return <div style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(135deg,${color}33,${color}22)`, border:`1.5px solid ${color}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.3, fontWeight:700, color, flexShrink:0, fontFamily:"monospace" }}>{initials}</div>;
}

function AvatarStack({ ids=[], teachers=[], size=26 }) {
  const list = ids.map(id => teachers.find(t=>t.id===id)).filter(Boolean).slice(0,3);
  const rest = ids.length - 3;
  return <div style={{ display:"flex", alignItems:"center" }}>{list.map((t,i) => <div key={t.id} style={{ marginLeft:i===0?0:-7, zIndex:list.length-i }}><Avatar initials={t.avatar} size={size} idx={t.idx||0} /></div>)}{rest>0 && <div style={{ width:size, height:size, borderRadius:"50%", marginLeft:-7, background:C.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.28, fontWeight:700, color:C.textMuted }}>+{rest}</div>}</div>;
}

function Badge({ label, color, bg }) {
  return <span style={{ background:bg, color, border:`1px solid ${color}33`, borderRadius:6, padding:"2px 8px", fontSize:10, fontWeight:600, whiteSpace:"nowrap" }}>{label}</span>;
}

function Spinner() {
  return <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"80vh", gap:16 }}><div style={{ width:40, height:40, borderRadius:"50%", border:`3px solid ${C.border}`, borderTop:`3px solid ${C.accent}`, animation:"spin 0.8s linear infinite" }} /><div style={{ fontSize:14, color:C.textMuted }}>Yükleniyor...</div><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
}

function ReminderPicker({ dueDate, value=[], onChange }) {
  const toggle = d => onChange(value.includes(d) ? value.filter(x=>x!==d) : [...value,d]);
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div><div style={{ fontSize:13, fontWeight:700, color:C.text }}>🔔 Hatırlatma Günleri</div><div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>Son kaç gün önce bildirim gitsin?</div></div>
        {value.length>0 && <span style={{ fontSize:11, color:C.accent, background:C.accentSoft, borderRadius:6, padding:"2px 8px", fontWeight:700 }}>{value.length} aktif</span>}
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:dueDate&&value.length>0?12:0 }}>
        {REMINDER_OPTS.map(d => { const on=value.includes(d); return <div key={d} onClick={()=>toggle(d)} style={{ flex:1, textAlign:"center", padding:"10px 4px", background:on?C.accentSoft:C.surface, border:`1.5px solid ${on?C.accent:C.border}`, borderRadius:10, cursor:"pointer" }}><div style={{ fontSize:15, fontWeight:900, color:on?C.accent:C.textDim }}>{d}</div><div style={{ fontSize:9, color:on?C.accent:C.textDim, marginTop:2, fontWeight:600 }}>GÜN</div><div style={{ width:8, height:8, borderRadius:"50%", background:on?C.accent:"transparent", border:`1.5px solid ${on?C.accent:C.border}`, margin:"5px auto 0" }} /></div>; })}
      </div>
      {dueDate && value.length>0 && (
        <div style={{ background:C.surface, borderRadius:10, padding:"10px 12px" }}>
          <div style={{ fontSize:11, color:C.textMuted, fontWeight:600, marginBottom:8 }}>BİLDİRİM TAKVİMİ</div>
          {REMINDER_OPTS.filter(d=>value.includes(d)).sort((a,b)=>b-a).map(d => { const date=new Date(dueDate); date.setDate(date.getDate()-d); return <div key={d} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}><div style={{ width:6, height:6, borderRadius:"50%", background:d<=2?C.red:d<=3?C.yellow:C.accent }} /><span style={{ fontSize:12, color:C.textMuted, flex:1 }}>Son {d} gün önce</span><span style={{ fontSize:12, color:C.text, fontWeight:600 }}>{fmtRDate(date)}</span></div>; })}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:6, paddingTop:6, borderTop:`1px solid ${C.border}` }}><div style={{ width:6, height:6, borderRadius:"50%", background:C.red }} /><span style={{ fontSize:12, color:C.red, flex:1, fontWeight:600 }}>Son Teslim</span><span style={{ fontSize:12, color:C.red, fontWeight:700 }}>{fmtDate(dueDate)}</span></div>
        </div>
      )}
      {!dueDate && <div style={{ fontSize:12, color:C.textDim, textAlign:"center", padding:"6px 0" }}>Önce son tarihi belirleyin.</div>}
    </div>
  );
}

// ─── GİRİŞ ───────────────────────────────────────────────────
function LoginScreen({ onLogin, onSetup }) {
  const [step, setStep] = useState("code");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [school, setSchool] = useState(null);

  const handleCode = async () => {
    if (!code.trim()) return;
    setLoading(true); setError("");
    try {
      const data = await dbGet(`schools/${code.trim()}`);
      if (!data) { setError("Kurum kodu bulunamadı."); setLoading(false); return; }
      setSchool({ id: code.trim(), ...data });
      setStep("credentials");
    } catch(e) { setError("Bağlantı hatası. İnternet bağlantınızı kontrol edin."); }
    setLoading(false);
  };

  const handleLogin = async () => {
    if (!username || !password) return;
    setLoading(true); setError("");
    try {
      const users = await dbGet(`schools/${code.trim()}/users`);
      if (!users) { setError("Kullanıcı bulunamadı."); setLoading(false); return; }
      const entry = Object.entries(users).find(([,u]) => u.username===username.trim() && u.password===password);
      if (!entry) { setError("Kullanıcı adı veya şifre hatalı."); setLoading(false); return; }
      const [uid, userData] = entry;
      onLogin({ role: userData.role, user: { id:uid, ...userData }, school, schoolCode: code.trim() });
    } catch(e) { setError("Giriş hatası: " + e.message); }
    setLoading(false);
  };

  const inp = { width:"100%", background:"#1e2335", border:`1.5px solid ${C.border}`, borderRadius:12, padding:"13px 16px", color:C.text, fontSize:15, outline:"none", boxSizing:"border-box" };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ marginBottom:32, textAlign:"center" }}>
        <div style={{ width:72, height:72, borderRadius:22, background:`linear-gradient(135deg,${C.accent},#7c3aed)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 14px" }}>🏫</div>
        <div style={{ fontSize:22, fontWeight:900, color:C.text }}>Okul Yönetim</div>
        <div style={{ fontSize:13, color:C.textMuted, marginTop:4 }}>Görev Takip Sistemi</div>
      </div>
      <div style={{ width:"100%", maxWidth:340, background:C.card, borderRadius:22, padding:24, border:`1px solid ${C.border}` }}>
        {step==="code" ? (
          <>
            <div style={{ fontSize:15, fontWeight:800, color:C.text, marginBottom:6 }}>Kurumunuza Giriş</div>
            <div style={{ fontSize:13, color:C.textMuted, marginBottom:18 }}>Kurum kodunuzu girin.</div>
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:6, fontWeight:600 }}>KURUM KODU</div>
            <input value={code} onChange={e=>{setCode(e.target.value);setError("");}} onKeyDown={e=>e.key==="Enter"&&handleCode()} placeholder="Örn: 720691" style={{ ...inp, letterSpacing:3, fontSize:18, fontWeight:700, textAlign:"center", marginBottom:14 }} />
            {error && <div style={{ background:C.redSoft, border:`1px solid ${C.red}44`, borderRadius:10, padding:"9px 12px", fontSize:12, color:C.red, marginBottom:12 }}>⚠ {error}</div>}
            <button onClick={handleCode} disabled={loading} style={{ width:"100%", background:`linear-gradient(135deg,${C.accent},#7c3aed)`, border:"none", color:"#fff", borderRadius:12, padding:13, fontSize:15, fontWeight:700, cursor:"pointer", opacity:loading?0.7:1 }}>{loading?"Kontrol ediliyor...":"Devam Et →"}</button>
          </>
        ) : (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, background:C.accentSoft, borderRadius:12, padding:"10px 14px", border:`1px solid ${C.accent}33` }}>
              <span style={{ fontSize:20 }}>🏫</span>
              <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:800, color:C.accent }}>{school.name}</div><div style={{ fontSize:11, color:C.textMuted }}>{school.city} · {code}</div></div>
              <button onClick={()=>{setStep("code");setError("");setUsername("");setPassword("");}} style={{ background:"none", border:"none", color:C.textMuted, fontSize:18, cursor:"pointer" }}>×</button>
            </div>
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:6, fontWeight:600 }}>KULLANICI ADI</div>
            <input value={username} onChange={e=>{setUsername(e.target.value);setError("");}} placeholder="kullanici.adi" style={{ ...inp, marginBottom:12 }} />
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:6, fontWeight:600 }}>ŞİFRE</div>
            <div style={{ position:"relative", marginBottom:6 }}>
              <input value={password} onChange={e=>{setPassword(e.target.value);setError("");}} onKeyDown={e=>e.key==="Enter"&&handleLogin()} type={showPass?"text":"password"} placeholder="••••••••" style={inp} />
              <button onClick={()=>setShowPass(p=>!p)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:12 }}>{showPass?"Gizle":"Göster"}</button>
            </div>
            {error && <div style={{ background:C.redSoft, border:`1px solid ${C.red}44`, borderRadius:10, padding:"9px 12px", fontSize:12, color:C.red, margin:"10px 0" }}>⚠ {error}</div>}
            <button onClick={handleLogin} disabled={loading} style={{ width:"100%", background:`linear-gradient(135deg,${C.accent},#7c3aed)`, border:"none", color:"#fff", borderRadius:12, padding:13, fontSize:15, fontWeight:700, cursor:"pointer", marginTop:10, opacity:loading?0.7:1 }}>{loading?"Giriş yapılıyor...":"Giriş Yap"}</button>
          </>
        )}
      </div>
      <button onClick={onSetup} style={{ marginTop:16, background:"none", border:"none", color:C.textMuted, fontSize:12, cursor:"pointer", textDecoration:"underline" }}>Yeni okul kaydı için tıklayın</button>
    </div>
  );
}

// ─── OKUL KAYIT ───────────────────────────────────────────────
function SchoolSetup({ onDone }) {
  const [form, setForm] = useState({ schoolCode:"", schoolName:"", city:"", adminName:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const ok = form.schoolCode && form.schoolName && form.city && form.adminName;

  const handleSetup = async () => {
    if (!ok||loading) return;
    setLoading(true); setError("");
    try {
      const existing = await dbGet(`schools/${form.schoolCode}`);
      if (existing) { setError("Bu kurum kodu zaten kayıtlı."); setLoading(false); return; }
      await dbSet(`schools/${form.schoolCode}`, {
        name: form.schoolName, city: form.city, createdAt: new Date().toISOString(),
        users: { admin1: { username:"mudur", password:"okul1234", role:"admin", name:form.adminName, title:"Okul Müdürü" } },
        categories: {
          evrak:  { title:"Evrak Teslimi",            icon:"📂", color:"#4f8ef7", order:1 },
          onemli: { title:"Önemli Günler ve Haftalar", icon:"🏅", color:"#f97316", order:2 },
          meb:    { title:"MEB / İl-İlçe Projeleri",  icon:"🎯", color:"#a78bfa", order:3 },
        }
      });
      setSuccess(true);
    } catch(e) { setError("Kayıt hatası: " + e.message); }
    setLoading(false);
  };

  const inp = { width:"100%", background:"#1e2335", border:`1.5px solid ${C.border}`, borderRadius:12, padding:"13px 16px", color:C.text, fontSize:14, outline:"none", boxSizing:"border-box" };
  const lbl = { fontSize:12, color:C.textMuted, marginBottom:6, fontWeight:600, display:"block" };

  if (success) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:340, background:C.card, borderRadius:22, padding:28, border:`1px solid ${C.border}`, textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🎉</div>
        <div style={{ fontSize:18, fontWeight:800, color:C.green, marginBottom:12 }}>Okul Kaydedildi!</div>
        <div style={{ background:C.surface, borderRadius:12, padding:14, marginBottom:20, textAlign:"left" }}>
          <div style={{ fontSize:12, color:C.textMuted, marginBottom:8 }}>GİRİŞ BİLGİLERİNİZ</div>
          <div style={{ fontSize:14, color:C.text }}>Kurum Kodu: <strong style={{ color:C.accent }}>{form.schoolCode}</strong></div>
          <div style={{ fontSize:14, color:C.text, marginTop:4 }}>Kullanıcı: <strong style={{ color:C.accent }}>mudur</strong></div>
          <div style={{ fontSize:14, color:C.text, marginTop:4 }}>Şifre: <strong style={{ color:C.accent }}>okul1234</strong></div>
        </div>
        <button onClick={onDone} style={{ width:"100%", background:`linear-gradient(135deg,${C.accent},#7c3aed)`, border:"none", color:"#fff", borderRadius:12, padding:13, fontSize:15, fontWeight:700, cursor:"pointer" }}>Giriş Yap →</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ fontSize:20, fontWeight:900, color:C.text, marginBottom:4 }}>Yeni Okul Kaydı</div>
      <div style={{ fontSize:13, color:C.textMuted, marginBottom:24 }}>Okulunuzu sisteme ekleyin</div>
      <div style={{ width:"100%", maxWidth:340, background:C.card, borderRadius:22, padding:24, border:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div><label style={lbl}>Kurum Kodu</label><input value={form.schoolCode} onChange={e=>set("schoolCode",e.target.value)} placeholder="Örn: 720691" style={{ ...inp, letterSpacing:2, textAlign:"center", fontWeight:700 }} /></div>
          <div><label style={lbl}>Okul Adı</label><input value={form.schoolName} onChange={e=>set("schoolName",e.target.value)} placeholder="Atatürk İlkokulu" style={inp} /></div>
          <div><label style={lbl}>İl / İlçe</label><input value={form.city} onChange={e=>set("city",e.target.value)} placeholder="Bursa / Osmangazi" style={inp} /></div>
          <div><label style={lbl}>Müdür Adı Soyadı</label><input value={form.adminName} onChange={e=>set("adminName",e.target.value)} placeholder="Ahmet Yılmaz" style={inp} /></div>
          {error && <div style={{ background:C.redSoft, border:`1px solid ${C.red}44`, borderRadius:10, padding:"9px 12px", fontSize:12, color:C.red }}>⚠ {error}</div>}
          <button onClick={handleSetup} disabled={!ok||loading} style={{ background:`linear-gradient(135deg,${C.accent},#7c3aed)`, border:"none", color:"#fff", borderRadius:12, padding:13, fontSize:15, fontWeight:700, cursor:ok?"pointer":"default", opacity:ok?1:0.5 }}>{loading?"Kaydediliyor...":"Okulu Kaydet →"}</button>
          <button onClick={onDone} style={{ background:"none", border:"none", color:C.textMuted, fontSize:13, cursor:"pointer", textDecoration:"underline" }}>← Geri dön</button>
        </div>
      </div>
    </div>
  );
}

// ─── YÖNETİCİ PANELİ ─────────────────────────────────────────
function AdminPanel({ session, onLogout }) {
  const { user, school, schoolCode } = session;
  const [screen, setScreen] = useState("dashboard");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selTeacher, setSelTeacher] = useState(null);
  const [selTask, setSelTask] = useState(null);
  const [selCat, setSelCat] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, color=C.green) => { setToast({msg,color}); setTimeout(()=>setToast(null),2500); };

  const reload = useCallback(async () => {
    try {
      const d = await dbGet(`schools/${schoolCode}`);
      setData(d);
      setLoading(false);
    } catch {}
  }, [schoolCode]);

  useEffect(() => {
    reload();
    const unsub = dbListen(`schools/${schoolCode}`, d => { setData(d); setLoading(false); });
    return unsub;
  }, [schoolCode, reload]);

  const teachers = data ? objToArr(data.teachers).map((t,i) => ({...t, idx:i})) : [];
  const categories = data?.categories ? Object.entries(data.categories)
    .sort((a,b)=>(a[1].order||0)-(b[1].order||0))
    .map(([id,cat]) => ({ id, ...cat, tasks: objToArr(cat.tasks||{}) })) : [];
  const allTasks = categories.flatMap(c => c.tasks);
  const currentCat = selCat ? categories.find(c=>c.id===selCat.id) : null;

  const findCat = tid => categories.find(c=>c.tasks.some(t=>t.id===tid));

  const handleStatus = async (taskId, status) => {
    const cat = findCat(taskId); if (!cat) return;
    await dbUpdate(`schools/${schoolCode}/categories/${cat.id}/tasks/${taskId}`, { status });
    setSelTask(p => p ? {...p, status} : p);
    showToast(`Durum "${STATUS[status].label}" olarak güncellendi`);
    reload();
  };

  const handleReminder = async (taskId, days) => {
    const cat = findCat(taskId); if (!cat) return;
    await dbUpdate(`schools/${schoolCode}/categories/${cat.id}/tasks/${taskId}`, { reminderDays: days });
    setSelTask(p => p ? {...p, reminderDays:days} : p);
    showToast("Hatırlatma takvimi güncellendi 🔔");
  };

  const handleCheck = async (taskId, completedTeacherIds) => {
    const cat = findCat(taskId); if (!cat) return;
    await dbUpdate(`schools/${schoolCode}/categories/${cat.id}/tasks/${taskId}`, { completedTeacherIds });
    setSelTask(p => p ? {...p, completedTeacherIds} : p);
    reload();
  };

  const handleAddTask = async (catId, form) => {
    await dbPush(`schools/${schoolCode}/categories/${catId}/tasks`, { ...form, status:"bekliyor", completedTeacherIds:[], createdAt:new Date().toISOString() });
    showToast(`Görev ${form.teacherIds.length} öğretmene atandı! 🔔`);
    reload();
  };

  const handleDelTask = async (catId, taskId) => {
    await dbDelete(`schools/${schoolCode}/categories/${catId}/tasks/${taskId}`);
    showToast("Alt görev silindi.", C.red);
    reload();
  };

  const handleAddTeacher = async (form) => {
    const initials = form.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
    const tid = await dbPush(`schools/${schoolCode}/teachers`, { ...form, avatar:initials });
    await dbSet(`schools/${schoolCode}/users/${tid}`, { username:form.username, password:form.password, role:"teacher", name:form.name, teacherId:tid });
    showToast(`${form.name} eklendi!`);
    setScreen("teachers");
    reload();
  };

  const handleDelTeacher = async (id) => {
    await dbDelete(`schools/${schoolCode}/teachers/${id}`);
    await dbDelete(`schools/${schoolCode}/users/${id}`);
    showToast("Öğretmen silindi.", C.red);
    reload();
  };

  const handleAddCat = async (form) => {
    const id = "cat_" + Date.now();
    const order = categories.length + 1;
    await dbSet(`schools/${schoolCode}/categories/${id}`, { title: form.title, icon: form.icon, color: form.color, order });
    showToast(`"${form.title}" kategorisi eklendi!`);
    setScreen("tasks");
    reload();
  };

  const handleDelCat = async (catId) => {
    await dbDelete(`schools/${schoolCode}/categories/${catId}`);
    showToast("Kategori silindi.", C.red);
    setScreen("tasks");
    reload();
  };

  if (loading) return <div style={{ background:C.bg, minHeight:"100vh" }}><Spinner /></div>;

  const tabs = [
    { id:"dashboard", label:"Ana Sayfa", icon:"⊞" },
    { id:"tasks",     label:"Görevler",  icon:"📋" },
    { id:"teachers",  label:"Öğretmenler", icon:"👥" },
  ];

  return (
    <div style={{ maxWidth:390, margin:"0 auto", background:C.bg, minHeight:"100vh", fontFamily:"'Segoe UI',system-ui,sans-serif", color:C.text }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"12px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:`linear-gradient(135deg,${C.accent},#7c3aed)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>🏫</div>
          <div><div style={{ fontSize:13, fontWeight:800, color:C.text }}>{school.name}</div><div style={{ fontSize:10, color:C.textMuted }}>{user.title} · {schoolCode}</div></div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {allTasks.filter(t=>t.status==="gecikmiş").length>0 && <div style={{ background:C.redSoft, border:`1px solid ${C.red}44`, borderRadius:20, padding:"3px 9px", fontSize:10, color:C.red, fontWeight:700 }}>🔔 {allTasks.filter(t=>t.status==="gecikmiş").length} Gecikmiş</div>}
          <button onClick={onLogout} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.textMuted, borderRadius:8, padding:"4px 10px", fontSize:11, cursor:"pointer" }}>Çıkış</button>
        </div>
      </div>

      <div style={{ paddingTop:16 }}>
        {screen==="dashboard"     && <Dashboard cats={categories} teachers={teachers} allTasks={allTasks} school={school} onNav={setScreen} onTask={t=>{setSelTask(t);setScreen("taskDetail");}} onCat={c=>{setSelCat(c);setScreen("catDetail");}} />}
        {screen==="tasks"         && <TaskList cats={categories} teachers={teachers} onTask={t=>{setSelTask(t);setScreen("taskDetail");}} onNav={setScreen} onCat={c=>setSelCat(c)} onAddCat={()=>setScreen("addCat")} />}
        {screen==="addCat"        && <AddCategory onAdd={handleAddCat} onBack={()=>setScreen("tasks")} />}
        {screen==="catDetail"     && currentCat && <CatDetail cat={currentCat} teachers={teachers} onBack={()=>setScreen("tasks")} onNav={setScreen} onTask={t=>{setSelTask(t);setScreen("taskDetail");}} onDel={handleDelTask} onDelCat={handleDelCat} />}
        {screen==="addTask"       && currentCat && <AddTask cat={currentCat} teachers={teachers} onAdd={handleAddTask} onBack={()=>setScreen("catDetail")} />}
        {screen==="taskDetail"    && selTask     && <TaskDetail task={selTask} teachers={teachers} cats={categories} onBack={()=>setScreen("tasks")} onStatus={handleStatus} onReminder={handleReminder} onCheck={handleCheck} />}
        {screen==="teachers"      && <TeacherList teachers={teachers} allTasks={allTasks} onSel={t=>{setSelTeacher(t);setScreen("teacherDetail");}} onNav={setScreen} />}
        {screen==="addTeacher"    && <AddTeacher onAdd={handleAddTeacher} onBack={()=>setScreen("teachers")} />}
        {screen==="teacherDetail" && selTeacher  && <TeacherDetail teacher={selTeacher} cats={categories} onBack={()=>setScreen("teachers")} onNav={setScreen} onTask={t=>{setSelTask(t);setScreen("taskDetail");}} onDel={handleDelTeacher} />}
      </div>

      {toast && <div style={{ position:"fixed", bottom:80, left:"50%", transform:"translateX(-50%)", background:toast.color, color:"#fff", borderRadius:12, padding:"10px 18px", fontSize:13, fontWeight:600, boxShadow:"0 4px 20px rgba(0,0,0,0.4)", zIndex:100, whiteSpace:"nowrap" }}>{toast.msg}</div>}

      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:390, background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex" }}>
        {tabs.map(tab => {
          const active = screen===tab.id||(tab.id==="tasks"&&["taskDetail","catDetail","addTask","addCat"].includes(screen))||(tab.id==="teachers"&&["teacherDetail","addTeacher"].includes(screen));
          return <button key={tab.id} onClick={()=>setScreen(tab.id)} style={{ flex:1, background:"none", border:"none", padding:"10px 0 12px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}><span style={{ fontSize:20, filter:active?"none":"grayscale(1) opacity(0.5)" }}>{tab.icon}</span><span style={{ fontSize:10, color:active?C.accent:C.textDim, fontWeight:active?700:400 }}>{tab.label}</span></button>;
        })}
      </div>
      <div style={{ height:64 }} />
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────
function Dashboard({ cats, teachers, allTasks, school, onNav, onTask, onCat }) {
  const stats = [
    { label:"Kategori",     value:cats.length,                                    color:C.accent },
    { label:"Toplam Görev", value:allTasks.length,                                color:C.purple },
    { label:"Tamamlanan",   value:allTasks.filter(t=>t.status==="tamamlandı").length, color:C.green },
    { label:"Gecikmiş",     value:allTasks.filter(t=>t.status==="gecikmiş").length,   color:C.red },
  ];
  const urgent = allTasks.filter(t=>t.status!=="tamamlandı").sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate)).slice(0,4);
  return (
    <div style={{ padding:"0 16px 24px" }}>
      <div style={{ marginBottom:20 }}><div style={{ fontSize:22, fontWeight:800, color:C.text }}>Genel Bakış</div><div style={{ fontSize:13, color:C.textMuted, marginTop:2 }}>{school.name}</div></div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:22 }}>
        {stats.map(s=><div key={s.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 16px", borderLeft:`3px solid ${s.color}` }}><div style={{ fontSize:24, fontWeight:900, color:s.color }}>{s.value}</div><div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{s.label}</div></div>)}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ fontSize:14, fontWeight:700, color:C.text }}>Yaklaşan Görevler</div>
        <button onClick={()=>onNav("tasks")} style={{ background:"none", border:"none", color:C.accent, fontSize:12, cursor:"pointer", fontWeight:600 }}>Tümünü Gör →</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:22 }}>
        {urgent.length===0&&<div style={{ textAlign:"center", color:C.textMuted, fontSize:13, padding:20 }}>Bekleyen görev yok 🎉</div>}
        {urgent.map(task=>{const sc=STATUS[task.status];const dl=daysLeft(task.dueDate);const cat=cats.find(c=>c.tasks.some(t=>t.id===task.id));return(<div key={task.id} onClick={()=>onTask(task)} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"11px 14px", cursor:"pointer", display:"flex", gap:10, alignItems:"center" }}><div style={{ fontSize:20 }}>{cat?.icon}</div><div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:13, fontWeight:600, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{task.title}</div><div style={{ fontSize:11, color:C.textMuted, marginTop:1 }}>{cat?.title}</div></div><div style={{ textAlign:"right", flexShrink:0 }}><Badge label={sc.label} color={sc.color} bg={sc.bg}/><div style={{ fontSize:10, color:dl<0?C.red:dl<=3?C.yellow:C.textMuted, marginTop:3, fontWeight:600 }}>{dl<0?`${Math.abs(dl)}g geçti`:dl===0?"Bugün!":`${dl}g kaldı`}</div></div></div>);})}
      </div>
      <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:10 }}>Kategoriler</div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {cats.map(cat=>{const done=cat.tasks.filter(t=>t.status==="tamamlandı").length;const pct=cat.tasks.length>0?Math.round((done/cat.tasks.length)*100):0;return(<div key={cat.id} onClick={()=>onCat(cat)} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"13px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}><div style={{ width:40, height:40, borderRadius:12, background:`${cat.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{cat.icon}</div><div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:700, color:C.text }}>{cat.title}</div><div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{done}/{cat.tasks.length} tamamlandı</div><div style={{ height:4, background:C.border, borderRadius:2, marginTop:6, overflow:"hidden" }}><div style={{ height:"100%", width:`${pct}%`, background:cat.color, borderRadius:2 }}/></div></div><div style={{ color:C.textDim, fontSize:18 }}>›</div></div>);})}
      </div>
    </div>
  );
}


// ─── KATEGORİ EKLE ────────────────────────────────────────────
const CAT_ICONS = ["📂","🏅","🎯","📝","🏆","📌","🎓","📊","🔔","📅","🌟","📋","🎨","🔧","📣"];
const CAT_COLORS = ["#4f8ef7","#f97316","#a78bfa","#34d399","#f87171","#fbbf24","#ec4899","#06b6d4","#84cc16","#f59e0b"];

function AddCategory({ onAdd, onBack }) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("📂");
  const [color, setColor] = useState("#4f8ef7");
  const [saving, setSaving] = useState(false);
  const ok = title.trim().length > 0;
  const inp = { width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 13px", color:C.text, fontSize:14, outline:"none", boxSizing:"border-box" };
  const lbl = { fontSize:12, color:C.textMuted, marginBottom:6, fontWeight:600, display:"block" };
  return (
    <div style={{ padding:"0 16px 24px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:C.accent, fontSize:14, cursor:"pointer", marginBottom:16, padding:0, fontWeight:600 }}>← Geri</button>
      <div style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:20 }}>Yeni Kategori Ekle</div>

      {/* Önizleme */}
      <div style={{ background:C.card, borderRadius:14, padding:14, border:`1px solid ${color}44`, borderLeft:`4px solid ${color}`, marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:44, height:44, borderRadius:12, background:`${color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{icon}</div>
        <div><div style={{ fontSize:15, fontWeight:800, color:C.text }}>{title||"Kategori Adı"}</div><div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>0 alt görev</div></div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <div><label style={lbl}>Kategori Adı</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Örn: Veli İletişimi" style={inp}/></div>

        <div>
          <label style={lbl}>İkon Seç</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {CAT_ICONS.map(ic=><button key={ic} onClick={()=>setIcon(ic)} style={{ width:42, height:42, fontSize:20, borderRadius:10, background:icon===ic?`${color}22`:C.surface, border:`2px solid ${icon===ic?color:C.border}`, cursor:"pointer" }}>{ic}</button>)}
          </div>
        </div>

        <div>
          <label style={lbl}>Renk Seç</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {CAT_COLORS.map(cl=><button key={cl} onClick={()=>setColor(cl)} style={{ width:32, height:32, borderRadius:"50%", background:cl, border:`3px solid ${color===cl?"#fff":cl}`, boxShadow:color===cl?"0 0 0 2px "+cl:"none", cursor:"pointer" }}/>)}
          </div>
        </div>

        <button onClick={async()=>{if(!ok||saving)return;setSaving(true);await onAdd({title:title.trim(),icon,color});setSaving(false);}} style={{ background:color, border:"none", color:"#fff", borderRadius:14, padding:"14px 0", fontSize:15, fontWeight:700, cursor:ok?"pointer":"default", opacity:ok?1:0.4 }}>
          {saving?"Ekleniyor...":"Kategoriyi Ekle"}
        </button>
      </div>
    </div>
  );
}

// ─── GÖREV LİSTESİ ────────────────────────────────────────────
function TaskList({ cats, teachers, onTask, onNav, onCat, onAddCat }) {
  const [exp, setExp] = useState({});
  const toggle = id => setExp(p=>({...p,[id]:p[id]===false}));
  return (
    <div style={{ padding:"0 16px 24px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ fontSize:22, fontWeight:800, color:C.text }}>Görevler</div>
        <button onClick={onAddCat} style={{ background:C.accent, border:"none", color:"#fff", borderRadius:10, padding:"7px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}>+ Kategori</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {cats.map(cat=>{const isOpen=exp[cat.id]!==false;const late=cat.tasks.filter(t=>t.status==="gecikmiş").length;const done=cat.tasks.filter(t=>t.status==="tamamlandı").length;return(<div key={cat.id}><div onClick={()=>toggle(cat.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", background:C.card, border:`1px solid ${cat.color}44`, borderRadius:isOpen?"14px 14px 0 0":14, cursor:"pointer", borderLeft:`4px solid ${cat.color}` }}><span style={{ fontSize:20 }}>{cat.icon}</span><div style={{ flex:1 }}><div style={{ fontSize:15, fontWeight:800, color:C.text }}>{cat.title}</div><div style={{ fontSize:11, color:C.textMuted, marginTop:1 }}>{done}/{cat.tasks.length} tamamlandı{late>0&&<span style={{ color:C.red, marginLeft:6 }}>⚠ {late}</span>}</div></div><button onClick={e=>{e.stopPropagation();onCat(cat);onNav("addTask");}} style={{ background:`${cat.color}22`, border:`1px solid ${cat.color}44`, color:cat.color, borderRadius:8, padding:"4px 9px", fontSize:11, fontWeight:700, cursor:"pointer" }}>+ Alt</button><span style={{ color:C.textDim, fontSize:16, transform:isOpen?"rotate(90deg)":"rotate(0)", transition:"transform 0.2s" }}>›</span></div>{isOpen&&(<div style={{ border:`1px solid ${cat.color}33`, borderTop:"none", borderRadius:"0 0 14px 14px", overflow:"hidden" }}>{cat.tasks.length===0&&<div style={{ padding:16, textAlign:"center", color:C.textMuted, fontSize:13 }}>Henüz alt görev yok.</div>}{cat.tasks.map((task,idx)=>{const sc=STATUS[task.status];const dl=daysLeft(task.dueDate);return(<div key={task.id} onClick={()=>onTask(task)} style={{ padding:"11px 14px", cursor:"pointer", background:C.surface, borderBottom:idx<cat.tasks.length-1?`1px solid ${C.border}`:"none" }}><div style={{ display:"flex", justifyContent:"space-between", gap:8, marginBottom:6 }}><div style={{ fontSize:13, fontWeight:600, color:C.text, flex:1 }}>{task.title}</div><Badge label={sc.label} color={sc.color} bg={sc.bg}/></div><div style={{ display:"flex", alignItems:"center", gap:8 }}><AvatarStack ids={task.teacherIds||[]} teachers={teachers} size={22}/><span style={{ fontSize:11, color:C.textMuted, flex:1 }}>{(task.teacherIds||[]).length===1?teachers.find(t=>t.id===task.teacherIds[0])?.name:`${(task.teacherIds||[]).length} öğretmen`}</span><span style={{ fontSize:10, color:dl<0?C.red:dl<=3?C.yellow:C.textDim, fontWeight:700 }}>📅 {fmtDate(task.dueDate)}</span></div></div>);})}</div>)}</div>);})}
      </div>
    </div>
  );
}

// ─── KATEGORİ DETAY ───────────────────────────────────────────
function CatDetail({ cat, teachers, onBack, onNav, onTask, onDel, onDelCat }) {
  const [conf, setConf] = useState(null);
  const [confCat, setConfCat] = useState(false);
  return (
    <div style={{ padding:"0 16px 24px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:C.accent, fontSize:14, cursor:"pointer", marginBottom:16, padding:0, fontWeight:600 }}>← Geri</button>
      <div style={{ background:C.card, borderRadius:18, padding:18, border:`1px solid ${cat.color}44`, borderLeft:`4px solid ${cat.color}`, marginBottom:12, display:"flex", gap:14, alignItems:"center" }}>
        <div style={{ width:48, height:48, borderRadius:14, background:`${cat.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{cat.icon}</div>
        <div style={{ flex:1 }}><div style={{ fontSize:18, fontWeight:800, color:C.text }}>{cat.title}</div><div style={{ fontSize:13, color:C.textMuted, marginTop:2 }}>{cat.tasks.length} alt görev</div></div>
        <button onClick={()=>setConfCat(true)} style={{ background:C.redSoft, border:`1px solid ${C.red}33`, color:C.red, borderRadius:9, padding:"6px 10px", fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0 }}>🗑 Sil</button>
      </div>
      {confCat && (
        <div style={{ background:C.redSoft, border:`1px solid ${C.red}44`, borderRadius:12, padding:"12px 14px", marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:13, color:C.red, fontWeight:600 }}>"{cat.title}" kategorisi silinsin mi?</span>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>setConfCat(false)} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.textMuted, borderRadius:8, padding:"5px 12px", fontSize:12, cursor:"pointer" }}>İptal</button>
            <button onClick={()=>onDelCat(cat.id)} style={{ background:C.red, border:"none", color:"#fff", borderRadius:8, padding:"5px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>Sil</button>
          </div>
        </div>
      )}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ fontSize:14, fontWeight:700, color:C.text }}>Alt Görevler</div>
        <button onClick={()=>onNav("addTask")} style={{ background:`${cat.color}22`, border:`1px solid ${cat.color}44`, color:cat.color, borderRadius:9, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ Ekle</button>
      </div>
      {cat.tasks.length===0?<div style={{ textAlign:"center", color:C.textMuted, fontSize:13, padding:40 }}>Henüz alt görev yok.</div>:
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {cat.tasks.map(task=>{const sc=STATUS[task.status];const dl=daysLeft(task.dueDate);return(<div key={task.id}><div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 14px" }}><div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}><div onClick={()=>onTask(task)} style={{ fontSize:14, fontWeight:600, color:C.text, flex:1, cursor:"pointer" }}>{task.title}</div><div style={{ display:"flex", gap:6 }}><Badge label={sc.label} color={sc.color} bg={sc.bg}/><button onClick={()=>setConf(task.id)} style={{ background:C.redSoft, border:`1px solid ${C.red}33`, color:C.red, borderRadius:7, padding:"3px 8px", fontSize:11, cursor:"pointer", fontWeight:700 }}>✕</button></div></div><div style={{ display:"flex", alignItems:"center", gap:8 }}><AvatarStack ids={task.teacherIds||[]} teachers={teachers} size={22}/><span style={{ fontSize:11, color:C.textMuted, flex:1 }}>{(task.teacherIds||[]).length===1?teachers.find(t=>t.id===task.teacherIds[0])?.name:`${(task.teacherIds||[]).length} öğretmen`}</span><span style={{ fontSize:11, color:dl<0?C.red:dl<=3?C.yellow:C.textDim, fontWeight:600 }}>📅 {fmtDate(task.dueDate)}</span></div></div>{conf===task.id&&(<div style={{ background:C.redSoft, border:`1px solid ${C.red}44`, borderRadius:10, padding:"10px 14px", marginTop:4, display:"flex", justifyContent:"space-between", alignItems:"center" }}><span style={{ fontSize:13, color:C.red, fontWeight:600 }}>Bu görevi sil?</span><div style={{ display:"flex", gap:8 }}><button onClick={()=>setConf(null)} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.textMuted, borderRadius:8, padding:"5px 12px", fontSize:12, cursor:"pointer" }}>İptal</button><button onClick={()=>{onDel(cat.id,task.id);setConf(null);}} style={{ background:C.red, border:"none", color:"#fff", borderRadius:8, padding:"5px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>Sil</button></div></div>)}</div>);})}
      </div>}
    </div>
  );
}

// ─── GÖREV DETAY ──────────────────────────────────────────────
function TaskDetail({ task, teachers, cats, onBack, onStatus, onReminder, onCheck }) {
  const cat = cats.find(c=>c.tasks.some(t=>t.id===task.id));
  const tt = (task.teacherIds||[]).map(id=>teachers.find(t=>t.id===id)).filter(Boolean);
  const sc=STATUS[task.status]; const pc=PRIORITY[task.priority]; const dl=daysLeft(task.dueDate);
  const cids = task.completedTeacherIds||[];
  return (
    <div style={{ padding:"0 16px 24px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:C.accent, fontSize:14, cursor:"pointer", marginBottom:16, padding:0, fontWeight:600 }}>← Geri</button>
      {cat&&<div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, background:`${cat.color}15`, border:`1px solid ${cat.color}33`, borderRadius:10, padding:"7px 12px" }}><span>{cat.icon}</span><span style={{ fontSize:12, color:cat.color, fontWeight:700 }}>{cat.title}</span></div>}
      <div style={{ background:C.card, borderRadius:18, padding:18, border:`1px solid ${C.border}`, marginBottom:12 }}>
        <div style={{ fontSize:18, fontWeight:800, color:C.text, marginBottom:10 }}>{task.title}</div>
        <div style={{ display:"flex", gap:8, marginBottom:12 }}><Badge label={sc.label} color={sc.color} bg={sc.bg}/>{pc&&<Badge label={pc.label} color={pc.color} bg={`${pc.color}22`}/>}</div>
        {task.desc&&<div style={{ fontSize:13, color:C.textMuted, lineHeight:1.6 }}>{task.desc}</div>}
      </div>
      <div style={{ background:C.card, borderRadius:18, padding:18, border:`1px solid ${C.border}`, marginBottom:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.textMuted, textTransform:"uppercase" }}>Görevli Öğretmenler</div>
          {tt.length>1&&<div style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ fontSize:12, fontWeight:700, color:cids.length===tt.length?C.green:C.textMuted }}>{cids.length}/{tt.length}</span><div style={{ width:48, height:5, background:C.border, borderRadius:3, overflow:"hidden" }}><div style={{ height:"100%", width:`${(cids.length/tt.length)*100}%`, background:cids.length===tt.length?C.green:C.accent, borderRadius:3, transition:"width 0.3s" }}/></div></div>}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {tt.map(t=>{const done=cids.includes(t.id);return(<div key={t.id} onClick={()=>{const u=done?cids.filter(id=>id!==t.id):[...cids,t.id];onCheck(task.id,u);}} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:12, cursor:"pointer", background:done?C.greenSoft:C.surface, border:`1.5px solid ${done?C.green+"66":C.border}` }}><div style={{ position:"relative" }}><Avatar initials={t.avatar} size={38} idx={t.idx||0}/>{done&&<div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"rgba(52,211,153,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:14, color:C.green }}>✓</span></div>}</div><div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:700, color:done?C.green:C.text, textDecoration:done?"line-through":"none" }}>{t.name}</div><div style={{ fontSize:12, color:C.textMuted }}>{t.branch}</div></div><div style={{ width:24, height:24, borderRadius:7, background:done?C.green:"transparent", border:`2px solid ${done?C.green:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:"#fff", fontWeight:800 }}>{done?"✓":""}</div></div>);})}
        </div>
        {tt.length>1&&cids.length===tt.length&&<div style={{ marginTop:12, background:C.greenSoft, border:`1px solid ${C.green}44`, borderRadius:10, padding:"9px 12px", display:"flex", alignItems:"center", gap:8 }}><span style={{ fontSize:16 }}>🎉</span><span style={{ fontSize:13, color:C.green, fontWeight:700 }}>Tüm öğretmenler tamamladı!</span></div>}
      </div>
      <div style={{ background:C.card, borderRadius:18, padding:18, border:`1px solid ${C.border}`, marginBottom:12 }}>
        <div style={{ fontSize:12, fontWeight:700, color:C.textMuted, marginBottom:12, textTransform:"uppercase" }}>Tarih</div>
        <div style={{ display:"flex", gap:20 }}>
          <div><div style={{ fontSize:11, color:C.textDim, marginBottom:3 }}>Son Tarih</div><div style={{ fontSize:14, fontWeight:700, color:C.text }}>📅 {fmtDate(task.dueDate)}</div></div>
          <div><div style={{ fontSize:11, color:C.textDim, marginBottom:3 }}>Saat</div><div style={{ fontSize:14, fontWeight:700, color:C.text }}>🕐 {task.dueTime}</div></div>
          <div><div style={{ fontSize:11, color:C.textDim, marginBottom:3 }}>Kalan</div><div style={{ fontSize:14, fontWeight:700, color:dl<0?C.red:dl<=3?C.yellow:C.green }}>{dl<0?`${Math.abs(dl)}g geçti`:dl===0?"Bugün!":`${dl} gün`}</div></div>
        </div>
      </div>
      <div style={{ marginBottom:12 }}>
        <ReminderPicker dueDate={task.dueDate} value={task.reminderDays||[]} onChange={d=>onReminder(task.id,d)}/>
      </div>
      <div style={{ background:C.card, borderRadius:18, padding:18, border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:12, fontWeight:700, color:C.textMuted, marginBottom:12, textTransform:"uppercase" }}>Durum Güncelle</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {Object.entries(STATUS).map(([key,cfg])=>(<button key={key} onClick={()=>onStatus(task.id,key)} style={{ background:task.status===key?cfg.bg:"transparent", border:`1.5px solid ${task.status===key?cfg.color:C.border}`, borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}><span style={{ color:cfg.color, fontSize:15 }}>{cfg.dot}</span><span style={{ fontSize:13, fontWeight:600, color:task.status===key?cfg.color:C.textMuted }}>{cfg.label}</span>{task.status===key&&<span style={{ marginLeft:"auto", fontSize:11, color:cfg.color }}>✓</span>}</button>))}
        </div>
      </div>
    </div>
  );
}

// ─── ALT GÖREV EKLE ───────────────────────────────────────────
function AddTask({ cat, teachers, onAdd, onBack }) {
  const [form, setForm] = useState({ title:"", desc:"", dueDate:"", dueTime:"09:00", priority:"orta" });
  const [ids, setIds] = useState([]);
  const [remDays, setRemDays] = useState([5,3,1]);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const toggle = id => setIds(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const ok = ids.length>0 && form.title && form.dueDate;
  const inp = { width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 13px", color:C.text, fontSize:14, outline:"none", boxSizing:"border-box" };
  const lbl = { fontSize:12, color:C.textMuted, marginBottom:5, fontWeight:600, display:"block" };
  return (
    <div style={{ padding:"0 16px 24px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:C.accent, fontSize:14, cursor:"pointer", marginBottom:16, padding:0, fontWeight:600 }}>← Geri</button>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, background:`${cat.color}15`, border:`1px solid ${cat.color}33`, borderRadius:12, padding:"10px 14px" }}>
        <span style={{ fontSize:22 }}>{cat.icon}</span>
        <div><div style={{ fontSize:12, color:C.textMuted }}>Alt görev ekle</div><div style={{ fontSize:15, fontWeight:800, color:cat.color }}>{cat.title}</div></div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div>
          <label style={lbl}>Görevli Öğretmenler {ids.length>0&&<span style={{ color:C.accent }}>({ids.length} seçili)</span>}</label>
          {teachers.length===0&&<div style={{ background:C.yellowSoft, border:`1px solid ${C.yellow}44`, borderRadius:10, padding:"10px 12px", fontSize:12, color:C.yellow }}>⚠ Önce öğretmen eklemeniz gerekiyor.</div>}
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {teachers.map((t,i)=>{const sel=ids.includes(t.id);return(<div key={t.id} onClick={()=>toggle(t.id)} style={{ background:sel?C.accentSoft:C.surface, border:`1.5px solid ${sel?C.accent:C.border}`, borderRadius:12, padding:"9px 14px", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}><Avatar initials={t.avatar} size={32} idx={i}/><div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600, color:sel?C.accent:C.text }}>{t.name}</div><div style={{ fontSize:11, color:C.textMuted }}>{t.branch}</div></div><div style={{ width:18, height:18, borderRadius:5, background:sel?C.accent:"transparent", border:`2px solid ${sel?C.accent:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#fff" }}>{sel?"✓":""}</div></div>);})}
          </div>
        </div>
        <div><label style={lbl}>Görev Başlığı</label><input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Görev adını yazın..." style={inp}/></div>
        <div><label style={lbl}>Açıklama</label><textarea value={form.desc} onChange={e=>set("desc",e.target.value)} placeholder="Görev detayları..." rows={3} style={{ ...inp, resize:"none", fontFamily:"inherit" }}/></div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <div><label style={lbl}>Son Tarih</label><input type="date" value={form.dueDate} onChange={e=>set("dueDate",e.target.value)} style={inp}/></div>
          <div><label style={lbl}>Saat</label><input type="time" value={form.dueTime} onChange={e=>set("dueTime",e.target.value)} style={inp}/></div>
        </div>
        <div><label style={lbl}>Öncelik</label><div style={{ display:"flex", gap:8 }}>{Object.entries(PRIORITY).map(([k,v])=>(<button key={k} onClick={()=>set("priority",k)} style={{ flex:1, background:form.priority===k?`${v.color}22`:C.surface, border:`1.5px solid ${form.priority===k?v.color:C.border}`, borderRadius:10, padding:"9px 0", color:form.priority===k?v.color:C.textMuted, fontSize:13, fontWeight:600, cursor:"pointer" }}>{v.label}</button>))}</div></div>
        <ReminderPicker dueDate={form.dueDate} value={remDays} onChange={setRemDays}/>
        <button onClick={()=>ok&&onAdd(cat.id,{...form,teacherIds:ids,reminderDays:remDays})} style={{ background:cat.color, border:"none", color:"#fff", borderRadius:14, padding:"14px 0", fontSize:15, fontWeight:700, cursor:ok?"pointer":"default", opacity:ok?1:0.4 }}>
          {ids.length>1?`${ids.length} Öğretmene Görevi Ata`:"Görevi Ata"}
        </button>
      </div>
    </div>
  );
}

// ─── ÖĞRETMEN LİSTESİ ────────────────────────────────────────
function TeacherList({ teachers, allTasks, onSel, onNav }) {
  return (
    <div style={{ padding:"0 16px 24px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ fontSize:22, fontWeight:800, color:C.text }}>Öğretmenler</div>
        <button onClick={()=>onNav("addTeacher")} style={{ background:C.accent, border:"none", color:"#fff", borderRadius:10, padding:"7px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}>+ Ekle</button>
      </div>
      {teachers.length===0&&<div style={{ textAlign:"center", color:C.textMuted, fontSize:13, padding:40 }}>Henüz öğretmen eklenmemiş.</div>}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {teachers.map((t,i)=>{const my=allTasks.filter(tk=>(tk.teacherIds||[]).includes(t.id));const active=my.filter(tk=>tk.status!=="tamamlandı").length;const late=my.filter(tk=>tk.status==="gecikmiş").length;return(<div key={t.id} onClick={()=>onSel(t)} style={{ background:C.card, border:`1px solid ${late>0?C.red+"44":C.border}`, borderRadius:16, padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:14 }}><Avatar initials={t.avatar} size={44} idx={i}/><div style={{ flex:1 }}><div style={{ fontSize:15, fontWeight:700, color:C.text }}>{t.name}</div><div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{t.branch}</div><div style={{ fontSize:11, color:C.textDim, marginTop:2 }}>👤 {t.username}</div><div style={{ display:"flex", gap:8, marginTop:5 }}><span style={{ fontSize:11, color:C.accent, background:C.accentSoft, borderRadius:5, padding:"1px 7px" }}>{active} aktif</span>{late>0&&<span style={{ fontSize:11, color:C.red, background:C.redSoft, borderRadius:5, padding:"1px 7px" }}>⚠ {late} gecikmiş</span>}</div></div><div style={{ color:C.textDim, fontSize:18 }}>›</div></div>);})}
      </div>
    </div>
  );
}

function AddTeacher({ onAdd, onBack }) {
  const [form, setForm] = useState({ name:"", branch:"", username:"", password:"" });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const ok = form.name&&form.branch&&form.username&&form.password;
  const inp = { width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 13px", color:C.text, fontSize:14, outline:"none", boxSizing:"border-box" };
  const lbl = { fontSize:12, color:C.textMuted, marginBottom:5, fontWeight:600, display:"block" };
  const initials = form.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)||"??";
  return (
    <div style={{ padding:"0 16px 24px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:C.accent, fontSize:14, cursor:"pointer", marginBottom:16, padding:0, fontWeight:600 }}>← Geri</button>
      <div style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:20 }}>Yeni Öğretmen Ekle</div>
      {form.name&&<div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}><Avatar initials={initials} size={64} idx={0}/></div>}
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div><label style={lbl}>Ad Soyad</label><input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Ayşe Kaya" style={inp}/></div>
        <div><label style={lbl}>Branş</label><input value={form.branch} onChange={e=>set("branch",e.target.value)} placeholder="Matematik" style={inp}/></div>
        <div style={{ background:C.card, borderRadius:14, padding:14, border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.textMuted, marginBottom:12 }}>GİRİŞ BİLGİLERİ</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div><label style={lbl}>Kullanıcı Adı</label><input value={form.username} onChange={e=>set("username",e.target.value)} placeholder="ayse.kaya" style={inp}/></div>
            <div><label style={lbl}>Şifre</label><input value={form.password} onChange={e=>set("password",e.target.value)} placeholder="Şifre belirleyin" style={inp}/></div>
          </div>
        </div>
        <button onClick={async()=>{if(!ok||saving)return;setSaving(true);await onAdd(form);setSaving(false);}} style={{ background:C.accent, border:"none", color:"#fff", borderRadius:14, padding:"14px 0", fontSize:15, fontWeight:700, cursor:ok?"pointer":"default", opacity:ok?1:0.4 }}>{saving?"Ekleniyor...":"Öğretmeni Ekle"}</button>
      </div>
    </div>
  );
}

function TeacherDetail({ teacher, cats, onBack, onNav, onTask, onDel }) {
  const [conf, setConf] = useState(false);
  const all = cats.flatMap(c=>c.tasks.map(t=>({...t,catTitle:c.title,catIcon:c.icon,catColor:c.color})));
  const my = all.filter(t=>(t.teacherIds||[]).includes(teacher.id));
  return (
    <div style={{ padding:"0 16px 24px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:C.accent, fontSize:14, cursor:"pointer", marginBottom:16, padding:0, fontWeight:600 }}>← Geri</button>
      <div style={{ background:C.card, borderRadius:18, padding:18, border:`1px solid ${C.border}`, marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <Avatar initials={teacher.avatar} size={56} idx={teacher.idx||0}/>
          <div style={{ flex:1 }}><div style={{ fontSize:18, fontWeight:800, color:C.text }}>{teacher.name}</div><div style={{ fontSize:13, color:C.textMuted }}>{teacher.branch} Öğretmeni</div><div style={{ fontSize:12, color:C.textDim, marginTop:3 }}>👤 {teacher.username}</div></div>
        </div>
        <button onClick={()=>setConf(true)} style={{ width:"100%", marginTop:14, background:C.redSoft, border:`1px solid ${C.red}44`, color:C.red, borderRadius:10, padding:9, fontSize:13, fontWeight:700, cursor:"pointer" }}>Öğretmeni Sil</button>
      </div>
      {conf&&(<div style={{ background:C.redSoft, border:`1px solid ${C.red}44`, borderRadius:14, padding:16, marginBottom:16 }}><div style={{ fontSize:14, color:C.red, fontWeight:700, marginBottom:10 }}>⚠ {teacher.name} silinsin mi?</div><div style={{ display:"flex", gap:8 }}><button onClick={()=>setConf(false)} style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`, color:C.textMuted, borderRadius:9, padding:9, fontSize:13, cursor:"pointer" }}>İptal</button><button onClick={()=>{onDel(teacher.id);onBack();}} style={{ flex:1, background:C.red, border:"none", color:"#fff", borderRadius:9, padding:9, fontSize:13, fontWeight:700, cursor:"pointer" }}>Sil</button></div></div>)}
      <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:10 }}>Atanan Görevler ({my.length})</div>
      {my.length===0?<div style={{ textAlign:"center", color:C.textMuted, fontSize:13, padding:32 }}>Henüz görev atanmamış.</div>:
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {my.map(task=>{const sc=STATUS[task.status];return(<div key={task.id} onClick={()=>onTask(task)} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 14px", cursor:"pointer" }}><div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}><span>{task.catIcon}</span><span style={{ fontSize:11, color:task.catColor, fontWeight:600 }}>{task.catTitle}</span></div><div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}><div style={{ fontSize:14, fontWeight:600, color:C.text, flex:1, marginRight:8 }}>{task.title}</div><Badge label={sc.label} color={sc.color} bg={sc.bg}/></div><div style={{ fontSize:11, color:C.textMuted, marginTop:5 }}>📅 {fmtDate(task.dueDate)}</div></div>);})}
      </div>}
    </div>
  );
}

// ─── ÖĞRETMEN PANELİ ─────────────────────────────────────────
function TeacherPanel({ session, onLogout }) {
  const { user, schoolCode, school } = session;
  const [screen, setScreen] = useState("myTasks");
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selTask, setSelTask] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await dbGet(`schools/${schoolCode}/categories`);
        if (!data) { setLoading(false); return; }
        const tid = user.teacherId || user.id;
        const list = Object.entries(data).map(([id,cat]) => ({
          id, ...cat,
          tasks: objToArr(cat.tasks||{}).filter(t=>(t.teacherIds||[]).includes(tid))
        })).filter(c=>c.tasks.length>0);
        setCats(list);
      } catch {}
      setLoading(false);
    };
    load();
    const unsub = dbListen(`schools/${schoolCode}/categories`, data => {
      if (!data) return;
      const tid = user.teacherId || user.id;
      const list = Object.entries(data).map(([id,cat]) => ({
        id, ...cat,
        tasks: objToArr(cat.tasks||{}).filter(t=>(t.teacherIds||[]).includes(tid))
      })).filter(c=>c.tasks.length>0);
      setCats(list);
    });
    return unsub;
  }, [schoolCode, user]);

  const all = cats.flatMap(c=>c.tasks.map(t=>({...t,catTitle:c.title,catIcon:c.icon,catColor:c.color})));
  const pending = all.filter(t=>t.status!=="tamamlandı");
  const done = all.filter(t=>t.status==="tamamlandı");

  if (loading) return <div style={{ background:C.bg, minHeight:"100vh" }}><Spinner/></div>;

  return (
    <div style={{ maxWidth:390, margin:"0 auto", background:C.bg, minHeight:"100vh", fontFamily:"'Segoe UI',system-ui,sans-serif", color:C.text }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"14px 18px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Avatar initials={user.name?.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)||"?"} size={32} idx={0}/>
          <div><div style={{ fontSize:13, fontWeight:800, color:C.text }}>{user.name}</div><div style={{ fontSize:10, color:C.textMuted }}>{school.name}</div></div>
        </div>
        <button onClick={onLogout} style={{ background:C.redSoft, border:`1px solid ${C.red}33`, color:C.red, borderRadius:8, padding:"5px 12px", fontSize:11, fontWeight:700, cursor:"pointer" }}>Çıkış</button>
      </div>
      <div style={{ paddingTop:16, paddingBottom:80 }}>
        {screen==="myTasks"&&(
          <div style={{ padding:"0 16px 24px" }}>
            <div style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:6 }}>Görevlerim</div>
            <div style={{ fontSize:13, color:C.textMuted, marginBottom:20 }}>Toplam {all.length} görev</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:22 }}>
              {[{label:"Bekliyor",value:all.filter(t=>t.status==="bekliyor").length,color:C.yellow},{label:"Gecikmiş",value:all.filter(t=>t.status==="gecikmiş").length,color:C.red},{label:"Tamamlandı",value:done.length,color:C.green}].map(s=><div key={s.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 10px", textAlign:"center", borderTop:`3px solid ${s.color}` }}><div style={{ fontSize:20, fontWeight:900, color:s.color }}>{s.value}</div><div style={{ fontSize:10, color:C.textMuted, marginTop:2 }}>{s.label}</div></div>)}
            </div>
            {pending.length>0&&<><div style={{ fontSize:12, fontWeight:700, color:C.textMuted, marginBottom:8, textTransform:"uppercase" }}>Aktif Görevler</div><div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>{pending.sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate)).map(task=>{const sc=STATUS[task.status];const dl=daysLeft(task.dueDate);return(<div key={task.id} onClick={()=>{setSelTask(task);setScreen("taskView");}} style={{ background:C.card, border:`1px solid ${task.status==="gecikmiş"?C.red+"44":C.border}`, borderRadius:14, padding:"13px 14px", cursor:"pointer" }}><div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}><span>{task.catIcon}</span><span style={{ fontSize:11, color:task.catColor, fontWeight:600 }}>{task.catTitle}</span></div><div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}><div style={{ fontSize:14, fontWeight:700, color:C.text, flex:1, marginRight:8 }}>{task.title}</div><Badge label={sc.label} color={sc.color} bg={sc.bg}/></div><div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ fontSize:11, color:C.textMuted }}>📅 {fmtDate(task.dueDate)} · {task.dueTime}</span><span style={{ fontSize:11, fontWeight:700, color:dl<0?C.red:dl<=3?C.yellow:C.textDim }}>{dl<0?`${Math.abs(dl)} gün geçti`:dl===0?"Bugün!":`${dl} gün kaldı`}</span></div></div>);})}</div></>}
            {done.length>0&&<><div style={{ fontSize:12, fontWeight:700, color:C.textMuted, marginBottom:8, textTransform:"uppercase" }}>Tamamlananlar</div><div style={{ display:"flex", flexDirection:"column", gap:8 }}>{done.map(task=><div key={task.id} onClick={()=>{setSelTask(task);setScreen("taskView");}} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"11px 14px", cursor:"pointer", opacity:0.7 }}><div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}><span style={{ fontSize:13, fontWeight:600, color:C.textMuted, textDecoration:"line-through" }}>{task.title}</span><Badge label="Tamamlandı" color={C.green} bg={C.greenSoft}/></div></div>)}</div></>}
            {all.length===0&&<div style={{ textAlign:"center", padding:48, color:C.textMuted }}><div style={{ fontSize:40, marginBottom:12 }}>🎉</div><div style={{ fontSize:15, fontWeight:700 }}>Atanmış göreviniz yok</div></div>}
          </div>
        )}
        {screen==="taskView"&&selTask&&(
          <div style={{ padding:"0 16px 24px" }}>
            <button onClick={()=>setScreen("myTasks")} style={{ background:"none", border:"none", color:C.accent, fontSize:14, cursor:"pointer", marginBottom:16, padding:0, fontWeight:600 }}>← Geri</button>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, background:`${selTask.catColor}15`, border:`1px solid ${selTask.catColor}33`, borderRadius:10, padding:"7px 12px" }}><span>{selTask.catIcon}</span><span style={{ fontSize:12, color:selTask.catColor, fontWeight:700 }}>{selTask.catTitle}</span></div>
            <div style={{ background:C.card, borderRadius:18, padding:18, border:`1px solid ${C.border}`, marginBottom:12 }}>
              <div style={{ fontSize:18, fontWeight:800, color:C.text, marginBottom:10 }}>{selTask.title}</div>
              <Badge label={STATUS[selTask.status].label} color={STATUS[selTask.status].color} bg={STATUS[selTask.status].bg}/>
              {selTask.desc&&<div style={{ fontSize:13, color:C.textMuted, lineHeight:1.6, marginTop:12 }}>{selTask.desc}</div>}
            </div>
            <div style={{ background:C.card, borderRadius:18, padding:18, border:`1px solid ${C.border}`, marginBottom:12 }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.textMuted, marginBottom:10, textTransform:"uppercase" }}>Tarih Bilgisi</div>
              <div style={{ display:"flex", gap:20 }}>
                <div><div style={{ fontSize:11, color:C.textDim }}>Son Tarih</div><div style={{ fontSize:14, fontWeight:700, color:C.text, marginTop:2 }}>📅 {fmtDate(selTask.dueDate)}</div></div>
                <div><div style={{ fontSize:11, color:C.textDim }}>Saat</div><div style={{ fontSize:14, fontWeight:700, color:C.text, marginTop:2 }}>🕐 {selTask.dueTime}</div></div>
              </div>
            </div>
            <div style={{ background:C.yellowSoft, border:`1px solid ${C.yellow}44`, borderRadius:14, padding:"12px 16px" }}>
              <div style={{ fontSize:13, color:C.yellow, fontWeight:600 }}>ℹ Durum güncellemesi yalnızca okul yönetimi tarafından yapılabilir.</div>
            </div>
          </div>
        )}
      </div>
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:390, background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex" }}>
        <button style={{ flex:1, background:"none", border:"none", padding:"10px 0 12px", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}><span style={{ fontSize:20 }}>📋</span><span style={{ fontSize:10, color:C.accent, fontWeight:700 }}>Görevlerim</span></button>
      </div>
    </div>
  );
}

// ─── ANA UYGULAMA ─────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(() => {
    try { const s = localStorage.getItem("okul_session"); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [showSetup, setShowSetup] = useState(false);

  const handleLogin = s => {
    setSession(s);
    try { localStorage.setItem("okul_session", JSON.stringify(s)); } catch {}
  };

  const handleLogout = () => {
    setSession(null);
    try { localStorage.removeItem("okul_session"); } catch {}
  };

  if (showSetup) return <SchoolSetup onDone={() => setShowSetup(false)} />;
  if (!session) return <LoginScreen onLogin={handleLogin} onSetup={() => setShowSetup(true)} />;
  if (session.role === "teacher") return <TeacherPanel session={session} onLogout={handleLogout} />;
  return <AdminPanel session={session} onLogout={handleLogout} />;
}
