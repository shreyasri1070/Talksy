import React, { useEffect, useState, useCallback, useRef } from "react";
import { useProfile } from "../../context/ProfileContext";
import ChatMessages from "../Chat/ChatMessages";
import MessageInputForm from "../Chat/MessageInputForm";
import Nav from "../Chat/Nav";
import OnlineUsersList from "../Chat/OnlineUserList";
import TopBar from "../Chat/TopBar";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../Api";
import { io } from "socket.io-client"; // ✅ replaces WebSocket
import { baseUrl } from "../../Config";



const ChatHome = () => {
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
const [messagesMap, setMessagesMap] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [wsReady, setWsReady] = useState(false);
const messages = messagesMap[selectedUserId] || [];
  const { userDetails } = useProfile();
  const { isAuthenticated, checkAuth } = useAuth();
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const selectedUserIdRef = useRef(null);
  const userDetailsRef = useRef(null);

  useEffect(() => { selectedUserIdRef.current = selectedUserId; }, [selectedUserId]);
  useEffect(() => { userDetailsRef.current = userDetails; }, [userDetails]);

  const showOnlinePeople = useCallback((peopleArray) => {
    const people = {};
    peopleArray.forEach(({ userId, username, avatarLink }) => {
      if (userId !== userDetailsRef.current?._id) {
        people[userId] = { username, avatarLink };
      }
    });
    setOnlinePeople(people);
  }, []);

  // ✅ Connect once when userDetails._id is available
  useEffect(() => {
    if (!userDetails?._id) return;
    if (socketRef.current?.connected) return; // don't reconnect if already connected

    console.log("🔌 Connecting Socket.IO...");

    const socket = io(baseUrl, {
      withCredentials: true, // ✅ sends cookies for JWT auth
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket.IO connected:", socket.id);
      setWsReady(true);
    });

    // ✅ Listen for online users (was messageData.online)
    socket.on("online", (onlineUsers) => {
      showOnlinePeople(onlineUsers);
    });

    // ✅ Listen for incoming messages (was messageData.text)
 socket.on("message", (messageData) => {
  if (messageData.sender === selectedUserIdRef.current) {
    setMessagesMap((prev) => ({
      ...prev,
      [selectedUserIdRef.current]: [
        ...(prev[selectedUserIdRef.current] || []),
        messageData,
      ],
    }));
  }
});

    socket.on("disconnect", () => {
      console.log("❌ Socket.IO disconnected");
      setWsReady(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket.IO error:", err.message);
    });

    return () => {
      socket.off("online");
      socket.off("message");
      // ✅ Don't disconnect — let it persist across renders
    };
  }, [userDetails?._id, showOnlinePeople]);

  // Fetch offline people
  useEffect(() => {
    if (!userDetails?._id) return;
    api.get("/user/people").then((res) => {
      const offlinePeopleArr = res?.data
        .filter((p) => p._id !== userDetails._id)
        .filter((p) => !onlinePeople[p._id]);

      setOfflinePeople(
        offlinePeopleArr.reduce((acc, p) => {
          acc[p._id] = p;
          return acc;
        }, {})
      );
    });
  }, [onlinePeople, userDetails?._id]);

useEffect(() => {
  if (!selectedUserId) return;
  
  // ✅ Don't refetch if already cached
  if (messagesMap[selectedUserId]) return;

  api.get(`/user/messages/${selectedUserId}`)
    .then((res) => {
      setMessagesMap((prev) => ({
        ...prev,
        [selectedUserId]: res.data,
      }));
    })
    .catch((err) => console.error("Error fetching messages:", err));
}, [selectedUserId]);

  // Auth check
  useEffect(() => {
    checkAuth();
    if (!isAuthenticated) navigate("/");
  }, []);

  // ✅ Send message
const sendMessage = (ev, mediaData = null) => {
  if (ev) ev.preventDefault();
  if (!mediaData && !newMessage.trim()) return;
  if (!selectedUserId) return;

  const socket = socketRef.current;
  if (!socket?.connected) return;

  const payload = {
    recipient: selectedUserId,
    text: mediaData ? "" : newMessage,
    mediaUrl: mediaData?.mediaUrl || null,
    publicId: mediaData?.publicId || null,
    mediaType: mediaData?.mediaType || null,
  };

  socket.emit("message", payload);

  setMessagesMap((prev) => ({
    ...prev,
    [selectedUserId]: [
      ...(prev[selectedUserId] || []),
      {
        ...payload,
        sender: userDetails._id,
        _id: Date.now(),
      },
    ],
  }));

  if (!mediaData) setNewMessage("");
};

  return (
    <div className="flex min-h-screen bg-black">
      <Nav />
      <OnlineUsersList
        onlinePeople={onlinePeople}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        offlinePeople={offlinePeople}
      />
      <section className="w-[71%] lg:w-[62%] relative pb-10">
        {selectedUserId && (
          <TopBar
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            offlinePeople={offlinePeople}
            onlinePeople={onlinePeople}
          />
        )}
        <ChatMessages
          messages={messages}
          userDetails={userDetails}
          selectedUserId={selectedUserId}
        />
        <div className="absolute w-full bottom-0 flex justify-center items-center">
          <MessageInputForm
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
            selectedUserId={selectedUserId}
          />
        </div>
      </section>
    </div>
  );
};

export default ChatHome;