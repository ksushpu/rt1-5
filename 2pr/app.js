const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let products = [
  { id: 1, name: "Смарт-часы", price: 30000 },
  { id: 2, name: "Телевизор", price: 90000 },
  { id: 3, name: "Планшет", price: 75000 }
];

// Главная
app.get('/', (req, res) => {
  res.send('API для товаров работает');
});

// Получить все товары
app.get('/products', (req, res) => {
  res.json(products);
});

// Получить товар по id
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  res.json(product);
});

// Создать товар
app.post('/products', (req, res) => {
  const { name, price } = req.body;
  const newProduct = {
    id: Date.now(),
    name,
    price
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Обновить товар
app.patch('/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  const { name, price } = req.body;

  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;

  res.json(product);
});

// Удалить товар
app.delete('/products/:id', (req, res) => {
  products = products.filter(p => p.id != req.params.id);
  res.send("OK");
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
