The "serialconn.py" script is proven to work under python 2.7 on a Ubuntu-based System and Debian Based OS (RPI)
The "test.csv" file is a temporary file that will store the DGS-NO2 Sensor data

To ensure that the script "serialconn.py" runs properly, you MUST install the pyserial library.
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


In order to make the SSH connection work, you MUST do the following in the Linux Terminal:
 
	1. Copy python file to /bin (needed to access for Raspberry Pi to run script)
		sudo cp -i [Where repo is stored]/Drone-Sensing-Application/autom/serialconn.py /bin
    	2. Ensure "serianconn.py" is stored in the /bin directory
    		cd /bin	
	3. Add a new Cron Job (Allows you to run scripts at any time(s) or time interval)
		sudo crontab -e
	4. Add the following line at the very bottom (after all the comments)
		@reboot python /bin/serialconn.py &

    	   ** "&" symbol signifies command is run in the background and doesn't stop the system from booting up 
	5. Test
		sudo reboot
  	6. Ensure CSV file has correct information from DGS-NO2 Sensor. Open the terminal and type:
   		cd /bin
   		nano test.csv
	7. That's It!

