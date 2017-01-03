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

    const requiredFields = ['title', 'author', 'content'];
    requiredFields.forEach(field => {
        if (!(field in req.body && req.body[field])) {
            return res.status(400).json({message: `Must specify value for ${field}`});
        };
    });

    BlogPost
        .create({
            title: req.body.title,
            author: req.body.author,
            content: req.body.content
        })
        .then( blogPost => res.status(201).json(blogPost.apiRepr()) )
        .catch(err => {
            console.error(err);
            let message = 'Internal server error';
            if (err.name === 'ValidationError') {
                message = `${err.name}. \'${err.message}\' Check the API docs for data format`;
            }
            res.status(500).json({message: message});
        });
});

router.put('/:id', jsonParser, (req, res) => {

    if (!(req.params && req.body.id && req.params.id === req.body.id)) {
        const message = `Reqest path id (${req.params.id}) and request body id`
                  + ` (${req.body.id} must match)`;
        console.error(message);
        res.status(400).json({message: message});
    }

    const toUpdate = {};
    const updateableFields = ['id', 'title', 'author', 'content'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    BlogPost
        .findByIdAndUpdate(req.params.id, {$set: toUpdate})
        .exec()
        .then(restaurant => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/:id', (req, res) => {
    BlogPost.delete(req.params.id);
    console.log(`Blog post \`${req.params.id}'`);
    res.status(204).end();
});

module.exports = router;
