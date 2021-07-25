const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'employeeDB',
    multipleStatements:true
});

mysqlConnection.connect((err) => {
    if(!err)
        console.log('DB Connected Successfully!');
    else
        console.log(`DB Connection Failed \n Error ${JSON.stringify(err, undefined, 2)}`);
});

app.listen(port, () => console.log('Express server is running at port no: 3000'));

// Get all employees
app.get(
    '/employees', 
    (req, res) => {
        mysqlConnection.query(
            'SELECT * FROM employee', 
            (err, rows, fields) => {
                if(!err)
                    res.send(rows);
                else
                    console.log(err);
            }
        );    
    }
);

//Get an employee
app.get(
    '/employee/:id', 
    (req, res) => {    
        mysqlConnection.query(
            'SELECT * FROM employee WHERE EmpID = ?', 
            [req.params.id], 
            (err, rows, fields) => {
                if(!err)
                    res.send(rows);
                else
                    console.log(err);
            }
        );        
    }
);

//Delete an employee
app.delete(
    '/employee/delete/:id', 
    (req, res) => {    
        mysqlConnection.query(
            'DELETE FROM employee WHERE EmpID = ?', 
            [req.params.id], 
            (err, rows, fields) => {
                if(!err)
                    res.send('Employee deleted successfully!');
                else
                    console.log(err);
            }
        );        
    }
);

//Insert an employee
app.use(express.json());
app.post(
    '/employee/insert', 
    (req, res) => {  
        let emp = req.body; 
        console.log('emp: ', emp) ;

        var sql = "SET @EmpID = ?; SET @Name = ?; SET @EmpCode = ?; \
        SET @Salary = ?; CALL EmployeeAddOrEdit(@EmpID, @Name, @EmpCode, @Salary);";

        mysqlConnection.query(
            sql, 
            [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], 
            (err, rows, fields) => {
                if(!err)
                    rows.forEach(element => {
                        if(element.constructor == Array)
                            res.send(`Inserted employee ID: ${element[0].EmpID}`);
                    });                    
                else
                    console.log(err);
            }
        );        
    }
);