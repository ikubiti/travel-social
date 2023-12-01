const router = require('express').Router();
const { Tagged } = require('../../models');
const withAuth = require('../../utils/auth');

// GET all Tagged Data
router.get('/', async (req, res) => {
  try {
    const taggedData = await Tagged.findAll();
    const tagged = taggedData.map((tag) => tag.get({plain: true}));

    res.status(200).json(tagged);
  } catch (err) {return res.status(404).json(err), console.log(err)};
})

// GET Tagged Data by id
router.get('/:id', async (req, res) => {
  try {
    const taggedData = await Tagged.findByPk(req.params.id);

    if (!taggedData) {return res.status(404).json({message: 'No Tagged Data found with that id!'})};

    res.status(200).json(taggedData);
  } catch (err) {return res.status(404).json(err)};
})

// CREATE a new Tag Relation
router.post('/', async (req, res) => {
  try {
    const newTag = await Locations.create(
      ...req.body
    );

    res.status(200).json(newTag);
  } catch (err) {res.status(400).json(err)};
});

// UPDATE Tag Data
router.put('/:id', async (req, res) => {
  try {
    const taggedData = await Tagged.update(req.body,
    {
        where: {id: req.params.id}
    });

    if (!taggedData) {return res.status(404).json({ message: 'No Tagged Data found with that id!' })};

    res.status(200).json(taggedData);
  } catch (err) {res.status(404).json(err)};
})

// DELETE a Location
router.delete('/:id', async (req, res) => {
  try {
    const taggedData = await Tagged.destroy({
      where: {id: req.params.id}
    });

    if (!taggedData) {return res.status(404).json({ message: 'No Tagged Data found with this id!' })};

    res.status(200).json(taggedData);
  } catch (err) {res.status(500).json(err)};
});

module.exports = router;