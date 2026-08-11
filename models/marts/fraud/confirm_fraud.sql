{{ config(group = 'fraud_detection', access = 'private') }}

SELECT * 
from {{ ref('stg_transactions_enriched') }}

where from_address in ('0x...')