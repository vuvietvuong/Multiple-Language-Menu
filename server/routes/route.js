const rateLimit = require("express-rate-limit");
module.exports = (app) => {
  const LanguageSchedule = require("../schedule/language.schedule");
  const middleware = require("../middleware/middleware");
  const global = require("../controllers/global");
  const shopAdmin = require("../controllers/Admin/shop.admin");
  const profileShop = require("../controllers/Shop/profile.shop");
  const limiter = rateLimit({
    windowMs: 15 * 1000,
    max: 15,
  });
  // ROLE ADMIN
  // Login
  app.post("/api/admin/login", limiter, global.LoginAdmin);
  // Edit password
  app.put(
    "/api/admin/edit-password",
    limiter,
    [middleware.verifyTokenAdmin, middleware.checkPasswordEdit],
    global.editPassword
  );
  // Create shop
  app.post(
    "/api/admin/create-shop",
    limiter,
    [middleware.checkCreateShop],
    shopAdmin.createShop
  );
  // Update shop
  app.put(
    "/api/admin/shop/:id",
    limiter,
    [middleware.checkCreateShop],
    shopAdmin.editShop
  );
  // Get list shop
  app.get("/api/admin/shop", limiter, shopAdmin.getListShop);
  // Get shop by Id
  app.get("/api/admin/shop/:id", limiter, shopAdmin.getShopById);
  // Delete shop
  app.delete("/api/admin/shop/:id", limiter, shopAdmin.deleteShop);
  // ROLE SHOP
  // get QRCode
  app.get("/api/shop/qrcode", profileShop.createQRCode);
  // Login
  app.post("/api/shop/login", limiter, global.LoginShop);
  // Edit password
  app.put(
    "/api/shop/edit-password",
    limiter,
    [middleware.verifyTokenShop, middleware.checkPasswordEdit],
    global.editPassword
  );

  let IntervalCreateLanguage = () => {
    LanguageSchedule.createLanguage();
  };

  setInterval(IntervalCreateLanguage, 1000 * 60 * 60 * 24);
  clearInterval(IntervalCreateLanguage);
};
