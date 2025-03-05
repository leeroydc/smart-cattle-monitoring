
# Hardware Setup Guide

## Component List

For each cattle monitoring node, you will need:

- **ESP32 Development Board**: Controls the system and provides WiFi connectivity
- **DHT22 Sensor**: Measures temperature and humidity
- **Voltage Divider**: For battery level monitoring (2x resistors: 100kΩ and 10kΩ)
- **LiPo Battery**: 3.7V, 2000mAh or higher capacity
- **Solar Panel** (optional): 5V, 1-2W for continuous operation
- **Waterproof Case**: IP65 or higher rated enclosure
- **GPS Module** (optional): For location tracking (e.g., NEO-6M)
- **Mounting Hardware**: For attaching to cattle ear tag or collar

## Circuit Diagram

```
                     +--------------+
                     |              |
                     |    ESP32     |
                     |              |
                     +---+------+---+
                         |      |
+--------+               |      |               +--------+
|        |               |      |               |        |
| DHT22  +-----Data------+      +-----RX/TX-----+ GPS   |
|        |                                      |        |
+--------+                                      +--------+
                                  
+--------+               +--------+
|        |               |        |
| Solar  +-----5V--------+ Battery|
| Panel  |               |        |
+--------+               +--+-----+
                            |
                            | Voltage Divider
                            |
                            +------- GPIO 35 (Analog Input)
```

## Wiring Instructions

1. **DHT22 Sensor**:
   - Connect VCC to 3.3V
   - Connect GND to ground
   - Connect DATA to GPIO 4
   - Add a 4.7kΩ pullup resistor between VCC and DATA

2. **Battery Monitoring**:
   - Create voltage divider with 100kΩ and 10kΩ resistors
   - Connect battery positive to the top of voltage divider
   - Connect the middle of the divider to GPIO 35
   - Connect battery negative to ground

3. **GPS Module** (optional):
   - Connect VCC to 3.3V
   - Connect GND to ground
   - Connect TX to ESP32 RX2 (GPIO 16)
   - Connect RX to ESP32 TX2 (GPIO 17)

4. **Power System**:
   - Connect solar panel to battery charging circuit
   - Connect battery output to ESP32 VIN and GND

## Waterproofing and Mounting

1. Place all components in a waterproof enclosure, ensuring proper ventilation for the DHT22
2. Use silicone sealant around cable entries
3. Attach the enclosure securely to a cattle ear tag or collar using appropriate hardware
4. Ensure the solar panel (if used) has clear exposure to sunlight

## Power Management Configuration

To maximize battery life, the ESP32 firmware implements sleep modes:

1. **Deep Sleep Mode**: ESP32 sleeps between readings
2. **Wake-Up Timing**: Default is every 30 seconds, adjust as needed in firmware
3. **Low Battery Handling**: System sends warning and adjusts reading frequency when battery is low

## Firmware Deployment

1. Connect ESP32 to computer via USB
2. Select correct board and port in Arduino IDE
3. Update the following in the firmware:
   - WiFi credentials
   - Supabase URL and API key
   - Cattle ID (unique per device)
   - GPS coordinates (if not using real GPS module)
4. Upload firmware to ESP32

## Testing the Hardware

After installation:

1. Monitor the Serial output at 115200 baud rate to verify readings
2. Check your Supabase database for incoming data entries
3. Verify the web dashboard shows the new devices and readings

## Troubleshooting

- **No WiFi Connection**: Check SSID and password, ensure signal reaches the installation location
- **Sensor Reading Errors**: Verify DHT22 wiring and pullup resistor
- **Battery Issues**: Check voltage divider configuration and battery charge level
- **No Data in Database**: Confirm Supabase URL and API key are correct
