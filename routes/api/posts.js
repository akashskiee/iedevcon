const express = require('express')
const router = express.Router();

// GET API POSTs

router.get('/', (req, res) => res.send("Posts route"));

module.exports = router;