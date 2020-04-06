const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const {check, validationResult} = require('express-validator');
const Profile = require('../../models/Profile');


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

    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

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

    
    res.send('Test');
})

module.exports = router;