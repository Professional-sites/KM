// assets/admin.js

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// sempre pedir login
auth.setPersistence(firebase.auth.Auth.Persistence.NONE);
auth.signOut();

const loginBox = document.getElementById("loginBox");
const adminArea = document.getElementById("adminArea");
const adminGrid = document.getElementById("adminGrid");
const msg = document.getElementById("msg");
const btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  try {
    await auth.signInWithEmailAndPassword(email, senha);
    msg.textContent = "";
  } catch (e) {
    msg.textContent = e.message;
  }
});

auth.onAuthStateChanged((user) => {
  console.log("auth state:", user);
  if (user) {
    loginBox.style.display = "none";
    adminArea.style.display = "block";
    montarBancos();
  } else {
    adminArea.style.display = "none";
    loginBox.style.display = "block";
  }
});

function montarBancos(){
  if (adminGrid.dataset.built === "1") return;
  let html = "";
  for (let i = 1; i <= 200; i++) {
    html += `
      <div class="km-admin-card" data-idx="${i}">
        <h3>Item ${i}</h3>
        <label>Nome</label>
        <input type="text" class="f-nome" placeholder="Ex: Placa-mãe...">
        <label>Descrição detalhada</label>
        <textarea class="f-descricao"></textarea>
        <label>Especificações</label>
        <textarea class="f-especificacoes" placeholder="Ex: Socket LGA1200; 4x RAM; ..."></textarea>
        <label>Imagem</label>
        <input type="file" class="f-imagem" accept="image/*">
        <label>Tags (separadas por vírgula)</label>
        <input type="text" class="f-tags" placeholder="placa-mae, gamer">
        <div style="display:flex;gap:8px;">
          <div style="flex:1;">
            <label>Exclusivo?</label>
            <select class="f-exclusivo">
              <option value="normal">Normal</option>
              <option value="exclusivo">Exclusivo</option>
            </select>
          </div>
          <div style="flex:1;">
            <label>Item novo?</label>
            <select class="f-novo">
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>
        </div>
        <label>Marca</label>
        <input type="text" class="f-marca" placeholder="Ex: ASUS">
        <label>Categoria</label>
        <input type="text" class="f-categoria" placeholder="Ex: placa-mae">
        <div class="km-actions">
          <button class="km-btn blue btn-salvar" type="button">Salvar</button>
          <button class="km-btn red btn-limpar" type="button">Limpar</button>
        </div>
        <p class="km-status"></p>
      </div>
    `;
  }
  adminGrid.innerHTML = html;
  adminGrid.dataset.built = "1";

  adminGrid.querySelectorAll(".km-admin-card").forEach((card) => {
    const btnSalvar = card.querySelector(".btn-salvar");
    const btnLimpar = card.querySelector(".btn-limpar");
    const status = card.querySelector(".km-status");

    btnSalvar.addEventListener("click", async () => {
      status.textContent = "Salvando...";
      const nome = card.querySelector(".f-nome").value.trim();
      const descricao = card.querySelector(".f-descricao").value.trim();
      const especificacoes = card.querySelector(".f-especificacoes").value.trim();
      const tagsRaw = card.querySelector(".f-tags").value.trim();
      const exclusivo = card.querySelector(".f-exclusivo").value === "exclusivo";
      const novo = card.querySelector(".f-novo").value === "sim";
      const marca = card.querySelector(".f-marca").value.trim();
      const categoria = card.querySelector(".f-categoria").value.trim();
      const fileInput = card.querySelector(".f-imagem");

      let imagemURL = null;

      try{
        if (fileInput.files && fileInput.files[0]) {
          const file = fileInput.files[0];
          const ref = storage.ref().child("produtos/" + Date.now() + "-" + file.name);
          await ref.put(file);
          imagemURL = await ref.getDownloadURL();
        }

        const doc = {
          nome: nome || "Produto sem nome",
          descricao,
          especificacoes,
          tags: tagsRaw ? tagsRaw.split(",").map(t => t.trim().toLowerCase()) : [],
          exclusivo,
          novo,
          marca,
          categoria,
          imagemURL: imagemURL || null,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection("produtos").add(doc);
        status.textContent = "✅ Salvo! Já aparece nas páginas.";
      }catch(err){
        console.error(err);
        status.textContent = "Erro: " + err.message;
      }
    });

    btnLimpar.addEventListener("click", () => {
      card.querySelector(".f-nome").value = "";
      card.querySelector(".f-descricao").value = "";
      card.querySelector(".f-especificacoes").value = "";
      card.querySelector(".f-tags").value = "";
      card.querySelector(".f-marca").value = "";
      card.querySelector(".f-categoria").value = "";
      card.querySelector(".f-imagem").value = "";
      status.textContent = "Limpo.";
    });
  });
}
