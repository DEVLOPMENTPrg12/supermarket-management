// seedData.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// MODELS
const Category = require("../models/Category");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");
const Purchase = require("../models/Purchase");

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📌 Connected to MongoDB");

    // DELETE OLD DATA
    await Category.deleteMany();
    await Product.deleteMany();
    await Supplier.deleteMany();
    await Purchase.deleteMany();
    console.log("🗑️ Old data cleared");

    // ---------------------------
    // CATEGORIES
    // ---------------------------
    const categoryNames = [
      "Boissons",
      "Snacks",
      "Produits laitiers",
      "Boulangerie",
      "Fruits & Légumes",
      "Viande & Poisson",
      "Congelés",
      "Produits ménagers",
      "Soins personnels",
      "Bébés",
      "Animaux",
      "Santé & Vitamines",
    ];

    const categories = await Category.insertMany(
      categoryNames.map((name) => ({ name }))
    );

    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    console.log(`📁 ${categories.length} Categories added`);

    // ---------------------------
    // PRODUCTS (Maroc réels)
    // ---------------------------
    const moroccanProducts = {
      "Boissons": [
        { name: "Sidi Ali Eau Minérale", brand: "Sidi Ali", price: 5 },
        { name: "Oulmès Eau Minérale", brand: "Oulmès", price: 6 },
        { name: "Cappy Jus d'Orange", brand: "Cappy", price: 12 },
        { name: "Coca Cola Maroc", brand: "Coca Cola", price: 10 },
      ],
      "Snacks": [
        { name: "Chebakia", brand: "Traditionnel", price: 8 },
        { name: "Briouates", brand: "Traditionnel", price: 7 },
        { name: "Makrout", brand: "Traditionnel", price: 9 },
      ],
      "Produits laitiers": [
        { name: "Lait Centrale", brand: "Centrale", price: 8 },
        { name: "Yaourt Danone", brand: "Danone", price: 6 },
        { name: "Fromage Copag", brand: "Copag", price: 15 },
      ],
      "Boulangerie": [
        { name: "Khobz Marocain", brand: "Traditionnel", price: 4 },
        { name: "Msemen", brand: "Traditionnel", price: 5 },
        { name: "Baghrir", brand: "Traditionnel", price: 5 },
      ],
      "Fruits & Légumes": [
        { name: "Tomates locales", brand: "Local", price: 3 },
        { name: "Pommes", brand: "Local", price: 5 },
        { name: "Oranges", brand: "Local", price: 4 },
        { name: "Carottes", brand: "Local", price: 3 },
      ],
      "Viande & Poisson": [
        { name: "Poulet Douja", brand: "Douja", price: 30 },
        { name: "Agneau frais", brand: "Local", price: 120 },
        { name: "Poisson frais", brand: "Local", price: 80 },
      ],
      "Congelés": [
        { name: "Poisson surgelé", brand: "Centrale", price: 70 },
        { name: "Fruits surgelés", brand: "Centrale", price: 50 },
      ],
      "Produits ménagers": [
        { name: "Savon noir", brand: "Maroc", price: 12 },
        { name: "Javel", brand: "Maroc", price: 10 },
        { name: "Detergent", brand: "Maroc", price: 15 },
      ],
      "Soins personnels": [
        { name: "Argan Oil", brand: "Maroc", price: 50 },
        { name: "Shampoing local", brand: "Maroc", price: 25 },
        { name: "Le Petit Marseillais", brand: "Le Petit Marseillais", price: 30 },
      ],
      "Bébés": [
        { name: "Couches Pampers", brand: "Pampers", price: 120 },
        { name: "Lait infantile", brand: "Maroc", price: 80 },
      ],
      "Animaux": [
        { name: "Croquettes chien", brand: "Maroc", price: 90 },
        { name: "Croquettes chat", brand: "Maroc", price: 85 },
      ],
      "Santé & Vitamines": [
        { name: "Vitamine C", brand: "Pharmacie locale", price: 15 },
        { name: "Vitamine D", brand: "Pharmacie locale", price: 20 },
      ],
    };

    const products = [];
    for (const catName of categoryNames) {
      const items = moroccanProducts[catName];
      items.forEach((item) => {
        products.push({
          name: item.name,
          price: item.price,
          quantity: Math.floor(Math.random() * 200) + 10,
          description: `${item.name} de marque ${item.brand}, disponible au Maroc.`,
          image: `https://via.placeholder.com/150?text=${encodeURIComponent(item.name)}`,
          SKU: Math.random().toString(36).substring(2, 10).toUpperCase(),
          status: "active",
          brand: item.brand,
          category: categoryMap[catName],
          tags: [catName.toLowerCase()],
        });
      });
    }

    const productsInserted = await Product.insertMany(products);
    console.log(`📦 ${productsInserted.length} Moroccan Products added`);

    // ---------------------------
    // SUPPLIERS
    // ---------------------------
    const suppliers = [];
    for (let i = 0; i < 10; i++) {
      suppliers.push({
        name: `Fournisseur ${i + 1}`,
        phone: `06${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
        email: `supplier${i + 1}@example.com`,
        company: `Société ${i + 1}`,
        balance: Math.floor(Math.random() * 5000),
      });
    }

    const suppliersInserted = await Supplier.insertMany(suppliers);
    console.log(`🚚 ${suppliersInserted.length} Suppliers added`);

    // ---------------------------
    // PURCHASES
    // ---------------------------
    const purchaseStatuses = ["paid", "unpaid"];
    const purchases = [];
    for (let i = 0; i < 30; i++) {
      const sup = suppliersInserted[Math.floor(Math.random() * suppliersInserted.length)];
      const numItems = Math.floor(Math.random() * 5) + 1;
      const items = [];
      for (let j = 0; j < numItems; j++) {
        const prod = productsInserted[Math.floor(Math.random() * productsInserted.length)];
        const qty = Math.floor(Math.random() * 20) + 1;
        items.push({
          product: prod._id,
          quantity: qty,
          price: prod.price,
          subtotal: qty * prod.price,
        });
      }
      const totalAmount = items.reduce((acc, it) => acc + it.subtotal, 0);
      purchases.push({
        supplier: sup._id,
        items,
        totalAmount,
        status: purchaseStatuses[Math.floor(Math.random() * purchaseStatuses.length)],
      });
    }

    await Purchase.insertMany(purchases);
    console.log(`📝 ${purchases.length} Purchases added`);

    console.log("🎉 Moroccan Database seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();
