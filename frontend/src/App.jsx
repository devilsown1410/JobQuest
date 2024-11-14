import React from 'react';
import Header from './components/HomePage/Header.jsx';
import HeroSection from './components/HomePage/HeroSection';
import PopularVacancies from './components/HomePage/PopularVacancies';
import JobPilotWork from './components/HomePage/JobPilotWork';
import PopularCategory from './components/HomePage/PopularCategory';
import FeaturedJobs from './components/HomePage/FeaturedJobs';
import TopCompanies from './components/HomePage/TopCompanies';
import ClientTestimonials from './components/HomePage/ClientTestimonials';
import Footer from './components/HomePage/Footer';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginRegister from './components/HomePage/loginregister';
import { AuthProvider } from './context/AuthContext.jsx';
import { LoadingProvider } from './context/LoadingContext.jsx';
import RequireAuth from './components/Job/RequireAuth.jsx'
import JobPost from './components/DashBoard/Recruiter/postjob.jsx';
import DashboardRedirect from './components/DashBoard/Recruiter/DashboardRedirect.jsx';
import JobseekerDashboard from './components/DashBoard/JobSeeker/jobseeker_dashboard.jsx';
import RecruiterDashboard from './components/DashBoard/Recruiter/recruiter_dashboard.jsx';
import Jobs from './components/Job/Jobs.jsx'
import ApplyForm from './components/DashBoard/JobSeeker/ApplyForm.jsx';
import ApplicationTracking from './components/DashBoard/JobSeeker/ApplicationTracking.jsx'
import AdminPanel from './components/Admin/AdminPanel.jsx';
import Companies from './components/Companies/companies.jsx';
import EditJob from './components/Job/EditJob.jsx';
import Support from './components/Support/support.jsx';
import Spinner from './components/Loader/loader.jsx';

function App() {
  const token=localStorage.getItem('token')
  return (
    <AuthProvider>
      <LoadingProvider>
      <Router>
        {/* <Spinner /> */}
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <HeroSection />
              <PopularVacancies />
              <JobPilotWork />
              <PopularCategory />
              <FeaturedJobs />
              <TopCompanies />
              <ClientTestimonials />
              <Footer />
            </>
          } />
          <Route path="/login" element={
            <LoginRegister />
          } />
          <Route path='/jobseeker-dashboard' element={
            <JobseekerDashboard />
          } />
          <Route path='/recruiter-dashboard' element={
            <RecruiterDashboard />
          } />
           <Route path="/dashboard" element={
            <RequireAuth>
              <DashboardRedirect />
            </RequireAuth>
            } />
            <Route path="/postJob" element={
            <RequireAuth>
              <JobPost />
            </RequireAuth>
            } />
           {/* <Route path="/dashboard" element={<JobseekerDashboard />} /> */}
           <Route path="/apply/:jobId" element={<ApplyForm />} />
          <Route path="/applications" element={<ApplicationTracking />} />
          <Route path="/find-jobs" element={
            <>
            <Header />
            <Jobs />
            <Footer />
            </>
            } />
            <Route path="/edit-job/:jobId" element={<EditJob />} />
          <Route path='/admin' element={<AdminPanel />}/>
          <Route path='/companies' element={
            <>
            <Header />
            <Companies />
            <Footer />
            </>
            }/>

          <Route path='/support' element={
            <>
            <Header />
            <Support />
            <Footer />
            </>
            }/>
        </Routes>
        </Router>
        </LoadingProvider>
    </AuthProvider>
   
  );
}
export default App;