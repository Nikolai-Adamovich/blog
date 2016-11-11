/**
 * BlogInfoController
 *
 * @description :: Server-side logic for managing bloginfoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	change: function (req, res) {
        MainInfo.findOne({id: 1}).exec(function (err, mainInfo) {
            if (mainInfo) {
                MainInfo.update({id: 1}, {pageTitle: req.param('pageTitle'), headerTitle: req.param('headerTitle'), id: 1})
                    .exec(function (err, mainInfo) {
                        res.send(mainInfo);
                    });
            } else {
                MainInfo.create({pageTitle: req.param('pageTitle'), headerTitle: req.param('headerTitle'), id: 1})
                    .exec(function (err, mainInfo) {
                        res.send(mainInfo);
                    });
            }
        })
    }
};

