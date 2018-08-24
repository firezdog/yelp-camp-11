var Campground = require('../models/campgrounds');
var Comment = require('../models/comment');

var self = {

    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        }
        req.session.whence = req.originalUrl;
        req.flash('problem','You must be logged in to do that.');
        return res.redirect("/login");
    },

    isCampOwner: (req, res, next) => {
        //cannot replace with self.isLoggedIn b/c the logic is different (next call f--s up the asynchronous calls)
        if (!req.isAuthenticated()) {
            req.flash('problem','You must be logged in to do that.');
            req.session.whence = req.originalUrl;
            return res.redirect("/login");
        }
        var id = req.params.id;
        Campground.findById(id, function(err, campground){
            if(err) {
                req.flash('problem','There was a problem -- sorry.');
                return res.redirect("back");
            } else {
                if (!campground) {
                    req.flash('problem','Campground not found.')
                    return res.redirect('back')
                }
                // needs check for undefined b/c not all cg's have authors (seed)
                if (typeof campground.author == 'undefined' || !campground.author.id.equals(req.user.id)) {
                    req.flash('problem','You are not the owner of this campground.');
                    return res.redirect("back");
                }
            }
            return next();
        });
    },

    isCommentOwner: (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.flash('problem','You must be logged in to do that.');
            req.session.whence = req.originalUrl;
            return res.redirect("/login");
        }
        var commentId = req.params.comment_id;
        Comment.findById(commentId, (err, comment) => {
            if (err) { 
                req.flash('problem','There was a problem, sorry.');
                res.redirect("back"); 
            } 
            else {
                if (!comment) {
                    req.flash('problem','Comment not found.')
                    return res.redirect('back')
                }
                if (!comment.author.id.equals(req.user.id)) { 
                    req.flash('problem','You are not the author of this comment!');
                    return res.redirect("back");
                } else { return next(); }
            }
        });
    }

};

module.exports = self;