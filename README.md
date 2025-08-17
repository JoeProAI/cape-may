# Cape May Command Center

A sharp, modern web interface for your Cape May vacation planning (August 17-23, 2025). Built with Next.js and deployed on Vercel.

## 🚀 Live Demo

Visit the live site: [Coming Soon - Deploy to Vercel]

## ✨ Features

- **Sharp, Modern Design** - Clean geometric interface with no rounded corners
- **Real-time Weather Status** - Temperature, wind, precipitation with risk advisories
- **Daily Planning Cards** - Primary and backup plans based on weather conditions
- **Interactive Activities** - Map, booking, and call buttons for each activity
- **Responsive Layout** - Works perfectly on desktop and mobile
- **Command Center Aesthetic** - Professional, angular design with high contrast

## 🛠️ Tech Stack

- **Next.js 14** - React framework with TypeScript
- **Tailwind CSS** - Utility-first CSS with custom sharp utilities
- **Lucide React** - Clean, consistent icons
- **Static Export** - Optimized for Vercel deployment

## 🏃‍♂️ Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JoeProAI/cape-may.git
   cd cape-may
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

## 📦 Deploy to Vercel

1. **Push to GitHub** (already done)
2. **Go to [vercel.com](https://vercel.com)**
3. **Import this repository**
4. **Deploy automatically**

Vercel will auto-detect the Next.js configuration and deploy your command center.

## 📁 Project Structure

```
├── app/
│   ├── globals.css          # Sharp, modern styling
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main command center interface
├── data/
│   ├── activities.csv       # Cape May activities database
│   └── weather.json         # Weather forecast data
├── public/                  # Static assets
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── vercel.json             # Vercel deployment settings
```

## 🎨 Design Philosophy

This interface deliberately avoids typical "AI-generated" design patterns:
- **No rounded corners** - Sharp, geometric edges throughout
- **High contrast** - Black headers, bold typography
- **Industrial aesthetic** - Monospace fonts, uppercase labels
- **Professional layout** - Command center feel with status bars

## 📊 Data Sources

- **Weather Data** - `data/weather.json` with 7-day forecast
- **Activities** - `data/activities.csv` with Cape May attractions
- **Real-time Updates** - Weather advisories and risk assessments

## 🔧 Development

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📝 License

Private vacation planning tool - All rights reserved.