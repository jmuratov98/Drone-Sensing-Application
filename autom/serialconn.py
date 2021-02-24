import serial, string, time
import shutil

i = 0 # Initializer of amount of data to be collected
ser = serial.Serial('/dev/ttyS0', baudrate = 9600) # Serial port connection (subject to change on RPI)
#print(ser.name)
ser.write('\r') # Exit Low Power Mode (can be any key)
time.sleep(1)
text_file = open("testing.csv", "rw") # Open Text File with write permissions

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

shutil.copy(src="/bin/testing.csv", dst="/media/pi/USB/testing.csv") #copies file from RPI to USB Drive