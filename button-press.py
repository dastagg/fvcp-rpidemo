#!/usr/bin/env python

from time import sleep
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
GPIO.setup(23, GPIO.IN)
GPIO.setup(24, GPIO.IN)
GPIO.setup(25, GPIO.IN)

while True:
        if ( GPIO.input(23) == False ):
            print ("#23 - Button 1 was pressed")
        if ( GPIO.input(24) == False ):
            print ("#24 - Button 2 was pressed")
        if ( GPIO.input(25) == False ):
            print ("#25 -Button 3 was pressed")
        sleep(1)

