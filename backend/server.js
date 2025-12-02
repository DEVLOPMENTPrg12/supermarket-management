const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // create config/db.js for MongoDB
const authRoutes = require('./routes/authRoutes');

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const saleRoutes = require("./routes/saleRoutes");
const clientRoutes = require("./routes/clientRoutes");
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require("./routes/adminRoutes");

const cors = require("cors");
 // a


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

app.use('/api/auth', authRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/products", productRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/reports", require("./routes/reportRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
