
window.I18N = {
  pt: {
    brand: "CATÁLOGO",
    search_placeholder: "Pesquisar...",
    nav_home: "Voltar ao início",
    nav_about: "Sobre nós",
    nav_products: "Produtos",
    nav_where: "Onde comprar",
    nav_warranty: "Garantia",
    hero_new: "Novidades",
    featured_title: "Produtos em destaque",
    new_products_title: "Novos produtos",
    new_brands_title: "Novas marcas",
    newsletter_title: "Assine nossa newsletter",
    newsletter_desc: "Receba novidades, lançamentos e ofertas no seu e-mail.",
    newsletter_email: "Seu e-mail",
    newsletter_button: "Quero receber",
    products_all: "Todos os produtos",
    filters_title: "Filtros",
    filter_type: "Tipo",
    filter_brand: "Marca",
    filter_price: "Preço",
    price_min: "Mín.",
    price_max: "Máx.",
    apply: "Aplicar",
    count_suffix: "produtos",
    keywords_placeholder: "Palavras-chave (ex.: nvme, ddr5, 1tb)"
  },
  en: {
    brand: "CATALOG",
    search_placeholder: "Search...",
    nav_home: "Back to home",
    nav_about: "About us",
    nav_products: "Products",
    nav_where: "Where to buy",
    nav_warranty: "Warranty",
    hero_new: "New arrivals",
    featured_title: "Featured products",
    new_products_title: "New products",
    new_brands_title: "New brands",
    newsletter_title: "Subscribe to our newsletter",
    newsletter_desc: "Get news, launches and deals by email.",
    newsletter_email: "Your email",
    newsletter_button: "Subscribe",
    products_all: "All products",
    filters_title: "Filters",
    filter_type: "Type",
    filter_brand: "Brand",
    filter_price: "Price",
    price_min: "Min.",
    price_max: "Max.",
    apply: "Apply",
    count_suffix: "products",
    keywords_placeholder: "Keywords (e.g., nvme, ddr5, 1tb)"
  },
  es: {
    brand: "CATÁLOGO",
    search_placeholder: "Buscar...",
    nav_home: "Volver al inicio",
    nav_about: "Sobre nosotros",
    nav_products: "Productos",
    nav_where: "Dónde comprar",
    nav_warranty: "Garantía",
    hero_new: "Novedades",
    featured_title: "Productos destacados",
    new_products_title: "Productos nuevos",
    new_brands_title: "Marcas nuevas",
    newsletter_title: "Suscríbete al boletín",
    newsletter_desc: "Recibe noticias, lanzamientos y ofertas por correo.",
    newsletter_email: "Tu correo",
    newsletter_button: "Suscribirme",
    products_all: "Todos los productos",
    filters_title: "Filtros",
    filter_type: "Tipo",
    filter_brand: "Marca",
    filter_price: "Precio",
    price_min: "Mín.",
    price_max: "Máx.",
    apply: "Aplicar",
    count_suffix: "productos",
    keywords_placeholder: "Palabras clave (p.ej., nvme, ddr5, 1tb)"
  }
};

(function(){
  const saved = localStorage.getItem('lang') || 'pt';
  function applyLang(lang){
    const dict = window.I18N[lang] || window.I18N.pt;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(dict[key]!==undefined){
        if(el.placeholder !== undefined && el.tagName==='INPUT'){
          el.placeholder = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });
    // inputs with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const key = el.getAttribute('data-i18n-placeholder');
      if(dict[key]!==undefined){
        el.placeholder = dict[key];
      }
    });
  }
  window.setLang = function(lang){
    localStorage.setItem('lang', lang);
    applyLang(lang);
  };
  window.addEventListener('DOMContentLoaded', ()=> applyLang(saved));
})();
