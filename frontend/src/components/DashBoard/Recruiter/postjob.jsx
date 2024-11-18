import React, { useState } from 'react';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SuccessModal from '../../HomePage/SuccessModal';
import Spinner from '../../Loader/loader';

function JobPost(){
  const [jobDetails, setJobDetails] = useState({
    title: '',
    companyName: '',
    location: '',
    salary: '',
    experience: '',
    typeOfEmployment: '',
    userId: JSON.parse(localStorage.getItem('user'))._id,
  });

  const[showModal,setShowModal] = useState(false);
  const[loading,setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobDetails({ ...jobDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/api/recruiter/jobs',jobDetails);
      toast.success('Job posted successfully!');
      setShowModal(true);
      setJobDetails({
        title: '',
        companyName: '',
        location: '',
        salary: '',
        experience: '',
        typeOfEmployment: '',
      });
    }catch(error){
      console.error('Error posting job:', error);
      toast.error('Failed to post job');
    }
    finally{
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  if(loading){
    return <Spinner />;
  }

  return(
    <div className="job-post-container">
      <h2>Post a Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            name="title"
            value={jobDetails.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={jobDetails.companyName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={jobDetails.location}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Salary</label>
          <input
            type="number"
            name="salary"
            value={jobDetails.salary}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Experience (years)</label>
          <input
            type="number"
            name="experience"
            value={jobDetails.experience}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Type of Employment</label>
          <input
            type="text"
            name="typeOfEmployment"
            value={jobDetails.typeOfEmployment}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn">Post Job</button>
      </form>

      {/* Success Modal */}
      {showModal && (
        <SuccessModal
          message="Your job has been posted successfully!"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default JobPost;
