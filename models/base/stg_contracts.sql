-- Cette vue (materialisée) est un résumé des données de la source 'contracts'
-- Elle est utilisée pour stocker les données les plus importantes et souvent utilisées
-- Elle est mise à jour à chaque exécution du pipeline dbt
-- Elle est utile pour les analyses rapides et les rapports

{{ config(materialized='view') }}

SELECT
    address,
    block_number,
    bytecode,
    date,
    last_modified
    
FROM {{ source('eth','contracts') }}
