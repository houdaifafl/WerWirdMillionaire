# Getting started
This guide explains how to setup your computer to start the frontend server.

## 0.) Software Requirements

You need [nodejs](https://nodejs.org/en) (recommended version is v20 LTS) and the [mariadb community server](https://mariadb.com/downloads/).

## 1.) Clone this repository

First you need to clone this repository via github desktop or by running `git clone https://github.com/SWE-Team404/wwm-gui.git`.

## 2.) Install npm dependencies

Open your terminal inside the repository's root folder and run `npm install`. If you installed _nodejs_ correctly this command will automatically install all the project's
dependencies. This may take a while.

## 3.) Specify the backend server ip address
Edit the file `next.config.js`. Replace `localhost` with your backend server's ip adress. 

## 4.) Build the website
Before starting the server we need to build the website using `npm run build`.

## 5.) Start the server
To start the frontend server run `npm start`. Make sure that the [backend server](https://github.com/SWE-Team404/wwm-api) is already running!
