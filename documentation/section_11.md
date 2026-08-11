# Section 11 — Guide de debugging des erreurs dbt

Cette section recense les principaux types d'erreurs rencontrés avec dbt dans ce projet, leur cause probable et la méthode de résolution.

## 1. Erreurs de parsing YAML

### Symptôme

```
Runtime Error
  Syntax error near line X
  did not find expected '-' indicator
```

### Cause
Le fichier `dbt_project.yml`, `schema.yml`, `sources.yml` ou `groups.yml` contient une erreur de syntaxe YAML :
- indentation incorrecte
- caractères inattendus comme un `;` ou un `.` à l'extérieur des guillemets
- apostrophes mal équilibrées

### Exemple rencontré
Dans `dbt_project.yml`, des points-virgules à la fin de chaînes entre guillemets :
```yaml
+post-hook:
  - "GRANT ... TO ROLE TESTER";
```
Le `;` est hors de la chaîne et casse le parseur YAML.

### Résolution
- Supprimer les caractères parasites à l'extérieur des guillemets.
- Vérifier l'indentation avec un validateur YAML en ligne ou `dbt parse`.
- Utiliser des guillemets simples ou doubles cohérents.

---

## 2. Erreurs de parsing de la config

### Symptôme
```
Parsing Error
  Invalid groups config given in ... : Additional properties are not allowed ('description' was unexpected)
```

### Cause
Une clé non reconnue a été ajoutée à un objet de config.

### Exemple rencontré
`groups.yml` contenait `description` sous chaque groupe, ce qui n'est pas supporté.

### Résolution
- Se référer à la documentation dbt pour connaître les clés autorisées.
- Supprimer les propriétés non valides : ici, retirer `description`.

---

## 3. Erreurs de référence inconnue

### Symptôme
```
Compilation Error
  Model 'X' depends on a node named 'Y' which was not found
```

### Cause
Un `{{ ref('...') }}` ou `{{ source('...','...') }}` pointe vers un modèle ou une source qui n'existe pas ou dont le nom est mal orthographié.

### Exemples rencontrés
- `stg_transaction_enriched` au lieu de `stg_transactions_enriched`.
- `stg_confirm_fraud` au lieu de `confirm_fraud`.

### Résolution
- Vérifier l'existence du fichier.
- Corriger le nom dans le `ref`.
- S'assurer que le modèle cible n'a pas été supprimé ou déplacé sans mise à jour.

---

## 4. Erreurs de base de données (Snowflake)

### Symptôme
```
Database Error
  SQL compilation error: invalid identifier 'C.FROM_ADDRESS'
```

### Cause
Le SQL compilé fait référence à une colonne ou un objet qui n'existe pas dans la base.

### Exemple rencontré
Dans `stg_fraud.sql`, la jointure utilisait `c.from_address` alors que `stg_contracts` ne contient pas cette colonne. Le nom correct était `c.address`.

### Résolution
- Vérifier le schéma des tables sources dans Snowflake.
- Consulter le SQL compilé dans `target/run/...`.
- Corriger les noms de colonnes et de tables.

---

## 5. Erreurs de connexion / profile

### Symptôme
```
The profile 'eth' does not have a target named 'prod'
```

### Cause
Le fichier `profiles.yml` ne contient pas la target demandée, ou le profile par défaut du projet n'est pas le bon.

### Résolution
- Vérifier que le `profile` dans `dbt_project.yml` correspond au bon bloc dans `profiles.yml`.
- S'assurer que chaque target (`dev`, `prod`) est bien définie.
- Vérifier le chemin du fichier `profiles.yml` (`~/.dbt/profiles.yml`).

---

## 6. Erreurs de contrat de modèle

### Symptôme
```
Contract Error
  This model has an enforced contract which does not match ...
```

### Cause
Le SQL du modèle ne produit pas exactement les colonnes et types de données déclarés dans le `schema.yml` avec `contract: enforced: true`.

### Exemple rencontré
`stablecoin_activity_per_day` version 1 attendait 5 colonnes, mais le SQL n'en retournait que 4.

### Résolution
- Aligner les colonnes du SQL sur la déclaration du `schema.yml`.
- Utiliser `codegen` pour générer automatiquement la déclaration.
- Désactiver temporairement le contrat (`enforced: false`) si besoin de tester.

---

## 7. Erreurs d'accès (groupes)

### Symptôme
```
Parsing Error
  Node model.eth.test attempted to reference node model.eth.confirm_fraud, which is not allowed because the referenced node is private to the 'fraud_detection' group.
```

### Cause
Un modèle tente de faire `ref` vers un modèle dont l'accès est `private` et qui n'appartient pas au même groupe.

### Résolution
- Ajouter le modèle appelant au même groupe (`{{ config(group = 'fraud_detection') }}`).
- Modifier l'accès du modèle cible (`private`, `protected`, `public`) selon le besoin.
- Consulter `models/groups.yml` pour vérifier les groupes disponibles.

---

## 8. Erreurs de configuration de modèle

### Symptôme
```
Field "access" of type AccessType in ModelConfig has invalid value 'private '
```

### Cause
La valeur passée dans `{{ config(...) }}` contient une faute de frappe (espace, majuscule) ou n'est pas dans la liste autorisée.

### Résolution
- Retirer l'espace : `access = 'private'` au lieu de `access = 'private '`.
- Utiliser les valeurs autorisées : `private`, `protected`, `public`.

---

## 9. Erreurs de grants / permissions

### Symptôme
```
Role 'TESTER' does not exist or not authorized.
```

### Cause
Le modèle essaie de donner des droits à un rôle Snowflake qui n'existe pas.

### Résolution
- Créer le rôle dans Snowflake, ou
- Retirer la configuration `grants` du modèle.

---

## 10. Erreurs de modèle versionné

### Symptôme
```
[WARNING]: Model stablecoin_activity_per_day.v1 has passed its deprecation date
```

### Cause
La version du modèle a dépassé la `deprecation_date` définie dans `schema.yml`.

### Résolution
- Vérifier si la version doit être retirée.
- Mettre à jour la date de dépréciation si elle est encore pertinente.
- S'assurer que les modèles consommateurs utilisent la `latest_version`.

---

## Méthodologie générale de debugging

1. **Lire le message d'erreur complet** : dbt donne souvent la ligne, le fichier et la cause racine.
2. **Consulter le code compilé** : dans `target/run/...` ou `target/compiled/...`.
3. **Isoler le modèle** : utiliser `dbt run -m mon_modele` pour tester un seul nœud.
4. **Vérifier les refs et sources** : s'assurer que tous les `ref` et `source` pointent vers des objets existants.
5. **Valider YAML** : utiliser `dbt parse` ou un linter YAML.
6. **Vérifier Snowflake** : exécuter le SQL compilé directement dans Snowflake pour isoler les erreurs DB.
