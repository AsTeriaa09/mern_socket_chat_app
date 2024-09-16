const User = require("../model/UserModel");

const SignUp = async (req, res) => {
  try {
    const { name, email, password, picture } = req.body;
    const defaultPictureUrl =
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
    const userPicture = picture || defaultPictureUrl;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const createUser = await User.create({
      name,
      email,
      password,
      picture: userPicture,
    });
    await createUser.save();
    const token = await createUser.generateToken();
    return res.status(200).json({
      message: "User created successfully!",
      token,
      userId: createUser._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};

const updateUserPicture = async (req, res) => {
  try {
    const { userId, picture } = req.body;

    // Ensure the userId and picture URL are provided
    if (!userId || !picture) {
      return res.status(400).json({ message: "User ID and picture URL are required" });
    }

    // Update the user's picture URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { picture: picture },
      { new: true }
    );

    // Check if the user was found and updated
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the updated user data
    return res.status(200).json({
      message: "User picture updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user picture:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
      res.status(400).json({ message: "Invalid Credentials" });
    }
    const isPassValid = await userExists.comparePass(password);
    const token = await userExists.generateToken();
    if (isPassValid) {
      return res.status(200).json({
        message: "Logged in successfully!",
        token,
        userId: userExists._id.toString(),
      });
    } else {
      return res.status(401).json({ message: "invalid infomation" });
    }
  } catch (error) {
    console.error("Error updating user picture:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// /api/user?search=rupa
// The $or operator performs a logical OR operation on an array of one or more <expressions> and selects the documents that satisfy at least one of the <expressions>.
// $regex: Provides regular expression capabilities for pattern matching strings in queries.
const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  try {
    //console.log(keyword);
    const users = await User.find({
      ...keyword,
      _id: { $ne: req.user._id },
    }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

// to get currently logged in user data
const loggedUser = async (req, res) => {
  try {
    const userData = req.user;
    return res.status(200).json(userData);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { Login, SignUp, allUsers, loggedUser,updateUserPicture };
