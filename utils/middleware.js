const jwt = require("jsonwebtoken")
const User = require("../models/user")

const getToken = (request, response, next) => {
	const authorization = request.get("authorization")
	if (authorization && authorization.startsWith("Bearer ")) {
		request.token = authorization.replace("Bearer ", "")
	}

	next()

}

const getUser = async (request, response, next) => {
	if (request.method === "POST" || request.method === "DELETE") {
		const verifiedToken = jwt.verify(request.token, process.env.SECRET)

		if(verifiedToken) {
			if (!verifiedToken.id) {
				return response.status(401).json({ error: "token invalid" })
			}
			const thisUser = await User.findById(verifiedToken.id)
			request.user = thisUser
		}
	}

	next()

}

const errorHandler = (error, request, response, next) => {

	if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message })
	} else if (error.name ===  "JsonWebTokenError") {
		return response.status(401).json({ error: error.message })
	} else if (error.name === "TokenExpiredError") {
		return response.status(401).json({ error: "token expired" })
	}

	next(error)

}

module.exports = {
	getUser,
	getToken,
	errorHandler
}