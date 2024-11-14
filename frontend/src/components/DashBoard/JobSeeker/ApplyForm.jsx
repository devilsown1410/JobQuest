import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from '../../../utils/axios'; // Corrected import path

const ApplyForm = () => {
  const { jobId } = useParams();
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user._id;

    const formData = new FormData();
    formData.append('jobId', jobId);
    formData.append('userId', userId);
    formData.append('message', message);
    if (resume) {
      formData.append('resume', resume);
    }

    try {
      const response = await axios.post('http://localhost:3000/api/user/apply', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to apply for job');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-200 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl text-center mb-4 text-gray-800">Apply for Job</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-bold text-gray-700">Resume</label>
            <input
              type="file"
              onChange={handleResumeChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-bold text-gray-700">Message</label>
            <textarea
              value={message}
              onChange={handleMessageChange}
              className="w-full p-2 border border-gray-300 rounded-md resize-none"
              rows="4"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition duration-200"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyForm;