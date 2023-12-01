const router = require('express').Router();
const { Trips, Users, Images, Comments, Tagged} = require('../models');
const withAuth = require('../utils/auth');

// Route to view a Trip Page
router.get('/:id', async (req, res) => {
    try {
        // Find the Trip based on the req params whether user or frontend initiated
        const tripData = await Trips.findByPk(req.params.id, {
            include: [ 
                {model: Users, attributes: {exclude: ['password']}},
                {model: Tagged, right: true, 
                    include: {model: Users, attributes: {exclude: ['password']}},
                },
                {model: Images, right: true},
                {model: Comments, required: false,
                    include: {model: Users, attributes: {exclude: ['password']}},
                },
            ],
        });

        const trip = tripData.get({ plain: true });
        if (trip.comments.length > 0) {
            for (let i = 0; i < trip.comments.length; i++) {
                let comment = trip.comments[i];
                comment.isAllowed = comment.user_id === req.session.user_id;
            }
        }

        res.render('Trip', {
            ...trip,
            logged_in: req.session.logged_in,
            full_name: req.session.full_name,
            profile_url: req.session.profile_url,
            profile_alt: req.session.profile_alt, 
        });
    } catch (err) {res.status(500).json(err), console.log(err)};
});

module.exports = router;
