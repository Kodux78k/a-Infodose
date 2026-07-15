document.addEventListener('DOMContentLoaded', () => {
  const btnChecklist = document.getElementById('btnChecklist');
  const overlay = document.getElementById('checklistOverlay');
  const btnClose = document.getElementById('btnCloseChecklist');
  const checklistItemsContainer = document.getElementById('checklistItems');

  if (!btnChecklist || !overlay || !btnClose || !checklistItemsContainer) return;

  function openChecklist() { overlay.classList.add('active'); }
  function closeChecklist() { overlay.classList.remove('active'); }

  btnChecklist.addEventListener('click', (e) => { e.stopPropagation(); openChecklist(); });
  btnClose.addEventListener('click', closeChecklist);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeChecklist(); });

  function renderChecklist() {
    const db = window.KOBLLUX_DB.load() || window.KOBLLUX_DB.createDefault();
    checklistItemsContainer.innerHTML = '';
    
    db.checklist.forEach(item => {
      const div = document.createElement('div');
      div.className = 'checklist-item';
      div.innerHTML = `
        <input type="checkbox" id="check_${item.id}" ${item.checked ? 'checked' : ''}>
        <label for="check_${item.id}"><span class="emoji">${item.emoji}</span> ${item.label}</label>
      `;
      
      const checkbox = div.querySelector('input');
      checkbox.addEventListener('change', () => {
        item.checked = checkbox.checked;
        window.KOBLLUX_DB.save(db);
      });
      
      checklistItemsContainer.appendChild(div);
    });
  }

  renderChecklist();
});