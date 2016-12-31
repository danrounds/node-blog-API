const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('../models');

// Need some data to display. Dates are not in any kind of uniform format.
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
    for (let i in requiredFields) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}' in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    let b = req.body;
    const post = BlogPosts.create(b.title, b.content, b.author, b.publishDate);
    res.status(201).json(post);
});

router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate', 'id'];
    for (let i in requiredFields) {
        let field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}' in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
        if (req.params.id !== req.body.id) {
            const message = `Request path id (${req.params.id}) and request body `
                      + `id (${req.body.id}) must match.`;
            console.error(message);
            return res.status(400).send(message);
        }
        console.log(`Updating blog post, ${req.params.id}`);
        const updatedPost = BlogPosts.update({
            id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
            publishDate: req.body.publishDate || Date.now()
        });
        res.status(204).json(updatedPost);
    }
});

router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Blog post \`${req.params.id}'`);
    res.status(204).end();
});

module.exports = router;
