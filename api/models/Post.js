/**
 * Post.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
        header: {
            type: 'string',
            required: true
        },
        article: {
            type: 'string',
            required: true
        },
        createdAt: {
            type: 'datetime'
        },
        updatedAt: {
            type: 'datetime'
        },
        id: {
            type: 'integer',
            autoIncrement: true,
            unique: true,
            primaryKey: true
        },
        author: {
            model: 'user'
        },
        toJSON: function () {
            var post = this.toObject();
            post.author = post.author.username;
            return post;
        }
    }
};

