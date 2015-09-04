# tweet-bot-node
Twitter Bot using node js , RPi , Arduino, Jonny Five

## Setting up the Raspberry Pi.
In order to make use of the RPi with node there are a couple of steps to be followed.

1. Set up the RPi following the guide [here](https://www.raspberrypi.org/documentation/installation/installing-images/README.md).
	- __NOTE__ Optionally run `sudo apt-get update sudo apt-get upgrade` to update/upgrade Raspbian.
2. Set up the network connection following the guide [here](https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md).
	- __NOTE__ To set up multiple wireless network connections follow the guide [here](http://www.instantsupportsite.com/self-help/raspberry-pi/raspberry-connect-multiple-wireless-networks/).
3. Install [node](https://nodejs.org/) using [this](https://learn.adafruit.com/node-embedded-development/installing-node-dot-js) guide. Once the cursor returns, test the version of node by using `node --version` or `node -v`.
4. Download and install [WinSCP](http://winscp.net) and [Putty](http://www.putty.org/) on your windows/mac machine to remote login to your RPi.
5. Use [WinSCP](http://winscp.net/eng/index.php) by creating a new site and use the IP of the connected RPi and credentials i.e. username: pi & password: raspberry to transfer you project folder to  a location on the RPi.
6. Now open a [Putty](http://www.putty.org/) session with your RPi by providing the appropriate credentials i.e. username: pi & password: raspberry.
7. Once the session is open, go the transfered folder path and run `sudo npm install --production --unsafe-perm`.
8. Once intallation of the required modules is done run the application by usig `sudo node app.js`.

## Config file `twitter-config.json`
We need to create a `twitter-config.json` file which contains the following json object.

```javascript
{
  "consumer_key": "<consumer_key>",
  "consumer_secret": "<consumer_secret>",
  "access_token_key": "<access_token_key>",
  "access_token_secret": "<access_token_secret>"
}
```

__NOTE__ Failure to create the `.json` file will cause an error while running the code.

