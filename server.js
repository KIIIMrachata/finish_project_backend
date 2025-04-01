// backend.js
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

// Middlewares สำหรับ parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ตั้งค่า Sequelize (ใช้ SQLite เป็นตัวอย่าง)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// =====================
// กำหนด Models ด้วย Sequelize
// =====================

// Customer Model
const Customer = sequelize.define('Customer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true }
});

// Product Model
const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false }
});

// Order Model
const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  orderDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
});

// OrderItem Model
const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
});

// Report Model
const Report = sequelize.define('Report', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  content: { type: DataTypes.TEXT, allowNull: false }
});

// =====================
// กำหนดความสัมพันธ์ของ Models
// =====================
Customer.hasMany(Order, { foreignKey: 'customerId', onDelete: 'CASCADE' });
Order.belongsTo(Customer, { foreignKey: 'customerId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

// =====================
// API Routes สำหรับ Backend (Prefix ด้วย /api)
// =====================

// --- Customer APIs ---
app.get('/api/customers', async (req, res) => {
  const customers = await Customer.findAll();
  res.json(customers);
});

app.post('/api/customers', async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (customer) {
      await customer.update(req.body);
      res.json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (customer) {
      await customer.destroy();
      res.json({ message: 'Customer deleted' });
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Product APIs ---
app.get('/api/products', async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.update(req.body);
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Order APIs ---
app.get('/api/orders', async (req, res) => {
  const orders = await Order.findAll({ include: Customer });
  res.json(orders);
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (order) {
      await order.update(req.body);
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (order) {
      await order.destroy();
      res.json({ message: 'Order deleted' });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Order Item APIs ---
app.get('/api/orderItems', async (req, res) => {
  const orderItems = await OrderItem.findAll({ include: [Order, Product] });
  res.json(orderItems);
});

app.post('/api/orderItems', async (req, res) => {
  try {
    const orderItem = await OrderItem.create(req.body);
    res.json(orderItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orderItems/:id', async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id);
    if (orderItem) {
      await orderItem.update(req.body);
      res.json(orderItem);
    } else {
      res.status(404).json({ error: 'Order Item not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/orderItems/:id', async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id);
    if (orderItem) {
      await orderItem.destroy();
      res.json({ message: 'Order Item deleted' });
    } else {
      res.status(404).json({ error: 'Order Item not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Report APIs ---
// Summary Report
app.get('/api/report/summary', async (req, res) => {
  try {
    const customerCount = await Customer.count();
    const productCount = await Product.count();
    const orderCount = await Order.count();
    const orderItemCount = await OrderItem.count();
    let totalRevenue = 0;
    const orderItems = await OrderItem.findAll({
      include: { model: Product, attributes: ['price'] }
    });
    orderItems.forEach(item => {
      if (item.Product) {
        totalRevenue += item.quantity * item.Product.price;
      }
    });
    res.json({ customerCount, productCount, orderCount, orderItemCount, totalRevenue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Daily Report
app.get('/api/report/daily', async (req, res) => {
  try {
    const monthYear = req.query.monthYear || new Date().toISOString().substring(0,7);
    const [year, month] = monthYear.split('-');
    const [dailyReports] = await sequelize.query(`
      SELECT DATE(o.orderDate) as day,
             COUNT(DISTINCT o.id) as orderCount,
             IFNULL(SUM(oi.quantity * p.price), 0) as totalRevenue
      FROM Orders o
      LEFT JOIN OrderItems oi ON o.id = oi.orderId
      LEFT JOIN Products p ON oi.productId = p.id
      WHERE strftime('%Y', o.orderDate) = '${year}'
        AND strftime('%m', o.orderDate) = '${month}'
      GROUP BY day
      ORDER BY day;
    `);
    res.json(dailyReports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Today's Report
app.get('/api/report/today', async (req, res) => {
  try {
    const chosenDate = req.query.date || new Date().toISOString().split('T')[0];
    const ordersToday = await Order.findAll({
      where: sequelize.where(sequelize.fn('date', sequelize.col('orderDate')), chosenDate),
      include: [
        { model: Customer, attributes: ['name', 'email'] },
        { 
          model: OrderItem,
          include: [{ model: Product, attributes: ['name', 'price'] }]
        }
      ]
    });
    res.json({ date: chosenDate, orders: ordersToday });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// เริ่มเซิร์ฟเวอร์ Backend
// =====================
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
});
