# Section 14 — Implementing dbt Tests

Cette section couvre l'ensemble des types de tests dbt : tests singuliers, tests génériques (natifs et custom), tests sur sources, unit tests, sévérité/configuration des tests, et sélection des tests (dont la sélection indirecte).

## 1. Singular data tests (104)

Un test singulier est un simple fichier `.sql` placé dans le dossier `tests/`, sans déclaration nécessaire dans un fichier `.yml`. dbt scanne automatiquement tout `.sql` de ce dossier et le traite comme un test : si la requête retourne des lignes, le test échoue.

**Exemple du projet** — `tests/assert_eth_value_amount_is_positive.sql` :

```sql
select
    sum(value) as total_value
from {{ ref('stg_transactions_enriched') }}
having sum(value) < 0
```

- Câblé en dur sur `stg_transactions_enriched`, non réutilisable sur un autre modèle.
- Utile pour une vérification ponctuelle, spécifique à un seul modèle.

## 2 & 3. Generic data tests — Part 1 & 2 (105, 106)

Un test générique est une **macro réutilisable** définie avec le bloc `{% test <nom>(model, ...) %}`, appelable depuis n'importe quel `schema.yml` sur n'importe quel modèle/colonne.

**Exemple du projet** — `macros/generic_assert_value_amount_is_positive.sql` (également dupliqué sous `tests/generic/generic_assert_value_amount_is_positive.sql`) :

```sql
{% test assert_value_amout_positive(model, column_name, field) %}
{% set column_name = column_name | default('value') %}

select
    {{field}},
    sum({{ column_name }}) as total_value
from {{ model }}
group by {{field}}
having sum({{ column_name }}) < 0
{% endtest %}
```

- **`model`** : injecté automatiquement par dbt (le modèle sur lequel le test est appelé).
- **`column_name`** : paramètre optionnel avec valeur par défaut (`'value'`).
- **`field`** : paramètre obligatoire, doit être fourni explicitement dans le YAML.

**Appel dans `schema.yml`** :

```yaml
- name: stg_transactions_enriched
  columns:
    - name: value
      data_tests:
        - assert_value_amout_positive:
            field: block_number
```

**Piège rencontré** : si un paramètre utilisé dans le corps du test (`{{field}}`) n'est pas déclaré dans la signature `{% test ...(model, column_name) %}`, dbt lève `macro takes no keyword argument`. Il faut déclarer **tous** les paramètres passés depuis le YAML dans la signature de la macro.

## 3. Out of the box data tests (107)

dbt fournit 4 tests génériques natifs, utilisables directement sans macro custom :

- **`unique`** : aucune valeur dupliquée dans la colonne.
- **`not_null`** : aucune valeur `NULL`.
- **`accepted_values`** : la colonne ne contient que des valeurs d'une liste autorisée.
- **`relationships`** : intégrité référentielle — chaque valeur existe dans une colonne d'un autre modèle (`to` / `field`).

**Exemples du projet** :

```yaml
- name: stg_transactions
  columns:
    - name: hash
      data_tests:
        - not_null
        - unique

- name: stg_token_transfers
  columns:
    - name: transaction_hash
      data_tests:
        - relationships:
            to: ref('stg_transactions')
            field: hash

- name: stablecoin_activity_per_day
  columns:
    - name: type
      data_tests:
        - accepted_values:
            values: ['Hybrid', 'Crypto-backed', 'Fiat-backed']
```

## 4. Custom data tests — Overriding built-in tests (108)

dbt permet de **redéfinir** (override) le comportement d'un test générique natif en créant une macro du même nom dans le projet (ex. `macros/unique.sql` avec `{% macro test_unique(model, column_name) %}`). dbt donne priorité à la macro du projet sur celle du package interne (`dbt-core`/adapter).

- **Cas d'usage** : personnaliser la logique d'un test standard pour tous les modèles du projet sans devoir renommer/rappeler un nouveau test partout.
- **Convention de nommage** : `test_<nom_du_test_natif>` (ex. `test_unique`, `test_not_null`).

## 5. Tests on sources (109)

Les tests peuvent être appliqués directement sur une **source** (donnée brute, avant toute transformation dbt), dans `sources.yml`, de la même façon que sur un modèle.

**Exemple du projet** — `models/sources.yml` :

```yaml
sources:
  - name: eth
    database: eth
    schema: eth_schema
    tables:
      - name: contracts
      - name: token_transfers
      - name: transactions
        columns:
          - name: hash
            data_tests:
              - not_null
              - unique
```

- **Intérêt** : détecte les problèmes de qualité de données **en amont**, à la source, avant qu'ils ne se propagent dans le pipeline.
- **Sélection ciblée** : `dbt test --select source:eth.transactions`.

## 6. dbt Unit Tests (110)

Contrairement aux data tests (qui valident des données réelles et retournent un nombre de lignes en échec), les **unit tests** valident une **logique SQL** avec des données statiques (fixtures), et retournent un résultat binaire (pass/fail).

**Syntaxe** : bloc `unit_tests:` au même niveau que `models:`, avec les clés `given` (entrées), `expect` (sortie attendue), et `overrides` pour contrôler les macros/variables non déterministes (ex. `is_incremental()`, `current_timestamp`).

**Exemple du projet** — `models/schema.yml` :

```yaml
unit_tests:
  - name: test_is_valid_transaction_category
    model: stg_transactions_enriched
    overrides:
      macros:
        is_incremental: false
    given:
      - input: ref('stg_transactions')
        rows:
          - {receipt_contract_address: "0xabc", hash: "blah"}
      - input: ref('stg_token_transfers')
        rows:
          - {transaction_hash: "blah"}
    expect:
      rows:
        - {transaction_category: "contract_creation"}
```

