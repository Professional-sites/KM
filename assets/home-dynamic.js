/* assets/home-dynamic.js
   - Preenche o carrossel do destaque com produtos exclusivos
   - Mostra imagem representativa em cada card de categoria
*/

(function () {
  // ---- Firebase (v8) ----
  if (!window.firebase) return;
  if (!firebase.apps.length) firebase.initializeApp(window.firebaseConfig || firebaseConfig);
  var db = firebase.firestore();

  // -----------------------------
  //  A) CARROSSEL DE EXCLUSIVOS
  // -----------------------------
  var track = document.getElementById('heroTrack');   // <div id="heroTrack" class="hero-track">
  var dots  = document.getElementById('heroDots');    // <div id="heroDots"  class="hero-dots">
  var prev  = document.querySelector('.hero-prev');   // botões já existentes
  var next  = document.querySelector('.hero-next');

  var slides = [];
  var activeIndex = 0;
  var autoTimer = null;

  function buildHero(exclusivos) {
    if (!track || !dots) return;
    // se não achou exclusivos, mantém os slides que já existem
    if (!exclusivos || exclusivos.length === 0) return;

    // limpa UI
    track.innerHTML = '';
    dots.innerHTML = '';
    slides = [];

    exclusivos.forEach(function (p, i) {
      // slide
      var s = document.createElement('div');
      s.className = 'hero-slide';
      var a = document.createElement('a');
      a.href = 'produtos.html?exclusivo=1'; // manda pra lista filtrada
      var img = document.createElement('img');
      img.src = p.imagemURL || 'assets/b1.svg';
      img.alt = p.nome || 'Exclusivo';
      a.appendChild(img);
      s.appendChild(a);
      track.appendChild(s);
      slides.push(s);

      // dot
      var d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('aria-label', 'Ir para slide ' + (i + 1));
      d.addEventListener('click', function () { goTo(i); });
      dots.appendChild(d);
    });

    goTo(0);
    startAuto();
  }

  function goTo(i) {
    activeIndex = (i + slides.length) % slides.length;
    // movimenta trilha
    var offset = -activeIndex * 100;
    track.style.transform = 'translateX(' + offset + '%)';

    // dots ativos
    Array.prototype.forEach.call(dots.children, function (btn, idx) {
      if (idx === activeIndex) btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }

  function nextSlide() { goTo(activeIndex + 1); }
  function prevSlide() { goTo(activeIndex - 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(nextSlide, 5000);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  if (next) next.addEventListener('click', function () { stopAuto(); nextSlide(); startAuto(); });
  if (prev) prev.addEventListener('click', function () { stopAuto(); prevSlide(); startAuto(); });

  // Busca “exclusivo = true”
  db.collection('produtos')
    .where('exclusivo', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(12)
    .get()
    .then(function (snap) {
      var arr = [];
      snap.forEach(function (doc) {
        var p = doc.data(); p.id = doc.id;
        arr.push(p);
      });
      buildHero(arr);
    })
    .catch(function (e) {
      console.warn('Exclusivos (hero) falharam:', e);
    });

  // ---------------------------------------------------
  //  B) IMAGENS NOS CARDS DE CATEGORIA + CLICK -> FILTRO
  // ---------------------------------------------------
  // Espera-se cards com: <a class="km-cat" data-cat="Placas-mãe"><img ...><h3>Placas-mãe</h3></a>
  var catCards = document.querySelectorAll('.km-cat[data-cat]');
  if (catCards.length) {
    // busca alguns produtos pra ter amostras recentes por categoria
    db.collection('produtos')
      .orderBy('createdAt', 'desc')
      .limit(120)
      .get()
      .then(function (snap) {
        var byCat = new Map(); // categoria -> produto mais recente com imagem
        snap.forEach(function (doc) {
          var p = doc.data(); p.id = doc.id;
          if (!p.categoria) return;
          if (!p.imagemURL) return;
          if (!byCat.has(p.categoria)) byCat.set(p.categoria, p);
        });

        catCards.forEach(function (card) {
          var cat = card.getAttribute('data-cat') || '';
          // imagem do card
          var img = card.querySelector('img');
          var sample = byCat.get(cat) || null;
          if (sample && img) {
            img.src = sample.imagemURL;
            img.alt = sample.nome || cat;
          }
          // clique -> produtos.html com filtro
          card.addEventListener('click', function (e) {
            e.preventDefault();
            var url = 'produtos.html?cat=' + encodeURIComponent(cat);
            window.location.href = url;
          });
        });
      })
      .catch(function (e) {
        console.warn('Categorias (amostras) falharam:', e);
      });
  }
})();
