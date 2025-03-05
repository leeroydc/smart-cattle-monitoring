
# Smart Cattle Monitoring System

A complete cattle monitoring system with ESP32-based sensor nodes and a web dashboard.

## System Architecture

1. **Hardware Nodes**: ESP32 microcontrollers with DHT22 sensors, battery monitoring, and optional GPS
2. **Backend**: Supabase for data storage and edge functions
3. **Frontend**: React web application for monitoring and analytics

## Hardware Setup Guide

### Components Required Per Node

- ESP32 development board
- DHT22 temperature and humidity sensor
- Battery for power (LiPo or 18650 battery with holder)
- Solar panel for charging (optional)
- Enclosure for weatherproofing
- GPS module (optional)

### Wiring Instructions

1. Connect DHT22 data pin to GPIO 4 on ESP32
2. Connect battery monitoring voltage divider to GPIO 35
3. Connect GPS module to UART pins if available
4. Ensure proper power connections and grounding

### Firmware Installation

1. Install Arduino IDE
2. Add ESP32 board support through Board Manager
3. Install required libraries:
   - WiFi
   - HTTPClient
   - ArduinoJson
   - DHT sensor library
4. Update the firmware with your specific credentials (see below)
5. Flash to ESP32 board

#### Required Library Installations
```
// In Arduino IDE
Tools > Manage Libraries, then install:
- DHT sensor library by Adafruit
- ArduinoJson by Benoit Blanchon
```

### Firmware Configuration

Edit the following variables in the Arduino code:

```cpp
// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Your Supabase URL and key
const char* serverUrl = "YOUR_SUPABASE_FUNCTION_URL";
const char* supabaseKey = "YOUR_SUPABASE_ANON_KEY";

// Cattle ID - unique for each device
const char* cattleId = "UNIQUE_CATTLE_ID";
```

## Web Application Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/smart-cattle-monitoring.git
cd smart-cattle-monitoring
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Create an `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. Set up the database schema:
- Use the Supabase CLI:
  ```bash
  supabase db push
  ```
- Or manually run the migration script from `supabase/migrations/20230101000000_initial_schema.sql` in the Supabase SQL Editor

6. Deploy edge function:
- Use the Supabase CLI:
  ```bash
  supabase functions deploy sensor-data
  ```
- Or copy the edge function code to the Supabase dashboard

7. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Troubleshooting

### Hardware Issues
- Ensure DHT22 has a pullup resistor (4.7kΩ) between data and power
- Check battery voltage is within safe operating range (3.3V-4.2V)
- Verify signal strength by checking the ESP32's distance from the WiFi router

### Software Issues
- Confirm Supabase edge function URL is correct
- Verify API key has necessary permissions
- Check database schema for proper table setup

## Project Structure
- `/src` - React frontend code
- `/supabase` - Supabase functions and database migrations
- `/docs` - Additional documentation

## License
MIT
