# Katiba Book- Political Finance & Risk Intelligence Platform

A comprehensive platform for tracking and analyzing political campaign finance, government budgets, and political risk in Kenya. Built with Next.js and FastAPI.

## 🌐 Live Demo

**Frontend:** [https://polifin.vercel.app](https://polifin.vercel.app)

## 📋 Overview

Katiba Book(Political Finance & Risk Intelligence) is a data-driven platform that provides transparency and insights into:

- **Political Campaign Finance** - Track party funding, candidate expenditures, and campaign contributions
- **Government Budgets & Tenders** - Monitor government spending and procurement processes
- **Political Data** - Comprehensive database of politicians, parties, elections, and elective positions
- **Demographic Insights** - Population, education, income, and development indicators
- **Geographic Data** - Administrative divisions (counties, constituencies, wards)
- **Risk Analysis** - Assess political and financial risks across different regions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Python 3.11+ (for backend)
- PostgreSQL database

### Frontend Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Backend Setup

The backend API is built with FastAPI and provides RESTful endpoints for all data operations.

```bash
# Navigate to backend directory
cd ../backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python scripts/database_cli.py --create-tables

# Seed database with sample data
python scripts/database_cli.py --seed --all

# Start API server
uvicorn app.main:app --reload
```

## 🏗️ Tech Stack

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **State Management:** React Hooks
- **Data Fetching:** Fetch API / Axios

### Backend

- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Authentication:** JWT tokens
- **API Documentation:** OpenAPI/Swagger

## 📁 Project Structure

```
frontend/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions
├── public/          # Static assets
└── styles/          # Global styles

backend/
├── app/
│   ├── routes/      # API endpoints
│   ├── models/      # Database models
│   ├── services/    # Business logic
│   └── config/      # Configuration
├── seeds/           # Database seed data
└── scripts/         # CLI tools
```

## 🔑 Key Features

- **Real-time Data Visualization** - Interactive charts and graphs
- **Advanced Search & Filtering** - Find specific politicians, parties, or financial records
- **Comprehensive Reporting** - Generate detailed reports on political finance
- **Geographic Analysis** - Visualize data across counties and constituencies
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **API-First Architecture** - RESTful API for third-party integrations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Built during a hackathon to promote transparency in political finance and governance.

link to the deployed project: https://polifin.vercel.app
