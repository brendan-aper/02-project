const router = require("express").Router();
const { User } = require("../../models");

// get all users
router.get("/", async (req, res) => {
  const allUsers = await User.findAll();
  res.json(allUsers);
});

// create user
router.post("/signup", async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    console.log("New user was created");
    console.log(newUser.id);

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.user = newUser;
      console.log(
        "File: user-routes.js ~ line 57 ~ req.session.save ~ req.session.cookie",
        req.session.cookie
      );

      res.status(200).json({ message: "You are now logged in!" });
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Email address must be unique." });
    }
    console.error(err);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
});

//login
router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        email: req.body.email,
      },
      // attributes: {
      //   exclude: ["password"]
      // }
    });

    if (!dbUserData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    const validPassword = await dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({ message: "Incorrect email or password, please try again" });
      return;
    }

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.user = dbUserData;
      console.log(
        'File: user-routes.js ~ line 57 ~ req.session.save ~ req.session.cookie',
        req.session.cookie
      );

      res.status(200).json({ user: dbUserData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

// get single user
router.get("/:id", async (req, res) => {
  const singleUser = await User.findByPk(req.params.id);
  console.log(`found user ${req.params.id}`);
  res.json(singleUser);
});

// delete user
router.delete("/:id", async (req, res) => {
  try {
    await User.destroy({
      where: { id: req.params.id },
    });
    console.log(`User Deleted`);
    res.json(`User Deleted`);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update user =  successful
router.put("/:id", async (req, res) => {
  try {
    await User.update(
      {
        first_name: req.body.first_name,
        location: req.body.location,
        email: req.body.email,
        password: req.body.password,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    console.log("updated");
    res.json("updated user");
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Email address must be unique." });
    }
    console.error(err);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
});

// User logout
router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
