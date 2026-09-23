/* dbt Quiz — logique de l'application (vanilla JS, aucun build). */
(() => {
  "use strict";

  const PASS_MARK = 65;               // seuil de réussite de l'examen dbt (%)
  const EXAM_QUESTIONS = 65;          // format réel
  const EXAM_MINUTES = 120;           // format réel
  const LS = { session: "dbtquiz.session", history: "dbtquiz.history", imported: "dbtquiz.imported", setup: "dbtquiz.setup" };

  const app = document.getElementById("app");
  const topbarRight = document.getElementById("topbar-right");

  // ---------- Stockage (tolérant : navigation privée, blocage, etc.) ----------
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
    },
    del(key) { try { localStorage.removeItem(key); } catch { /* ignore */ } },
  };

  // Questions importées depuis l'interface (JSON), rechargées au démarrage.
  const imported = store.get(LS.imported, []);
  if (imported.length) QuizBank.add(imported, "import");

  // ---------- Utilitaires ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Mini-formatage : ```bloc```, `code`, **gras**, retours à la ligne.
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

  // ---------- État ----------
  const bank = () => QuizBank.all();
  const byId = (id) => bank().find((q) => q.id === id);
  const topicsOf = (qs) => [...new Set(qs.map((q) => q.topic))].sort((a, b) => a.localeCompare(b, "fr"));
  const modulesOf = (qs) => {
    const present = new Set(qs.map((q) => q.module));
    const known = QuizBank.MODULES.filter((m) => present.has(m.id));
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

  // ---------- Sélection des questions ----------
  function pool() {
    const all = bank();
    if (setup.selType === "module") return all.filter((q) => setup.modules.includes(q.module));
    if (setup.selType === "topic") return all.filter((q) => setup.topics.includes(q.topic));
    return all;
  }

  function buildSession(questions, mode, minutes) {
    const items = questions.map((q) => ({
      id: q.id,
      order: setup.shuffleChoices ? shuffle(q.choices.map((_, i) => i)) : q.choices.map((_, i) => i),
      selected: [],
      validated: false,
      flagged: false,
    }));
    const now = Date.now();
    session = {
      mode,
      selection: describeSelection(),
      items,
      idx: 0,
      startedAt: now,
      endAt: mode === "exam" ? now + minutes * 60 * 1000 : null,
      finished: false,
    };
    saveSession();
  }

  function describeSelection() {
    if (setup.selType === "module") return "Modules : " + setup.modules.map((m) => QuizBank.moduleLabel(m)).join(", ");
    if (setup.selType === "topic") return "Sujets : " + setup.topics.join(", ");
    return "Aléatoire";
  }

  function start() {
    let qs = pool();
    if (!qs.length) return;
    if (setup.selType === "random" || setup.shuffleOrder) qs = shuffle(qs);
    else qs = qs.slice().sort((a, b) => a.module.localeCompare(b.module) || a.topic.localeCompare(b.topic, "fr"));
    const n = Math.max(1, Math.min(setup.count || qs.length, qs.length));
    qs = qs.slice(0, n);
    buildSession(qs, setup.mode, setup.minutes);
    saveSetup();
    view = "quiz";
    render();
  }

  function startFrom(ids, mode) {
    const qs = shuffle(ids.map(byId).filter(Boolean));
    if (!qs.length) return;
    const minutes = Math.max(5, Math.round((qs.length * EXAM_MINUTES) / EXAM_QUESTIONS));
    buildSession(qs, mode, minutes);
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
    const byModule = {};
    session.items.forEach((it) => {
      const q = byId(it.id); if (!q) return;
      byModule[q.module] = byModule[q.module] || { good: 0, total: 0 };
      byModule[q.module].total++;
      if (isCorrect(it)) byModule[q.module].good++;
    });
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

  // ---------- Rendu ----------
  function render() {
    stopTimer();
    topbarRight.innerHTML = "";
    document.getElementById("bank-count").textContent = `${bank().length} questions`;
    if (view === "setup") renderSetup();
    else if (view === "resume") renderResume();
    else if (view === "quiz") renderQuiz();
    else if (view === "results") renderResults();
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
        ? topics.map((t) => `<button class="chip ${setup.topics.includes(t) ? "active" : ""}" data-action="toggle-topic" data-id="${esc(t)}">${esc(t)}<span class="count">${countBy("topic", t)}</span></button>`).join("")
        : "";

    app.innerHTML = `
      <h1>Préparation dbt Analytics Engineering</h1>
      <p class="lead">Choisissez les questions, puis le mode, puis lancez.</p>

      ${errs.length ? `<div class="alert">${errs.length} question(s) ignorée(s) car mal formée(s) — voir la console du navigateur.</div>` : ""}

      <section class="card">
        <h2>1. Quelles questions ?</h2>
        <p class="hint">${all.length} questions disponibles dans la banque.</p>
        <div class="tiles">
          <button class="tile ${setup.selType === "random" ? "active" : ""}" data-action="seltype" data-id="random"><strong>Aléatoire</strong><span>Un tirage sur toute la banque, comme le vrai examen.</span></button>
          <button class="tile ${setup.selType === "module" ? "active" : ""}" data-action="seltype" data-id="module"><strong>Par module</strong><span>Les 8 domaines officiels de l'examen.</span></button>
          <button class="tile ${setup.selType === "topic" ? "active" : ""}" data-action="seltype" data-id="topic"><strong>Par sujet</strong><span>Questions regroupées par thème précis.</span></button>
        </div>
        ${chipsHtml ? `
          <div class="row spread" style="margin-top:14px">
            <span class="muted small">Sélectionnez un ou plusieurs ${setup.selType === "module" ? "modules" : "sujets"}.</span>
            <span class="row"><button class="btn ghost small" data-action="select-all">Tout</button><button class="btn ghost small" data-action="select-none">Aucun</button></span>
          </div>
          <div class="chips">${chipsHtml}</div>` : ""}
        <div class="row" style="margin-top:16px; gap:20px">
          <label class="field">Nombre de questions (max ${available})
            <input type="number" id="count" min="1" max="${available || 1}" value="${Math.min(setup.count || available, available || 1)}" />
          </label>
          <label class="checkbox"><input type="checkbox" id="shuffleOrder" ${setup.shuffleOrder ? "checked" : ""} /> Mélanger l'ordre des questions</label>
          <label class="checkbox"><input type="checkbox" id="shuffleChoices" ${setup.shuffleChoices ? "checked" : ""} /> Mélanger les réponses</label>
        </div>
      </section>

      <section class="card">
        <h2>2. Quel mode ?</h2>
        <div class="tiles">
          <button class="tile ${setup.mode === "train" ? "active" : ""}" data-action="mode" data-id="train"><strong>Entraînement</strong><span>Correction et explication immédiates après chaque question.</span></button>
          <button class="tile ${setup.mode === "exam" ? "active" : ""}" data-action="mode" data-id="exam"><strong>Examen</strong><span>Chronométré, navigation libre, correction à la fin. 65 questions / 120 min en conditions réelles.</span></button>
        </div>
        ${setup.mode === "exam" ? `
          <div class="row" style="margin-top:14px">
            <label class="field">Durée (minutes)<input type="number" id="minutes" min="1" max="600" value="${setup.minutes}" /></label>
            <button class="btn ghost small" data-action="minutes-auto">Proportionnel au format réel</button>
          </div>` : ""}
      </section>

      <div class="row spread">
        <button class="btn primary big" data-action="start" ${available ? "" : "disabled"}>3. Lancer</button>
        <span class="muted small">${available ? `${Math.min(setup.count || available, available)} question(s) · ${setup.mode === "exam" ? `examen ${setup.minutes} min` : "entraînement"}` : "Sélectionnez au moins un module / sujet."}</span>
      </div>

      ${history.length ? `
      <section class="card history" style="margin-top:24px">
        <h2>Historique</h2>
        <table>
          <thead><tr><th>Date</th><th>Mode</th><th>Sélection</th><th>Score</th></tr></thead>
          <tbody>${history.slice(0, 10).map((h) => `<tr><td>${new Date(h.date).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</td><td>${h.mode === "exam" ? "Examen" : "Entraînement"}</td><td class="muted">${esc(h.selection)}</td><td><strong style="color:${h.pct >= PASS_MARK ? "var(--ok)" : "var(--ko)"}">${h.pct} %</strong> <span class="muted">(${h.good}/${h.total})</span></td></tr>`).join("")}</tbody>
        </table>
        <div style="margin-top:10px"><button class="btn ghost small danger" data-action="clear-history">Effacer l'historique</button></div>
      </section>` : ""}

      <section class="card" style="margin-top:24px">
        <h2>Ajouter des questions</h2>
        <p class="hint">Importez un fichier JSON (tableau de questions au format de <code>questions/bank.js</code>). Elles sont conservées dans ce navigateur. Pour les partager, ajoutez-les plutôt dans <code>quiz/questions/</code> du dépôt.</p>
        <div class="row">
          <button class="btn" data-action="import">Importer un JSON</button>
          <input type="file" id="import-file" class="hidden-input" accept=".json,application/json" />
          ${imported.length ? `<span class="small muted">${imported.length} question(s) importée(s)</span><button class="btn ghost small danger" data-action="clear-import">Retirer les questions importées</button>` : ""}
          <button class="btn ghost small" data-action="export-template">Télécharger un modèle JSON</button>
        </div>
        <div id="import-msg"></div>
      </section>
    `;
  }

  function renderResume() {
    const answered = session.items.filter((it) => it.validated || it.selected.length).length;
    app.innerHTML = `
      <section class="card">
        <h2>Session en cours</h2>
        <p class="hint">${session.mode === "exam" ? "Examen" : "Entraînement"} · ${esc(session.selection)} · ${answered}/${session.items.length} répondues${session.mode === "exam" ? ` · ${session.endAt - Date.now() > 0 ? fmtTime(session.endAt - Date.now()) + " restantes" : "temps écoulé"}` : ""}</p>
        <div class="row">
          <button class="btn primary" data-action="resume">Reprendre</button>
          <button class="btn" data-action="abandon">Abandonner et recommencer</button>
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

    topbarRight.innerHTML = exam
      ? `<span class="small">${answeredCount}/${n} répondues</span><span class="timer" id="timer">--:--</span><button class="btn small" data-action="finish-confirm">Terminer</button>`
      : `<span class="small">Entraînement · ${session.items.filter((it) => it.validated).length}/${n}</span><button class="btn ghost small" data-action="quit-confirm">Quitter</button>`;

    const choicesHtml = item.order.map((ci, pos) => {
      const selected = item.selected.includes(ci);
      const correct = q.answer.includes(ci);
      let cls = "choice";
      if (showFeedback) {
        if (selected && correct) cls += " correct";
        else if (selected && !correct) cls += " wrong";
        else if (!selected && correct) cls += " missed";
      } else if (selected) cls += " selected";
      return `<li><button class="${cls}" data-action="choose" data-ci="${ci}" ${item.validated && !exam ? "disabled" : ""}><span class="key">${LETTERS[pos]}</span><span>${fmt(q.choices[ci])}</span></button></li>`;
    }).join("");

    let feedbackHtml = "";
    if (showFeedback) {
      const ok = isCorrect(item);
      feedbackHtml = `
        <div class="feedback ${ok ? "ok" : "ko"}">
          <strong class="title">${ok ? "Bonne réponse" : item.selected.length ? "Mauvaise réponse" : "Question passée"} — réponse${multi ? "s" : ""} : ${q.answer.map((a) => LETTERS[item.order.indexOf(a)]).join(", ")}</strong>
          <div>${fmt(q.explanation)}</div>
          ${q.source ? `<div class="src"><a href="${esc(q.source)}" target="_blank" rel="noopener">Documentation dbt ↗</a></div>` : ""}
        </div>`;
    }

    const gridHtml = exam ? `
      <section class="card">
        <div class="qgrid">${session.items.map((it, i) => `<button class="${i === session.idx ? "current" : ""} ${it.selected.length ? "answered" : ""} ${it.flagged ? "flagged" : ""}" data-action="goto" data-i="${i}">${i + 1}</button>`).join("")}</div>
        <div class="legend"><span><i style="background:var(--surface-2)"></i>Répondue</span><span><i style="background:var(--warn-soft);border-color:var(--warn)"></i>Marquée</span><span><i style="outline:2px solid var(--accent)"></i>Actuelle</span></div>
      </section>` : "";

    app.innerHTML = `
      <div class="progress"><div style="width:${pct(session.idx + (item.validated ? 1 : 0), n)}%"></div></div>
      <section class="card">
        <div class="badges"><span class="badge accent">${esc(QuizBank.moduleLabel(q.module))}</span><span class="badge">${esc(q.topic)}</span>${item.flagged ? `<span class="badge" style="background:var(--warn-soft);color:var(--warn)">Marquée</span>` : ""}</div>
        <p class="qtext">${session.idx + 1}. ${fmt(q.question)}</p>
        <p class="qmeta">${multi ? `Sélectionnez ${q.answer.length} réponses.` : "Sélectionnez une réponse."} <span class="muted">Raccourcis : touches A–${LETTERS[q.choices.length - 1]}, Entrée.</span></p>
        <ul class="choices">${choicesHtml}</ul>
        ${feedbackHtml}
        <div class="quiz-nav">
          <div class="left">
            <button class="btn" data-action="prev" ${session.idx === 0 ? "disabled" : ""}>← Précédent</button>
            ${exam ? `<button class="btn ${item.flagged ? "primary" : ""}" data-action="flag">${item.flagged ? "Démarquer" : "Marquer pour revue"}</button>` : ""}
          </div>
          <div class="right">
            ${!exam && !item.validated ? `<button class="btn ghost" data-action="skip">Passer</button><button class="btn primary" data-action="validate" ${item.selected.length ? "" : "disabled"}>Valider</button>` : ""}
            ${(exam || item.validated) ? (session.idx < n - 1 ? `<button class="btn primary" data-action="next">Suivant →</button>` : `<button class="btn primary" data-action="finish-confirm">Terminer</button>`) : ""}
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

    topbarRight.innerHTML = `<button class="btn ghost small" data-action="home">Accueil</button>`;

    app.innerHTML = `
      <section class="card">
        <div class="score-hero">
          <div class="score-big ${pass ? "pass" : "fail"}">${score} %</div>
          <div>
            <div class="verdict">${pass ? "Réussi" : "Insuffisant"} — ${good}/${total} bonnes réponses (seuil ${PASS_MARK} %)</div>
            <div class="muted small">${session.mode === "exam" ? "Examen" : "Entraînement"} · ${esc(session.selection)} · durée ${fmtTime(duration)} · ${(duration / 1000 / total).toFixed(0)} s/question${session.mode === "exam" ? ` (objectif ≈ ${Math.round((EXAM_MINUTES * 60) / EXAM_QUESTIONS)} s)` : ""}</div>
          </div>
        </div>
        <div class="row" style="margin-top:16px">
          ${wrongIds.length ? `<button class="btn primary" data-action="retry-wrong">Refaire mes ${wrongIds.length} erreur(s)</button>` : ""}
          <button class="btn" data-action="home">Nouvelle session</button>
        </div>
      </section>

      <section class="card">
        <h2>Par module</h2>
        <div class="bars">
          ${Object.entries(byModule).map(([m, s]) => { const p = pct(s.good, s.total); return `<div class="bar"><span>${esc(QuizBank.moduleLabel(m))}</span><div class="track"><div class="${p < 50 ? "low" : p < PASS_MARK ? "mid" : ""}" style="width:${p}%"></div></div><span class="muted small">${s.good}/${s.total} · ${p} %</span></div>`; }).join("")}
        </div>
      </section>

      <section class="card">
        <div class="row spread">
          <h2>Revue des questions</h2>
          <span class="row"><button class="chip ${reviewFilter === "wrong" ? "active" : ""}" data-action="filter" data-id="wrong">Erreurs (${wrongIds.length})</button><button class="chip ${reviewFilter === "all" ? "active" : ""}" data-action="filter" data-id="all">Toutes (${total})</button></span>
        </div>
        ${shown.length ? shown.map(({ it, i }) => {
          const q = byId(it.id); const ok = isCorrect(it);
          return `<div class="review-item">
            <div class="badges"><span class="badge ${ok ? "" : "accent"}">${ok ? "✓ Correct" : "✗ Faux"}</span><span class="badge">${esc(QuizBank.moduleLabel(q.module))}</span><span class="badge">${esc(q.topic)}</span></div>
            <p class="qtext">${i + 1}. ${fmt(q.question)}</p>
            <ul class="choices">${it.order.map((ci, pos) => { const sel = it.selected.includes(ci), cor = q.answer.includes(ci); const cls = sel && cor ? "correct" : sel ? "wrong" : cor ? "missed" : ""; return `<li><button class="choice ${cls}" disabled><span class="key">${LETTERS[pos]}</span><span>${fmt(q.choices[ci])}</span></button></li>`; }).join("")}</ul>
            <div class="feedback neutral"><div>${fmt(q.explanation)}</div>${q.source ? `<div class="src"><a href="${esc(q.source)}" target="_blank" rel="noopener">Documentation dbt ↗</a></div>` : ""}</div>
          </div>`;
        }).join("") : `<p class="muted">Aucune erreur, bravo.</p>`}
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
        }
        if (msg) msg.innerHTML = `<div class="alert ${added ? "ok" : ""}" style="margin-top:10px">${added} question(s) ajoutée(s)${rejected ? `, ${rejected} rejetée(s) (voir console)` : ""}.</div>`;
        if (rejected) console.warn("Questions rejetées :", QuizBank.errors.slice(before));
        setTimeout(render, 900);
      } catch (e) {
        if (msg) msg.innerHTML = `<div class="alert" style="margin-top:10px">JSON invalide : ${esc(e.message)}</div>`;
      }
    };
    reader.readAsText(file);
  }

  function exportTemplate() {
    const template = [{
      id: "custom-001", module: "tests", topic: "Tests génériques",
      question: "Énoncé de la question ? (`code` et **gras** autorisés)",
      choices: ["Réponse A", "Réponse B", "Réponse C", "Réponse D"],
      answer: [1], explanation: "Pourquoi B est la bonne réponse.", source: "https://docs.getdbt.com/",
    }];
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "questions-modele.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  // ---------- Actions ----------
  const actions = {
    home() { if (session && !session.finished && view === "quiz" && !confirm("Quitter la session en cours ? Elle sera conservée pour reprise.")) return; view = session && !session.finished ? "resume" : "setup"; render(); },
    seltype(el) { setup.selType = el.dataset.id; if (setup.selType === "random") setup.count = Math.min(EXAM_QUESTIONS, bank().length); else setup.count = pool().length; saveSetup(); render(); },
    "toggle-module"(el) { const id = el.dataset.id; setup.modules = setup.modules.includes(id) ? setup.modules.filter((m) => m !== id) : [...setup.modules, id]; setup.count = pool().length; saveSetup(); render(); },
    "toggle-topic"(el) { const id = el.dataset.id; setup.topics = setup.topics.includes(id) ? setup.topics.filter((t) => t !== id) : [...setup.topics, id]; setup.count = pool().length; saveSetup(); render(); },
    "select-all"() { if (setup.selType === "module") setup.modules = modulesOf(bank()).map((m) => m.id); else setup.topics = topicsOf(bank()); setup.count = pool().length; saveSetup(); render(); },
    "select-none"() { if (setup.selType === "module") setup.modules = []; else setup.topics = []; setup.count = 0; saveSetup(); render(); },
    mode(el) { setup.mode = el.dataset.id; if (setup.mode === "exam") actions["minutes-auto"](null, true); saveSetup(); render(); },
    "minutes-auto"(_, silent) { const n = Math.min(setup.count || pool().length, pool().length); setup.minutes = Math.max(5, Math.round((n * EXAM_MINUTES) / EXAM_QUESTIONS)); saveSetup(); if (!silent) render(); },
    start() { readSetupInputs(); start(); },
    resume() { view = "quiz"; render(); },
    abandon() { if (!confirm("Abandonner la session en cours ?")) return; session = null; saveSession(); view = "setup"; render(); },
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
      if (left && !confirm(`${left} question(s) sans réponse. Terminer quand même ?`)) return;
      finish();
    },
    "quit-confirm"() { if (!confirm("Terminer l'entraînement et voir le bilan ?")) return; finish(); },
    "retry-wrong"() { const ids = session.items.filter((it) => !isCorrect(it)).map((it) => it.id); startFrom(ids, "train"); },
    filter(el) { reviewFilter = el.dataset.id; renderResults(); },
    "clear-history"() { if (confirm("Effacer l'historique des scores ?")) { store.del(LS.history); render(); } },
    import() { document.getElementById("import-file").click(); },
    "clear-import"() { if (!confirm("Retirer toutes les questions importées ?")) return; QuizBank.remove("import"); store.del(LS.imported); imported.length = 0; render(); },
    "export-template"() { exportTemplate(); },
  };

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

  if (QuizBank.errors.length) console.warn("Questions mal formées ignorées :", QuizBank.errors);
  render();
})();
