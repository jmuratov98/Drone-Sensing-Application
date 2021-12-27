The "SensorGPS.py" script is proven to work under python 2.7 on a Ubuntu-based System and Debian Based OS (RPI).
The "TestData.csv" file is a temporary file that will store the DGS-NO2 Sensor data and ublox neo-m8n GPS Data. Note: The complete SensorGPS.py file is in Navio2 -> Python and look for SensorGPS.py file. The one here was a test file used for confirming sensor reliability. The complete version includes GPS and proper USB functionalities.

To do an SSH connection between the Raspberry Pi and your Computer, you can do the following:

	1. (Regular Connection - NO SSH) Connect Raspberry Pi to your TV or Monitor. Make sure you have a Mouse and Keyboard
	2. (SSH) on any SSH Connecting Software (ie. MobaXTerm, putty, VSCode, etc) and with an ether connection to your computer
            type as the url: navio.local and port 22
	3. (SSH) get to the wpa_supplicant.conf file to add your local internet connection to the RPI, then connect to it via that same IP Address
	    You can get to the wpa_supplicant.conf file by typing: sudo nano /boot/wpa_supplicant.conf 

To ensure that the script "SensorGPS.py" runs properly, you MUST install the pyserial library.
You can do so by installing python, curl, and pip:
	
	(For Python 2.7 Installation)

	Step 1: Check if python is installed on your computer by doing:
		python --version
	Step 2: If nothing pops up or is an older version of python, do the following:
		sudo apt-get update
		sudo apt upgrade
		sudo apt-get install python
	
	Step 3: Ensure python installation by typing the same command as Step 1 in the terminal
	
	(For Curl installation)
	
	Step 1: Type the following command into the terminal:
		sudo apt install curl
		
	** This will be used to install pip as we will downloading a files from a server hosting pip **
	
	(for pip installation)
	
	Step 1: Check if pip is already installed on your computer by typing in the Terminal:
		python -m pip --version
	
	Step 2: If pip has not been installed, type into the terminal: 
		curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
	and then run the command below where the get-pip.py file is located
		python get-pip.py
		
	
	(For pyserial Library Installation)
	Step 1: Type the following command into the terminal to install pySerial
		python -m pip install pyserial
	
	** This will allow us to interface with the DGS-NO2 sensor via SSH **


In order to make the script run on reboot connection work, you MUST do the following in the Linux Terminal:

	1. Add a new Cron Job (Allows you to run scripts at any time(s) or time interval)
		sudo crontab -e -u pi
	2. Add the following line at the very bottom (after all the comments)
		@reboot cd /home/pi/Drone-Sensing-Application/autom/Navio2/Python && /usr/bin/python SensorGPS.py 
	3. Test
		sudo reboot
  	4. Ensure CSV file has correct information from DGS-NO2 Sensor. Open the terminal and type:
   		cd /media/usb && nano GPSensData.csv
   		cd ~/Drone-Sensing-Application/autom/Navio2/Python && nano TestData.csv
	5. That's It!
