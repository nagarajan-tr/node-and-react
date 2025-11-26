
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


exports.register = async (req, res) => {
    try {
        console.log("REQ.BODY:", req.body);       // check payload
        console.log("REQ.PARAMS:", req.params);   // check URL params
        console.log("REQ.QUERY:", req.query);     // check query string
        console.log("REQ.METHOD:", req.method);   // check HTTP method
        console.log("REQ.HEADERS:", req.headers); // check headers
        
        const { name, email, password } = req.body;

        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({
                success: false,
                message: "Email has been already registered",
            });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPass,
            role: 'user',
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token, user });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.json({ success: false, message: "Invalid email" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: "Incorrect password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};