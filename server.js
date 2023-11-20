const barbuUsers = {};

const io = require("socket.io")(3000, {
    cors: {
        origin: "http://localhost:3001", 
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("New user is connected : ", socket.id);
    // io.emit("connected", socket.id);
    socket.broadcast.emit("messagetxt", {
        text: `\n\nNew User ${socket.id}.`,
        date: new Date().toISOString(),
        user: "J@rvis",
    });

    socket.on("username", (username) => {
        barbuUsers[socket.id] = username;

        io.emit("connected", username);
        io.emit("users", Object.values(barbuUsers));
    });

    socket.on("send", (message) => {
        socket.emit("message", {
            text: message[0],
            date: new Date().toISOString(),
            user: message[1],
        });
        console.log("Server.js --- Received DATA : ", message[0]);
    });

    socket.on("sendtxt", (message) => {
        io.emit("messagetxt", {
            text: message[0],
            date: new Date().toISOString(),
            user: message[1],
        });
        console.log("Server.js --- ", message[0], " received from ", message[1]);
    });    
});

console.log("Hello World!");