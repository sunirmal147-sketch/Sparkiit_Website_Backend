"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getAllBlogs = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
// GET /api/admin/blogs
const getAllBlogs = async (req, res) => {
    try {
        const { search, status, category } = req.query;
        const filter = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }
        if (status)
            filter.status = status;
        if (category)
            filter.category = category;
        const items = await Blog_1.default.find(filter).sort({ createdAt: -1 }).populate('authorId', 'name email');
        res.json({ success: true, data: items, count: items.length });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllBlogs = getAllBlogs;
// POST /api/admin/blogs
const createBlog = async (req, res) => {
    try {
        const { title } = req.body;
        if (!req.body.slug && title) {
            req.body.slug = title.toLowerCase().split(' ').join('-');
        }
        const newItem = await Blog_1.default.create(req.body);
        res.status(201).json({ success: true, data: newItem });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createBlog = createBlog;
// PUT /api/admin/blogs/:id
const updateBlog = async (req, res) => {
    try {
        const updatedItem = await Blog_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedItem) {
            res.status(404).json({ success: false, message: 'Blog not found' });
            return;
        }
        res.json({ success: true, data: updatedItem });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateBlog = updateBlog;
// DELETE /api/admin/blogs/:id
const deleteBlog = async (req, res) => {
    try {
        const deletedItem = await Blog_1.default.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            res.status(404).json({ success: false, message: 'Blog not found' });
            return;
        }
        res.json({ success: true, message: 'Blog deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteBlog = deleteBlog;
