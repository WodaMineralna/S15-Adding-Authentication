const bcrypt = require("bcryptjs");

const User = require("./user");

const newError = require("../utils/newError");
// const required = require("../utils/requireEnvVar");

async function loginUser(userData) {
  try {
    const { email, password } = userData;

    const foundUser = await User.findOne({ email });
    if (!foundUser) return false;

    const doMatch = await bcrypt.compare(password, foundUser.password);
    if (!doMatch) return false;

    return foundUser;
    // const userID = required("MONGODB_EXAMPLE_USER_ID");
    // const user = await User.findById(userID);
    // return user;
  } catch (error) {
    throw newError("Failed to login user", error);
  }
}

// ! VALIDATION will be implemented during course section S18 - Understanding Validation
async function singupUser(userData) {
  try {
    const { email, password, confirmPassword } = userData;
    const userExists = await User.findOne({ email });

    // ^ return will be handled in controller, calling res.redirect
    if (userExists) return true;

    const hashedPwd = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPwd,
      cart: { items: [] },
    });

    await user.save();
    return false; // user does not already exist
  } catch (error) {
    throw newError("Failed to signup user", error);
  }
}

module.exports = { loginUser, singupUser };
