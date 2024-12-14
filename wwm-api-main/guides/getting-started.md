# Getting started

This guide explains how to setup your computer to start the backend api server.

## 0.) Software Requirements

You need [nodejs](https://nodejs.org/en) (recommended version is v20 LTS) and the [mariadb community server](https://mariadb.com/downloads/).

## 1.) Clone this repository

First you need to clone this repository via github desktop or by running `git clone https://github.com/SWE-Team404/wwm-api.git`.

## 2.) Install npm dependencies

Open your terminal inside the repository's root folder and run `npm install`. If you installed _nodejs_ correctly this command will automatically install all the project's
dependencies. This may take a while.

## 3.) Create a .env file

_.env_ files are used to store device/environment specific variables that configure the behaviour of our application. Inside the repository's root folder
create a _.env_ file and paste the following code:

```env
DB_HOST=localhost
DB_USER=your-username # replace with your database username
DB_PASS=your-password # replace with your database password
DB_PORT=3306
DROP_DATABASE_AT_START=true
INSERT_BASIC_QUESTIONS=true
INSERT_RANDOM_USERS=true
```

With the variable `DROP_DATABASE_AT_START` you configure if the wwm database is dropped and recreated on every startup (this will delete all your registered users and new questions).
With the variable `INSERT_BASIC_QUESTIONS` you configure if the wwm database is filled with default questions on every startup.
With the variable `INSERT_RANDOM_USERS` you configure if the wwm database is filled with random users on every startup.

## 4.) Start the server

To start the backend server run `npm start`.

### Default accounts

By default following accounts are created:

-   _admin_admin_ (_admin@admin.com_) with password _admin123_ [admin rights]
-   _user_user_ (_user@user.com_) with password _user123_ [player rights]
