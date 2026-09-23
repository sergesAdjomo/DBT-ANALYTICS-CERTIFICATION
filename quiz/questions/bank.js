/*
 * Question bank — central registry.
 *
 * Every questions/*.js file calls QuizBank.add([...]) with an array of
 * questions. English is the primary language (the exam is in English); a
 * French translation is optional per question. Format:
 *
 * {
 *   id: "models-001",             // unique across the whole bank
 *   module: "models",             // id of a module below (official exam domain)
 *   topic: "Materializations",    // fine-grained topic, in English (used for "by topic" grouping)
 *   topic_fr: "Matérialisations", // optional French label for the topic
 *   question: "Prompt…",          // `inline code`, ```blocks``` and **bold** supported
 *   choices: ["A", "B", "C", "D"],
 *   answer: [1],                  // 0-based index(es) of the correct choice(s)
 *   explanation: "Why…",
 *   source: "https://docs.getdbt.com/…",   // optional
 *   fr: {                         // optional French translation
 *     question: "Énoncé…",
 *     choices: ["A", "B", "C", "D"],       // same length and order as `choices`
 *     explanation: "Pourquoi…",
 *   },
 * }
 *
 * To add questions: create or extend a file in questions/ and, if it is a new
 * file, add it to the <script> list in index.html. A JSON file (array of
 * questions, same format) can also be imported from the UI; it is kept in the
 * browser only.
 */
window.QuizBank = (() => {
  const MODULES = [
    { id: "models",       label: { en: "Developing dbt models",              fr: "Développer des modèles dbt" } },
    { id: "governance",   label: { en: "Model governance",                   fr: "Gouvernance des modèles" } },
    { id: "debugging",    label: { en: "Debugging data modeling errors",     fr: "Déboguer les erreurs de modélisation" } },
    { id: "pipelines",    label: { en: "Managing data pipelines",            fr: "Gérer les pipelines de données" } },
    { id: "tests",        label: { en: "Implementing dbt tests",             fr: "Implémenter des tests dbt" } },
    { id: "docs",         label: { en: "Creating and maintaining documentation", fr: "Créer et maintenir la documentation" } },
    { id: "dependencies", label: { en: "External dependencies",              fr: "Dépendances externes" } },
    { id: "state",        label: { en: "Leveraging dbt state",               fr: "Exploiter le state dbt" } },
  ];

  const questions = [];
  const ids = new Set();
  const errors = [];

  function validate(q) {
    const problems = [];
    if (!q || typeof q !== "object") return ["entry is not an object"];
    if (!q.id) problems.push("missing id");
    else if (ids.has(q.id)) problems.push(`duplicate id: ${q.id}`);
    if (!q.module) problems.push("missing module");
    if (!q.topic) problems.push("missing topic");
    if (!q.question) problems.push("missing question");
    if (!Array.isArray(q.choices) || q.choices.length < 2) problems.push("choices: at least 2 required");
    const ans = Array.isArray(q.answer) ? q.answer : [q.answer];
    if (!ans.length || ans.some((a) => !Number.isInteger(a) || a < 0 || a >= (q.choices || []).length)) {
      problems.push("answer: invalid index(es)");
    }
    if (!q.explanation) problems.push("missing explanation");
    if (q.fr) {
      if (typeof q.fr !== "object") problems.push("fr: must be an object");
      else if (q.fr.choices && (!Array.isArray(q.fr.choices) || q.fr.choices.length !== (q.choices || []).length)) {
        problems.push("fr.choices: must have the same length as choices");
      }
    }
    return problems;
  }

  function add(list, source = "unknown") {
    if (!Array.isArray(list)) {
      errors.push({ source, id: null, problems: ["file must contain an array"] });
      return 0;
    }
    let added = 0;
    for (const raw of list) {
      const problems = validate(raw);
      if (problems.length) {
        errors.push({ source, id: raw && raw.id, problems });
        continue;
      }
      const q = {
        ...raw,
        answer: Array.isArray(raw.answer) ? [...raw.answer].sort((a, b) => a - b) : [raw.answer],
        source: raw.source || "",
        origin: source,
      };
      ids.add(q.id);
      questions.push(q);
      added++;
    }
    return added;
  }

  function remove(origin) {
    for (let i = questions.length - 1; i >= 0; i--) {
      if (questions[i].origin === origin) {
        ids.delete(questions[i].id);
        questions.splice(i, 1);
      }
    }
  }

  function moduleLabel(id, lang = "en") {
    const m = MODULES.find((m) => m.id === id);
    return m ? (m.label[lang] || m.label.en) : id;
  }

  return { MODULES, add, remove, moduleLabel, all: () => questions.slice(), errors };
})();
