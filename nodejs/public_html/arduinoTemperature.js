"use strict";
//2012-06-23 http://alexandre.alapetite.fr

var arduinoSerialPort = '/dev/ttyACM0';	//Serial port over USB connection between the Raspberry Pi and the Arduino

var fs = require('fs');
function writeFile(text)
{
	fs.writeFile('temperature.json', text, function(err)
	{
		if (err) console.warn(err);
	});
}

var os = require('os');
var serverSignature = 'Node.js / Debian ' + os.type() + ' ' + os.release() + ' ' + os.arch() + ' / Raspberry Pi B + Arduino Uno R3';

var postOptions =
{
	host: 'alexandre.alapetite.fr',	//Change to your own server	posttestserver.com
	path: '/doc-alex/temperature/post.php',	//	/post.php
	method: 'POST',
	headers:
	{
		'Content-Type': 'application/x-www-form-urlencoded',
		'Connection': 'close',
		'User-Agent': serverSignature
	}
};

var http = require('http');
function postData(s)
{//Standard HTTP POST request
	var myOptions = postOptions;
	postOptions.headers['Content-Length'] = s.length;

	var requestPost = http.request(myOptions, function(res)
	{
		res.setEncoding('utf8');
		/*res.on('data', function (chunk)
		{
			console.log(chunk);
		});*/
	});

	requestPost.on('error', function(e)
	{
		console.warn(e);
	});

	requestPost.write(s);
	requestPost.end();
}

var serialport = require('serialport');
var serialPort = new serialport.SerialPort(arduinoSerialPort,
{//Listening on the serial port for data coming from Arduino over USB
	parser: serialport.parsers.readline('\n')
});

var lastTemperatureIndoor = NaN;
var lastTemperatureOutoor = NaN;
var dateLastInfo = new Date(0);

var querystring = require('querystring');
serialPort.on('data', function (data)
{//When a new line of text is received from Arduino over USB
	try
	{
		var j = JSON.parse(data);
		lastTemperatureOutoor = j.celsius ;
		lastTemperatureIndoor = j.fahrenheit;
		dateLastInfo = new Date();
		writeFile('{"Celsius":"' + lastTemperatureOutoor + '","Fahrenheit":"' + lastTemperatureIndoor + '"}');
		//postData(querystring.stringify(j));	//Forward the Arduino information to another Web server
	}
	catch (ex)
	{
		console.warn(ex);
	}
});

function colourScale(t)
{//Generate an HTML colour in function of the temperature
	if (t <= -25.5) return '0,0,255';
	if (t <= 0) return Math.round(255 + (t * 10)) + ',' + Math.round(255 + (t * 10)) + ',255';
	if (t <= 12.75) return Math.round(255 - (t * 20)) + ',255,' + Math.round(255 - (t * 20));
	if (t <= 25.5) return Math.round((t - 12.75) * 20) + ',255,0';
	if (t <= 38.25) return '255,' + Math.round(255 - (t - 25.5) * 20) + ',0';
	return '255,0,0';
}

function temperatureResponse()
{
	return {
		'lastTemperatureIndoor': lastTemperatureIndoor,
		'lastTemperatureOutoor': lastTemperatureOutoor,
		'html': '<!DOCTYPE html>\n\
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-GB" lang="en-GB">\n\
<head>\n\
<meta charset="UTF-8" />\n\
<meta http-equiv="refresh" content="1" />\n\
<title>Temperature - Arduino - Raspberry Pi</title>\n\
<link rel="alternate" type="application/json" href="temperature.json"/>\n\
<link rel="author" href="http://alexandre.alapetite.fr/cv/" title="Alexandre Alapetite" />\n\
<meta name="robots" content="noindex" />\n\
<style type="text/css">\n\
html, body {background:black; color:white; font-family:sans-serif; text-align:center}\n\
.out {font-size:48pt}\n\
.in {font-size:36pt}\n\
.r, .sb {bottom:0; color:#AAA; position:absolute}\n\
.r {left:0.5em; margin-right:5em; text-align:left}\n\
.sb {right:0.5em}\n\
a {color:#AAA; text-decoration:none}\n\
a:hover {border-bottom:1px dashed}\n\
</style>\n\
</head>\n\
<body>\n\
<h1>Arduino Temperature Probe</h1>\n\
<p>Celsius<br /><strong class="out" style="color:rgb(' + colourScale(lastTemperatureOutoor) + ')">' + (Math.round(lastTemperatureOutoor * 10) / 10.0) + '°C</strong></p>\n\
<p>Fahrenheit<br /><strong class="in" style="color:rgb(' + colourScale(lastTemperatureIndoor) + ')">' + (Math.round(lastTemperatureIndoor * 10) / 10.0) + '°F</strong></p>\n\
<p>' + dateLastInfo.toISOString() + '</p>\n\
<p class="r"><a href="http://alexandre.alapetite.fr/doc-alex/raspberrypi-nodejs-arduino/" title="Based on">Arduino + Raspberry Pi</a></p>\n\
</body>\n\
</html>\n\
',
	dateLastInfo: dateLastInfo
	};
}

module.exports.temperatureResponse = temperatureResponse;
