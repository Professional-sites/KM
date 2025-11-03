/* assets/home-dynamic.js */
(function () {
  try { if (!firebase.apps.length) firebase.initializeApp(firebaseConfig); } catch (e) {}
  if (!window.firebase || !firebase.firestore) return;
  var db = firebase.firestore();

  // -------- utils --------
  function stripAccents(s){
    try { return (s||"").normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
    catch(e){ return (s||""); }
  }
  function norm(s){
    return stripAccents(s).toLowerCase().replace(/\s+/g," ").trim();
  }
  function tsToMillis(ts){
    try{
      if (!ts) return 0;
      if (typeof ts.toMillis === "function") return ts.toMillis();
      if (typeof ts.seconds === "number") return ts.seconds * 1000;
      if (typeof ts === "number") return ts;
    }catch(e){}
    return 0;
  }
  function safeImgSwap(imgEl, src, fallback){
    var pre = new Image();
    pre.onload  = function(){ imgEl.src = src; };
    pre.onerror = function(){ imgEl.src = fallback; };
    pre.src = src || fallback;
  }

  // -------- HERO (exclusivos) --------
  var HERO_ROTATE_MS = 4500;
  var heroImgEl = document.getElementById("kmHeroImg");
  var heroFallback = "assets/b1.svg";
  var heroQueue = [];
  var heroIndex = 0;
  var heroTimer = null;

  function startHero(){
    if (!heroImgEl) return;
    if (!heroQueue.length){ heroImgEl.src = heroFallback; return; }
    safeImgSwap(heroImgEl, heroQueue[0], heroFallback);
    if (heroTimer) clearInterval(heroTimer);
    heroTimer = setInterval(function(){
      heroIndex = (heroIndex + 1) % heroQueue.length;
      safeImgSwap(heroImgEl, heroQueue[heroIndex], heroFallback);
    }, HERO_ROTATE_MS);
  }

  function loadHeroExclusives(){
    db.collection("produtos")
      .where("exclusivo","==",true)
      .limit(20)
      .get()
      .then(function(snap){
        var arr=[]; snap.forEach(function(doc){ var p=doc.data()||{}; if(p.imagemURL) arr.push(p); });
        arr.sort(function(a,b){ return tsToMillis(b.createdAt)-tsToMillis(a.createdAt); });
        heroQueue = arr.map(function(p){ return p.imagemURL; });
        if (!heroQueue.length){
          return db.collection("produtos").limit(40).get().then(function(s2){
            var arr2=[]; s2.forEach(function(d){ var p=d.data()||{}; if(p.imagemURL) arr2.push(p); });
            arr2.sort(function(a,b){ return tsToMillis(b.createdAt)-tsToMillis(a.createdAt); });
            heroQueue = arr2.map(function(p){ return p.imagemURL; });
          });
        }
      })
      .catch(function(){})
      .finally(function(){
        if (!heroQueue.length) heroQueue.push(heroFallback);
        startHero();
      });
  }

  // -------- MINI-CARDS por categoria (pega o MAIS RECENTE daquela categoria) --------
  function hydrateCategoryCards(){
    var cards = document.querySelectorAll(".km-cat[data-cat]");
    if (!cards.length) return;

    cards.forEach(function(card){
      var key = norm(card.getAttribute("data-cat") || ""); // já vem sem acento/minúscula
      var imgEl = card.querySelector("img");
      if (!imgEl) return;
      var fallback = imgEl.getAttribute("src") || "assets/b1.svg";

      // Busca um lote e filtra no cliente pela categoria normalizada
      db.collection("produtos").limit(120).get()
        .then(function(snap){
          var list=[];
          snap.forEach(function(doc){
            var p = doc.data()||{};
            if (norm(p.categoria) === key) list.push(p);
          });
          if (!list.length){ imgEl.src = fallback; return; }
          list.sort(function(a,b){ return tsToMillis(b.createdAt)-tsToMillis(a.createdAt); });
          var newestWithImg = list.find(function(p){ return !!p.imagemURL; });
          if (newestWithImg) safeImgSwap(imgEl, newestWithImg.imagemURL, fallback);
          else imgEl.src = fallback;
        })
        .catch(function(){ imgEl.src = fallback; });
    });
  }

  document.addEventListener("DOMContentLoaded", function(){
    loadHeroExclusives();
    hydrateCategoryCards();
  });
})();
