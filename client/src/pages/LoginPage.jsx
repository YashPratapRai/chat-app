import React, { useState } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    setIsDataSubmitted(true);

    if (currState === "Sign up" && isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    } 
    login(currState === "Sign up" ? 'signup' : 'login', { fullName, email, password, bio });
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl px-4">

      {/* Left Side - Logo */}
      <img src="Screenshot_20250713-183801.Photos_2-removebg-preview.png" alt="logo" className="w-[30vw] max-w-[350px]" />

      {/* Right Side - Form */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg min-w-[300px] max-w-[400px] w-full"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          <img
            src={assets.arrow_icon}
            alt="toggle"
            className="w-5 cursor-pointer"
            onClick={() =>
              setCurrState((prev) => (prev === "Login" ? "Sign up" : "Login"))
            }
          />
        </h2>

        {/* Sign Up: Full Name */}
        {currState === "Sign up" && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            placeholder="Full Name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            required
          />
        )}

        {/* Common Fields */}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email Address"
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          className="p-2 border border-gray-500 rounded-md focus:outline-none"
          required
        />

        {/* Sign Up: Bio */}
        {currState === "Sign up" && (
          <textarea
            rows={4}
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Provide a short bio..."
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md hover:scale-105 transition-transform duration-200 cursor-pointer"
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        {/* Terms checkbox only for sign up */}
        {currState === "Sign up" && (
          <div className="text-sm text-gray-300 flex items-start gap-2">
            <input type="checkbox" className="mt-1" required />
            <p>Agree to the terms of use & privacy policy</p>
          </div>
        )}

        {/* Toggle Text Link */}
        <p className="text-sm text-gray-300 text-center">
          {currState === "Sign up" ? (
            <>
              Already have an account?{" "}
              <span
                className="text-indigo-400 underline cursor-pointer hover:text-indigo-300"
                onClick={() => setCurrState("Login")}
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                className="text-indigo-400 underline cursor-pointer hover:text-indigo-300"
                onClick={() => setCurrState("Sign up")}
              >
                Create account
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
