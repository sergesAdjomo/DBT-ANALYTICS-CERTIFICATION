# Résumé de révision — dbt Analytics Engineering Certification

Synthèse de tous les concepts vus dans les 65 questions, organisée par thème. À relire une dernière fois avant mardi.

---

## 1. Node Selection (le sujet le plus dense de l'examen)

### Opérateurs graphe : 
| Opérateur | Effet |
|---|---|
| `+model` | modèle + **tous** ses ancêtres (upstream illimité) |
| `model+` | modèle + **tous** ses descendants (downstream illimité) |
| `+model+` | modèle + ancêtres + descendants (les deux, illimité) |
| `n+model` | modèle + **n niveaux** d'ancêtres seulement |
| `model+n` | modèle + **n niveaux** de descendants seulement |
| `@model` | modèle + tous ses descendants + **tous les ancêtres nécessaires pour builder ces descendants** (va plus loin que `+model+`) |

### Combinaison de sélecteurs
- **Espace** = union (OR) : `--select tag:a tag:b`
- **Virgule** = intersection (AND) : `--select tag:a,tag:b`

### Méthodes de sélecteur
- `tag:` — par tag (hérité colonne → test)
- `group:` — par groupe de gouvernance (≠ `tag:`, ne pas confondre)
- `source:` — par nom de source
- `path:` — par chemin physique de fichier/dossier
- `file:` — par nom de fichier
- `fqn:` — par nom logique complet (projet.dossier.modèle)
- `test_type:generic` / `test_type:singular` — par type de test
- `config.materialized:` — par matérialisation
- `resource_type:` — par type de ressource (model, test, exposure...)
- `result:` — par statut du run précédent (`result:fail`, `result:error`) — nécessite `--state`
- **Sans méthode précisée** → dbt tente `path`, `file`, ou `fqn` (jamais `config`)

### state: (Slim CI)
- `state:modified` — nœuds existants dont la définition a changé
- `state:new` — nœuds n'existant pas dans l'état de référence
- `source_status:fresher+` — sources rafraîchies depuis la référence + descendants
- Nécessite toujours `--state path/` pointant vers un `manifest.json` de référence **préservé entre les runs**
- **Précédence flag CLI vs variable d'env** : le **flag l'emporte toujours** (`--state` > `DBT_STATE`, `--project-dir` > `DBT_PROJECT_DIR`)

### Indirect selection (tests avec plusieurs parents)
| Mode | Comportement |
|---|---|
| `eager` (défaut) | test exécuté si **au moins un** parent est sélectionné |
| `cautious` | test exécuté seulement si **tous** les parents sont **explicitement sélectionnés** |
| `buildable` | test exécuté si tous les parents sont sélectionnés **ou construits comme ancêtres** dans le run |

---

## 2. Matérialisations

| Type | Comportement | Cas d'usage |
|---|---|---|
| `view` | Ré-exécute la requête à **chaque accès** — aucun stockage physique | Modèles peu interrogés / staging léger |
| `table` | Calcule **une fois** au build, stocke physiquement | Modèle fréquemment interrogé, transformations complexes, **sans** volume massif en croissance continue |
| `incremental` | Ne retraite que les **nouvelles/modifiées** lignes | Très gros volume, croissance continue (ex. "tens of millions weekly") |
| `ephemeral` | Jamais matérialisé physiquement, s'insère en CTE | Modèles intermédiaires légers |

**Trade-off clé `table` vs `view`** : `table` = coût de stockage plus élevé mais compute unique ; `view` = pas de stockage mais recalcul à chaque requête (coût cumulé élevé si interrogé souvent).

---

## 3. Tests

### Deux familles
- **Data tests** (`unique`, `not_null`, `relationships`, `accepted_values` + custom) : s'exécutent contre les **vraies données**, retournent un **count** de lignes en échec.
- **Unit tests** (TDD) : testent la **logique de transformation** avec données mockées, résultat **binaire** pass/fail.

### Singulier vs générique
- **Singulier** : fichier `.sql` autonome, assertion **custom non réutilisable**.
- **Générique** : macro Jinja **paramétrée et réutilisable** (`unique`, `not_null` en sont).

### Piège classique : `relationships` vs `accepted_values`
- `relationships` → compare à une **autre table** (intégrité référentielle, dynamique).
- `accepted_values` → compare à une **liste statique** écrite en dur dans le YAML.

### `tests:` vs `data_tests:`
Même mécanisme, `data_tests` est le nom recommandé (récent), `tests` reste supporté pour rétrocompatibilité. **Ne pas utiliser les deux ensemble sur la même ressource.**

### Ressources pouvant avoir des data tests
Models, **sources**, **seeds**, **snapshots** — PAS les analyses (jamais exécutées contre le warehouse).

### `+schema: null` sur les tests / `store_failures`
- `store_failures: true` → stocke physiquement les lignes en échec pour investigation.
- `+schema: null` → retombe sur `target.schema` du profil (pas de suffixe custom).

---

## 4. Schema & Database naming

### Macro `generate_schema_name` (par défaut)
- Si `custom_schema_name` est `null` → **`target.schema`** seul.
- Si custom défini → **`{target.schema}_{custom_schema}`** (target.schema toujours en premier).

### Bonne pratique collaborative
Chaque développeur a son propre schema via convention `dbt_<username>` dans son `profiles.yml` local → isolation, évite les écrasements mutuels.

