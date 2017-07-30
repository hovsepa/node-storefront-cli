const mysql = require('mysql');
const Table = require('easy-table')
const inquirer = require('inquirer');
const chalk = require('chalk');
const db = require('./connection');
const connection = db.connection;

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    askManager();
});

let askManager = () => {
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What are you looking to do?',
        choices: [
            'View products for sale',
            'View low inventory',
            'Add to inventory',
            'Add new product'
        ]
    }).then(function (answers) {
        // console.log(answers);
        var managerResponse = answers.action;
        switch (answers.action) {
            case "View products for sale":
                printAll();
                break;
            case "View low inventory":
                viewLowInventory();
                break;
            case "Add to inventory":
                addInventory();
                break;
            case "Add new product":
                addNewProduct();
                break;
            default:
                break;
        }
    });

}

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
        askManager();
    });
}

let viewLowInventory = () => {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5",
        function (err, res) {
            // console.log(res);
            if (res.length === 0) {
                console.log("All items stocked.");
            } else if (res.length > 0) {
                console.log("You're running low on these items:");
                res.forEach(function (element) {
                    console.log(chalk.red(element.product_name), "currently", chalk.red(element.stock_quantity), "in stock");
                });
            }
            askManager();
        });
}

let addInventory = () => {
    connection.query("SELECT * from products ORDER BY stock_quantity ASC",
        function (err, res) {
            var items = [];
            res.forEach(function (item) {
                items.push(item.product_name);
            })
            inquirer.prompt([{
                type: "list",
                name: "reorder",
                message: "Which item would you like to reorder?",
                choices: items
            }, {
                type: "input",
                name: "quantity",
                message: "How many would you like to order?",
                validate: function (value) {
                    var valid = !isNaN(parseFloat(value));
                    return valid || 'Please enter a number';
                },
                filter: Number
            }]).then(function (answers) {
                console.log(answers);
                connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_name = ?", [answers.quantity, answers.reorder],
                    function (err, res) {
                        console.log(chalk.green("\n" + answers.reorder, "+" + answers.quantity), chalk.yellow("\nThank you for your order!"));
                        setTimeout(() => {
                            printAll();
                        }, 1000);
                    });
            });
        });
}

let addNewProduct = () => {
    inquirer.prompt([{
        type: "input",
        name: "product_name",
        message: "Please input item's name."
    }, {
        type: "input",
        name: "department_name",
        message: "Please indicate department."
    }, {
        type: "input",
        name: "price",
        message: "Indicate price.",
        validate: function (value) {
            var valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
        },
        filter: Number
    }, {
        type: "input",
        name: "stock_quantity",
        message: "How many are you adding to stock?",
        validate: function (value) {
            var valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
        },
        filter: Number
    }]).then(function (answers) {
        console.log(answers);
        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", [answers.product_name, answers.department_name, answers.price, answers.stock_quantity]);

        console.log(chalk.green("Added:", answers.product_name, answers.department_name, answers.price, answers.stock_quantity));
        
        setTimeout(() => {
            printAll();
        }, 1200);
    });
}