# GrowlyX-CoreAPI

Admin docs
===========
Config(config/config.json): 
Database -> Enter your MongoDB credits to login.
Webserver -> 
	port: port to run the web server on.
	limit: Limit of request that can be done in 1 minute.
**You might need to run the program once for it to generate a config.
**You will want to restart the api after doing changes for better results.

Installation:
-------------
You’ll need NodeJS(Latest or recommended version) and npm
Run `npm install --only=prod` to install are required packages necessary for the application.

Starting:
---------
Simply run the command `node src/index.js` and it should start the web server.

Request limitations:
--------------------
All IPs by default are limited to 10(configurable) requests per minute, you may remove the limit for everyone by setting it to -1.
There is also a whitelist (config/whitelist.json) which allows an IP to bypass the request limit.
The blacklist fil (config.blacklist.json) is a file that allows you to block an IP address from using the API.

User docs:
==========

Player infos
------------

To access informations about a certain player, you can get its profile by 2 different ways, by their UUID or name.

**Example:

<url>/player?name=Notch

<url>/player?uuid=069a79f4-44e9-4726-a5be-fca90e38aaf5

Both will work to pull up the same informations if existant from the database.

Leaderboards
------------

The other feature of this api is leaderboards, you can get the top players of certain categories. Define them by the “cat” query.
Available categories:
- Karma
- Coins

You can also decide if you want the most, or the less of each value by using the query “order”. “Up” being the most, and “down” being the less.

You can also decide the amount of people’s stats do you need to pull by the query “count”, the max being 50.

**Example:

Here in our first case we want to pull the 15 players with the most coins, the request would then be:
<url>/leaderboards?category=coins&order=up&count=15
