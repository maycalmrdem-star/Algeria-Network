const mongoose = require('mongoose');
module.exports = async () => {
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dashboard')
.then(() => {
    console.log('Database connection established successfully');
})
.catch((error) => {
    console.error('Database connection failed:', error.message);
});
}
