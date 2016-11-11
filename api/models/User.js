/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
        username: {
            type: 'string',
            required: true,
            unique: true,
            primaryKey: true
        },
        email: {
            type: 'string',
            email: true,
            required: true,
            unique: true
        },
        password: {
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
            autoIncrement: true
        },
        posts: {
            collection: 'post',
            via: 'author'
        },
        toJSON: function () {
            var user = this.toObject();
            delete user.password;
            //delete user.posts;
            return user;
        }
    }
};

