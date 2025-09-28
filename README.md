# Anambra GeoHub

## Project Overview
Anambra GeoHub is a prototype platform designed to catalog, visualize, and analyze health and geospatial datasets for Anambra State.  
The portal provides **role-based access** for different stakeholders:

- **Public users** → explore maps, dashboards, and selected datasets.  
- **Partners (NGOs, donors, research bodies)** → access harmonized datasets and visualizations.  
- **Admin (Anambra State Government)** → manage data, users, and system configuration.  

The system supports CSV, GeoJSON, and Excel datasets, with the ability to download and use them in tools like **QGIS** for deeper analysis.

---

## Features
- 📊 Interactive dashboards of priority diseases (Malaria, HIV, TB, NTDs, etc.)  
- 🗺️ Map visualization of health facilities and disease spread across LGAs  
- 🔐 Role-based login (Admin, Partner, Public)  
- 📂 Dataset repository with 20+ harmonized sources (DHIS2, GRID3, PHC Registry, NHMIS, etc.)  
- 📥 CSV/GeoJSON downloads for QGIS/PostGIS integration  
- 🎨 Modern UI with amber & white theme (Anambra brand colors)  

---

## Technologies Used
This project is built with:
- **Vite** - Build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn/ui** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Leaflet** - Interactive maps
- **Recharts** - Data visualization

---

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd geo-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment
1. Push your changes to the `main` or `master` branch
2. GitHub Actions will automatically build and deploy your site
3. Your site will be available at: `https://yourusername.github.io/geo-hub/`

### Manual Deployment
You can also deploy manually using the gh-pages package:

1. **Install gh-pages** (if not already installed)
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

### GitHub Pages Setup
1. Go to your repository settings on GitHub
2. Navigate to **Pages** section
3. Under **Source**, select **GitHub Actions**
4. The workflow will handle the rest automatically

---

## License

© 2025 Anambra State. All rights reserved.
