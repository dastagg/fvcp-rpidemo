#include <math.h>

const int sensorPin = A0;
const float baselineTemp = 24.0;

void setup(){
  Serial.begin(9600);
  
  for (int pinNumber = 2; pinNumber < 5; pinNumber++){
    pinMode(pinNumber, OUTPUT);
    digitalWrite(pinNumber, LOW);
  }
}

void loop(){
  int sensorVal = analogRead(sensorPin);
  // Covert the ADC reading to voltage
  float voltage = (sensorVal/1024.0) * 5.0;
  float ctemp = (voltage - .5) * 100;
  float ftemp = (ctemp * 9 / 5) + 32;
  Serial.print("{\"sensorval\":\"");
  Serial.print(sensorVal); 
  Serial.print("\", \"celsius\":\"");
  Serial.print(ctemp);
  Serial.print("\", \"fahrenheit\":\"");
  Serial.print(ftemp);
  Serial.print("\"}");
  Serial.print("\n");
  
  delay(500);
}  
