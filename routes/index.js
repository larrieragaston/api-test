var express = require("express");
var router = express.Router();
const pkg = require("../package.json");

/* GET home page. */
router.get("/", function (req, res, next) {
	const respuesta = {
		name: pkg.name,
		version: pkg.version,
		enviroment: process.env.ENV,
	};
	res.send(respuesta);
});

module.exports = router;
