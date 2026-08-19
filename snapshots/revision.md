- Les snapshots dbt implémentent des **Slowly Changing Dimensions de type 2 (SCD2)** : au lieu d'écraser une ligne modifiée (type 1), ils **ajoutent une nouvelle ligne** et conservent l'historique de toutes les versions passées d'un enregistrement.
- Ils sont adaptés aux données **mutables** (ex. statut d'une réservation Airbnb), contrairement aux données immuables comme la blockchain.
- Un snapshot est défini dans un fichier `.yml` sous le dossier `snapshots/`, avec :
  - `name` : nom du snapshot (nom de la table créée).
  - `relation` : l'objet source à tracker (`source('...', '...')` ou `ref('...')`).
  - `config.strategy` : `timestamp` (recommandée) ou `check`.
  - `config.unique_key` : la clé métier identifiant un enregistrement.
  - `config.updated_at` : (stratégie `timestamp`) la colonne indiquant la date de dernière modification.
- Commande d'exécution : `dbt snapshot` (et non `dbt snapshots snapshot`), optionnellement avec `--select <nom_du_snapshot>` pour ne rafraîchir qu'un snapshot spécifique.
- dbt ajoute automatiquement des colonnes de métadonnées à la table snapshot résultante :
  - `dbt_scd_id` : hash MD5 unique combinant la `unique_key` et `updated_at`, identifiant chaque version d'une ligne.
  - `dbt_valid_from` : date à partir de laquelle cette version de la ligne est valide.
  - `dbt_valid_to` : date de fin de validité (`NULL` = version actuellement valide).
- Exemple du projet — `snapshots/airbnb.yml` :

```yaml
snapshots:
  - name: airbnb_snap
    relation: source('airbnb', 'apartment_listings')
    config:
      strategy: timestamp
      unique_key: listing_id
      updated_at: updated_at
```

- Chaque exécution de `dbt snapshot` compare l'état source à la dernière version connue dans la table snapshot :
  - Aucun changement → rien n'est ajouté.
  - Changement détecté (`updated_at` plus récent) → l'ancienne ligne voit son `dbt_valid_to` renseigné, et une **nouvelle ligne** est insérée avec `dbt_valid_to = NULL`.
- Les snapshots sont stockés en base (schema dédié configurable), **pas** dans `target/snapshots/` — ce dossier ne contient que le SQL compilé.
- Usage typique : audit, analyse historique de l'évolution d'un enregistrement dans le temps.

## Stratégie `check` (alternative à `timestamp`)

- À utiliser quand la table source **n'a pas de colonne fiable de type "updated_at"** pour détecter les changements.
- Configuration :
  - `strategy: check`
  - `unique_key` : toujours requis (clé métier de l'enregistrement).
  - `check_cols` : liste des colonnes à comparer entre l'état actuel et l'état historique, ou `all` pour comparer **toutes** les colonnes de la table.
- Fonctionnement : à chaque `dbt snapshot`, dbt compare colonne par colonne (celles listées dans `check_cols`) l'état source avec la dernière version connue. Si **au moins une** colonne diffère, une nouvelle ligne est insérée (comme pour `timestamp`), avec les mêmes colonnes meta (`dbt_scd_id`, `dbt_valid_from`, `dbt_valid_to`).
- Pas besoin de `updated_at` avec cette stratégie.

### Pourquoi `timestamp` est recommandée plutôt que `check`

- `check` est **moins fiable en cas d'évolution du schéma** : si des colonnes sont ajoutées ou supprimées de la table trackée dans le futur, la comparaison `check_cols: all` peut devenir incohérente ou nécessiter une mise à jour manuelle de la config.
- `timestamp` repose sur un seul événement fiable (`updated_at`), indépendant du nombre de colonnes de la table — plus robuste et plus simple à maintenir dans le temps.

### Exemple d'implémentation — `snapshots/airbnb.yml`

```yaml
- name: airbnb_snap_check
  relation: source('airbnb', 'apartment_listings')
  config:
    strategy: check
    unique_key: listing_id
    check_cols: all
```

## Le flag `--sample` (dbt-core >= 1.10)

- Alternative au flag `--empty` : au lieu de générer les modèles avec **zéro ligne** (dry run pur), `--sample` matérialise un **échantillon temporel** des données (ex. les 5 derniers jours), pour permettre une validation plus réaliste sans traiter tout l'historique.
- **Nécessite dbt-core >= 1.10.** Sur une version antérieure (ex. 1.9.x), l'option n'existe pas et dbt renvoie une erreur `no such option`.
- Usage :

```bash
dbt run --select stg_contracts --sample="5 days"
```

- Unités possibles : `days`, `hours`, `months`, `years`. On peut aussi passer un `start`/`end` explicite.
- **Même contrainte que `microbatch`** : le modèle échantillonné doit avoir un modèle/source **parent** avec `event_time` configuré, sinon dbt ne peut pas déterminer quelle plage de temps échantillonner en amont, et l'échantillonnage échoue silencieusement ou porte uniquement sur la table cible.
- Il est possible d'exclure un modèle spécifique de l'échantillonnage (via une fonction dédiée appliquée au `ref()`/`source()` de ce modèle), utile si certaines jointures doivent conserver l'intégralité des données de référence.
- **Ne fonctionne pas sur les modèles Python.**
- Recommandation pratique : l'option `--empty` reste largement suffisante et plus simple pour la plupart des cas d'usage (validation de compilation SQL sans coût de lecture) ; `--sample` ajoute de la charge de configuration (event_time sur toute la chaîne de dépendances) pour un bénéfice de validation supplémentaire limité.

### Mise à jour appliquée dans le projet

Pour que le sample flag (et microbatch) fonctionnent sur l'ensemble des modèles de staging, `event_time` a été configuré sur **toutes** les tables de la source `eth` — `models/sources.yml` :

```yaml
sources:
  - name: eth
    tables:
      - name: contracts
        config:
          event_time: date
      - name: token_transfers
        config:
          event_time: date
      - name: transactions
        config:
          event_time: date
```
