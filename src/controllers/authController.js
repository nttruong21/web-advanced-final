const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.login = async (req, res, next) => {};

exports.signup = async (req, res, next) => {};
