import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  // Set initial form values from authUser
  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName || '');
      setBio(authUser.bio || '');
    }
  }, [authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If no new profile image selected
    if (!selectedImg) {
      await updateProfile({ fullName: name, bio });
      navigate('/');
      return;
    }

    // If new profile image selected
    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ fullName: name, bio, profilePic: base64Image });
      navigate('/');
    };
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center px-4">
      <div className="w-full max-w-2xl backdrop-blur-2xl text-gray-300 border border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg shadow-lg overflow-hidden">

        {/* --- Form Section --- */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-10 flex-1 w-full">
          <h3 className="text-2xl font-medium text-white">Profile Details</h3>

          {/* Upload Profile */}
          <label htmlFor="avatar" className="flex items-center gap-4 cursor-pointer text-sm hover:text-indigo-300 transition">
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : authUser?.profilePic || assets.avatar_icon
              }
              alt="profile"
              className="w-14 h-14 object-cover rounded-full"
            />
            Upload profile picture
          </label>

          {/* Name input */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="p-3 bg-[#2a2740] text-white rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />

          {/* Bio input */}
          <textarea
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Short bio"
            className="p-3 bg-[#2a2740] text-white rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-md hover:scale-105 transition-transform"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-2 border border-white/20 text-gray-400 rounded-md hover:bg-white/10 hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Right Side Image */}
        <img
  className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`}
  src={authUser?.profilePic || assets.logo_icon}
  alt=""
/>

      </div>
    </div>
  );
};

export default ProfilePage;
