var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve2, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve2(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/server.ts
var import_express2 = __toESM(require("express"));
var import_express_async_errors = require("express-async-errors");
var import_cors = __toESM(require("cors"));

// src/routes.ts
var import_express = require("express");
var import_multer2 = __toESM(require("multer"));

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/services/user/CreateUserService.ts
var import_bcryptjs = require("bcryptjs");
var CreateUserService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ name, email, password }) {
      if (!email) {
        throw new Error("Email incorrect");
      }
      const userAlreadyExists = yield prisma_default.user.findFirst({
        where: {
          email
        }
      });
      if (userAlreadyExists) {
        throw new Error("User already exists");
      }
      const passwordHash = yield (0, import_bcryptjs.hash)(password, 8);
      const user = yield prisma_default.user.create({
        data: {
          name,
          email,
          password: passwordHash
        },
        select: {
          id: true,
          name: true,
          email: true
        }
      });
      return user;
    });
  }
};

// src/controllers/user/CreateUserController.ts
var CreateUserController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const { name, email, password } = req.body;
      const creteUserService = new CreateUserService();
      const user = yield creteUserService.execute({
        name,
        email,
        password
      });
      return res.json(user);
    });
  }
};

// src/services/user/AuthUserService.ts
var import_bcryptjs2 = require("bcryptjs");
var import_jsonwebtoken = require("jsonwebtoken");
var AuthUserService = class {
  execult(_0) {
    return __async(this, arguments, function* ({ email, password }) {
      const user = yield prisma_default.user.findFirst({
        where: {
          email
        }
      });
      if (!user) {
        throw new Error("User/password incorrect");
      }
      const passwordMatch = yield (0, import_bcryptjs2.compare)(password, user.password);
      if (!passwordMatch) {
        throw new Error("User/password incorrect");
      }
      const token = (0, import_jsonwebtoken.sign)(
        {
          name: user.name,
          email: user.email
        },
        process.env.JWT_SECRET,
        {
          subject: user.id,
          expiresIn: "30d"
        }
      );
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        token
      };
    });
  }
};

// src/controllers/user/AuthUserController.ts
var AuthUserController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const { email, password } = req.body;
      const authUserService = new AuthUserService();
      const auth = yield authUserService.execult({
        email,
        password
      });
      return res.json(auth);
    });
  }
};

// src/services/user/DetailUserService.ts
var DetailUserService = class {
  execute(user_id) {
    return __async(this, null, function* () {
      const user = yield prisma_default.user.findFirst({
        where: {
          id: user_id
        },
        select: {
          id: true,
          name: true,
          email: true
        }
      });
      return user;
    });
  }
};

// src/controllers/user/DetailUserController.ts
var DetailUserController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const user_id = req.user_id;
      const detailUserService = new DetailUserService();
      const user = yield detailUserService.execute(user_id);
      return res.json(user);
    });
  }
};

// src/services/category/CreateCategoryService.ts
var CreateCategoryService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ name }) {
      if (name === "") {
        throw new Error("Name invalid");
      }
      const category = yield prisma_default.category.create({
        data: {
          name
        },
        select: {
          id: true,
          name: true
        }
      });
      return category;
    });
  }
};

// src/controllers/category/CreateCategoryController.ts
var CreateCategoryController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const { name } = req.body;
      const createCategoryService = new CreateCategoryService();
      const category = yield createCategoryService.execute({
        name
      });
      return res.json(category);
    });
  }
};

// src/services/category/ListCategoryService.ts
var ListCategoryService = class {
  execute() {
    return __async(this, null, function* () {
      const category = yield prisma_default.category.findMany({
        select: {
          id: true,
          name: true
        }
      });
      return category;
    });
  }
};

// src/controllers/category/ListCategoryController.ts
var ListCategoryController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const listCategoryService = new ListCategoryService();
      const category = yield listCategoryService.execute();
      return res.json(category);
    });
  }
};

