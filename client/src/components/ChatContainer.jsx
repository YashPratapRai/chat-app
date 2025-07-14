import React, { useEffect, useRef, useState, useContext } from 'react';
import EmojiPicker from 'emoji-picker-react';
import assets from '../assets/assets';
import toast from 'react-hot-toast';
import { ChatContext } from '../../context/chatContext';
import { AuthContext } from '../../context/AuthContext';

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages
  } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [recording, setRecording] = useState(false);

  const scrollEnd = useRef(null);
  const inputRef = useRef(null);
  const mediaRecRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if(scrollEnd.current && messages){
    scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages]);

  // Fetch chat history when user selected
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ text: input.trim() });
    setInput('');
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error("Please select a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const addEmoji = (emoji) => {
    setInput((prev) => prev + emoji.emoji);
    inputRef.current?.focus();
  };

  const handleVoice = async () => {
    if (recording) {
      mediaRecRef.current?.stop();
      setRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecRef.current = recorder;

      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        // You can handle audio sending here
        console.log("Voice blob:", blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error(err);
      toast.error("Microphone permission denied.");
    }
  };

  return selectedUser ? (
    <div className="h-full overflow-hidden relative backdrop-blur-lg rounded-xl border border-white/10 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="profile" className="w-8 h-8 rounded-full" />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id)}<span className={`w-2 h-2 rounded-full ${onlineUsers.includes(selectedUser._id) ? 'bg-green-500' : 'bg-gray-500'}`} />
        </p>
        <img src={assets.arrow_icon} onClick={() => setSelectedUser(null)} className="md:hidden w-6 cursor-pointer" />
        <img src={assets.help_icon} alt="Help" className="max-md:hidden w-5" />
      </div>

      {/* Messages */}
      <div className="flex flex-col h-[calc(100%-144px)] overflow-y-scroll p-3 pb-32 space-y-3">
        {messages.map((msg, i) => {
          const isMe = msg.senderId === authUser?._id;
          return (
            <div key={i} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
              {!isMe && <img src={selectedUser.profilePic || assets.avatar_icon} className="w-7 h-7 rounded-full" />}
              {msg.image ? (
                <img src={msg.image} className="max-w-[200px] rounded-lg" />
              ) : (
                <div
                  className={`p-3 max-w-[250px] text-sm font-light text-white rounded-lg ${
                    isMe ? 'bg-violet-500/30 rounded-br-none' : 'bg-[#303348] rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              )}
              <div className="text-[11px] text-gray-400 px-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              {isMe && <img src={authUser.profilePic || assets.avatar_icon} className="w-7 h-7 rounded-full" />}
            </div>
          );
        })}
        <div ref={scrollEnd} />
      </div>

      {/* Input */}
      <div className="absolute bottom-0 left-0 w-full bg-[#1e1b2e] px-4 py-3 border-t border-white/10">
        <div className="relative flex items-center justify-between gap-2">
          {/* Emoji */}
          <div className="flex items-center gap-2">
            <img
              src="/reshot-icon-smile-emoji-X4SUBTMKRF.svg"
              alt="Emoji"
              className="w-6 cursor-pointer"
              onClick={() => setShowEmoji((prev) => !prev)}
            />
            {showEmoji && (
              <div className="absolute bottom-14 left-0 z-50">
                <EmojiPicker theme="dark" onEmojiClick={addEmoji} height={350} />
              </div>
            )}
          </div>

          {/* Input Field */}
          <div className="flex items-center gap-3 flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-[#2a2740] text-sm text-white rounded-full outline-none"
            />

            {/* Attach Image */}
            <label htmlFor="image-upload">
              <img
                src={assets.gallery_icon}
                title="Attach Image"
                className="w-5 cursor-pointer hover:scale-110"
              />
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              hidden
              onChange={handleSendImage}
            />

            {/* Voice */}
            <img
              src="/reshot-icon-mic-WE7TLP4HSX.svg"
              title="Voice"
              onClick={handleVoice}
              className={`w-6 cursor-pointer ${recording ? 'animate-pulse' : ''}`}
            />

            {/* Send */}
            <img
              src={assets.send_button}
              title="Send"
              onClick={handleSendMessage}
              className="w-7 cursor-pointer hover:scale-125"
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden h-full">
      <img src="/logo2.png" className="w-16" alt="Logo" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
