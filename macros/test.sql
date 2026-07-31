-- Introduire un message de log dans la console ou les logs
{% macro random_macro() %}

    {% set query %}

        SELECT DISTINCT token_address
        FROM {{ ref('stg_token_transfers') }} 
        LIMIT 10

    {% endset %}

    {% if execute %}

        {% set result = run_query(query) %}
        {% set result_list = result.columns[0].values() %}
    {% else %}
        {% set result_list = [] %}
        {% do log("Skipping query execution in dry run mode", info=True) %}
    {% endif %}

    {{ log("query result: " ~ result_list, info=True) }}

{% endmacro %}