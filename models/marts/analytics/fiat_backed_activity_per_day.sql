select * from {{ ref('stablecoin_activity_per_day') }}
where type = 'fiat_backed'