import pandas as pd
from ics import Calendar, Event
from datetime import datetime

def create_calendar():
    try:
        activities_df = pd.read_csv('data/activities.csv')
    except FileNotFoundError:
        print("Error: data/activities.csv not found.")
        return

    c = Calendar()

    for index, row in activities_df.iterrows():
        if 'Aug' in str(row['date_window']):
            e = Event()
            e.name = row['name']
            e.location = row['address']
            
            # Simple date parsing - this could be more robust
            try:
                if ',' in row['date_window']: # Multiple dates
                    dates = row['date_window'].replace('Aug','').replace(' ','').split(',')
                    start_date = dates[0]
                elif '-' in row['date_window']: # Date range
                    start_date = row['date_window'].split('-')[0].replace('Aug','').strip()
                else: # Single date
                    start_date = row['date_window'].replace('Aug','').strip()

                if 'pm' in row['typical_time'] or 'am' in row['typical_time']:
                    start_time_str = row['typical_time'].split('-')[0]
                    start_dt_str = f"2025-08-{start_date} {start_time_str}"
                    start_dt = datetime.strptime(start_dt_str, '%Y-%m-%d %I%p')
                    e.begin = start_dt
                    e.duration = {"hours": 2} # Default duration
                else: # All day event
                    start_dt_str = f"2025-08-{start_date}"
                    start_dt = datetime.strptime(start_dt_str, '%Y-%m-%d')
                    e.begin = start_dt
                    e.make_all_day()
                
                c.events.add(e)

            except Exception as ex:
                print(f"Could not parse date for '{row['name']}': {ex}")


    with open('calendar/itinerary.ics', 'w') as f:
        f.writelines(c)
    
    print("Calendar file created successfully.")

if __name__ == "__main__":
    create_calendar()