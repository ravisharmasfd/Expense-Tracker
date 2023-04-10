const express = require('express');
const sequelize = require('./database/index.js')
const cors = require('cors')
const path = require("path")
const apiRouter = require('./routes/api/index.js');
const frontendRouter = require('./routes/frontend/index.js')
const {PORT} = require('./config/env.js')
const app = express();




app.use(cors())
app.use(express.static(path.join(require.main.path,'public')));
app.use(express.json())
app.use('/api',apiRouter);
app.use('/',frontendRouter)
// Start server
sequelize.sync().then(()=>{
    app.listen(PORT, () => {
  console.log('Server started on http://localhost:3000');
});
})
