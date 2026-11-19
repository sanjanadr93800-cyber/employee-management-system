import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: "",
    joining_date: "",
    status: "Active"
  });

  const [editingId, setEditingId] = useState(null);

  // Search text
  const [searchTerm, setSearchTerm] = useState("");

  // Get employees
  const fetchEmployees = () => {
    fetch("http://localhost:5000/api/employees")
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Dashboard statistics
  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === "Inactive"
  ).length;

  // Search employees
  const filteredEmployees = employees.filter((employee) => {
    const search = searchTerm.toLowerCase();

    return (
      employee.employee_id?.toLowerCase().includes(search) ||
      employee.name?.toLowerCase().includes(search) ||
      employee.email?.toLowerCase().includes(search) ||
      employee.department?.toLowerCase().includes(search)
    );
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Add or Update employee
  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:5000/api/employees/${editingId}`
      : "http://localhost:5000/api/employees";

    const method = editingId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);

        setFormData({
          employee_id: "",
          name: "",
          email: "",
          phone: "",
          department: "",
          designation: "",
          salary: "",
          joining_date: "",
          status: "Active"
        });

        setEditingId(null);

        fetchEmployees();
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  // Edit employee
  const handleEdit = (employee) => {
    setEditingId(employee.id);

    setFormData({
      employee_id: employee.employee_id,
      name: employee.name,
      email: employee.email,
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
      salary: employee.salary || "",
      joining_date: employee.joining_date
        ? employee.joining_date.substring(0, 10)
        : "",
      status: employee.status || "Active"
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Delete employee
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) {
      return;
    }

    fetch(`http://localhost:5000/api/employees/${id}`, {
      method: "DELETE"
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        fetchEmployees();
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);

    setFormData({
      employee_id: "",
      name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      salary: "",
      joining_date: "",
      status: "Active"
    });
  };

  return (
    <div className="container">

      {/* Header */}
      <div className="header">
        <h1>Employee Management System</h1>
        <p>Manage employees efficiently and easily</p>
      </div>

      {/* Dashboard Cards */}
      <div className="dashboard-cards">

        <div className="summary-card">
          <div className="card-icon">👥</div>

          <div>
            <h3>Total Employees</h3>
            <p>{totalEmployees}</p>
          </div>
        </div>

        <div className="summary-card active-card">
          <div className="card-icon">✅</div>

          <div>
            <h3>Active Employees</h3>
            <p>{activeEmployees}</p>
          </div>
        </div>

        <div className="summary-card inactive-card">
          <div className="card-icon">❌</div>

          <div>
            <h3>Inactive Employees</h3>
            <p>{inactiveEmployees}</p>
          </div>
        </div>

      </div>

      {/* Add / Edit Employee */}
      <div className="form-card">

        <h2>
          {editingId ? "Edit Employee" : "Add Employee"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <input
              type="text"
              name="employee_id"
              placeholder="Employee ID"
              value={formData.employee_id}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="name"
              placeholder="Employee Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
            />

            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={formData.designation}
              onChange={handleChange}
            />

            <input
              type="number"
              name="salary"
              placeholder="Salary"
              value={formData.salary}
              onChange={handleChange}
            />

            <input
              type="date"
              name="joining_date"
              value={formData.joining_date}
              onChange={handleChange}
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

          </div>

          <button className="add-button" type="submit">
            {editingId ? "Update Employee" : "+ Add Employee"}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}

        </form>
      </div>

      {/* Employee List */}
      <div className="employee-section">

        <div className="employee-header">

          <div>
            <h2>Employee List</h2>
            <p className="employee-count">
              Showing {filteredEmployees.length} of {totalEmployees} employees
            </p>
          </div>

          {/* Search Box */}
          <div className="search-box">

            <span className="search-icon">🔍</span>

            <input
              type="text"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}

          </div>

        </div>

        {filteredEmployees.length === 0 ? (

          <div className="no-results">
            <div className="no-results-icon">🔍</div>

            <h3>No employees found</h3>

            <p>
              Try searching with another name, ID, email, or department.
            </p>
          </div>

        ) : (

          <div className="table-container">

            <table className="employee-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredEmployees.map((employee) => (

                  <tr key={employee.id}>

                    <td>
                      <span className="employee-id">
                        {employee.employee_id}
                      </span>
                    </td>

                    <td className="employee-name">
                      {employee.name}
                    </td>

                    <td>{employee.email}</td>

                    <td>{employee.department}</td>

                    <td>{employee.designation}</td>

                    <td>
                      ₹{employee.salary}
                    </td>

                    <td>

                      <span
                        className={
                          employee.status === "Active"
                            ? "status-badge status-active"
                            : "status-badge status-inactive"
                        }
                      >
                        {employee.status}
                      </span>

                    </td>

                    <td>

                      <button
                        className="edit-button"
                        onClick={() => handleEdit(employee)}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => handleDelete(employee.id)}
                      >
                        🗑️ Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default App;