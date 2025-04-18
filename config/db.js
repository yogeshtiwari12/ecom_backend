require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(
     'mongodb+srv://yt781703:BDP8WsWh1hniSjbO@cluster0.xrgf1nt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    )

    console.log('MongoDB connection SUCCESS')
  } catch (error) {
    console.error('MongoDB connection FAIL')
    process.exit(1)
  }
}

module.exports = {connectDB}
