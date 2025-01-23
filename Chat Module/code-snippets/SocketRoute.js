const SocketClient = require("socket.io");
const Controller = require("./controller");
require("dotenv").config();

module.exports = async (server) => {
  // Setting up socket.io with server and enabling CORS from the auth URL
  const io = SocketClient(server, {
    origin: "*", // Allow all origins (you might wanna change this for production)
    cors: process.env.NEXT_PUBLIC_AUTH_URL, // CORS configuration using an env variable
  });

  // Use authentication middleware before allowing socket connections
  io.use(Controller.auth);

  // Handle new connections to the server
  io.on("connection", (Socket) => {
    // Handle "handshake" event to start a new connection
    Socket.on("handshake", async (data) => 
      Controller.GenerateHandshake(Socket, io, data)
    );

    // Handle "handshake_single" event for single-user handshake
    Socket.on("handshake_single", async (data) => 
      Controller.GenerateHandshakeSingle(Socket, io, data)
    );

    // Handle sending messages between users
    Socket.on("send_message", async (data) => 
      Controller.SendMessage(Socket, io, data)
    );

    // Handle sending a single message to one user
    Socket.on("send_message_single", async (data) => 
      Controller.SendMessageSingle(Socket, io, data)
    );

    // Retrieve messages for a user or conversation
    Socket.on("retrieve_message", async (data) => 
      Controller.GetMessages(Socket, io, data)
    );

    // Get the header info of a specific chat (e.g., participants, metadata)
    Socket.on("chat_header", async (data) => 
      Controller.GetChatHeader(Socket, io, data)
    );

    // This event is commented out, but could be used to get the number of chats
    // Socket.on("get_chat_count", async (data) => {
    //   Controller.GetChatCount(Socket, io, data);
    // });
  });
};

