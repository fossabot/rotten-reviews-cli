#!/usr/bin/env node

const inquirer = require('inquirer')
const { searchByQuery, scrapeReviews } = require('rotten-reviews')

;(async () => {
  const { query } = await inquirer.prompt([
    {
      type: 'input',
      name: 'query',
      message: `Enter search query (e.g. 'venom', empty for recommended titles)`,
    },
  ])

  const results = await searchByQuery(query)
  if (results.length <= 0) {
    return Promise.reject(`  No titles found for '${query}', please try again.`)
  }

  const { slug, count } = await inquirer.prompt([
    {
      type: 'list',
      name: 'slug',
      message: `Here's your search result. Pick a title:`,
      pageSize: 10,
      choices: results.map(({ title, slug, year }) => ({
        name: `${title} (${year})`,
        short: slug,
        value: slug,
      })),
    },
    {
      type: 'input',
      name: 'count',
      message: 'How many reviews to scrape?',
      default: 20,
      validate: value =>
        value > 0 ? true : 'Please enter a number more than 0',
    },
  ])

  const reviews = await scrapeReviews(slug, count)
  console.log(JSON.stringify(reviews, null, 2))
})().catch(err => console.error(err))
