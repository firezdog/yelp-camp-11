/* 
    {host}://campgrounds/:id/comments/...
*/

var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campgrounds');
var Comment = require('../models/comment');
var check = require('../middleware');

//NEW COMMENT
router.get("/new", check.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            req.flash('problem','Problem finding campground.')
            res.redirect('back')
        } else {
        res.render("comments/new", {campground: campground});
        }
    });
});

//CREATE COMMENT
router.post("/", check.isLoggedIn, function(req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            req.flash('problem', 'Problem finding campground.')
            res.redirect('back')
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash('problem', 'Problem adding comment.')
                    res.redirect('back');
                } else {
                    // first add username and id
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                }
                //redirect
                res.redirect(`/campgrounds/${req.params.id}`);
            });
        }
    });
});

//EDIT COMMENT (FORM)
router.get("/:comment_id/edit", check.isCommentOwner, function(req,res){
    const campId = req.params.id;
    const commentId = req.params.comment_id;
    Campground.findById(campId, function(err, campground){
        if(err){
            req.flash('problem', 'Problem finding campground.')
            res.redirect("back");
        } else {
            Comment.findById(commentId, function(err, comment){
                if(err){
                    req.flash('problem', 'Problem finding comment.')
                    res.redirect('back')
                } else {
                    res.render("comments/edit", {comment,campground});
                }
            });
        }
    });
});

//EDIT COMMENT (POST DATA)
router.put("/:comment_id/update", check.isCommentOwner, function(req,res){
    const campId = req.params.id;
    const commentId = req.params.comment_id;
    Comment.findByIdAndUpdate(commentId, req.body.comment, function(err){
        if(err){
            req.flash('problem', 'Problem finding comment.')
            res.redirect("back");
        } else {
            res.redirect(`/campgrounds/${campId}`);
        }
    });
});

//DELETE COMMENT
router.delete("/:comment_id/delete", check.isCommentOwner, function(req,res){
    const campId = req.params.id;
    const commentId = req.params.comment_id;
    Comment.findByIdAndRemove(commentId, function(err){
        if(err){
            req.flash('problem','Problem removing comment.')
            res.redirect("back");
        } else {
            req.flash('greeting','Comment deleted.')
            res.redirect(`/campgrounds/${campId}`);
        }
    });
});

module.exports = router;