const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Employee Management System Backend is Running!");
});

// Get all employees
app.get("/api/employees", (req, res) => {
    const sql = "SELECT * FROM employees";

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json(results);
    });
});

// Add an employee
app.post("/api/employees", (req, res) => {
    const {
        employee_id,
        name,
        email,
        phone,
        department,
        designation,
        salary,
        joining_date,
        status
    } = req.body;

    const sql = `
        INSERT INTO employees
        (employee_id, name, email, phone, department, designation, salary, joining_date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        employee_id,
        name,
        email,
        phone,
        department,
        designation,
        salary,
        joining_date,
        status
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Failed to add employee"
            });
        }

        res.status(201).json({
            message: "Employee added successfully",
            employeeId: result.insertId
        });
    });
});

// Update an employee
app.put("/api/employees/:id", (req, res) => {
    const { id } = req.params;

    const {
        employee_id,
        name,
        email,
        phone,
        department,
        designation,
        salary,
        joining_date,
        status
    } = req.body;

    const sql = `
        UPDATE employees
        SET employee_id = ?,
            name = ?,
            email = ?,
            phone = ?,
            department = ?,
            designation = ?,
            salary = ?,
            joining_date = ?,
            status = ?
        WHERE id = ?
    `;

    const values = [
        employee_id,
        name,
        email,
        phone,
        department,
        designation,
        salary,
        joining_date,
        status,
        id
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Failed to update employee"
            });
        }

        res.json({
            message: "Employee updated successfully"
        });
    });
});

// Delete an employee
app.delete("/api/employees/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM employees WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Failed to delete employee"
            });
        }

        res.json({
            message: "Employee deleted successfully"
        });
    });
});

// Start server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});