const express = require('express')
const router = express.Router();

// GET API Users

router.get('/', (req, res) => res.send("User route"));

module.exports = router;