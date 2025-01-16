import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import JobPost from "./postjob.jsx";
import axios from '../../../utils/axios';
import "../../../styles/RecruiterDashboard.css";
import Chat from "../Chat/Chat.jsx";
import Spinner from '../../Loader/loader.jsx';

const RecruiterDashboard = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [recruiter, setRecruiter] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileDetails, setProfileDetails] = useState({
    username: '',
    email: '',
    phone: '',
    company: '',
    bio: '',
  });
  const userId=JSON.parse(localStorage.getItem('user'))._id;
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [jobSeekers, setJobSeekers] = useState([]);
  const [selectedJobSeeker, setSelectedJobSeeker] = useState(null);
  const [activeChats, setActiveChats] = useState([]);

  useEffect(() => {
    const fetchRecruiterData = async () => {
      setLoading(true);
      try{
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const response = await axios.post('https://jobquest-qtqi.onrender.com/api/recruiter', { email }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecruiter(response.data.recruiter);
        setProfileDetails({
          username: response.data.recruiter.username,
          email: response.data.recruiter.email,
          phone: response.data.recruiter.phone || '',
          company: response.data.recruiter.company || '',
          bio: response.data.recruiter.bio || '',
        });
      } catch(error){
        console.error('Error fetching recruiter data:', error);
      }
      finally{
        setLoading(false);
      }
    };

    fetchRecruiterData();
  },[]);

  useEffect(()=>{
    const fetchJobSeekers = async ()=>{
      try {
        const response = await axios.get('https://jobquest-qtqi.onrender.com/api/user/jobSeekers');
        setJobSeekers(response.data);
      } catch (error) {
        console.error('Error fetching job seekers:', error);
      }
    };

    fetchJobSeekers();
  },[]);

  if(loading){
    return <Spinner />;
  }

  const generateRoomId = (userId1, userId2)=>{
    return [userId1, userId2].sort().join('-');
  };
  const handleSelectJobSeeker = (jobSeeker)=>{
    setSelectedJobSeeker(jobSeeker);
    const roomId = generateRoomId(recruiter._id, jobSeeker._id);
    if (!activeChats.some(chat => chat.room === roomId)) {
      setActiveChats([...activeChats, { room: roomId, jobSeeker }]);
    }
  };

  const handleInputChange = (e)=>{
    const { name,value } = e.target;
    setProfileDetails({ ...profileDetails, [name]: value });
  };

  const handleProfileSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try{
      const token = localStorage.getItem('token');
      const response = await axios.put('https://jobquest-qtqi.onrender.com/api/recruiter', profileDetails, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecruiter(response.data.recruiter);
      setIsEditing(false);
      alert('Profile updated successfully');
    }catch(error){
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
    finally{
      setLoading(false);
    }
  };

  const fetchResponses = async ()=>{
    setLoading(true);
    try{
      const response = await axios.get(`https://jobquest-qtqi.onrender.com/api/recruiter/applications?userId=${userId}`);
      setApplications(response.data.responses);
    }catch(error){
      console.error('Error fetching responses:', error);
    }finally{
      setLoading(false);
    }
  };

  const handleStatusChange = async(applicationId,status)=>{
    try{
      await axios.put(`https://jobquest-qtqi.onrender.com/api/recruiter/applications/${applicationId}/status`, { status });
      if(status === 'Deleted'){
        await axios.delete(`https://jobquest-qtqi.onrender.com/api/recruiter/applications/${applicationId}`);
        setApplications((prevApplications) =>
          prevApplications.filter((app) => app._id !== applicationId)
        );
      }else{
        setApplications((prevApplications)=>
          prevApplications.map((app) =>
            app._id === applicationId ? { ...app, status } : app
          )
        );
      }
    }catch(error){
      console.error('Error updating status:', error);
    }
  };
  
  const fetchJobs = async(userId)=>{
    setLoading(true);
    try{
      const userId1 = JSON.parse(localStorage.getItem('user'))._id;
      const response = await axios.get(`https://jobquest-qtqi.onrender.com/api/recruiter/jobs/${userId1}`);
      const fetchedJobs = response.data || [];
      const jobsWithApplicants = await Promise.all(
        fetchedJobs.map(async (job)=>{
          try{
            const applicantsResponse = await axios.get(`https://jobquest-qtqi.onrender.com/api/recruiter/jobs/${job._id}/applicants`);
            return{ 
              ...job, 
              applicantCount: applicantsResponse.data.applicants.length || 0
            }; 
          }catch(applicantError){
            console.error(`Error fetching applicants for job ${job._id}:`, applicantError);
            return { ...job, applicantCount: 0 };
          }
        })
      );
      setJobs(jobsWithApplicants);
    }catch(error){
      console.error('Error fetching jobs:', error);
    }finally{
      setLoading(false);
    }
  };  
  
  const handleDownload =(resumeUrl)=>{
    const encodedUrl = encodeURIComponent(resumeUrl);
    window.open(`https://jobquest-qtqi.onrender.com/api/recruiter/applications/download/${encodedUrl}`, '_blank');
  };
  
  const handleEditJob =(jobId)=>{
    navigate(`/edit-job/${jobId}`);
  };
  
  const handleDeleteJob = async(jobId)=>{
    try{
      await axios.delete(`https://jobquest-qtqi.onrender.com/api/recruiter/jobs/${jobId}`);
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    }catch(error){
      console.error('Error deleting job:', error);
    }
  };

  const renderProfileSection = ()=>{
    if(isEditing){
      return(
        <section className="profile-section">
          <h2>Edit Profile</h2>
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={profileDetails.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profileDetails.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={profileDetails.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input
                type="text"
                name="company"
                value={profileDetails.company}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={profileDetails.bio}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn">Update Profile</button>
            <button type="button" className="btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        </section>
      );
    } else {
      return (
        <section className="profile-section">
          <h2>Profile Information</h2>
          <p><strong>Username:</strong> {recruiter?.username}</p>
          <p><strong>Email:</strong> {recruiter?.email}</p>
          <p><strong>Phone:</strong> {recruiter?.phone}</p>
          <p><strong>Company:</strong> {recruiter?.company}</p>
          <p><strong>Bio:</strong> {recruiter?.bio}</p>
          <button className="btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
        </section>
      );
    }
  };

  const renderSection = ()=>{
    switch (activeSection){
      case 'profile':
        return renderProfileSection();
      case 'postJob':
        return <JobPost />;
      case 'responses':
        return (
          <section className="responses-section">
            <h2>Responses from Candidates</h2>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="responses-list">
                {applications.map((response) => (
                  <div key={response._id} className="response-card">
                    <div className="response-info">
                      <h3>{response.candidateName}</h3>
                      <p><strong>Email:</strong> {response.candidateEmail}</p>
                      <p><strong>Message:</strong> {response.message}</p>
                      <p><strong>Applied At:</strong> {new Date(response.appliedAt).toLocaleDateString()}</p>
                      {response.resumeUrl && (
                        <button className="btn" onClick={() => handleDownload(response.resumeUrl)}>
                          Download Resume
                        </button>
                      )}
                      <p><strong>Status:</strong> {response.status}</p>
                    </div>
                    <div className="response-actions">
                      <button
                        onClick={() => handleStatusChange(response._id,'Under Review')}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Mark as Under Review
                      </button>
                      <button
                        onClick={() => handleStatusChange(response._id, 'Accepted')}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(response._id, 'Rejected')}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleStatusChange(response._id, 'Deleted')}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
        case 'jobListings':
          return(
            <section className="job-listings-section">
              <h2>Job Listings</h2>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <ul>
                  {jobs.map((job, index) => (
                    <li key={index} className="job-listing-item">
                      <div className="job-info">
                        <p><strong>Title:</strong> {job.title}</p>
                        <p><strong>Company:</strong> {job.company.name}</p>
                        <p><strong>Location:</strong> {job.company.location}</p>
                        <p><strong>Salary:</strong> ${job.salary}</p>
                        <p><strong>Experience:</strong> {job.experience} years</p>
                        <p><strong>Type:</strong> {job.type_of_employment}</p>
                        <p><strong>Applicants:</strong> {job.applicantCount}</p>
                      </div>
                      <div className="job-actions">
                        <button onClick={() => handleEditJob(job._id)} style={{ backgroundColor: "orange" }}>Edit</button>
                        <button onClick={() => handleDeleteJob(job._id)}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        case 'chat':
        return (
          <div className="p-4 bg-gray-50 min-h-screen">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">Chat</h3>
            <div className="flex flex-col md:flex-row md:space-x-4">

              {/* Active Chats Section */}
              <div className="w-full md:w-1/3 mb-4 bg-white shadow-md rounded-lg p-4">
                <div className="active-chats mb-4">
                  <h4 className="font-medium text-gray-700">Active Chats</h4>
                  {activeChats.length > 0 ?(
                    <div className="tabs">
                      {activeChats.map((chat,index)=>(
                        <button
                          key={index}
                          onClick={() => setSelectedJobSeeker(chat.jobSeeker)}
                          className={`tab p-2 rounded-md w-full text-left transition duration-200 ease-in-out 
                            ${selectedJobSeeker && selectedJobSeeker._id === chat.jobSeeker._id 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                          {chat.jobSeeker.username}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No active chats. Select a JobSeeker below to start chatting.</p>
                  )}
                </div>
              </div>

              {/* Recruiter List for New Chats */}
              <div className="recruiter-list w-full md:w-1/3 mb-4 bg-white shadow-md rounded-lg p-4">
                <h4 className="font-medium text-gray-700">Select JobSeeker to Start a New Chat</h4>
                <ul className="mt-2">
                  {jobSeekers.map((jobSeeker) => (
                    <li
                      key={jobSeeker._id}
                      onClick={() => handleSelectJobSeeker(jobSeeker)}
                      className="cursor-pointer hover:bg-gray-200 p-2 rounded-md transition duration-200 ease-in-out"
                    >
                      {jobSeeker.username}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chat Window for Selected JobSeeker */}
              <div className="chat-area w-full md:w-1/3 mb-4 bg-white shadow-md rounded-lg p-4">
                {selectedJobSeeker ? (
                  <Chat 
                    room={generateRoomId(recruiter._id, selectedJobSeeker._id)} 
                    userId={recruiter._id} 
                    recruiterUsername={selectedJobSeeker.username} 
                  />
                ) : (
                  <p className="mt-4 text-gray-600">Select an active chat or a JobSeeker to start a conversation.</p>
                )}
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <section className="settings-section">
            <h2>Settings</h2>
            <p>Update your profile, change password, and manage account settings.</p>
            {/* Add more settings options here */}
          </section>
        );
      default:
        return null;
      }
    }

  return(
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h2>Recruiter Dashboard</h2>
        <ul>
        <li onClick={() => navigate('/')} className="cursor-pointer">Home</li>
          <li className={activeSection === 'profile' ? 'active' : ''} onClick={() => setActiveSection('profile')}>Profile</li>
          <li className={activeSection === 'postJob' ? 'active' : ''} onClick={() => setActiveSection('postJob')}>Post Job</li>
          <li className={activeSection === 'responses' ? 'active' : ''} onClick={() => {
            setActiveSection('responses');
            fetchResponses();
          }}>Responses from Candidates</li>
          <li className={activeSection === 'jobListings' ? 'active' : ''} onClick={() => {
            setActiveSection('jobListings');
            fetchJobs();
          }}>Job Listings</li>
          <li className={activeSection === 'chat' ? 'active' : ''} onClick={() => setActiveSection('chat')}>Chat</li>
          <li onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }} className="cursor-pointer">Logout</li>
        </ul>
      </div>
      <div className="dashboard-content">
        {renderSection()}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
