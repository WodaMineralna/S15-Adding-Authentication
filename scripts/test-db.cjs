const { mongoConnect, close } = require("../src/db/database");

const required = require("../utils/requireEnvVar")

const User = require("../models/user");
const Product = require("../models/product");

const USER_ID = required("MONGODB_EXAMPLE_USER_ID");

(async () => {
  try {
    await mongoConnect();

    const rawUser = await User.find({ _id: USER_ID });
    if (!rawUser) {
      throw new Error(`Could not find user!`);
    }

    const productData = await Product.fetchAll();
    const userData = await User.find();

    console.log("===== DB connection OK =====");
    console.log("--- Product data: ---", productData);
    console.log("--- \"Logged-in\" user data: ---", rawUser);
    console.log("--- User data: ---", userData);
  } catch (error) {
    console.error("===== DB connection FAILED =====");
    console.error(error.message);
    process.exit(1);
  } finally {
    await close();
  }
})();
