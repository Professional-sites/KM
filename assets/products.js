// assets/products.js
console.log("[KM] products.js (firestore + filtro + imagem + modal) carregado");

(function () {
  if (typeof firebase === "undefined" || !firebase.firestore) {
    console.error("[KM] Firebase não foi carregado na página de produtos.");
    return;
  }

  // 🔴 troque aqui se o bucket mudar
  const STORAGE_BUCKET = "km-login-8e59c.firebasestorage.app";
  const db = firebase.firestore();

  // DOM base
  const listEl   = document.getElementById("kmProdList");
  const countEl  = document.getElementById("kmProdCount");
  const catsListEl   = document.getElementById("kmFilterCatsList");
  const brandsListEl = document.getElementById("kmFilterBrandsList");
  const typesListEl  = document.getElementById("kmFilterTypesList");
  const clearBtn     = document.getElementById("kmClearFilters");
  const searchInput  = document.getElementById("kmSearch");
  const searchBtn    = document.getElementById("kmSearchBtn");

  // modal DOM
  const modalOverlay = document.getElementById("kmModalOverlay");
  const modalClose   = document.getElementById("kmModalClose");
  const modalImg     = document.getElementById("kmModalImg");
  const modalTitle   = document.getElementById("kmModalTitle");
  const modalDesc    = document.getElementById("kmModalDesc");
  const modalSpecs   = document.getElementById("kmModalSpecs");
  const modalTags    = document.getElementById("kmModalTags");

  function normalize(text) {
    if (!text) return "";
    return text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .replace(/\s+/g, " ");
  }

  // pega ?cat=... da url
  const params = new URLSearchParams(location.search);
  const catFromUrl = normalize(params.get("cat"));

  let allProducts = [];
  const productMap = {}; // id -> produto
  const filters = {
    categoria: catFromUrl || null,
    marca: null,
    tipo: null,
    search: null,
  };

  // modal
  function openProductModal(id) {
    const p = productMap[id];
    if (!p) return;

    // imagem
    modalImg.src = p.__imgResolved || "assets/b1.svg";
    modalImg.alt = p.nome || "Produto KM";

    // texto
    modalTitle.textContent = p.nome || "Produto KM";
    modalDesc.textContent = p.descricaoDetalhada || p.desc || p.descricao || "Produto do catálogo KM.";

    // especificações
    modalSpecs.innerHTML = "";
    if (p.especificacoes) {
      if (Array.isArray(p.especificacoes)) {
        p.especificacoes.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          modalSpecs.appendChild(li);
        });
      } else if (typeof p.especificacoes === "string") {
        // quebra por ; ou por quebra de linha
        p.especificacoes
          .split(/[\n;]+/)
          .map((s) => s.trim())
          .filter((s) => s.length)
          .forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            modalSpecs.appendChild(li);
          });
      }
    } else {
      const li = document.createElement("li");
      li.textContent = "Sem especificações cadastradas.";
      modalSpecs.appendChild(li);
    }

    // tags
    modalTags.innerHTML = "";
    if (p.categoria) {
      const t = document.createElement("span");
      t.className = "km-tag";
      t.textContent = p.categoria;
      modalTags.appendChild(t);
    }
    if (p.marca) {
      const t = document.createElement("span");
      t.className = "km-tag";
      t.textContent = p.marca;
      modalTags.appendChild(t);
    }
    if (p.exclusivo) {
      const t = document.createElement("span");
      t.className = "km-tag km-exclusive";
      t.textContent = "Exclusivo";
      modalTags.appendChild(t);
    }
    if (p.novo) {
      const t = document.createElement("span");
      t.className = "km-tag km-new";
      t.textContent = "Novo";
      modalTags.appendChild(t);
    }
    if (p.tags) {
      // se tiver tags extras
      (Array.isArray(p.tags) ? p.tags : p.tags.toString().split(",")).forEach((tg) => {
        const t = document.createElement("span");
        t.className = "km-tag";
        t.textContent = tg.trim();
        modalTags.appendChild(t);
      });
    }

    modalOverlay.style.display = "flex";
  }

  function closeProductModal() {
    modalOverlay.style.display = "none";
  }

  modalClose && modalClose.addEventListener("click", closeProductModal);
  modalOverlay && modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeProductModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProductModal();
  });

  function buildFilterButtons(container, items, key) {
    if (!container) return;
    container.innerHTML = "";
    items.forEach((val) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = val;
      btn.addEventListener("click", () => {
        filters[key] = normalize(val);
        renderList();
      });
      li.appendChild(btn);
      container.appendChild(li);
    });
  }

  // cria um card
  function createCard(p) {
    const card = document.createElement("article");
    card.className = "km-prod-card";

    const imgBox = document.createElement("div");
    imgBox.className = "km-prod-card-img";
    const img = document.createElement("img");
    img.src = p.__imgResolved || "assets/b1.svg";
    img.alt = p.nome || "Produto KM";
    imgBox.appendChild(img);

    const title = document.createElement("h3");
    title.textContent = p.nome || "Produto KM";

    const meta = document.createElement("p");
    meta.textContent = [p.marca, p.categoria].filter(Boolean).join(" • ");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "km-prod-btn";
    btn.textContent = "Ver mais";
    btn.style.background = "#0f3f74";
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.borderRadius = "999px";
    btn.style.padding = "6px 14px";
    btn.style.fontSize = ".75rem";
    btn.style.cursor = "pointer";
    btn.dataset.id = p.id;
    btn.addEventListener("click", () => openProductModal(p.id));

    card.appendChild(imgBox);
    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(btn);

    return card;
  }

  function renderList() {
    if (!listEl) return;

    let results = allProducts.slice();

    if (filters.categoria) {
      results = results.filter(
        (p) => normalize(p.categoria) === filters.categoria
      );
    }
    if (filters.marca) {
      results = results.filter((p) => normalize(p.marca) === filters.marca);
    }
    if (filters.tipo) {
      results = results.filter((p) => normalize(p.tipo) === filters.tipo);
    }
    if (filters.search) {
      const s = filters.search;
      results = results.filter(
        (p) =>
          (p.nome && p.nome.toLowerCase().includes(s)) ||
          (p.desc && p.desc.toLowerCase().includes(s)) ||
          (p.descricao && p.descricao.toLowerCase().includes(s))
      );
    }

    if (countEl) {
      countEl.textContent = `${results.length} produto(s) encontrado(s)`;
    }

    listEl.innerHTML = "";
    results.forEach((p) => listEl.appendChild(createCard(p)));
  }

  // busca
  function doSearch() {
    if (!searchInput) return;
    const v = searchInput.value.trim().toLowerCase();
    filters.search = v || null;
    renderList();
  }
  if (searchBtn) searchBtn.addEventListener("click", doSearch);
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") doSearch();
    });
  }

  // limpar filtros
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      filters.categoria = null;
      filters.marca = null;
      filters.tipo = null;
      filters.search = null;
      if (searchInput) searchInput.value = "";
      renderList();
    });
  }

  // 🔥 ouvir o Firestore
  db.collection("produtos").onSnapshot(
    (snap) => {
      const temp = [];
      snap.forEach((doc) => {
        const data = doc.data() || {};
        let img =
          data.imgUrl ||
          data.imagemUrl ||
          data.img ||
          data.foto ||
          data.image ||
          "";

        // se vier só o nome do arquivo, monta a URL do Storage
        if (img && !img.startsWith("http")) {
          img =
            "https://firebasestorage.googleapis.com/v0/b/" +
            STORAGE_BUCKET +
            "/o/" +
            encodeURIComponent(img) +
            "?alt=media";
        }

        const prod = {
          id: doc.id,
          ...data,
          __imgResolved: img,
        };

        temp.push(prod);
        productMap[doc.id] = prod;
      });

      allProducts = temp;

      // filtros dinâmicos
      const catSet = new Set();
      const brandSet = new Set();
      const typeSet = new Set();

      allProducts.forEach((p) => {
        if (p.categoria) catSet.add(p.categoria);
        if (p.marca) brandSet.add(p.marca);
        if (p.tipo) typeSet.add(p.tipo);
      });

      buildFilterButtons(catsListEl, catSet, "categoria");
      buildFilterButtons(brandsListEl, brandSet, "marca");
      buildFilterButtons(typesListEl, typeSet, "tipo");

      renderList();
    },
    (err) => {
      console.error("[KM] erro ao ouvir produtos:", err);
    }
  );
})();
