CREATE DATABASE IF NOT EXISTS laundry_db;
USE laundry_db;

CREATE TABLE customers (
  customer_id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  contact VARCHAR(20) NOT NULL
);

CREATE TABLE services (
  service_id INT PRIMARY KEY AUTO_INCREMENT,
  service_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE employees (
  employee_id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  service VARCHAR(100)
);

CREATE TABLE orders (
  order_id VARCHAR(20) PRIMARY KEY,
  customer_id VARCHAR(20),
  service_id INT,
  employee_id VARCHAR(20),
  total_amount DECIMAL(10,2),
  order_date DATETIME,
  status VARCHAR(50),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  FOREIGN KEY (service_id) REFERENCES services(service_id),
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE payments (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id VARCHAR(20),
  total_amount DECIMAL(10,2),
  method VARCHAR(50),
  status VARCHAR(20),
  FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-------------------------------------------------------------------------------------
Triggers


CREATE TABLE IF NOT EXISTS customer_log (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id VARCHAR(20),
  action VARCHAR(100),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //

CREATE TRIGGER after_customer_insert
AFTER INSERT ON customers
FOR EACH ROW
BEGIN
  INSERT INTO customer_log (customer_id, action)
  VALUES (NEW.customer_id, 'Customer Registered');
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER before_order_insert
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
  IF NEW.status IS NULL THEN
    SET NEW.status = 'Pending';
  END IF;

  IF NEW.order_date IS NULL THEN
    SET NEW.order_date = NOW();
  END IF;
END //

DELIMITER ;


DELIMITER //

CREATE TRIGGER after_payment_insert
AFTER INSERT ON payments
FOR EACH ROW
BEGIN
  UPDATE orders
  SET status = 'Paid'
  WHERE order_id = NEW.order_id;
END //

DELIMITER ;


CREATE TABLE IF NOT EXISTS employee_assignment_log (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(20),
  order_id VARCHAR(20),
  assigned_on DATETIME DEFAULT CURRENT_TIMESTAMP
);
DELIMITER //

CREATE TRIGGER after_order_assignment
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
  INSERT INTO employee_assignment_log (employee_id, order_id)
  VALUES (NEW.employee_id, NEW.order_id);
END //

DELIMITER ;
