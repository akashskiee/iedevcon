const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
require('dotenv').config();

// GET API Auth 

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST API Auth Authenticate Users - Login

router.post('/',
 [
    check('email', 'Please include a valid mail').isEmail(),
    check('password', 'Password is required').exists()
],
 async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {name, email, password} = req.body;

    try{
        let user = await User.findOne({email});
        if(!user) {
          return res.status(400).json({errors: [{msg: "Invalid credentials"}]});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({errors: [{msg: "Invalid credentials"}]});
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, process.env.JWT_SECRET,
            {expiresIn: 36000},
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            });

    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }   
});

module.exports = router;