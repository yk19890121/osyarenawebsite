/* BLENCI BUILDER — state manager. Single source of truth (pageConfig) +
   localStorage persistence + a tiny pub/sub so the renderer/panels can
   react without polling. */
window.Builder = window.Builder || {};

(() => {
  "use strict";
  const STORAGE_KEY = "blenci-builder:v1";
  let state = null;
  let selectedObjectId = null;
  const listeners = new Set();

  // Presets assign gimmicks by object ROLE (e.g. "primary-heading",
  // "card-visual"), not by object id — this is what lets one preset's
  // assignments apply across every layout, since roles are shared/reused
  // (e.g. every card in a grid layout has role "card-heading") while ids
  // are unique per object. If a preset doesn't mention a role at all, fall
  // back to a safe generic default per object TYPE so nothing looks inert.
  const DEFAULT_ASSIGNMENT_BY_TYPE = {
    heading: { entrance: { id: "fade-up" } },
    text: { entrance: { id: "fade-up" } },
    image: { entrance: { id: "fade-in" } },
    button: { hover: { id: "scale-hover" } },
    background: {},
  };

  function resolveAssignment(preset, objMeta) {
    const byRole = preset.assignments && preset.assignments[objMeta.role];
    const fallback = DEFAULT_ASSIGNMENT_BY_TYPE[objMeta.type];
    return clone(byRole || fallback || {});
  }

  function notify(reason) {
    listeners.forEach((fn) => fn(state, reason));
  }

  function buildDefaultState(layoutId, presetId) {
    const layout = BUILDER_LAYOUTS.find((l) => l.id === layoutId);
    const preset = BUILDER_PRESETS_BY_ID[presetId];
    const objects = {};
    layout.objects.forEach((obj) => {
      const seed = (layout.defaults && layout.defaults[obj.id]) || {};
      objects[obj.id] = {
        type: obj.type,
        role: obj.role,
        label: obj.label,
        content: seed.content || "",
        url: seed.url || "",
        source: seed.source || "",
        alt: seed.alt || "",
        style: {},
        effects: resolveAssignment(preset, obj),
        catalogGimmicks: [],
      };
    });
    return {
      version: 1,
      layout: layoutId,
      preset: presetId,
      device: "desktop",
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      palette: clone(preset.palette),
      fonts: clone(preset.fonts),
      objects,
      lastEdited: Date.now(),
    };
  }

  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  function init(layoutId, presetId) {
    state = buildDefaultState(layoutId, presetId);
    selectedObjectId = null;
    notify("init");
    return state;
  }

  function get() { return state; }
  function getObject(id) { return state && state.objects[id]; }

  function getSelected() { return selectedObjectId; }
  function select(id) {
    selectedObjectId = id;
    notify("select");
  }

  function updateObject(id, patch) {
    if (!state || !state.objects[id]) return;
    Object.assign(state.objects[id], patch);
    state.lastEdited = Date.now();
    notify("object:" + id);
  }

  function updateObjectStyle(id, stylePatch) {
    if (!state || !state.objects[id]) return;
    Object.assign(state.objects[id].style, stylePatch);
    state.lastEdited = Date.now();
    notify("style:" + id);
  }

  function setEffect(id, event, gimmickId, options) {
    if (!state || !state.objects[id]) return;
    const effects = state.objects[id].effects;
    if (!gimmickId) { delete effects[event]; }
    else { effects[event] = { id: gimmickId, ...(options || {}) }; }
    state.lastEdited = Date.now();
    notify("motion:" + id);
  }

  function updateEffectOptions(id, event, optionsPatch) {
    if (!state || !state.objects[id] || !state.objects[id].effects[event]) return;
    Object.assign(state.objects[id].effects[event], optionsPatch);
    state.lastEdited = Date.now();
    notify("motion:" + id);
  }

  function toggleCatalogGimmick(id, entry) {
    if (!state || !state.objects[id]) return;
    const list = state.objects[id].catalogGimmicks || (state.objects[id].catalogGimmicks = []);
    const i = list.findIndex((g) => g.num === entry.num);
    if (i === -1) list.push(entry);
    else list.splice(i, 1);
    state.lastEdited = Date.now();
    notify("catalog:" + id);
  }

  function setPalette(patch) {
    Object.assign(state.palette, patch);
    state.lastEdited = Date.now();
    notify("palette");
  }

  function setFonts(patch) {
    Object.assign(state.fonts, patch);
    state.lastEdited = Date.now();
    notify("fonts");
  }

  function setDevice(device) {
    state.device = device;
    notify("device");
  }

  function setReducedMotion(v) {
    state.reducedMotion = v;
    notify("reducedMotion");
  }

  function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (e) { return false; }
  }

  function hasSavedSession() {
    try { return !!localStorage.getItem(STORAGE_KEY); } catch (e) { return false; }
  }

  function loadSaved() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      state = JSON.parse(raw);
      selectedObjectId = null;
      notify("init");
      return state;
    } catch (e) { return null; }
  }

  function clearSaved() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* noop */ }
  }

  function resetObject(id) {
    const layout = BUILDER_LAYOUTS.find((l) => l.id === state.layout);
    const preset = BUILDER_PRESETS_BY_ID[state.preset];
    const seed = (layout.defaults && layout.defaults[id]) || {};
    const objMeta = layout.objects.find((o) => o.id === id);
    state.objects[id] = {
      type: objMeta.type, role: objMeta.role, label: objMeta.label,
      content: seed.content || "", url: seed.url || "", source: seed.source || "", alt: seed.alt || "",
      style: {},
      effects: resolveAssignment(preset, objMeta),
      catalogGimmicks: [],
    };
    notify("object:" + id);
  }

  function resetAll() {
    state = buildDefaultState(state.layout, state.preset);
    selectedObjectId = null;
    notify("init");
  }

  window.Builder.state = {
    init, get, getObject, getSelected, select,
    updateObject, updateObjectStyle, setEffect, updateEffectOptions, toggleCatalogGimmick,
    setPalette, setFonts, setDevice, setReducedMotion,
    subscribe, save, hasSavedSession, loadSaved, clearSaved,
    resetObject, resetAll,
  };
})();
