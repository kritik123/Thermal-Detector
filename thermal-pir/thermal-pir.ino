#include <Wire.h>
#include <SparkFun_GridEYE_Arduino_Library.h>

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

void setup()  
{   
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

      
      if (tempC<16) {
           setColor(0, 0, 255);  // blue
        } else if(tempC < 16) {
           setColor(80, 0, 80); // cyan
          }  else if(tempC < 20) {
            setColor(0, 255, 255);  // aqua
          }  else if(tempC < 24) {
            setColor(0, 255, 0);  // green
          } else if(tempC < 28) {
              setColor(255, 255, 0); // yellow
          }   else if(tempC < 37) {
            setColor(255, 20, 20);   // magenta
          }  

      
     // read the bytes incoming from the client:
     // char thisChar = client.read();
     // echo the bytes back to the client:
     // char msg[10] = "";
       Serial.println(heatData);
       delay(1500);    
    }
  } else {
   // digitalWrite(ledPin, LOW); // turn LED OFF
    if (pirState == HIGH){
      // we have just turned of
      noTone(buzzPin);     // Stop sound...
      Serial.println("Motion ended!");
      setColor(0, 0, 0);  // none
      meetime = 0;
      // We only want to print on the output change, not state
      pirState = LOW;
    }
  } 

  
}

void getHeatmap()
{
  // Print the temperature value of each pixel in floating point degrees Celsius
  // separated by commas
  heatData = "";
  float previousVal = 0;
  for (unsigned char i = 0; i < 64; i++)
  {
        if(previousVal>37) {
             // we have just turned on
            Serial.println("High temperature!");
            setColor(255, 0, 0);  // red
            tone(buzzPin, 1000); // Send 1KHz sound signal... 
          }
          tempC = grideye.getPixelTemperature(i);
          heatData += tempC + String(",");
          previousVal = tempC; 
  }

   
      
  // End each frame with a linefeed
  Serial.println();
  // Give Processing time to chew
}


void setColor(int red, int green, int blue)
{
  #ifdef COMMON_ANODE
    red = 255 - red;
    green = 255 - green;
    blue = 255 - blue;
  #endif
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);  
}
