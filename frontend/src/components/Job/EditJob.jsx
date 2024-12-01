import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SuccessModal from '../HomePage/SuccessModal';
import Spinner from '../Loader/loader';

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobDetails, setJobDetails] = useState({
    title: '',
    company: {
      name: '',
      location: '',
    },
    salary: '',
    experience: '',
    type_of_employment: '',
    userId: JSON.parse(localStorage.getItem('user'))._id,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() =>{
    const fetchJobDetails = async ()=>{
      setLoading(true);
      try{
        const response = await fetch(`http://localhost:3000/api/user/jobs/${jobId}`);
        if(!response.ok){
          throw new Error(`Error fetching job details: ${response.statusText}`);
        }
        const data = await response.json();
        setJobDetails(data.job);
      } catch(error){
        console.error('Error fetching job details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleChange = (e)=>{
    const { name,value } = e.target;
    if (name.startsWith('company.')) {
      const companyField = name.split('.')[1];
      setJobDetails((prevDetails) => ({
        ...prevDetails,
        company: {
          ...prevDetails.company,
          [companyField]: value,
        },
      }));
    } else {
      setJobDetails((prevDetails)=>({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setLoading(true);
    setIsSubmitting(true);
    setError(null);
    try{
      const response = await fetch(`http://localhost:3000/api/user/jobs/editjob/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobDetails),
      });
      if(!response.ok){
        throw new Error(`Error updating job: ${response.statusText}`);
      }
      toast.success('Job updated successfully!');
      setSuccessModalOpen(true); 
      setTimeout(() => {
        setSuccessModalOpen(false);
        navigate('/recruiter-dashboard');
      },2000);
    } catch(error){
      console.error('Error updating job:', error);
      toast.error(error.message);
    } finally{
      setIsSubmitting(false);
    }
  };

  if(loading){
    return <Spinner />;
  }
  if(error){
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return(
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Edit Job</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={jobDetails.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            name="company.name"
            value={jobDetails.company.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Company Location</label>
          <input
            type="text"
            name="company.location"
            value={jobDetails.company.location}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Salary</label>
          <input
            type="text"
            name="salary"
            value={jobDetails.salary}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Experience</label>
          <input
            type="text"
            name="experience"
            value={jobDetails.experience}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Type of Employment</label>
          <input
            type="text"
            name="type_of_employment"
            value={jobDetails.type_of_employment}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500'} text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>

      {/* Success Modal */}
      {successModalOpen && (
        <SuccessModal
          message="Job updated successfully!"
          onClose={() => setSuccessModalOpen(false)}
        />
      )}
    </div>
  );
};

export default EditJob;
