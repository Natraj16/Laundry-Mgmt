USE laundry_db;

INSERT INTO services (service_name, price) VALUES
('Washing', 50.00),
('Dry Cleaning', 100.00),
('Ironing', 30.00);

INSERT INTO employees (name, contact, services) VALUES
('Alice Smith', '1234567890', 'Washing,Dry Cleaning'),
('Bob Johnson', '0987654321', 'Ironing');
