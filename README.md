# Anambra GeoHub

## Project Overview
Anambra GeoHub is a prototype platform designed to catalog, visualize, and analyze health and geospatial datasets for Anambra State.  

## Features

- **Interactive Dashboards**: Real-time health metrics visualization
- **GIS Mapping**: Geospatial analysis of health facilities and disease patterns  
- **Data Repository**: Centralized health data management
- **Multi-source Integration**: DHIS2, GRID3, PHC Registry data
- **Role-based Access**: Public, Partner, and Admin user levels
- **API-Driven**: Dynamic data loading from PostgreSQL/PostGIS database

## Tech Stack

**Frontend:**
- React + TypeScript
- Vite (build tool)
- TailwindCSS + shadcn/ui (styling)
- OpenLayers (mapping)
- Recharts (charts)

**Backend:**
- Node.js + Express
- PostgreSQL/PostGIS (database)
- PM2 (process management)
- Nginx (reverse proxy)

**Cloud Infrastructure:**
- AWS EC2 (compute)
- AWS RDS (database)
- AWS S3 (storage)

## Prerequisites

- Node.js 20+
- PostgreSQL with PostGIS extension
- AWS Account (for production deployment)

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-org/anambra-geohub.git
cd anambra-geohub/application/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create `.env` file:

```env
# Frontend
VITE_API_BASE=http://localhost:3001/api
VITE_GEMINI_API_KEY=your_gemini_api_key

# Backend Database
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=anambra_geohub
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# CORS (development)
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,http://localhost:8080
```

### 4. Start Development

```bash
# Start both frontend and backend
npm run dev:full

# Or start separately:
npm run dev      # Frontend only (port 5173)
npm run server   # Backend only (port 3001)
```

### 5. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api/health
- **Health Metrics**: http://localhost:3001/api/health-metrics/severe_malaria

## Project Structure

```bash
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components and routing
│   ├── lib/               # Utilities, hooks, and helpers
│   └── styles/            # Global styles and themes
├── server/                # Backend Node.js API
│   ├── config/            # Database and app configuration
│   ├── controllers/       # Business logic and route handlers
│   ├── routes/            # API route definitions
│   └── middleware/        # Express middleware (CORS, errors)
├── public/                # Static assets and favicon
├── datasets/              # Sample data files
└── package.json           # Dependencies and scripts
```

## API Endpoints

### Health Metrics
```bash
GET  /api/health-metrics                    # List available metrics
GET  /api/health-metrics/:metric            # Get metric data (GeoJSON)
GET  /api/health-metrics/:metric/filters    # Get filter options (LGAs, wards, periods)
```

### Facilities
```bash
GET  /api/facilities                        # Health facilities (GeoJSON)
GET  /api/lgas                             # Local Government Areas
GET  /api/wards                            # Wards by LGA
GET  /api/stats                            # Facility statistics
```

### System
```bash
GET  /api/health                           # API health check
POST /api/generate                         # Gemini AI content generation
```

## Available Health Metrics

- **Severe Malaria Cases** (`severe_malaria`)
- **Sickle Cell Disease** (`sickle_cell`) 
- **Breast Cancer Cases** (`breast_cancer`)
- **Death Cases** (`death_cases`)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend development server |
| `npm run server` | Start backend API server |
| `npm run dev:full` | Start both frontend and backend |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint code linting |

## Production Deployment

The application is designed for AWS deployment:

1. **Frontend**: Deploy to Netlify, Vercel, or AWS S3/CloudFront
2. **Backend**: Deploy to AWS EC2 with PM2 and Nginx
3. **Database**: AWS RDS PostgreSQL with PostGIS

For detailed deployment instructions, see the deployment documentation.

## Development

### Adding New Health Metrics

1. Add metric configuration to `server/config/metrics.config.mjs`
2. Create database view following the standard schema
3. Metric automatically appears in API and frontend

### Database Schema

Health metrics views should include:
- `facility_id`, `facility_name` 
- `lga_name`, `parentwardname`
- `period`, `case_count`
- `geom` (PostGIS geometry)

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- **Issues**: GitHub Issues
- **Documentation**: See `/docs` folder (local development)
- **API Documentation**: Visit `/api/health` endpoint

## Architecture

```
Frontend (React) ←→ Backend API (Node.js) ←→ PostgreSQL/PostGIS
     ↓                    ↓                        ↓
  Vite/Nginx         PM2/Nginx              AWS RDS
     ↓                    ↓                        ↓
 Netlify/S3           AWS EC2              PostGIS Views
```

--- 

**Built with ❤️ for Anambra State Health System**

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.
