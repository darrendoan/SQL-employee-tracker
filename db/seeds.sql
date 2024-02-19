INSERT INTO departments (department_id, department_name)
VALUES 
(1, 'Software Engineer'),
(2, 'Registered Nurse'),
(3, 'Human Resources'),
(4, 'Financial Analyst'),
(5, 'Engineering'),
(6, 'Information Technology'),
(7, 'Customer Relations'),
(8, 'Research and Development'),
(9, 'Legal'),
(10, 'Maintenance');

INSERT INTO roles (title, salary, department_id)
VALUES 

('Full Stack Developer', 110000.00, 1),
('Intensive Care Unit (ICU) Nurse', 98000.00, 2),
('HR Director', 189000.00, 3),
('Finance Head', 145000.00, 4),
('Senior Engineer', 185000.00, 5),
('IT Manager', 125000.00, 6),
('Customer Relations Manager', 75000.00, 7),
('Research and Development Manager ', 185000.00, 8),
('Legal Manager', 95000.00, 9),
('Maintenance Manager', 135000.00, 10),
("Director", 150500.50, 11),
("Manager", 120000.50, 12),
;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Olivia', 'Smith', 1, 1),
('Ethan', 'Johnson', 2, 2),
('Sohia', 'Brown', 3, 3),
('Liam', 'Davis', 4, 4),
('Isabella ', 'Martinez', 5, 5),
('Noah ', 'Hanks', 6, 6),
('Tom', 'Anderson', 7, 7),
('Mason ', 'Ford', 8, 8),
('Thomas', 'Clark', 9, 9),
('William ', 'Taylor', 10, 10);