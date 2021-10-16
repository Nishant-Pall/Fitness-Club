const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
	async createUser(req, res) {
		try {
			const { firstName, lastName, password, email } = req.body;

			// if user already exists
			const existentUser = await User.findOne({
				email
			});

			// if we dont have existing user, create new one
			if (!existentUser) {
				const hashedPassword = await bcrypt.hash(password, 10);
				const userResponse = await User.create({
					firstName,
					lastName,
					password: hashedPassword,
					email
				});

				return jwt.sign({ user: userResponse }, 'secret', (err, token) => {
					return res.json({
						user: token,
						user_id: userResponse._id
					});
				});
			}
			else {
				return res.status(400).json({
					message: "Email already exists! do you want to login instead?"
				});
			}
		} catch (error) {
			throw Error(
				`Error while registering new user:${error}`
			);
		}
	},
	async getUserById(req, res) {
		const { userId } = req.params;
		try {
			const user = await User.findById(userId);
			return res.send(user);
		} catch (error) {
			return res.status(400).json({
				message: "User ID does not exist! do you want to login instead?"
			});
		}
	}
};