const express = require('express')
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');


// POST api/posts private

router.post('/', [auth, [
    check('text', 'Text is required').notEmpty()
]],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post( {
            text : req.body.text,
            name : user.name,
            avatar : user.avatar,
            user: req.user.id
        });
        
        const  post = await newPost.save();
        res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).status('Server Error');
    }
    
});


// GET all posts api/posts private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).status('Server Error');
    }
});

// GET  posts by id api/posts/:post_id private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg: 'Post not found'})
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if(err.name == 'CastError'){
            return res.status(404).json({msg: 'Post not found'})
        }
        res.status(500).status('Server Error');
    }
});

// Delete  posts by id api/posts/:post_id private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({msg: 'Post not found'})
        }
        
        //Check user
        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'User not authorized'});
        }
        await post.remove();
        res.json({msg: 'Post deleted'});

    } catch (err) {
        console.error(err.message);
        if(err.name == 'CastError'){
            return res.status(404).json({msg: 'Post not found'})
        }
        res.status(500).status('Server Error');
    }
});

// PUT  like post by id api/posts/like/:id private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Check if user has already like
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({msg: 'Post already liked'});
        }
        post.likes.unshift({ user: req.user.id});

        await post.save();

        res.json(post.likes)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT  unlike post by id api/posts/unlike/:id private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Check if user has already like
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({msg: 'Post not liked'});
        }
        
        //Get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1)

        await post.save();

        res.json(post.likes)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST create comment api/posts/comment/:id private

router.post('/comment/:id', [auth, [
    check('text', 'Comment is required').notEmpty()
]],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);


        const newComment =  {
            text : req.body.text,
            name : user.name,
            avatar : user.avatar,
            user: req.user.id
        };

        post.comments.unshift(newComment);
        await post.save();

        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).status('Server Error');
    }
    
});

// DELETE comment api/posts/comment/:id/:comment_id private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Pull out comment
        const comments = await post.comments.find(comment => comment.id === req.params.comment_id);
        
        //Make sure comment exists
        if(!comments) {
            return res.status(404).json({msg: 'Comment does not exists'});
        }

        //Check user
        if(comments.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'User not authorized'});
        }
         //Get remove index
         const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
         post.comments.splice(removeIndex, 1)
 
         await post.save();
 
         res.json(post.comments)

    } catch (err) {
        console.error(err.message);
        res.status(500).status('Server Error'); 
    }
});


module.exports = router;