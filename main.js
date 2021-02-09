const axios = require("axios");

const userAndRepo = process.argv[2];
const requestURL = `https://api.github.com/repos/${userAndRepo}/stats/commit_activity`;
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const makeGithubRequest = async () => {
  const githubResponse = await axios.get(requestURL);
  // work with data
};
makeGithubRequest();
