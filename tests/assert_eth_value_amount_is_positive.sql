select 
    sum(value) as total_value
from {{ ref('stg_transactions_enriched') }}
having sum(value) < 0