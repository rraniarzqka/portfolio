const projectCards = [...document.querySelectorAll('.project[data-type]')];
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    projectCards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.type !== filter; });
    const count = projectCards.filter(card => !card.hidden).length;
    document.querySelector('#filter-status').textContent = `Showing ${count} ${filter === 'all' ? '' : filter === 'organic' ? 'SEO and content ' : 'paid media '}projects.`;
  });
});
