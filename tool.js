(() => {
  const root = document.querySelector('[data-tool="vpn-check"]');
  if (!root) return;
  const en = root.dataset.lang === 'en';
  const say = (english, dutch) => en ? english : dutch;
  const key = 'vpnnu-vpn-check-before';
  const current = root.querySelector('[data-current-ip]');
  const country = root.querySelector('[data-current-country]');
  const saved = root.querySelector('[data-saved-ip]');
  const savedCountry = root.querySelector('[data-saved-country]');
  const result = root.querySelector('[data-vpn-result]');
  const saveButton = root.querySelector('[data-save-ip]');
  const checkButton = root.querySelector('[data-refresh-ip]');
  const clearButton = root.querySelector('[data-clear-ip]');
  let latest = null;
  let busy = false;
  saveButton.disabled = true;

  function readSaved() {
    try {
      const value = JSON.parse(sessionStorage.getItem(key) || 'null');
      return value && typeof value.ip === 'string' ? value : null;
    } catch (_) { return null; }
  }
  function showSaved() {
    const before = readSaved();
    saved.textContent = before?.ip || '—';
    savedCountry.textContent = before?.country || '';
    saveButton.hidden = !!before;
    checkButton.hidden = !before && !!latest;
    clearButton.hidden = !before;
  }
  async function refresh() {
    if (busy) return;
    busy = true;
    saveButton.disabled = true;
    checkButton.disabled = true;
    result.textContent = say('Checking…', 'Controleren…');
    try {
      const response = await fetch(root.dataset.api || '/tools/ip.json', {cache: 'no-store'});
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (!data.ip) throw new Error();
      latest = data;
      saveButton.disabled = false;
      current.textContent = data.ip;
      country.textContent = [data.family, data.country].filter(Boolean).join(' · ');
      const before = readSaved();
      result.textContent = !before ? say('Save this IP while your VPN is off.', 'Bewaar dit IP terwijl je VPN uitstaat.')
        : before.ip === data.ip ? say('IP unchanged. Check that your VPN is connected, then check again.', 'IP ongewijzigd. Controleer je VPN-verbinding en probeer opnieuw.')
        : say('IP changed. Confirm the connection in your VPN app.', 'IP veranderd. Controleer de verbinding in je VPN-app.');
    } catch (_) {
      latest = null;
      result.textContent = say('Could not check your IP. Check your connection and try again.', 'IP controleren is niet gelukt. Controleer je verbinding en probeer opnieuw.');
    } finally {
      busy = false;
      checkButton.disabled = false;
      showSaved();
    }
  }
  saveButton.addEventListener('click', () => {
    if (!latest?.ip) return;
    try { sessionStorage.setItem(key, JSON.stringify({ip: latest.ip, country: latest.country})); }
    catch (_) { result.textContent = say('Your browser could not save the IP.', 'Je browser kon het IP niet bewaren.'); return; }
    showSaved();
    result.textContent = say('Saved. Turn on your VPN, then check again.', 'Opgeslagen. Zet je VPN aan en controleer opnieuw.');
  });
  checkButton.addEventListener('click', refresh);
  clearButton.addEventListener('click', () => {
    try { sessionStorage.removeItem(key); }
    catch (_) { result.textContent = say('Your browser could not clear the saved IP.', 'Je browser kon het opgeslagen IP niet wissen.'); return; }
    showSaved();
    result.textContent = say('Comparison cleared. Turn your VPN off before saving again.', 'Vergelijking gewist. Zet je VPN uit voordat je opnieuw opslaat.');
  });
  showSaved();
  refresh();
})();
