import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  /* ---------- Sidebar Users ---------- */
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/chat/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* ---------- Chat History ---------- */
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) setMessages(data.messages);
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* ---------- Send Message ---------- */
  const sendMessage = async (messageData) => {
    if (!selectedUser) return toast.error("No recipient selected.");
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* ---------- Realtime Listener ---------- */
  const subscribeToMessages = () => {
    if (!socket) return;

    socket.off("newMessage"); // clean stale listener

    socket.on("newMessage", async (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        try {
          await axios.put(`/api/messages/mark/${newMessage._id}`);
        } catch (err) {
          console.error("Error marking message seen:", err.message);
        }
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    socket?.off("newMessage");
  };

  /* ---------- Hook the socket ---------- */
  useEffect(() => {
    if (socket) {
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  /* ---------- Context value ---------- */
  const value = {
    axios,
    socket,
    users,
    messages,
    unseenMessages,
    selectedUser,
    setSelectedUser,
    setMessages,
    setUnseenMessages,
    getUsers,
    getMessages,
    sendMessage,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
