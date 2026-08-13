# Section 13 — CI/CD, `defer`, `dbt clone` et Slim CI

Cette section couvre l'intégration continue (CI) et le déploiement continu (CD) d'un projet dbt avec GitHub Actions, ainsi que les concepts `defer` et `dbt clone` utilisés pour optimiser les runs en environnement éphémère (Slim CI).

## 1. Objectif de la CI/CD pour dbt

- **CI (Continuous Integration)** : valider le code d'une Pull Request avant de la merger dans `main`, en exécutant dbt dans un environnement isolé et temporaire.
- **CD (Continuous Deployment)** : après le merge dans `main`, déployer automatiquement les changements vers la production.
- Objectif global : détecter les erreurs tôt, éviter de casser la prod, et ne pas dépendre d'exécutions manuelles.

## 2. Sécurité : gestion des credentials

- Le fichier `profiles.yml` ne doit **jamais** être commité avec des mots de passe ou clés en clair.
- On utilise un template `profiles.yml` committé (ici `.github/profiles.yml`) qui référence des **variables d'environnement** via `env_var(...)` :

```yaml
eth:
  outputs:
    ci:
      account: "{{ env_var('DBT_SNOWFLAKE_IDENTIFIER') }}"
      database: CI_db
      private_key_path: "{{ env_var('DBT_PRIVATE_KEY_PATH') }}"
      role: "{{ env_var('DBT_SNOWFLAKE_ROLE') }}"
      schema: "{{ env_var('DBT_SCHEMA') }}"
      threads: 1
      type: snowflake
      user: "{{ env_var('DBT_SNOWFLAKE_USER') }}"
      warehouse: compute_wh
  target: ci
```

- Les valeurs réelles (clé privée, identifiants, rôle) sont stockées comme **secrets GitHub** (`DBT_PRIVATE_KEY`, `DBT_SNOWFLAKE_IDENTIFIER`, `DBT_SNOWFLAKE_ROLE`, `DBT_SNOWFLAKE_USER`) et injectées comme variables d'environnement dans le workflow.
- Le fichier `.gitignore` exclut `.dbt/`, `*.p8`, `*.pub` pour ne jamais committer de clés localement.
- ⚠️ Le nom d'une variable d'environnement (ex. `DBT_SNOWFLAKE_ROLE`) n'est **pas** une valeur utilisable telle quelle (ex. dans une requête SQL Snowflake) — c'est un placeholder résolu uniquement par dbt/Jinja au runtime, à partir du secret correspondant.

## 3. Workflow CI (`dbt-ci.yml`)

Déclenché sur chaque Pull Request vers `main` :

```yaml
on:
  pull_request:
    branches:
      - main
```

### Isolation par PR

Chaque PR obtient son propre schema Snowflake, pour éviter les collisions entre CI concurrentes :

```yaml
env:
  DBT_SCHEMA: pr_${{ github.event.pull_request.number }}
```

### Étapes principales

1. **Checkout avec historique complet** (`fetch-depth: 0`) — nécessaire pour pouvoir faire `git checkout main` plus tard dans le job.
2. **Installation de Python et dbt** (`dbt-core`, `dbt-snowflake`).
3. **Mise en place du profil** : copie de `.github/profiles.yml` vers `~/.dbt/profiles.yml`, écriture de la clé privée depuis le secret.
4. **`dbt deps`** puis **`dbt debug --target ci`** pour valider la connexion.
5. **Génération de l'état de référence (`state/manifest.json`)** à partir de `main` :

