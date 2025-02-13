import mongoose from "mongoose";

const dbConnect = async function(){
   try {
     const mongoInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
     console.log('MongoDb Connected !!', mongoInstance.connection.host)
   } catch (error) {
        console.log("error occured in connecting database",error)
        process.exit(1)
   }

}
export default dbConnect