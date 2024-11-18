import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axios';
import '../../../styles/JobseekerDashboard.css'
import Spinner from '../../Loader/loader';
import { useNavigate } from 'react-router-dom';
import Chat from '../Chat/Chat';

const JobseekerDashboard = ()=>{
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileDetails, setProfileDetails] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    education: '',
    experience: '',
    skills: ''
  });
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [savedJobs, setSavedJobs] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [activeChats, setActiveChats] = useState([]);

  useEffect(()=>{
    const fetchUserData = async ()=>{
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const response = await axios.post('http://localhost:3000/api/user', { email }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data.user);
        setProfileDetails({
          username: response.data.user.username,
          email: response.data.user.email,
          phone: response.data.user.phone || '',
          address: response.data.user.address || '',
          bio: response.data.user.bio || '',
          education: response.data.user.education || '',
          experience: response.data.user.experience || '',
          skills: response.data.user.skills || ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(()=>{
    if (user){
      const fetchApplications = async ()=>{
        setLoading(true);
        try{
          const response = await axios.get(`http://localhost:3000/api/user/applications?userId=${user._id}`);
          setApplications(response.data);
        }catch(error){
          console.error('Error fetching applications:', error);
        }
        finally{
          setLoading(false);
        }
      };

      const fetchNotifications = async ()=>{
        setLoading(true);
        try{
          const response = await axios.get(`http://localhost:3000/api/user/notifications?userId=${user._id}`);
          console.log('Notifications fetched:', response.data);
          const unreadNotifications = response.data.filter(notification => !notification.read).slice(0, 10); //Only 10 at a time
          setNotifications(unreadNotifications);
          setUnreadCount(unreadNotifications.length);
        } catch(error){
          console.error('Error fetching notifications:', error);
        }
        finally{
          setLoading(false);
        }
      };
      const fetchSavedJobs = async ()=>{
        setLoading(true);
        try{
          const response = await axios.get(`http://localhost:3000/api/user/jobs/saved?userId=${user._id}`);
          setSavedJobs(response.data.savedJobs);
        }catch(error){
          console.error('Error fetching notifications:', error);
        }
        finally{
          setLoading(false);
          }
      };

      fetchSavedJobs();
      fetchApplications();
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    const fetchRecruiters = async ()=>{
      setLoading(true);
      try{
        const response = await axios.get('http://localhost:3000/api/user/recruiters');
        setRecruiters(response.data);
      }catch(error){
        console.error('Error fetching recruiters:', error);
      }
      finally{
        setLoading(false);
      }
    };
    fetchRecruiters();
  }, []);

  const generateRoomId = (userId1,userId2)=>{
    return [userId1, userId2].sort().join('-');
  };
  const handleSelectRecruiter =(recruiter)=>{
    setSelectedRecruiter(recruiter);
    const roomId = generateRoomId(user._id, recruiter._id);
    if (!activeChats.some(chat => chat.room === roomId)) {
      setActiveChats([...activeChats, { room: roomId, recruiter }]);
    }
  };
  const handleInputChange =(e)=>{
    const { name,value } = e.target;
    setProfileDetails({ ...profileDetails, [name]: value });
  };

  const handleProfileSubmit = async(e)=>{
    e.preventDefault();
    setLoading(true);
    try{
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3000/api/user', profileDetails, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
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

  const markNotificationsAsRead = async()=>{
    try{
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3000/api/user/notifications/read',{ userId: user._id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(0);
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    }catch(error){
      console.error('Error marking notifications as read:', error);
    }
  };

  if(loading){
    return <Spinner />;
  }

  const renderProfileSection = ()=>{
    if(isEditing){
      return(
        <section className="profile-section">
          <h2>Edit Profile</h2>
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text" name="username"
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
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={profileDetails.address}
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
            <div className="form-group">
              <label>Education</label>
              <input
                type="text"
                name="education"
                value={profileDetails.education}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Experience</label>
              <input
                type="text"
                name="experience"
                value={profileDetails.experience}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Skills</label>
              <input
                type="text"
                name="skills"
                value={profileDetails.skills}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn">Update Profile</button>
            <button type="button" className="btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        </section>
      );
    }else{
      return(
        <section className="profile-section">
          <h2>Profile Information</h2>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Phone:</strong> {user?.phone}</p>
          <p><strong>Address:</strong> {user?.address}</p>
          <p><strong>Bio:</strong> {user?.bio}</p>
          <p><strong>Education:</strong> {user?.education}</p>
          <p><strong>Experience:</strong> {user?.experience}</p>
          <p><strong>Skills:</strong> {user?.skills}</p>
          <button className="btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
        </section>
      );
    }
  };

  const renderSection = ()=>{
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
        case 'appliedJobs':
          return (
            <section className="applied-jobs-section">
              <h2>My Applications</h2>
              <div>
                {applications.length > 0 ?(
                  applications.map((app) => (
                    <div key={app._id} className="p-4 border rounded mb-4">
                      <h2 className="text-xl font-semibold">{app.title}</h2>
                      <p>Status: <span className="font-bold">{app.status}</span></p>
                      <p>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                  ))
                ):(
                  <p>No applications found.</p>
                )}
              </div>
            </section>
          );
      
      case 'notifications':
          return(
            <section className="notifications-section">
              <h2>Notifications</h2>
              <button className="btn" onClick={markNotificationsAsRead}>Mark All as Read</button>
              <div>
                {notifications.length > 0 ?(
                  notifications.map((notification)=>(
                    <div key={notification._id} className={`p-4 border rounded mb-4 ${notification.read ? 'read' : 'unread'}`}>
                      <p>{notification.message}</p>
                      <p><small>{new Date(notification.createdAt).toLocaleDateString()}</small></p>
                    </div>
                  ))
                ):(
                  <p>No notifications found.</p>
                )}
              </div>
            </section>
          );
      case 'savedJobs':
          return (
              <section className="saved-jobs-section">
                <h2>Saved Jobs</h2>
                <div>
                  {savedJobs.length > 0 ? (
                    savedJobs.map((job)=>(
                      <div key={job._id} className="p-4 border rounded mb-4">
                        <h2 className="text-xl font-semibold">{job.title}</h2>
                      </div>
                    ))
                  ):(
                    <p>No Saved Jobs found.</p>
                  )}
                </div>
              </section>
            );
            case 'chat':
              return (
                <div className="p-4 bg-gray-50 min-h-screen">
                  <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">Chat</h3>
                  <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/3 mb-4 bg-white shadow-md rounded-lg p-4">
                      <div className="active-chats mb-4">
                        <h4 className="font-medium text-gray-700">Active Chats</h4>
                        {activeChats.length > 0 ?(
                          <div className="tabs">
                            {activeChats.map((chat,index)=>(
                              <button
                                key={index}
                                onClick={() => setSelectedRecruiter(chat.recruiter)}
                                className={`tab p-2 rounded-md w-full text-left transition duration-200 ease-in-out 
                                  ${selectedRecruiter && selectedRecruiter._id === chat.recruiter._id 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-200 hover:bg-gray-300'}`}
                              >
                                {chat.recruiter.username}
                              </button>
                            ))}
                          </div>
                        ):(
                          <p className="text-gray-600">No active chats. Select a recruiter below to start chatting.</p>
                        )}
                      </div>
                      <div className="recruiter-list mb-4">
                        <h4 className="font-medium text-gray-700">Select Recruiter to Start a New Chat</h4>
                        <ul className="mt-2">
                          {recruiters.map((recruiter)=>(
                            <li
                              key={recruiter._id}
                              onClick={() => handleSelectRecruiter(recruiter)}
                              className="cursor-pointer hover:bg-gray-200 p-2 rounded-md transition duration-200 ease-in-out"
                            >
                              {recruiter.username}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Chat Window for Selected Recruiter */}
                    <div className="chat-area w-full md:w-2/3 mb-4 bg-white shadow-md rounded-lg p-4">
                      {selectedRecruiter ? (
                        <Chat 
                          room={generateRoomId(user._id, selectedRecruiter._id)} 
                          userId={user._id} 
                          recruiterUsername={selectedRecruiter.username} 
                        />
                      ):(
                        <p className="mt-4 text-gray-600">Select an active chat or a recruiter to start a conversation.</p>
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
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h2>{user?.username}'s Dashboard</h2>
        <ul>
          <li onClick={() => navigate('/')} className="cursor-pointer">Home</li>
          <li className={activeSection === 'profile' ? 'active' : ''} onClick={() => setActiveSection('profile')}>Profile</li>
          <li className={activeSection === 'appliedJobs' ? 'active' : ''} onClick={() => setActiveSection('appliedJobs')}>Applied Jobs</li>
          <li className={activeSection === 'savedJobs' ? 'active' : ''} onClick={() => setActiveSection('savedJobs')}>Saved Jobs</li>
          <li className={activeSection === 'notifications' ? 'active' : ''} onClick={() => setActiveSection('notifications')}>Notifications {unreadCount > 0 && <span className="notification-count">({unreadCount})</span>}</li>
          <li className={activeSection === 'chat' ? 'active' : ''} onClick={() => setActiveSection('chat')}>Chat</li>
          <li className={activeSection === 'settings' ? 'active' : ''} onClick={() => setActiveSection('settings')}>Settings</li>
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

export default JobseekerDashboard;