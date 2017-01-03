const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const mongoose = require('mongoose');

const {BlogPost} = require('../models');


router.get('/', (req, res) => {
    BlogPost
        .find()
        .limit(10)
    // `exec` returns BlogPosts.find.limit(10) as a promise
        .exec()
        .then(blogPosts => {
            res.json({
                blogPosts: blogPosts.map((blogPost) => blogPost.apiRepr())
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

router.get('/:id', jsonParser, (req, res) => {
    // res.json(BlogPosts.get(req.params.id));
    BlogPost
        .findById(req.params.id)
        // `exec` returns BlogPosts.find.limit(10) as a promise
        .exec()
        .then(blogPost => res.json(blogPost.apiRepr()))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
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
    const requiredFields = ['title', 'content', 'author', 'id'];
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
            id: req.params.id,
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
            publishDate: req.body.publishDate || Date.now()
        });
        return res.json(updatedPost);
    }
});

router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Blog post \`${req.params.id}'`);
    res.status(204).end();
});

module.exports = router;
