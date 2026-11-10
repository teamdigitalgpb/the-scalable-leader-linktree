document.addEventListener('DOMContentLoaded', () => {
  const form    = document.getElementById('access-form');
  const errorEl = document.getElementById('form-error');
  const success = document.getElementById('form-success');
  const button  = form.querySelector('button[type="submit"]');

  const showError = msg => { errorEl.textContent = msg; errorEl.hidden = false; };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    errorEl.hidden = true;

    const data = Object.fromEntries(new FormData(form).entries());
    Object.keys(data).forEach(k => { data[k] = String(data[k]).trim(); });

    if (!data.first_name) return showError('Please enter your first name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return showError('Please enter a valid email address.');

    button.disabled = true;
    button.textContent = 'Sending…';

    try {
      const res = await fetch('/api/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      form.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      showError('Something went wrong sending your request. Please try again, or email support@thescalableleader.net.');
      button.disabled = false;
      button.textContent = 'Request Access';
    }
  });
});
