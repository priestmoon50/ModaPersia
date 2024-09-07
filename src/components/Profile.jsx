import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './store/UserContext';  // Import the UserContext
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom'; // استفاده از useNavigate برای جایگزینی history

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const navigate = useNavigate(); // جایگزینی history با navigate

  // Access context and actions from UserContext
  const { state, getUserDetailsAction, updateUserProfile, error } = useContext(UserContext);
  const { userLogin, userDetails, userUpdateProfile = {} } = state;
  const { userInfo } = userLogin;
  const { loading, user } = userDetails;
  const { success = false } = userUpdateProfile;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      if (!user || !user.name || success) {
        getUserDetailsAction(userInfo._id);  // Fetch user details using the action from context
      } else {
        setName(user.name);
        setEmail(user.email);
        setPhoneNumber(user.phoneNumber);
      }
    }
  }, [getUserDetailsAction, navigate, userInfo, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      updateUserProfile({ id: user._id, name, email, phoneNumber, password });
    }
  };

  return (
    <div>
      <h2>پروفایل کاربر</h2>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {success && <Message variant="success">پروفایل به‌روزرسانی شد</Message>}
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={submitHandler}>
          <div>
            <label>نام</label>
            <input
              type="text"
              placeholder="نام را وارد کنید"
              value={name || ""} 
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label>ایمیل</label>
            <input
              type="email"
              placeholder="ایمیل را وارد کنید"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label>شماره تلفن</label>
            <input
              type="text"
              placeholder="شماره تلفن را وارد کنید"
              value={phoneNumber || ""}  
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div>
            <label>رمز عبور</label>
            <input
              type="password"
              placeholder="رمز عبور را وارد کنید"
              value={password || ""} 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label>تأیید رمز عبور</label>
            <input
              type="password"
              placeholder="رمز عبور را تأیید کنید"
              value={confirmPassword || ""}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit">به‌روزرسانی پروفایل</button>
        </form>
      )}
    </div>
  );
};

export default ProfileScreen;
