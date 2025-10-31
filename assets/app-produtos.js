// js/app-produtos.js
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// INDEX: mostrar exclusivos
const exclusivosGrid = document.getElementById("exclusivosGrid");
if (exclusivosGrid) {
  db.collection("produtos")
    .where("exclusivo", "==", true)
    .onSnapshot((snap) => {
      exclusivosGrid.innerHTML = "";
      snap.forEach((doc) => {
        const d = doc.data();
        const card = document.createElement("div");
        card.className = "prod-card";
        card.innerHTML = `
          <h3>${d.nome || "Sem nome"}</h3>
          <p>${d.marca || ""}</p>
        `;
        exclusivosGrid.appendChild(card);
      });
    });
}

// PÁGINA DE PRODUTOS: lista completa
const prodGrid = document.getElementById("prodGrid");
const buscaInput = document.getElementById("buscaProdutos");
if (prodGrid) {
  let todos = [];
  db.collection("produtos").onSnapshot((snap) => {
    todos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    render(todos);
  });

  if (buscaInput) {
    buscaInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      const filtrados = todos.filter((p) => {
        const nome = (p.nome || "").toLowerCase();
        const tags = (p.tags || []).join(" ").toLowerCase();
        return nome.includes(q) || tags.includes(q);
      });
      render(filtrados);
    });
  }

  function render(lista) {
    prodGrid.innerHTML = "";
    lista.forEach((p) => {
      const div = document.createElement("div");
      div.className = "prod-card";
      div.innerHTML = `
        ${p.exclusivo ? '<span class="badge">Exclusivo</span>' : ""}
        <h3>${p.nome || "Sem nome"}</h3>
        <p>${p.marca || ""} ${p.novo ? "• Novo" : ""}</p>
      `;
      prodGrid.appendChild(div);
    });
  }
}
