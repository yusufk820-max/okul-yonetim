// Firebase Realtime Database - REST API (SDK kullanılmıyor)
const BASE = "https://okul-yonet-default-rtdb.firebaseio.com";

export async function dbGet(path) {
  const res = await fetch(`${BASE}/${path}.json`);
  if (!res.ok) throw new Error("Veri alınamadı");
  return res.json();
}

export async function dbSet(path, data) {
  const res = await fetch(`${BASE}/${path}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Veri kaydedilemedi");
  return res.json();
}

export async function dbPush(path, data) {
  const res = await fetch(`${BASE}/${path}.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Veri eklenemedi");
  const result = await res.json();
  return result.name; // Firebase push key
}

export async function dbUpdate(path, data) {
  const res = await fetch(`${BASE}/${path}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Veri güncellenemedi");
  return res.json();
}

export async function dbDelete(path) {
  const res = await fetch(`${BASE}/${path}.json`, { method: "DELETE" });
  if (!res.ok) throw new Error("Veri silinemedi");
}

// Gerçek zamanlı dinleme - polling ile (her 10 saniyede bir)
export function dbListen(path, callback) {
  let active = true;
  let lastData = null;

  const poll = async () => {
    if (!active) return;
    try {
      const data = await dbGet(path);
      const str = JSON.stringify(data);
      if (str !== lastData) {
        lastData = str;
        callback(data);
      }
    } catch {}
    if (active) setTimeout(poll, 10000);
  };

  poll();
  return () => { active = false; };
}
