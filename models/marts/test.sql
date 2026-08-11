{{ config(group = 'fraud_detection') }}
SELECT * from {{ ref('confirm_fraud') }}