const axios = require("axios");
require("dotenv").config();

// Simple error notification function to emit error messages
const errorNotify = (socket, io, error) => {
  io.to(socket?.id).emit("notify_error", error); // Emits an error notification to the specific socket
};

const NEXT_URL = process.env.NEXT_PUBLIC_AUTH_URL; // Get the auth URL from environment variables

module.exports = {
  // Authentication middleware to verify the user's token
  auth: async (socket, next) => {
    const userID = socket?.handshake?.headers?.token; // Get the token from the socket's handshake headers
    socket.userData = { userId: userID }; // Attach userId to the socket object
    const payload = { token: userID }; // Prepare the payload with the token

    // Send the token to the backend to verify user
    axios.post(`${NEXT_URL}/api/chat/auth`, payload).then((res) => {
      if (res?.data?.success) {
        socket.userRole = res?.data?.data?.userRole; // Store user role in the socket if successful
        next(); // Proceed with the connection
      } else {
        return; // If authentication fails, just stop here (no connection)
      }
    });
  },

  // Generate handshake for connecting a user to a specific room
  GenerateHandshake: async (socket, io, data) => {
    try {
      let { userId } = socket?.userData; // Get userId from socket's user data
      axios
        .post(`${NEXT_URL}/api/chat/handshake`, {
          userRole: socket?.userRole, // Send user role
          userId, // Send userId
          roomId: data?.room, // Send room ID
          case_id: data?.case_id, // Send case ID if provided
        })
        .then((res) => {
          if (res?.data?.success) {
            socket?.join(res?.data?.data?.roomID); // Join the room if successful
            // Emit a success message to the room
            io?.to(res?.data?.data?.roomID).emit("connection_listner", {
              message: `Connected Room ${res?.data?.data?.roomID} successfully`,
            });
          }
        })
        .catch((err) => {}); // Empty catch for now (could be useful for debugging)
    } catch (error) {
      errorNotify(error); // Notify the client of an error
      io?.to(socket?.id).emit("handshake_error", {
        message: error?.message || "Internal server error", // Provide a generic error message
      });
    }
  },

  // Handle sending a message
  SendMessage: async (socket, io, data) => {
    try {
      // Get the model for the user based on role (client, lawyer, expert)
      const GetModel = (key) => {
        if (key == "client") {
          return "User";
        }
        if (key == "lawyer") {
          return "Lawyer";
        }
        if (key == "expert") {
          return "Expert";
        }
      };

      let { message, media, link, case_id } = data; // Destructure the message data

      // Send the message data to the backend API
      axios
        .post(`${NEXT_URL}/api/chat/SendMessage`, {
          userRole: socket?.userRole, // Include user role
          userId: socket?.userData?.userId, // Include userId
          case_id, // Include case ID
          message, // The message itself
          media, // Any media attached
          link, // Any link attached
          room: data?.room, // The room ID
        })
        .then((res) => {
          if (res?.data?.success) {
            // Emit the message to the specified room if sent successfully
            io?.to(res?.data?.room).emit("receive_message", {
              data: res?.data?.data,
              senderDetails: res?.data?.senderDetails,
              success: true,
            });
          }
        })
        .catch((err) => {}); // Catch and silently ignore errors (could add logging here)
    } catch (error) {
      errorNotify(error); // Notify client of an error
      io?.to(socket?.id).emit("sendMessage_error", {
        message: error?.message || "Internal server error", // Provide a generic error message
      });
    }
  },

  // Fetch previous messages in a chat
  GetMessages: async (socket, io, data) => {
    try {
      // Request the messages from the backend
      axios
        .post(`${NEXT_URL}/api/chat/getmessages`, {
          userRole: socket?.userRole, // Send user role
          userId: socket?.userData?.userId, // Send userId
          case_id: data?.case_id, // Send case ID
          search: data?.search, // Optional search term
          room: data?.room, // Room ID
        })
        .then((res) => {
          if (res?.data?.success) {
            // Emit the fetched messages back to the room
            io?.to(res?.data?.room).emit("old_messages", {
              data: res?.data?.data?.data,
              Users: res?.data?.data?.Users, // List of users in the room
              message: "Messages fetched successfully", // Success message
              success: true,
            });
          }
        })
        .catch((err) => {}); 
    } catch (error) {
      errorNotify(error); // Notify client of an error
      io?.to(socket?.id).emit("getMessage_error", {
        message: error?.message || "Internal server error", // Generic error message
      });
    }
  },

  // Get the count of unread or unseen chats for the user
  GetChatCount: async (socket, io, data) => {
    try {
      let userId = socket?.userData?.userId; // Get user ID from socket data
      axios.post(`${NEXT_URL}/api/chat/unseen?userId=${userId}`).then((res) => {
        io?.to(socket?.id).emit("chat_count", res?.data?.data); // Emit the chat count to the user
      });
    } catch (error) {
      errorNotify(error); // Notify client of an error
      io?.to(socket?.id).emit("getChatCount_error", {
        message: error?.message || "Internal server error", // Generic error message
      });
    }
  },
};

