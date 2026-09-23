# dbt Quiz — entraînement à la certification dbt Analytics Engineering

Application web statique (HTML + CSS + JS, sans dépendance ni build) pour réviser la certification.

## Lancer

Ouvrir `quiz/index.html` dans un navigateur suffit (double-clic). Pour un serveur local :

```bash
cd quiz && python -m http.server 8765
```

puis http://localhost:8765.

Le dossier peut aussi être publié tel quel via GitHub Pages (Settings → Pages → branche `main`, dossier `/quiz` ou racine).

## Fonctionnement

1. **Choix des questions** : aléatoire (comme l'examen), par module (les 8 domaines officiels de l'examen), ou par sujet (thème précis : Incrémental, Contracts, Slim CI…). Nombre de questions et mélange réglables.
2. **Choix du mode** :
   - **Entraînement** : correction et explication immédiates après chaque question, lien vers la doc dbt.
   - **Examen** : chronomètre (par défaut proportionnel au format réel : 65 questions / 120 min), navigation libre, marquage de questions, correction à la fin.
3. **Bilan** : score (seuil de réussite 65 %), détail par module, revue des erreurs, bouton « Refaire mes erreurs ».

L'historique des scores et la session en cours sont conservés dans le navigateur (`localStorage`). Raccourcis clavier : `A`–`J` pour choisir, `Entrée` pour valider / passer à la suivante, flèches ← →.

## Ajouter des questions

### Dans le dépôt (recommandé, partagé avec tout le monde)

Les questions vivent dans `quiz/questions/`, un fichier par module. Chaque fichier appelle `QuizBank.add([...])`.

L'**anglais est la langue principale** (c'est celle de l'examen) ; la traduction française est optionnelle, question par question, dans le bloc `fr`. Le bouton FR/EN de l'interface bascule l'affichage ; une question sans bloc `fr` reste en anglais.

```js
QuizBank.add([
  {
    id: "tests-012",                 // unique dans toute la banque
    module: "tests",                 // id d'un module (voir bank.js)
    topic: "Generic tests",          // sujet (en anglais), sert au regroupement « par sujet »
    topic_fr: "Tests génériques",    // optionnel : libellé français du sujet
    question: "Prompt? (`code`, **bold** and ```blocks``` allowed)",
    choices: ["Answer A", "Answer B", "Answer C", "Answer D"],
    answer: [1],                     // index(es) base 0 ; plusieurs = question à choix multiples
    explanation: "Why B is correct and the others are not.",
    source: "https://docs.getdbt.com/…",   // optionnel
    fr: {                            // optionnel : traduction française
      question: "Énoncé ?",
      choices: ["Réponse A", "Réponse B", "Réponse C", "Réponse D"],  // même ordre que choices
      explanation: "Pourquoi B est correcte et pas les autres.",
    },
  },
]);
```

- Pour compléter un module : ajouter l'objet dans le fichier du module.
- Pour un nouveau fichier : le créer dans `questions/` et ajouter sa balise `<script>` dans `index.html` (après `bank.js`).
- Pour un nouveau module : l'ajouter dans `MODULES` de `questions/bank.js`.

Les questions mal formées (id en double, index de réponse hors bornes, champ manquant, `fr.choices` de longueur différente) sont ignorées et listées dans la console du navigateur ; un bandeau l'indique sur l'écran d'accueil.

### Depuis l'interface (perso, dans le navigateur seulement)

Bouton « Importer un JSON » sur l'écran d'accueil : un tableau de questions au même format. « Télécharger un modèle JSON » fournit un exemple. Ces questions sont stockées dans le navigateur et peuvent être retirées d'un clic.

## Modules (domaines officiels de l'examen)

| id             | Domaine                                   |
| -------------- | ----------------------------------------- |
| `models`       | Développer des modèles dbt                |
| `governance`   | Gouvernance des modèles                   |
| `debugging`    | Déboguer les erreurs de modélisation      |
| `pipelines`    | Gérer les pipelines de données            |
| `tests`        | Implémenter des tests dbt                 |
| `docs`         | Créer et maintenir la documentation       |
| `dependencies` | Dépendances externes                      |
| `state`        | Exploiter le state dbt                    |
