const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const checkAuth = require("../middleware/checkAuth");

/* Product Categories */
router.post(
	"/categories",
	checkAuth.isSuperAdminCheck,
	productController.createCategory
);
router.get(
	"/categories",
	checkAuth.verifyToken,
	productController.findAllCategories
);
router.get(
	"/categories/:id",
	checkAuth.verifyToken,
	productController.findOneCategory
);
router.get(
	"/categories/data-table/fetch",
	checkAuth.isSuperAdminCheck,
	productController.fetchCategoriesForDataTable
);
router.put(
	"/categories/:id",
	checkAuth.isSuperAdminCheck,
	productController.updateCategory
);
router.delete(
	"/categories/:id",
	checkAuth.isSuperAdminCheck,
	productController.deleteCategory
);

/* Product Brands */
router.post(
	"/brands",
	checkAuth.isSuperAdminCheck,
	productController.createBrand
);
router.get("/brands", checkAuth.verifyToken, productController.findAllBrands);
router.get(
	"/brands/:id",
	checkAuth.verifyToken,
	productController.findOneBrand
);
router.get(
	"/brands/data-table/fetch",
	checkAuth.isSuperAdminCheck,
	productController.fetchBrandsForDataTable
);
router.put(
	"/brands/:id",
	checkAuth.isSuperAdminCheck,
	productController.updateBrand
);
router.delete(
	"/brands/:id",
	checkAuth.isSuperAdminCheck,
	productController.deleteBrand
);

/* Products */
router.post(
	"/products",
	checkAuth.isAdminOrSuperAdminCheck,
	productController.createProduct
);
router.get(
	"/products",
	checkAuth.verifyToken,
	productController.findAllProducts
);
router.get(
	"/products/:id",
	checkAuth.verifyToken,
	productController.findOneProduct
);
router.get(
	"/products/data-table/fetch",
	checkAuth.isAdminOrSuperAdminCheck,
	productController.fetchProductsForDataTable
);
router.put(
	"/products/:id",
	checkAuth.isAdminOrSuperAdminCheck,
	productController.updateProduct
);
router.delete(
	"/products/:id",
	checkAuth.isAdminOrSuperAdminCheck,
	productController.deleteProduct
);
router.post(
	"/return-product-stock",
	checkAuth.verifyToken,
	productController.returnProduct
);
router.get(
	"/product-financial-report",
	checkAuth.isAdminOrSuperAdminCheck,
	productController.getProductFinancialReport
);

module.exports = router;
