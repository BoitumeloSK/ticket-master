# Ticket Master

This is a fully functional CRUD ticketing application developed using the node.js express web application framework. The chosen database is MongoDB with the use of the Mongoose ODM.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

You can download the ZIP folder or clone the repository using:

```shell
git clone https://github.com/BoitumeloSK/ticket-master.git
```

To install the apps packages, run:

```shell
npm install
```

## Usage

- This application was built for MongoDB use. Get your database connection string from MongoDBCompass or MongoDB Atlas and add it to the `index.js` file. It can be inputted at `mongoose.connect("your connection string")`
- In the .env file, add a value for `SECRET` which is your **jsonwebtoken** secret key.
- To seed the database, run the following command:

```shell
npm run seed
```

- In the terminal run the following command to initialise the database and run the server:

```shell
npm start
```

You may now perform the CRUD functionality using an API platform like Postman.

## License

Licensed under the MIT license.
