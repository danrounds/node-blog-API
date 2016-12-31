const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// lets us use THING.should.equal(CORRECT_ANSWER) idiom
const should = chai.should();

// This is what lets us do HTTP request testing
chai.use(chaiHttp);


describe('Blog API', function() {

    // activate server
    before(function() {
        return runServer(); 
    });

    // close server
    after(function() {
        return closeServer(); 
    });

    const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];

    // GET request test -- strategy:
    //  1. make GET request
    //  2. inspect response to see if it has the right status and keys
    it('should list blog posts on GET', function() {
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');

                res.body.length.should.be.at.least(1);

                res.body.forEach(function(item) {
                    item.should.be.a('object');
                    item.should.include.keys(expectedKeys);
                });
            });
    });

})
