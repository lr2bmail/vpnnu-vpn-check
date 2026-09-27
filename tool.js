(() => {
  const root = document.querySelector('[data-tool="vpn-check"]');
  if (!root) return;
  const en = root.dataset.lang === 'en';
  const key = 'vpnnu-vpn-check-before';
  const current = root.querySelector('[data-current-ip]');
  const country = root.querySelector('[data-current-country]');
  const saved = root.querySelector('[data-saved-ip]');
  const savedCountry = root.querySelector('[data-saved-country]');
  const result = root.querySelector('[data-vpn-result]');
  let latest = null;

  function readSaved() {
    try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (_) { return null; }
  }
  function showSaved() {
    const before = readSaved();
    saved.textContent = before?.ip || '—';
    savedCountry.textContent = before?.country || '';
  }
  async function refresh(compare) {
    result.textContent = en ? 'Checking…' : 'Controleren…';
    try {
      const response = await fetch(root.dataset.api || '/tools/ip.json', {cache: 'no-store'});
      if (!response.ok) throw new Error();
      latest = await response.json();
      current.textContent = latest.ip || '—';
      country.textContent = [latest.family, latest.country].filter(Boolean).join(' · ');
      const before = readSaved();
      result.textContent = !latest.ip ? (en ? 'Your IP could not be read.' : 'Je IP kon niet worden gelezen.')
        : compare && !before ? (en ? 'Save your IP before changing the connection.' : 'Bewaar eerst je IP voordat je de verbinding verandert.')
        : compare && before?.ip === latest.ip ? (en ? 'The visible IP is unchanged. Check your VPN app.' : 'Het zichtbare IP is gelijk gebleven. Controleer je VPN-app.')
        : compare ? (en ? 'The visible IP changed. This alone does not prove the VPN is active.' : 'Het zichtbare IP is veranderd. Dit bewijst op zichzelf geen actieve VPN.')
        : '';
    } catch (_) { result.textContent = en ? 'The check failed. Try again.' : 'De controle is niet gelukt. Probeer opnieuw.'; }
  }
  root.querySelector('[data-save-ip]').addEventListener('click', () => {
    if (!latest?.ip) return;
    try { sessionStorage.setItem(key, JSON.stringify({ip: latest.ip, country: latest.country})); }
    catch (_) { result.textContent = en ? 'Your browser could not save the comparison.' : 'Je browser kon de vergelijking niet bewaren.'; return; }
    showSaved();
    result.textContent = en ? 'Saved. Change your VPN connection, then compare.' : 'Opgeslagen. Verander je VPN-verbinding en vergelijk opnieuw.';
  });
  root.querySelector('[data-refresh-ip]').addEventListener('click', () => refresh(true));
  root.querySelector('[data-clear-ip]').addEventListener('click', () => {
    sessionStorage.removeItem(key);
    showSaved();
    result.textContent = en ? 'Saved IP removed.' : 'Opgeslagen IP gewist.';
  });
  showSaved();
  refresh(false);
})();
