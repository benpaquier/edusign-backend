const { CronJob } = require('cron')

const job = new CronJob('* * * * * *', () => {
  console.log('You will see this message every second')
},
null,
true,
'America/Los_Angeles')

module.exports = job
