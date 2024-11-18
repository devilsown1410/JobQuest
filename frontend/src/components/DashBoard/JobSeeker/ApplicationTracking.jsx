import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axios';

const ApplicationTracking = ()=>{
  const [applications, setApplications] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(()=>{
    const fetchApplications = async()=>{
      try{
        const response = await axios.get(`http://localhost:3000/api/user/applications?userId=${user._id}`);
        setApplications(response.data.responses);
      }catch(error){
        console.error('Error fetching applications:', error);
      }
    };
    fetchApplications();
  }, [user._id]);

  return(
    <div className="p-5 bg-gray-200">
      <h2 className="text-2xl text-center mb-5 text-gray-800">My Applications</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {applications.map((application)=>(
          <div key={application._id} className="bg-white p-5 rounded-lg shadow-md transition-transform transform hover:translate-y-[-5px]">
            <h3 className="text-xl text-gray-800">{application.jobTitle}</h3>
            <p className="mt-2 text-gray-700"><strong>Company:</strong> {application.companyName}</p>
            <p className="mt-1 text-gray-700"><strong>Status:</strong> {application.status}</p>
            <p className="mt-1 text-gray-700"><strong>Applied At:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationTracking;