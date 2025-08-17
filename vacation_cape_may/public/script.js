document.addEventListener('DOMContentLoaded', () => {
    const todayPanel = document.getElementById('today-panel');
    const dailyCardsContainer = document.getElementById('daily-cards-container');
    const lastUpdatedSpan = document.getElementById('last-updated');

    const today = new Date('2025-08-17T12:00:00Z');

    async function fetchData() {
        try {
            const [weatherRes, activitiesRes] = await Promise.all([
                fetch('../data/weather.json'),
                fetch('../data/activities.csv')
            ]);
            const weatherData = await weatherRes.json();
            const activitiesText = await activitiesRes.text();
            const activities = parseCSV(activitiesText);

            updateTodayPanel(weatherData);
            generateDailyCards(weatherData, activities);
            updateFooter(weatherData);

        } catch (error) {
            console.error("Failed to load data:", error);
            dailyCardsContainer.innerHTML = "&lt;p&gt;Could not load vacation data. Please try again later.&lt;/p&gt;";
        }
    }

    function parseCSV(text) {
        const lines = text.trim().split('\\n');
        const headers = lines[0].split(',');
        return lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, i) => {
                obj[header.trim()] = values[i].trim().replace(/^"|"$/g, '');
                return obj;
            }, {});
        });
    }

    function updateTodayPanel(weatherData) {
        const todayWeather = weatherData.forecast.find(d => d.date === '2025-08-17');
        if (todayWeather) {
            let advisoriesHTML = '';
            todayWeather.advisories.forEach(advisory => {
                const risk = advisory.split('_')[0].toLowerCase();
                advisoriesHTML += `&lt;span class="risk-badge ${risk}"&gt;${advisory.replace('_', ' ')}&lt;/span&gt;`;
            });
            todayPanel.innerHTML = `
                &lt;strong&gt;Today's Forecast:&lt;/strong&gt; ${todayWeather.description}, High ${todayWeather.high_f}°F
                ${advisoriesHTML}
            `;
        }
    }

    function generateDailyCards(weatherData, activities) {
        dailyCardsContainer.innerHTML = '';
        weatherData.forecast.forEach(day => {
            const card = document.createElement('div');
            card.className = 'day-card';

            const primaryPlan = activities.filter(a => !a.rain_safe &amp;&amp; a.date_window.includes(day.date.split('-')[2]));
            const backupPlan = activities.filter(a => a.rain_safe &amp;&amp; a.date_window.includes(day.date.split('-')[2]));

            card.innerHTML = `
                &lt;h2&gt;${day.day}, August ${day.date.split('-')[2]}&lt;/h2&gt;
                &lt;div class="plan-section"&gt;
                    &lt;h3&gt;Primary Plan (Good Weather)&lt;/h3&gt;
                    ${primaryPlan.map(activityHTML).join('') || '&lt;p&gt;No specific plans yet.&lt;/p&gt;'}
                &lt;/div&gt;
                &lt;div class="plan-section"&gt;
                    &lt;h3&gt;Backup Plan (Rain or High Risk)&lt;/h3&gt;
                    ${backupPlan.map(activityHTML).join('') || '&lt;p&gt;No specific plans yet.&lt;/p&gt;'}
                &lt;/div&gt;
            `;
            dailyCardsContainer.appendChild(card);
        });
    }

    function activityHTML(activity) {
        return `
            &lt;div class="activity"&gt;
                &lt;p class="activity-name"&gt;${activity.name}&lt;/p&gt;
                &lt;p class="activity-meta"&gt;${activity.category} | ${activity.typical_time}&lt;/p&gt;
                &lt;div class="activity-actions"&gt;
                    &lt;a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(activity.address)}" target="_blank"&gt;Map&lt;/a&gt;
                    ${activity.booking_url ? `&lt;a href="${activity.booking_url}" target="_blank"&gt;Book Now&lt;/a&gt;` : ''}
                    ${activity.phone ? `&lt;a href="tel:${activity.phone}"&gt;Call&lt;/a&gt;` : ''}
                &lt;/div&gt;
            &lt;/div&gt;
        `;
    }

    function updateFooter(weatherData) {
        lastUpdatedSpan.textContent = new Date(weatherData.last_updated).toLocaleString();
    }

    fetchData();
});