const router = require('express').Router();
const { Trips, Images, Tagged, Users } = require('../../models');
const withAuth = require('../../utils/auth');
// const remoteConnect = require('../../utils/remoteConnect');
const remoteConnect = '';
const multer = require('multer');
const upload = multer();

// GET all Trips
router.get('/', async (req, res) => {
  try {
    const tripData = await Trips.findAll();
    const trips = tripData.map((trip) => trip.get({ plain: true }));

    res.status(200).json(trips);
  } catch (err) {
    return res.status(404).json(err);
  }
});

// GET Trip by id
router.get('/:id', async (req, res) => {
  try {
    const tripData = await Trips.findByPk(req.params.id);

    if (!tripData) {
      return res.status(404).json({ message: 'No Trips found with that id!' });
    }

    res.status(200).json(tripData);
  } catch (err) {
    return res.status(404).json(err);
  }
});

// CREATE a new Trip
router.post('/', upload.any(), async (req, res) => {
  try {
    // files is a standard variable that comes in the request.
    const { body, files } = req;
    let result = await remoteConnect.saveFiles(files);

    // Assuming the body uses our naming conventions
    let newTrip = {
      name: `${body.tripName}`,
      description: `${body.tripDescription}`,
      user_id: `${req.session.user_id}`,
    };

    const tripData = await Trips.create(newTrip);
    const trip = tripData.get({ plain: true });
    let tagFriends = await body.tagUsers
      .split(',')
      .map((element) => element.trim());

    // Add tagged friends to the trip
    for (let i = 0; i < tagFriends.length; i++) {
      let userData = await Users.findOne({
        where: { username: tagFriends[i] },
      });
      if (userData) {
        const user = userData.get({ plain: true });
        const aTag = {
          user_id: user.id,
          trip_id: trip.id,
        };
        await Tagged.create(aTag);
      }
    }

    // Add any trip image to the trip
    for (let i = 0; i < result.length; i++) {
      let imageData = {
        image: `https://drive.google.com/uc?export=view&id=${result[i].file_id}`,
        image_name: `${result[i].filename}`,
        description: `${trip.description}`,
        user_id: req.session.user_id,
        trip_id: trip.id,
      };

      await Images.create(imageData);
    }
    console.log(trip);
    res.status(200).json(trip);
  } catch (err) {
    res.status(400).json(err), console.log(err);
  }
});

// UPDATE a Trip
router.put('/:id', async (req, res) => {
  try {
    const TripData = await Trips.update(req.body, {
      where: { id: req.params.id },
    });

    if (!TripData) {
      return res
        .status(404)
        .json({ message: 'No Location found with that id!' });
    }

    res.status(200).json(TripData);
  } catch (err) {
    res.status(404).json(err);
  }
});

// DELETE a Trip
router.delete('/:id', async (req, res) => {
  try {
    const TripData = await Trips.destroy({ where: { id: req.params.id } });

    if (!TripData) {
      return res.status(404).json({ message: 'No Trip found with this id!' });
    }

    res.status(200).json(TripData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
