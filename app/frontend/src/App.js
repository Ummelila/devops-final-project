import React, { useState } from 'react';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentRoll, setStudentRoll] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleLogin = async () => {
    const res = await fetch('http://32.196.240.94:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, password: formData.password })
    });
    const data = await res.json();
    if (data.token) {
      setLoggedIn(true);
      setUsername(data.username);
      setMessage('');
    } else {
      setMessage(data.error);
    }
  };

  const handleRegister = async () => {
    const res = await fetch('http://32.196.240.94:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    setMessage(data.message || data.error);
    if (data.message) setIsLogin(true);
  };

  const addStudent = () => {
    if (!studentName || !studentEmail || !studentRoll) {
      alert('Please fill all fields!');
      return;
    }
    const newStudent = {
      id: Date.now(),
      name: studentName,
      email: studentEmail,
      roll: studentRoll
    };
    setStudents([...students, newStudent]);
    setStudentName('');
    setStudentEmail('');
    setStudentRoll('');
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  if (loggedIn) {
    return (
      <div className="dashboard">
        <div className="navbar">
          <h2>🎓 Student Management System</h2>
          <div>
            <span>Welcome, {username}! </span>
            <button className="logout-btn" onClick={() => setLoggedIn(false)}>Logout</button>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Add Student Form */}
          <div className="card">
            <h3>➕ Add Student</h3>
            <input
              type="text"
              placeholder="Student Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Student Email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Roll Number"
              value={studentRoll}
              onChange={(e) => setStudentRoll(e.target.value)}
            />
            <button onClick={addStudent}>Add Student</button>
          </div>

          {/* Student List */}
          <div className="card">
            <h3>📋 Student List ({students.length})</h3>
            {students.length === 0 ? (
              <p className="no-data">No students added yet!</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>{student.roll}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>
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
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Student Registration Form </h1>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        {!isLogin && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        {message && <p className="message">{message}</p>}
        <button onClick={isLogin ? handleLogin : handleRegister}>
          {isLogin ? 'Login' : 'Register'}
        </button>
        <p onClick={() => setIsLogin(!isLogin)} className="toggle">
          {isLogin ? 'No account? Register here' : 'Have account? Login here'}
        </p>
      </div>
    </div>
  );
}

export default App;