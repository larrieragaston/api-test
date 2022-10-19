const jwt = require("jsonwebtoken");

async function generateUserAndToken(req, user) {
	const role = await req
		.model("Role")
		.findById(user.role)
		.populate("permissions")
		.exec();
	const permissions = role.permissions.map(({ _id }) => _id);

	const payload = {
		_id: user._id,
		role: role.name,
		organization: user.organization,
		permissions,
	};

	const userResponse = {
		_id: user._id,
		organization: user.organization,
		role: role.displayName,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		publicId: user.publicId,
		permissions,
	};

	if (role.name === "patient") {
		userResponse.patient = user._id;
		payload.patient = user._id;
	}

	if (role.name === "doctor") {
		userResponse.doctor = user.doctor;
	}

	const privateKey = await req.secrets.get(req.config.auth.key);

	const token = jwt.sign(payload, privateKey, {
		subject: user._id.toString(),
		issuer: req.config.auth.token.issuer,
		algorithm: req.config.auth.token.algorithm,
		expiresIn: role.audience.includes("app")
			? req.config.auth.token.appExpiresIn
			: req.config.auth.token.dashboardExpiresIn,
		audience: role.audience,
	});

	return { token, user: userResponse };
}

module.exports = generateUserAndToken;
