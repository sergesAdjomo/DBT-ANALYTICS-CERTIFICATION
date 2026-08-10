# DBT-ANALYTICS-CERTIFICATION

Projet dbt de lab pour la certification dbt Analytics Engineer.
Données Ethereum : contrats, transactions et token transfers.

## Objectif

Illustrer les concepts clés de dbt : sources, staging, marts, macros, variables, seeds, tests, analyses, modèles Python, tags, custom schemas et multi-environnements (`dev` / `prod`).

## Structure du projet

```
eth/
├── dbt_project.yml         # Configuration globale du projet
├── packages.yml            # Packages dbt installés
├── README.md               # Ce fichier
├── models/
│   ├── sources.yml         # Définition des sources brutes
│   ├── schema.yml          # Tests et documentation des modèles
│   ├── base/               # Modèles de base (vues / incrémentaux)
│   │   ├── stg_contracts.sql
│   │   ├── stg_token_transfers.sql
│   │   └── stg_transactions.sql
│   ├── staging/            # Modèles intermédiaires enrichis
│   │   └── stg_transactions_enriched.sql
│   └── marts/              # Modèles finaux pour BI / rapports
│       ├── eth_activity_per_day.sql
│       ├── stablecoin_activity_per_day.sql
│       ├── token_activity_per_day.sql
│       └── python_model.py
├── macros/                 # Macros réutilisables
│   ├── conversion_utils.sql
│   ├── create_prod_database.sql
│   └── test.sql
├── seeds/                  # Fichiers statiques
│   └── stablecoins.csv
├── analyses/               # Fichiers d'analyse (non matérialisés)
│   └── test.sql
├── tests/                  # Tests personnalisés
└── snapshots/              # Snapshots (SCD Type 2)
```

## Rôle des fichiers principaux

### `dbt_project.yml`
Configuration centrale : nom, profil, variables, flags (`fail_fast`), chemins des répertoires, `on-run-start` pour créer le schéma prod, tags et custom schema pour les marts.

### `packages.yml`
Packages installés : `dbt-labs/codegen`, `dbt-labs/dbt_utils`, `dbt-labs/audit_helper`.

### `models/sources.yml`
Déclare les sources brutes : `eth.eth_schema.{contracts, token_transfers, transactions}`.

### `models/schema.yml`
Documentation et tests (`not_null`, `unique`) sur les modèles, ex. `hash` de `stg_transactions`.

### `models/base/`
Modèles de base qui lisent les sources.
- `stg_contracts.sql` : vue sur `contracts`.
- `stg_token_transfers.sql` : vue sur `token_transfers`.
- `stg_transactions.sql` : modèle incrémental `merge` sur `hash`, filtre `is_incremental()`.

### `models/staging/`
- `stg_transactions_enriched.sql` : enrichit `stg_transactions` avec le nombre de token transfers et catégorise les transactions (`contract_creation`, `token_transfer`, `plain_eth_transfer`, `other`).

### `models/marts/`
Modèles finaux pour les rapports.
- `eth_activity_per_day.sql` : agrégation par date et catégorie.
- `stablecoin_activity_per_day.sql` : activité des stablecoins via `conversion()` et le seed `stablecoins`.
- `token_activity_per_day.sql` : activité d'un token variabilisé (`token_address_var`, `token_decimals_var`).
- `python_model.py` : modèle Python Snowpark ajoutant un indicateur de jour férié (`holidays`).

### `macros/`
- `conversion_utils.sql` : macro `conversion(col, decimals)` pour diviser par `10^decimals`.
- `create_prod_database.sql` : opération `run-operation` pour créer `prod_db` et `prod_schema`.
- `test.sql` : macro `random_macro()` de démonstration (log et requête).

### `seeds/stablecoins.csv`
Table statique des stablecoins avec adresse, symbole, type et nombre de décimales.

### `analyses/test.sql`
Analyse dbt utilisant `codegen` pour générer du YAML de sources et de modèles.

## Profils et environnements

`profiles.yml` (hors repo, dans `~/.dbt/`) définit le profil `eth` avec deux targets :
- `dev` : `dbt_db.dbt_schema`
- `prod` : `prod_db.prod_schema`

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
