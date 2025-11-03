// assets/produtos-km.js

// ---------- FIREBASE ----------
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ---------- ELEMENTOS ----------
const listEl  = document.getElementById("kmProdList");
const countEl = document.getElementById("kmProdCount");
const catEl   = document.getElementById("kmFilterCategorias");
const marcaEl = document.getElementById("kmFilterMarcas");

// checkboxes (mantidos para compatibilidade, podem ficar escondidos)
const chkExcl = document.getElementById("kmFilterExclusivo");
const chkNovo = document.getElementById("kmFilterNovo");

// NOVOS selects
const selEx   = document.getElementById("kmSelectEx"); // todos | exclusivos | comum
const selNv   = document.getElementById("kmSelectNv"); // todos | novos | padrao

const btnClear= document.getElementById("kmClearFilters");

// ---------- MODAL (opcional) ----------
const modalOverlay = document.getElementById("kmModalOverlay") || null;
const modalClose   = document.getElementById("kmModalClose")   || null;
const modalImg     = document.getElementById("kmModalImg")     || null;
const modalTitle   = document.getElementById("kmModalTitle")   || null;
const modalDesc    = document.getElementById("kmModalDesc")    || null;
const modalSpecs   = document.getElementById("kmModalSpecs")   || null;
const modalTagsBox = document.getElementById("kmModalTags")    || null;

// ---------- UTILS ----------
function stripAccents(s){
  try { return (s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,""); }
  catch(e){ return (s||""); }
}
function norm(s){
  return stripAccents(s).toLowerCase().replace(/\s+/g," ").trim();
}
function getParam(name){
  try { return new URLSearchParams(window.location.search).get(name); }
  catch(e){ return null; }
}
function removeQueryParam(param){
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete(param);
    window.history.replaceState({}, "", url.toString());
  } catch(e){}
}

// categoria vinda da URL, ex.: ?cat=memoria
let preCatKey = norm(getParam("cat") || "");

// ---------- ESTADO ----------
let allProducts = [];
let activeCategory = null; // clique no filtro lateral
let activeMarca = null;

// ---------- MODAL ----------
function openModal(prod){
  if (!modalOverlay) return;
  if (modalTitle) modalTitle.textContent = prod.nome || "Produto KM";
  if (modalDesc)  modalDesc.textContent  = prod.descricaoDetalhada || prod.descricao || "Sem descrição disponível.";
  if (modalImg) {
    modalImg.src = prod.imagemURL || "assets/b1.svg";
    modalImg.alt = prod.nome || "Produto KM";
  }

  if (modalSpecs) {
    modalSpecs.innerHTML = "";
    if (prod.especificacoes) {
      if (Array.isArray(prod.especificacoes)) {
        prod.especificacoes.forEach(item => {
          const li = document.createElement("li");
          li.textContent = item;
          modalSpecs.appendChild(li);
        });
      } else if (typeof prod.especificacoes === "string") {
        prod.especificacoes.split(/\r?\n/).forEach(line => {
          if (!line.trim()) return;
          const li = document.createElement("li");
          li.textContent = line.trim();
          modalSpecs.appendChild(li);
        });
      } else if (typeof prod.especificacoes === "object") {
        Object.keys(prod.especificacoes).forEach(k => {
          const li = document.createElement("li");
          li.textContent = k + ": " + prod.especificacoes[k];
          modalSpecs.appendChild(li);
        });
      }
    } else {
      const li = document.createElement("li");
      li.textContent = "Sem especificações cadastradas.";
      modalSpecs.appendChild(li);
    }
  }

  if (modalTagsBox) {
    modalTagsBox.innerHTML = "";
    const tags = [];
    if (prod.categoria) tags.push(prod.categoria);
    if (prod.marca)     tags.push(prod.marca);
    if (prod.exclusivo) tags.push("Exclusivo");
    if (prod.novo)      tags.push("Item novo");
    tags.forEach(t => {
      const span = document.createElement("span");
      span.className = "km-tag-pill";
      span.textContent = t;
      modalTagsBox.appendChild(span);
    });
  }

  modalOverlay.style.display = "block";
  document.body.style.overflow = "hidden";
}
function closeModal(){
  if (!modalOverlay) return;
  modalOverlay.style.display = "none";
  document.body.style.overflow = "";
}
if (modalClose) modalClose.addEventListener("click", closeModal);
if (modalOverlay) {
  modalOverlay.addEventListener("click", (e)=>{
    if (e.target === modalOverlay) closeModal();
  });
}
document.addEventListener("keydown", (e)=>{
  if (e.key === "Escape") closeModal();
});

