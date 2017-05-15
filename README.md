Game of Chess : Age of AI
============================
An AI based chess game built on top of Node.js and Vue.js

## Feature:
- Pure frontend player v.s AI using HTML5 webworker if no backend servers are connected
- Code written using async, await and promise
- Store AI-chosen moves to backend web servers through websocket
- Backend can scale to arbitary number of servers, similar to redis cluster
- Backend has ability to let AI perform self-play itself, thus keep "learning" on the best moves


## Running the Game
To run the game, you should first [Install Node.js 7.x](https://nodejs.org/en/)
and also Nginx

After that, just do:

```sh
sh install.sh
sh run_demo.sh
```
Now go to localhost, you should be able to see the game running.

To stop the game servers, just do:
```sh
sh stop.sh
```
