import mongoose from 'mongoose'

export default async () => {
  try {
    console.log(process.env.DB,"check")
    await mongoose.connect(process.env.DB);
    console.log("DB CONNECTED SUCCESSFULLY")
  } catch (error) {
    console.log(error)
    console.log("COULD NOT CONNECT TO DB")
  }
}