- **`overrides.macros.is_incremental: false`** : indispensable car `stg_transactions_enriched` est un modèle incrémental (`{% if is_incremental() %}`) — sans cet override, le unit test échouerait à cause du contexte incrémental.
- **Tous les modèles parents** référencés par le modèle testé (`ref()`) doivent être fournis dans `given`, même s'ils ne participent pas directement au résultat attendu, sinon erreur de compilation (`node not found`).
- **Recommandation dbt Labs** : exécuter les unit tests uniquement en **dev** et en **CI**, jamais en **prod** — ils sont déterministes par construction (données statiques), donc n'apportent aucune valeur de validation sur les vraies données de production.

## 7. Test severity and test configurations (111)

### Sévérité (`severity`)

Par défaut, un test qui échoue lève une **erreur** (`error`) et peut bloquer le pipeline. On peut le rétrograder en simple **avertissement** :

```yaml
data_tests:
  - relationships:
      to: ref('stg_token_transfers')
      field: transaction_hash
      severity: warn
```

- **`error`** (défaut) : le run échoue.
- **`warn`** : le test s'exécute, un `WARN` est affiché, mais le pipeline continue.

### Config `store_failures`

Permet de matérialiser les lignes en échec dans une vraie table (par défaut dans un schema `dbt_test__audit` ou équivalent configuré), au lieu de simplement compter les lignes en erreur.

```yaml
config:
  store_failures: true
  store_failures_as: table
```

- **Intérêt** : investiguer précisément quelles lignes ont échoué, faire des jointures d'analyse, sans re-belancer la requête de test.

### Config `where`

Restreint le test à un sous-ensemble de données (filtre SQL appliqué en amont de la requête de test) :

```yaml
config:
  where: date > current_date - 25
```

- **Intérêt** : coût de calcul réduit sur un warehouse — éviter de scanner des millions de lignes historiques à chaque run de test si seule la donnée récente est pertinente.

### Exemple combiné du projet

```yaml
- name: stg_transactions
  columns:
    - name: hash
      data_tests:
        - not_null
        - unique
        - relationships:
            to: ref('stg_token_transfers')
            field: transaction_hash
            severity: warn
            config:
              store_failures: true
              store_failures_as: table
              where: date > current_date - 25
```

## 8. Test selection and indirect selection (112)

### Sélection par type / tag / ressource

```bash
dbt test --select test_type:generic
dbt test --select test_type:singular
dbt test --select tag:my_tag
dbt test --select config.materialized:table
dbt test --select source:*
dbt test --select <nom_du_test>
```

### Sélection indirecte (`--indirect-selection`)

Quand on sélectionne un modèle avec `dbt test --select <model>`, dbt inclut par défaut **tous les tests qui référencent ce modèle**, même ceux définis sur un autre modèle (ex. un test `relationships` sur `stg_token_transfers` qui référence `stg_transactions` sera exécuté même si on sélectionne uniquement `stg_transactions`).

| Mode | Comportement |
|---|---|
| **`eager`** (défaut) | Exécute un test dès qu'**un seul** de ses parents est sélectionné, même si d'autres parents ne le sont pas dans le run. |
| **`cautious`** | N'exécute un test que si **tous** ses parents sont dans la sélection — restreint aux tests qui référencent exclusivement les nœuds sélectionnés. |
| **`buildable`** | Intermédiaire entre `eager` et `cautious` — inclut aussi les tests dont les parents manquants seraient construits dans le même run. |
| **`empty`** | N'exécute aucun test — équivalent à un `dbt run` pur (utile en combinaison avec `dbt build`). |

**Démonstration avec le projet** :

```bash
# Mode eager (défaut) : exécute unique, not_null, ET le relationships de stg_token_transfers
dbt test --select stg_transactions

# Mode cautious : n'exécute que unique et not_null (définis directement sur stg_transactions)
dbt test --select stg_transactions --indirect-selection cautious
```

**Cas d'usage critique** : en Slim CI (`dbt build --select state:modified+`), le mode `eager` peut faire échouer un test référençant un modèle **non construit** dans le run partiel (ressource manquante dans le schema cible). Le mode `cautious` évite ces faux échecs.

## 9. Récapitulatif pour l'examen

- **Test singulier** : fichier `.sql` dans `tests/`, câblé sur un modèle, auto-détecté sans YAML.
- **Test générique** : macro `{% test nom(model, ...) %}`, réutilisable, appelée depuis `data_tests:` dans le YAML. Tous les paramètres utilisés dans le corps doivent être déclarés dans la signature.
- **Tests natifs** : `unique`, `not_null`, `accepted_values`, `relationships`.
- **Override d'un test natif** : créer une macro du même nom (préfixe `test_`) dans le projet.
- **Tests sur sources** : mêmes types de tests, déclarés dans `sources.yml`, sélectionnables via `source:<source>.<table>`.
- **Unit tests** : bloc `unit_tests:`, valident la logique SQL avec des fixtures statiques (`given`/`expect`), résultat binaire pass/fail, `overrides` pour neutraliser le non-déterminisme (macros, variables). À réserver au dev/CI, jamais en prod.
- **`severity: warn`** : dégrade un échec de test en avertissement non bloquant.
- **`config.store_failures` / `store_failures_as`** : matérialise les lignes en échec dans une table pour investigation.
- **`config.where`** : limite le test à un sous-ensemble de données (optimisation de coût).
- **`--indirect-selection`** : `eager` (défaut, inclut tout test référençant le modèle sélectionné) vs `cautious` (seulement les tests dont tous les parents sont sélectionnés) vs `buildable` (intermédiaire) vs `empty` (aucun test).
