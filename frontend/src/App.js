import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch students from the backend
  const fetchStudents = () => {
    fetch("http://localhost:8080/students")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students: ", err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add a new student
  const addStudent = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email })
    })
      .then((response) => response.text())
      .then(() => {
        fetchStudents();
        resetForm();
      })
      .catch((err) => console.error("Error adding student: ", err));
  };

  // Update a student
  const updateStudent = () => {
    fetch("http://localhost:8080/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        id: selectedStudent, 
        firstName: firstName, 
        lastName: lastName, 
        email: email 
      })
    })
      .then((response) => response.text())
      .then(() => {
        fetchStudents();
        resetForm();
      })
      .catch((err) => console.error("Error updating student: ", err));
  };

  // Delete a student
  const deleteStudent = (studentId) => {
    fetch("http://localhost:8080/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: studentId })
    })
      .then((response) => response.text())
      .then(() => {
        fetchStudents();
      })
      .catch((err) => console.error("Error deleting student: ", err));
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setSelectedStudent(null);
    document.getElementById('addStudentForm').style.display = 'none';
  };

  const handleUpdate = (student) => {
    setSelectedStudent(student.id);
    setFirstName(student.firstName);
    setLastName(student.lastName);
    setEmail(student.email);
    document.getElementById('addStudentForm').style.display = 'block';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStudent) {
      updateStudent();
    } else {
      addStudent(e);
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <a href="/" className="navbar-brand">Student Management System</a>
      </nav>

      <div className="container">
        <h1>List Students</h1>
        
        <button className="add-button" onClick={() => {
          resetForm();
          document.getElementById('addStudentForm').style.display = 'block';
        }}>
          Add Student
        </button>

        <div id="addStudentForm" style={{display: 'none'}} className="form-container">
          <h2>{selectedStudent ? 'Update Student' : 'Add Student'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit">{selectedStudent ? 'Update' : 'Add'} Student</button>
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>

        <table className="students-table">
          <thead>
            <tr>
              <th>Student First Name</th>
              <th>Student Last Name</th>
              <th>Student Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.email}</td>
                <td className="actions-cell">
                  <button className="update-btn" onClick={() => handleUpdate(student)}>
                    Update
                  </button>
                  <button className="delete-btn" onClick={() => deleteStudent(student.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;