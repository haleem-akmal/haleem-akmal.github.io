// src/pages/AdminLoginPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Namma puthu hook-a use panrom
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../firebase';
import { FiLogIn } from 'react-icons/fi';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { currentUser } = useAuth(); // Context-la irunthu user-a eduthukrom
  const navigate = useNavigate();
  const auth = getAuth(app);

  useEffect(() => {
    // Context-la ippove user iruntha, odane dashboard-ku po
    if (currentUser) {
      navigate('/admin/dashboard');
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login successful aana, namma context auto-a update aagum,
      // and mela irukura useEffect, namma-la dashboard-ku kondu poidum.
      // So, inga thirumba navigate panna vendam.
    } catch (err) {
      console.error("Firebase Login Error:", err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // App load aagum pothu, context currentUser-a check pannum.
  // Athu varaikkum, oruvela currentUser ippove iruntha, intha page-a kaata vendam.
  // Ithaala antha "flicker" thadukkapadum.
  if (currentUser) {
    return null; // Onnumey render pannama, useEffect navigate panrathukku wait pannum.
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center py-24 px-4">
      <div className="max-w-md w-full bg-[#161a23] p-8 rounded-xl border border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-2">Admin Login</h2>
        <p className="text-center text-gray-400 mb-8">Access your portfolio dashboard</p>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-3 px-6 rounded-md hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging In...
              </>
            ) : (
              <>
                <FiLogIn /> Log In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;