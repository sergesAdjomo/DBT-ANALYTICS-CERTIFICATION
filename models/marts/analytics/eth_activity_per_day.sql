

-- Marts:
-- - Contient des données transformées pour des utilisations spécifiques
-- - Contient des données de la source brute ou des données intermédiaires
-- - Contient des données agrégées
-- - Contient des données de rapport
-- - Ne doit pas contenir de données source brute
-- - Ne doit pas contenir des données intermédiaires
-- - Ne doit pas contenir des données de rapport
-- - Ne doit pas contenir des données d'analyse
-- - Le modèle doit être idempotent (peut être exécuté plusieurs fois sans changer le résultat)
-- - Le modèle doit être testable (peut être exécuté en mode dry run)
-- - Le modèle doit être documentable (peut être documenté avec des commentaires et des descriptions)
-- - Le modèle doit être extensible (peut être étendu avec des variables et des macros)


SELECT
    date,
    transaction_category,
    count(*) as txt_count,
    sum(value)/1e18 as sum_value_ethereum

FROM {{ ref('stg_transactions_enriched') }}
{{ random_macro() }}
GROUP BY date, transaction_category
ORDER BY date, transaction_category

