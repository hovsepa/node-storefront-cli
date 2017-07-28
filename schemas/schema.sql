DROP DATABASE IF EXISTS storefront;
CREATE DATABASE storefront;
USE storefront;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT UNIQUE,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Honey Bunches of Oats", "Breakfast", "3.49", 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Honey Nut Cheerios", "Breakfast", "3.99", 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Fettechini Pasta", "Grains", "1.49", 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Tuna", "Fish", "1.49", 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pistacios", "Nuts", "6.99", 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Greek Yogurt", "Dairy", "1.49", 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cheese", "Dairy", "3.99", 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bagette", "Grains", "2.50", 8);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pasta Sauce", "Sauces", "3.99", 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cheesecake", "Dessert", "8.99", 5);

-- SELECT * FROM products WHERE item_id = '1' AND stock_quantity >=1

  
--   item_id (unique id for each product)
-- product_name (Name of product)
-- department_name
-- price (cost to customer)
-- stock_quantity (how much of the product is available in stores)
-- SELECT * FROM top5000;

-- SELECT 
--     top_albums.artist,
--     top5000.song,
--     top5000.year,
--     top_albums.year,
--     top_albums.album
-- FROM
--     top_albums
--         INNER JOIN
--     top5000 ON top_albums.year = top5000.year
--         AND top_albums.artist = top5000.artist
-- -- WHERE
-- -- 	top_albums.artist = "The Beatles"
-- ORDER BY top_albums.year;