import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import Navbar from '../components/Navbar';
import { JobCategories, JobLocations } from '../assets/assets';
import api from '../api/api'; 

const AddJob = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Bangalore');
  const [category, setCategory] = useState('programming');
  const [level, setLevel] = useState('beginner Level');
  const [salary, setSalary] = useState(0);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
  }, []);

  const handleAddJob = async (e) => {
    e.preventDefault();
    const description = quillRef.current.root.innerHTML;

    if (!title || !description || !category || !location || !level || !salary) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await api.post('/employer/jobs', {
        title,
        description,
        category,
        location,
        level,
        salary,
      });

      alert("Job added successfully!");
      
    } catch (err) {
      console.error("Error adding job:", err);
      alert("Failed to add job.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <form onSubmit={handleAddJob}
        className="p-6 flex flex-col w-full max-w-3xl bg-white rounded-lg shadow-md items-start gap-4">
          <div className="w-full">
            <p className="mb-2 font-medium">Job Title</p>
            <input
              type="text"
              placeholder="Type here"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            />
          </div>

          <div className="w-full">
            <p className="my-2 font-medium">Job Description</p>
            <div ref={editorRef} className="bg-white h-40 border border-gray-300 rounded p-2" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex-1">
              <p className="mb-2 font-medium">Job Category</p>
              <select
                className="w-full px-3 py-2 border-2 border-gray-300 rounded"
                onChange={(e) => setCategory(e.target.value)}
              >
                {JobCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <p className="mb-2 font-medium">Job Location</p>
              <select
                className="w-full px-3 py-2 border-2 border-gray-300 rounded"
                onChange={(e) => setLocation(e.target.value)}
              >
                {JobLocations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <p className="mb-2 font-medium">Job Level</p>
              <select
                className="w-full px-3 py-2 border-2 border-gray-300 rounded"
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="Beginner level">Beginner level</option>
                <option value="Intermediate level">Intermediate level</option>
                <option value="Advanced level">Advanced level</option>
              </select>
            </div>
          </div>

          <div className="w-full">
            <p className="mb-2 font-medium">Job Salary</p>
            <input
              min={0}
              type="number"
              placeholder="2500"
              className="w-full sm:w-[120px] px-3 py-2 border-2 border-gray-300 rounded"
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-28 py-2 mt-4 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            ADD
          </button>
        </form>
      </div>
    </>
  )
}

export default AddJob
