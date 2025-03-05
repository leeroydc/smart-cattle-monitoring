
/*
 * Smart Cattle Monitoring System - GPS Version
 * 
 * This sketch reads data from DHT22 and NEO-6M GPS module,
 * then sends it to a Supabase database using HTTP requests
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Your Supabase edge function URL and API key
const char* serverUrl = "https://ftpopnbnhmgxjyfmojnq.supabase.co/functions/v1/sensor-data";
const char* supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0cG9wbmJuaG1neGp5Zm1vam5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5NDMwMzUsImV4cCI6MjA1NTUxOTAzNX0.epZ26eigfcjwhUdNd8AT-TYq-RWr0tGnZOKpRfRlH-Q";

// Cattle ID (unique for each device)
const char* cattleId = "C1001";

// DHT22 sensor setup
#define DHTPIN 4     // Digital pin connected to the DHT sensor
#define DHTTYPE DHT22   // DHT 22 (AM2302)
DHT dht(DHTPIN, DHTTYPE);

// Battery monitoring pin
#define BATTERY_PIN 35

// GPS module setup (NEO-6M)
#define GPS_RX_PIN 16
#define GPS_TX_PIN 17
#define GPS_BAUD 9600
TinyGPSPlus gps;
HardwareSerial SerialGPS(1);  // Use hardware serial #1 for GPS

// Deep sleep settings (for battery optimization)
#define uS_TO_S_FACTOR 1000000  // Conversion factor for micro seconds to seconds
#define TIME_TO_SLEEP  60       // Time ESP32 will go to sleep (in seconds)

// Variables to store sensor data
float temperature = 0;
float humidity = 0;
int batteryLevel = 0;
int signalStrength = 0;
double latitude = 0;
double longitude = 0;
bool gpsValid = false;

void setup() {
  Serial.begin(115200);
  delay(1000); // Give time for the serial port to connect
  
  Serial.println("Smart Cattle Monitoring System - Starting up");
  
  // Initialize DHT22 sensor
  dht.begin();
  
  // Initialize GPS module
  SerialGPS.begin(GPS_BAUD, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);
  Serial.println("GPS module initialized");
  
  // Connect to WiFi
  connectToWiFi();
  
  // Read and process sensor data
  readSensorData();
  
  // Transmit data to Supabase
  if (WiFi.status() == WL_CONNECTED) {
    sendSensorData();
  } else {
    Serial.println("WiFi disconnected. Data not sent.");
  }
  
  // Go to deep sleep to save battery power
  Serial.println("Going to deep sleep for " + String(TIME_TO_SLEEP) + " seconds");
  esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP * uS_TO_S_FACTOR);
  esp_deep_sleep_start();
}

void loop() {
  // This will never run due to deep sleep, all code in setup()
}

void connectToWiFi() {
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  
  // Wait for connection with timeout
  int timeout = 0;
  while (WiFi.status() != WL_CONNECTED && timeout < 20) {
    delay(500);
    Serial.print(".");
    timeout++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    
    // Get signal strength
    signalStrength = map(WiFi.RSSI(), -100, -50, 0, 100);
    signalStrength = constrain(signalStrength, 0, 100);
    Serial.print("Signal strength: ");
    Serial.print(signalStrength);
    Serial.println("%");
  } else {
    Serial.println("\nFailed to connect to WiFi");
  }
}

void readSensorData() {
  // Read temperature and humidity from DHT22
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from DHT sensor!");
    temperature = 0;
    humidity = 0;
  } else {
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" °C");
    
    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");
  }
  
  // Read battery level
  int batteryRaw = analogRead(BATTERY_PIN);
  
  // Convert raw reading to voltage (assuming voltage divider with 100k and 10k resistors)
  // ESP32 ADC reference is 3.3V, max value is 4095
  float voltage = batteryRaw * (3.3 / 4095.0) * ((100.0 + 10.0) / 10.0);
  
  // Convert battery voltage to percentage (assuming 3.3V is 0% and 4.2V is 100%)
  batteryLevel = map(voltage * 100, 330, 420, 0, 100);
  batteryLevel = constrain(batteryLevel, 0, 100);
  
  Serial.print("Battery voltage: ");
  Serial.print(voltage);
  Serial.println(" V");
  
  Serial.print("Battery level: ");
  Serial.print(batteryLevel);
  Serial.println("%");
  
  // Read GPS data
  unsigned long gpsStartTime = millis();
  bool gpsTimeout = false;
  const unsigned long GPS_TIMEOUT = 60000; // 60 seconds timeout for GPS
  
  Serial.println("Waiting for GPS data...");
  
  // Try to get valid GPS data with timeout
  while (!gpsValid && !gpsTimeout) {
    while (SerialGPS.available() > 0) {
      if (gps.encode(SerialGPS.read())) {
        if (gps.location.isValid()) {
          latitude = gps.location.lat();
          longitude = gps.location.lng();
          gpsValid = true;
          
          Serial.print("GPS Location: ");
          Serial.print(latitude, 6);
          Serial.print(", ");
          Serial.println(longitude, 6);
          break;
        }
      }
    }
    
    // Check for timeout
    if (millis() - gpsStartTime > GPS_TIMEOUT) {
      gpsTimeout = true;
      Serial.println("GPS timeout - no valid location data");
    }
    
    // Small delay to prevent maxing out CPU
    delay(10);
  }
  
  if (!gpsValid) {
    Serial.println("No valid GPS data obtained");
  }
}

void sendSensorData() {
  Serial.println("Sending data to Supabase...");
  
  HTTPClient http;
  
  // Your Domain name with URL path
  http.begin(serverUrl);
  
  // Set HTTP headers
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", supabaseKey);
  
  // Create JSON document
  StaticJsonDocument<256> doc;
  
  // Add sensor values to JSON document
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["battery_level"] = batteryLevel;
  doc["signal_strength"] = signalStrength;
  doc["cattle_id"] = cattleId;
  
  // Only add GPS coordinates if they are valid
  if (gpsValid) {
    doc["lat"] = latitude;
    doc["lng"] = longitude;
  }
  
  // Serialize JSON to string
  String jsonString;
  serializeJson(doc, jsonString);
  
  Serial.print("Request payload: ");
  Serial.println(jsonString);
  
  // Send HTTP POST request
  int httpResponseCode = http.POST(jsonString);
  
  // Check response
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    Serial.print("Response: ");
    Serial.println(response);
  } else {
    Serial.print("Error on sending POST: ");
    Serial.println(httpResponseCode);
  }
  
  // Free resources
  http.end();
}
