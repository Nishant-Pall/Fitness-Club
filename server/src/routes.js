const express = require('express');
const multer = require('multer');
const verifyToken = require("../src/config/verifyToken");

const EventController = require('./controllers/EventController');
const UserController = require('./controllers/UserController');
const DashboardController = require('./controllers/DashboardController');
const LoginController = require('./controllers/LoginController');
const uploadConfig = require('./config/upload');
const RegistrationController = require('./controllers/RegistrationController');
const ApprovalController = require('./controllers/ApprovalController');
const RejectionController = require('./controllers/RejectionController');

// initiate multer with the config
const upload = multer(uploadConfig);
// middleware to import routes from different files
const routes = express.Router();

routes.get('/', (req, res) => {
	res.send({ status: 200 });
});


//

// Registration
routes.post('/registration/:eventId', verifyToken, RegistrationController.create);
routes.get('/registration/:registration_id', verifyToken, RegistrationController.getRegistration);
routes.post('/registration/:registration_id/approvals', verifyToken, ApprovalController.approval);
routes.post('/registration/:registration_id/rejections', verifyToken, RejectionController.rejection);

// Login
routes.post('/login', LoginController.store);

// Dashboard
routes.get('/dashboard', verifyToken, DashboardController.getAllEvents);
routes.get('/dashboard/:sport', verifyToken, DashboardController.getAllEvents);
routes.get('/user/events', verifyToken, DashboardController.getEventsByUserId);
routes.get('/event/:eventId', verifyToken, DashboardController.getEventById);

// Event
// grab file from request
routes.post('/event', verifyToken, upload.single("thumbnail"), EventController.createEvent);
routes.delete('/event/:eventId', verifyToken, EventController.deleteEvent);


// User
routes.post('/user/register', UserController.createUser);
routes.get('/user/:userId', UserController.getUserById);

module.exports = routes;
