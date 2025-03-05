
# Hardware Setup Guide

## Component List

For each cattle monitoring node, you will need:

- **ESP32 Development Board**: Controls the system and provides WiFi connectivity
- **DHT22 Sensor**: Measures temperature and humidity
- **NEO-6M GPS Module**: For accurate location tracking
- **Voltage Divider**: For battery level monitoring (2x resistors: 100kΩ and 10kΩ)
- **LiPo Battery**: 3.7V, 2000mAh or higher capacity
- **Solar Panel** (optional): 5V, 1-2W for continuous operation
- **Waterproof Case**: IP65 or higher rated enclosure
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
| DHT22  +-----Data------+      +-----RX(16)----+ NEO-6M |
|        |                            TX(17)----+  GPS   |
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

3. **NEO-6M GPS Module**:
   - Connect VCC to 3.3V
   - Connect GND to ground
   - Connect TX to ESP32 RX1 (GPIO 16)
   - Connect RX to ESP32 TX1 (GPIO 17)

4. **Power System**:
   - Connect solar panel to battery charging circuit
   - Connect battery output to ESP32 VIN and GND

## Waterproofing and Mounting

1. Place all components in a waterproof enclosure, ensuring proper ventilation for the DHT22
2. Position the GPS antenna for clear sky visibility when possible
3. Use silicone sealant around cable entries
4. Attach the enclosure securely to a cattle ear tag or collar using appropriate hardware
5. Ensure the solar panel (if used) has clear exposure to sunlight

## Power Management Configuration

To maximize battery life, the ESP32 firmware implements deep sleep modes:

1. **Deep Sleep Mode**: ESP32 sleeps between readings (60 seconds by default)
2. **Wake-Up Timing**: Configurable in the firmware
3. **Low Battery Handling**: System sends warning and adjusts sleep duration when battery is low

## Firmware Deployment

1. Connect ESP32 to computer via USB
2. Install required libraries in Arduino IDE:
   - WiFi
   - HTTPClient
   - ArduinoJson
   - DHT sensor library by Adafruit
   - TinyGPS++ by Mikal Hart
3. Open the ARDUINO_GPS_CODE.ino file
4. Update the following in the firmware:
   - WiFi credentials (`ssid` and `password`)
   - Cattle ID (`cattleId`) - unique per device
   - Sleep duration if needed (`TIME_TO_SLEEP`)
5. Upload firmware to ESP32

## Required Library Installations
```
// In Arduino IDE
Tools > Manage Libraries, then install:
- DHT sensor library by Adafruit
- ArduinoJson by Benoit Blanchon
- TinyGPS++ by Mikal Hart
```

## Testing the Hardware

After installation:

1. Monitor the Serial output at 115200 baud rate to verify readings
2. Check GPS fix status (may take several minutes on first boot)
3. Verify data is being sent to Supabase by checking the database
4. Confirm that deep sleep is working (power consumption should drop significantly)

## GPS Troubleshooting

- **No GPS Fix**: Place the device outside with clear view of the sky
- **Poor GPS Accuracy**: Ensure antenna has good sky visibility
- **High Power Consumption**: Adjust GPS timeout settings in firmware
- **GPS Module Not Responding**: Check wiring connections and power

## Battery Life Optimization

- Increase sleep duration between readings
- Reduce GPS polling frequency
- Use a larger battery or solar panel
- Optimize WiFi connection time
