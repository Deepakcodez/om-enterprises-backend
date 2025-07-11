const Blog = require("../models/blog.js");
const blogCategory = require("../models/blogCategory.js");

const createBlog = async (req, res) => {
  const { content, title, url, tags, metaDescription, metaTitle, categoryId } =
    req.body;
  const imageUrl = req.imageUrl;
  console.log(imageUrl, content, title);

  if ((!content && !title && !imageUrl && !url && !tags && !categoryId) ) {
    res.status(400).json({
      success: false,
      msg: "Content is required"
    });
  }
  try {
    await Blog.create({
      content,
      title,
      image: imageUrl,
      url,
      tags,
      category: categoryId || null,
      metaDescription: metaDescription || title,
      metaTitle: metaTitle || title
    });
    return res.status(200).json({
      success: true,
      msg: "Blog created successfully"
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      success: false,
      msg: "Server Error"
    });
  }
};

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    if (!blogs) {
      return res.status(404).json({
        success: false,
        msg: "No blogs found"
      });
    }
    return res.status(200).json({
      success: true,
      msg: "blog founded",
      blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Server Error"
    });
  }
};

const getBlogsInLimit = async (req, res) => {
  console.log("getBlogsInLimit called");
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments();

    return res.status(200).json({
      success: true,
      msg: "Blogs retrieved successfully",
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
      totalBlogs,
      blogs
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      success: false,
      msg: "Server Error"
    });
  }
};

const getBlogById = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  if (!id) {
    return res.status(404).json({
      success: false,
      msg: "No blogs found"
    });
  }
  try {
    const blog = await Blog.findOne({ _id: id });
    if (!blog) {
      return res.status(404).json({
        success: false,
        msg: "No blog found"
      });
    }
    return res.status(200).json({
      success: true,
      msg: "blog founded",
      blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Server Error"
    });
  }
};

const getBlogByTitle = async (req, res) => {
  const { title } = req.params;
  console.log(title);

  const normalizedTitle = decodeURIComponent(title)
    .replace(/~/g, "?")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ") // collapse extra spaces
    .trim();

  console.log("from title", normalizedTitle);

  if (!title) {
    return res.status(404).json({
      success: false,
      msg: "No title found"
    });
  }

  // const allBlogs = await Blog.find({});
  // allBlogs.forEach((blog, i) => {
  //   console.log(`${i + 1}. [${blog.title}]`);
  // });
  try {
    // const blog = await Blog.findOne({
    //   title: { $regex: new RegExp(`^${normalizedTitle}$`, 'i') }
    // });
    const blog = await Blog.findOne({
      title: normalizedTitle
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        msg: "No blog found"
      });
    }
    return res.status(200).json({
      success: true,
      msg: "blog founded",
      blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Server Error"
    });
  }
};

const getBlogByUrl = async (req, res) => {
  const { url } = req.params;
  console.log(url);

  if (!url) {
    return res.status(404).json({
      success: false,
      msg: "No blogs found"
    });
  }
  try {
    const blog = await Blog.findOne({ url });
    if (!blog) {
      return res.status(404).json({
        success: false,
        msg: "No blog found"
      });
    }
    return res.status(200).json({
      success: true,
      msg: "blog founded",
      blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Server Error"
    });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(404).json({
      success: false,
      msg: "No blogs found"
    });
  }
  try {
    const blog = await Blog.findOneAndDelete({ _id: id });
    if (!blog) {
      return res.status(404).json({
        success: false,
        msg: "No blog found"
      });
    }
    return res.status(200).json({
      success: true,
      msg: "blog founded",
      blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Server Error"
    });
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  console.log("Updating blog with ID:", req.body);
  try {
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        msg: "Blog not found"
      });
    }

    // Handle form data
    const updateData = {
      title: req.body.title || existingBlog.title,
      content: req.body.content || existingBlog.content,
      url: req.body.url || existingBlog.url,
      category: req.body.categoryId || existingBlog.category,
      metaDescription: req.body.metaDescription || existingBlog.metaDescription,
      metaTitle: req.body.title || existingBlog.metaTitle,
    };

    // Handle tags (parse from JSON string if needed)
    if (req.body.tags) {
      updateData.tags = typeof req.body.tags === 'string' 
        ? JSON.parse(req.body.tags) 
        : req.body.tags;
    } else {
      updateData.tags = existingBlog.tags;
    }

    // Handle image upload if present
    if (req.file) {
      updateData.image = req.imageUrl || existingBlog.image;
    }  

    await Blog.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ success: true, msg: "Blog updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Error updating blog" });
  }
};

const ImgToUrl = async (req, res) => {
  const imageUrl = req.imageUrl;
  if (!imageUrl) {
    return res.status(400).json({
      success: false,
      msg: "Image URL is required"
    });
  }
  try {
    return res.status(200).json({
      success: true,
      msg: "Image URL retrieved successfully",
      imageUrl
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Server Error"
    });
  }
};

const createBlogCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      msg: "Category name is required"
    });
  }

  try {
    const category = await blogCategory.create({ name });
    return res.status(201).json({
      success: true,
      msg: "Category created successfully",
      category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Server Error"
    });
  }
};

const getBlogCategory = async (req, res) => {
  console.log(" fetching categories:");
  try {
    const categories = await blogCategory.find();
    if (!categories) {
      return res.status(404).json({
        success: false,
        msg: "No categories found"
      });
    }
    return res.status(200).json({
      success: true,
      msg: "Categories retrieved successfully",
      categories
    });
  } catch (error) {
    console.log("Error fetching categories:", error);

    res.status(500).json({
      success: false,
      msg: "Server Error",
      error: error.message
    });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  getBlogByTitle,
  deleteBlog,
  updateBlog,
  getBlogByUrl,
  ImgToUrl,
  getBlogsInLimit,
  createBlogCategory,
  getBlogCategory
};
