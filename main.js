const { program } = require("commander");
const axios = require("axios");

program
  .requiredOption("-r, --repo <name>", "Which repository to fetch")
  .option("-w, --weeks <number>", "how many weeks to get", 52)
  .option("-a, --ascending", "Show the list in ascending order");
program.parse(process.argv);

const options = program.opts();
const td = [
  { total: 101, week: 1581811200, days: [5, 14, 23, 19, 19, 18, 3] },
  { total: 163, week: 1582416000, days: [8, 33, 25, 36, 26, 29, 6] },
  { total: 147, week: 1583020800, days: [13, 29, 19, 29, 32, 22, 3] },
  { total: 65, week: 1583625600, days: [4, 12, 18, 13, 9, 8, 1] },
  { total: 106, week: 1584230400, days: [3, 22, 17, 21, 15, 23, 5] },
  { total: 168, week: 1584835200, days: [9, 22, 45, 29, 26, 32, 5] },
  { total: 126, week: 1585440000, days: [10, 16, 23, 24, 29, 21, 3] },
  { total: 98, week: 1586044800, days: [2, 15, 14, 21, 21, 18, 7] },
  { total: 112, week: 1586649600, days: [10, 10, 20, 22, 26, 16, 8] },
  { total: 140, week: 1587254400, days: [15, 20, 17, 29, 27, 24, 8] },
  { total: 104, week: 1587859200, days: [6, 13, 22, 22, 16, 17, 8] },
  { total: 103, week: 1588464000, days: [4, 20, 14, 24, 22, 12, 7] },
  { total: 143, week: 1589068800, days: [6, 24, 21, 17, 43, 19, 13] },
  { total: 103, week: 1589673600, days: [9, 21, 19, 24, 15, 10, 5] },
  { total: 132, week: 1590278400, days: [7, 17, 27, 23, 21, 30, 7] },
  { total: 121, week: 1590883200, days: [2, 17, 24, 23, 28, 18, 9] },
  { total: 110, week: 1591488000, days: [4, 19, 24, 22, 14, 20, 7] },
  { total: 126, week: 1592092800, days: [3, 17, 29, 23, 27, 16, 11] },
  { total: 144, week: 1592697600, days: [8, 16, 31, 20, 30, 36, 3] },
  { total: 137, week: 1593302400, days: [7, 18, 30, 35, 28, 7, 12] },
  { total: 106, week: 1593907200, days: [3, 26, 23, 21, 11, 12, 10] },
  { total: 86, week: 1594512000, days: [5, 15, 14, 20, 14, 11, 7] },
  { total: 113, week: 1595116800, days: [3, 22, 17, 27, 21, 16, 7] },
  { total: 90, week: 1595721600, days: [0, 16, 9, 19, 22, 16, 8] },
  { total: 68, week: 1596326400, days: [3, 9, 16, 11, 9, 15, 5] },
  { total: 97, week: 1596931200, days: [10, 14, 19, 21, 22, 9, 2] },
  { total: 62, week: 1597536000, days: [3, 11, 14, 10, 14, 7, 3] },
  { total: 47, week: 1598140800, days: [2, 3, 10, 6, 11, 13, 2] },
  { total: 116, week: 1598745600, days: [4, 20, 10, 24, 25, 21, 12] },
  { total: 81, week: 1599350400, days: [4, 9, 11, 19, 20, 16, 2] },
  { total: 84, week: 1599955200, days: [2, 14, 14, 13, 15, 18, 8] },
  { total: 67, week: 1600560000, days: [0, 8, 12, 24, 10, 10, 3] },
  { total: 92, week: 1601164800, days: [4, 10, 21, 13, 19, 16, 9] },
  { total: 87, week: 1601769600, days: [5, 12, 15, 12, 21, 10, 12] },
  { total: 82, week: 1602374400, days: [7, 4, 14, 23, 18, 13, 3] },
  { total: 76, week: 1602979200, days: [2, 8, 14, 19, 23, 9, 1] },
  { total: 151, week: 1603584000, days: [3, 26, 22, 24, 43, 30, 3] },
  { total: 147, week: 1604188800, days: [2, 18, 23, 30, 32, 35, 7] },
  { total: 160, week: 1604793600, days: [7, 22, 45, 25, 33, 22, 6] },
  { total: 87, week: 1605398400, days: [4, 14, 14, 30, 13, 8, 4] },
  { total: 54, week: 1606003200, days: [2, 12, 9, 12, 11, 7, 1] },
  { total: 58, week: 1606608000, days: [0, 9, 13, 17, 8, 8, 3] },
  { total: 54, week: 1607212800, days: [3, 6, 8, 10, 11, 15, 1] },
  { total: 65, week: 1607817600, days: [4, 13, 16, 11, 10, 9, 2] },
  { total: 43, week: 1608422400, days: [4, 5, 16, 7, 7, 2, 2] },
  { total: 39, week: 1609027200, days: [3, 8, 7, 10, 7, 1, 3] },
  { total: 72, week: 1609632000, days: [0, 10, 12, 9, 17, 17, 7] },
  { total: 102, week: 1610236800, days: [7, 12, 21, 26, 19, 13, 4] },
  { total: 76, week: 1610841600, days: [1, 11, 18, 19, 14, 12, 1] },
  { total: 89, week: 1611446400, days: [7, 15, 24, 15, 16, 10, 2] },
  { total: 75, week: 1612051200, days: [4, 14, 15, 13, 12, 6, 11] },
  { total: 12, week: 1612656000, days: [2, 7, 3, 0, 0, 0, 0] },
];
const requestURL = `https://api.github.com/repos/${options.repo}/stats/commit_activity`;
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
 * Return the index of the busiest day (highest array value)
 * @param {*} weekdayCommits
 */
