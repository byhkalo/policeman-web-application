const path = require('path');
const express = require('express');
const app = express();

// Serve static files
app.use(express.static(__dirname + '/dist/policeman-web-application'));

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/policeman-web-application/index.html'));
});

// default Heroku port
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log("App is running on port " + port);
});