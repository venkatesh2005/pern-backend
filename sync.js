// Add this to your server.js or sync.js file
const { sequelize } = require('./models');

sequelize.sync({ force: false })  // Use `force: true` only in development, for first-time sync
  .then(() => console.log("Database synced successfully"))
  .catch(err => console.log("Error syncing database: ", err));
