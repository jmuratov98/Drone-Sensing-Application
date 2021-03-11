import serial, string, time
import shutil

i = 0 # Initializer of amount of data to be collected
ser = serial.Serial('/dev/ttyUSB0', baudrate = 9600) # Serial port connection (subject to change on RPI)
#print(ser.name)
ser.write('\r') # Exit Low Power Mode (can be any key)
time.sleep(1)
#shutil.copy(src="/home/pi/Drone-Sensing-Application/autom/test.csv", dst="/bin/test.csv")
text_file = open("test.csv", "w") # Open Text File with write permissions

while i < 7:        # Amount of Times to read output (TTC - Time To Collect before moving GPS Location)
 #   print "SN            PPB  T  RH  ADCR   TR     RHR   D   H   M   S" #For Readability ONLY
    ser.write('\r')
    output = ser.readline()
    text_file.write(output)
#    print output
    print("Printed after 5 seconds")
    output = " "
    time.sleep(5)
    i += 1

#ser.write('s') # Enter Low-power standby mode
text_file.close()
ser.close() # Close Serial port 

shutil.copyfile(src="/home/pi/Drone-Sensing-Application/autom/test.csv", dst="/media/USB/test.csv") #copies file from RPI to USB Drive

#when doing cronjob, do this:
# @reboot  /bin/python /home/pi/Drone-Sensing-Application/autom/serialconn.py
