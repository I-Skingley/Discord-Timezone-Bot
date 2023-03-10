# clockBot

## General info
This is a time themed Discord bot with the following functionalities:

*   Tell the time in a given location 
*   Convert a given time to another timezone

## Tech
Created with js
* using the discord.js library to interact with the Discord api.
* moment.js for conversion function.
* Nominatim for converting given location into longitude and latidude.
* timezonedb for getting the time and timezone from the lon/lat data
* worldtimeapi for getting the time data for user's IP.

## Todo
* Replace worldtimeapi function with moment.js
* Allow comparison of timezones - use choice options

## Setup
To run this project, install it locally using npm:

```
$ npm install
$ node deploy-commands.js
$ npm run start
```

Will require the following in an .env file:
* BOT_TOKEN = Discord bot token
* CLIENTID = Discord bot client ID
* GUILDID = Discord server ID
* APIKEY_TZDB = API key for timezonedb

## Screenshots
![Compare function](/Screenshots/compare.png?raw=true)