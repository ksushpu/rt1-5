const express = require("express");
const cors = require("cors");
const { nanoid } = require("nanoid");

// Swagger
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = 3000;

app.use(express.json());

// CORS
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Логирование
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(
      `[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`
    );
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      console.log("Body:", req.body);
    }
  });
  next();
});

// ----------------------
// ДАННЫЕ
// ----------------------
let products = [
  {
    id: nanoid(6),
    title: "Настольная лампа ",
    category: "Освещение",
    description: "Тёплая LED‑лампа с регулировкой яркости и мягким рассеянным светом.",
    price: 3490,
    stock: 15,
  },
  {
    id: nanoid(6),
    title: "Плед ",
    category: "Текстиль",
    description: "Мягкий флисовый плед 150×200 см, идеально подходит для уютных вечеров.",
    price: 2590,
    stock: 22,
  },
  {
    id: nanoid(6),
    title: "Набор кухонных ножей ",
    category: "Кухонные товары",
    description: "Профессиональный набор из 5 ножей из нержавеющей стали.",
    price: 4990,
    stock: 8,
  },
  {
    id: nanoid(6),
    title: "Аромадиффузор",
    category: "Декор",
    description: "Электрический диффузор с функцией увлажнения и подсветкой.",
    price: 3290,
    stock: 12,
  },
  {
    id: nanoid(6),
    title: "Органайзер для белья",
    category: "Хранение",
    description: "Складной органайзер с 12 отделениями для аккуратного хранения вещей.",
    price: 990,
    stock: 40,
  },
  {
    id: nanoid(6),
    title: "Ковёр",
    category: "Текстиль",
    description: "Плотный ковёр 120×170 см с мягким ворсом и антискользящим основанием.",
    price: 6990,
    stock: 6,
  },
  {
    id: nanoid(6),
    title: "Набор тарелок",
    category: "Кухонные товары",
    description: "Керамический набор из 6 тарелок ручной росписи.",
    price: 5590,
    stock: 10,
  },
  {
    id: nanoid(6),
    title: "Настенный декор",
    category: "Декор",
    description: "Металлическая настенная композиция в форме листьев.",
    price: 4490,
    stock: 5,
  },
  {
    id: nanoid(6),
    title: "Корзина для хранения",
    category: "Хранение",
    description: "Большая льняная корзина 40×30×30 см с ручками.",
    price: 1290,
    stock: 18,
  },
  {
    id: nanoid(6),
    title: "Светодиодная гирлянда",
    category: "Освещение",
    description: "Гирлянда 5 метров с тёплым светом и 8 режимами свечения.",
    price: 1590,
    stock: 25,
  }
];

// ----------------------
// Swagger конфигурация
// ----------------------
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API интернет-магазина",
      version: "1.0.0",
      description: "Документация API для CRUD операций с товарами",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Локальный сервер",
      },
    ],
  },
  apis: ["./app.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// ----------------------
// Swagger схемы
// ----------------------

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный ID товара
 *         title:
 *           type: string
 *         category:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: number
 *       example:
 *         id: "abc123"
 *         title: "Настольная лампа"
 *         category: "Освещение"
 *         description: "Тёплая LED‑лампа"
 *         price: 3490
 *         stock: 15
 */


// ----------------------
// Хелпер
// ----------------------
function findProductOr404(id, res) {
  const product = products.find((p) => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return null;
  }
  return product;
}


// ----------------------
// CRUD + Swagger
// ----------------------

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get("/api/products", (req, res) => {
  res.json(products);
});


/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.get("/api/products/:id", (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;
  res.json(product);
});


/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Товар создан
 */
app.post("/api/products", (req, res) => {
  const { title, category, description, price, stock } = req.body;

  const newProduct = {
    id: nanoid(6),
    title: title.trim(),
    category: category.trim(),
    description: description.trim(),
    price: Number(price),
    stock: Number(stock),
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});


/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновить данные товара
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Обновлённый товар
 *       404:
 *         description: Товар не найден
 */
app.patch("/api/products/:id", (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;

  const { title, category, description, price, stock } = req.body;

  if (title !== undefined) product.title = title.trim();
  if (category !== undefined) product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);

  res.json(product);
});


/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар удалён
 *       404:
 *         description: Товар не найден
 */
app.delete("/api/products/:id", (req, res) => {
  const id = req.params.id;

  const exists = products.some((p) => p.id === id);
  if (!exists) return res.status(404).json({ error: "Product not found" });

  products = products.filter((p) => p.id !== id);
  res.status(204).send();
});


// ----------------------
// 404
// ----------------------
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ----------------------
// Ошибки
// ----------------------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ----------------------
// Запуск
// ----------------------
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
  console.log(`Swagger UI: http://localhost:${port}/api-docs`);
});