```yaml
- name: Create state manifest from main branch
  run: |
    mkdir -p state
    git checkout main
    dbt deps
    dbt parse --target prod
    cp target/manifest.json state/manifest.json
    git checkout -
```

   - `dbt parse --target prod` compile uniquement le manifest (rapide, pas d'exécution SQL), en utilisant la config du target `prod` pour connaître l'état réel de la production.
   - `git checkout -` revient sur la branche de la PR après avoir récupéré le manifest de `main`.

6. **Clone des modèles incrémentaux impactés** (avant le build, pour que `is_incremental()` soit vrai) :

```yaml
- name: Clone impacted incremental model into PR schema
  run: |
    dbt clone \
      --target ci \
      --state ./state \
      --defer \
      --select "state:modified+,config.materialized:incremental,state:old"
```

7. **Slim build** : ne reconstruit que les modèles modifiés et leurs descendants, en déférant le reste vers prod :

```yaml
- name: Slim build (modified + downstream)
  run: |
    dbt build \
      --target ci \
      --state ./state \
      --defer \
      --select "state:modified+"
```

## 4. `dbt defer`

- **Concept** : exécuter un sous-ensemble de modèles sans reconstruire leurs dépendances upstream. dbt "reporte" (defer) la résolution de `ref()` vers un environnement où ces modèles existent déjà (ex. `prod`), grâce à un `manifest.json` de référence.
- **Commande type** :

```bash
dbt build -s model_c --defer --state path/to/state
```

- **Étapes** :
  1. Générer le `manifest.json` de l'environnement cible (`dbt parse --target prod` ou `dbt build --target prod`).
  2. Copier ce manifest dans un dossier `state/`.
  3. Lancer `dbt build --defer --state state/` dans l'environnement courant.
- **Résultat** : seuls les modèles sélectionnés sont reconstruits ; les autres sont lus directement depuis l'environnement de référence (aucune duplication de données).
- **Avantage** : rapide, pas de coût de stockage additionnel, données toujours à jour (pointeur vers la prod).
- **Limite** : on ne peut pas modifier les modèles déférés — ils restent des objets de l'environnement source.

## 5. `dbt clone`

- **Concept** : copier physiquement des objets (tables/vues) d'un environnement source vers un environnement cible, via le **zero-copy cloning** du data warehouse (Snowflake, Databricks, BigQuery).
- **Fonctionnement du zero-copy** : le clone est quasi instantané et gratuit au départ (pointeurs partagés vers les mêmes fichiers physiques) ; le stockage n'est facturé que sur les données qui divergent ensuite.
- **Commande type** :

```bash
dbt clone --state path/to/state
```

- **Tables vs vues** :
  - Tables : vrai clone zero-copy.
  - Vues : recréées comme `select * from <source>`, pas de copie physique.
- **Cas d'usage** : recréer un environnement CI complet, onboarding d'un nouvel utilisateur, sandbox de test modifiable sans impacter la prod.

## 6. `defer` vs `clone`

| | `defer` | `clone` |
|---|---|---|
| Type de référence | Logique (lien vers l'objet source) | Physique (copie zero-copy) |
| Création d'objets | Non | Oui (table/vue dans le schema cible) |
| Modifiable indépendamment | Non | Oui |
| Risque de data drift | Non | Oui (la copie peut diverger de la source) |
| Coût | Quasi nul | Quasi nul au départ, croît avec les modifications |

**Métaphore** : `defer` = partager un lien vers un article (toujours à jour, mais non modifiable) ; `clone` = imprimer l'article (copie personnelle modifiable, mais qui peut devenir obsolète).

**Cas d'usage combiné (notre pipeline CI)** : on `clone` uniquement les modèles **incrémentaux modifiés** (pour que `is_incremental()` trouve une table existante dans le schema PR), et on `defer` tout le reste (modèles non modifiés, lus directement depuis prod).

## 7. Slim CI

- **Définition** : ne builder dans la CI que les modèles modifiés par rapport à la branche de référence (`main`/`prod`), au lieu de reconstruire tout le projet.
- **Principe** :
  1. Récupérer/générer le `manifest.json` de référence (état de `main`/`prod`).
  2. Sélectionner les modèles modifiés avec `state:modified+` (modifiés + descendants).
  3. Combiner avec `--defer` (et éventuellement `dbt clone` pour les cas incrémentaux) pour éviter de recalculer les modèles non modifiés.
- **Syntaxe des sélecteurs** — piège classique :
  - Virgule (`,`) = **ET** (intersection).
  - Espace = **OU** (union).
  - ⚠️ Ne **jamais** mettre d'espace après une virgule dans un `--select` (ex. `"state:modified+, config.materialized:incremental"`) : dbt découpe sur les espaces, la virgule reste collée au token précédent, qui devient invalide. Résultat : le sélecteur restant seul est appliqué à tort et peut sélectionner beaucoup plus de modèles que prévu.
  - Syntaxe correcte : `"state:modified+,config.materialized:incremental,state:old"` (aucun espace après les virgules).

## 8. Workflow CD (`dbt-cd-deploy.yml`)

Déclenché après un merge dans `main` (push) ou manuellement :

```yaml
on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

concurrency:
  group: dbt-prod
  cancel-in-progress: false
```

- `concurrency` avec `cancel-in-progress: false` évite qu'un déploiement prod en cours soit interrompu par un nouveau push, et sérialise les déploiements (un seul à la fois sur le groupe `dbt-prod`).
- Étapes : checkout, setup Python, install dbt, mise en place du profil, puis `dbt deps`, `dbt seed`, `dbt compile`, `dbt build`, tous ciblant `prod`.
- Contrairement à la CI, il n'y a pas de `--defer`/`--select state:modified+` : c'est un build complet de la prod (pas de Slim CI en prod, car il faut que tout soit réellement à jour).

## 9. Nettoyage des schemas PR (`cleanup.yml` + macro `pr_schema_cleanup`)

Chaque PR crée un schema Snowflake dédié (`pr_<numero>`). Sans nettoyage, ces schemas s'accumulent indéfiniment. Un workflow planifié s'en charge :

```yaml
on:
  schedule:
    - cron: "0 2 * * *"  # tous les jours à 02:00 UTC
  workflow_dispatch:
```

Il appelle une macro `run-operation` :

```bash
dbt run-operation pr_schema_cleanup --target ci --args "{'database_to_clean': 'CI','age_in_days': -1}"
```

### Macro `pr_schema_cleanup` (`macros/ci-schema-cleanup.sql`)

```sql
{% macro pr_schema_cleanup(database_to_clean, age_in_days=10) %}

    {% set find_old_schemas %}
        select
            'drop schema {{ database_to_clean }}.'||schema_name||';'
        from {{ database_to_clean }}.information_schema.schemata
        where
            catalog_name = '{{ database_to_clean | upper }}'
            and schema_name ilike 'PR%'
            and last_altered <= (current_date() - interval '{{ age_in_days }} days')
    {% endset %}

    {% if execute %}
        {{ log('Schema drop statements:' ,True) }}
        {% set schema_drop_list = run_query(find_old_schemas).columns[0].values() %}
        {% for schema_to_drop in schema_drop_list %}
            {% do run_query(schema_to_drop) %}
            {{ log(schema_to_drop ,True) }}
        {% endfor %}
    {% endif %}

{% endmacro %}
```

- Interroge `information_schema.schemata` pour trouver les schemas dont le nom commence par `PR` et qui n'ont pas été modifiés depuis `age_in_days` jours.
- Génère dynamiquement des instructions `DROP SCHEMA ...` et les exécute une par une via `run_query`.
- Le paramètre `age_in_days` est configurable (par défaut 10 jours) ; le workflow `cleanup.yml` l'appelle avec `age_in_days: -1` pour test.
- `{% if execute %}` garantit que la logique ne s'exécute qu'en mode réel (pas lors du parsing/compile).

## 10. Récapitulatif pour l'examen

- La CI valide une PR dans un environnement isolé (schema par PR), la CD déploie en prod après merge dans `main`.
- Les secrets (clés, identifiants) sont injectés via GitHub Secrets + variables d'environnement, jamais committés en clair.
- `defer` = référence logique vers un environnement existant (pas de copie, pas de data drift, non modifiable).
- `dbt clone` = copie physique zero-copy (modifiable, coût de stockage croissant, utile pour les modèles incrémentaux en Slim CI).
- Slim CI = ne build que `state:modified+`, en déférant/clonant le reste depuis l'état de référence (`main`/`prod`).
- Dans les sélecteurs dbt : virgule = ET, espace = OU ; ne jamais mettre d'espace après une virgule.
- Un pipeline de nettoyage planifié (macro `run-operation` + `information_schema.schemata`) évite l'accumulation de schemas PR orphelins.
