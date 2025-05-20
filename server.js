const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/db');

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173', methods: 'GET,POST,PUT,DELETE' }));
app.use(express.json());

// ✅ Register ALL models here before sync
require('./models/student');
require('./models/department'); // <-- add this
require('./models/staff');      // add others as needed
require('./models/section');    // ...
// Add every model file you have that defines a Sequelize model

// ✅ Sync models and start server
sequelize.sync({ alter: true }).then(() => {
  console.log('Database connected and synced');

  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/admin', require('./routes/adminRoutes'));
  app.use('/api/departments', require('./routes/departmentRoutes'));
  app.use('/api/student', require('./routes/studentRoutes'));
  app.use('/api/staff', require('./routes/staffRoutes'));
  app.use('/api/hod', require('./routes/hodRoutes'));
  app.use('/api/sections', require('./routes/sectionRoutes'));
  app.use('/api/overview', require('./routes/principalRoutes'));

  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
}).catch(err => {
  console.error('❌ Error syncing database:', err);
});
