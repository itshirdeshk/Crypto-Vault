const express = require("express")
const app = express()
const cors = require("cors")
const { MONGODB_URI, PORT } = require("./config/serverConfig");
const authenticationRoute = require("./routes/authenticationRoute");
const uploadImageRoute = require("./routes/uploadImageRoute");
const getImageRoute = require("./routes/getImageRoute");
const connectDB = require("./db/connect");

app.use(cors());
app.use(express.json())

app.use("/api", authenticationRoute);
app.use("/api", uploadImageRoute);
app.use("/api", getImageRoute);

async function serverStart() {
    try {
        await connectDB(MONGODB_URI).then(() => console.log("DB Connected Successfully")
        ).catch((error) => console.log("DB not connected", error))

        app.listen(3000, () => {
            console.log("Server is running...");
        })
    } catch (error) {
        console.error(error);

    }
}

serverStart();