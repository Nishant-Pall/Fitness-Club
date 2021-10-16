const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
	title: String,
	description: String,
	price: Number,
	sport: String,
	thumbnail: String,
	date: Date,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
}, {
	toJSON: {
		// apply virtual getters
		virtuals: true
	}
});

// returns the hosted url in the server for the thumbnail
// normal function because this will make reference to the object
// and not the global scope
EventSchema.virtual("thumbnail_url").get(function () { return `localhost:8000/files/${this.thumbnail}`; });

module.exports = mongoose.model('Event', EventSchema);