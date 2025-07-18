import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    role: 'CANDIDATE', 
    companyName: '',
    companyWebsite: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/auth/register', formData);
      alert("registration succesfull");
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">Register</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full p-3 mb-4 border rounded"
          onChange={handleChange}
          value={formData.username}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded"
          onChange={handleChange}
          value={formData.password}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded"
          onChange={handleChange}
          value={formData.email}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="w-full p-3 mb-4 border rounded"
          onChange={handleChange}
          value={formData.phone}
        />

        <select
          name="role"
          className="w-full p-3 mb-6 border rounded"
          onChange={handleChange}
          value={formData.role}
        >
          <option value="CANDIDATE">Candidate</option>
          <option value="EMPLOYER">Employer</option>
        </select>

        {formData.role === 'EMPLOYER' && (
          <>
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              className="w-full p-3 mb-4 border rounded"
              onChange={handleChange}
              value={formData.companyName}
              required
            />
            <input
              type="text"
              name="companyWebsite"
              placeholder="Company Website"
              className="w-full p-3 mb-6 border rounded"
              onChange={handleChange}
              value={formData.companyWebsite}
              required
            />
          </>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-3 rounded-full hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
