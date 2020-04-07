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


module.exports = router;