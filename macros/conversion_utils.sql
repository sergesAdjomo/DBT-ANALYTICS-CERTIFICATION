-- Macro sont utiles pour éviter de répéter le même code dans plusieurs modèles
-- Il nous permet de variabiliser les paramètres (nom de colonne, facteur de conversion)
-- Afin de pouvoir réutiliser la macro dans plusieurs modèles
-- Exemple d'utilisation : {{ conversion('gas_used', 18) }}
{% macro conversion(column_name, factor) %}

sum( {{ column_name }}/power(10, {{ factor }} ) )
{% endmacro %}
