# Python model can only create tables, 
# and incremental models so no ephemeral or view
# python models do no support jinja functions

def model(dbt, session):
    return dbt.ref("stablecoin_activity_per_day").limit(10)