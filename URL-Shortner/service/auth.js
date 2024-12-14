// const sessionIdtoUserMap = new Map();

const jwt = require("jsonwebtoken");
const secret = "Mohit$2812@";

function setUser(user) {
  // sessionIdtoUserMap.set(id, user);
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    secret
  ); // user object is working as payload here
}

function getUser(token) {
  // return sessionIdtoUserMap.get(id);
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

module.exports = { setUser, getUser };
