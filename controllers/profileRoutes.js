const router = require('express').Router();
const { Trips, Users, Images, Comments, Tagged, Locations } = require('../models');
const withAuth = require('../utils/auth');

// Use withAuth middleware to prevent access to route
router.get('/', withAuth, async (req, res) => {
  try {
    const userData = await Users.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Trips,
          include: [
            {
              model: Comments, include: [{ model: Users, attributes: { exclude: ['password', 'email', 'trip_id'] }, order: [['date_created', 'DESC']] },
              { model: Locations }],
            },
            { model: Images, exclude: ['user_id', 'trip_id'] },
            {
              model: Tagged, include: [{ model: Users, attributes: { exclude: ['password', 'email', 'trip'] } }]
            },
          ]
        },
        {
          model: Tagged,
          exclude: ['user_id'],
          include: [{
            model: Trips,
            include: [{ model: Images, attributes: { exclude: ['user_id', 'trip_id'] } }]
          }]
        }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: req.session.logged_in,
      owner: true,
      full_name: req.session.full_name,
      profile_url: req.session.profile_url,
      profile_alt: req.session.profile_alt
    });
  } catch (err) {res.status(500).json(err)};
});

// Route to view another Users Profile
router.get('/:id', async (req, res) => {
    try {
        // If the Users id matches the requested id than the User is redirected to their editable profile
        if (req.params.id === req.session.user_id) {
            window.replace('/');
        } else {
            // Find the User based on the req params whether user or frontend initiated
          const userData = await Users.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [
              {
                model: Trips,
                include: [
                  {
                    model: Comments, include: [{ model: Users, attributes: { exclude: ['password', 'email', 'trip_id'] }, order: [['date_created', 'DESC']] },
                    { model: Locations }],
                  },
                  { model: Images, exclude: ['user_id', 'trip_id'] },
                  {
                    model: Tagged, include: [{ model: Users, attributes: { exclude: ['password', 'email', 'trip'] } }]
                  },
                ]
              },
              {
                model: Tagged,
                exclude: ['user_id'],
                include: [{
                  model: Trips,
                  include: [{ model: Images, attributes: { exclude: ['user_id', 'trip_id'] } }]
                }]
              }],
          });

            const user = userData.get({ plain: true });
            res.render('profile', {
                ...user,
              logged_in: req.session.logged_in,
              owner: false,
              full_name: req.session.full_name,
              profile_url: req.session.profile_url,
              profile_alt: req.session.profile_alt
            });
        }
    } catch (err) {res.status(500).json(err), console.log(err)};
  });

module.exports = router;

// For Coding Purposes Only The User Obj Structure Returns as below

// {
//  id: 'INT' (This is the Users Id #),
//  name: 'String' (This is the Users Name [First Last]),
//  username: 'String',
//  email: 'String',
//  profile_image: 'String/Blob'
//  trips: [
//    {
//      id: 'INT' (This is the Trip id #),
//      name: 'String' (this is the Trip Name),
//      description: 'String',
//      date_created: 'Date',
//      user_id: 'INT',
//      taggedId: null (Cant get this to not show),
//      commentId: null (Cant get this to not show),
//      comments: [Array],
//      Images: [Array]
//}]; 
//};