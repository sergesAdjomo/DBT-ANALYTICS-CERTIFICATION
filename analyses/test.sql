
<!-- 
    Cette section commente et génère un fichier YAML contenant les configurations de source pour le schéma 'eth_schema' de la base de données 'eth'.
    Les configurations de source incluent toutes les tables de la base de données ainsi que les colonnes de chacune de ces tables.
    La génération des colonnes peut être désactivée en passant 'generate_columns=False' à la fonction 'codegen.generate_source'.
-->

{% set source_yaml = codegen.generate_source(
    schema_name='eth_schema',
    database_name='eth',
    generate_columns=True
) %}

{{ source_yaml }}
-- Generate source YAML for the 'eth_schema' schema in the 'eth' database.
-- The source YAML includes all tables in the database and their columns.
-- Column generation can be disabled by passing 'generate_columns=False' to the 'codegen.generate_source' function.

{{codegen.generate_model_yaml(['stg_transactions', 'stg_transactions_enriched', 'stablecoin_activity_per_day'])}}