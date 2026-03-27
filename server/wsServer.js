import  { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

import Message from "./models/messageModel.js";
import {User}  from "./models/userModel.js"

export const createWebSocketServer=(server)=>{
    const wss=new WebSocketServer({server});
    wss.on("connection",(connection,req)=>{
        const notifyAboutOnlinePeople=async()=>{
            const onlineUsers=await Promise.all(
                Array.from(wss.clients).map(async(client)=>{
                  const { userId, username } = client;
          const user = await User.findById(userId);
          const avatarLink = user ? user.avatarLink : null;
      return { userId, username,avatarLink};
                })
            );

            [...wss.clients].forEach((client)=>{
                client.send(JSON.stringify({online:onlineUsers}));
            });
             console.log("Online Users:", onlineUsers);
        }
            connection.isAlive = true;
connection.timer=setInterval(()=>{
    connection.ping();
    connection.deathTimer=(setTimeout(()=>{
        connection.isAlive=false;
        clearInterval(connection.timer);
        connection.terminate();
        notifyAboutOnlinePeople();
        console.log("dead");
    }),1000)
},5000)

  connection.on("pong", () => {
      clearTimeout(connection.deathTimer);
    });

  const cookies = req.headers.cookie;

if (cookies) {
  const tokenString = cookies
    .split(";")
    .find((str) => str.trim().startsWith("authToken="));

  if (tokenString) {
    const token = tokenString.split("=")[1];

jwt.verify(token, process.env.KEY, {}, async (err, userData) => {
  if (err) {
    console.log("JWT Error:", err);
    return;
  }

  const { id } = userData;

  const user = await User.findById(id);

  connection.userId = user._id;
  connection.username = user.firstName + " " + user.lastName;


       notifyAboutOnlinePeople();
    });
  }
}

connection.on("message",async(message)=>{
    const messageData=JSON.parse(message.toString());
    const {recipient,text}=messageData;
    const msg= await Message.create({
        sender:connection.userId,
        recipient,
        text
    })
       if (recipient && text) {
        [...wss.clients].forEach((client) => {
          if (client.userId === recipient) {
            client.send(
              JSON.stringify({
                sender: connection.username,
                text,
                id: msg._id,
              })
            );
          }
        });
      }


})


    // Sending online user list to all clients
   

        
    })

  
}