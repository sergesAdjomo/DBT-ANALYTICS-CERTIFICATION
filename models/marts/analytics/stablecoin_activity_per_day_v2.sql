-- Version 2 du modèle (3 colonnes)
{{config(tags=['stablecoin'], grants = {'select' : ['TESTER']})}}
-- depends_on: {{ ref('stablecoins') }}
select
t.date,
s.type,
{{ conversion('t.value', 's.decimals') }} as total_usd_value

from {{ ref('stg_token_transfers') }} t

left join {{ ref('stablecoins') }} s
on t.token_address = s.contract_address

where s.contract_address is not null

group by
t.date,
s.type
