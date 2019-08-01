const bcrypt = require('bcryptjs')
module.exports = {
    register: async (req,res)=> {
        console.log(req.body)
        const {username, password, is_admin} = req.body
        const db = req.app.get('db')
        const result = await db.get_user([username])
        if (result.length > 0) {
            return res.status(200).send("Username Taken")
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const registeredUser = await db.register_user([is_admin, username, hash])
        console.log(registeredUser)
        const user = registeredUser[0]
        req.session.user = {is_admin: user.is_admin, username: user.username, password: user.password}
        res.status(201).send(req.session.user)
    }

}