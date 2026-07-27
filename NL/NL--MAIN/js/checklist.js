document.addEventListener('DOMContentLoaded', () => {
  const btnChecklist = document.getElementById('btnChecklist');
  const overlay = document.getElementById('checklistOverlay');
  const btnClose = document.getElementById('btnCloseChecklist');

  function openChecklist() { overlay.classList.add('active'); }
  function closeChecklist() { overlay.classList.remove('active'); }

  btnChecklist.addEventListener('click', (e) => { e.stopPropagation(); openChecklist(); });
  btnClose.addEventListener('click', closeChecklist);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeChecklist(); });

  // Sincroniza com o banco de dados (se disponível)
  if (window.KOBLLUX_DB) {
    const db = window.KOBLLUX_DB.init();
    const items = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    items.forEach((checkbox, index) => {
      if (db.checklist[index]) {
        checkbox.checked = db.checklist[index].checked;
        checkbox.addEventListener('change', () => {
          db.checklist[index].checked = checkbox.checked;
          window.KOBLLUX_DB.save(db);
        });
      }
    });
  }
});