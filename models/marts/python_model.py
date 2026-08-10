# Python model can only create tables, 
# and incremental models so no ephemeral or view
# python models do no support jinja functions

import holidays

def is_holliday(date_col):
    # chez jaffle_shop
    french_holidays = holidays.France()
    is_holliday = (date_col in french_holidays)
    return is_holliday



def model(dbt, session):

    dbt.config(packages=["holidays"])
    my_sql_model_df = dbt.ref("stablecoin_activity_per_day")
    # source_df = dbt.source("raw_data", "stablecoin_activity_per_day")
    my_sql_model_df = my_sql_model_df.to_pandas()
    
    my_sql_model_df['is_holiday'] = my_sql_model_df['date'].apply(is_holliday)

    print(type(my_sql_model_df))

    # raise Exception("Test")

    return my_sql_model_df.limit(10)