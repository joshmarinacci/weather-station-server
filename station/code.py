import board
import adafruit_bme280
import time
import busio
import feathers2
from digitalio import DigitalInOut
from analogio import AnalogIn
import wifi
import socketpool
import adafruit_requests
import ssl


# Create sensor object, using the board's default I2C bus.
i2c = board.I2C()  # uses board.SCL and board.SDA
bme280 = adafruit_bme280.Adafruit_BME280_I2C(i2c)

# change this to match the location's pressure (hPa) at sea level
bme280.sea_level_pressure = 1013.25

# init ambient_light
ambient_light = AnalogIn(board.AMB)

def main_loop():
    while True:
        send_data()
        time.sleep(5)

def send_data():
    global requests
    data = {}
    data["temperature"] = bme280.temperature
    data["humidity"] = bme280.relative_humidity
    data["pressure"] = bme280.pressure
    data["altitude"] = bme280.altitude
    data["ambient_light"] = (ambient_light.value * 3.3) / 65536
    response = requests.post("http://vr.josh.earth:3000/post",json=data)
    print("data was sent",data)
    print("response was", response.text)
    response.close()


def connect_wifi():
    try:
        wifi.radio.connect("jhome","marykay76")
        print("connected to the wifi")
    except Exeception as e:
        print("error trying to connect" + str(e))
        exit(1)

connect_wifi()
pool = socketpool.SocketPool(wifi.radio)
requests = adafruit_requests.Session(pool, ssl.create_default_context())
main_loop()
