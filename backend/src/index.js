const app = require("./app");
const connectDB = require("./config/db");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
    app.listen(PORT, () =>{
        console.log(`server is runnning on ${PORT}`);
    });
});