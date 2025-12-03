import React, { useState, useEffect } from "react";
import API from "../services/api";

import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  PrinterIcon,
  MagnifyingGlassIcon,
  QrCodeIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import QrScanner from "qr-scanner";

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [cart, setCart] = useState([]);
  const [client, setClient] = useState("");
  const [search, setSearch] = useState("");
  const [sales, setSales] = useState([]);
  const [salesSearch, setSalesSearch] = useState("");

  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
    API.get("/clients").then((res) => setClients(res.data));
    API.get("/sales").then((res) => setSales(res.data));
  }, []);

  // -------------------------
  // Add Product to Cart
  // -------------------------
  const addToCart = (product) => {
    const exist = cart.find((p) => p.product === product._id);

    if (exist) {
      updateQty(product._id, exist.quantity + 1);
    } else {
      setCart([
        ...cart,
        {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          subtotal: product.price,
        },
      ]);
    }
  };

  const viewSale = (sale) => {
  const receipt = window.open("", "PRINT", "height=700,width=500");

  const total = sale.items.reduce((sum, i) => {
    const price = i.product?.price || 0;
    const qty = i.quantity || 0;
    return sum + price * qty;
  }, 0);

  receipt.document.write(`
    <html>
      <head>
        <title>فاتورة</title>
        <style>
          body { font-family: sans-serif; margin: 0; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .header img { width: 80px; margin-bottom: 10px; }
          .header h1 { margin: 0; font-size: 24px; }
          .info { margin-bottom: 20px; }
          .info p { margin: 3px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          table, th, td { border: 1px solid #333; }
          th, td { padding: 8px; text-align: center; }
          th { background-color: #f3f3f3; }
          .total { text-align: right; font-size: 18px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://via.placeholder.com/80" alt="Logo" />
          <h1>SuperMarket</h1>
        </div>

        <div class="info">
          <p><strong>العميل:</strong> ${sale.client?.name || "غير معروف"}</p>
          <p><strong>التاريخ:</strong> ${new Date(sale.createdAt).toLocaleString("ar-MA")}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>اسم المنتج</th>
              <th>الكمية</th>
              <th>السعر (DH)</th>
              <th>المجموع (DH)</th>
            </tr>
          </thead>
          <tbody>
            ${sale.items
              .map(
                (i) => `
              <tr>
                <td>${i.product?.name || "منتج غير معروف"}</td>
                <td>${i.quantity}</td>
                <td>${i.product?.price || 0}</td>
                <td>${(i.product?.price || 0) * i.quantity}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="total">المجموع الكلي: ${total} DH</div>
      </body>
    </html>
  `);

  receipt.document.close();
  receipt.focus();
  receipt.print();
};


  // -------------------------
  // Update Quantity
  // -------------------------
  const updateQty = (id, newQty) => {
    if (newQty < 1) return;

    setCart(
      cart.map((item) =>
        item.product === id
          ? {
              ...item,
              quantity: newQty,
              subtotal: newQty * item.price,
            }
          : item
      )
    );
  };

  // -------------------------
  // Remove From Cart
  // -------------------------
  const removeItem = (id) => {
    setCart(cart.filter((i) => i.product !== id));
  };

  // -------------------------
  // Total
  // -------------------------
  const totalAmount = cart.reduce((sum, i) => sum + i.subtotal, 0);

  // -------------------------
  // Create Sale + Print invoice only
  // -------------------------
 const handleSale = async () => {
  if (!client) return alert("اختر العميل!");
  if (cart.length === 0) return alert("السلة فارغة!");

  const payload = {
    client,
    items: cart.map((i) => ({
      product: i.product,
      quantity: i.quantity,
    })),
  };

  try {
    const res = await API.post("/sales", payload);

    const saleId = res.data?.sale?._id;
    if (!saleId) {
      console.log("Invalid response:", res.data);
      return alert("خطأ: لم يتم استلام الفاتورة!");
    }

    printBill(saleId);
    setCart([]);
    setClient("");

    alert("تم إنشاء البيع!");
  } catch (err) {
    console.log("Sale error:", err.response?.data || err.message);

    // نعرض الخطأ الحقيقي القادم من السيرفر
    if (err.response?.data?.message) {
      return alert(err.response.data.message);
    }

    alert("خطأ أثناء حفظ البيع");
  }
};



  // -------------------------
  // Print ONLY invoice
  // -------------------------
  const printBill = () => {
  const receipt = window.open("", "PRINT", "height=700,width=500");

  const total = cart.reduce((sum, i) => sum + i.subtotal, 0);

  receipt.document.write(`
    <html>
      <head>
        <title>فاتورة البيع</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 20px; }
          .header img { width: 80px; margin-bottom: 10px; }
          .header h1 { margin: 0; font-size: 24px; }
          .client-info { margin-bottom: 20px; }
          .client-info p { margin: 2px 0; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #333; padding: 8px; text-align: center; font-size: 14px; }
          th { background-color: #f3f3f3; }
          .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 10px; }
          .footer { text-align: center; font-size: 12px; color: #555; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://via.placeholder.com/80" alt="Logo" />
          <h1>SuperMarket</h1>
        </div>

        <div class="client-info">
          <p><strong>العميل:</strong> ${clients.find(c => c._id === client)?.name || "غير معروف"}</p>
          <p><strong>التاريخ:</strong> ${new Date().toLocaleString("ar-MA")}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>المنتج</th>
              <th>الكمية</th>
              <th>السعر (DH)</th>
              <th>المجموع (DH)</th>
            </tr>
          </thead>
          <tbody>
            ${cart.map(i => `
              <tr>
                <td>${i.name}</td>
                <td>${i.quantity}</td>
                <td>${i.price}</td>
                <td>${i.subtotal}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total">المجموع الكلي: ${total} DH</div>

        <div class="footer">
          شكراً لزيارتكم!<br/>
          SuperMarket
        </div>
      </body>
    </html>
  `);

  receipt.document.close();
  receipt.focus();
  receipt.print();
  receipt.close();
};


  const deleteSale = async (id) => {
    if (!window.confirm("هل تريد حذف عملية البيع؟")) return;

    try {
      await API.delete(`/sales/${id}`);
      setSales(sales.filter((s) => s._id !== id));
      alert("تم حذف البيع بنجاح");
    } catch (err) {
      alert("خطأ أثناء حذف البيع");
    }
  };

  // -------------------------
  // Barcode Scanner
  // -------------------------
  const scanBarcode = () => {
    const video = document.getElementById("scanner");

    const scanner = new QrScanner(
      video,
      (result) => {
        const product = products.find((p) => p.code === result.data);
        if (product) addToCart(product);
        scanner.stop();
      },
      { highlightScanRegion: true }
    );

    scanner.start();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">إدارة المبيعات</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* -------- PRODUCTS -------- */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">المنتجات</h2>
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="بحث عن المنتجات..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button
                  className="inline-flex items-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                  onClick={scanBarcode}
                >
                  <QrCodeIcon className="h-5 w-5 mr-2" />
                  مسح
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products
                  .filter(
                    (p) =>
                      p.name.toLowerCase().includes(search.toLowerCase()) ||
                      p.code?.includes(search)
                  )
                  .map((product) => (
                    <div
                      key={product._id}
                      className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:shadow-md transition-all duration-200"
                      onClick={() => addToCart(product)}
                    >
                      <h3 className="font-semibold text-gray-800">{product.name}</h3>
                      <p className="text-gray-600 mt-1">{product.price} DH</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* -------- CART -------- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">سلة البيع</h2>

            {/* Client */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">العميل</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              >
                <option value="">اختر العميل</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cart Items */}
            <div className="max-h-96 overflow-y-auto mb-4">
              {cart.map((item) => (
                <div key={item.product} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} × {item.price} DH = <span className="font-bold">{item.subtotal} DH</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-md transition-colors duration-150"
                      onClick={() => updateQty(item.product, item.quantity - 1)}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>

                    <span className="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium">{item.quantity}</span>

                    <button
                      className="p-1.5 bg-green-100 hover:bg-green-200 text-green-600 rounded-md transition-colors duration-150"
                      onClick={() => updateQty(item.product, item.quantity + 1)}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>

                    <button
                      className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition-colors duration-150"
                      onClick={() => removeItem(item.product)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between text-xl font-bold text-gray-800 mb-4 border-t border-gray-200 pt-4">
              <span>المجموع:</span>
              <span>{totalAmount} DH</span>
            </div>

            <button
              onClick={handleSale}
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <PrinterIcon className="h-5 w-5 mr-2" />
              إنشاء البيع وطباعة الفاتورة
            </button>
          </div>
        </div>

        {/* -------- SALES HISTORY -------- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">سجل المبيعات</h2>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="بحث في المبيعات..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={salesSearch}
                onChange={(e) => setSalesSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">العميل</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">عدد المنتجات</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">المجموع</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">التاريخ</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">العمليات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sales
                  .filter((sale) =>
                    sale.client?.name.toLowerCase().includes(salesSearch.toLowerCase())
                  )
                  .map((sale, index) => (
                    <tr key={sale._id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.client?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sale.items.length}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {sale.items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0)} DH
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(sale.createdAt).toLocaleString("ar-MA")}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewSale(sale)}
                            className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors duration-150"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            عرض
                          </button>
                          <button
                            onClick={() => deleteSale(sale._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-md text-sm font-medium transition-colors duration-150"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <video id="scanner" className="hidden"></video>
      </div>
    </div>
  );
};

export default Sales;
