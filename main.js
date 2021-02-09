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

/**
 * Returns an array containing the 'days' property of each commit object
 * @param {*} githubResponseData
 */
const getCommitsByDays = (githubResponseData) =>
  githubResponseData.map((element) => element.days);

/**
 * Takes an array of arrays, where the latter array is an array of 7 values representing commits on a given weekday.
 * Returns an object with keys 0-7 reprsenting Sunday-Saturday
 */
const getCommitsPerWeekday = (weeksDataArray) => {
  const commitsPerWeekday = weeksDataArray.reduce((weeksObj, currentWeek) => {
    const commitsPerDay = weeksObj;
    for (let x = 0; x < currentWeek.length; x++) {
      if (!commitsPerDay[dayNames[x]]) {
        commitsPerDay[dayNames[x]] = 0;
      }
      commitsPerDay[dayNames[x]] += currentWeek[x];
    }
    return commitsPerDay;
  }, {});

  return commitsPerWeekday;
};

/**
 * Returns the average number of commits for a given index.
 * @param {*} index - the array index to get the average of
 * @param {*} commitsArray - the array of arrays containing total commits per day by element
 */
const getAverageCommitsForDay = (index, commitsArray) => {
  const { weeks, total } = commitsArray.reduce(
    ({ weeks, total }, acc) => {
      return {
        weeks: weeks + 1,
        total: total + acc[index],
      };
    },
    { weeks: 0, total: 0 }
  );

  return total / weeks;
};

/**
 * Return the index of the busiest day (highest array value)
 * @param {*} weekdayCommits
 */
const getBusiestDayIndex = (weekdayCommits) => {
  let busiestDayIndex = 0;
  for (let x = 0; x < Object.values(weekdayCommits).length; x++) {
    if (
      Object.values(weekdayCommits)[x] >
      Object.values(weekdayCommits)[busiestDayIndex]
    ) {
      busiestDayIndex = x;
    }
  }

  return busiestDayIndex;
};

/**
 * Given response data from github, returns the name and average commits of the busiest day of the week.
 * @param {*} githubResponseData
 */
const getBusiestDay = (githubResponseData) => {
  const weeklyCommitsByDay = getCommitsByDays(githubResponseData);
  const weekdayCommits = getCommitsPerWeekday(weeklyCommitsByDay);

  const busiestDayIndex = getBusiestDayIndex(weekdayCommits);

  console.log(
    dayNames[busiestDayIndex],
    getAverageCommitsForDay(busiestDayIndex, weeklyCommitsByDay)
  );
};

const main = async () => {
  try {
    const githubResponse = await axios.get(requestURL);
    if (githubResponse.status === 200) {
      getBusiestDay(githubResponse.data);
    } else {
      console.log("status was not 200");
      if (githubResponse.status === 202) {
        let retries = 3;
        let success = false;
        let retry = setInterval(async () => {
          console.log("Retrying after 5 seconds");
          const retryResponse = await axios.get(requestURL);
          retries = retries - 1;
          if (retryResponse.status === 200) {
            success = true;
            getBusiestDay(retryResponse.data);
          }
          if (retries === 0 || success) clearInterval(retry);
        }, 5000);
      }
    }
  } catch (e) {
    console.log(e.message);
  }
};

main();
