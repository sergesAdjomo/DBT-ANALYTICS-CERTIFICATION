# Section 12 — State selection, `result`, `retry` et `defer`

Cette section couvre les concepts liés à la sélection par état (`state`), au sélecteur `result`, à la commande `dbt retry` et au flag `defer`.

## 1. Les artifacts `manifest.json` et `runResults.json`

Lorsqu'on exécute un run, dbt génère deux fichiers clés dans le dossier `target/` :

- `manifest.json` : représentation du DAG du projet (tous les modèles, sources, tests, etc.).
- `runResults.json` : résultats du dernier run (statut de chaque modèle : success, error, skipped, etc.).

Ces deux artifacts servent à comparer l'état actuel du projet avec un état précédent.

## 2. Variables d'environnement

- `DBT_STATE` : permet de définir le chemin du dossier ou fichier `manifest.json` utilisé par `--state`.
- La CLI l'emporte toujours sur les variables d'environnement. C'est une règle importante pour la certification.

## 3. Le sélecteur `result:`

Le sélecteur `result` utilise le fichier `runResults.json` pour filtrer les modèles selon leur dernier statut d'exécution.

### Syntaxe

```bash
dbt run -m result:<statut>
```

### Statuts disponibles

- `error`
- `success`
- `skipped`
- `fail`
- `warn`
- `pass`

### Exemple

Relancer uniquement les modèles qui ont échoué :

```bash
dbt run -m result:error
```

### Prérequis

Il faut fournir le chemin du dossier contenant `manifest.json` ET `runResults.json` :

```bash
dbt run -m result:error --state <dossier_state>
```

Si `runResults.json` est absent, dbt indique qu'il n'a pas de résultats à utiliser.

## 4. Le sélecteur `state:`

Le sélecteur `state` compare le `manifest.json` actuel avec un `manifest.json` précédent.

### Exemple

Exécuter uniquement les modèles modifiés depuis la dernière exécution :

```bash
dbt run -m state:modified --state <dossier_state>
```

## 5. Combiner `result:` et `state:`

On peut combiner plusieurs sélecteurs pour affiner la sélection.

### OU logique (espace)

Sélectionne les modèles qui ont échoué **OU** qui ont été modifiés :

```bash
dbt run -m result:error state:modified --state <dossier_state>
```

### ET logique (virgule)

Sélectionne les modèles qui ont échoué **ET** qui ont été modifiés :

```bash
dbt run -m result:error,state:modified --state <dossier_state>
```

## 6. Mise en pratique avec un dossier `state/`

1. Exécuter un run qui génère `manifest.json` et `runResults.json` dans `target/`.
2. Copier ces deux fichiers dans un dossier dédié, par exemple `state/`.
3. Apporter des modifications au projet ou simuler une erreur.
4. Réexécuter dbt avec `--state state/` pour utiliser les sélecteurs `result` et `state`.

```bash
# Simuler un run rapide avec des modèles vides
dbt run --empty

# Relancer les modèles en erreur
dbt run -m result:error --state state/

# Relancer les modèles en erreur OU modifiés
dbt run -m result:error state:modified --state state/
```

## 7. La commande `dbt retry`

`dbt retry` est une commande pratique qui relance un run en se basant sur `runResults.json`.

### Fonctionnement

- Elle identifie les nœuds marqués comme `error` dans `runResults.json`.
- Elle relance la commande précédente à partir de ces nœuds et de leurs descendants.
- Elle fonctionne avec : `build`, `compile`, `clone`, `run`, `test`, `run-operation`, etc.

### Si le dernier run a réussi

`dbt retry` ne fait rien (no-op).

### Exemple

```bash
# Après un run qui a échoué
dbt run
# Corriger l'erreur, puis
dbt retry
```

### Visualiser sans `fail_fast`

Pour bien comprendre le fonctionnement de `dbt retry`, on peut temporairement désactiver `fail_fast` dans `dbt_project.yml`. Ainsi, dbt continue d'exécuter les modèles indépendants malgré une erreur ailleurs.

```yaml
flags:
  fail_fast: false
```

### Dry run rapide

```bash
dbt run --empty
```

Cette commande crée les objets en base avec 0 ligne, ce qui accélère grandement le test.

## 8. Le flag `defer`

Le flag `--defer` est mentionné dans la documentation dbt. Il est lié à la gestion des pipelines de données et au concept de clonage. Il sera traité dans la section suivante du cours.

## 9. Récapitulatif pour l'examen

- `manifest.json` et `runResults.json` permettent de comparer l'état du projet à un run précédent.
- Le sélecteur `result:` filtre par statut d'exécution.
- Le sélecteur `state:` filtre par modifications par rapport à un manifest précédent.
- Espace entre sélecteurs = OU ; virgule = ET.
- `dbt retry` relance à partir des modèles en erreur du dernier `runResults.json`.
- La CLI l'emporte sur les variables d'environnement.
