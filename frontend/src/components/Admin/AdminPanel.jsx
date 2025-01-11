import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AdminPanel =()=>{
  const [activeSection, setActiveSection] = useState('users');
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, action: null, id: null });
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
    } else {
      fetchUsers();
      fetchCompanies();
      fetchJobs();
    }
  }, [navigate]);
  const fetchUsers = async ()=>{
    try{
      const response = await axios.get('http://localhost:3000/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      setUsers(response.data);
    }catch (error){
      console.error('Error fetching users:', error);
    }
  };
  const fetchCompanies = async ()=>{
    try{
      const response = await axios.get('http://localhost:3000/api/admin/companies', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      setCompanies(response.data);
    }catch (error){
      console.error('Error fetching companies:', error);
    }
  };
  const fetchJobs = async()=>{
    try{
      const response = await axios.get('http://localhost:3000/api/admin/jobs',{
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      setJobs(response.data);
    }catch(error){
      console.error('Error fetching jobs:', error);
    }
  };
  const handleConfirmAction = async ()=>{
    const { action, id } = confirmationModal;
    try{
      let response;
      switch(action){
        case 'verifyUser ':
          response = await axios.put(`http://localhost:3000/api/admin/users/${id}/verify`, {},{
            headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
          });
          toast.success('User  verified successfully');
          fetchUsers();
          break;
        case 'blockUser ':
          response = await axios.put(`http://localhost:3000/api/admin/users/${id}/block`,{ block: confirmationModal.block }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
          });
          toast.success(`User  ${confirmationModal.block ? 'blocked' : 'unblocked'} successfully`);
          fetchUsers();
          break;
        case 'verifyCompany':
          response = await axios.put(`http://localhost:3000/api/admin/companies/${id}/verify`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
          });
          toast.success('Company verified successfully');
          fetchCompanies();
          break;
        case 'rejectCompany':
          response = await axios.put(`http://localhost:3000/api/admin/companies/${id}/reject`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
          });
          toast.success('Company rejected successfully');
          fetchCompanies();
          break;
        case 'approveJob':
          response = await axios.put(`http://localhost:3000/api/admin/jobs/${id}/approve`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
          });
          toast.success('Job approved successfully');
          fetchJobs();
          break;
        case 'rejectJob':
          response = await axios.put(`http://localhost:3000/api/admin/jobs/${id}/reject`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem(' adminToken')}` },
          });
          toast.success('Job rejected successfully');
          fetchJobs();
          break;
        case 'deleteJob':
          response = await axios.delete(`http://localhost:3000/api/admin/jobs/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
          });
          toast.success('Job deleted successfully');
          fetchJobs();
          break;
        default:
          break;
      }
    }catch(error){
      toast.error('Error performing action');
      console.error('Error performing action:', error);
    }finally{
      setConfirmationModal({ isOpen: false, action: null, id: null });
    }
  };
  const openConfirmationModal = (action, id, block = null)=>{
    setConfirmationModal({ isOpen: true, action, id, block });
  };
  const renderSection = ()=>{
    switch (activeSection){
      case 'users':
        return(
          <section className="bg-gray-100 p-5 rounded-lg shadow-md">
            <h2 className="text-center mb-5">Users</h2>
            {users.length === 0 ?(
              <p>No new Users found.</p>
            ) : (
              <ul>
                {users.map((user) => (
                  <li key={user._id} className="bg-white p-5 rounded-lg shadow-md mb-5">
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Verified:</strong> {user.verified ? 'Yes' : 'No'}</p>
                    <p><strong>Blocked:</strong> {user.blocked ? 'Yes' : 'No'}</p>
                    <button className="bg-gray-800 text-white py-2 px-4 rounded-lg mr-2" onClick={() => openConfirmationModal('verifyUser ', user._id)}>Verify</button>
                    <button className="bg-gray-800 text-white py-2 px-4 rounded-lg" onClick={() => openConfirmationModal('blockUser ', user._id, !user.blocked)}>
                      {user.blocked ? 'Unblock' : 'Block'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      case 'companies':
        return(
          <section className="bg-gray-100 p-5 rounded-lg shadow-md">
            <h2 className="text-center mb-5">Companies</h2>
            {companies.length === 0 ? (
              <p>No companies found.</p>
            ):(
              <ul>
                {companies.map((company)=>(
                  <li key={company._id} className="bg-white p-5 rounded-lg shadow-md mb-5">
                    <p><strong>Company Name:</strong> {company.company}</p>
                    <p><strong>Email:</strong> {company.email}</p>
                    <p><strong>Verified:</strong> {company.verified ? 'Yes' : 'No'}</p>
                    <p><strong>Rejected:</strong> {company.rejected ? 'Yes' : 'No'}</p>
                    <button className="bg-gray-800 text-white py-2 px-4 rounded-lg mr-2" onClick={() => openConfirmationModal('verifyCompany', company._id)}>Verify</button>
                    <button className="bg-gray-800 text-white py-2 px-4 rounded-lg" onClick={() => openConfirmationModal('rejectCompany', company._id)}>Reject</button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      case 'jobs':
        return (
          <section className="bg-gray-100 p-5 rounded-lg shadow-md">
            <h2 className="text-center mb-5">Job Listings</h2>
            {jobs.length === 0 ?(
              <p>No job listings found.</p>
            ):(
              <ul>
                {jobs.map((job) => (
                  <li key={job._id} className="bg-white p-5 rounded-lg shadow-md mb-5 flex justify-between items-center">
                    <div>
                      <p><strong>Title:</strong> {job.title}</p>
                      <p><strong>Company:</strong> {job.company.name}</p>
                      <p><strong>Location:</strong> {job.company.location}</p>
                      <p><strong>Salary:</strong> ${job.salary}</p>
                      <p><strong>Experience:</strong> {job.experience} years</p>
                      <p><strong>Type:</strong> {job.type_of_employment}</p>
                      <p><strong>Approved:</strong> {job.approved ? 'Yes' : 'No'}</p>
                      <p><strong>Rejected:</strong> {!job.approved ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <button className="bg-gray-800 text-white py-2 px-4 rounded-lg mr-2" onClick={() => openConfirmationModal('approveJob', job._id)}>
                        {job.approved ? 'Yes' : 'Approve'}
                      </button>
                      <button className="bg-gray-800 text-white py-2 px-4 rounded-lg" onClick={() => openConfirmationModal('rejectJob', job._id)}>Reject</button>
                      <button className="bg-gray-800 text-white py-2 px-4 rounded-lg" onClick={() => openConfirmationModal('deleteJob', job._id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      default:
        return null;
    }
  };
  return (
    <div className="flex">
      <div className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-center mb-5">Admin Panel</h2>
        <ul>
          <li
            className={`p-2 cursor-pointer transition-colors duration-300 ${activeSection === 'users' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveSection('users')}
          >
            Users
          </li>
          <li
            className={`p-2 cursor-pointer transition-colors duration-300 ${activeSection === 'companies' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveSection('companies')}
          >
            Companies
          </li>
          <li
            className={`p-2 cursor-pointer transition-colors duration-300 ${activeSection === 'jobs' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveSection('jobs')}
          >
            Job Listings
          </li>
          <li
            className="p-2 cursor-pointer transition-colors duration-300 hover:bg-gray-700"
            onClick={() => {
              localStorage.removeItem('adminToken');
              navigate('/login');
            }}
          >
            Logout
          </li>
        </ul>
      </div>
      <div className="flex-1 p-5">
        <ToastContainer />
        {renderSection()}
        {confirmationModal.isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg shadow-md">
              <h3 className="text-lg mb-4">Confirm Action</h3>
              <p>Are you sure you want to proceed with this action?</p>
              <div className="mt-4">
                <button className="bg-gray-800 text-white py-2 px-4 rounded-lg mr-2" onClick={handleConfirmAction}>Yes</button>
                <button className="bg-gray-300 text-black py-2 px-4 rounded-lg" onClick={() => setConfirmationModal({ isOpen: false, action: null, id: null })}>No</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminPanel;