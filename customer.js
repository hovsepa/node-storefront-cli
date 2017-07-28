var mysql = require('mysql');
var Table = require('easy-table')
var inquirer = require('inquirer');
var db = require('./connection');
var connection = db.connection;

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
});

var printAll = function () {
    connection.query('SELECT * FROM products order by item_id ASC', function (error, results, fields) {
        if (error) throw error;
        console.log(
            Table.print(results, {
                item_id: {
                    name: 'ID'
                },
                product_name: {
                    name: 'Product Name'
                },
                department_name: {
                    name: 'Department Name'
                },
                price: {
                    name: "Price"
                },
                stock_quantity: {
                    name: "Quantity"
                }
            })
        );
        askCustomer();
    });
}

var askCustomer = function () {
    inquirer.prompt([{
        type: 'input',
        name: 'item_number',
        message: 'Please type the ID of the product you would like to purchase.',
        validate: function (value) {
            var valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
        },
        filter: Number
    }, {
        type: 'input',
        name: 'quantity',
        message: 'How many do you need?',
        validate: function (value) {
            var valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
        },
        filter: Number
    }, ]).then(function (answers) {
        console.log(answers);
        updateQuantity(answers);
    });
}

var updateQuantity = function (answers) {
    connection.query("SELECT * FROM products WHERE item_id = " + answers.item_number + " AND stock_quantity >=" + answers.quantity,
        function (err, res) {
            console.log(res);
            var respMessage = "";
            if (res.length === 0) {
                respMessage = "Insufficient quantity!";
                // askCustomer();
            } else if (res.length > 0) {
                console.log("Updating quantities...\n");
                var query = connection.query(
                    "UPDATE products SET stock_quantity = stock_quantity -" + answers.quantity + " WHERE item_id = " + answers.item_number,
                    function (err, res) {
                        // console.log(res.affectedRows + " products updated!\n");
                        respMessage = "Thank you for your purchase!"
                    }
                );
                // logs the query being run
                // console.log(query.sql);
            }
            printAll();
            console.log(respMessage);
        });
}

printAll();