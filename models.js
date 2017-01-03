// This is our database schema and "object model."
// Core parts are:
//  1. Schema (`blogPostSchema')
//  2. A JSON representation of our individual database entries, which our API
//     will return

const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
  },
  content: {type: String, required: true}
});


function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}

blogPostSchema.virtual('authorString').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`;
});

// instance method for the database blog post objects that Mongo returns/stores
// Converts our database representation into the end-user-acceptable
// representation returned by our API.
blogPostSchema.methods.apiRepr = function() {
 return {
    id: this._id,
    title: this.title,
    author: this.authorString,
    content: this.content
  };
};

const BlogPost = mongoose.model('blog-post', blogPostSchema);

module.exports = {BlogPost};
