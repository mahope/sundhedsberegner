(function(){
  try{
    var KEY = 'sb_cookie_consent_v1';
    if (!localStorage.getItem(KEY)) {
      var bar = document.createElement('div');
      bar.innerHTML = '\n      <div style="position:fixed;left:0;right:0;bottom:0;z-index:9999">\n        <div style="max-width:1100px;margin:0 auto;padding:12px 16px">\n          <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:12px 16px;box-shadow:0 10px 30px rgba(0,0,0,.08);display:flex;gap:12px;align-items:center;justify-content:space-between">\n            <div style="font-size:14px;color:#111827">\n              <div style="font-weight:600;margin-bottom:4px">Cookies og privatliv</div>\n              <div>Vi sætter normalt ikke cookies. Hvis annoncer senere aktiveres (efter AdSense-godkendelse), bruges cookies kun efter dit samtykke. Læs mere i <a href="/cookiepolitik" style="color:#2563eb;text-decoration:underline">cookiepolitikken</a> og <a href="/privatlivspolitik" style="color:#2563eb;text-decoration:underline">privatlivspolitikken</a>.</div>\n            </div>\n            <div style="display:flex;gap:8px;white-space:nowrap">\n              <button id="sb-consent-decline" style="padding:8px 12px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;color:#111827">Afvis</button>\n              <button id="sb-consent-accept" style="padding:8px 12px;border-radius:8px;background:#2563eb;color:#fff">Accepter</button>\n            </div>\n          </div>\n        </div>\n      </div>';
      document.body.appendChild(bar);
      var done = function(){ localStorage.setItem(KEY, JSON.stringify({date:Date.now(), ads:false})); bar.remove(); };
      document.getElementById('sb-consent-accept').onclick = done;
      document.getElementById('sb-consent-decline').onclick = done;
    }
  }catch(e){}
})();
