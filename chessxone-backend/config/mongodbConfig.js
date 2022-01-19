const mongoose = require('mongoose');

module.exports = async () => {
    try {
        mongoose.connect(process.env.MangoDBurl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB initialised succussfully')
    } catch (error) {
        console.log('error intialising Mongo DB');
        console.log(error.message);
    }
}

