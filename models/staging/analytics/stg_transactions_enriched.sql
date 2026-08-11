{{ config(materialized='incremental', incremental_strategy='append') }}


-- La vue staging (stg_transactions_enriched) est un intermédiaire entre les données brutes provenant de la source (transactions) et les données analysées (transactions_enriched).
-- Elle permet de stocker les données intermédiaires pendant l'analyse et de les réutiliser dans d'autres modèles.
-- Il est important de bien comprendre le fonctionnement du staging pour bien organiser les données et les modèles du projet dbt.


WITH token_transfers_aggs AS (
    SELECT
        TRANSACTION_HASH,
        count(*) as token_transactions_count
    FROM {{ ref('stg_token_transfers') }}
    GROUP BY TRANSACTION_HASH
),

transactions_enriched AS (

    SELECT t.hash,
        t.block_number,
        t.date,
        t.from_address,
        t.to_address,
        t.value,
        t.receipt_contract_address,
        t.input,
        tt.token_transactions_count,

        case
                when t.receipt_contract_address != '' then 'contract_creation'
                when tt.TRANSACTION_HASH is not null then 'token_transfer'
                when t.input = '0x' and t.value > 0 then 'plain_eth_transfer'
                else 'other'
        end as transaction_category

    FROM {{ ref('stg_transactions') }} t

    left join token_transfers_aggs tt 
    ON t.hash = tt.TRANSACTION_HASH


    {% if is_incremental() %}
        WHERE t.date > (select max(date) from {{ this }})
    {% endif %}
)

SELECT * FROM transactions_enriched
