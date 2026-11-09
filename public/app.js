(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const toggle = $('#menuToggle'), nav = $('#mainNav');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); toggle?.setAttribute('aria-expanded','false'); if(toggle)toggle.textContent='☰';
  }));
  $('#year') && ($('#year').textContent = new Date().getFullYear());
  document.querySelectorAll('[data-interest]').forEach(a => a.addEventListener('click', () => {
    const field = $('[name="interest"]'); if(field) { const value=a.dataset.interest; if(![...field.options].some(o=>o.value===value)){const opt=document.createElement('option');opt.value=value;opt.textContent=value;field.appendChild(opt)} field.value=value; }
  }));
  const form = $('#bookingForm');
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const status = $('#formStatus');
    if(!data.name.trim() || !data.phone.trim() || !data.interest) {
      status.textContent = 'Please add your name, WhatsApp number and enquiry type.'; return;
    }
    const message = [
      'Hello Makeup & Nails Studio, I would like to make an appointment enquiry.',
      'Name: '+data.name, 'WhatsApp: '+data.phone, 'Enquiry: '+data.interest,
      data.date ? 'Preferred date: '+data.date : '', data.notes ? 'Notes: '+data.notes : '',
      'Please confirm current service availability, price and appointment time.'
    ].filter(Boolean).join('\n');
    status.textContent = 'Opening WhatsApp. Your appointment is not confirmed until the studio replies.';
    const url = 'https://wa.me/923175545583?text='+encodeURIComponent(message);
    window.open(url,'_blank','noopener');
    try {
      await fetch('/api/bookings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    } catch (_) { /* WhatsApp enquiry still works if logging is unavailable. */ }
  });
})();