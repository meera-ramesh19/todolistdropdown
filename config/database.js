// if (process.env.NODE_ENV === 'production') {
//     module.exports = { mongoURI: 'mongodb://CHANGEME' }
// } else {
//     module.exports = {
//         mongoURI: 'mongodb+srv://todochores:todochores@todocluster.lt7am.mongodb.net/tasks?retryWrites=true&w=majority }
//     }
const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.DB_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDB