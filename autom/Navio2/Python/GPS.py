import navio.util
import navio.ublox
import csv
import os, time

i = 0;
text_file = open("GPSData.csv", 'w+')
csvwriter = csv.writer(text_file)
csvwriter.writerow(['Longitude','Latitude','Height','hMSL','hACC','vACC'])

if __name__ == "__main__":

    ubl = navio.ublox.UBlox("spi:0.0", baudrate=5000000, timeout=2)

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
    
    start_time = time.time() #in seconds
    elapsedtime = 0 #in seconds

    while elapsedtime <= 300:
        msg = ubl.receive_message()
#        print(msg)
        if msg is None:
            if opts.reopen:
                ubl.close()
                ubl = navio.ublox.UBlox("spi:0.0", baudrate=5000000, timeout=2)
                continue
            print(empty)
            break
#        print(msg.name())
        if msg.name() == "NAV_POSLLH":
            outstr = str(msg) .split(",")[1:]
            outstr = "".join(outstr)
            strings = ["Latitude=", "height=", "hMSL=", "vAcc=", "hAcc="] 
            for s in strings:
                outstr = outstr.replace(s, ",")
            strings2= "Longitude="
            outstr = outstr.replace(strings2, "")
            outstr = outstr + '\n'
            text_file.write(outstr)
            print(outstr)
            i += 1
            elapsedtime = time.time() - start_time
            print(elapsedtime)
#        if msg.name() == "NAV_STATUS":
#            outstr = str(msg).split(",")[1:2]
#            outstr = "".join(outstr)
#            print(outstr)
#            i += 1
        #print(str(msg))
text_file.close()
os.system('sudo cp -f /home/pi/Drone-Sensing-Application/autom/Navio2/Python/GPSData.csv /media/usb/GPSDat.csv')
