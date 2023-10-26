const getToken = (request, response, next) => {  
    const authorization = request.get('authorization') 
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    }

    next()

}

const errorHandler = (error, request, response, next) => {

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name ===  'JsonWebTokenError') {
        return response.status(401).json({ error: error.message })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({error: 'token expired'})
    }
    
    next(error)

}

module.exports = {
    getToken,
    errorHandler
}