const getBusiestDayIndex = (weekdayCommits) => {
  let busiestDayIndex = 0;
  const weekdayCommitValues = Object.values(weekdayCommits);
  for (let x = 0; x < weekdayCommitValues.length; x++) {
    if (weekdayCommitValues[x] > weekdayCommitValues[busiestDayIndex]) {
      busiestDayIndex = x;
    }
  }

  return busiestDayIndex;
};

/**
 * Given response data from github, returns the name and average commits of the busiest day of the week.
 * @param {*} githubResponseData
 */
const getBusiestDay = (githubResponseData, weeksToGet) => {
  const weeksCommitData = githubResponseData.slice(0, weeksToGet);
  const weeklyCommitsByDay = getCommitsByDays(weeksCommitData);
  const weekdayCommits = getCommitsPerWeekday(weeklyCommitsByDay);

  const busiestDayIndex = getBusiestDayIndex(weekdayCommits);

  console.log(
    dayNames[busiestDayIndex],
    Object.values(weekdayCommits)[busiestDayIndex] / weeksToGet
  );
};

/**
 * Displays all days and their average commits
 */
const getCommitAverages = (githubResponseData, weeksToGet) => {
  const weeksCommitData = githubResponseData.slice(0, weeksToGet);
  const weeklyCommitsByDay = getCommitsByDays(weeksCommitData);
  const weekdayCommits = getCommitsPerWeekday(weeklyCommitsByDay);
  let dayIndex = 0;
  const weekdayAverages = Object.values(weekdayCommits)
    .reduce((acc, curr) => {
      acc.push({
        day: dayNames[dayIndex],
        averageCommits: curr / weeksToGet,
      });
      dayIndex++;
      return acc;
    }, [])
    .sort((a, b) => (a.averageCommits > b.averageCommits ? 1 : -1));
  if (options.ascending) {
    weekdayAverages.sort((a, b) =>
      a.averageCommits > b.averageCommits ? 1 : -1
    );
  } else {
    weekdayAverages.sort((a, b) =>
      a.averageCommits < b.averageCommits ? 1 : -1
    );
  }
  for (let x = 0; x < weekdayAverages.length; x++) {
    const { day, averageCommits } = weekdayAverages[x];
    console.log(day, averageCommits);
  }
};
const main = async () => {
  try {
    const weeksToGet = options.weeks || 52;

    const githubResponse = await axios.get(requestURL);
    if (githubResponse.status === 200) {
      getCommitAverages(githubResponse.data, weeksToGet);
    } else {
      if (githubResponse.status === 202) {
        let retries = 3;
        let success = false;
        let retry = setInterval(async () => {
          console.log("Retrying after 5 seconds");
          const retryResponse = await axios.get(requestURL);
          retries = retries - 1;
          if (retryResponse.status === 200) {
            success = true;
            getCommitAverages(githubResponse.data, weeksToGet);
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
