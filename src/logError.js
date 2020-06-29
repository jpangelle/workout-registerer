const { DateTime } = require('luxon');
const fs = require('fs');
const path = require('path');

const logError = error => {
  const fileName = `error-${DateTime.local().toFormat('MM-dd-yyyy-HH:mm:ss')}`;
  const errorMessage = JSON.stringify(error);

  fs.writeFile(
    path.join(__dirname, 'error-logs', fileName),
    errorMessage,
    writeError => {
      if (!writeError) {
        console.log('An error was logged!');
      }
    },
  );
};

module.exports = { logError };
