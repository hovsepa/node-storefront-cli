const mysql = require('mysql');
const Table = require('easy-table');
const inquirer = require('inquirer');
const chalk = require('chalk');
const db = require('./connection');
const connection = db.connection;

connection.connect(function (err) {
    if (err) throw err;
    printAll();
});

let printAll = () => {
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

let askCustomer = () => {
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
        updateQuantity(answers);
    });
}

let updateQuantity = (answers) => {
    connection.query("SELECT * FROM products WHERE item_id = " + answers.item_number + " AND stock_quantity >=" + answers.quantity,
        function (err, res) {
            var respMessage = "";
            if (res.length === 0) {
                respMessage = "Insufficient quantity!";
            } else if (res.length > 0) {
                console.log("Updating quantities...\n");
                var query = connection.query(
                    "UPDATE products SET stock_quantity = stock_quantity -" + answers.quantity + " WHERE item_id = " + answers.item_number,
                    function (err, res) {
                        respMessage = "Thank you for your purchase!"
                    }
                );
            }
            setTimeout(function () {
                printAll()
            }, 1000);
            console.log(chalk.yellow(respMessage));
        });
}