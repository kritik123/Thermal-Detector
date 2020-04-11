#include <Wire.h>
#include <SparkFun_GridEYE_Arduino_Library.h>
#include <SPI.h>
#include <WiFiNINA.h>
#include <Adafruit_NeoPixel.h>

int pin   =  7; 
int numPixels   = 50;
int pixelFormat = NEO_GRB + NEO_KHZ800;
Adafruit_NeoPixel *pixels;
#define DELAYVAL 7 // Time (in milliseconds) to pause between pixels

GridEYE grideye;

String heatData;
int ledState;
unsigned long meetime; 
uint16_t seconds = 3142;      // max == 65535

int bluePin = 8;
int greenPin = 9;
int redPin = 10;
int buzzPin = 11;                // choose the pin for the LED
int inputPin = 12;               // choose the input pin (for PIR sensor)
int pirState = LOW;             // we start, assuming no motion detected
int val = 0;                    // variable for reading the pin status
float tempC; 

unsigned long interval=2000; // how often we update the tild value
unsigned long previousMillis=0; // millis() returns an unsigned long.

#include "arduino_setup.h" 
///////please enter your sensitive data in the Secret tab/arduino_secrets.h
char ssid[] = SECRET_SSID;        // your network SSID (name)
char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)
int keyIndex = 0;            // your network key Index number (needed only for WEP)

int status = WL_IDLE_STATUS;
char server[] = HOST;    // name address for DasData (using DNS)

// Initialize the Ethernet client library
// with the IP address and port of the server
// that you want to connect to (port 80 is default for HTTP):
WiFiSSLClient client;


void setup()  
{   
   pixels = new Adafruit_NeoPixel(numPixels, pin, pixelFormat);
     pixels->setBrightness(20);
   pixels->begin(); // INITIALIZE NeoPixel strip object (REQUIRED)
   
    // attempt to connect to WiFi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(ssid, pass); 
    // wait 2 seconds for connection:
    delay(2000);
  }
 
  
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);  
  pinMode(buzzPin, OUTPUT);      // declare LED as output
  pinMode(inputPin, INPUT);     // declare sensor as input
  // Start your preferred I2C object
  Wire.begin();
  // Library assumes "Wire" for I2C but you can pass something else with begin() if you like
  grideye.begin();   
    
  Serial.begin(115200);    
}  
  
void loop()  
{    
   pixels->clear(); // Set all pixel colors to 'off'
   unsigned long currentMillis = millis(); // grab current time  

  // publish tilting data 
  if ((unsigned long)(currentMillis - previousMillis) >= interval) {      
        previousMillis = millis();
      }
      else {  
          Serial.println("");  
          }       
       
   
     while (client.available()) {
    char c = client.read();
    Serial.write(c);
     }

  
    char receiveVal;    
    if(Serial.available() > 0)  
    {          
       receiveVal = Serial.read();  
       if(receiveVal == '1')      { 
          ledState = 1;   
       }
      else  
          ledState = 0;       
      }     
       
     val = digitalRead(inputPin);  // read input value
  if (val == HIGH) {            // check if the input is HIGH
       //   digitalWrite(ledPin, HIGH);  // turn LED ON 
     if (pirState == LOW) {
      meetime = millis(); 
      Serial.println("Motion detected!");
      // We only want to print on the output change, not state 
      pirState = HIGH;
  
      getHeatmap(); 
     // read the bytes incoming from the client:
     // char thisChar = client.read();
     // echo the bytes back to the client:
     // char msg[10] = ""; 
    }
  } else {
   // digitalWrite(ledPin, LOW); // turn LED OFF
    if (pirState == HIGH){
      // we have just turned of
      noTone(buzzPin);     // Stop sound...
      Serial.println("Motion ended!");
      setColor(0, 0, 0);  // none 
      pixels->clear(); // Set all pixel colors to 'off'
      meetime = 0;
      // We only want to print on the output change, not state
      pirState = LOW;
    } 
  } 
       Serial.println(heatData);
       delay(1000);    
}

void getHeatmap()
{
  // Print the temperature value of each pixel in floating point degrees Celsius
  // separated by commas
  heatData = "";
  float previousVal = 0;
  String sensorData = ""; 
  for (unsigned char i = 0; i < 64; i++)
  {     
          tempC = grideye.getPixelTemperature(i) + 6; // error factor aka distance adjustment
          heatData += tempC + String(",");
          sensorData += tempC + String("|");
          previousVal = tempC; 

          noTone(buzzPin); 
          
           if (tempC<16) {  setColor(0, 0, 255);  // blue
               } else if(tempC < 28) {
                            setColor(0, 200, 200); // cyan
               }  else if(tempC < 32) {
                            setColor(0, 255, 100);  // aqua 
               }  else if(tempC < 35) {
                            setColor(0, 255, 0);  // green 
               } else if(tempC < 36) {
                            setColor(255, 180, 0); // yellow 
               }   else if(tempC < 39) {
                            Serial.println("High temperature!");
                            tone(buzzPin, 1000); // Send 1KHz sound signal...   
                            setColor(255, 0, 0);  // red 
                            delay(1500);   
                }  
    }

 
   /*  */
    Serial.println("\nStarting connection to server...");
  // if you get a connection, report back via serial:
  if (client.connect(server, PORT)) {
    Serial.println("connected to server");
    // Make a HTTP request:

    String data = ""; 
    data += "/i.aspx?d=";
    data += sensorData;
    data += "&s=";
    data += DSTOKEN;
    data += "&a=";
    data += ATOKEN;
  
    String request = "GET ";
    request += data;
    request += " HTTP/1.1\r\nHost: ";
    request += HOST;
    request += "\r\n\r\n";

    Serial.println(request);
    client.println(request);
  //  client.println("GET /?q=sample HTTP/1.1");
  //  client.println("Host: www.dasdata.co");
    client.println("Connection: close");
    client.println();
  }

      
  // End each frame with a linefeed
  Serial.println();
  // Give Processing time to chew
}


void setColor(int red, int green, int blue)
{ 
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);  

for(int i=0; i<numPixels; i++) { // For each pixel...

    // pixels->Color() takes RGB values, from 0,0,0 up to 255,255,255
    // Here we're using a moderately bright green color:
    pixels->setPixelColor(i, pixels->Color(red, green, blue)); 
    pixels->show();   // Send the updated pixel colors to the hardware.

    delay(DELAYVAL); // Pause before next pass through loop
  }
  
}

 
 
