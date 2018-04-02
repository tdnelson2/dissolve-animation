
//Install express server
const express = require('express');
const app = express();
const path = require('path');

// Serve only the static files form the dist directory
app.use(express.static(path.join(__dirname, '../example-project-angular/dist')));

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 4000);