require('dotenv').config();

function connect(mysqlConnection) {
  mysqlConnection.connect(function (err) {
    if (err) throw err;
    console.log(`Database Connected!`);
  });
}

function disconnect(mysqlConnection) {
  mysqlConnection.end();
}

module.exports = {
  connect,
  disconnect,
};
