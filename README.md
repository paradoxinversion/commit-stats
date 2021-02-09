Commit Stats

This programs pulls information from the GitHub API and displays it on the command line.

Installation

Install with your javascript package manager via npm/yarn install

Usage

There are three flags to keep in mind, with one required: `-r` is the repository, and must be included. `-w` is the amount of weeks (up to 52) worth of commit data to consider. `-a` changes the order from descending to ascending.

```
node main.js -r kubernetes/kubernetes -a
```

or

```
node main.js -r kubernetes/kubernetes -w 12
```
