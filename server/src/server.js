const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require('./routes');
const path = require("path");
const http = require('http');
const PORT = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST", "DELETE"]
	}
});

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

try {
	mongoose.connect(process.env.MONGO_DB_CONNECTION, ({
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}));
	console.log('MondoDB connected');
} catch (err) {
	console.error(err.message);
}

const connectedUsers = {};

// everytime a user is connected, we store the socket id
io.on('connection', socket => {
	const { user } = socket.handshake.query;
	connectedUsers[user] = socket.id;
});

app.use((req, res, next) => {
	req.io = io;
	req.connectedUsers = connectedUsers;

	return next();
});
app.use(cors());
app.use(express.json());
// serve image using express
app.use("/files", express.static(path.resolve(
	__dirname,
	"..",
	"files"
)));

app.use(routes);

server.listen(PORT, () => {
	console.log(`LISTENING TO ${PORT}`);
});