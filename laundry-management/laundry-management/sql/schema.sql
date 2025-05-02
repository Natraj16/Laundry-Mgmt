CREATE DATABASE IF NOT EXISTS laundry_db;
USE laundry_db;

CREATE TABLE customers (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  address VARCHAR(255),
  contact VARCHAR(20)
);

CREATE TABLE services (
  service_id INT AUTO_INCREMENT PRIMARY KEY,
  service_name VARCHAR(100),
  price DECIMAL(10,2)
);

CREATE TABLE employees (
  employee_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  contact VARCHAR(20),
  services VARCHAR(255)
);

CREATE TABLE orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  service_id INT,
  employee_id INT,
  order_date DATE,
  status VARCHAR(50),
  total_amount DECIMAL(10,2),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  FOREIGN KEY (service_id) REFERENCES services(service_id),
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  total_amount DECIMAL(10,2),
  payment_method VARCHAR(50),
  status VARCHAR(50),
  FOREIGN KEY (order_id) REFERENCES orders(order_id)
);
