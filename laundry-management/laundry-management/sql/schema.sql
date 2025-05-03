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
  payment_id VARCHAR(20) PRIMARY KEY,
  order_id VARCHAR(20),
  total_amount DECIMAL(10,2),
  method VARCHAR(50),
  status VARCHAR(20),
  FOREIGN KEY (order_id) REFERENCES orders(order_id)
);