### Freshness (sources)
Cascade : config au niveau **source** = défaut pour toutes ses tables ; config au niveau **table** = **remplace complètement** (pas une fusion partielle) pour cette table précise.
Pour désactiver : **omettre le bloc** `freshness` ou `freshness: null` — jamais mettre les seuils à zéro (ça déclenche l'échec immédiat, pas une désactivation).

---

## 5. Gouvernance : access, groups, versioning

### `access` (3 niveaux)
- `private` — référençable uniquement dans son propre **`group`**
- `protected` (défaut) — référençable dans tout le projet, pas depuis l'extérieur
- `public` — référençable de partout, y compris autres projets/packages

### `restrict-access: true`
Flag qui **active réellement l'enforcement** des règles d'`access`. Sans lui, `protected`/`private` ne bloquent rien au parsing.

### Model access ≠ user permissions
`access` = contrainte de **code** (qui peut `ref()`). Permissions utilisateur = contrainte **warehouse/RBAC**, système totalement indépendant.

### Model versioning
- `versions:` liste les versions d'un modèle (`v: 1`, `v: 2`...)
- `latest_version` (niveau modèle, valeur **numérique/string**, pas booléen selon la doc officielle — mais votre plateforme utilise `true`, vérifiez le jour J) — désigne la version par défaut pour `ref()` sans version.
- Sans `latest_version` défini → dbt prend le **numéro le plus élevé** par défaut.
- **Breaking change** (nécessite une nouvelle version) : suppression de colonne consommée en aval, changement de type. **Non-breaking** : métadonnées, ordre des colonnes, index.

### Namespaces
= nom du projet/package. Permettent à des modèles de **noms identiques de coexister** dans des packages différents (`ref('projet', 'modele')`).

---

## 6. Model Contracts

- Exigent matérialisation **`table` ou `incremental`** uniquement (pas `view`, pas `ephemeral` — confirmé doc officielle, malgré une contradiction de votre plateforme sur `view`).
- Déclaration explicite de **nom + `data_type`** de chaque colonne.
- Vérifié **au moment de la compilation/build** (avant écriture des données) — différent des data tests qui valident le contenu après coup.
- `on_schema_change` (`append_new_columns` ou `fail`) requis pour les modèles incrémentaux sous contrat.
- Cas d'usage : reporting réglementaire, garantie de stabilité de schéma pour les consommateurs aval.

---

## 7. Exposures

- Ressource **purement déclarative/documentaire** — aucune fonction de sécurité, d'optimisation, ou de blocage.
- Rend visible le **lineage jusqu'aux consommateurs finaux** (dashboards, notebooks, apps) dans `dbt docs generate`.
- Propriétés **requises** : `name`, `type`, `owner` (identification, classification, accountability).
- Propriétés optionnelles : `description`, `url`, `maturity`, `tags`, `depends_on`.

---

## 8. Configuration hierarchy (précédence)

Du plus fort au plus faible :
1. **`config()` dans le fichier SQL/py du modèle** (le plus spécifique)
2. **YAML properties file** (`schema.yml`)
3. **`dbt_project.yml`** (le plus général)

Même logique de cascade pour `+materialized`, `+schema`, `+database` : le niveau le plus spécifique gagne.

---

## 9. Variables & environnements

- `target.name` — nom de l'environnement actif (`dev`, `prod`), utilisable en Jinja conditionnel pour adapter le comportement d'un modèle sans dupliquer de code.
- `env_var()` — **sensible à la casse** : `DBT_MY_ENV` ≠ `dbt_my_env`.

---

## 10. Artefacts JSON (target/)

| Fichier | Contenu |
|---|---|
| `manifest.json` | Structure **statique** du projet (nœuds, configs, dépendances, DAG) |
| `run_results.json` | Résultats **d'exécution** (statut, timing, échecs de test) |
| Clé de jointure entre les deux | **`unique_id`** (identifiant canonique présent dans les deux) |

Piège classique : confondre `manifest.json` (structure) et `run_results.json` (résultats d'exécution).

---

## 11. Hooks & commandes

- `on-run-start` / `on-run-end` (niveau **projet**, dans `dbt_project.yml`) — SQL exécuté une fois pour tout le run, idéal pour audit global.
- `pre-hook` / `post-hook` (niveau **modèle**) — autour de chaque modèle individuellement.
- `dbt retry` — ré-exécute **sélectivement** les nœuds en échec/non exécutés (basé sur `run_results.json`), idempotent.

---

## 12. `--project-dir` / `DBT_PROJECT_DIR`

Permet de spécifier un répertoire de projet non standard. **Le flag CLI l'emporte** si les deux sont définis simultanément — règle générale pour tout couple flag/variable d'environnement équivalente en dbt.

---

## Pièges récurrents à bien retenir

1. **`group:` ≠ `tag:`** — deux mécanismes distincts, ne pas confondre même si l'énoncé semble suggérer un tag.
2. **`manifest.json` (statique) ≠ `run_results.json` (exécution)**.
3. **`relationships` (autre table) ≠ `accepted_values` (liste statique)**.
4. **`null`/omission = désactivation propre** ; seuil extrême (haut ou bas) = mécanisme toujours actif.
5. **Flag CLI > variable d'environnement**, systématiquement.
6. **`table`/`incremental` seuls supportent les model contracts.**
7. Question sans mention de volume massif → `table` ; avec volume massif en croissance → `incremental`.

Bon courage pour mardi soir — vous avez un socle solide.
