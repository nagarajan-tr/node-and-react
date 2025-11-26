const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => {
  res.send("MERN Backend Running...");
});

app.use("/api/auth", require("./routes/authRoutes"));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.json({ success: false, message: 'Something went wrong!' });
});

app.use((req, res) => {
    res.json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));