// src/services/product/CreateProductService.ts
var CreateProductService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ name, price, description, banner, category_id }) {
      const product = yield prisma_default.product.create({
        data: {
          name,
          price,
          description,
          banner,
          category_id
        }
      });
      return product;
    });
  }
};

// src/controllers/product/CraeteProductController.ts
var CreateProductController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const { name, price, description, category_id } = req.body;
      const createProductService = new CreateProductService();
      if (!req.file) {
        throw new Error("error upload file");
      } else {
        const { originalname, filename: banner } = req.file;
        const product = yield createProductService.execute({
          name,
          price,
          description,
          banner,
          category_id
        });
        return res.json(product);
      }
    });
  }
};

// src/services/product/ListByCategoryService.ts
var ListByCategoryService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ category_id }) {
      const findByCategory = yield prisma_default.product.findMany({
        where: {
          category_id
        }
      });
      return findByCategory;
    });
  }
};

// src/controllers/product/ListByCategoryController.ts
var ListByCategoryController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const category_id = req.query.category_id;
      const listByCategory = new ListByCategoryService();
      const products = yield listByCategory.execute({
        category_id
      });
      return res.json(products);
    });
  }
};

// src/services/order/CreateOrderService.ts
var CreateOrderService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ table, name }) {
      const order = yield prisma_default.order.create({
        data: {
          table,
          name
        }
      });
      return order;
    });
  }
};

// src/controllers/order/CreateOrderController.ts
var CreateOrderController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const { table, name } = req.body;
      const createOrderService = new CreateOrderService();
      const order = yield createOrderService.execute({
        table,
        name
      });
      return res.json(order);
    });
  }
};

// src/services/order/RemoveOrderService.ts
var RemoveOrderService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ order_id }) {
      const order = yield prisma_default.order.delete({
        where: {
          id: order_id
        }
      });
      return order;
    });
  }
};

// src/controllers/order/RemoveOrderController.ts
var RemoveOrderController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const order_id = req.query.order_id;
      const removerOrder = new RemoveOrderService();
      const order = yield removerOrder.execute({
        order_id
      });
      return res.json(order);
    });
  }
};

// src/services/order/AddItemService.ts
var AddItemService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ order_id, product_id, amount }) {
      const order = yield prisma_default.item.create({
        data: {
          order_id,
          product_id,
          amount
        }
      });
      return order;
    });
  }
};

// src/controllers/order/AddItemController.ts
var AddItemController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const { order_id, product_id, amount } = req.body;
      const addItem = new AddItemService();
      const order = yield addItem.execute({
        order_id,
        product_id,
        amount
      });
      return res.json(order);
    });
  }
};

// src/services/order/RemoveItemService.ts
var RemoveItemService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ item_id }) {
      const order = yield prisma_default.item.delete({
        where: {
          id: item_id
        }
      });
      return order;
    });
  }
};

// src/controllers/order/RemoveItemController.ts
var RemoveItemController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const item_id = req.query.item_id;
      const removeItemService = new RemoveItemService();
      const order = yield removeItemService.execute({
        item_id
      });
      return res.json(order);
    });
  }
};

// src/services/order/SendOrderService.ts
var SendOrderService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ order_id }) {
      const order = yield prisma_default.order.update({
        where: {
          id: order_id
        },
        data: {
          draft: false
        }
      });
      return order;
    });
  }
};

// src/controllers/order/SendOrderController.ts
var SendOrderController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const { order_id } = req.body;
      const sendOrder = new SendOrderService();
      const order = yield sendOrder.execute({
        order_id
      });
      return res.json(order);
    });
  }
};

// src/services/order/ListOderService.ts
var ListOderService = class {
  execute() {
    return __async(this, null, function* () {
      const order = yield prisma_default.order.findMany({
        where: {
          draft: false,
          status: false
        },
        orderBy: {
          craeted_at: "desc"
        }
      });
      return order;
    });
  }
};

// src/controllers/order/ListOderController.ts
var ListOrderController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const listOrderService = new ListOderService();
      const orders = yield listOrderService.execute();
      return res.json(orders);
    });
  }
};

