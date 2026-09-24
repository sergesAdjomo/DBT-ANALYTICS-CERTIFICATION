/* dbt Quiz — application logic (vanilla JS, no build). */
(() => {
  "use strict";

  const PASS_MARK = 65;               // dbt exam passing score (%)
  const EXAM_QUESTIONS = 65;          // real exam format
  const EXAM_MINUTES = 120;           // real exam format
  const LS = { session: "dbtquiz.session", history: "dbtquiz.history", imported: "dbtquiz.imported", setup: "dbtquiz.setup", lang: "dbtquiz.lang" };

  const app = document.getElementById("app");
  const topbarRight = document.getElementById("topbar-right");

  // ---------- Storage (tolerant: private mode, blocked storage, …) ----------
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
    },
    del(key) { try { localStorage.removeItem(key); } catch { /* ignore */ } },
  };

  // Questions imported from the UI (JSON), reloaded at startup.
  const imported = store.get(LS.imported, []);
  if (imported.length) QuizBank.add(imported, "import");

  // ---------- i18n ----------
  const STRINGS = {
    en: {
      title: "dbt Analytics Engineering exam prep",
      lead: "Pick the questions, then the mode, then start.",
      malformed: (n) => `${n} malformed question(s) ignored — see the browser console.`,
      step1: "1. Which questions?",
      available: (n) => `${n} questions available in the bank.`,
      random: "Random", randomHint: "A draw over the whole bank, like the real exam.",
      byModule: "By module", byModuleHint: "The 8 official exam domains.",
      byTopic: "By topic", byTopicHint: "Questions grouped by specific theme.",
      pickOne: (kind) => `Select one or more ${kind}.`, modules: "modules", topics: "topics",
      all: "All", none: "None",
      count: (max) => `Number of questions (max ${max})`,
      shuffleOrder: "Shuffle question order", shuffleChoices: "Shuffle answers",
      step2: "2. Which mode?",
      train: "Practice", trainHint: "Immediate correction and explanation after each question.",
      exam: "Exam", examHint: "Timed, free navigation, correction at the end. 65 questions / 120 min in real conditions.",
      duration: "Duration (minutes)", proportional: "Proportional to the real format",
      start: "3. Start",
      summary: (n, mode, min) => `${n} question(s) · ${mode === "exam" ? `exam ${min} min` : "practice"}`,
      needSelection: "Select at least one module / topic.",
      history: "History", date: "Date", mode: "Mode", selection: "Selection", score: "Score",
      clearHistory: "Clear history",
      addQuestions: "Add questions",
      addHint: "Import a JSON file (array of questions in the <code>questions/bank.js</code> format). They are kept in this browser only. To share them, add them to <code>quiz/questions/</code> in the repo instead.",
      importBtn: "Import JSON", importedCount: (n) => `${n} imported question(s)`, clearImport: "Remove imported questions", template: "Download a JSON template",
      importResult: (a, r) => `${a} question(s) added${r ? `, ${r} rejected (see console)` : ""}.`, invalidJson: (m) => `Invalid JSON: ${m}`,
      sessionInProgress: "Session in progress",
      answeredOf: (a, n) => `${a}/${n} answered`, remaining: (t) => `${t} remaining`, timeUp: "time is up",
      resume: "Resume", abandon: "Abandon and start over",
      finish: "Finish", quit: "Quit", practiceProgress: (a, n) => `Practice · ${a}/${n}`,
      flagged: "Flagged", flag: "Flag for review", unflag: "Unflag",
      selectN: (n) => `Select ${n} answers.`, selectOne: "Select one answer.",
      shortcuts: (last) => `Shortcuts: keys A–${last}, Enter.`,
      prev: "← Previous", next: "Next →", skip: "Skip", validate: "Check",
      correct: "Correct", wrong: "Wrong", skipped: "Skipped", answerIs: (multi) => `answer${multi ? "s" : ""}`,
      docLink: "dbt documentation ↗",
      legendAnswered: "Answered", legendFlagged: "Flagged", legendCurrent: "Current",
      pass: "Passed", fail: "Not passed", scoreLine: (g, t) => `${g}/${t} correct answers (pass mark ${PASS_MARK} %)`,
      resultMeta: (mode, sel, dur, per, target) => `${mode} · ${sel} · duration ${dur} · ${per} s/question${target ? ` (target ≈ ${target} s)` : ""}`,
      retryWrong: (n) => `Redo my ${n} mistake(s)`, newSession: "New session", home: "Home",
      byModuleTitle: "By module", review: "Question review", errors: (n) => `Mistakes (${n})`, allQ: (n) => `All (${n})`, noErrors: "No mistakes, well done.",
      confirmHome: "Leave the current session? It will be kept for later.", confirmAbandon: "Abandon the current session?",
      confirmFinish: (n) => `${n} unanswered question(s). Finish anyway?`, confirmQuit: "End practice and see the results?",
      confirmClearHistory: "Clear the score history?", confirmClearImport: "Remove all imported questions?",
      footer: (n) => `Question bank: ${n} questions · Exam pass mark: 65 %`,
      modeLabel: (m) => (m === "exam" ? "Exam" : "Practice"), randomSel: "Random", modulesSel: "Modules: ", topicsSel: "Topics: ",
      langBtn: "FR", langTitle: "Passer en français",
      locale: "en-GB",
    },
    fr: {
      title: "Préparation dbt Analytics Engineering",
      lead: "Choisissez les questions, puis le mode, puis lancez.",
      malformed: (n) => `${n} question(s) ignorée(s) car mal formée(s) — voir la console du navigateur.`,
      step1: "1. Quelles questions ?",
      available: (n) => `${n} questions disponibles dans la banque.`,
      random: "Aléatoire", randomHint: "Un tirage sur toute la banque, comme le vrai examen.",
      byModule: "Par module", byModuleHint: "Les 8 domaines officiels de l'examen.",
      byTopic: "Par sujet", byTopicHint: "Questions regroupées par thème précis.",
      pickOne: (kind) => `Sélectionnez un ou plusieurs ${kind}.`, modules: "modules", topics: "sujets",
      all: "Tout", none: "Aucun",
      count: (max) => `Nombre de questions (max ${max})`,
      shuffleOrder: "Mélanger l'ordre des questions", shuffleChoices: "Mélanger les réponses",
      step2: "2. Quel mode ?",
      train: "Entraînement", trainHint: "Correction et explication immédiates après chaque question.",
      exam: "Examen", examHint: "Chronométré, navigation libre, correction à la fin. 65 questions / 120 min en conditions réelles.",
      duration: "Durée (minutes)", proportional: "Proportionnel au format réel",
      start: "3. Lancer",
      summary: (n, mode, min) => `${n} question(s) · ${mode === "exam" ? `examen ${min} min` : "entraînement"}`,
      needSelection: "Sélectionnez au moins un module / sujet.",
      history: "Historique", date: "Date", mode: "Mode", selection: "Sélection", score: "Score",
      clearHistory: "Effacer l'historique",
      addQuestions: "Ajouter des questions",
      addHint: "Importez un fichier JSON (tableau de questions au format de <code>questions/bank.js</code>). Elles sont conservées dans ce navigateur. Pour les partager, ajoutez-les plutôt dans <code>quiz/questions/</code> du dépôt.",
      importBtn: "Importer un JSON", importedCount: (n) => `${n} question(s) importée(s)`, clearImport: "Retirer les questions importées", template: "Télécharger un modèle JSON",
      importResult: (a, r) => `${a} question(s) ajoutée(s)${r ? `, ${r} rejetée(s) (voir console)` : ""}.`, invalidJson: (m) => `JSON invalide : ${m}`,
      sessionInProgress: "Session en cours",
      answeredOf: (a, n) => `${a}/${n} répondues`, remaining: (t) => `${t} restantes`, timeUp: "temps écoulé",
      resume: "Reprendre", abandon: "Abandonner et recommencer",
      finish: "Terminer", quit: "Quitter", practiceProgress: (a, n) => `Entraînement · ${a}/${n}`,
      flagged: "Marquée", flag: "Marquer pour revue", unflag: "Démarquer",
      selectN: (n) => `Sélectionnez ${n} réponses.`, selectOne: "Sélectionnez une réponse.",
      shortcuts: (last) => `Raccourcis : touches A–${last}, Entrée.`,
      prev: "← Précédent", next: "Suivant →", skip: "Passer", validate: "Valider",
      correct: "Bonne réponse", wrong: "Mauvaise réponse", skipped: "Question passée", answerIs: (multi) => `réponse${multi ? "s" : ""}`,
      docLink: "Documentation dbt ↗",
      legendAnswered: "Répondue", legendFlagged: "Marquée", legendCurrent: "Actuelle",
      pass: "Réussi", fail: "Insuffisant", scoreLine: (g, t) => `${g}/${t} bonnes réponses (seuil ${PASS_MARK} %)`,
      resultMeta: (mode, sel, dur, per, target) => `${mode} · ${sel} · durée ${dur} · ${per} s/question${target ? ` (objectif ≈ ${target} s)` : ""}`,
      retryWrong: (n) => `Refaire mes ${n} erreur(s)`, newSession: "Nouvelle session", home: "Accueil",
      byModuleTitle: "Par module", review: "Revue des questions", errors: (n) => `Erreurs (${n})`, allQ: (n) => `Toutes (${n})`, noErrors: "Aucune erreur, bravo.",
      confirmHome: "Quitter la session en cours ? Elle sera conservée pour reprise.", confirmAbandon: "Abandonner la session en cours ?",
      confirmFinish: (n) => `${n} question(s) sans réponse. Terminer quand même ?`, confirmQuit: "Terminer l'entraînement et voir le bilan ?",
      confirmClearHistory: "Effacer l'historique des scores ?", confirmClearImport: "Retirer toutes les questions importées ?",
      footer: (n) => `Banque de questions : ${n} questions · Seuil de réussite de l'examen : 65 %`,
      modeLabel: (m) => (m === "exam" ? "Examen" : "Entraînement"), randomSel: "Aléatoire", modulesSel: "Modules : ", topicsSel: "Sujets : ",
      langBtn: "EN", langTitle: "Switch to English",
      locale: "fr-FR",
    },
  };
  let lang = store.get(LS.lang, "en");
  if (!STRINGS[lang]) lang = "en";
  const t = (key, ...args) => { const v = STRINGS[lang][key]; return typeof v === "function" ? v(...args) : v; };

  // Question text in the current language (falls back to English).
  const qt = (q, field) => (lang === "fr" && q.fr && q.fr[field] != null ? q.fr[field] : q[field]);
  const topicLabel = (q) => (lang === "fr" && q.topic_fr ? q.topic_fr : q.topic);
  const moduleLabel = (id) => QuizBank.moduleLabel(id, lang);

  // ---------- Utilities ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Mini formatter: ```block```, `code`, **bold**, line breaks.
  function fmt(text) {
    const blocks = [];
    let s = String(text ?? "").replace(/```(?:\w+)?\n?([\s\S]*?)```/g, (_, code) => {
      blocks.push(`<pre><code>${esc(code.replace(/\n$/, ""))}</code></pre>`);
      return `\u0000${blocks.length - 1}\u0000`;
    });
    s = esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => blocks[+i]);
  }

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));
  const pad = (n) => String(n).padStart(2, "0");
  const fmtTime = (ms) => { const s = Math.max(0, Math.round(ms / 1000)); return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; };
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const LETTERS = "ABCDEFGHIJ";

  // ---------- State ----------
  const bank = () => QuizBank.all();
  const byId = (id) => bank().find((q) => q.id === id);
  // Topics are keyed by their English label; the display label follows the current language.
  const topicsOf = (qs) => {
    const map = new Map();
    qs.forEach((q) => { if (!map.has(q.topic)) map.set(q.topic, topicLabel(q)); });
    return [...map.entries()].map(([id, label]) => ({ id, label })).sort((a, b) => a.label.localeCompare(b.label, STRINGS[lang].locale));
  };
  const modulesOf = (qs) => {
    const present = new Set(qs.map((q) => q.module));
    const known = QuizBank.MODULES.filter((m) => present.has(m.id)).map((m) => ({ id: m.id, label: moduleLabel(m.id) }));
    const unknown = [...present].filter((id) => !QuizBank.MODULES.some((m) => m.id === id)).map((id) => ({ id, label: id }));
    return [...known, ...unknown];
  };

  let setup = Object.assign(
    { selType: "random", modules: [], topics: [], count: EXAM_QUESTIONS, mode: "train", minutes: EXAM_MINUTES, shuffleChoices: true, shuffleOrder: true },
    store.get(LS.setup, {})
  );
  let session = store.get(LS.session, null);
  let view = session && !session.finished ? "resume" : "setup";
  let reviewFilter = "wrong";
  let timerHandle = null;

  const saveSetup = () => store.set(LS.setup, setup);
  const saveSession = () => (session ? store.set(LS.session, session) : store.del(LS.session));

  // ---------- Question selection ----------
  function pool() {
    const all = bank();
    if (setup.selType === "module") return all.filter((q) => setup.modules.includes(q.module));
    if (setup.selType === "topic") return all.filter((q) => setup.topics.includes(q.topic));
    return all;
  }

  // Selection is stored structurally so it can be displayed in either language.
  function describeSelection(sel) {
    sel = sel || session.selection;
    if (typeof sel === "string") return sel; // legacy sessions/history
    if (sel.type === "module") return t("modulesSel") + sel.ids.map(moduleLabel).join(", ");
    if (sel.type === "topic") return t("topicsSel") + sel.ids.map((id) => { const q = bank().find((q) => q.topic === id); return q ? topicLabel(q) : id; }).join(", ");
    return t("randomSel");
  }

  function buildSession(questions, mode, minutes, selection) {
    const items = questions.map((q) => ({
      id: q.id,
      order: setup.shuffleChoices ? shuffle(q.choices.map((_, i) => i)) : q.choices.map((_, i) => i),
      selected: [],
      validated: false,
      flagged: false,
    }));
    const now = Date.now();
    session = { mode, selection, items, idx: 0, startedAt: now, endAt: mode === "exam" ? now + minutes * 60 * 1000 : null, finished: false };
    saveSession();
  }

  function start() {
    let qs = pool();
    if (!qs.length) return;
    if (setup.selType === "random" || setup.shuffleOrder) qs = shuffle(qs);
    else qs = qs.slice().sort((a, b) => a.module.localeCompare(b.module) || a.topic.localeCompare(b.topic));
    const n = Math.max(1, Math.min(setup.count || qs.length, qs.length));
    qs = qs.slice(0, n);
    const selection = setup.selType === "module" ? { type: "module", ids: setup.modules.slice() } : setup.selType === "topic" ? { type: "topic", ids: setup.topics.slice() } : { type: "random" };
    buildSession(qs, setup.mode, setup.minutes, selection);
    saveSetup();
    view = "quiz";
    render();
  }

  function startFrom(ids, mode) {
    const qs = shuffle(ids.map(byId).filter(Boolean));
    if (!qs.length) return;
    const minutes = Math.max(5, Math.round((qs.length * EXAM_MINUTES) / EXAM_QUESTIONS));
    buildSession(qs, mode, minutes, session.selection);
    view = "quiz";
    render();
  }

  // ---------- Scoring ----------
  function isCorrect(item) {
    const q = byId(item.id);
    return q ? sameSet(item.selected, q.answer) : false;
  }

  function finish() {
    if (!session || session.finished) return;
    session.finished = true;
    session.finishedAt = Date.now();
    session.items.forEach((it) => (it.validated = true));
    const total = session.items.length;
    const good = session.items.filter(isCorrect).length;
    const history = store.get(LS.history, []);
    history.unshift({ date: session.finishedAt, mode: session.mode, selection: session.selection, good, total, pct: pct(good, total), duration: session.finishedAt - session.startedAt });
    store.set(LS.history, history.slice(0, 30));
    saveSession();
    stopTimer();
    view = "results";
    reviewFilter = "wrong";
    render();
  }

  // ---------- Timer ----------
  function startTimer() {
    stopTimer();
    if (!session || session.mode !== "exam" || session.finished) return;
    const tick = () => {
      const left = session.endAt - Date.now();
      const el = document.getElementById("timer");
      if (el) { el.textContent = fmtTime(left); el.classList.toggle("low", left < 5 * 60 * 1000); }
      if (left <= 0) finish();
    };
    tick();
    timerHandle = setInterval(tick, 1000);
  }
  function stopTimer() { if (timerHandle) clearInterval(timerHandle); timerHandle = null; }

  // ---------- Rendering ----------
  const langButton = () => `<button class="btn ghost small lang" data-action="lang" title="${esc(t("langTitle"))}">${t("langBtn")}</button>`;

  function render() {
    stopTimer();
    document.documentElement.lang = lang;
    topbarRight.innerHTML = "";
    document.getElementById("bank-footer").textContent = t("footer", bank().length);
    if (view === "setup") renderSetup();
    else if (view === "resume") renderResume();
    else if (view === "quiz") renderQuiz();
    else if (view === "results") renderResults();
    if (!topbarRight.querySelector(".lang")) topbarRight.insertAdjacentHTML("beforeend", langButton());
    window.scrollTo({ top: 0 });
  }

  function renderSetup() {
    const all = bank();
    const modules = modulesOf(all);
    const topics = topicsOf(all);
    const countBy = (key, val) => all.filter((q) => q[key] === val).length;
    const available = pool().length;
    const history = store.get(LS.history, []);
    const errs = QuizBank.errors;

    const chipsHtml =
      setup.selType === "module"
        ? modules.map((m) => `<button class="chip ${setup.modules.includes(m.id) ? "active" : ""}" data-action="toggle-module" data-id="${esc(m.id)}">${esc(m.label)}<span class="count">${countBy("module", m.id)}</span></button>`).join("")
        : setup.selType === "topic"
        ? topics.map((tp) => `<button class="chip ${setup.topics.includes(tp.id) ? "active" : ""}" data-action="toggle-topic" data-id="${esc(tp.id)}">${esc(tp.label)}<span class="count">${countBy("topic", tp.id)}</span></button>`).join("")
        : "";

    app.innerHTML = `
      <h1>${t("title")}</h1>
      <p class="lead">${t("lead")}</p>

      ${errs.length ? `<div class="alert">${t("malformed", errs.length)}</div>` : ""}

      <section class="card">
        <h2>${t("step1")}</h2>
        <p class="hint">${t("available", all.length)}</p>
        <div class="tiles">
          <button class="tile ${setup.selType === "random" ? "active" : ""}" data-action="seltype" data-id="random"><strong>${t("random")}</strong><span>${t("randomHint")}</span></button>
          <button class="tile ${setup.selType === "module" ? "active" : ""}" data-action="seltype" data-id="module"><strong>${t("byModule")}</strong><span>${t("byModuleHint")}</span></button>
          <button class="tile ${setup.selType === "topic" ? "active" : ""}" data-action="seltype" data-id="topic"><strong>${t("byTopic")}</strong><span>${t("byTopicHint")}</span></button>
        </div>
        ${chipsHtml ? `
          <div class="row spread" style="margin-top:14px">
            <span class="muted small">${t("pickOne", setup.selType === "module" ? t("modules") : t("topics"))}</span>
            <span class="row"><button class="btn ghost small" data-action="select-all">${t("all")}</button><button class="btn ghost small" data-action="select-none">${t("none")}</button></span>
          </div>
          <div class="chips">${chipsHtml}</div>` : ""}
        <div class="row" style="margin-top:16px; gap:20px">
          <label class="field">${t("count", available)}
            <input type="number" id="count" min="1" max="${available || 1}" value="${Math.min(setup.count || available, available || 1)}" />
          </label>
          <label class="checkbox"><input type="checkbox" id="shuffleOrder" ${setup.shuffleOrder ? "checked" : ""} /> ${t("shuffleOrder")}</label>
          <label class="checkbox"><input type="checkbox" id="shuffleChoices" ${setup.shuffleChoices ? "checked" : ""} /> ${t("shuffleChoices")}</label>
        </div>
      </section>

      <section class="card">
        <h2>${t("step2")}</h2>
        <div class="tiles">
          <button class="tile ${setup.mode === "train" ? "active" : ""}" data-action="mode" data-id="train"><strong>${t("train")}</strong><span>${t("trainHint")}</span></button>
          <button class="tile ${setup.mode === "exam" ? "active" : ""}" data-action="mode" data-id="exam"><strong>${t("exam")}</strong><span>${t("examHint")}</span></button>
        </div>
        ${setup.mode === "exam" ? `
          <div class="row" style="margin-top:14px">
            <label class="field">${t("duration")}<input type="number" id="minutes" min="1" max="600" value="${setup.minutes}" /></label>
            <button class="btn ghost small" data-action="minutes-auto">${t("proportional")}</button>
          </div>` : ""}
      </section>

      <div class="row spread">
        <button class="btn primary big" data-action="start" ${available ? "" : "disabled"}>${t("start")}</button>
        <span class="muted small">${available ? t("summary", Math.min(setup.count || available, available), setup.mode, setup.minutes) : t("needSelection")}</span>
      </div>

      ${history.length ? `
      <section class="card history" style="margin-top:24px">
        <h2>${t("history")}</h2>
        <table>
          <thead><tr><th>${t("date")}</th><th>${t("mode")}</th><th>${t("selection")}</th><th>${t("score")}</th></tr></thead>
          <tbody>${history.slice(0, 10).map((h) => `<tr><td>${new Date(h.date).toLocaleString(STRINGS[lang].locale, { dateStyle: "short", timeStyle: "short" })}</td><td>${t("modeLabel", h.mode)}</td><td class="muted">${esc(describeSelection(h.selection))}</td><td><strong style="color:${h.pct >= PASS_MARK ? "var(--ok)" : "var(--ko)"}">${h.pct} %</strong> <span class="muted">(${h.good}/${h.total})</span></td></tr>`).join("")}</tbody>
        </table>
        <div style="margin-top:10px"><button class="btn ghost small danger" data-action="clear-history">${t("clearHistory")}</button></div>
      </section>` : ""}

      <section class="card" style="margin-top:24px">
        <h2>${t("addQuestions")}</h2>
        <p class="hint">${t("addHint")}</p>
        <div class="row">
          <button class="btn" data-action="import">${t("importBtn")}</button>
          <input type="file" id="import-file" class="hidden-input" accept=".json,application/json" />
          ${imported.length ? `<span class="small muted">${t("importedCount", imported.length)}</span><button class="btn ghost small danger" data-action="clear-import">${t("clearImport")}</button>` : ""}
          <button class="btn ghost small" data-action="export-template">${t("template")}</button>
        </div>
        <div id="import-msg"></div>
      </section>
    `;
  }

  function renderResume() {
    const answered = session.items.filter((it) => it.validated || it.selected.length).length;
    const left = session.mode === "exam" ? session.endAt - Date.now() : 0;
    app.innerHTML = `
      <section class="card">
        <h2>${t("sessionInProgress")}</h2>
        <p class="hint">${t("modeLabel", session.mode)} · ${esc(describeSelection())} · ${t("answeredOf", answered, session.items.length)}${session.mode === "exam" ? ` · ${left > 0 ? t("remaining", fmtTime(left)) : t("timeUp")}` : ""}</p>
        <div class="row">
          <button class="btn primary" data-action="resume">${t("resume")}</button>
          <button class="btn" data-action="abandon">${t("abandon")}</button>
        </div>
      </section>`;
  }

  function renderQuiz() {
    const item = session.items[session.idx];
    const q = byId(item.id);
    const n = session.items.length;
    const multi = q.answer.length > 1;
    const exam = session.mode === "exam";
    const showFeedback = !exam && item.validated;
    const answeredCount = session.items.filter((it) => it.validated || it.selected.length).length;
    const choices = qt(q, "choices");

    topbarRight.innerHTML = exam
      ? `<span class="small">${t("answeredOf", answeredCount, n)}</span><span class="timer" id="timer">--:--</span><button class="btn small" data-action="finish-confirm">${t("finish")}</button>`
      : `<span class="small">${t("practiceProgress", session.items.filter((it) => it.validated).length, n)}</span><button class="btn ghost small" data-action="quit-confirm">${t("quit")}</button>`;

    const choicesHtml = item.order.map((ci, pos) => {
      const selected = item.selected.includes(ci);
      const correct = q.answer.includes(ci);
      let cls = "choice";
      if (showFeedback) {
        if (selected && correct) cls += " correct";
        else if (selected && !correct) cls += " wrong";
        else if (!selected && correct) cls += " missed";
      } else if (selected) cls += " selected";
      return `<li><button class="${cls}" data-action="choose" data-ci="${ci}" ${item.validated && !exam ? "disabled" : ""}><span class="key">${LETTERS[pos]}</span><span>${fmt(choices[ci])}</span></button></li>`;
    }).join("");

    let feedbackHtml = "";
    if (showFeedback) {
      const ok = isCorrect(item);
      feedbackHtml = `
        <div class="feedback ${ok ? "ok" : "ko"}">
          <strong class="title">${ok ? t("correct") : item.selected.length ? t("wrong") : t("skipped")} — ${t("answerIs", multi)} : ${q.answer.map((a) => LETTERS[item.order.indexOf(a)]).join(", ")}</strong>
          ${qt(q, "explanation") ? `<div>${fmt(qt(q, "explanation"))}</div>` : ""}
          ${q.source ? `<div class="src"><a href="${esc(q.source)}" target="_blank" rel="noopener">${t("docLink")}</a></div>` : ""}
        </div>`;
    }

    const gridHtml = exam ? `
      <section class="card">
        <div class="qgrid">${session.items.map((it, i) => `<button class="${i === session.idx ? "current" : ""} ${it.selected.length ? "answered" : ""} ${it.flagged ? "flagged" : ""}" data-action="goto" data-i="${i}">${i + 1}</button>`).join("")}</div>
        <div class="legend"><span><i style="background:var(--surface-2)"></i>${t("legendAnswered")}</span><span><i style="background:var(--warn-soft);border-color:var(--warn)"></i>${t("legendFlagged")}</span><span><i style="outline:2px solid var(--accent)"></i>${t("legendCurrent")}</span></div>
      </section>` : "";

    app.innerHTML = `
      <div class="progress"><div style="width:${pct(session.idx + (item.validated ? 1 : 0), n)}%"></div></div>
      <section class="card">
        <div class="badges"><span class="badge accent">${esc(moduleLabel(q.module))}</span><span class="badge">${esc(topicLabel(q))}</span>${item.flagged ? `<span class="badge" style="background:var(--warn-soft);color:var(--warn)">${t("flagged")}</span>` : ""}</div>
        <p class="qtext">${session.idx + 1}. ${fmt(qt(q, "question"))}</p>
        <p class="qmeta">${multi ? t("selectN", q.answer.length) : t("selectOne")} <span class="muted">${t("shortcuts", LETTERS[q.choices.length - 1])}</span></p>
        <ul class="choices">${choicesHtml}</ul>
        ${feedbackHtml}
        <div class="quiz-nav">
          <div class="left">
            <button class="btn" data-action="prev" ${session.idx === 0 ? "disabled" : ""}>${t("prev")}</button>
            ${exam ? `<button class="btn ${item.flagged ? "primary" : ""}" data-action="flag">${item.flagged ? t("unflag") : t("flag")}</button>` : ""}
          </div>
          <div class="right">
            ${!exam && !item.validated ? `<button class="btn ghost" data-action="skip">${t("skip")}</button><button class="btn primary" data-action="validate" ${item.selected.length ? "" : "disabled"}>${t("validate")}</button>` : ""}
            ${(exam || item.validated) ? (session.idx < n - 1 ? `<button class="btn primary" data-action="next">${t("next")}</button>` : `<button class="btn primary" data-action="finish-confirm">${t("finish")}</button>`) : ""}
          </div>
        </div>
      </section>
      ${gridHtml}
    `;
    startTimer();
  }

  function renderResults() {
    const items = session.items;
    const total = items.length;
    const good = items.filter(isCorrect).length;
    const score = pct(good, total);
    const pass = score >= PASS_MARK;
    const byModule = {};
    items.forEach((it) => {
      const q = byId(it.id); if (!q) return;
      byModule[q.module] = byModule[q.module] || { good: 0, total: 0 };
      byModule[q.module].total++; if (isCorrect(it)) byModule[q.module].good++;
    });
    const wrongIds = items.filter((it) => !isCorrect(it)).map((it) => it.id);
    const shown = items.map((it, i) => ({ it, i })).filter(({ it }) => reviewFilter === "all" || !isCorrect(it));
    const duration = (session.finishedAt || Date.now()) - session.startedAt;
    const target = session.mode === "exam" ? Math.round((EXAM_MINUTES * 60) / EXAM_QUESTIONS) : 0;

    topbarRight.innerHTML = `<button class="btn ghost small" data-action="home">${t("home")}</button>`;

    app.innerHTML = `
      <section class="card">
        <div class="score-hero">
          <div class="score-big ${pass ? "pass" : "fail"}">${score} %</div>
          <div>
            <div class="verdict">${pass ? t("pass") : t("fail")} — ${t("scoreLine", good, total)}</div>
            <div class="muted small">${t("resultMeta", t("modeLabel", session.mode), esc(describeSelection()), fmtTime(duration), (duration / 1000 / total).toFixed(0), target)}</div>
          </div>
        </div>
        <div class="row" style="margin-top:16px">
          ${wrongIds.length ? `<button class="btn primary" data-action="retry-wrong">${t("retryWrong", wrongIds.length)}</button>` : ""}
          <button class="btn" data-action="home">${t("newSession")}</button>
        </div>
      </section>

      <section class="card">
        <h2>${t("byModuleTitle")}</h2>
        <div class="bars">
          ${Object.entries(byModule).map(([m, s]) => { const p = pct(s.good, s.total); return `<div class="bar"><span>${esc(moduleLabel(m))}</span><div class="track"><div class="${p < 50 ? "low" : p < PASS_MARK ? "mid" : ""}" style="width:${p}%"></div></div><span class="muted small">${s.good}/${s.total} · ${p} %</span></div>`; }).join("")}
        </div>
      </section>

      <section class="card">
        <div class="row spread">
          <h2>${t("review")}</h2>
          <span class="row"><button class="chip ${reviewFilter === "wrong" ? "active" : ""}" data-action="filter" data-id="wrong">${t("errors", wrongIds.length)}</button><button class="chip ${reviewFilter === "all" ? "active" : ""}" data-action="filter" data-id="all">${t("allQ", total)}</button></span>
        </div>
        ${shown.length ? shown.map(({ it, i }) => {
          const q = byId(it.id); const ok = isCorrect(it); const choices = qt(q, "choices");
          return `<div class="review-item">
            <div class="badges"><span class="badge ${ok ? "" : "accent"}">${ok ? "✓ " + t("correct") : "✗ " + t("wrong")}</span><span class="badge">${esc(moduleLabel(q.module))}</span><span class="badge">${esc(topicLabel(q))}</span></div>
            <p class="qtext">${i + 1}. ${fmt(qt(q, "question"))}</p>
            <ul class="choices">${it.order.map((ci, pos) => { const sel = it.selected.includes(ci), cor = q.answer.includes(ci); const cls = sel && cor ? "correct" : sel ? "wrong" : cor ? "missed" : ""; return `<li><button class="choice ${cls}" disabled><span class="key">${LETTERS[pos]}</span><span>${fmt(choices[ci])}</span></button></li>`; }).join("")}</ul>
            ${qt(q, "explanation") || q.source ? `<div class="feedback neutral">${qt(q, "explanation") ? `<div>${fmt(qt(q, "explanation"))}</div>` : ""}${q.source ? `<div class="src"><a href="${esc(q.source)}" target="_blank" rel="noopener">${t("docLink")}</a></div>` : ""}</div>` : ""}
          </div>`;
        }).join("") : `<p class="muted">${t("noErrors")}</p>`}
      </section>
    `;
  }

  // ---------- Import / export ----------
  function handleImport(file) {
    const msg = document.getElementById("import-msg");
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const before = QuizBank.errors.length;
        const added = QuizBank.add(data, "import");
        const rejected = QuizBank.errors.length - before;
        if (added) {
          const kept = store.get(LS.imported, []);
          const addedIds = new Set(QuizBank.all().filter((q) => q.origin === "import").map((q) => q.id));
          const merged = [...kept, ...(Array.isArray(data) ? data.filter((q) => q && addedIds.has(q.id) && !kept.some((k) => k.id === q.id)) : [])];
          store.set(LS.imported, merged);
          imported.length = 0; imported.push(...merged);
        }
        if (msg) msg.innerHTML = `<div class="alert ${added ? "ok" : ""}" style="margin-top:10px">${t("importResult", added, rejected)}</div>`;
        if (rejected) console.warn("Rejected questions:", QuizBank.errors.slice(before));
        setTimeout(render, 900);
      } catch (e) {
        if (msg) msg.innerHTML = `<div class="alert" style="margin-top:10px">${t("invalidJson", esc(e.message))}</div>`;
      }
    };
    reader.readAsText(file);
  }

  function exportTemplate() {
    const template = [{
      id: "custom-001", module: "tests", topic: "Generic tests", topic_fr: "Tests génériques",
      question: "Question prompt? (`code` and **bold** allowed)",
      choices: ["Answer A", "Answer B", "Answer C", "Answer D"],
      answer: [1], explanation: "Why B is the right answer.", source: "https://docs.getdbt.com/",
      fr: { question: "Énoncé de la question ?", choices: ["Réponse A", "Réponse B", "Réponse C", "Réponse D"], explanation: "Pourquoi B est la bonne réponse." },
    }];
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "questions-template.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  // ---------- Actions ----------
  const actions = {
    lang() { lang = lang === "en" ? "fr" : "en"; store.set(LS.lang, lang); render(); },
    home() { if (session && !session.finished && view === "quiz" && !confirm(t("confirmHome"))) return; view = session && !session.finished ? "resume" : "setup"; render(); },
    seltype(el) { setup.selType = el.dataset.id; if (setup.selType === "random") setup.count = Math.min(EXAM_QUESTIONS, bank().length); else setup.count = pool().length; saveSetup(); render(); },
    "toggle-module"(el) { const id = el.dataset.id; setup.modules = setup.modules.includes(id) ? setup.modules.filter((m) => m !== id) : [...setup.modules, id]; setup.count = pool().length; saveSetup(); render(); },
    "toggle-topic"(el) { const id = el.dataset.id; setup.topics = setup.topics.includes(id) ? setup.topics.filter((x) => x !== id) : [...setup.topics, id]; setup.count = pool().length; saveSetup(); render(); },
    "select-all"() { if (setup.selType === "module") setup.modules = modulesOf(bank()).map((m) => m.id); else setup.topics = topicsOf(bank()).map((x) => x.id); setup.count = pool().length; saveSetup(); render(); },
    "select-none"() { if (setup.selType === "module") setup.modules = []; else setup.topics = []; setup.count = 0; saveSetup(); render(); },
    mode(el) { setup.mode = el.dataset.id; if (setup.mode === "exam") actions["minutes-auto"](null, true); saveSetup(); render(); },
    "minutes-auto"(_, silent) { const n = Math.min(setup.count || pool().length, pool().length); setup.minutes = Math.max(5, Math.round((n * EXAM_MINUTES) / EXAM_QUESTIONS)); saveSetup(); if (!silent) render(); },
    start() { readSetupInputs(); start(); },
    resume() { view = "quiz"; render(); },
    abandon() { if (!confirm(t("confirmAbandon"))) return; session = null; saveSession(); view = "setup"; render(); },
    choose(el) {
      const item = session.items[session.idx]; const q = byId(item.id); const ci = +el.dataset.ci;
      if (item.validated && session.mode !== "exam") return;
      if (q.answer.length > 1) item.selected = item.selected.includes(ci) ? item.selected.filter((x) => x !== ci) : [...item.selected, ci].sort((a, b) => a - b);
      else item.selected = [ci];
      saveSession(); renderQuiz();
    },
    validate() { const item = session.items[session.idx]; if (!item.selected.length) return; item.validated = true; saveSession(); renderQuiz(); },
    skip() { const item = session.items[session.idx]; item.selected = []; item.validated = true; saveSession(); renderQuiz(); },
    next() { if (session.idx < session.items.length - 1) { session.idx++; saveSession(); renderQuiz(); window.scrollTo({ top: 0 }); } },
    prev() { if (session.idx > 0) { session.idx--; saveSession(); renderQuiz(); window.scrollTo({ top: 0 }); } },
    goto(el) { session.idx = +el.dataset.i; saveSession(); renderQuiz(); window.scrollTo({ top: 0 }); },
    flag() { const item = session.items[session.idx]; item.flagged = !item.flagged; saveSession(); renderQuiz(); },
    "finish-confirm"() {
      const left = session.items.filter((it) => !it.selected.length && !it.validated).length;
      if (left && !confirm(t("confirmFinish", left))) return;
      finish();
    },
    "quit-confirm"() { if (!confirm(t("confirmQuit"))) return; finish(); },
    "retry-wrong"() { const ids = session.items.filter((it) => !isCorrect(it)).map((it) => it.id); startFrom(ids, "train"); },
    filter(el) { reviewFilter = el.dataset.id; renderResults(); },
    "clear-history"() { if (confirm(t("confirmClearHistory"))) { store.del(LS.history); render(); } },
    import() { document.getElementById("import-file").click(); },
    "clear-import"() { if (!confirm(t("confirmClearImport"))) return; QuizBank.remove("import"); store.del(LS.imported); imported.length = 0; render(); },
    "export-template"() { exportTemplate(); },
  };

  // The quiz screen re-renders only its own area; the language button lives in the top bar.
  const origRenderQuiz = renderQuiz;
  renderQuiz = function () { origRenderQuiz(); if (!topbarRight.querySelector(".lang")) topbarRight.insertAdjacentHTML("beforeend", langButton()); };
  const origRenderResults = renderResults;
  renderResults = function () { origRenderResults(); if (!topbarRight.querySelector(".lang")) topbarRight.insertAdjacentHTML("beforeend", langButton()); };

  function readSetupInputs() {
    const c = document.getElementById("count"); if (c) setup.count = parseInt(c.value, 10) || 1;
    const m = document.getElementById("minutes"); if (m) setup.minutes = parseInt(m.value, 10) || EXAM_MINUTES;
    const so = document.getElementById("shuffleOrder"); if (so) setup.shuffleOrder = so.checked;
    const sc = document.getElementById("shuffleChoices"); if (sc) setup.shuffleChoices = sc.checked;
    saveSetup();
  }

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    e.preventDefault();
    const fn = actions[el.dataset.action];
    if (fn) fn(el);
  });
  document.addEventListener("change", (e) => {
    if (e.target.id === "import-file" && e.target.files[0]) { handleImport(e.target.files[0]); e.target.value = ""; }
    else if (["count", "minutes", "shuffleOrder", "shuffleChoices"].includes(e.target.id)) {
      readSetupInputs();
      if (e.target.id === "count" && setup.mode === "exam") { actions["minutes-auto"](null, true); render(); }
    }
  });
  document.addEventListener("keydown", (e) => {
    if (view !== "quiz" || e.target.tagName === "INPUT") return;
    const item = session.items[session.idx];
    const key = e.key.toUpperCase();
    const pos = LETTERS.indexOf(key);
    if (pos >= 0 && pos < item.order.length) { const btn = app.querySelector(`[data-action="choose"][data-ci="${item.order[pos]}"]`); if (btn && !btn.disabled) btn.click(); }
    else if (e.key === "Enter") { const btn = app.querySelector('[data-action="validate"]:not(:disabled), [data-action="next"]'); if (btn) btn.click(); }
    else if (e.key === "ArrowLeft") actions.prev();
    else if (e.key === "ArrowRight" && (session.mode === "exam" || item.validated)) actions.next();
  });

  if (QuizBank.errors.length) console.warn("Malformed questions ignored:", QuizBank.errors);
  render();
})();
