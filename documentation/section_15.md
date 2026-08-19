# Section 15 — Incremental Strategy: Microbatch

Cette section couvre la stratégie incrémentale `microbatch`, introduite dans dbt-core 1.9, et la configuration `event_time` requise pour son fonctionnement.

## 1. Qu'est-ce que le `microbatch` ?

`microbatch` est une stratégie incrémentale qui découpe le traitement d'un modèle en **lots temporels indépendants** (ex. un lot par jour), plutôt que de traiter toute la fenêtre incrémentale en une seule requête. Chaque batch effectue un **delete + insert** ciblé sur le modèle cible, pour la plage de temps correspondante.

**Exemple du projet** — `models/base/stg_contracts.sql` :

```sql
{{ config(materialized='incremental', incremental_strategy='microbatch', begin='2026-08-15', event_time='date', batch_size='day', concurrent_batches=false ) }}

SELECT
    address,
    block_number,
    bytecode,
    date,
    last_modified
FROM {{ source('eth','contracts') }}
```

### Paramètres de config

- **`incremental_strategy: microbatch`** : active la stratégie.
- **`begin`** : date de début du traitement (première exécution : dbt génère un batch par unité de temps depuis cette date jusqu'à aujourd'hui).
- **`event_time`** : colonne du modèle représentant l'horodatage de l'événement (ici `date`), utilisée pour découper les batches.
- **`batch_size`** : granularité d'un batch (`day`, `hour`, etc.).
- **`concurrent_batches`** : si `true`, dbt peut exécuter plusieurs batches en parallèle (attention aux contraintes de warehouse/concurrence sur la table cible).

## 2. Comportement observé dans les logs

Pour chaque batch (ex. jour), dbt exécute :

1. Création d'une **vue temporaire** filtrée sur la fenêtre du batch (`WHERE date >= <jour> AND date < <jour+1>`).
2. **`DELETE`** sur la table cible pour cette même fenêtre.
3. **`INSERT`** dans la table cible à partir de la vue temporaire.

Cette séquence se répète batch par batch, du `begin` configuré jusqu'à la date courante.

## 3. Piège critique : `event_time` doit aussi être défini sur le(s) modèle(s)/source(s) parent(s)

Sans `event_time` configuré sur la **source ou le modèle amont**, dbt ne peut pas filtrer la requête amont par batch : chaque batch va alors scanner **l'intégralité de la table source** (au lieu d'une seule journée), ce qui annule le bénéfice du microbatch (coût de lecture non réduit) même si le delete+insert sur la cible reste correctement segmenté.

**Fix appliqué dans le projet** — `models/sources.yml` :

```yaml
sources:
  - name: eth
    tables:
      - name: contracts
        description: This is my contracts table
        config:
          event_time: date
```

Après ce fix, la requête de chaque batch filtre bien la **source** elle-même sur la fenêtre du batch (`WHERE date >= ... AND date < ...`), réduisant réellement le volume de données scanné à chaque exécution.

### Règle générale

`event_time` doit être configuré sur **tous les nœuds impliqués dans la chaîne microbatch** :
- Le modèle incrémental lui-même (`incremental_strategy: microbatch`).
- Chaque **source** ou **modèle parent** référencé par `ref()`/`source()`, sinon aucun filtrage par batch n'est possible en amont.
- Cela s'applique également aux **snapshots** utilisés comme parents.

## 4. Récapitulatif pour l'examen

- `microbatch` = incrémental découpé en lots temporels, avec **delete + insert** par batch sur la table cible.
- Config minimale sur le modèle : `incremental_strategy: microbatch`, `event_time`, `batch_size`, et généralement `begin` pour le backfill initial.
- **Sans `event_time` sur les parents (source/modèle/snapshot)**, le filtrage par batch ne s'applique qu'à la table cible, pas à la lecture des données amont — perte de l'optimisation de coût.
- `concurrent_batches` contrôle l'exécution parallèle des batches.
