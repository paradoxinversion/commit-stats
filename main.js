const { program } = require("commander");
const axios = require("axios");

program
  .requiredOption("-r, --repo <name>", "Which repository to fetch")
  .option("-w, --weeks <number>", "how many weeks to get", 52)
  .option("-a, --ascending", "Show the list in ascending order");
program.parse(process.argv);

const options = program.opts();

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
