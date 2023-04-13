const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const sequelize = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const PasswordReset = require("../models/password.js");
const sendinblueApi = require("../config/emailSender.js");
const { jwtSecret } = require("../config/env.js");
const signup = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ message: "Check your credential" });
    }
    const FindUser = await User.findOne({ where: { email } });

    if (FindUser) {
      res.status(401).json({ message: "Email already exists" });
    } else {
      // Create new user record

      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);

      const user = await User.create({
        email,
        password: hash,
        name,
      });

      // Send success response
      res.status(200).json({ message: "User created successfully!" });
    }
  } catch (error) {
    // Send error response
    res.status(500).json({ message: "Server error" });
  }
};
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Check your credential" });
    }
    const FindUser = await User.findOne({ where: { email } });
    if (FindUser) {
      if (bcrypt.compareSync(password, FindUser.password)) {
        // Send success response
        const token = jwt.sign({ userId: FindUser.id }, jwtSecret);
        res.status(200).json({ message: "Sign in Successfully", token });
      } else {
        res.status(401).json({ message: "Check your password" });
      }
    } else {
      // Send error response
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    // Send error response
    res.status(500).json({ message: "Server error" });
  }
};

const forgotSendEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate the email address
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Email address not found." });
    }

    // Generate a new password reset token
    const token = uuidv4();
    const expire = moment().add(1, "hours").format("YYYY-MM-DD HH:mm:ss");
    // Store the token in the database
    await PasswordReset.create({
      token,
      expire,
      email,
    });
    const link = `${req.protocol}://${req.headers.host}/reset`;
    // Send the password reset email
    const to = [{ email }];
    const sender = { name: "ravi sharma", email: "ravisharma23523@gmail.com" };
    const subject = "Password reset request";
    const htmlContent = `
    <p>You have requested to reset your password for your account.</p>
    <p>Your new token is:</p>
    <p>${token}</p>
    <a href="${link}">Visit here to update password</a>
    <p>If you did not request a password reset, please ignore this email.</p>
    `;
    const message = { to, sender, subject, htmlContent };
    sendinblueApi
      .sendTransacEmail(message)
      .then((response) => {
        res.status(200).json({ message: "Password reset email sent." });
      })
      .catch((error) => {
        return res.status(500).json({ message: "Error sending email." });
      });
  } catch (error) {
    res.status(500);
  }
};
const resetPassword = async (req, res) => {
  try {
    const { password, token } = req.body;

    // Validate the token

    const rp = await PasswordReset.findOne({ where: { token: token } });
    const email = rp.email;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Check if the token has expired
    const now = moment();
    const expiration = moment(rp.expire);
    if (now.isAfter(expiration)) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Hash the new password and update the user record
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    await user.update({ password: hash });
    await rp.destroy();

    // Redirect the user to the login page
    res.json({ message: "success" });
  } catch (error) {
    res.status(500);
  }
};
module.exports = {
  signup,
  signin,
  forgotSendEmail,
  resetPassword,
};
