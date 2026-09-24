// Project configuration questions (dbt_project.yml, quoting, dispatch, hooks, query-comment,
// configs vs properties). question / choices / answer are taken verbatim from the source
// question bank; module, topic, explanation, source and the French translation are additions.
QuizBank.add([
  {
    "id": "cfg-001",
    "module": "models",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "Which configuration is used to specify the profile name in the dbt_project.yml file?",
    "choices": [
      "profile-name",
      "profile",
      "profilename",
      "dbt_profile"
    ],
    "answer": [
      1
    ],
    "explanation": "`profile: my_profile` in `dbt_project.yml` tells dbt which profile of `profiles.yml` to use for the connection.",
    "source": "https://docs.getdbt.com/reference/project-configs/profile",
    "fr": {
      "question": "Quelle configuration indique le nom du profil dans le fichier `dbt_project.yml` ?",
      "choices": [
        "profile-name",
        "profile",
        "profilename",
        "dbt_profile"
      ],
      "explanation": "`profile: mon_profil` dans `dbt_project.yml` indique à dbt quel profil de `profiles.yml` utiliser pour la connexion."
    }
  },
  {
    "id": "cfg-006",
    "module": "models",
    "topic": "Quoting",
    "topic_fr": "Quoting",
    "question": "Which of the following configurations are used to control quoting in the dbt_project.yml file?",
    "choices": [
      "quote-database, quote-schema, quote-identifier",
      "database-quote, schema-quote, identifier-quote",
      "quoting_database, quoting_schema, quoting_identifier",
      "database: true | false, schema: true | false, identifier: true | false"
    ],
    "answer": [
      3
    ],
    "explanation": "Quoting is configured under a `quoting:` block with three boolean keys: `database`, `schema` and `identifier`.",
    "source": "https://docs.getdbt.com/reference/project-configs/quoting",
    "fr": {
      "question": "Quelles configurations contrôlent le quoting dans `dbt_project.yml` ?",
      "choices": [
        "quote-database, quote-schema, quote-identifier",
        "database-quote, schema-quote, identifier-quote",
        "quoting_database, quoting_schema, quoting_identifier",
        "database: true | false, schema: true | false, identifier: true | false"
      ],
      "explanation": "Le quoting se configure sous un bloc `quoting:` avec trois clés booléennes : `database`, `schema` et `identifier`."
    }
  },
  {
    "id": "cfg-007",
    "module": "dependencies",
    "topic": "Dispatch",
    "topic_fr": "Dispatch",
    "question": "What is the correct configuration to specify the search order for dispatch?",
    "choices": [
      "macro_namespace: packagename, search_order: [packagename]",
      "dispatch-order: [packagename]",
      "dispatch: macro_namespace: packagename, search_order: [packagename]",
      "dispatch: - macro_namespace: packagename, search_order: [packagename]"
    ],
    "answer": [
      3
    ],
    "explanation": "`dispatch:` is a **list** of entries, each with a `macro_namespace` and a `search_order` (hence the leading `-`).",
    "source": "https://docs.getdbt.com/reference/project-configs/dispatch-config",
    "fr": {
      "question": "Quelle est la configuration correcte pour indiquer l'ordre de recherche du dispatch ?",
      "choices": [
        "macro_namespace: packagename, search_order: [packagename]",
        "dispatch-order: [packagename]",
        "dispatch: macro_namespace: packagename, search_order: [packagename]",
        "dispatch: - macro_namespace: packagename, search_order: [packagename]"
      ],
      "explanation": "`dispatch:` est une **liste** d'entrées ayant chacune un `macro_namespace` et un `search_order` (d'où le `-` en tête)."
    }
  },
  {
    "id": "cfg-008",
    "module": "models",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "Which configuration is used to specify the name of the dbt project in the dbt_project.yml file?",
    "choices": [
      "project-name",
      "dbt_project_name",
      "name",
      "project"
    ],
    "answer": [
      2
    ],
    "explanation": "`name:` is the required project name; it is also the namespace used for `ref` across packages and for scoping configs under `models:`.",
    "source": "https://docs.getdbt.com/reference/project-configs/name",
    "fr": {
      "question": "Quelle configuration indique le nom du projet dbt dans `dbt_project.yml` ?",
      "choices": [
        "project-name",
        "dbt_project_name",
        "name",
        "project"
      ],
      "explanation": "`name:` est le nom obligatoire du projet ; il sert aussi d'espace de noms pour `ref` entre packages et pour scoper les configs sous `models:`."
    }
  },
  {
    "id": "cfg-009",
    "module": "debugging",
    "topic": "Logs",
    "topic_fr": "Logs",
    "question": "Which configuration is used to specify the path for log files in the dbt_project.yml file?",
    "choices": [
      "log-path",
      "log-directory",
      "log-location",
      "log-folder"
    ],
    "answer": [
      0
    ],
    "explanation": "`log-path: logs` (default). It can also be set with `--log-path` on the CLI or `DBT_LOG_PATH`.",
    "source": "https://docs.getdbt.com/reference/project-configs/log-path",
    "fr": {
      "question": "Quelle configuration indique le chemin des fichiers de log dans `dbt_project.yml` ?",
      "choices": [
        "log-path",
        "log-directory",
        "log-location",
        "log-folder"
      ],
      "explanation": "`log-path: logs` (défaut). On peut aussi le définir avec `--log-path` en CLI ou `DBT_LOG_PATH`."
    }
  },
  {
    "id": "cfg-010",
    "module": "docs",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "What is the correct configuration to specify paths for documentation files in the dbt_project.yml file?",
    "choices": [
      "doc-paths",
      "docs-paths",
      "documentation-paths",
      "document-paths"
    ],
    "answer": [
      1
    ],
    "explanation": "`docs-paths:` lists the directories where `.md` files with `{% docs %}` blocks live. By default dbt looks in all resource paths (models, seeds, …).",
    "source": "https://docs.getdbt.com/reference/project-configs/docs-paths",
    "fr": {
      "question": "Quelle configuration indique les chemins des fichiers de documentation dans `dbt_project.yml` ?",
      "choices": [
        "doc-paths",
        "docs-paths",
        "documentation-paths",
        "document-paths"
      ],
      "explanation": "`docs-paths:` liste les dossiers contenant les `.md` avec des blocs `{% docs %}`. Par défaut dbt cherche dans tous les chemins de ressources (models, seeds, …)."
    }
  },
  {
    "id": "cfg-011",
    "module": "dependencies",
    "topic": "Packages",
    "topic_fr": "Packages",
    "question": "Which configuration is used to define the package installation path in the dbt_project.yml file?",
    "choices": [
      "packages-install-directory",
      "packages-install-path",
      "package-path",
      "install-packages-path"
    ],
    "answer": [
      1
    ],
    "explanation": "`packages-install-path: dbt_packages` (default). Older projects used `dbt_modules`.",
    "source": "https://docs.getdbt.com/reference/project-configs/packages-install-path",
    "fr": {
      "question": "Quelle configuration définit le chemin d'installation des packages dans `dbt_project.yml` ?",
      "choices": [
        "packages-install-directory",
        "packages-install-path",
        "package-path",
        "install-packages-path"
      ],
      "explanation": "`packages-install-path: dbt_packages` (défaut). Les anciens projets utilisaient `dbt_modules`."
    }
  },
  {
    "id": "cfg-012",
    "module": "pipelines",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "Which configuration is used to specify the directories that should be cleaned in the dbt_project.yml file?",
    "choices": [
      "clean-directories",
      "clean-targets",
      "clean-paths",
      "clean-folders"
    ],
    "answer": [
      1
    ],
    "explanation": "`clean-targets:` lists the directories removed by `dbt clean`, typically `target`, `dbt_packages` and `logs`.",
    "source": "https://docs.getdbt.com/reference/project-configs/clean-targets",
    "fr": {
      "question": "Quelle configuration indique les dossiers à nettoyer dans `dbt_project.yml` ?",
      "choices": [
        "clean-directories",
        "clean-targets",
        "clean-paths",
        "clean-folders"
      ],
      "explanation": "`clean-targets:` liste les dossiers supprimés par `dbt clean`, typiquement `target`, `dbt_packages` et `logs`."
    }
  },
  {
    "id": "cfg-013",
    "module": "models",
    "topic": ".dbtignore",
    "topic_fr": ".dbtignore",
    "question": "What is the purpose of the .dbtignore file in a dbt project?",
    "choices": [
      "To specify the files that should be included in the dbt project",
      "To specify the files that should be excluded from the dbt project",
      "To specify the files that should be archived by dbt",
      "To specify the files that should be version-controlled by dbt"
    ],
    "answer": [
      1
    ],
    "explanation": "`.dbtignore` (project root) lists patterns of files and directories dbt must ignore entirely — same syntax as `.gitignore`.",
    "source": "https://docs.getdbt.com/reference/dbtignore",
    "fr": {
      "question": "À quoi sert le fichier `.dbtignore` dans un projet dbt ?",
      "choices": [
        "À indiquer les fichiers à inclure dans le projet dbt",
        "À indiquer les fichiers à exclure du projet dbt",
        "À indiquer les fichiers que dbt doit archiver",
        "À indiquer les fichiers que dbt doit versionner"
      ],
      "explanation": "`.dbtignore` (racine du projet) liste des motifs de fichiers et dossiers que dbt doit ignorer totalement — même syntaxe que `.gitignore`."
    }
  },
  {
    "id": "cfg-014",
    "module": "models",
    "topic": ".dbtignore",
    "topic_fr": ".dbtignore",
    "question": "Which file in a dbt project has a similar syntax to a .gitignore file?",
    "choices": [
      ".dbtignore",
      ".dbtconfig",
      ".dbtexclude",
      ".dbtsettings"
    ],
    "answer": [
      0
    ],
    "explanation": "`.dbtignore` uses gitignore-style patterns. The other file names do not exist.",
    "source": "https://docs.getdbt.com/reference/dbtignore",
    "fr": {
      "question": "Quel fichier d'un projet dbt a une syntaxe proche de `.gitignore` ?",
      "choices": [
        ".dbtignore",
        ".dbtconfig",
        ".dbtexclude",
        ".dbtsettings"
      ],
      "explanation": "`.dbtignore` utilise des motifs de type gitignore. Les autres noms n'existent pas."
    }
  },
  {
    "id": "cfg-015",
    "module": "models",
    "topic": ".dbtignore",
    "topic_fr": ".dbtignore",
    "question": "What happens to files and subdirectories matching the pattern specified in the .dbtignore file?",
    "choices": [
      "They will be read and parsed by dbt but not executed",
      "They will be executed by dbt but not read or parsed",
      "They will not be read, parsed, or otherwise detected by dbt",
      "They will be archived by dbt and not included in the project"
    ],
    "answer": [
      2
    ],
    "explanation": "Ignored paths are invisible to dbt: not parsed, not in the manifest, not selectable. Useful for large non-dbt folders that slow down parsing.",
    "source": "https://docs.getdbt.com/reference/dbtignore",
    "fr": {
      "question": "Qu'advient-il des fichiers et sous-dossiers correspondant aux motifs de `.dbtignore` ?",
      "choices": [
        "Ils sont lus et parsés par dbt mais pas exécutés",
        "Ils sont exécutés par dbt mais ni lus ni parsés",
        "Ils ne sont ni lus, ni parsés, ni détectés par dbt",
        "Ils sont archivés par dbt et exclus du projet"
      ],
      "explanation": "Les chemins ignorés sont invisibles pour dbt : pas parsés, absents du manifest, non sélectionnables. Utile pour de gros dossiers non-dbt qui ralentissent le parsing."
    }
  },
  {
    "id": "cfg-016",
    "module": "models",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "What is the purpose of the analysis-paths configuration in the dbt_project.yml file?",
    "choices": [
      "To specify the directories where analysis files are located",
      "To specify the directories where model files are located",
      "To specify the directories where test files are located",
      "To specify the directories where seed files are located"
    ],
    "answer": [
      0
    ],
    "explanation": "Analyses are SQL files compiled but never executed or materialized. `analysis-paths` tells dbt where to find them.",
    "source": "https://docs.getdbt.com/reference/project-configs/analysis-paths",
    "fr": {
      "question": "À quoi sert la configuration `analysis-paths` dans `dbt_project.yml` ?",
      "choices": [
        "À indiquer les dossiers des fichiers d'analyse",
        "À indiquer les dossiers des modèles",
        "À indiquer les dossiers des tests",
        "À indiquer les dossiers des seeds"
      ],
      "explanation": "Les analyses sont des fichiers SQL compilés mais jamais exécutés ni matérialisés. `analysis-paths` indique à dbt où les trouver."
    }
  },
  {
    "id": "cfg-017",
    "module": "models",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "What is the default behavior of dbt if the analysis-paths configuration is not specified in the dbt_project.yml file?",
    "choices": [
      "dbt will compile all .sql files as analyses",
      "dbt will not compile any .sql files as analyses",
      "dbt will compile only a specific set of .sql files as analyses",
      "dbt will prompt the user for the location of analysis files"
    ],
    "answer": [
      1
    ],
    "explanation": "Without `analysis-paths`, no analyses are compiled. `dbt init` populates it with `[\"analyses\"]`, which is why it feels like a default.",
    "source": "https://docs.getdbt.com/reference/project-configs/analysis-paths",
    "fr": {
      "question": "Quel est le comportement par défaut de dbt si `analysis-paths` n'est pas défini dans `dbt_project.yml` ?",
      "choices": [
        "dbt compile tous les fichiers .sql comme analyses",
        "dbt ne compile aucun fichier .sql comme analyse",
        "dbt compile seulement un ensemble précis de fichiers .sql comme analyses",
        "dbt demande à l'utilisateur l'emplacement des analyses"
      ],
      "explanation": "Sans `analysis-paths`, aucune analyse n'est compilée. `dbt init` le renseigne avec `[\"analyses\"]`, d'où l'impression d'une valeur par défaut."
    }
  },
  {
    "id": "cfg-018",
    "module": "models",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "In the following example config in a dbt_project.yml file, which of the following options is the correct format for specifying custom analysis directory in dbt?",
    "choices": [
      "analysis-paths: [\"custom_analyses\"]",
      "analysis : [\"custom_analyses\"]",
      "analysis-path: [\"custom_analyses\"]",
      "analysis-dir: [\"custom_analyses\"]"
    ],
    "answer": [
      0
    ],
    "explanation": "All path configs are plural and take a list: `analysis-paths`, `model-paths`, `seed-paths`, `test-paths`, `macro-paths`, `snapshot-paths`, `docs-paths`, `asset-paths`.",
    "source": "https://docs.getdbt.com/reference/project-configs/analysis-paths",
    "fr": {
      "question": "Dans l'exemple de config d'un fichier dbt_project.yml, laquelle des options suivantes est le format correct pour indiquer un dossier d'analyses personnalisé dans dbt ?",
      "choices": [
        "analysis-paths: [\"custom_analyses\"]",
        "analysis : [\"custom_analyses\"]",
        "analysis-path: [\"custom_analyses\"]",
        "analysis-dir: [\"custom_analyses\"]"
      ],
      "explanation": "Toutes les configs de chemins sont au pluriel et prennent une liste : `analysis-paths`, `model-paths`, `seed-paths`, `test-paths`, `macro-paths`, `snapshot-paths`, `docs-paths`, `asset-paths`."
    }
  },
  {
    "id": "cfg-019",
    "module": "docs",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "What is the purpose of the asset-paths configuration in the dbt_project.yml file?",
    "choices": [
      "To specify the directories where model files are located",
      "To specify the directories where test files are located",
      "To specify the directories where seed files are located",
      "To specify the directories to copy to the target directory as part of the docs generate command"
    ],
    "answer": [
      3
    ],
    "explanation": "`asset-paths` copies folders (e.g. images used in doc blocks) into `target/` during `dbt docs generate`, so the docs site can display them.",
    "source": "https://docs.getdbt.com/reference/project-configs/asset-paths",
    "fr": {
      "question": "À quoi sert la configuration `asset-paths` dans `dbt_project.yml` ?",
      "choices": [
        "À indiquer les dossiers des modèles",
        "À indiquer les dossiers des tests",
        "À indiquer les dossiers des seeds",
        "À indiquer les dossiers à copier dans target lors de docs generate"
      ],
      "explanation": "`asset-paths` copie des dossiers (ex. images utilisées dans les doc blocks) dans `target/` pendant `dbt docs generate`, pour que le site docs puisse les afficher."
    }
  },
  {
    "id": "cfg-020",
    "module": "docs",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "What is the default behavior of dbt for the asset-paths configuration if not specified in the dbt_project.yml file?",
    "choices": [
      "dbt will copy all files in the assets directory",
      "dbt will not copy any additional files as part of docs generate",
      "dbt will copy a specific set of files as part of docs generate",
      "dbt will prompt the user for the location of asset files"
    ],
    "answer": [
      1
    ],
    "explanation": "There is no default asset folder: nothing extra is copied unless `asset-paths` is set.",
    "source": "https://docs.getdbt.com/reference/project-configs/asset-paths",
    "fr": {
      "question": "Quel est le comportement par défaut de dbt pour `asset-paths` si elle n'est pas définie ?",
      "choices": [
        "dbt copie tous les fichiers du dossier assets",
        "dbt ne copie aucun fichier supplémentaire lors de docs generate",
        "dbt copie un ensemble précis de fichiers lors de docs generate",
        "dbt demande l'emplacement des assets"
      ],
      "explanation": "Il n'y a pas de dossier d'assets par défaut : rien n'est copié tant que `asset-paths` n'est pas défini."
    }
  },
  {
    "id": "cfg-021",
    "module": "docs",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "In the following example config in a dbt_project.yml file, which of the following options is the correct format for specifying the location of the assets that will be copied to the target during the docs generate command?",
    "choices": [
      "custom-asset-paths: [\"assets\"]",
      "asset-paths: [\"assets\"]",
      "artefact-asset-paths: [\"assets\"]",
      "artefact-assetfiles-paths: [\"assets\"]"
    ],
    "answer": [
      1
    ],
    "explanation": "`asset-paths: [\"assets\"]`. The images can then be referenced in doc blocks as `assets/my_image.png`.",
    "source": "https://docs.getdbt.com/reference/project-configs/asset-paths",
    "fr": {
      "question": "Dans l'exemple de config d'un fichier dbt_project.yml, laquelle des options suivantes est le format correct pour indiquer l'emplacement des assets qui seront copiés dans target lors de la commande docs generate ?",
      "choices": [
        "custom-asset-paths: [\"assets\"]",
        "asset-paths: [\"assets\"]",
        "artefact-asset-paths: [\"assets\"]",
        "artefact-assetfiles-paths: [\"assets\"]"
      ],
      "explanation": "`asset-paths: [\"assets\"]`. Les images sont ensuite référencées dans les doc blocks via `assets/mon_image.png`."
    }
  },
  {
    "id": "cfg-022",
    "module": "pipelines",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "What is the purpose of the clean-targets configuration in the dbt_project.yml file?",
    "choices": [
      "To specify the directories where model files are located",
      "To specify the directories where test files are located",
      "To specify the custom list of directories to be removed by the dbt clean command",
      "To specify the directories where seed files are located"
    ],
    "answer": [
      2
    ],
    "explanation": "`dbt clean` deletes every directory listed in `clean-targets`. Paths must be inside the project unless `--no-clean-project-files-only` is used.",
    "source": "https://docs.getdbt.com/reference/project-configs/clean-targets",
    "fr": {
      "question": "À quoi sert la configuration `clean-targets` dans `dbt_project.yml` ?",
      "choices": [
        "À indiquer les dossiers des modèles",
        "À indiquer les dossiers des tests",
        "À indiquer la liste des dossiers supprimés par dbt clean",
        "À indiquer les dossiers des seeds"
      ],
      "explanation": "`dbt clean` supprime chaque dossier listé dans `clean-targets`. Les chemins doivent être dans le projet sauf avec `--no-clean-project-files-only`."
    }
  },
  {
    "id": "cfg-023",
    "module": "pipelines",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "What is the default behavior of the dbt clean command if the clean-targets configuration is not included in the dbt_project.yml file?",
    "choices": [
      "The clean command will remove all files in the project directory",
      "The clean command will remove files in your target-path",
      "The clean command will not remove any files",
      "The clean command will prompt the user for the directories to clean"
    ],
    "answer": [
      1
    ],
    "explanation": "Without `clean-targets`, `dbt clean` only removes the `target-path` directory (default `target`).",
    "source": "https://docs.getdbt.com/reference/project-configs/clean-targets",
    "fr": {
      "question": "Quel est le comportement par défaut de `dbt clean` si `clean-targets` n'est pas défini ?",
      "choices": [
        "dbt clean supprime tous les fichiers du projet",
        "dbt clean supprime les fichiers de target-path",
        "dbt clean ne supprime aucun fichier",
        "dbt clean demande les dossiers à nettoyer"
      ],
      "explanation": "Sans `clean-targets`, `dbt clean` ne supprime que le dossier `target-path` (par défaut `target`)."
    }
  },
  {
    "id": "cfg-024",
    "module": "pipelines",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "In the following dbt_project.yml configs specify below, which config will remove the target, dbt_packages, logs when running the dbt clean command?",
    "choices": [
      "cleaned-targets: [target, dbt_packages, logs]",
      "clean-targets: [target, dbt_packages, logs]",
      "clean: [target, dbt_packages, logs]",
      "clean-dbt: [target, dbt_packages, logs]"
    ],
    "answer": [
      1
    ],
    "explanation": "`clean-targets: [target, dbt_packages, logs]` is the usual setup. After cleaning `dbt_packages`, run `dbt deps` again.",
    "source": "https://docs.getdbt.com/reference/project-configs/clean-targets",
    "fr": {
      "question": "Parmi les configs de dbt_project.yml ci-dessous, laquelle supprimera target, dbt_packages et logs lors de l'exécution de la commande dbt clean ?",
      "choices": [
        "cleaned-targets: [target, dbt_packages, logs]",
        "clean-targets: [target, dbt_packages, logs]",
        "clean: [target, dbt_packages, logs]",
        "clean-dbt: [target, dbt_packages, logs]"
      ],
      "explanation": "`clean-targets: [target, dbt_packages, logs]` est la configuration habituelle. Après avoir nettoyé `dbt_packages`, relancer `dbt deps`."
    }
  },
  {
    "id": "cfg-025",
    "module": "models",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "What is the purpose of the config-version configuration in the dbt_project.yml file?",
    "choices": [
      "To specify the version of the dbt software",
      "To specify the version of the dbt_project.yml file structure",
      "To specify the version of the database schema",
      "To specify the version of the dbt documentation"
    ],
    "answer": [
      1
    ],
    "explanation": "`config-version` states which syntax of `dbt_project.yml` is used. Version 2 is the only supported syntax today; the key is optional since dbt 1.5.",
    "source": "https://docs.getdbt.com/reference/project-configs/config-version",
    "fr": {
      "question": "À quoi sert la configuration `config-version` dans `dbt_project.yml` ?",
      "choices": [
        "À indiquer la version du logiciel dbt",
        "À indiquer la version de la structure du fichier dbt_project.yml",
        "À indiquer la version du schéma de base de données",
        "À indiquer la version de la documentation dbt"
      ],
      "explanation": "`config-version` indique la syntaxe de `dbt_project.yml` utilisée. La version 2 est la seule supportée aujourd'hui ; la clé est optionnelle depuis dbt 1.5."
    }
  },
  {
    "id": "cfg-026",
    "module": "models",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "What does the following configuration indicate in the dbt_project.yml file? config-version: 2",
    "choices": [
      "The project uses version 2 of the dbt software",
      "The project uses version 2 of the dbt_project.yml file structure",
      "The project uses version 2 of the database schema",
      "The project uses version 2 of the dbt documentation"
    ],
    "answer": [
      1
    ],
    "explanation": "It is the v2 syntax of the project file (introduced in dbt 0.17), unrelated to the dbt Core version or to any warehouse object.",
    "source": "https://docs.getdbt.com/reference/project-configs/config-version",
    "fr": {
      "question": "Qu'indique `config-version: 2` dans `dbt_project.yml` ?",
      "choices": [
        "Le projet utilise la version 2 du logiciel dbt",
        "Le projet utilise la version 2 de la structure du fichier dbt_project.yml",
        "Le projet utilise la version 2 du schéma de base de données",
        "Le projet utilise la version 2 de la documentation dbt"
      ],
      "explanation": "C'est la syntaxe v2 du fichier projet (introduite en dbt 0.17), sans lien avec la version de dbt Core ni avec un objet de l'entrepôt."
    }
  },
  {
    "id": "cfg-027",
    "module": "models",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "What happens if the config-version configuration is not included in the dbt_project.yml file?",
    "choices": [
      "dbt will assume the dbt_project.yml uses the version 2 syntax",
      "dbt will not work without specifying the config-version",
      "dbt will assume the dbt_project.yml uses the version 1 syntax",
      "dbt will prompt the user to specify the version of the dbt_project.yml file structure"
    ],
    "answer": [
      2
    ],
    "explanation": "Historically (dbt < 1.5) a missing `config-version` meant the legacy v1 syntax. Note: since dbt 1.5 the key is optional and v2 is assumed — if the exam asks, the reference answer is still \"version 1\".",
    "source": "https://docs.getdbt.com/reference/project-configs/config-version",
    "fr": {
      "question": "Que se passe-t-il si `config-version` est absent de `dbt_project.yml` ?",
      "choices": [
        "dbt suppose que dbt_project.yml utilise la syntaxe version 2",
        "dbt ne fonctionne pas sans config-version",
        "dbt suppose que dbt_project.yml utilise la syntaxe version 1",
        "dbt demande de préciser la version de la structure"
      ],
      "explanation": "Historiquement (dbt < 1.5), l'absence de `config-version` signifiait la syntaxe v1. Attention : depuis dbt 1.5 la clé est optionnelle et la v2 est supposée — mais la réponse de référence de l'examen reste « version 1 »."
    }
  },
  {
    "id": "cfg-028",
    "module": "models",
    "topic": "Seeds",
    "topic_fr": "Seeds",
    "question": "Your manager asks you to store seed data in two separate directories to make it easier to manage different data sources. Which configuration should you use to achieve this goal while following best practices?",
    "choices": [
      "seed-paths: [\"custom_seeds\"]",
      "seed-paths: [\"models\"] model-paths: [\"models\"]",
      "seed-paths: [\"seeds\", \"custom_seeds\"]",
      "seed-paths: [\"seeds\"] model-paths: [\"custom_seeds\"]"
    ],
    "answer": [
      2
    ],
    "explanation": "`seed-paths` accepts several directories. Keep seeds separate from models for clarity.",
    "source": "https://docs.getdbt.com/reference/project-configs/seed-paths",
    "fr": {
      "question": "Votre manager vous demande de stocker les seeds dans deux dossiers distincts pour faciliter la gestion de différentes sources de données. Quelle configuration utiliser pour atteindre cet objectif en respectant les bonnes pratiques ?",
      "choices": [
        "seed-paths: [\"custom_seeds\"]",
        "seed-paths: [\"models\"] model-paths: [\"models\"]",
        "seed-paths: [\"seeds\", \"custom_seeds\"]",
        "seed-paths: [\"seeds\"] model-paths: [\"custom_seeds\"]"
      ],
      "explanation": "`seed-paths` accepte plusieurs dossiers. Garder les seeds séparés des modèles pour la lisibilité."
    }
  },
  {
    "id": "cfg-029",
    "module": "models",
    "topic": "Seeds",
    "topic_fr": "Seeds",
    "question": "Your team lead, Ben, suggests that you should co-locate models and seeds in the same directory to simplify the project structure. Which configuration should you use to achieve this goal while making sure that dbt can still differentiate between models and seed data?",
    "choices": [
      "seed-paths: [\"seeds\"] model-paths: [\"models\"]",
      "seed-paths: [\"models\"] model-paths: [\"seeds\"]",
      "seed-paths: [\"models\"] model-paths: [\"models\"]",
      "seed-paths: [\"seeds\"] model-paths: [\"seeds\"]"
    ],
    "answer": [
      2
    ],
    "explanation": "Both configs can point to the same folder: dbt identifies seeds by the `.csv` extension and models by `.sql`/`.py`.",
    "source": "https://docs.getdbt.com/reference/project-configs/seed-paths",
    "fr": {
      "question": "Votre team lead, Ben, suggère de placer les modèles et les seeds dans le même dossier pour simplifier la structure du projet. Quelle configuration utiliser pour atteindre cet objectif tout en s'assurant que dbt peut toujours distinguer les modèles des seeds ?",
      "choices": [
        "seed-paths: [\"seeds\"] model-paths: [\"models\"]",
        "seed-paths: [\"models\"] model-paths: [\"seeds\"]",
        "seed-paths: [\"models\"] model-paths: [\"models\"]",
        "seed-paths: [\"seeds\"] model-paths: [\"seeds\"]"
      ],
      "explanation": "Les deux configs peuvent pointer vers le même dossier : dbt reconnaît les seeds à l'extension `.csv` et les modèles à `.sql`/`.py`."
    }
  },
  {
    "id": "cfg-030",
    "module": "models",
    "topic": "Seeds",
    "topic_fr": "Seeds",
    "question": "Your manager, Captain Data, suggests using a subdirectory named \"custom_seeds\" instead of the default \"seeds\" to store seed data. Which configuration should you use to achieve this goal while maintaining a clear project structure?",
    "choices": [
      "seed-paths: [\"custom_seeds\"] model-paths: [\"models\"]",
      "seed-paths: [\"seeds\", \"custom_seeds\"]",
      "seed-paths: [\"models\"] model-paths: [\"models\"]",
      "seed-paths: [\"custom_seeds\"] model-paths: [\"custom_seeds\"]"
    ],
    "answer": [
      0
    ],
    "explanation": "Replace the default with `seed-paths: [\"custom_seeds\"]` and keep models in `models`.",
    "source": "https://docs.getdbt.com/reference/project-configs/seed-paths",
    "fr": {
      "question": "Votre manager, Captain Data, suggère d'utiliser un sous-dossier nommé \"custom_seeds\" au lieu du dossier par défaut \"seeds\" pour stocker les seeds. Quelle configuration utiliser pour atteindre cet objectif tout en gardant une structure de projet claire ?",
      "choices": [
        "seed-paths: [\"custom_seeds\"] model-paths: [\"models\"]",
        "seed-paths: [\"seeds\", \"custom_seeds\"]",
        "seed-paths: [\"models\"] model-paths: [\"models\"]",
        "seed-paths: [\"custom_seeds\"] model-paths: [\"custom_seeds\"]"
      ],
      "explanation": "Remplacer le défaut par `seed-paths: [\"custom_seeds\"]` et garder les modèles dans `models`."
    }
  },
  {
    "id": "cfg-031",
    "module": "dependencies",
    "topic": "Dispatch",
    "topic_fr": "Dispatch",
    "question": "Your team wants to use the 'spark_utils' compatibility package to \"shim\" the 'dbt_utils' package, and your team has implemented certain macros from the 'dbt_utils' package in the root project ('my_root_project'). The custom implementations should take precedence over the ones from 'dbt_utils'. Which configuration should you use to achieve these goals?",
    "choices": [
      "dispatch: - macro_namespace: dbt_utils search_order: ['spark_utils', 'dbt_utils']",
      "dispatch: - macro_namespace: dbt_utils search_order: ['my_root_project', 'dbt_utils']",
      "dispatch: - macro_namespace: dbt_utils search_order: ['spark_utils', 'my_root_project', 'dbt_utils']",
      "dispatch: - macro_namespace: dbt_utils search_order: ['my_root_project', 'spark_utils', 'dbt_utils']"
    ],
    "answer": [
      2
    ],
    "explanation": "This is the reference answer from the study material (shim first). Note the docs' own example puts the root project first: `['my_root_project', 'spark_utils', 'dbt_utils']` — for real work, put whichever must win first in `search_order`.",
    "source": "https://docs.getdbt.com/reference/project-configs/dispatch-config",
    "fr": {
      "question": "Votre équipe veut utiliser le package de compatibilité 'spark_utils' pour « shimmer » le package 'dbt_utils', et a implémenté certaines macros de 'dbt_utils' dans le projet racine ('my_root_project'). Les implémentations personnalisées doivent primer sur celles de 'dbt_utils'. Quelle configuration utiliser pour atteindre ces objectifs ?",
      "choices": [
        "dispatch: - macro_namespace: dbt_utils search_order: ['spark_utils', 'dbt_utils']",
        "dispatch: - macro_namespace: dbt_utils search_order: ['my_root_project', 'dbt_utils']",
        "dispatch: - macro_namespace: dbt_utils search_order: ['spark_utils', 'my_root_project', 'dbt_utils']",
        "dispatch: - macro_namespace: dbt_utils search_order: ['my_root_project', 'spark_utils', 'dbt_utils']"
      ],
      "explanation": "C'est la réponse de référence du support d'étude (shim en premier). Notez que l'exemple de la doc met le projet racine en premier : `['my_root_project', 'spark_utils', 'dbt_utils']` — en pratique, mettez en tête de `search_order` ce qui doit l'emporter."
    }
  },
  {
    "id": "cfg-032",
    "module": "dependencies",
    "topic": "Dispatch",
    "topic_fr": "Dispatch",
    "question": "A member of your team wants to ensure that dispatch looks in the root project first for macro implementations and then in the package named by the macro_namespace. What configuration should they use to achieve this default behavior?",
    "choices": [
      "dispatch: - macro_namespace: packagename search_order: [packagename]",
      "dispatch: - macro_namespace: packagename search_order: ['my_root_project', packagename]",
      "No configuration is needed, as this is the default behavior.",
      "dispatch: - macro_namespace: packagename search_order: ['my_root_project', 'packagename']"
    ],
    "answer": [
      2
    ],
    "explanation": "By default, dispatch searches the root project first, then the namespace package. `dispatch:` is only needed to change that order.",
    "source": "https://docs.getdbt.com/reference/project-configs/dispatch-config",
    "fr": {
      "question": "Un membre de votre équipe veut s'assurer que dispatch cherche d'abord les implémentations de macros dans le projet racine, puis dans le package nommé par macro_namespace. Quelle configuration doit-il utiliser pour obtenir ce comportement par défaut ?",
      "choices": [
        "dispatch: - macro_namespace: packagename search_order: [packagename]",
        "dispatch: - macro_namespace: packagename search_order: ['my_root_project', packagename]",
        "Aucune configuration, c'est le comportement par défaut.",
        "dispatch: - macro_namespace: packagename search_order: ['my_root_project', 'packagename']"
      ],
      "explanation": "Par défaut, dispatch cherche d'abord dans le projet racine, puis dans le package du namespace. `dispatch:` ne sert qu'à changer cet ordre."
    }
  },
  {
    "id": "cfg-033",
    "module": "debugging",
    "topic": "Logs",
    "topic_fr": "Logs",
    "question": "Your team member would like to ensure that dbt writes logs to a custom directory named \"custom_logs\" instead of the default \"logs\" directory. Which of the following methods can be used to achieve this goal, and what is their precedence order from highest to lowest?",
    "choices": [
      "CLI flag, environment variable, dbt_project.yml (in this order)",
      "environment variable, dbt_project.yml, CLI flag (in this order)",
      "dbt_project.yml, environment variable, CLI flag (in this order)",
      "dbt_project.yml, CLI flag, environment variable (in this order)"
    ],
    "answer": [
      0
    ],
    "explanation": "Global config precedence: CLI flag (`--log-path`) > environment variable (`DBT_LOG_PATH`) > `dbt_project.yml` (`log-path`).",
    "source": "https://docs.getdbt.com/reference/global-configs/about-global-configs",
    "fr": {
      "question": "Un membre de votre équipe voudrait que dbt écrive les logs dans un dossier personnalisé nommé \"custom_logs\" au lieu du dossier par défaut \"logs\". Quelles méthodes permettent d'y parvenir, et quel est leur ordre de priorité, de la plus forte à la plus faible ?",
      "choices": [
        "Flag CLI, variable d'environnement, dbt_project.yml (dans cet ordre)",
        "Variable d'environnement, dbt_project.yml, flag CLI",
        "dbt_project.yml, variable d'environnement, flag CLI",
        "dbt_project.yml, flag CLI, variable d'environnement"
      ],
      "explanation": "Priorité des configs globales : flag CLI (`--log-path`) > variable d'environnement (`DBT_LOG_PATH`) > `dbt_project.yml` (`log-path`)."
    }
  },
  {
    "id": "cfg-034",
    "module": "models",
    "topic": "Jinja & macros",
    "topic_fr": "Jinja & macros",
    "question": "What is the default directory where dbt searches for macros, and how can you specify a custom directory for macros in the dbt_project.yml file?",
    "choices": [
      "The default directory is \"models\" and you can specify a custom directory with the config model-paths: [directorypath]",
      "The default directory is \"macros\" and you can specify a custom directory with the config macro-paths: [directorypath]",
      "The default directory is \"macros\" and you can specify a custom directory with the config docs-paths: [directorypath]",
      "The default directory is \"models\" and you can specify a custom directory with the config models-paths: [directorypath]"
    ],
    "answer": [
      1
    ],
    "explanation": "`macro-paths: [\"macros\"]` is the default. Generic tests defined as `{% test %}` blocks can also live there.",
    "source": "https://docs.getdbt.com/reference/project-configs/macro-paths",
    "fr": {
      "question": "Quel est le dossier par défaut dans lequel dbt cherche les macros, et comment indiquer un dossier personnalisé pour les macros dans le fichier dbt_project.yml ?",
      "choices": [
        "Le dossier par défaut est \"models\" et on peut indiquer un dossier personnalisé avec la config model-paths: [directorypath]",
        "Le dossier par défaut est \"macros\" et on peut indiquer un dossier personnalisé avec la config macro-paths: [directorypath]",
        "Le dossier par défaut est \"macros\" et on peut indiquer un dossier personnalisé avec la config docs-paths: [directorypath]",
        "Le dossier par défaut est \"models\" et on peut indiquer un dossier personnalisé avec la config models-paths: [directorypath]"
      ],
      "explanation": "`macro-paths: [\"macros\"]` est le défaut. Les tests génériques définis en blocs `{% test %}` peuvent aussi y vivre."
    }
  },
  {
    "id": "cfg-035",
    "module": "dependencies",
    "topic": "Packages",
    "topic_fr": "Packages",
    "question": "What is the purpose of the \"packages-install-path\" parameter in the dbt_project.yml file, and what is the default directory where packages are installed when running the \"dbt deps\" command?",
    "choices": [
      "The \"packages-install-path\" parameter is used to specify the path where dbt models are stored, and the default directory for package installation is \"models\".",
      "The \"packages-install-path\" parameter is used to specify the path where dbt packages are installed, and the default directory for package installation is \"dbt_packages\".",
      "The \"packages-install-path\" parameter is used to specify the path where dbt macros are stored, and the default directory for package installation is \"macros\".",
      "The \"packages-install-path\" parameter is used to specify the path where dbt documentation is stored, and the default directory for package installation is \"docs\"."
    ],
    "answer": [
      1
    ],
    "explanation": "`dbt deps` downloads packages into `dbt_packages/` (add it to `.gitignore` and `clean-targets`).",
    "source": "https://docs.getdbt.com/reference/project-configs/packages-install-path",
    "fr": {
      "question": "Quel est le rôle du paramètre \"packages-install-path\" dans le fichier dbt_project.yml, et quel est le dossier par défaut où les packages sont installés lors de la commande \"dbt deps\" ?",
      "choices": [
        "Le paramètre \"packages-install-path\" sert à indiquer le chemin où sont stockés les modèles dbt, et le dossier d'installation par défaut des packages est \"models\".",
        "Le paramètre \"packages-install-path\" sert à indiquer le chemin où sont installés les packages dbt, et le dossier d'installation par défaut des packages est \"dbt_packages\".",
        "Le paramètre \"packages-install-path\" sert à indiquer le chemin où sont stockées les macros dbt, et le dossier d'installation par défaut des packages est \"macros\".",
        "Le paramètre \"packages-install-path\" sert à indiquer le chemin où est stockée la documentation dbt, et le dossier d'installation par défaut des packages est \"docs\"."
      ],
      "explanation": "`dbt deps` télécharge les packages dans `dbt_packages/` (à mettre dans `.gitignore` et `clean-targets`)."
    }
  },
  {
    "id": "cfg-036",
    "module": "models",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "What is the purpose of the \"name\" parameter in the dbt_project.yml file, and what are the requirements for the project name?",
    "choices": [
      "The \"name\" parameter is used to specify the name of the database where dbt models are stored, and the project name can be in CamelCase.",
      "The \"name\" parameter is used to specify the name of the dbt project, and the project name can be in snake_case, consisting of letters, digits, and underscores only, and cannot start with a digit.",
      "The \"name\" parameter is used to specify the name of the schema where dbt models are stored, and the project name can be in kebab-case.",
      "The \"name\" parameter is used to specify the name of the dbt project, and the project name can contain any characters and start with a digit."
    ],
    "answer": [
      1
    ],
    "explanation": "The project name must be a valid identifier: letters, digits, underscores, not starting with a digit. It is used as a Jinja/YAML key, so dashes are not allowed.",
    "source": "https://docs.getdbt.com/reference/project-configs/name",
    "fr": {
      "question": "Quel est le rôle du paramètre \"name\" dans le fichier dbt_project.yml, et quelles sont les contraintes sur le nom du projet ?",
      "choices": [
        "Le paramètre \"name\" sert à indiquer le nom de la base de données où sont stockés les modèles dbt, et le nom du projet peut être en CamelCase.",
        "Le paramètre \"name\" sert à indiquer le nom du projet dbt, et le nom du projet peut être en snake_case, composé uniquement de lettres, chiffres et underscores, et ne peut pas commencer par un chiffre.",
        "Le paramètre \"name\" sert à indiquer le nom du schéma où sont stockés les modèles dbt, et le nom du projet peut être en kebab-case.",
        "Le paramètre \"name\" sert à indiquer le nom du projet dbt, et le nom du projet peut contenir n'importe quel caractère et commencer par un chiffre."
      ],
      "explanation": "Le nom du projet doit être un identifiant valide : lettres, chiffres, underscores, pas de chiffre en tête. Il sert de clé Jinja/YAML, donc pas de tirets."
    }
  },
  {
    "id": "cfg-037",
    "module": "pipelines",
    "topic": "Hooks & grants",
    "topic_fr": "Hooks & grants",
    "question": "What is the purpose of on-run-start and on-run-end hooks in dbt_project.yml?",
    "choices": [
      "To specify the database to use when running dbt commands",
      "To run SQL statements before and after dbt run commands",
      "To define macros that can be used in dbt_project.yml",
      "To configure dbt resources for specific dbt commands"
    ],
    "answer": [
      1
    ],
    "explanation": "They run SQL (or macros) once at the start/end of `dbt run`, `build`, `test`, `seed`, `snapshot`, `compile` and `docs generate` — unlike `pre-hook`/`post-hook`, which run per model.",
    "source": "https://docs.getdbt.com/reference/project-configs/on-run-start-on-run-end",
    "fr": {
      "question": "À quoi servent les hooks `on-run-start` et `on-run-end` dans `dbt_project.yml` ?",
      "choices": [
        "À indiquer la base à utiliser pour les commandes dbt",
        "À exécuter du SQL avant et après les commandes dbt run",
        "À définir des macros utilisables dans dbt_project.yml",
        "À configurer les ressources dbt pour certaines commandes"
      ],
      "explanation": "Ils exécutent du SQL (ou des macros) une fois au début/à la fin de `dbt run`, `build`, `test`, `seed`, `snapshot`, `compile` et `docs generate` — contrairement à `pre-hook`/`post-hook` qui s'exécutent par modèle."
    }
  },
  {
    "id": "cfg-038",
    "module": "pipelines",
    "topic": "Hooks & grants",
    "topic_fr": "Hooks & grants",
    "question": "Which variable is only available in an on-run-end hook in dbt_project.yml?",
    "choices": [
      "models",
      "target",
      "vars",
      "schemas"
    ],
    "answer": [
      3
    ],
    "explanation": "`schemas` (list of schemas dbt wrote to), `database_schemas` and `results` (run results) are only available in `on-run-end`. `target` is available everywhere.",
    "source": "https://docs.getdbt.com/reference/dbt-jinja-functions/on-run-end-context",
    "fr": {
      "question": "Quelle variable n'est disponible que dans un hook `on-run-end` ?",
      "choices": [
        "models",
        "target",
        "vars",
        "schemas"
      ],
      "explanation": "`schemas` (schémas dans lesquels dbt a écrit), `database_schemas` et `results` ne sont disponibles que dans `on-run-end`. `target` est disponible partout."
    }
  },
  {
    "id": "cfg-039",
    "module": "pipelines",
    "topic": "Hooks & grants",
    "topic_fr": "Hooks & grants",
    "question": "What is the syntax for calling a macro in an on-run-end hook in dbt_project.yml?",
    "choices": [
      "{% call_macro macro_name() %}",
      "{{ call_macro(macro_name) }}",
      "{{ macro_name(schemas) }}",
      "{% macro_name(schemas) %}"
    ],
    "answer": [
      2
    ],
    "explanation": "Hooks are Jinja strings: `on-run-end: \"{{ grant_select(schemas) }}\"`. The macro renders to the SQL that gets executed.",
    "source": "https://docs.getdbt.com/reference/project-configs/on-run-start-on-run-end",
    "fr": {
      "question": "Quelle est la syntaxe pour appeler une macro dans un hook `on-run-end` ?",
      "choices": [
        "{% call_macro macro_name() %}",
        "{{ call_macro(macro_name) }}",
        "{{ macro_name(schemas) }}",
        "{% macro_name(schemas) %}"
      ],
      "explanation": "Les hooks sont des chaînes Jinja : `on-run-end: \"{{ grant_select(schemas) }}\"`. La macro se rend en SQL, qui est exécuté."
    }
  },
  {
    "id": "cfg-040",
    "module": "tests",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "A data analyst wants to specify a custom list of directories where singular tests are located. Which of the following options allows them to achieve this in dbt_project.yml file?",
    "choices": [
      "test-paths: [\"tests\"]",
      "test-paths: [\"/path/to/custom_tests\"]",
      "test-paths: [directorypath]",
      "test-paths: [\"custom_tests\"]"
    ],
    "answer": [
      3
    ],
    "explanation": "`test-paths` takes project-relative directory names (absolute paths are not allowed). `[\"tests\"]` is just the default.",
    "source": "https://docs.getdbt.com/reference/project-configs/test-paths",
    "fr": {
      "question": "Un data analyst veut indiquer une liste personnalisée de dossiers contenant les tests singuliers. Laquelle des options suivantes le permet dans le fichier dbt_project.yml ?",
      "choices": [
        "test-paths: [\"tests\"]",
        "test-paths: [\"/path/to/custom_tests\"]",
        "test-paths: [directorypath]",
        "test-paths: [\"custom_tests\"]"
      ],
      "explanation": "`test-paths` prend des noms de dossiers relatifs au projet (pas de chemin absolu). `[\"tests\"]` est simplement le défaut."
    }
  },
  {
    "id": "cfg-041",
    "module": "models",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "What is the difference between the version tag in dbt_project.yml and the version tag in a .yml property file?",
    "choices": [
      "The version tag in dbt_project.yml represents the version of the dbt project, while the version tag in a .yml property file provides the control tag for how dbt processes the property files.",
      "The version tag in dbt_project.yml is used to specify the dbt Core version, while the version tag in a .yml property file is used to specify the version of the property file.",
      "The version tag in dbt_project.yml is a required parameter, while the version tag in a .yml property file is an optional parameter.",
      "The version tag in dbt_project.yml is not currently used by dbt, while the version tag in a .yml property file is used to specify the version of the dbt project."
    ],
    "answer": [
      0
    ],
    "explanation": "`version` in `dbt_project.yml` is a free project version (informational). `version: 2` in property files was the schema marker of the YAML format; both are optional since dbt 1.5.",
    "source": "https://docs.getdbt.com/reference/project-configs/version",
    "fr": {
      "question": "Quelle différence entre le tag `version` de `dbt_project.yml` et celui d'un fichier de propriétés `.yml` ?",
      "choices": [
        "Le tag version de dbt_project.yml représente la version du projet dbt, tandis que le tag version d'un fichier de propriétés .yml sert de marqueur de contrôle pour la façon dont dbt traite les fichiers de propriétés.",
        "Le tag version de dbt_project.yml sert à indiquer la version de dbt Core, tandis que le tag version d'un fichier de propriétés .yml sert à indiquer la version du fichier de propriétés.",
        "Le tag version de dbt_project.yml est un paramètre obligatoire, tandis que le tag version d'un fichier de propriétés .yml est optionnel.",
        "Le tag version de dbt_project.yml n'est pas utilisé actuellement par dbt, tandis que le tag version d'un fichier de propriétés .yml sert à indiquer la version du projet dbt."
      ],
      "explanation": "`version` dans `dbt_project.yml` est une version libre du projet (informatif). `version: 2` dans les fichiers de propriétés marquait le format YAML ; les deux sont optionnels depuis dbt 1.5."
    }
  },
  {
    "id": "cfg-042",
    "module": "models",
    "topic": "Snapshots",
    "topic_fr": "Snapshots",
    "question": "What does the \"snapshot-paths\" configuration in dbt_project.yml do, and what is the default value if this configuration is not specified?",
    "choices": [
      "The \"snapshot-paths\" configuration allows you to specify a custom list of directories where snapshots are located. The default value is [\"snapshots\"].",
      "The \"snapshot-paths\" configuration allows you to specify a custom list of directories where models are located. The default value is [\"models\"].",
      "The \"snapshot-paths\" configuration allows you to specify a custom list of directories where tests are located. The default value is [\"tests\"].",
      "The \"snapshot-paths\" configuration allows you to specify a custom list of directories where macros are located. The default value is [\"macros\"]."
    ],
    "answer": [
      0
    ],
    "explanation": "Snapshots (SQL blocks or YAML definitions) are read from `snapshot-paths`, default `snapshots/`.",
    "source": "https://docs.getdbt.com/reference/project-configs/snapshot-paths",
    "fr": {
      "question": "Que fait `snapshot-paths` dans `dbt_project.yml`, et quelle est sa valeur par défaut ?",
      "choices": [
        "La configuration \"snapshot-paths\" permet d'indiquer une liste personnalisée de dossiers contenant les snapshots. La valeur par défaut est [\"snapshots\"].",
        "La configuration \"snapshot-paths\" permet d'indiquer une liste personnalisée de dossiers contenant les modèles. La valeur par défaut est [\"models\"].",
        "La configuration \"snapshot-paths\" permet d'indiquer une liste personnalisée de dossiers contenant les tests. La valeur par défaut est [\"tests\"].",
        "La configuration \"snapshot-paths\" permet d'indiquer une liste personnalisée de dossiers contenant les macros. La valeur par défaut est [\"macros\"]."
      ],
      "explanation": "Les snapshots (blocs SQL ou définitions YAML) sont lus depuis `snapshot-paths`, par défaut `snapshots/`."
    }
  },
  {
    "id": "cfg-043",
    "module": "pipelines",
    "topic": "query-comment",
    "topic_fr": "query-comment",
    "question": "What is the purpose of the query-comment configuration in dbt_project.yml?",
    "choices": [
      "To add custom columns to the database tables",
      "To inject a comment in each query that dbt runs against your database",
      "To create a separate log file for each query executed by dbt",
      "To format the output of the SQL queries"
    ],
    "answer": [
      1
    ],
    "explanation": "The comment helps trace queries in the warehouse's query history back to dbt (project, target, node).",
    "source": "https://docs.getdbt.com/reference/project-configs/query-comment",
    "fr": {
      "question": "À quoi sert la configuration `query-comment` dans `dbt_project.yml` ?",
      "choices": [
        "À ajouter des colonnes aux tables",
        "À injecter un commentaire dans chaque requête que dbt exécute",
        "À créer un fichier de log par requête",
        "À formater la sortie des requêtes SQL"
      ],
      "explanation": "Le commentaire permet de relier les requêtes de l'historique de l'entrepôt à dbt (projet, cible, nœud)."
    }
  },
  {
    "id": "cfg-044",
    "module": "pipelines",
    "topic": "query-comment",
    "topic_fr": "query-comment",
    "question": "What is the default behavior of dbt regarding query comments?",
    "choices": [
      "dbt does not insert any comments by default",
      "dbt inserts a JSON comment containing the app, dbt_version, profile_name, target_name, and node_id at the top of the query",
      "dbt inserts a static comment \"executed by dbt\" at the top of the query",
      "dbt inserts a dynamic comment based on the configured user in the active dbt target"
    ],
    "answer": [
      1
    ],
    "explanation": "By default, every query is prefixed with `/* {\"app\": \"dbt\", \"dbt_version\": …, \"profile_name\": …, \"target_name\": …, \"node_id\": …} */`.",
    "source": "https://docs.getdbt.com/reference/project-configs/query-comment",
    "fr": {
      "question": "Quel est le comportement par défaut de dbt pour les query comments ?",
      "choices": [
        "dbt n'insère aucun commentaire par défaut",
        "dbt insère un commentaire JSON avec app, dbt_version, profile_name, target_name et node_id en tête de requête",
        "dbt insère un commentaire statique \"executed by dbt\"",
        "dbt insère un commentaire dynamique basé sur l'utilisateur de la cible"
      ],
      "explanation": "Par défaut, chaque requête est préfixée par `/* {\"app\": \"dbt\", \"dbt_version\": …, \"profile_name\": …, \"target_name\": …, \"node_id\": …} */`."
    }
  },
  {
    "id": "cfg-045",
    "module": "pipelines",
    "topic": "query-comment",
    "topic_fr": "query-comment",
    "question": "How can you disable query comments in dbt_project.yml?",
    "choices": [
      "Set query-comment: \"disable\"",
      "Set query-comment: \"none\"",
      "Leave query-comment blank or set query-comment: null",
      "Set query-comment: \"no_comment\""
    ],
    "answer": [
      2
    ],
    "explanation": "`query-comment:` with an empty value or `null` disables the comment. A string value replaces the default comment.",
    "source": "https://docs.getdbt.com/reference/project-configs/query-comment",
    "fr": {
      "question": "Comment désactiver les query comments dans `dbt_project.yml` ?",
      "choices": [
        "query-comment: \"disable\"",
        "query-comment: \"none\"",
        "Laisser query-comment vide ou mettre query-comment: null",
        "query-comment: \"no_comment\""
      ],
      "explanation": "`query-comment:` vide ou à `null` désactive le commentaire. Une chaîne remplace le commentaire par défaut."
    }
  },
  {
    "id": "cfg-046",
    "module": "pipelines",
    "topic": "query-comment",
    "topic_fr": "query-comment",
    "question": "What does the 'append' key do when using the dictionary syntax for query comments?",
    "choices": [
      "Appends the comment to the beginning of the query",
      "Appends the comment to the end of the query",
      "Appends the comment to a separate log file",
      "Appends the comment to the query as a new column"
    ],
    "answer": [
      1
    ],
    "explanation": "`query-comment: {comment: \"…\", append: true}` puts the comment at the end of the query instead of the top — useful for warehouses that strip leading comments (e.g. Snowflake's query history).",
    "source": "https://docs.getdbt.com/reference/project-configs/query-comment",
    "fr": {
      "question": "Que fait la clé `append` dans la syntaxe dictionnaire de query-comment ?",
      "choices": [
        "Ajoute le commentaire au début de la requête",
        "Ajoute le commentaire à la fin de la requête",
        "Ajoute le commentaire dans un fichier de log séparé",
        "Ajoute le commentaire comme nouvelle colonne"
      ],
      "explanation": "`query-comment: {comment: \"…\", append: true}` place le commentaire à la fin de la requête plutôt qu'en tête — utile pour les entrepôts qui suppriment les commentaires initiaux (ex. historique Snowflake)."
    }
  },
  {
    "id": "cfg-047",
    "module": "pipelines",
    "topic": "query-comment",
    "topic_fr": "query-comment",
    "question": "What is the function of setting the 'query-comment.job-label' key to 'true' in the 'dbt_project.yml' file?",
    "choices": [
      "It includes the query comment items as job labels on the query executed, in addition to labels specified in the BigQuery-specific config",
      "It removes the query comment items from the executed query",
      "It adds the query comment items as a new column in the database table",
      "It logs the query comment items in a separate log file"
    ],
    "answer": [
      0
    ],
    "explanation": "BigQuery only: `job-label: true` turns the comment key/values into BigQuery job labels, useful for cost attribution.",
    "source": "https://docs.getdbt.com/reference/project-configs/query-comment",
    "fr": {
      "question": "Que fait `query-comment.job-label: true` dans `dbt_project.yml` ?",
      "choices": [
        "Ajoute les éléments du commentaire comme labels de job BigQuery, en plus des labels de la config BigQuery",
        "Retire les éléments du commentaire de la requête",
        "Ajoute les éléments du commentaire comme colonne",
        "Journalise les éléments du commentaire dans un fichier séparé"
      ],
      "explanation": "BigQuery uniquement : `job-label: true` transforme les clés/valeurs du commentaire en labels de job BigQuery, utile pour l'attribution des coûts."
    }
  },
  {
    "id": "cfg-048",
    "module": "models",
    "topic": "Quoting",
    "topic_fr": "Quoting",
    "question": "What is the purpose of the quoting configuration in dbt_project.yml?",
    "choices": [
      "To configure whether dbt should use single or double quotes for strings in SQL queries",
      "To configure whether dbt should quote databases, schemas, and identifiers when creating relations or resolving a ref function",
      "To configure whether dbt should quote column names in the SELECT statement of a SQL query",
      "To configure whether dbt should quote the entire SQL query when executing it against the database"
    ],
    "answer": [
      1
    ],
    "explanation": "Quoting decides whether relation names are wrapped in double quotes (`\"db\".\"schema\".\"table\"`), which makes them case-sensitive on most warehouses.",
    "source": "https://docs.getdbt.com/reference/project-configs/quoting",
    "fr": {
      "question": "À quoi sert la configuration `quoting` dans `dbt_project.yml` ?",
      "choices": [
        "À choisir entre guillemets simples ou doubles pour les chaînes SQL",
        "À décider si dbt met entre guillemets les bases, schémas et identifiants lors de la création de relations ou de la résolution de ref",
        "À décider si dbt met entre guillemets les noms de colonnes du SELECT",
        "À décider si dbt met entre guillemets toute la requête"
      ],
      "explanation": "Le quoting décide si les noms de relations sont entourés de guillemets doubles (`\"db\".\"schema\".\"table\"`), ce qui les rend sensibles à la casse sur la plupart des entrepôts."
    }
  },
  {
    "id": "cfg-049",
    "module": "models",
    "topic": "Quoting",
    "topic_fr": "Quoting",
    "question": "What is the default behavior for quoting in most adapters?",
    "choices": [
      "Quoting is set to true by default",
      "Quoting is set to false by default",
      "Quoting depends on the database type and version",
      "Quoting is not applicable by default"
    ],
    "answer": [
      0
    ],
    "explanation": "Most adapters quote by default (`database`, `schema`, `identifier` = true). Snowflake is the notable exception: false by default.",
    "source": "https://docs.getdbt.com/reference/project-configs/quoting",
    "fr": {
      "question": "Quel est le comportement par défaut du quoting pour la plupart des adaptateurs ?",
      "choices": [
        "Le quoting est à true par défaut",
        "Le quoting est à false par défaut",
        "Ça dépend du type et de la version de la base",
        "Le quoting ne s'applique pas par défaut"
      ],
      "explanation": "La plupart des adaptateurs quotent par défaut (`database`, `schema`, `identifier` = true). Snowflake est l'exception notable : false par défaut."
    }
  },
  {
    "id": "cfg-050",
    "module": "models",
    "topic": "Quoting",
    "topic_fr": "Quoting",
    "question": "How does the default quoting behavior vary for Snowflake?",
    "choices": [
      "Snowflake always quotes identifiers by default",
      "Snowflake never quotes identifiers by default",
      "Snowflake will uppercase unquoted identifiers by default",
      "Snowflake will lowercase unquoted identifiers by default"
    ],
    "answer": [
      2
    ],
    "explanation": "Snowflake resolves unquoted identifiers as UPPERCASE. Quoting a lowercase name creates a case-sensitive object that must always be quoted afterwards — hence dbt's default of `false` for Snowflake.",
    "source": "https://docs.getdbt.com/reference/project-configs/quoting",
    "fr": {
      "question": "En quoi le comportement de quoting par défaut diffère-t-il sur Snowflake ?",
      "choices": [
        "Snowflake quote toujours les identifiants",
        "Snowflake ne quote jamais les identifiants",
        "Snowflake met en MAJUSCULES les identifiants non quotés",
        "Snowflake met en minuscules les identifiants non quotés"
      ],
      "explanation": "Snowflake résout les identifiants non quotés en MAJUSCULES. Quoter un nom en minuscules crée un objet sensible à la casse qu'il faudra toujours quoter — d'où le défaut `false` de dbt pour Snowflake."
    }
  },
  {
    "id": "cfg-051",
    "module": "models",
    "topic": "Quoting",
    "topic_fr": "Quoting",
    "question": "What is the recommended quoting configuration for Snowflake?",
    "choices": [
      "Set all quoting configs to True",
      "Set all quoting configs to False",
      "Set database quoting to True and schema and identifier quoting to False",
      "Set schema quoting to True and database and identifier quoting to False"
    ],
    "answer": [
      1
    ],
    "explanation": "`quoting: {database: false, schema: false, identifier: false}` — the default for dbt-snowflake — avoids case-sensitive objects.",
    "source": "https://docs.getdbt.com/reference/project-configs/quoting",
    "fr": {
      "question": "Quelle est la configuration de quoting recommandée pour Snowflake ?",
      "choices": [
        "Tout à True",
        "Tout à False",
        "database à True, schema et identifier à False",
        "schema à True, database et identifier à False"
      ],
      "explanation": "`quoting: {database: false, schema: false, identifier: false}` — le défaut de dbt-snowflake — évite les objets sensibles à la casse."
    }
  },
  {
    "id": "cfg-052",
    "module": "models",
    "topic": "Quoting",
    "topic_fr": "Quoting",
    "question": "What happens when a model name is lowercased and quoted in Snowflake?",
    "choices": [
      "The model name can be referred to without quotes",
      "The model name cannot be referred to without quotes",
      "The model name will be converted to uppercase automatically",
      "The model name will not be affected by quoting"
    ],
    "answer": [
      1
    ],
    "explanation": "A quoted lowercase name is stored as-is; an unquoted reference is uppercased and no longer matches, so every later reference must be quoted.",
    "source": "https://docs.getdbt.com/reference/project-configs/quoting",
    "fr": {
      "question": "Que se passe-t-il quand un nom de modèle en minuscules est quoté sur Snowflake ?",
      "choices": [
        "Le nom peut être référencé sans guillemets",
        "Le nom ne peut plus être référencé sans guillemets",
        "Le nom est converti en majuscules automatiquement",
        "Le nom n'est pas affecté par le quoting"
      ],
      "explanation": "Un nom en minuscules quoté est stocké tel quel ; une référence non quotée est mise en majuscules et ne correspond plus, donc toute référence ultérieure doit être quotée."
    }
  },
  {
    "id": "cfg-053",
    "module": "models",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "What is the purpose of the `require-dbt-version` configuration in the `dbt_project.yml` file?",
    "choices": [
      "To specify the minimum and maximum version of Python required for the project",
      "To restrict a project to work only with a range of dbt versions and provide helpful error messages if an unsupported version is used",
      "To specify the version of a package that is required by the project",
      "To automatically update the dbt version used in the project"
    ],
    "answer": [
      1
    ],
    "explanation": "Packages use it heavily (e.g. `dbt_utils`) to fail fast with a clear message on incompatible dbt Core versions.",
    "source": "https://docs.getdbt.com/reference/project-configs/require-dbt-version",
    "fr": {
      "question": "À quoi sert la configuration `require-dbt-version` dans `dbt_project.yml` ?",
      "choices": [
        "À indiquer les versions min et max de Python",
        "À restreindre le projet à une plage de versions de dbt et donner une erreur claire sinon",
        "À indiquer la version d'un package requis",
        "À mettre à jour automatiquement la version de dbt"
      ],
      "explanation": "Les packages l'utilisent beaucoup (ex. `dbt_utils`) pour échouer vite avec un message clair sur une version de dbt Core incompatible."
    }
  },
  {
    "id": "cfg-054",
    "module": "models",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "Which of the following is the correct way to specify a minimum dbt version of 1.0.0 in the `dbt_project.yml` file? (Choose ALL answers that apply)",
    "choices": [
      "require-dbt-version: >=1.0.0",
      "require-dbt-version: \">=1.0.0\"",
      "require-dbt-version: '>=1.0.0'",
      "require-dbt-version: \">= 1.0.0\""
    ],
    "answer": [
      1,
      2
    ],
    "explanation": "The specifier must be a quoted string (single or double quotes), without a space between the operator and the version. Unquoted `>=` is invalid YAML; `\">= 1.0.0\"` has an unsupported space.",
    "source": "https://docs.getdbt.com/reference/project-configs/require-dbt-version",
    "fr": {
      "question": "Quelles écritures sont correctes pour exiger dbt 1.0.0 minimum dans `dbt_project.yml` ? (toutes les bonnes réponses)",
      "choices": [
        "require-dbt-version: >=1.0.0",
        "require-dbt-version: \">=1.0.0\"",
        "require-dbt-version: '>=1.0.0'",
        "require-dbt-version: \">= 1.0.0\""
      ],
      "explanation": "Le spécificateur doit être une chaîne quotée (simples ou doubles guillemets), sans espace entre l'opérateur et la version. `>=` non quoté est du YAML invalide ; `\">= 1.0.0\"` contient un espace non supporté."
    }
  },
  {
    "id": "cfg-055",
    "module": "models",
    "topic": "dbt_project.yml",
    "topic_fr": "dbt_project.yml",
    "question": "How can you disable version checks when running dbt?",
    "choices": [
      "Remove the require-dbt-version configuration from the `dbt_project.yml` file",
      "Set require-dbt-version to an empty value",
      "Use the --no-version-check flag when running dbt",
      "Change the require-dbt-version configuration to '>=0.0.0'"
    ],
    "answer": [
      2
    ],
    "explanation": "`dbt run --no-version-check` (or `DBT_VERSION_CHECK=false`) skips the check for the project **and** its packages, without editing any file.",
    "source": "https://docs.getdbt.com/reference/global-configs/version-compatibility",
    "fr": {
      "question": "Comment désactiver la vérification de version lors de l'exécution de dbt ?",
      "choices": [
        "Retirer require-dbt-version de dbt_project.yml",
        "Mettre require-dbt-version à vide",
        "Utiliser le flag --no-version-check",
        "Mettre require-dbt-version à '>=0.0.0'"
      ],
      "explanation": "`dbt run --no-version-check` (ou `DBT_VERSION_CHECK=false`) saute la vérification pour le projet **et** ses packages, sans modifier de fichier."
    }
  },
  {
    "id": "cfg-056",
    "module": "models",
    "topic": "Configs vs properties",
    "topic_fr": "Configs vs propriétés",
    "question": "In a dbt project, what is the main distinction between properties and configurations of resources?",
    "choices": [
      "Configurations are only defined in .yml files, while properties can be set in multiple places.",
      "Configurations are applied hierarchically and can be set in multiple places, while properties are declared one-by-one in .yml files.",
      "Properties can be selected based on their values using the config: selection method, while configurations cannot.",
      "Properties are applied hierarchically and can be set in multiple places, while configurations are declared one-by-one in .yml files."
    ],
    "answer": [
      1
    ],
    "explanation": "Configs (`materialized`, `tags`, `schema`…) cascade from `dbt_project.yml` → YAML `config:` → in-file `config()`. Properties (`description`, `columns`, `tests`…) are declared per resource in YAML only.",
    "source": "https://docs.getdbt.com/reference/configs-and-properties",
    "fr": {
      "question": "Quelle est la distinction principale entre propriétés et configurations d'une ressource dbt ?",
      "choices": [
        "Les configurations ne se définissent qu'en .yml, les propriétés à plusieurs endroits",
        "Les configurations s'appliquent hiérarchiquement et peuvent se définir à plusieurs endroits ; les propriétés se déclarent une par une en .yml",
        "Les propriétés sont sélectionnables via config:, pas les configurations",
        "Les propriétés s'appliquent hiérarchiquement ; les configurations se déclarent une par une en .yml"
      ],
      "explanation": "Les configs (`materialized`, `tags`, `schema`…) se propagent de `dbt_project.yml` → `config:` YAML → `config()` dans le fichier. Les propriétés (`description`, `columns`, `tests`…) se déclarent par ressource, en YAML seulement."
    }
  },
  {
    "id": "cfg-057",
    "module": "models",
    "topic": "Configs vs properties",
    "topic_fr": "Configs vs propriétés",
    "question": "Which file is primarily used to declare properties for resources in a dbt project?",
    "choices": [
      "dbt_project.yml",
      "schema.yml",
      "config.sql",
      "properties.sql"
    ],
    "answer": [
      1
    ],
    "explanation": "Property files are any `.yml` next to the resources — `schema.yml` by convention, but the name is free (`_models.yml`, `stg_orders.yml`…).",
    "source": "https://docs.getdbt.com/reference/configs-and-properties",
    "fr": {
      "question": "Quel fichier sert principalement à déclarer les propriétés des ressources ?",
      "choices": [
        "dbt_project.yml",
        "schema.yml",
        "config.sql",
        "properties.sql"
      ],
      "explanation": "Les fichiers de propriétés sont n'importe quel `.yml` à côté des ressources — `schema.yml` par convention, mais le nom est libre (`_models.yml`, `stg_orders.yml`…)."
    }
  },
  {
    "id": "cfg-059",
    "module": "models",
    "topic": "Configs vs properties",
    "topic_fr": "Configs vs propriétés",
    "question": "How can you select resources based on their configuration values in a dbt project?",
    "choices": [
      "Using the properties: selection method",
      "Using the config: selection method",
      "Using the resources: selection method",
      "Using the values: selection method"
    ],
    "answer": [
      1
    ],
    "explanation": "`--select config.materialized:incremental` or `config.schema:marts`. Properties are not selectable this way.",
    "source": "https://docs.getdbt.com/reference/node-selection/methods#config",
    "fr": {
      "question": "Comment sélectionner des ressources selon leurs valeurs de configuration ?",
      "choices": [
        "Avec la méthode properties:",
        "Avec la méthode config:",
        "Avec la méthode resources:",
        "Avec la méthode values:"
      ],
      "explanation": "`--select config.materialized:incremental` ou `config.schema:marts`. Les propriétés ne sont pas sélectionnables ainsi."
    }
  },
  {
    "id": "cfg-060",
    "module": "models",
    "topic": "Configs vs properties",
    "topic_fr": "Configs vs propriétés",
    "question": "In which of the following locations can you define configurations for different resource types in a dbt project?",
    "choices": [
      "Only within .sql files using the config() Jinja macro",
      "Only in .yml files using a config property",
      "Only in the dbt_project.yml file, under the corresponding resource key",
      "In .sql files using the config() Jinja macro, in .yml files using a config property, and in the dbt_project.yml file under the corresponding resource key"
    ],
    "answer": [
      3
    ],
    "explanation": "Three places, from least to most specific: `dbt_project.yml`, property YAML `config:`, in-file `{{ config(...) }}`.",
    "source": "https://docs.getdbt.com/reference/configs-and-properties",
    "fr": {
      "question": "Parmi les emplacements suivants, où peut-on définir des configurations pour les différents types de ressources d'un projet dbt ?",
      "choices": [
        "Uniquement dans les fichiers .sql, via la macro Jinja config()",
        "Uniquement dans les fichiers .yml, via une propriété config",
        "Uniquement dans le fichier dbt_project.yml, sous la clé de ressource correspondante",
        "Dans les fichiers .sql via la macro Jinja config(), dans les fichiers .yml via une propriété config, et dans le fichier dbt_project.yml sous la clé de ressource correspondante"
      ],
      "explanation": "Trois endroits, du moins au plus spécifique : `dbt_project.yml`, `config:` du YAML de propriétés, `{{ config(...) }}` dans le fichier."
    }
  },
  {
    "id": "cfg-061",
    "module": "models",
    "topic": "Configs vs properties",
    "topic_fr": "Configs vs propriétés",
    "question": "How does dbt prioritize configurations in terms of specificity?",
    "choices": [
      "From least specific to most specific: project file -> .yml file -> in-file config() block",
      "From most specific to least specific: in-file config() block -> .yml file -> project file",
      "From least specific to most specific: .yml file -> project file -> in-file config() block",
      "From most specific to least specific: project file -> in-file config() block -> .yml file"
    ],
    "answer": [
      1
    ],
    "explanation": "The in-file `config()` wins over the property YAML, which wins over `dbt_project.yml`. (A and B describe the same order in opposite directions; the reference answer is B.)",
    "source": "https://docs.getdbt.com/reference/configs-and-properties#config-inheritance",
    "fr": {
      "question": "Comment dbt priorise-t-il les configurations selon leur spécificité ?",
      "choices": [
        "Du moins spécifique au plus spécifique : fichier projet -> fichier .yml -> bloc config() dans le fichier",
        "Du plus spécifique au moins spécifique : bloc config() dans le fichier -> fichier .yml -> fichier projet",
        "Du moins spécifique au plus spécifique : fichier .yml -> fichier projet -> bloc config() dans le fichier",
        "Du plus spécifique au moins spécifique : fichier projet -> bloc config() dans le fichier -> fichier .yml"
      ],
      "explanation": "Le `config()` du fichier l'emporte sur le YAML de propriétés, qui l'emporte sur `dbt_project.yml`. (A et B décrivent le même ordre dans les deux sens ; la réponse de référence est B.)"
    }
  },
  {
    "id": "cfg-062",
    "module": "models",
    "topic": "Configs vs properties",
    "topic_fr": "Configs vs propriétés",
    "question": "How does dbt handle combining configurations when they are applied hierarchically?",
    "choices": [
      "Most configurations are additive, meaning the more specific values are added to the less specific values.",
      "Most configurations are \"clobbered,\" meaning the more specific value replaces the less specific value, with a few exceptions like tags, meta dictionaries, pre-hook, and post-hook.",
      "Most configurations are merged, and the final value is the combination of all values.",
      "Most configurations are ignored when a more specific value is available."
    ],
    "answer": [
      1
    ],
    "explanation": "`tags` are unioned, `meta` dictionaries merged, `pre-hook`/`post-hook` appended (project hooks run first). Everything else: most specific wins.",
    "source": "https://docs.getdbt.com/reference/configs-and-properties#combining-configs",
    "fr": {
      "question": "Comment dbt combine-t-il les configurations appliquées hiérarchiquement ?",
      "choices": [
        "La plupart sont additives : les valeurs spécifiques s'ajoutent aux générales",
        "La plupart sont « écrasées » : la valeur la plus spécifique remplace la moins spécifique, sauf quelques exceptions comme tags, meta, pre-hook et post-hook",
        "La plupart sont fusionnées, la valeur finale combine toutes les valeurs",
        "La plupart sont ignorées dès qu'une valeur plus spécifique existe"
      ],
      "explanation": "Les `tags` sont unis, les dictionnaires `meta` fusionnés, les `pre-hook`/`post-hook` cumulés (hooks projet d'abord). Pour le reste : la plus spécifique gagne."
    }
  },
  {
    "id": "cfg-063",
    "module": "models",
    "topic": "Configs vs properties",
    "topic_fr": "Configs vs propriétés",
    "question": "In which type of file and location can you define properties for resources in a dbt project?",
    "choices": [
      "In .sql files, in the same directory as your resources",
      "In .yml files, in the same directory as your resources",
      "In .txt files, in a separate directory from your resources",
      "In .json files, in the same directory as your resources"
    ],
    "answer": [
      1
    ],
    "explanation": "Properties live in `.yml` files placed under the resource paths (`models/`, `seeds/`, `snapshots/`…), usually beside the files they describe.",
    "source": "https://docs.getdbt.com/reference/configs-and-properties",
    "fr": {
      "question": "Dans quel type de fichier et à quel endroit définit-on les propriétés des ressources ?",
      "choices": [
        "Dans des .sql, dans le même dossier que les ressources",
        "Dans des .yml, dans le même dossier que les ressources",
        "Dans des .txt, dans un dossier séparé",
        "Dans des .json, dans le même dossier que les ressources"
      ],
      "explanation": "Les propriétés vivent dans des `.yml` placés sous les chemins de ressources (`models/`, `seeds/`, `snapshots/`…), en général à côté des fichiers décrits."
    }
  },
  {
    "id": "cfg-064",
    "module": "models",
    "topic": "Configs vs properties",
    "topic_fr": "Configs vs propriétés",
    "question": "Which of the following is a reason some properties in .yml files can only be defined there?",
    "choices": [
      "They have a unique Jinja rendering context",
      "They create new project resources",
      "They don't make sense as hierarchical configuration",
      "All of the above"
    ],
    "answer": [
      3
    ],
    "explanation": "Sources, exposures, groups and metrics only exist through YAML; column descriptions/tests are per-resource; some (e.g. `sources`) have their own Jinja context.",
    "source": "https://docs.getdbt.com/reference/configs-and-properties",
    "fr": {
      "question": "Laquelle des raisons suivantes explique que certaines propriétés des fichiers .yml ne peuvent être définies que là ?",
      "choices": [
        "Elles ont un contexte de rendu Jinja particulier",
        "Elles créent de nouvelles ressources du projet",
        "Elles n'ont pas de sens en configuration hiérarchique",
        "Toutes ces raisons"
      ],
      "explanation": "Sources, exposures, groups et metrics n'existent qu'en YAML ; descriptions/tests de colonnes sont par ressource ; certaines (ex. `sources`) ont leur propre contexte Jinja."
    }
  },
  {
    "id": "cfg-065",
    "module": "pipelines",
    "topic": "Node selection",
    "topic_fr": "Sélection de nœuds",
    "question": "How would you use the --select flag to execute the required set of models and their associated tests?",
    "choices": [
      "dbt build --select tag:customer_analytics",
      "dbt build --select tag:customer_analytics --select +",
      "dbt build --select tag:customer_analytics+",
      "dbt build --select tag:customer_analytics+ && dbt test"
    ],
    "answer": [
      2
    ],
    "explanation": "`tag:customer_analytics+` selects the tagged models and everything downstream; `dbt build` runs the tests of the selected nodes, so a separate `dbt test` is redundant.",
    "source": "https://docs.getdbt.com/reference/node-selection/graph-operators",
    "fr": {
      "question": "Comment utiliseriez-vous le flag --select pour exécuter l'ensemble de modèles requis et leurs tests associés ?",
      "choices": [
        "dbt build --select tag:customer_analytics",
        "dbt build --select tag:customer_analytics --select +",
        "dbt build --select tag:customer_analytics+",
        "dbt build --select tag:customer_analytics+ && dbt test"
      ],
      "explanation": "`tag:customer_analytics+` sélectionne les modèles taggés et tout l'aval ; `dbt build` exécute les tests des nœuds sélectionnés, donc un `dbt test` séparé est redondant."
    }
  }
]);
