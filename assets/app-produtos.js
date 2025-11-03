// assets/app-produtos-km.js

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

const boxNovos = document.getElementById("kmNovos");
const boxDest = document.getElementById("kmDestacados");

// NOVOS (últimos 8)
if (boxNovos) {
  db.collection("produtos")
    .orderBy("createdAt", "desc")
    .limit(8)
    .onSnapshot((snap) => {
      boxNovos.innerHTML = "";
      snap.forEach((doc) => {
        const p = doc.data();
        const art = document.createElement("article");
        art.className = "km-prod";
        art.innerHTML = `
          <div class="km-prod-img">
            <img src="${p.imagemURL || 'assets/b1.svg'}" alt="${p.nome || ''}">
          </div>
          <h3 class="km-prod-title">${p.nome || 'Produto sem nome'}</h3>
          <p class="km-prod-meta">${p.marca || ''} ${p.categoria ? '• '+p.categoria : ''}</p>
          <a href="produto.html?id=${doc.id}">Ver mais</a>
        `;
        boxNovos.appendChild(art);
      });
    });
}

// DESTACADOS (exclusivo = true)
if (boxDest) {
  db.collection("produtos")
    .where("exclusivo", "==", true)
    .orderBy("createdAt", "desc")
    .limit(12)
    .onSnapshot((snap) => {
      boxDest.innerHTML = "";
      snap.forEach((doc) => {
        const p = doc.data();
        const art = document.createElement("article");
        art.className = "km-prod";
        art.innerHTML = `
          <div class="km-prod-img">
            <img src="${p.imagemURL || 'assets/b2.svg'}" alt="${p.nome || ''}">
          </div>
          <h3 class="km-prod-title">${p.nome || 'Produto sem nome'}</h3>
          <p class="km-prod-meta">${p.marca || ''} ${p.categoria ? '• '+p.categoria : ''}</p>
          <a href="produto.html?id=${doc.id}">Ver mais</a>
        `;
        boxDest.appendChild(art);
      });
    });
}