// ---------- RENDER DE PRODUTOS ----------
function renderProducts(arr){
  if (!listEl) return;
  listEl.innerHTML = "";

  if (arr.length === 0){
    listEl.innerHTML = "<p>Nenhum produto encontrado.</p>";
  } else {
    arr.forEach((p)=>{
      const card = document.createElement("article");
      card.className = "km-prod-card";
      card.innerHTML = `
        <div class="km-prod-card-img">
          <img src="${p.imagemURL || 'assets/b1.svg'}" alt="${p.nome || ''}">
        </div>
        <h3>${p.nome || 'Sem nome'}</h3>
        <p>${p.marca || ''} ${p.categoria ? '• '+p.categoria : ''}</p>
        <a href="#" class="km-prod-link" data-id="${p.id}">Ver mais</a>
      `;
      listEl.appendChild(card);
    });

    listEl.querySelectorAll(".km-prod-link").forEach(a=>{
      a.addEventListener("click", (ev)=>{
        ev.preventDefault();
        const id = a.getAttribute("data-id");
        const prod = allProducts.find(p => p.id === id);
        if (!prod) return;
        if (modalOverlay) {
          openModal(prod);
        } else {
          window.location.href = "produto.html?id=" + id;
        }
      });
    });
  }

  if (countEl) {
    countEl.textContent = arr.length + " produto(s) encontrado(s)";
  }
}

// ---------- FILTROS ----------
function renderFiltersFromData(produtos){
  if (!catEl || !marcaEl) return;
  const cats = new Set();
  const marcas = new Set();

  produtos.forEach(p=>{
    if (p.categoria) cats.add(p.categoria);
    if (p.marca)     marcas.add(p.marca);
  });

  // categorias
  catEl.innerHTML = "";
  cats.forEach(c=>{
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = c;
    if (activeCategory === c) btn.classList.add("active");
    btn.addEventListener("click", ()=>{
      activeCategory = (activeCategory === c) ? null : c;
      applyFilters();
    });
    li.appendChild(btn);
    catEl.appendChild(li);
  });

  // marcas
  marcaEl.innerHTML = "";
  marcas.forEach(m=>{
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = m;
    btn.addEventListener("click", ()=>{
      activeMarca = (activeMarca === m) ? null : m;
      applyFilters();
    });
    li.appendChild(btn);
    marcaEl.appendChild(li);
  });
}

// helper: recente (30 dias)
function isRecent(createdAt){
  if (!createdAt || !createdAt.toMillis) return false;
  const diff = Date.now() - createdAt.toMillis();
  return diff < 30*24*60*60*1000;
}

// ---------- APLICAR FILTROS ----------
function applyFilters(){
  let filtered = [...allProducts];

  // 1) categoria da URL (normalizada)
  if (preCatKey){
    filtered = filtered.filter(p => norm(p.categoria) === preCatKey);
  }
  // 2) filtros laterais explícitos
  if (activeCategory){
    filtered = filtered.filter(p => p.categoria === activeCategory);
  }
  if (activeMarca){
    filtered = filtered.filter(p => p.marca === activeMarca);
  }

  // 3) SELECTS (prioridade) — com negativos
  if (selEx && selEx.value){
    if (selEx.value === "exclusivos"){
      filtered = filtered.filter(p => p.exclusivo === true || p.tipo === "exclusivo");
    } else if (selEx.value === "comum"){
      filtered = filtered.filter(p => !(p.exclusivo === true || p.tipo === "exclusivo"));
    }
    // "todos" não restringe
  }
  if (selNv && selNv.value){
    if (selNv.value === "novos"){
      filtered = filtered.filter(p => p.novo === true || isRecent(p.createdAt));
    } else if (selNv.value === "padrao"){
      filtered = filtered.filter(p => !(p.novo === true || isRecent(p.createdAt)));
    }
    // "todos" não restringe
  }

  // 4) Fallback: se alguém marcar os checkboxes escondidos, ainda funciona
  if (chkExcl && chkExcl.checked){
    filtered = filtered.filter(p => p.exclusivo === true || p.tipo === "exclusivo");
  }
  if (chkNovo && chkNovo.checked){
    filtered = filtered.filter(p => p.novo === true || isRecent(p.createdAt));
  }

  renderProducts(filtered);
}

// eventos para selects
if (selEx) selEx.addEventListener("change", applyFilters);
if (selNv) selNv.addEventListener("change", applyFilters);

// checkboxes (fallback)
if (chkExcl) chkExcl.addEventListener("change", applyFilters);
if (chkNovo) chkNovo.addEventListener("change", applyFilters);

// limpar filtros
if (btnClear) btnClear.addEventListener("click", ()=>{
  activeCategory = null;
  activeMarca = null;

  if (chkExcl) chkExcl.checked = false;
  if (chkNovo) chkNovo.checked = false;

  if (selEx) selEx.value = "todos";
  if (selNv) selNv.value = "todos";

  preCatKey = "";
  removeQueryParam("cat");

  renderProducts(allProducts);
});

// ---------- SNAPSHOT ----------
db.collection("produtos")
  .orderBy("createdAt", "desc")
  .onSnapshot((snap)=>{
    allProducts = [];
    snap.forEach(doc=>{
      const p = doc.data();
      p.id = doc.id;
      allProducts.push(p);
    });

    renderFiltersFromData(allProducts);

    const temFiltroLigado =
      preCatKey ||
      activeCategory ||
      activeMarca ||
      (selEx && selEx.value !== "todos") ||
      (selNv && selNv.value !== "todos") ||
      (chkExcl && chkExcl.checked) ||
      (chkNovo && chkNovo.checked);

    if (temFiltroLigado){
      applyFilters();
    } else {
      renderProducts(allProducts);
    }
  });
