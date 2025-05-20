const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/db');

require('./models/student'); // Ensure model is registered

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const studentRoutes = require('./routes/studentRoutes');
const staffRoutes = require("./routes/staffRoutes");
const hodRoutes = require("./routes/hodRoutes");
const sectionRoutes = require('./routes/sectionRoutes');
const principalRoutes = require('./routes/principalRoutes');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', methods: 'GET,POST,PUT,DELETE' }));
app.use(express.json());
dotenv.config();

sequelize.sync({ alter: true }).then(() => {
  console.log('Database connected and synced');

  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/departments', departmentRoutes);
  app.use('/api/student', studentRoutes);
  app.use("/api/staff", staffRoutes);
  app.use('/api/hod', hodRoutes);
  app.use('/api/sections', sectionRoutes);
  app.use('/api/overview', principalRoutes);

  

  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
}).catch(err => {
  console.error('❌ Error syncing database:', err);
});
