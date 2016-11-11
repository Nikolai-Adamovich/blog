/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            bcrypt.compare(password, user.password, function(err, res) {
                if (res) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

module.exports = {
    createUser: function (req, res) {
        var errorMessage = {message: []};

        if(!req.param('username') || req.param('username').length < 4) {
            errorMessage.message.push('Username is too short. It must have 4 or more symbols.');
        }
        if(!req.param('email')) {
            errorMessage.message.push('E-mail field is empty');
        }
        if(!req.param('password') || req.param('password').length < 5) {
            errorMessage.message.push('Password is too short. It must have 5 or more symbols.');
        }
        User.findOne({username: req.param('username')}, function(err, user) {
            if (err) {
                return res.send(err);
            }
            if (user) {
                errorMessage.message.push('Username "' + req.param('username') + '" is already registered');
            }
            User.findOne({email: req.param('email')}, function(err, email) {
                if (err) {
                    return res.send(err);
                }
                if (email) {
                    errorMessage.message.push('E-mail "' + req.param('email') + '" is already registered');
                }
                if (errorMessage.message.length > 0) {
                    res.status(400);
                    return res.send(errorMessage);
                }

                var newUser = {username: req.param('username'), email: req.param('email'), password: req.param('password')};
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err, hash) {
                        newUser.password = hash;
                        User.create(newUser, function (err, user) {
                            if (err) {
                                res.status(400);
                                return res.send(err);
                            }
                            return res.send(user);
                        });
                    });
                });
            });
        });
    },
    login: function (req, res) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                res.status(400);
                return res.send(err);
            } else if (!user) {
                res.status(400);
                return res.send(info);
            } else {
                req.login(user, function(err) {
                    if (err) {
                        res.status(400);
                        return res.send(info);
                    } else {
                        return res.send(user);
                    }
                });
            }
        })(req, res);
    },
    logout: function (req, res) {
        req.logout();
        res.send({message: ['You have been logged out.', 'See you later, ' + req.param('username') + '.']});
    },
    isAuthenticated: function(req, res) {
        if (req.isAuthenticated()) {
            return res.send({username: req.user[0].username, email: req.user[0].email, createdAt: req.user[0].createdAt, id: req.user[0].id});
        }
        else {
            res.status(401);
            return res.send({message: 'You are not authenticated.'});
        }
    },
    addPost: function (req, res) {
        User.findOne(req.param('author'), function (err, user) {
            var response = {};
            if (err) {
                res.status(400);
                return res.send(err);
            }
            if (user) {
                user.posts.add({header: req.param('header'), article: req.param('article')});
                user.save(function (err) {
                    if (err) {
                        res.status(400);
                        return res.send(err);
                    }
                    User.findOne(req.param('author')).populate('posts').exec(function (err, posts) {
                        if (err) {
                            res.status(400);
                            return res.send(err);
                        }
                        var currentPost = posts.posts[posts.posts.length - 1];
                        return res.send({author: posts.username, header: currentPost.header, article: currentPost.article, createdAt: currentPost.createdAt, updatedAt: currentPost.updatedAt, id: currentPost.id});
                    });
                });
            }
        });
    },
    getCount: function (req, res) {
        User.count().exec(function (err, count) {
            if (err) {
                res.status(400);
                return res.send(err);
            }
            return res.send({count: count});
        })
    },
    getNameById: function (req, res) {
        User.findOne({id: req.param('id')}).exec(function (err, user) {
            return res.send({login: user.login});
        });
    }
};
