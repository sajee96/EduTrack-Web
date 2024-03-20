const JWT = require('jsonwebtoken')
const createError = require('http-errors')

module.exports = {
    signAccessToken: (adminId) => {
        return new Promise((resolve, reject) => {
            const payload ={}
            const secret = "some super secret"
            const options = {
            expiresIn: '1h',
            issuer: 'pickurpage.com',
            audience: adminId,
        }
        JWT.sign(payload, secret, options, (err, token) => {
            if(err) reject(err)
            resolve(token)
        })
    })
}
}