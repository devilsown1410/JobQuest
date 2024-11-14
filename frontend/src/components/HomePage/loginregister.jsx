import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faLinkedin, faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import SuccessModal from './SuccessModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/LoginRegister.css';

// Images
import Img01 from '../../images/LoginRegister/bg1.svg';
import Img02 from '../../images/LoginRegister/bg2.svg';
import ImgEyeHide from '../../images/LoginRegister/eye-hide.png';
import ImgEmail from "../../images/LoginRegister/email.png";
import ImgLock from "../../images/LoginRegister/lock.png";
import ImgUser  from "../../images/LoginRegister/user.png";
import ImgUsers from "../../images/LoginRegister/users.png";
import ImgEye from "../../images/LoginRegister/eye.png";

const initialState = {
  isPasswordShown: false,
  isEyeImage: true,
  password: '',
  username: '',
  email: '',
  userType: 'jobSeeker', // Default user type
  errors: {},
};

const LoginRegister = () => {
  const [state, setState] = useState({ ...initialState, isActive: true });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const changeSignInForm = () => {
    setState({ ...initialState, isActive: false, errors: {} });
  };

  const changeSignUpForm = () => {
    setState({ ...initialState, isActive: true, errors: {} });
  };

  const PasswordVisibility = () => {
    setState({ ...state, isPasswordShown: true, isEyeImage: false });
  };

  const PasswordNotVisibility = () => {
    setState({ ...state, isPasswordShown: false, isEyeImage: true });
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  const validateForm = () => {
    const { username, email, password } = state;
    const errors = {};

    if (state.isActive && !username) {
      errors.username = 'Username is required';
    }

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setState({ ...state, errors });
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    const { username, email, password, userType } = state;
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', { username, email, password, userType });
      const { token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      setModalMessage('Registration successful!');
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/dashboard')}, 1000);
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('User  already exists. Please login.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const { email, password, userType } = state;
    try {
      const endpoint = userType === 'Admin' ? 'http://localhost:3000/api/admin/login' : 'http://localhost:3000/api/auth/login';
      const response = await axios.post(endpoint, { email, password });
      const { token, user } = response.data;
      localStorage.setItem(userType === 'Admin' ? 'adminToken' : 'token', token);
      localStorage.setItem('email', email);
      localStorage.setItem('user', JSON.stringify(user));
      setModalMessage('Login successful!');
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate(userType === 'Admin' ? '/admin' : '/dashboard')}, 1000);

      // navigate(userType === 'Admin' ? '/admin' : '/dashboard'); // Redirect to Admin Panel or Jobseeker Dashboard
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Login failed. Please check your credentials and try again.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  const { errors } = state;

  return (
    <div className="Login-Section">
      <ToastContainer />
      {showModal && <SuccessModal message={modalMessage} onClose={closeModal} />}
      <div className={state.isActive ? "login-container" : "login-container sign-up-mode"} id="container">
        <div className="forms-container">
          <div className="signin-signup">

            {/* ----------------------------- Login Form ----------------------------- */}
            <form className="sign-in-form" onSubmit={handleLogin}>
              <h2 className="title">Sign in</h2>
              <div className="input-field">
                <label>User Type:</label>
                <select name="userType" value={state.userType} onChange={onChange}>
                  <option value="jobSeeker">Job Seeker</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="input-field">
                <img src={ImgUser } className="fas" alt="User  Icon" />
                <input type="text" name="email" id="loginemail" value={state.email}
                  placeholder="Email" onChange={onChange} />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>
              <div className="input-field">
                <img src={ImgLock} className="fas" alt="Lock Icon" />
                <input
                  type={state.isPasswordShown ? "text" : "password"}
                  name="password" id="loginPassword" value={state.password} placeholder="Password"
                  onChange={onChange}
                />
                <img
                  src={state.isEyeImage ? ImgEye : ImgEyeHide}
                  className="eye" alt="Eye Icon"
                  onClick={state.isPasswordShown ? PasswordNotVisibility : PasswordVisibility}
                />
                {errors.password && <p className="error">{errors.password}</p>}
              </div>
              <input type="submit" value="Login" className="btn solid" />
            </form>

            {/* ----------------------------- Registration Form ----------------------------- */}
            <form className="sign-up-form" onSubmit={handleRegister}>
              <h2 className="title">Sign up</h2>
              <div className="input-field">
                <label>User Type:</label>
                <select name="userType" value={state.userType} onChange={onChange}>
                  <option value="jobSeeker">Job Seeker</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="input-field">
                <img src={ImgUsers} className="fas" alt="Users Icon" />
                <input type="text" name="username" id="signupUsername" value={state.username}
                  placeholder="Username" onChange={onChange} />
                {errors.username && <p className="error">{errors.username}</p>}
              </div>
              <div className="input-field">
                <img src={ImgEmail} className="fas" alt="Email Icon" />
                <input type="email" name="email" id="signupEmail" value={state.email}
                  placeholder="Email" onChange={onChange} />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>
              <div className="input-field">
                <img src={ImgLock} className="fas" alt="Lock Icon" />
                <input
                  type={state.isPasswordShown ? "text" : "password"}
                  name="password" id="signupPassword" value={state.password} placeholder="Password"
                  onChange={onChange}
                />
                <img
                  src={state.isEyeImage ? ImgEye : ImgEyeHide}
                  className ="eye" alt="Eye Icon"
                  onClick={state.isPasswordShown ? PasswordNotVisibility : PasswordVisibility}
                />
                {errors.password && <p className="error">{errors.password}</p>}
              </div>
              <input type="submit" className="btn" value="Sign up" />
              
            </form>
            {/* ------------ Registration Form end ------------ */}
          </div>
        </div>
        
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here?</h3>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
                ex ratione. Aliquid!
              </p>
              <button className="btn transparent" id="sign-up-btn" onClick={changeSignInForm}>Sign up</button>
            </div>
            <img src={Img01} className="image" alt="Background" />
          </div>

          <div className="panel right-panel">
            <div className="content">
              <h3>One of us</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
                laboriosam ad deleniti.
              </p>
              <button className="btn transparent" id="sign-in-btn" onClick={changeSignUpForm}>Sign in</button>
            </div>
            <img src={Img02} className="image" alt="Background" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;