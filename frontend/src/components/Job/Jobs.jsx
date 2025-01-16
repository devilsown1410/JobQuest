import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import '../../styles/LoadingSpinner.css';
import '../../styles/Jobs.css';
import '../../styles/ApplyForm.css';
import Header from '../HomePage/Header';
import Footer from '../HomePage/Footer';
import Spinner from '../Loader/loader';

const Jobs = () => {
  console.log("yaha to aa rha")
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({
    location: '',
    company: '',
    typeOfEmployment: '',
  });
  const [sortCriteria, setSortCriteria] = useState('date');
  const [triggerSearch, setTriggerSearch] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');
  const [applyling,setApplying]=useState(false);

  useEffect(() =>{
    const fetchJobs = async ()=>{
      setLoading(true);
      try {
        const response = await axios.get('https://jobquest-qtqi.onrender.com/api/user/jobs', {
          params: {
            page: currentPage,
            limit: 10,
            search: searchTerm,
            location: filterCriteria.location,
            company: filterCriteria.company,
            typeOfEmployment: filterCriteria.typeOfEmployment,
            sort: sortCriteria,
          },
        });
        setJobs(response.data.jobs);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Error fetching jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (triggerSearch){
      fetchJobs();
      setTriggerSearch(false);
    }
  },[triggerSearch, currentPage]);

  const handlePageChange =(page) =>{
    setCurrentPage(page);
  };

  const handleSearchChange = (e)=>{
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e)=>{
    const { name, value } = e.target;
    setFilterCriteria({ ...filterCriteria, [name]: value });
  };

  const handleSortChange = (e)=>{
    setSortCriteria(e.target.value);
  };

  const handleSearchClick = ()=>{
    setTriggerSearch(true);
  };

  const handleApplyClick = (jobId)=>{
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user || !user._id){
      toast.warn('User  not logged in. Please log in to Apply jobs.');
      return;
    }
    setSelectedJobId(jobId);
    setShowApplyForm(true);
  };

  const handleResumeChange = (e)=>{
    setResume(e.target.files[0]);
  };

  const handleMessageChange = (e)=>{
    setMessage(e.target.value);
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user._id;
    const formData = new FormData();
    formData.append('jobId', selectedJobId);
    formData.append('userId', userId);
    formData.append('message', message);
    if(resume){
      formData.append('resume', resume);
    }

    try{
      const response = await axios.post('http://localhost:3000/api/user/apply', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message);
      setShowApplyForm(false);
      setResume(null);
      setMessage('');
    }catch(error){
      console.error('Error applying for job:', error);
      toast.error('Failed to apply for job. Please try again.'); // Toastify error
    }
    finally{
      setApplying(false);
    }
  };

  const handleSaveClick = async (jobId)=>{
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user || !user._id){
      toast.warn('User  not logged in. Please log in to save jobs.'); // Toastify warning
      return;
    }
    const userId = user._id;
    try{
      const response = await axios.post('http://localhost:3000/api/user/save ', {
        jobId,
        userId,
      });
      toast.success(response.data.message);
    } catch(error){
      console.error('Error saving the job:', error);
      if(error.response && error.response.data){
        toast.error(error.response.data.message || 'Failed to save the job');
      }else{
        toast.error('Failed to save the job');
      }
    }
  };

  if(loading || applyling){
    return <Spinner />;
  }

  return(
    <div className="jobs-container">
      <ToastContainer />
      <h2>Find Jobs</h2>
      <div className="search-filter-sort">
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select name="location" value={filterCriteria.location} onChange={handleFilterChange}>
          <option value="">All Locations</option>
          <option value="Delhi">Delhi</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Noida">Noida</option>
        </select>
        <select name="company" value={filterCriteria.company} onChange={handleFilterChange}>
          <option value="">All Companies</option>
          <option value="Google">Google</option>
          <option value="Facebook">Facebook</option>
          <option value="Amazon">Amazon</option>
        </select>
        <select name="typeOfEmployment" value={filterCriteria.typeOfEmployment} onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>
        <select value={sortCriteria} onChange={handleSortChange}>
          <option value="date">Sort by Date</option>
          <option value="salary">Sort by Salary</option>
        </select>
        <button onClick={handleSearchClick} className="stylish-button1">
          <span>
          Search
            </span></button>
      </div>
      <div className="jobs-list">
        {jobs.map((job) => (
          <div key={job._id} className="job-card">
            <h3>{job.title}</h3>
            <p><strong>Company:</strong> {job.company.name}</p>
            <p><strong>Location:</strong> {job.company.location}</p>
            <p><strong>Salary:</strong> ${job.salary}</p>
            <p><strong>Experience:</strong> {job.experience} years</p>
            <p><strong>Type:</strong> {job.type_of_employment}</p>
            <div className="
            button-container d-flex justify-content-between align-items-center
            ">
            <button className="stylish-button1" onClick={() => handleApplyClick(job._id)}>
              <span>Apply Now</span>
            </button>
            <button className="stylish-button1" onClick={() => handleSaveClick(job._id)}>
              <span>Save Job</span> 
              </button>
            </div>
            
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages },(_, index) =>(
          <button
            key={index + 1}
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {showApplyForm &&(
        <div className="apply-form-modal">
          <div className="apply-form-container">
            <h2>Apply for Job</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Resume</label>
                <input type="file" onChange={handleResumeChange} />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea value={message} onChange={handleMessageChange}></textarea>
              </div>
              <div>
                <button type="submit" className="stylish-button mr-4">
                <span>
                Submit Application
                  </span></button>
              <button type="button" className="stylish-button" onClick={() => setShowApplyForm(false)}>
                <span>
                Cancel
                </span>
                </button>

              </div>
              
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;