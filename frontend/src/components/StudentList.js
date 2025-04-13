import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:8080/students");
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => { 
    fetchStudents(); 
  }, []);

  const addStudent = async () => {
    try {
      await axios.post("http://localhost:8080/add", { firstName, lastName, email });
      fetchStudents();
      resetForm();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const updateStudent = async () => {
    if (!selectedStudent) return;
    
    try {
      await axios.post("http://localhost:8080/update", { 
        id: selectedStudent, 
        firstName, 
        lastName, 
        email 
      });
      fetchStudents();
      resetForm();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.post("http://localhost:8080/delete", { id });
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setSelectedStudent(null);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student.id);
    setFirstName(student.firstName);
    setLastName(student.lastName);
    setEmail(student.email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStudent) {
      updateStudent();
    } else {
      addStudent();
    }
  };

  return (
    <div className="container">
      <h1>List Students</h1>
      
      <div className="form-container">
        <h2>{selectedStudent ? 'Update Student' : 'Add Student'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-buttons">
            <button type="submit">
              {selectedStudent ? 'Update' : 'Add'} Student
            </button>
            {selectedStudent && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
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
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>{student.email}</td>
              <td className="actions-cell">
                <button 
                  className="update-btn" 
                  onClick={() => handleEdit(student)}
                >
                  Update
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => deleteStudent(student.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;