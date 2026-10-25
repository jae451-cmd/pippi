/* 삐삐 수술 노트 — 오프라인 서비스 워커 */
const CORE='pippi-core-a619a6823d';
const CORE_FILES=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png','pippi_face.jpg','pippi_hero.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CORE).then(c=>c.addAll(CORE_FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('pippi-core-')&&k!==CORE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const isPage=r=>r.mode==='navigate'||/\/(index\.html)?$/.test(new URL(r.url).pathname)||/assets\.json$/.test(r.url);
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(isPage(r)&&u.origin===location.origin){
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(CORE).then(c=>c.put(r.mode==='navigate'?'index.html':r,cp));return res}).catch(()=>caches.match(r.mode==='navigate'?'index.html':r).then(x=>x||caches.match('./'))));
    return;
  }
  if(u.hostname.includes('fonts.g')){
    e.respondWith(caches.open('pippi-fonts').then(c=>c.match(r).then(hit=>{const net=fetch(r).then(res=>{c.put(r,res.clone());return res}).catch(()=>hit);return hit||net})));
    return;
  }
  if(u.origin===location.origin){
    e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>{
      return hit||fetch(r);
    }));
  }
});
