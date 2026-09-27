# DBT-ANALYTICS-CERTIFICATION

Projet dbt de lab pour la certification dbt Analytics Engineer.
Données Ethereum : contrats, transactions et token transfers.

## Liens rapides

| | Lien |
|---|---|
| Quiz en ligne (PC, téléphone) | https://sergesadjomo.github.io/DBT-ANALYTICS-CERTIFICATION/ |
| Quiz en local | [`quiz/index.html`](quiz/index.html) · lanceurs [`quiz/lancer.bat`](quiz/lancer.bat) (Windows) / [`quiz/lancer.sh`](quiz/lancer.sh) (macOS, Linux) |
| Mode d'emploi du quiz et ajout de questions | [`quiz/README.md`](quiz/README.md) |
| Fiches de révision | [Sections 10 à 15](#fiches-de-révision) · [seeds](seeds/revision.md) · [snapshots](snapshots/revision.md) · [tests](tests/revision.md) |
| Workflows GitHub Actions | [`.github/workflows/`](.github/workflows/) |
| Examen officiel | [dbt Analytics Engineering Certification](https://www.getdbt.com/certifications/analytics-engineer-certification-exam) |
| Documentation dbt | [docs.getdbt.com](https://docs.getdbt.com/) · cours gratuits [learn.getdbt.com](https://learn.getdbt.com/) |

## Objectif

Illustrer les concepts clés de dbt : sources, staging, marts, macros, variables, seeds, tests, analyses, modèles Python, tags, custom schemas et multi-environnements (`dev` / `prod`).

## Structure du projet

```
DBT-ANALYTICS-CERTIFICATION/
├── dbt_project.yml         # Configuration globale du projet
├── packages.yml            # Packages dbt installés
├── package-lock.yml        # Versions exactes des packages
├── README.md               # Ce fichier
├── models/
│   ├── sources.yml         # Définition des sources brutes
│   ├── schema.yml          # Tests et documentation des modèles
│   ├── groups.yml          # Groupes (gouvernance)
│   ├── transactions.md     # Doc block
│   ├── base/               # Modèles de base (vues / incrémentaux)
│   ├── staging/            # Modèles intermédiaires enrichis (analytics/, fraud/)
│   └── marts/              # Modèles finaux pour BI / rapports (analytics/, fraud/)
├── macros/                 # Macros réutilisables
├── seeds/                  # Fichiers statiques
├── analyses/               # Fichiers d'analyse (non matérialisés)
├── tests/                  # Tests singuliers et génériques
├── snapshots/              # Snapshots (SCD Type 2)
├── documentation/          # Fiches de révision par section
└── quiz/                   # Quiz de révision (application web)
```

## Quiz de révision

Application web statique pour s'entraîner à l'examen : 140 questions en anglais (bouton FR/EN), sélection aléatoire, par module ou par sujet, en mode entraînement (correction immédiate) ou examen chronométré.

- **En ligne** : https://sergesadjomo.github.io/DBT-ANALYTICS-CERTIFICATION/ — rien à installer, fonctionne sur téléphone.
- **En local** : double-cliquer sur [`quiz/lancer.bat`](quiz/lancer.bat) ou [`quiz/index.html`](quiz/index.html) (aucun serveur nécessaire).
- **Ajouter des questions** : [`quiz/questions/`](quiz/questions/) (un fichier par module), format décrit dans [`quiz/README.md`](quiz/README.md) et [`quiz/questions/bank.js`](quiz/questions/bank.js).
- **Publication** : automatique à chaque modification de `quiz/` sur `main`, via [`quiz-pages.yml`](.github/workflows/quiz-pages.yml).

## Fiches de révision

- [Section 10 — Changements récents et nouveaux concepts](documentation/section_10.md)
- [Section 11 — Guide de debugging des erreurs dbt](documentation/section_11.md)
- [Section 12 — State selection, `result`, `retry` et `defer`](documentation/section_12.md)
- [Section 13 — CI/CD, `defer`, `dbt clone` et Slim CI](documentation/section_13.md)
- [Section 14 — Implementing dbt Tests](documentation/section_14.md)
- [Section 15 — Incremental Strategy: Microbatch](documentation/section_15.md)
- Notes : [seeds](seeds/revision.md) · [snapshots](snapshots/revision.md) · [tests](tests/revision.md)

## Rôle des fichiers principaux

### [`dbt_project.yml`](dbt_project.yml)
Configuration centrale : nom, profil, variables, flags (`fail_fast`), chemins des répertoires, `on-run-start` pour créer le schéma prod, tags et custom schema pour les marts.

### [`packages.yml`](packages.yml)
Packages installés : [`dbt-labs/codegen`](https://hub.getdbt.com/dbt-labs/codegen/latest/), [`dbt-labs/dbt_utils`](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/), [`dbt-labs/audit_helper`](https://hub.getdbt.com/dbt-labs/audit_helper/latest/). Versions figées dans [`package-lock.yml`](package-lock.yml).

### [`models/sources.yml`](models/sources.yml)
Déclare les sources brutes : `eth.eth_schema.{contracts, token_transfers, transactions}`.

### [`models/schema.yml`](models/schema.yml)
Documentation et tests (`not_null`, `unique`) sur les modèles, ex. `hash` de `stg_transactions`. Doc block dans [`models/transactions.md`](models/transactions.md), groupes dans [`models/groups.yml`](models/groups.yml).

### [`models/base/`](models/base/)
Modèles de base qui lisent les sources.
- [`stg_contracts.sql`](models/base/stg_contracts.sql) : lecture de `contracts`.
- [`stg_token_transfers.sql`](models/base/stg_token_transfers.sql) : lecture de `token_transfers`.
- [`stg_transactions.sql`](models/base/stg_transactions.sql) : modèle incrémental `merge` sur `hash`, filtre `is_incremental()`.

### [`models/staging/`](models/staging/)
- [`analytics/stg_transactions_enriched.sql`](models/staging/analytics/stg_transactions_enriched.sql) : enrichit `stg_transactions` avec le nombre de token transfers et catégorise les transactions (`contract_creation`, `token_transfer`, `plain_eth_transfer`, `other`).
- [`fraud/stg_fraud.sql`](models/staging/fraud/stg_fraud.sql)

### [`models/marts/`](models/marts/)
Modèles finaux pour les rapports.
- [`analytics/eth_activity_per_day.sql`](models/marts/analytics/eth_activity_per_day.sql) : agrégation par date et catégorie.
- [`analytics/stablecoin_activity_per_day_v1.sql`](models/marts/analytics/stablecoin_activity_per_day_v1.sql) / [`_v2.sql`](models/marts/analytics/stablecoin_activity_per_day_v2.sql) : activité des stablecoins via `conversion()` et le seed `stablecoins` (modèle versionné).
- [`analytics/fiat_backed_activity_per_day.sql`](models/marts/analytics/fiat_backed_activity_per_day.sql)
- [`analytics/token_activity_per_day.sql`](models/marts/analytics/token_activity_per_day.sql) : activité d'un token variabilisé (`token_address_var`, `token_decimals_var`).
- [`analytics/python_model.py`](models/marts/analytics/python_model.py) : modèle Python Snowpark ajoutant un indicateur de jour férié (`holidays`).
- [`fraud/confirm_fraud.sql`](models/marts/fraud/confirm_fraud.sql)

### [`macros/`](macros/)
- [`conversion_utils.sql`](macros/conversion_utils.sql) : macro `conversion(col, decimals)` pour diviser par `10^decimals`.
- [`create_prod_database.sql`](macros/create_prod_database.sql) : opération `run-operation` pour créer `prod_db` et `prod_schema`.
- [`ci-schema-cleanup.sql`](macros/ci-schema-cleanup.sql) : nettoyage des schémas de PR (utilisé par [`cleanup.yml`](.github/workflows/cleanup.yml)).
- [`test.sql`](macros/test.sql) : macro `random_macro()` de démonstration (log et requête).

### [`seeds/stablecoins.csv`](seeds/stablecoins.csv)
Table statique des stablecoins avec adresse, symbole, type et nombre de décimales.

### [`snapshots/airbnb.yml`](snapshots/airbnb.yml)
Exemple de snapshot défini en YAML (dbt 1.9+).

### [`tests/`](tests/)
- [`assert_eth_value_amount_is_positive.sql`](tests/assert_eth_value_amount_is_positive.sql) : test singulier.
- [`generic/generic_assert_value_amount_is_positive.sql`](tests/generic/generic_assert_value_amount_is_positive.sql) : test générique personnalisé.

### [`analyses/test.sql`](analyses/test.sql)
Analyse dbt utilisant `codegen` pour générer du YAML de sources et de modèles.

## CI/CD

| Workflow | Rôle | Déclenchement |
|---|---|---|
| [`quiz-pages.yml`](.github/workflows/quiz-pages.yml) | Publie le quiz sur GitHub Pages | automatique (modification de `quiz/` sur `main`) |
| [`dbt-ci.yml`](.github/workflows/dbt-ci.yml) | CI dbt sur les PR (Slim CI) | manuel — désactivé, essai Snowflake terminé |
| [`dbt-cd-deploy.yml`](.github/workflows/dbt-cd-deploy.yml) | Déploiement prod après fusion | manuel — désactivé, essai Snowflake terminé |
| [`cleanup.yml`](.github/workflows/cleanup.yml) | Nettoyage quotidien des schémas de PR | manuel — désactivé, essai Snowflake terminé |

Pour réactiver les workflows dbt, décommenter les déclencheurs en tête de chaque fichier.

## Profils et environnements

`profiles.yml` (hors repo, dans `~/.dbt/`) définit le profil `eth` avec deux targets :
- `dev` : `dbt_db.dbt_schema`
- `prod` : `prod_db.prod_schema`

Le profil utilisé par la CI est [`.github/profiles.yml`](.github/profiles.yml).

La base `prod_db` est créée via `dbt run-operation create_prod_database --target dev` avant de pouvoir utiliser `--target prod`.

## Commandes utiles

```powershell
# Compiler un modèle spécifique en prod
dbt compile -m test --target prod

# Créer la base prod (via le target dev)
dbt run-operation create_prod_database --target dev

# Charger les seeds
dbt seed

# Exécuter les modèles
dbt run

# Exécuter les tests
dbt test

# Exécuter un modèle spécifique en prod
dbt run -s stablecoin_activity_per_day --target prod
```

## Notes pour la certification

Ce lab couvre : `sources`, `refs`, `macros`, `var`, `seed`, `test`, `analysis`, `python model`, `tags`, `custom schemas`, `on-run-start`, `profiles` / `targets` et bonnes pratiques de modélisation dbt.
