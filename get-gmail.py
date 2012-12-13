#!/usr/bin/env python
# -*- coding: utf-8 -*-

import RPi.GPIO as GPIO, feedparser, time

DEBUG = 1

USERNAME = "username" # just the part before the @ sign, add yours here
PASSWORD = "password" # Change this to your password.

NEWMAIL_OFFSET = 1 # my unread messages never goes to zero, yours might
MAIL_CHECK_FREQ = 10 # check mail every 10 seconds

GPIO.setmode(GPIO.BCM)
GREEN_LED = 4
RED_LED = 17
BLUE_LED = 18
GPIO.setup(GREEN_LED, GPIO.OUT)
GPIO.setup(RED_LED, GPIO.OUT)
GPIO.setup(BLUE_LED, GPIO.OUT)

try:
    while True:

        newmails = int(feedparser.parse("https://" + USERNAME + ":" + PASSWORD +"@mail.google.com/gmail/feed/atom")["feed"]["fullcount"])

        if DEBUG:
            print "You have", newmails, "new emails!"

        if newmails > 10:
            GPIO.output(GREEN_LED, True)
            GPIO.output(RED_LED, True)
            GPIO.output(BLUE_LED, True)
        elif newmails > 5:
            GPIO.output(GREEN_LED, True)
            GPIO.output(RED_LED, True)
            GPIO.output(BLUE_LED, False)
        elif newmails > NEWMAIL_OFFSET:
            GPIO.output(GREEN_LED, True)
            GPIO.output(RED_LED, False)
            GPIO.output(BLUE_LED, False)
        elif newmails <= NEWMAIL_OFFSET:
            GPIO.output(GREEN_LED, False)
            GPIO.output(RED_LED, False)
            GPIO.output(BLUE_LED, False)

        time.sleep(MAIL_CHECK_FREQ)
except KeyboardInterrupt:
    GPIO.cleanup()

