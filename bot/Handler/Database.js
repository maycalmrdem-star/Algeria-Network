const mongoose = require('mongoose');
module.exports = async () => {
mongoose.connect('mongodb+srv://maker_bot:01159375910z@cluster0.4mkdwav.mongodb.net/dashboard')
.then(() => {
    console.log('Database connection established successfully');
})
.catch((error) => {
    console.error('Database connection failed:', error.message);
});
}
