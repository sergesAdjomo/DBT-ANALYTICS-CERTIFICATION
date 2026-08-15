{% test assert_value_amout_positive(model, column_name, field) %}
{% set column_name = column_name | default('value') %}

select 
    {{field}},
    sum({{ column_name }}) as total_value
from {{ model }}
group by {{field}}
having sum({{ column_name }}) < 0
{% endtest %}