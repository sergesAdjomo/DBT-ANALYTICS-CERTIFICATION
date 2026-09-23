/*
 * Banque de questions — registre central.
 *
 * Chaque fichier questions/*.js appelle QuizBank.add([...]) avec un tableau
 * de questions. Format d'une question :
 *
 * {
 *   id: "models-001",            // unique dans toute la banque
 *   module: "models",            // id d'un module ci-dessous (domaine officiel de l'examen)
 *   topic: "Matérialisations",   // sujet fin, libre (sert au regroupement "par sujet")
 *   question: "Énoncé…",         // `code` inline et ```blocs``` supportés
 *   choices: ["A", "B", "C", "D"],
 *   answer: [1],                 // index(es) de la/les bonne(s) réponse(s), base 0
 *   explanation: "Pourquoi…",
 *   source: "https://docs.getdbt.com/…"   // optionnel
 * }
 *
 * Pour ajouter des questions : créer ou compléter un fichier dans questions/
 * et, s'il est nouveau, l'ajouter dans la liste des <script> de index.html.
 * On peut aussi importer un JSON (même format, tableau de questions) depuis
 * l'interface ; il est conservé dans le navigateur.
 */
window.QuizBank = (() => {
  const MODULES = [
    { id: "models",       label: "Développer des modèles dbt" },
    { id: "governance",   label: "Gouvernance des modèles" },
    { id: "debugging",    label: "Déboguer les erreurs de modélisation" },
    { id: "pipelines",    label: "Gérer les pipelines de données" },
    { id: "tests",        label: "Implémenter des tests dbt" },
    { id: "docs",         label: "Créer et maintenir la documentation" },
    { id: "dependencies", label: "Dépendances externes" },
    { id: "state",        label: "Exploiter le state dbt" },
  ];

  const questions = [];
  const ids = new Set();
  const errors = [];

  function validate(q, source) {
    const problems = [];
    if (!q || typeof q !== "object") return ["entrée non-objet"];
    if (!q.id) problems.push("id manquant");
    else if (ids.has(q.id)) problems.push(`id en double : ${q.id}`);
    if (!q.module) problems.push("module manquant");
    if (!q.topic) problems.push("topic manquant");
    if (!q.question) problems.push("question manquante");
    if (!Array.isArray(q.choices) || q.choices.length < 2) problems.push("choices : au moins 2 choix requis");
    const ans = Array.isArray(q.answer) ? q.answer : [q.answer];
    if (!ans.length || ans.some((a) => !Number.isInteger(a) || a < 0 || a >= (q.choices || []).length)) {
      problems.push("answer : index(es) invalide(s)");
    }
    if (!q.explanation) problems.push("explanation manquante");
    return problems;
  }

  function add(list, source = "inconnu") {
    if (!Array.isArray(list)) {
      errors.push({ source, id: null, problems: ["le fichier doit contenir un tableau"] });
      return 0;
    }
    let added = 0;
    for (const raw of list) {
      const problems = validate(raw, source);
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

  function moduleLabel(id) {
    const m = MODULES.find((m) => m.id === id);
    return m ? m.label : id;
  }

  return { MODULES, add, remove, moduleLabel, all: () => questions.slice(), errors };
})();
