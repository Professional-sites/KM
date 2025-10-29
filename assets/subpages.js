
document.addEventListener('DOMContentLoaded', ()=>{
  const hb = document.querySelector('.hamburger');
  const menu = document.querySelector('.menu');
  if(hb && menu){
    hb.addEventListener('click', (ev)=>{ ev.stopPropagation(); menu.classList.toggle('open'); });
    document.addEventListener('click', (e)=>{
      if(menu.classList.contains('open') && !menu.contains(e.target) && !hb.contains(e.target)){
        menu.classList.remove('open');
      }
    });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') menu.classList.remove('open'); });
  }
  // Header transparency on scroll
  const wrap = document.querySelector('.header-wrap');
  const onScroll = ()=>{ if(wrap) wrap.classList.toggle('scrolled', window.scrollY>30); };
  onScroll(); window.addEventListener('scroll', onScroll);
});
