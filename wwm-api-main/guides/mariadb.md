# Maria DB Guide

# .env file

To setup the connection to your local mariadb instance you need to create a `.env` in the project's root directory with the following content:

```Properties
DB_HOST=localhost
DB_USER=your-username
DB_PASS=your-password
DB_PORT=3306
```

Replace `your-username` and `your-password` with your configured username and password.

# Getting the connection inside a controller

This is the basic structure of every controller:

```js
const ControllerBase = require("./ControllerBase");

class YourController extends ControllerBase {
    async yourMethod(){
        const connection = await this.getConnection();
        ....
        connection.release();
    }
}
```

Inside the controller you can get the connection to the wwm database by executing `await this.getConnection()`. Don't forget to release the connection after you have queried your stuff.

# SELECT statements

```js
const res = await connection.query("SELECT * FROM animals");
// res : [
//    { id: 1, name: 'sea lions' },
//    { id: 2, name: 'bird' },
// ]
```

# INSERT, DELETE, UPDATE statements

```js
const res = await connection.query(
	"INSERT INTO persons (surname, lastname) VALUES (?, ?)",
	["Jim", "Knopf"]
);
// res : { affectedRows: 1, insertId: 1, warningStatus: 0 }
```

## Explicitly using a prepared statement

```js
const res = await connection.prepare(
	"INSERT INTO persons (surname, lastname) VALUES (?, ?)"
);
const res = await prepare.execute(["Jim", "Knopf"]);
// res : { affectedRows: 1, insertId: 1, warningStatus: 0 }
```
