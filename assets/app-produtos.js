// assets/app-produtos.js
// Lê produtos do Firestore e mostra na index (exclusivos) e na página produtos

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

/* INDEX – EXCLUSIVOS */
const exclusivosGrid = document.getElementById("exclusivosGrid");
if (exclusivosGrid) {
  db.collection("produtos")
    .where("exclusivo", "==", true)
    .orderBy("createdAt", "desc")
    .onSnapshot((snap) => {
      exclusivosGrid.innerHTML = "";
      snap.forEach((doc) => {
        const p = doc.data();
        const card = document.createElement("article");
        card.className = "prod-card";
        card.innerHTML = `
          <div class="prod-img">
            <img src="${p.imagemURL || 'assets/b1.svg'}" alt="${p.nome || ''}">
          </div>
          <h3>${p.nome || "Sem nome"}</h3>
          <p class="muted">${p.marca || ""} ${p.novo ? "• Novo" : ""}</p>
        `;
        exclusivosGrid.appendChild(card);
      });
    });
}

/* PRODUTOS – TODOS */
const listaProdutos = document.getElementById("listaProdutos");
const inputBusca = document.getElementById("buscaProd");

if (listaProdutos) {
  let todos = [];

  db.collection("produtos")
    .orderBy("createdAt", "desc")
    .onSnapshot((snap) => {
      todos = [];
      snap.forEach((doc) => {
        todos.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      renderLista(todos);
    });

  function renderLista(arr) {
    listaProdutos.innerHTML = "";
    arr.forEach((p) => {
      const div = document.createElement("article");
      div.className = "prod-card";
      div.innerHTML = `
        ${p.exclusivo ? '<span class="badge">Exclusivo</span>' : ""}
        <div class="prod-img">
          <img src="${p.imagemURL || 'assets/b2.svg'}" alt="${p.nome || ''}">
        </div>
        <h3>${p.nome || "Sem nome"}</h3>
        <p class="muted">
          ${p.marca || ""} ${p.categoria ? "• " + p.categoria : ""} ${p.novo ? "• Novo" : ""}
        </p>
      `;
      listaProdutos.appendChild(div);
    });
  }

  if (inputBusca) {
    inputBusca.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      const filtrados = todos.filter((p) => {
        const nome = (p.nome || "").toLowerCase();
        const marca = (p.marca || "").toLowerCase();
        const cat = (p.categoria || "").toLowerCase();
        const tags = Array.isArray(p.tags) ? p.tags.join(" ").toLowerCase() : "";
        return (
          nome.includes(term) ||
          marca.includes(term) ||
          cat.includes(term) ||
          tags.includes(term)
        );
      });
      renderLista(filtrados);
    });
  }
}
