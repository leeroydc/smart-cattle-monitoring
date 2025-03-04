
# Cattle Management System

A modern web application for monitoring and managing cattle using IoT sensors, GPS tracking, and advanced analytics.

## Features

- Real-time monitoring of cattle health and location
- Temperature and weight tracking
- Feed distribution management
- Inventory tracking
- Cattle health status management

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account

### Installation

1. Clone this repository
```bash
git clone https://github.com/yourusername/cattle-management-system.git
cd cattle-management-system
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit the `.env` file and add your Supabase URL and anonymous key.

4. Set up Supabase
   - Create a new Supabase project
   - Execute the SQL scripts in the `supabase/migrations` directory to create the required tables
   - Set up the required Edge Functions (see below)

5. Start the development server
```bash
npm run dev
# or
yarn dev
```

### Supabase Setup

This application requires the following tables in your Supabase project:
- cattle
- feed_distribution
- feeding_schedule
- gps_tracking
- sensor_readings (if using IoT sensors)

The Edge Function `sensor-data` needs to be deployed to your Supabase project.

## Deployment

To build for production:
```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory and can be deployed to any static hosting service.

## License

MIT
