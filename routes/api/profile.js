const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth');

const {check, validationResult} = require('express-validator');
const normalize = require('normalize-url');

const Profile = require('../../models/Profile');
const User = require('../../models/User');


// GET API Current User Profile



router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']);
        if(!profile) {
            return res.status(400).json({msg: 'There is no profile for this user'});
        }
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST API Create/ Update Current User Profile

router.post('/', [auth, [
    check('status', 'Status is required').notEmpty(),
    check('skills', 'Skills is required').notEmpty()
]
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        medium,
        facebook,
        twitter,
        instagram,
        linkedin,
        github            
    } = req.body;

    const profileFields = {
        user: req.user.id,
        company,
        location,
        website: website === '' ? '' : normalize(website, { forceHttps: true }),
        bio,
        skills: Array.isArray(skills)
          ? skills
          : skills.split(',').map(skill => ' ' + skill.trim()),
        status,
        githubusername
      };

    //Social object

    profileFields.social = {}
    if(medium) profileFields.social.medium = medium;
    if(facebook) profileFields.social.facebook = facebook;
    if(twitter) profileFields.social.twitter = twitter;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(github) profileFields.social.github = github;

    try {
        let profile = await Profile.findOne({user: req.user.id});

        if(profile) {
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id}, 
                {$set: profileFields },
                {new: true}
                );
                return res.json(profile);
        }

        //create

        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile);

    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

//GET All profile Public route

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//GET   Public profile  by /api/profile/user/:user_id

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        if(!profile) res.status(400).json({msg: 'Profile not found'});
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.name == 'CastError'){
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.status(500).send('Server error');
    }
});

//DELETE  profile, User, Post 

router.delete('/', auth, async (req, res) => {
    try {
        //Remove profile
        await Profile.findOneAndRemove({user: req.user.id});
        //
        await User.findOneAndRemove({_id: req.user.id});
        res.json({msg: 'User Deleted'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//PUT profile experience /profile/experience

router.put('/experience', [auth, [
    check('title', 'Title is required').notEmpty(),
    check('company', 'Company is required').notEmpty(),
    check('from', 'From date is required').notEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({user: req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//DELETE profile experience /profile/experience/:exp_id

router.delete('/experience/:exp_id', auth , async (req, res) => {
    try{
        const profile = await Profile.findOne({ user: req.user.id})

        const removeIndex = profile.experience.map(item => item.id).indexOf
        (req.params.exp_id);
        profile.experience.splice(removeIndex, 1);

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.mesage);
        res.status(500).send('Server Error');
    }
});

//PUT profile education /profile/education

router.put('/education', [auth, [
    check('school', 'School is required').notEmpty(),
    check('degree', 'Degree is required').notEmpty(),
    check('fieldofstudy', 'Field of study is required').notEmpty(),
    check('from', 'From date is required').notEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;
    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({user: req.user.id});
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//DELETE profile education /profile/education/:edu_id

router.delete('/education/:edu_id', auth , async (req, res) => {
    try{
        const profile = await Profile.findOne({ user: req.user.id})

        const removeIndex = profile.education.map(item => item.id).indexOf
        (req.params.edu_id);
        profile.education.splice(removeIndex, 1);

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.mesage);
        res.status(500).send('Server Error');
    }
});

module.exports = router;