const express = require('express');
const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => res.send("Hello World"));

app.listen(port, () => console.log(`Server started at ${port}`));