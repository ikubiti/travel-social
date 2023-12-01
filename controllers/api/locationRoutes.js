const router = require('express').Router();
const { Locations } = require('../../models');
const withAuth = require('../../utils/auth');

// GET all Locations
router.get('/', async (req, res) => {
  try {
    const locationData = await Locations.findAll();
    const locations = locationData.map((location) => location.get({plain: true}));

    res.status(200).json(locations);
  } catch (err) {return res.status(404).json(err), console.log(err)};
})

// GET Location by id
router.get('/:id', async (req, res) => {
  try {
    const locationData = await Locations.findByPk(req.params.id);

    if (!locationData) {return res.status(404).json({message: 'No Location found with that id!'})};

    res.status(200).json(locationData);
  } catch (err) {return res.status(404).json(err)};
})

// CREATE a new Location
router.post('/', async (req, res) => {
  try {
    const newLocation = await Locations.create(
      ...req.body
      //user_id: req.session.user_id,
    );

    res.status(200).json(newLocation);
  } catch (err) {res.status(400).json(err)};
});

// UPDATE a Location
router.put('/:id', async (req, res) => {
  try {
    const locationData = await Locations.update(req.body,
    {
        where: {id: req.params.id}
    });

    if (!locationData) {return res.status(404).json({ message: 'No Location found with that id!' })};

    res.status(200).json(locationData);
  } catch (err) {res.status(404).json(err)};
})

// DELETE a Location
router.delete('/:id', async (req, res) => {
  try {
    const locationData = await Locations.destroy({
      where: {id: req.params.id}
    });

    if (!locationData) {return res.status(404).json({ message: 'No Location found with this id!' })};

    res.status(200).json(locationData);
  } catch (err) {res.status(500).json(err)};
});

module.exports = router;
