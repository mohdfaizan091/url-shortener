const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      maxPoolSize: 50, // explicit, documented — not left to Mongoose's default
    });
    console.log("MongoDB connected succesfully");
  } catch (err) {
    console.log(`connection failed ${err}`);
  }
};