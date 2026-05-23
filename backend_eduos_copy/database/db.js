// const mongoose = require('mongoose')

// const connectDb  = async () => {
//     try{
//         await mongoose.connect('mongodb+srv://hardikmakkar2024_db_user:hardikmakkar2024_db_user@cluster0.sj7doaf.mongodb.net/');
//         console.log('Db connection successfull');
//     }catch(error){
//         console.log('Db connection failed : ', error);
//         process.exit(1);
//     }
// }


// module.exports = connectDb


const mongoose = require('mongoose')

const connectDb = async () => {
  try {

    await mongoose.connect(
      'mongodb+srv://hardikmakkar2024_db_user:hardikmakkar2024_db_user@cluster0.sj7doaf.mongodb.net/eduos'
    );

    console.log('Db connection successful');

  } catch(error){

    console.log('Db connection failed:', error);
    process.exit(1);

  }
}

module.exports = connectDb