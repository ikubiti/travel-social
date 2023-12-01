const router = require('express').Router();
const { Comments } = require('../../models');
const withAuth = require('../../utils/auth');

// GET all Comments
router.get('/', async (req, res) => {
  try {
    const commentData = await Comments.findAll();
    const comments = commentData.map((comment) => comment.get({plain: true}));

    res.status(200).json(comments);
  } catch (err) {return res.status(404).json(err)};
})

// GET Comment by id
router.get('/:id', async (req, res) => {
  try {
    const commentData = await Comments.findByPk(req.params.id);
  
    if (!commentData) { return res.status(404).json({ message: 'No Comment found with that id!' }); };
  
    res.status(200).json(commentData);
  } catch (err) { return res.status(404).json(err); };
});


  // CREATE a new Comment
  router.post('/', async (req, res) => {
    try {
      const tripComment = {
        comment: req.body.comment,
        location_id: req.body.location,
        user_id: req.session.user_id,
        trip_id: req.body.tripIndex,

      };

      const newComment = await Comments.create(
        tripComment
      );
  
      res.status(200).json(newComment);
    } catch (err) {res.status(400).json(err)};
  });
  
  // UPDATE a Comment
  router.put('/:id', async (req, res) => {
    try {
      const commentData = {
        trip_id: req.body.tripIndex,
        comment: req.body.comment,
        user_id: req.session.user_id,
        date_posted: req.body.date,
        location_id: req.body.location,
      };

      const updatedComment = await Comments.update(commentData, {
        where: {
          id: req.params.id,
        },
      });

      if (!updatedComment) { return res.status(404).json({ message: 'No Comment found with that id!' }); };
  
      res.status(200).json(updatedComment);
    } catch (err) {res.status(404).json(err)};
  })
  
  // DELETE a Comment
  router.delete('/:id', async (req, res) => {
    try {
      const commentData = await Comments.destroy({
        where: {id: req.params.id}
      });
  
      if (!commentData) { return res.status(404).json({ message: 'No Comment found with this id!' }); };
  
      res.status(200).json(commentData);
    } catch (err) {res.status(500).json(err)};
  });
  
  module.exports = router;
  