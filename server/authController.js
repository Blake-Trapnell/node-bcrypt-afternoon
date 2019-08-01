const bcrypt = require('bcryptjs')
module.exports = {
    register: async (req,res)=> {
        // console.log(req.body)
        const {username, password, is_admin} = req.body
        const db = req.app.get('db')
        const result = await db.get_user([username])
        if (result.length > 0) {
            return res.status(409).send("Username Taken")
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const registeredUser = await db.register_user([is_admin, username, hash])
        console.log(registeredUser)
        const user = registeredUser[0]
        req.session.user = {is_admin: user.is_admin, username: user.username, password: user.password}
        res.status(201).send(req.session.user)
    },
    login: async (req,res) => {
        const { username, password } = req.body
        req.app.get('db')
        const foundUser = await db.get_user([username])
        const user = foundUser[0]
        if (foundUser.length === 0) {
            return  res.status(401).send('incorrect username and/or password, "username not found"')
        }
        const isAuthenticated = bcrypt.compareSync(password, user.hash)
        if (isAuthenticated === false) {
           return res.status(403).send('incorrect username and/or password, "incorrect password"')
        }
        else {
            req.session.user = { isAdmin: user.is_admin, id: user.id, username: user.username };
            return res.send(req.session.user)
        }
    }

}