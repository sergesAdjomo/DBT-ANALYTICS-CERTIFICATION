# Section 10 — Changements récents et nouveaux concepts

Cette section documente les changements apportés au projet depuis le dernier push Git.

## 1. Réorganisation du répertoire `models`

Le projet a été réorganisé par domaine métier (`analytics` / `fraud`) pour préparer l'évolution vers plusieurs sujets d'analyse.

### Nouvelle arborescence

- `models/staging/analytics/`
  - Héberge les modèles de staging liés à l'activité blockchain générale.
- `models/staging/fraud/`
  - Contient les modèles de staging dédiés à la détection de fraude.
- `models/marts/analytics/`
  - Regroupe les modèles marts d'activité (anciennement directement sous `marts/`).
- `models/marts/fraud/`
  - Regroupe les nouveaux modèles de fraude.

### Fichiers supprimés

Les fichiers suivants ont été supprimés ou remplacés lors de la réorganisation :

- `models/marts/eth_activity_per_day.sql`
- `models/marts/python_model.py`
- `models/marts/stablecoin_activity_per_day.sql`
- `models/marts/token_activity_per_day.sql`
- `models/staging/stg_transactions_enriched.sql`

### Fichiers déplacés ou recréés

Les modèles d'activité existants ont été déplacés ou recréés sous `models/marts/analytics/` et `models/staging/analytics/`.

## 2. Versionning et contrats

Le modèle `stablecoin_activity_per_day` est désormais versionné (`v1` et `v2`) via `models/schema.yml`.

- `v1` : défini dans `stablecoin_activity_per_day_v1.sql`, 5 colonnes.
- `v2` : défini dans `stablecoin_activity_per_day_v2.sql`, 3 colonnes.
- `latest_version` est positionné à `2`.
- Une `deprecation_date` a été ajoutée à la version 1 (`2026-10-20`).
- Le contrat est activé sur la version 1 (`contract: enforced: true`) pour garantir le schéma.

Un test pédagogique a montré que supprimer une colonne du SQL sans mettre à jour le contrat génère une erreur de compilation. Après restauration de la colonne, le run fonctionne.

## 3. Détection de fraude

Un nouveau domaine `fraud` a été introduit.

### Modèles

- `models/staging/fraud/stg_fraud.sql`
  - Identifie les adresses qui créent de nombreux contrats identiques (même `bytecode`) en peu de temps.
  - Joint `stg_transactions_enriched` et `stg_contracts` sur `receipt_contract_address = address`.
  - Filtre sur `transaction_category = 'contract_creation'`.

- `models/marts/fraud/confirm_fraud.sql`
  - Modèle privé réservé au groupe `fraud_detection`.
  - Reprend les transactions enrichies et permet d'identifier des adresses précises de fraude.

- `models/marts/test.sql`
  - Modèle de test utilisé pour vérifier le mécanisme d'accès privé.
  - Tente de référencer `confirm_fraud` depuis l'extérieur du groupe `fraud_detection`.

## 4. Groupes et gouvernance d'accès

Le fichier `models/groups.yml` définit deux groupes :

- `analytics_engineering`
  - Propriétaire : `Engineering <engineering@soprasteria.com>`
- `fraud_detection`
  - Propriétaire : `Fraud Detection Team <fraud-detection@soprasteria.com>`

Le modèle `confirm_fraud` est configuré avec `access: 'private'` et appartient au groupe `fraud_detection`. Cela empêche un modèle extérieur au groupe (comme `test.sql`) d'utiliser `{{ ref('confirm_fraud') }}`, même si les droits Snowflake le permettraient.

## 5. Configurations supplémentaires

- `dbt_project.yml` : mis à jour pour refléter la nouvelle arborescence `marts/analytics` et `marts/fraud`.
- `models/schema.yml` : mis à jour avec les versions de `stablecoin_activity_per_day`, la `deprecation_date` et les contrats.

## 6. Commandes utiles

Pour compiler et exécuter le modèle de fraude :

```bash
dbt run -m stg_fraud
```

Pour tester le mécanisme d'accès privé (doit échouer si `test.sql` n'est pas dans le groupe `fraud_detection`) :

```bash
dbt run -m +test
```
