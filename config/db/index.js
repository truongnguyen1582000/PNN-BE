const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    });
    console.log('Connect database successfully 🎉🎉🎉');
  } catch (error) {
    console.log('Connect failure 😯😯😯');
  }
}

module.exports = { connect };
