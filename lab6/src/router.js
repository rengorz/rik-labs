const routes = [];

export function route(path, handler) {
  routes.push({ path, handler });
}

export function navigate(path) {
  location.hash = path;
}

function resolve() {
  const hash = location.hash.slice(1) || '/';
  const matched = routes.find((r) => r.path === hash) ?? routes.find((r) => r.path === '*');
  if (matched) matched.handler();

  document.querySelectorAll('[data-link]').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#${hash}`);
  });
}

export function startRouter() {
  window.addEventListener('hashchange', resolve);
  resolve();
}
