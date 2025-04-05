const axios = require("axios");
require("dotenv").config();

const headers = {
  Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
};

async function getUsersData() {
  const url = `${process.env.BASE_URL}/users`;
  const res = await axios.get(url, { headers });
  return res.data.users || res.data;
}

async function getPostsData() {
  const url = `${process.env.BASE_URL}/posts`;
  const res = await axios.get(url, { headers });
  return res.data.posts || res.data;
}

async function getCommentsData() {
  const url = `${process.env.BASE_URL}/comments`;
  const res = await axios.get(url, { headers });
  return res.data.comments || res.data;
}

module.exports = {
  getUsersData,
  getPostsData,
  getCommentsData,
};
