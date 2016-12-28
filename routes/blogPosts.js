const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('../models');

// Need some data to display...
BlogPosts.create('Why So Many?', 'Have you ever noticed there\'s tons of? Well there is. Here\'s why:', 'Dave Stevens', 'Oct 9, 2015');
BlogPosts.create('Red is the Best Color', 'Objective science have proved--using the tools of science--that red is, objectively, the best color. Objectively. Science', 'Jack O\'Lantern', 'Oct 11, 1999');
BlogPosts.create('How to Drink More Water', 'Some people say water is gross. Maybe they\'re right. Maybe they\'re wrong. One thing that\'s for sure is water.', 'Arthur Curry', 'Nov 13, 2015');
BlogPosts.create('How to Add Single Digit Numbers', 'What is "addition," anyway? This article won\'t answer that. We don\'t have the tools. What we do have is a sure-fire way for you to rote-memorize your addition table, in base-10!', 'Jill Nye', 'Jun 27, 2016');


router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

router.get('/:id', jsonParser, (req, res) => {
    res.json(BlogPosts.get(req.params.id));
});

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for (i in requiredFields) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}' in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    let b = req.body;
    const post = BlogPosts.create(b.title, b.content, b.author, b.publishDate);
    res.status(200).json(post);
});



module.exports = router;
