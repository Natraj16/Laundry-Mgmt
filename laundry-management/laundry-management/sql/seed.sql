USE laundry_db;

INSERT INTO services (service_name, price) VALUES 
('Washing', 50.00),
('Dry Cleaning', 100.00),
('Ironing', 30.00);

INSERT INTO employees (employee_id, name, contact, service) VALUES
('EMP001', 'Alice', '1234567890', 'Washing'),
('EMP002', 'Bob', '9876543210', 'Dry Cleaning'),
('EMP003', 'Charlie', '5551234567', 'Ironing');
