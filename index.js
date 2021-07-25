const mysql = require('mysql');
const express = require('express');

const app = express();
const port = 3000;

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'employeeDB'
});

mysqlConnection.connect((err) => {
    if(!err)
        console.log('DB Connected Successfully!');
    else
        console.log(`DB Connection Failed \n Error ${JSON.stringify(err, undefined, 2)}`);
});

app.get('/employee', (req, res) => {

    // console.log(`res: `, res);
    // console.log(`req: `, req);

    mysqlConnection.query('SELECT * FROM employee', (err, rows, fields) => {
        if(!err)
            console.log(rows);
        else
            console.log(err);
    });
    // res.send('hello');
});

app.listen(port, () => console.log('Express server is running at port no: 3000'));