var express = require("express");
const User = require("../schemas/users");
var router = express.Router();

/* GET users listing. */
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

async function getAllUsers(req, res, next) {
	const users = await User.find({});
	res.send(users);
}

async function getUserById(req, res, next) {
	console.log("getUserById with id: ", req.params.id);

	if (!req.params.id) {
		res.status(404).send("Id not found");
	}

	console.log(
		"El usuario que se esta intentando de buscar es el qeu tiene el id: ",
		req.params.id
	);

	const user = await User.findById(req.params.id);

	if (!user) {
		res.status(404).send("user not found");
	}

	res.send(user);
}

function createUser(req, res, next) {
	console.log("createUser: ", req.body);

	const user = req.body;

	// TODO: create user

	res.send(`User created :  ${user.email}`);
}

function deleteUser(req, res, next) {
	console.log("deleteUser with id: ", req.params.id);

	if (!req.params.id) {
		res.status(500).send("The param id is not defined");
	}
	// TODO: delete user

	res.send(`User deleted :  ${req.params.id}`);
}

function updateUser(req, res, next) {
	console.log("updateUser with id: ", req.params.id);

	const user = req.body;

	// TODO: update user

	res.send(`User updated :  ${user.email}`);
}

module.exports = router;
