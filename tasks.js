const express = require('express');
const app = express();
//define a port on which it should listen too
const port = 3000;



app.listen(port, () => {
    console.log('Listening on port: ', port)
});