// src/services/order/DetailOrderService.ts
var DetailOrderService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ order_id }) {
      const orders = yield prisma_default.item.findMany({
        where: {
          order_id
        },
        include: {
          product: true,
          order: true
        }
      });
      return orders;
    });
  }
};

// src/controllers/order/DetailOrderController.ts
var DetailOrderController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const order_id = req.query.order_id;
      const detailOrderService = new DetailOrderService();
      const orders = yield detailOrderService.execute({
        order_id
      });
      return res.json(orders);
    });
  }
};

// src/services/order/FinishOrderService.ts
var FinishOrderService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ order_id }) {
      const order = yield prisma_default.order.update({
        where: {
          id: order_id
        },
        data: {
          status: true
        }
      });
      return order;
    });
  }
};

// src/controllers/order/FinishOrderController.ts
var FinishOrderController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const { order_id } = req.body;
      const finishOrderService = new FinishOrderService();
      const order = yield finishOrderService.execute({
        order_id
      });
      return res.json(order);
    });
  }
};

// src/middlewares/isAuthenticated.ts
var import_jsonwebtoken2 = require("jsonwebtoken");
function isAuthenticated(req, res, next) {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).end();
  }
  const [, token] = authToken.split(" ");
  try {
    const { sub } = (0, import_jsonwebtoken2.verify)(
      token,
      process.env.JWT_SECRET
    );
    req.user_id = sub;
    return next();
  } catch (error) {
    return res.status(401).end();
  }
}

// src/config/multer.ts
var import_crypto = __toESM(require("crypto"));
var import_multer = __toESM(require("multer"));
var import_path = require("path");
var multer_default = {
  upload(folder) {
    return {
      storage: import_multer.default.diskStorage({
        destination: (0, import_path.resolve)(__dirname, "../", "..", folder),
        filename: (request, file, callback) => {
          const fileHash = import_crypto.default.randomBytes(16).toString("hex");
          const fileName = `${fileHash}-${file.originalname}`;
          return callback(null, fileName);
        }
      })
    };
  }
};

// src/routes.ts
var router = (0, import_express.Router)();
var upload = (0, import_multer2.default)(multer_default.upload("/tmp"));
router.post("/users", new CreateUserController().handle);
router.post("/session", new AuthUserController().handle);
router.get("/me", isAuthenticated, new DetailUserController().handle);
router.post("/category", isAuthenticated, new CreateCategoryController().handle);
router.get("/category", isAuthenticated, new ListCategoryController().handle);
router.get("/storage/", isAuthenticated);
router.post("/product", isAuthenticated, upload.single("file"), new CreateProductController().handle);
router.get("/category/product", isAuthenticated, new ListByCategoryController().handle);
router.post("/order", isAuthenticated, new CreateOrderController().handle);
router.delete("/order", isAuthenticated, new RemoveOrderController().handle);
router.post("/order/add", isAuthenticated, new AddItemController().handle);
router.delete("/order/remove", isAuthenticated, new RemoveItemController().handle);
router.put("/order/send", isAuthenticated, new SendOrderController().handle);
router.get("/orders", isAuthenticated, new ListOrderController().handle);
router.get("/order/detail", isAuthenticated, new DetailOrderController().handle);
router.put("/order/finish", isAuthenticated, new FinishOrderController().handle);

// src/server.ts
var app = (0, import_express2.default)();
var path = require("path");
var PORT = process.env.PORT || 3333;
app.use(import_express2.default.json());
app.use((0, import_cors.default)());
app.get("/", (req, res) => {
  return res.json("hello word");
});
app.use(router);
app.use((err, req, res, next) => {
  if (err instanceof Error) {
    return res.status(400).json({
      error: err.message
    });
  }
  return res.status(500).json({
    status: "error",
    message: "Internal server error."
  });
});
app.use(import_express2.default.static("public"));
app.use(import_express2.default.static(path.join(__dirname, "/public")));
app.listen(PORT, () => console.log("Servidor online!!!!"));
