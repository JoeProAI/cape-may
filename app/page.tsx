'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, MapPin, Phone, ExternalLink, Calendar, Thermometer, Wind, Droplets } from 'lucide-react'

interface WeatherDay {
  date: string
  day: string
  high_f: number
  low_f: number
  precip_chance: number
  wind_mph: number
  description: string
  advisories: string[]
}

interface WeatherData {
  last_updated: string
  forecast: WeatherDay[]
}

interface Activity {
  name: string
  category: string
  date_window: string
  typical_time: string
  address: string
  phone?: string
  booking_url?: string
  cost_estimate: string
  kid_friendly: string
  rain_safe: string
  notes: string
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [weatherRes, activitiesRes] = await Promise.all([
          fetch('/weather.json'),
          fetch('/activities.csv')
        ])
        
        const weather = await weatherRes.json()
        const activitiesText = await activitiesRes.text()
        const parsedActivities = parseCSV(activitiesText)
        
        setWeatherData(weather)
        setActivities(parsedActivities)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const parseCSV = (text: string): Activity[] => {
    const lines = text.trim().split('\n')
    const headers = lines[0].split(',')
    return lines.slice(1).map(line => {
      const values = line.split(',')
      return headers.reduce((obj: any, header, i) => {
        obj[header.trim()] = values[i]?.trim().replace(/^"|"$/g, '') || ''
        return obj
      }, {})
    })
  }

  const getTodayWeather = () => {
    if (!weatherData) return null
    return weatherData.forecast.find(d => d.date === '2025-08-17')
  }

  const getActivitiesForDay = (date: string, rainSafe: boolean) => {
    const dayNum = date.split('-')[2]
    return activities.filter(activity => {
      const inDateWindow = activity.date_window.includes(dayNum) || activity.date_window.includes('Aug 17-23')
      const matchesWeather = rainSafe ? activity.rain_safe === 'yes' : activity.rain_safe === 'no'
      return inDateWindow && matchesWeather
    })
  }

  const getRiskBadgeColor = (advisory: string) => {
    if (advisory.includes('HIGH')) return 'bg-red-600 border-red-800'
    if (advisory.includes('MODERATE')) return 'bg-orange-500 border-orange-700'
    return 'bg-yellow-500 border-yellow-700'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-mono text-gray-800">LOADING COMMAND CENTER...</div>
      </div>
    )
  }

  const todayWeather = getTodayWeather()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-black tracking-tight">CAPE MAY COMMAND CENTER</h1>
          <p className="text-xl font-mono mt-2 text-gray-300">AUGUST 17-23, 2025</p>
        </div>
      </header>

      {/* Today's Status Bar */}
      {todayWeather && (
        <div className="bg-primary-600 text-white sticky top-0 z-50 border-b-4 border-primary-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5" />
                  <span className="font-bold text-lg">{todayWeather.high_f}°F</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5" />
                  <span>{todayWeather.wind_mph} MPH</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  <span>{todayWeather.precip_chance}%</span>
                </div>
                <span className="font-semibold">{todayWeather.description.toUpperCase()}</span>
              </div>
              <div className="flex gap-2">
                {todayWeather.advisories.map((advisory, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-1 sharp-border ${getRiskBadgeColor(advisory)} text-white font-bold text-sm`}
                  >
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    {advisory.replace('_', ' ')}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Cards */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-8">
          {weatherData?.forecast.map((day) => {
            const primaryActivities = getActivitiesForDay(day.date, false)
            const backupActivities = getActivitiesForDay(day.date, true)

            return (
              <div key={day.date} className="bg-white sharp-border border-gray-800 sharp-shadow shadow-gray-800">
                {/* Day Header */}
                <div className="bg-gray-900 text-white p-6 border-b-2 border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-black">{day.day.toUpperCase()}</h2>
                      <p className="text-xl font-mono">AUGUST {day.date.split('-')[2]}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{day.high_f}°F / {day.low_f}°F</div>
                      <div className="text-sm font-mono text-gray-300">{day.description}</div>
                    </div>
                  </div>
                  {day.advisories.length > 0 && (
                    <div className="mt-4 flex gap-2">
                      {day.advisories.map((advisory, idx) => (
                        <div
                          key={idx}
                          className={`px-2 py-1 sharp-border ${getRiskBadgeColor(advisory)} text-white font-bold text-xs`}
                        >
                          {advisory.replace('_', ' ')}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 divide-x-2 divide-gray-800">
                  {/* Primary Plan */}
                  <div className="p-6">
                    <h3 className="text-xl font-black mb-4 text-gray-900 border-b-2 border-gray-800 pb-2">
                      PRIMARY PLAN
                    </h3>
                    <div className="text-sm text-gray-600 mb-4 font-mono">GOOD WEATHER CONDITIONS</div>
                    {primaryActivities.length > 0 ? (
                      <div className="space-y-4">
                        {primaryActivities.map((activity, idx) => (
                          <ActivityCard key={idx} activity={activity} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 font-mono">NO SPECIFIC PLANS SCHEDULED</div>
                    )}
                  </div>

                  {/* Backup Plan */}
                  <div className="p-6">
                    <h3 className="text-xl font-black mb-4 text-gray-900 border-b-2 border-gray-800 pb-2">
                      BACKUP PLAN
                    </h3>
                    <div className="text-sm text-gray-600 mb-4 font-mono">RAIN OR HIGH RISK CONDITIONS</div>
                    {backupActivities.length > 0 ? (
                      <div className="space-y-4">
                        {backupActivities.map((activity, idx) => (
                          <ActivityCard key={idx} activity={activity} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 font-mono">NO BACKUP PLANS SCHEDULED</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-mono text-sm">
            LAST UPDATED: {weatherData ? new Date(weatherData.last_updated).toLocaleString() : 'UNKNOWN'}
          </p>
        </div>
      </footer>
    </div>
  )
}

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <div className="bg-gray-50 sharp-border border-gray-300 p-4 sharp-shadow-sm shadow-gray-300">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-lg text-gray-900">{activity.name}</h4>
        <span className="text-xs font-mono bg-gray-800 text-white px-2 py-1 sharp-border border-gray-900">
          {activity.category.toUpperCase()}
        </span>
      </div>
      
      <div className="text-sm text-gray-600 mb-3 space-y-1">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span className="font-mono">{activity.typical_time}</span>
        </div>
        <div className="text-gray-700 font-medium">{activity.cost_estimate}</div>
        {activity.notes && (
          <div className="text-xs text-gray-500 italic">{activity.notes}</div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white sharp-border border-gray-800 hover:bg-gray-800 transition-colors text-sm font-bold"
        >
          <MapPin className="w-3 h-3" />
          MAP
        </a>
        
        {activity.booking_url && (
          <a
            href={activity.booking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-600 text-white sharp-border border-primary-800 hover:bg-primary-700 transition-colors text-sm font-bold"
          >
            <ExternalLink className="w-3 h-3" />
            BOOK
          </a>
        )}
        
        {activity.phone && (
          <a
            href={`tel:${activity.phone}`}
            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-700 text-white sharp-border border-gray-900 hover:bg-gray-600 transition-colors text-sm font-bold"
          >
            <Phone className="w-3 h-3" />
            CALL
          </a>
        )}
      </div>
    </div>
  )
}
