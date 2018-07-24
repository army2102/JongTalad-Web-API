const express = require('express');

const router = express.Router();

const cron = require('../cronjob/cronjob');
const utility = require('../utility');

router.get('/once', (req, res, next) => {
  cron.checkIfMarketLockReservationsCreatedForToday(
    (error, results, fields) => {
      if (error) {
        utility.createError(404, error, res);
      } else if (results.length === 0) {
        cron.createMarketLockReservations((error, results, fields) => {
          if (error) {
            utility.createError(404, error, res);
          } else {
            utility.createResponse(201, results, res);
          }
        });
      } else {
        utility.createError(
          409,
          'Market lock for today is already created',
          res
        );
      }
    }
  );
});

router.get('/start', (req, res, next) => {
  const isCronJobRunning = cron.job.running || false;
  if (!isCronJobRunning) {
    cron.job.start();
    utility.createResponse(
      200,
      {
        cronJobStatus: cron.job.running || false,
        nextExecutionDate: cron.job.nextDates()
      },
      res
    );
  } else {
    utility.createError(404, 'Cronjob is already running', res);
  }
});

router.get('/stop', (req, res, next) => {
  const isCronJobRunning = cron.job.running || false;
  if (isCronJobRunning) {
    cron.job.stop();
    utility.createResponse(
      200,
      {
        cronJobStatus: cron.job.running || false,
        nextExecutionDate: cron.job.nextDates()
      },
      res
    );
  } else {
    utility.createError(404, 'Cronjob is already stop', res);
  }
});

router.get('/status', (req, res, next) => {
  utility.createResponse(
    200,
    {
      cronJobStatus: cron.job.running || false,
      lastExecutionDate: cron.job.lastDate() || null,
      nextExecutionDate: cron.job.nextDates()
    },
    res
  );
});

module.exports = router;
