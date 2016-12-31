const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

const blogPostsRouter = require('./routes/blogPosts');

// basic logging of HTTP transactions
app.use(morgan('common'));

//handles our CRUD
app.use('/blog-posts', blogPostsRouter);

// runServer and closeServer exist primarily for test purposes. The server
// object here is to that end
let server;

// starts our server and returns a promise.
function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
        try {
            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve();
            });
        } catch (err) {
            reject(err);
        }
    });
}

// closes server; returns a promise
function closeServer() {
    return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

// if server.js is called directly (i.e, with `node server.js`), this block
// runs but we also export the runServer command so other code (for instance,
// test code) can start the server as needed.
if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
