import serial, string, time
import os
import csv

i = 0 # Initializer of amount of data to be collected
ser = serial.Serial('/dev/ttyUSB0', baudrate = 9600) # Serial port connection (subject to change on RPI)
#print(ser.name)
ser.write('\r') # Exit Low Power Mode (can be any key)
time.sleep(1)
#shutil.copy(src="/home/pi/Drone-Sensing-Application/autom/test.csv", dst="/bin/test.csv")
text_file = open("test.csv", 'w+') # Open Text File with write permissions

csvwriter = csv.writer(text_file)
csvwriter.writerow(['SN','PPB','T','RH','ADCR','TR','RHR','D','H','M','S'])

while i < 7:        # Amount of Times to read output (TTC - Time To Collect before moving GPS Location)
    print "SN            PPB  T  RH  ADCR   TR     RHR   D   H   M   S" #For Readability ONLY
    ser.write('\r')
    output = ser.readline()
    text_file.write(output)
    print output
    print("Printed after 1 seconds")
    output = " "
    time.sleep(1)
    i += 1

#ser.write('s') # Enter Low-power standby mode
text_file.close()
ser.close() # Close Serial port 

#shutil.copy('/home/pi/Drone-Sensing-Application/autom/test.csv', '/media/usb/test.csv') #copies file from RPI to USB Drive
os.system('sudo cp -f /home/pi/Drone-Sensing-Application/autom/test.csv /media/usb/data.csv')

#when doing cronjob, do this:
# @reboot  /bin/python /home/pi/Drone-Sensing-Application/autom/serialconn.py
