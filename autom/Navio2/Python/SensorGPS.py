import navio.util
import navio.ublox
import navio.adc
import csv
import os, time, sys
import serial, string

ser = serial.Serial('/dev/ttyUSB0', baudrate=9600, timeout=2) # Serial port connection (subject to change on RPI)

usbmountpath = "/media/usb" #For USB not Plugged in, close Sensor Connection and Script
if os.path.ismount(usbmountpath) == False:
	ser.close()
	sys.exit("Closed NO2 Sensor Connection. Reboot System with USB connected") # USB not mounted

text_file = open("TestData.csv", 'w+') #Open new CSV File if not available
csvwriter = csv.writer(text_file)
csvwriter.writerow(['Longitude','Latitude','Height','hMSL','hACC','vACC','SN','PPB','T','RH','ADCR','TR','RHR','D','H','M','S'])

if __name__ == "__main__":

	ubl = navio.ublox.UBlox("spi:0.0", baudrate=5000000, timeout=1)
	
	ubl.configure_poll_port()
	ubl.configure_poll(navio.ublox.CLASS_CFG, navio.ublox.MSG_CFG_USB)
	#ubl.configure_poll(navio.ublox.CLASS_MON, navio.ublox.MSG_MON_HW)
	
	ubl.configure_port(port=navio.ublox.PORT_SERIAL1, inMask=1, outMask=0)
	ubl.configure_port(port=navio.ublox.PORT_USB, inMask=1, outMask=1)
	ubl.configure_port(port=navio.ublox.PORT_SERIAL2, inMask=1, outMask=0)
	ubl.configure_poll_port()
	ubl.configure_poll_port(navio.ublox.PORT_SERIAL1)
	ubl.configure_poll_port(navio.ublox.PORT_SERIAL2)
	ubl.configure_poll_port(navio.ublox.PORT_USB)
	ubl.configure_solution_rate(rate_ms=1000)
	
	ubl.set_preferred_dynamic_model(None)
	ubl.set_preferred_usePPP(None)
	
	ubl.configure_message_rate(navio.ublox.CLASS_NAV, navio.ublox.MSG_NAV_POSLLH, 1)
	ubl.configure_message_rate(navio.ublox.CLASS_NAV, navio.ublox.MSG_NAV_PVT, 1)
	ubl.configure_message_rate(navio.ublox.CLASS_NAV, navio.ublox.MSG_NAV_STATUS, 1)
	ubl.configure_message_rate(navio.ublox.CLASS_NAV, navio.ublox.MSG_NAV_SOL, 1)
	ubl.configure_message_rate(navio.ublox.CLASS_NAV, navio.ublox.MSG_NAV_VELNED, 1)
	ubl.configure_message_rate(navio.ublox.CLASS_NAV, navio.ublox.MSG_NAV_SVINFO, 1)
	ubl.configure_message_rate(navio.ublox.CLASS_NAV, navio.ublox.MSG_NAV_VELECEF, 1)
	ubl.configure_message_rate(navio.ublox.CLASS_NAV, navio.ublox.MSG_NAV_POSECEF, 1)
	ubl.configure_message_rate(navio.ublox.CLASS_RXM, navio.ublox.MSG_RXM_RAW, 1)
	ubl.configure_message_rate(navio.ublox.CLASS_RXM, navio.ublox.MSG_RXM_SFRB, 1)
	ubl.configure_message_rate(navio.ublox.CLASS_RXM, navio.ublox.MSG_RXM_SVSI, 1)
	ubl.configure_message_rate(navio.ublox.CLASS_RXM, navio.ublox.MSG_RXM_ALM, 1)
	ubl.configure_message_rate(navio.ublox.CLASS_RXM, navio.ublox.MSG_RXM_EPH, 1)
	ubl.configure_message_rate(navio.ublox.CLASS_NAV, navio.ublox.MSG_NAV_TIMEGPS, 5)
	ubl.configure_message_rate(navio.ublox.CLASS_NAV, navio.ublox.MSG_NAV_CLOCK, 5)
	#ubl.configure_message_rate(navio.ublox.CLASS_NAV, navio.ublox.MSG_NAV_DGPS, 5)
	
	adc = navio.adc.ADC()
	voltread = adc.read(2)/1000*11.3 #Initial Voltage value from Power Module (ADC0)
	
	start_time = time.time() #in seconds
	elapsedtime = 0 #in seconds
	outstr = ""
	output = ""
	ser.write('\r') #for turning on sensor
	
	while voltread >= 12.7 and elapsedtime <= 60: #Continue reading GPS+Sens until voltread < 12.7V or flight time > 10 min
		msg = ubl.receive_message()
		if msg is None:
			if opts.reopen:
				ubl.close()
				ubl = navio.ublox.UBlox("spi:0.0", baudrate=5000000, timeout=1) #timeout = 2
				continue
			#raise serial.SerialException
			print(empty)
			break
		#print(msg.name())		
		if msg.name() == "NAV_POSLLH": #state to gether Lat, Long, etc.
			outstr = str(msg) .split(",")[1:]
			outstr = "".join(outstr)
			strings = [" Latitude=", " height=", " hMSL=", " vAcc=", " hAcc="] 
			for s in strings:
				outstr = outstr.replace(s, ",")
			strings2= " Longitude="
			outstr = outstr.replace(strings2, "")
			#print(outstr)
			try:
				ser.write('\r')
				output = ser.readline()	
				a = " "
				output = output.replace(a, "") 
				#print(len(output))
				if len(output) <= 52 or len(outstr) == 0:
					raise serial.SerialException
			#else:
			#	raise serial.SerialException
			except serial.SerialException:
				print("No Data Received from NO2 Sensor, Try Again...")
			else:
				fullstr = outstr + ", " + output
				text_file.write(fullstr)
				print(fullstr)
				voltread = adc.read(2)/1000*11.3
				elapsedtime = time.time() - start_time
				print(elapsedtime, "seconds elapsed. Voltage Reading: ", voltread)
text_file.close()
ser.close() # Close Serial port 
os.system('sudo cp -f /home/pi/Drone-Sensing-Application/autom/Navio2/Python/TestData.csv /media/usb/GPSensData.csv')
