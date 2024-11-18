import React, { useState, useEffect } from 'react';
import { companies } from '../../data';
import Spinner from '../Loader/loader';

const Companies = () => {
  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try{
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCompanyList(companies);
      }catch(error){
        console.error('Error fetching companies:', error);
        setError(error.message);
      }
      finally{
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Companies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companyList.map((company, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <div className="overflow-hidden rounded-lg">
              <img
                src={company.image}
                alt={company.name}
                className="w-full h-48 object-contain transition-transform duration-300 transform hover:scale-110"
              />
            </div>
            <h2 className="text-xl font-semibold mt-4">{company.name}</h2>
            <p className="text-gray-700">{company.location}</p>
            <p className="text-gray-500">{company.industry}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Companies;