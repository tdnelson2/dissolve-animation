const fs =  require('fs');
const uglifycss = require('uglifycss');

fs.writeFile('dist/css/styles.min.css', uglifycss.processFiles(['src/lib/src/styles.css']));