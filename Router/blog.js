const { Router } = require("express");
const {
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  updateBlog,
  getBlogByTitle,
  getBlogByUrl,
  ImgToUrl,
  getBlogsInLimit,
  createBlogCategory,
  getBlogCategory,
  addBlogUrls
} = require("../Controller/blog.js");
const {
  authorizedRole,
  isAuthenticate
} = require("../middleware/Authprovider.js");
const multer = require("multer");
const uploadFromUrl = require("../middleware/multer.js");

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/create",
  upload.single("image"),
  // isAuthenticate,
  // authorizedRole("blogger", "admin"),
  uploadFromUrl,
  createBlog
);
router.post(
  "/imgtourl",
  // isAuthenticate,
  // authorizedRole("blogger", "admin"),
  upload.single("image"),
  uploadFromUrl,
  ImgToUrl
);
router.get("/categories", getBlogCategory);
router.get("/all", getBlogs);
router.get("/withpagination", getBlogsInLimit);
router.get("/:id", getBlogById);
router.get("/url/:url", getBlogByUrl);
router.get("/title/:title", getBlogByTitle);
router.post("/update-url", addBlogUrls);
router.delete(
  "/delete/:id",
  isAuthenticate,
  authorizedRole("blogger", "admin"),
  deleteBlog
);
router.put(
  "/edit/:id",
  // isAuthenticate,
  // authorizedRole("admin", "blogger"),
  upload.single("image"),
  uploadFromUrl,
  updateBlog
);
router.post(
  "/create/category",
  // isAuthenticate,
  // authorizedRole("admin", "blogger"),
  createBlogCategory
);

module.exports = router;
