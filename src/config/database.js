const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
exports.connectDatabase = () => {
    mongoose.connect(process.env.DB_URL).then(() => {
        console.log("MongoDB is connected")
    }).catch((error) => {
        console.log("Error while connecting to the MongoDB", error)
    });
}
