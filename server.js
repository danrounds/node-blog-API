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

app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app's listening on port ${process.env.PORT || 8080}`);
});
