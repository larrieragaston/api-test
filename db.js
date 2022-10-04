const mongoose = require("mongoose");

main()
	.then((res) => console.log("Connection success"))
	.catch((err) => console.log(err));

async function main() {
	await mongoose.connect(process.env.MONGO_URL);

	// use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}
