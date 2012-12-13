#!/usr/bin/env python
# -*- coding: utf-8 -*-

import RPi.GPIO as GPIO
import time

DEBUG = 1


GPIO.setmode(GPIO.BCM)
GREEN_LED = 4
RED_LED = 17
BLUE_LED = 18
GPIO.setup(GREEN_LED, GPIO.OUT) 
GPIO.setup(RED_LED, GPIO.OUT) 
GPIO.setup(BLUE_LED, GPIO.OUT) 

try:
    while True:
        GPIO.output(BLUE_LED, True)
        time.sleep(2)
        GPIO.output(BLUE_LED, False)
        time.sleep(2)
except KeyboardInterrupt:
    GPIO.cleanup()

