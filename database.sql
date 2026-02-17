
CREATE DATABASE hrms;
USE hrms;

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    dob DATE,
    gender VARCHAR(20),
    employment_type VARCHAR(50),
    joining_date DATE,
    status VARCHAR(50) DEFAULT 'Active'
);

CREATE TABLE apron_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    apron_number VARCHAR(50),
    locker_number VARCHAR(50),
    total_aprons INT,
    wash_days VARCHAR(100)
);

CREATE TABLE apron_wash_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    wash_date DATE,
    returned BOOLEAN DEFAULT FALSE,
    return_date DATE
);
