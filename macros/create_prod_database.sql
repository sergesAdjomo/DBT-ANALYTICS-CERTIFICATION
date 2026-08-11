{% macro create_prod_database() %}

  {% do run_query("CREATE DATABASE IF NOT EXISTS prod_db") %}
  {% do run_query("CREATE SCHEMA IF NOT EXISTS prod_db.prod_schema") %}

  {% set result %}Database prod_db and schema prod_schema created (or already exist).{% endset %}
  {{ log(result, info=True) }}
  {{ return(result) }}

{% endmacro %}
