/* ===== HOME KM ===== */
:root{
  --km-bg: #edf2f7;
  --km-primary: #0f3b68;
  --km-primary-soft: rgba(15,59,104,.06);
  --km-accent: #0f74c5;
  --km-dark: #0f172a;
}

body{
  background: var(--km-bg);
}

.km-topbar{
  position: fixed;
  top:0; left:0; right:0;
  background:#fff;
  box-shadow:0 6px 20px rgba(0,0,0,.03);
  z-index:1000;
}
.km-topbar-inner{
  display:flex;
  align-items:center;
  justify-content:space-between;
  max-width:1100px;
  margin:0 auto;
  padding:11px 14px 4px;
}
.km-logo img{
  height:32px;
}
.km-hamburger{
  width:42px; height:32px;
  background:transparent;
  border:none;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  cursor:pointer;
}
.km-hamburger span{
  display:block;
  height:3px;
  background: var(--km-primary);
  border-radius:999px;
}
.km-search-wrap{
  max-width:1100px;
  margin:0 auto;
  padding:4px 14px 10px;
  display:flex;
  gap:7px;
}
.km-search-wrap input{
  flex:1;
  height:43px;
  border-radius:999px;
  border:none;
  background:#eff4f7;
  padding:0 16px;
  outline:none;
  font-size:14px;
}
.km-search-wrap button{
  width:44px;
  height:43px;
  border:none;
  border-radius:999px;
  background: var(--km-primary);
  color:#fff;
  font-size:18px;
}

/* página */
.km-page{
  max-width:1100px;
  margin:0 auto;
  padding:140px 14px 48px;
}

/* hero */
.km-hero{
  background: linear-gradient(160deg, #102338 0%, #165a91 75%);
  border-radius:32px;
  overflow:hidden;
  display:grid;
  grid-template-columns:1.1fr .9fr;
  min-height:260px;
  margin-bottom:24px;
  color:#fff;
}
.km-hero-img img{
  width:100%;
  height:100%;
  object-fit:cover;
}
.km-hero-content{
  padding:26px 22px 24px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  gap:8px;
}
.km-hero-over{
  font-size:11px;
  text-transform:uppercase;
  letter-spacing:.12em;
  opacity:.7;
}
.km-hero h1{
  font-size:1.7rem;
  margin:0;
}
.km-hero-text{
  opacity:.82;
}
.km-btn{
  margin-top:10px;
  background:#fff;
  color:var(--km-primary);
  border-radius:999px;
  padding:7px 15px;
  font-weight:600;
  width:fit-content;
  text-decoration:none;
}

/* categorias */
.km-cats{
  margin-bottom:24px;
}
.km-cats-head{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:9px;
}
.km-cats-head h2{
  margin:0;
  font-size:1.3rem;
  color:var(--km-dark);
}
.km-cats-arrows button{
  width:30px; height:30px;
  border:none;
  border-radius:999px;
  background:rgba(15,59,104,.08);
  cursor:pointer;
}
.km-cats-track{
  display:flex;
  gap:12px;
  overflow-x:auto;
  scroll-behavior:smooth;
  padding-bottom:6px;
}
.km-cats-track::-webkit-scrollbar{ height:4px; }
.km-cat{
  background:#fff;
  min-width:110px;
  border-radius:20px;
  padding:10px 10px 13px;
  text-align:center;
  box-shadow:0 3px 12px rgba(0,0,0,.03);
}
.km-cat img{
  width:78px; height:78px;
  object-fit:contain;
  margin:0 auto 5px;
  display:block;
}
.km-cat h3{
  font-size:13px;
  margin:0;
}

/* banners */
.km-banners{
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(230px,1fr));
  gap:16px;
  margin-bottom:26px;
}
.km-banner{
  border-radius:24px;
  padding:16px 16px 14px;
  color:#fff;
}
.km-banner-blue{ background:#165a91; }
.km-banner-dark{ background:#0f172a; }
.km-tag{
  text-transform:uppercase;
  font-size:11px;
  letter-spacing:.12em;
  opacity:.75;
}
.km-banner h2{
  margin:5px 0 10px;
  font-size:1.25rem;
}
.km-link{
  color:#fff;
  text-decoration:underline;
  font-weight:500;
}

/* seções de produtos */
.km-section{
  margin-bottom:30px;
}
.km-section-head{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:12px;
}
.km-section-head h2{
  margin:0;
  font-size:1.35rem;
  color:var(--km-dark);
}
.km-link-inline{
  color:var(--km-primary);
  text-decoration:none;
  font-weight:500;
}

/* grid de produtos */
.km-prod-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(170px,1fr));
  gap:14px;
}
.km-prod{
  background:#fff;
  border-radius:18px;
  padding:10px 10px 14px;
  box-shadow:0 4px 14px rgba(0,0,0,.02);
  display:flex;
  flex-direction:column;
  gap:5px;
}
.km-prod-img{
  width:100%;
  height:130px;
  background:#edf2f7;
  border-radius:14px;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
}
.km-prod-img img{
  width:100%;
  height:100%;
  object-fit:contain;
}
.km-prod-title{
  font-weight:600;
  font-size:14px;
}
.km-prod-cat{
  font-size:12px;
  color:#6b7280;
}
.km-prod a{
  background:var(--km-primary);
  color:#fff;
  border-radius:999px;
  padding:5px 10px;
  font-size:12px;
  text-decoration:none;
  width:fit-content;
  margin-top:3px;
}

/* drawer */
.km-drawer{
  position:fixed;
  top:0; left:0;
  width:78vw;
  max-width:320px;
  height:100vh;
  background:#fff;
  box-shadow:4px 0 25px rgba(0,0,0,.12);
  transform:translateX(-100%);
  transition:transform .28s ease;
  z-index:1300;
  display:flex;
  flex-direction:column;
}
.km-drawer.open{ transform:translateX(0); }
.km-drawer-head{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:16px 16px 8px;
  border-bottom:1px solid rgba(0,0,0,.05);
}
.km-drawer-head img{ height:38px; }
.km-drawer-head button{
  background:transparent;
  border:none;
  font-size:26px;
  cursor:pointer;
}
.km-drawer-nav{
  display:flex;
  flex-direction:column;
  padding:14px 8px;
}
.km-drawer-nav a{
  padding:10px 10px;
  border-radius:10px;
  text-decoration:none;
  color:#0f172a;
}
.km-drawer-nav a:hover{ background:rgba(15,59,104,.07); }

.km-overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.25);
  z-index:1200;
  opacity:0;
  pointer-events:none;
  transition:opacity .28s ease;
}
.km-overlay.show{
  opacity:1;
  pointer-events:auto;
}

.km-footer{
  text-align:center;
  padding:30px 14px 20px;
  font-size:13px;
  color:#475569;
}

/* mobile */
@media (max-width: 820px){
  .km-hero{ grid-template-columns:1fr; }
  .km-hero-img img{ height:170px; }
  .km-page{ padding-inline:10px; }
}
