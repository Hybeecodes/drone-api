# Drones API

## Requirements

For development, you will only need Node.js, a node global package, npm  and MySQL installed in your development environment.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Node installation on macOS

  You can install nodejs and npm easily with brew install, just run the following commands.

      $ brew install node

### MySQL
- ### Installation

  Visit [MySQL official documentation](https://dev.mysql.com/doc/mysql-installer/en/) for installation guide.

## Clone

    $ git clone https://github.com/Hybeecodes/drone-api.git 
    $ cd drone-api

## Configure app
- Create a ```.env``` file
- Copy the contents of ```.env.sample``` into the ```.env``` file
- You can replace the database credentials if necessary
- Create the database on your local MySQL instance
- Run the ````setup.sh```` file in the project root. \
  If you got a permission error, please run ```chmod +x setup.sh``` to change permission, then try again.\
  The ```setup.sh``` file does the following:

    - Installs project Dependencies
    - Runs the Project Build
    - Runs the Database Migration
    - Seeds Demo Data into the database


## Assumption
- No Authentication is required (Although, in a real world scenario, authentication would be required [JWT, OAuth, etc])
- Medications are being stored in the database at the point of loading a drone


## Run app

- Run ```npm start``` to start the app (app runs on PORT 8081 by default).
- Run ```npm test``` to run test.
- [Published Postman Collection URL](https://documenter.getpostman.com/view/2687229/Uz5MFtwV)

## Feedback on Assessment
The Assessment was a very good one.


