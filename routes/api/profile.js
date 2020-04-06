const express = require('express')
const router = express.Router();

// GET API Profile

router.get('/', (req, res) => res.send("Profile route"));

module.exports = router;