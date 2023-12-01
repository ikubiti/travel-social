const router = require('express').Router();
const { Users } = require('../../models');
// const remoteConnect = require('../../utils/remoteConnect');
const remoteConnect = '';
const multer = require('multer');
const upload = multer();

// User Creation Routes
// Create User
router.post('/', upload.any(), async (req, res) => {
  try {
    // files is a standard variable that comes in the request.
    const { body, files } = req;
    let result = await remoteConnect.saveFiles(files);

    // Assuming the body uses our naming conventions
    let newUser = {
      name: `${body.firstName} ${body.lastName}`,
      username: body.username,
      email: body.email,
      profile_image: `https://drive.google.com/uc?export=view&id=${result.file_id}`,
      image_name: result.filename,
      password: body.password,
    };

    const userData = await Users.create(newUser);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    let userData = await Users.findOne({ where: { email: req.body.userInfo } });
    if (!userData) {
      userData = await Users.findOne({
        where: { username: req.body.userInfo },
      });
    }

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect username or email, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.full_name = userData.name;
      req.session.profile_url = userData.profile_image;
      req.session.profile_alt = userData.image_name;

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Logout User
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// User Data Routes
// GET all Users
router.get('/', upload.any(), async (req, res) => {
  try {
    const userData = await Users.findAll();
    const users = userData.map((user) => user.get({ plain: true }));

    res.status(200).json(users);
  } catch (err) {
    return res.status(404).json(err), console.log(err);
  }
});

// GET User by id
router.get('/:id', async (req, res) => {
  try {
    const userData = await Users.findByPk(req.params.id);

    if (!userData) {
      return res.status(404).json({ message: 'No User found with that id!' });
    }

    res.status(200).json(userData);
  } catch (err) {
    return res.status(404).json(err);
  }
});

// UPDATE a User
router.put('/:id', async (req, res) => {
  try {
    // Get the old user data
    const userData = await Users.findByPk(req.params.id);
    const { body, files } = req;

    if (files && files.length > 0) {
      let result = await remoteConnect.saveFiles(files);
      await remoteConnect.deleteFile(userData.profile_image);
      userData.profile_image = `https://drive.google.com/uc?export=view&id=${result.file_id}`;
      userData.image_name = result.name;
    }

    let result = await remoteConnect.saveFile(image);

    // Assuming the body uses our naming conventions
    let newUser = {
      name: body.name ? body.name : userData.name,
      username: body.username ? body.username : userData.username,
      email: body.email ? body.email : userData.email,
      profile_image: userData.profile_image, // Use this in the src for img tag
      image_name: userData.image_name, // Use this for alt description in img tag
      password: body.password ? body.password : userData.password,
    };

    const updatedUser = await Users.update(newUser, {
      where: { id: req.params.id },
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'No User found with that id!' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(404).json(err);
  }
});

// DELETE a User
router.delete('/:id', async (req, res) => {
  try {
    let userData = await Users.findByPk(req.params.id);
    await remoteConnect.deleteFile(userData.profile_image);
    userData = await Users.destroy({
      where: { id: req.params.id },
    });

    if (!userData) {
      return res.status(404).json({ message: 'No User found with this id!' });
    }

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
