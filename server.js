let express = require('express');
let path = require('path');
let app = express();

let port = process.env.PORT || 8081;

app.use(express.static(path.join(__dirname, "dist")));
// app.use(express.static(path.join(__dirname, "data")));

// set the home page route
// app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	// res.setHeader("Content-Security-Policy", "script-src 'self' https://apis.google.com");
	res.sendFile(path.join(__dirname,'index.html'));
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});