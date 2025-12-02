const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ----------------------------
// @desc    Register new user (Admin only)
// @route   POST /api/auth/register
// @access  Private/Admin
// ----------------------------
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // check if user already exists
        const userExists = await User.findOne({ email });
        if(userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // create user
        const user = await User.create({ name, email, password, role });

        // return user info + token
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id) // token kaygenerate m3a user id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// ----------------------------
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ----------------------------
exports.authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && await user.matchPassword(password)) {
            // return token + user info
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,    // مهم جداً باش React PrivateRoute يخدم
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// ----------------------------
// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
// ----------------------------
exports.getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
