(() => {
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
fetch('/api/site').then(r=>r.ok?r.json():null).then(data=>{
 if(!data)return;
 const s=data.settings||{};
 if(s.name)document.querySelectorAll('.brand-copy').forEach(el=>{el.innerHTML=esc(s.name.toUpperCase())+'<small>STUDIO</small>'});
 if(s.location)document.querySelectorAll('[data-location]').forEach(el=>el.textContent=s.location);
 if(s.whatsapp){const digits=s.whatsapp.replace(/\D/g,'');document.querySelectorAll('a[href^="https://wa.me/"]').forEach(el=>{el.href='https://wa.me/'+digits});document.querySelectorAll('[data-whatsapp]').forEach(el=>{el.href='https://wa.me/'+digits;el.textContent=s.whatsapp})}
 if(s.tiktok)document.querySelectorAll('a[href*="tiktok.com"]').forEach(el=>el.href=s.tiktok);
 if(s.tagline){const el=document.querySelector('[data-tagline]');if(el)el.textContent=s.tagline}
 if(s.primary)document.documentElement.style.setProperty('--wine',s.primary);
 if(s.accent)document.documentElement.style.setProperty('--gold',s.accent);
 if(s.background)document.documentElement.style.setProperty('--ivory',s.background);
 const services=document.querySelector('#publishedServices');
 if(services){if(data.services?.length){services.innerHTML='<div class="section-tag"><span>STUDIO MENU</span><span>OWNER-PUBLISHED SERVICES</span></div><div class="section-head"><h2 class="section-title">The studio<br><em>service menu.</em></h2><p>Published by the studio. Confirm current availability and final details before booking.</p></div><div class="service-grid">'+data.services.map(x=>'<article class="service-card">'+(x.image_url?'<div class="service-image"><img src="'+esc(x.image_url)+'" alt="'+esc(x.name)+'" loading="lazy"></div>':'')+'<div class="service-info"><div><p class="eyebrow">'+esc(x.category)+'</p><h3>'+esc(x.name)+'</h3><p>'+esc(x.description)+'</p>'+(x.price_amount!==null?'<strong>PKR '+Number(x.price_amount).toLocaleString('en-PK')+'</strong>':'<span class="note">'+esc(x.price_note||'Ask the studio for pricing.')+'</span>')+'</div><a class="round-link" href="#booking" data-interest="'+esc(x.name)+'">↗</a></div></article>').join('')+'</div>'} }
 const offers=document.querySelector('#publishedOffers');
 if(offers&&data.offers?.length){offers.innerHTML='<div class="section-tag"><span>STUDIO OFFERS</span><span>OWNER-PUBLISHED</span></div><div class="section-head"><h2 class="section-title">A little extra<br><em>for your moment.</em></h2></div><div class="service-grid">'+data.offers.map(x=>'<article class="service-card"><div class="service-info"><div><p class="eyebrow">CURRENT OFFER</p><h3>'+esc(x.title)+'</h3><p>'+esc(x.details)+'</p></div></div></article>').join('')+'</div>'}
 const gallery=document.querySelector('#publishedGallery');
 if(gallery&&data.gallery?.length){gallery.innerHTML='<div class="gallery-grid">'+data.gallery.map(x=>'<figure><img src="'+esc(x.image_url)+'" alt="'+esc(x.title)+'" loading="lazy"><figcaption class="note">'+esc(x.title)+' · '+(x.is_real_studio_work?'Studio work':'Editorial inspiration')+'</figcaption></figure>').join('')+'</div>'}
}).catch(()=>{});
})();