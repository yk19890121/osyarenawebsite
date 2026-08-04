/* BLENCI BUILDER — STRUCTURE panel: object tree + selection sync. */
window.Builder = window.Builder || {};

(() => {
  "use strict";
  let root = null;
  let onSelectCallback = null;

  const TYPE_LETTER = {
    heading: "T", text: "P", image: "I", button: "B",
    background: "S", section: "S", group: "G", card: "C",
    navigation: "N", gallery: "G", logo: "L", decoration: "D",
  };

  function mount(rootEl, onSelect) {
    root = rootEl;
    onSelectCallback = onSelect;
  }

  function render(layoutId) {
    const layout = BUILDER_LAYOUTS.find((l) => l.id === layoutId);
    const groupOrder = [];
    const groupMap = new Map();
    layout.objects.forEach((obj) => {
      const g = obj.group || "01 HERO";
      if (!groupMap.has(g)) { groupMap.set(g, []); groupOrder.push(g); }
      groupMap.get(g).push(obj);
    });
    root.innerHTML = `
      <p class="bp-panel-title">PAGE</p>
      ${groupOrder.map((g) => `
        <div class="bp-tree-section">
          <p class="bp-tree-section-name">${g}</p>
          <ul class="bp-tree-list">
            ${groupMap.get(g).map((obj) => `
              <li class="bp-tree-item" data-object-id="${obj.id}" tabindex="0" role="button" aria-label="${obj.label}">
                <span class="bp-tree-letter">${TYPE_LETTER[obj.type] || "?"}</span>
                <span class="bp-tree-label">${obj.label}</span>
              </li>
            `).join("")}
          </ul>
        </div>
      `).join("")}
    `;
    [...root.querySelectorAll(".bp-tree-item")].forEach((li) => {
      li.addEventListener("click", () => onSelectCallback && onSelectCallback(li.dataset.objectId));
      li.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelectCallback && onSelectCallback(li.dataset.objectId); } });
    });
  }

  function setSelected(objectId) {
    if (!root) return;
    [...root.querySelectorAll(".bp-tree-item")].forEach((li) => li.classList.toggle("active", li.dataset.objectId === objectId));
  }

  window.Builder.structurePanel = { mount, render, setSelected };
})();
