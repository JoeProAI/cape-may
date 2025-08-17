# Cape May Command Center

This folder contains everything needed for the Cape May vacation from August 17-23, 2025.

## Quickstart

1.  Open the `public/index.html` file in a web browser to view the daily command center.
2.  For a live preview, run `python -m http.server 8000` in this directory and open the provided URL.

## How to Refresh Data

### Weather &amp; Surf Forecast
To refresh the weather data, run the following command:
```bash
# (Instructions to be added here)
```

### Static Site
The site is static and will rebuild automatically when data files are updated.

## Troubleshooting

*   **Scraping Issues:** If an activity's information is outdated, it may be due to a change in the source website's layout. The `source_url` in `data/activities.csv` can be used to manually verify the information.
*   **Missing Packages:** If you encounter errors related to missing Python packages, install them using:
    ```bash
    pip install pandas requests openpyxl python-dateutil ics
    ```
*   **Pending Verification:** Activities that could not be verified with an authoritative URL are listed here. (None currently).