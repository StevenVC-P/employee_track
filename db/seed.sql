USE employee_db;
INSERT INTO departments(department_name)
VALUES
('Accounting'),
('Human Resources'),
('Marketing'),
('Executives');

INSERT INTO roles(title, salary, department_id)
VALUES
('Accounting Manager', 80000, 1),
('Accountant II', 65000, 1),
('Accountant I', 60000, 1),
('HR Manager', 75000, 2),
('Payroll Clerk', 50000, 2),
('Mrk Director', 100000, 3),
('Mrk Designer II', 75000, 3),
('CEO', 120000, 4);

INSERT INTO employees(first_name, last_name, manager, role_id)
VALUES
('Scott', 'Madson', 1, 1),
('Brad', 'Nelson', 0, 2),
('Lisa', 'Trout', 0, 3),
('Mathew', 'Alley', 1, 4),
('Linda', 'Ferestad', 0, 5),
('Chelsea', 'Volna', 1, 6),
('Mike', 'Fretz', 0, 7),
('Steven', 'VanCourt', 1, 8);

UPDATE employees SET manager_id = 8 Where id = 1;
UPDATE employees SET manager_id = 1 Where id = 2;
UPDATE employees SET manager_id = 1 Where id = 3;
UPDATE employees SET manager_id = 8 Where id = 4;
UPDATE employees SET manager_id = 4 Where id = 5;
UPDATE employees SET manager_id = 8 Where id = 6;
UPDATE employees SET manager_id = 6 Where id = 7;
UPDATE employees SET manager_id = 8 Where id = 8;