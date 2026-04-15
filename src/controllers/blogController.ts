import { Request, Response } from 'express';
import Blog from '../models/Blog';

// GET /api/admin/blogs
export const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search, status, category } = req.query;
        const filter: any = {};
        
        if (search) {
            filter.$or = [
                { title: { $regex: search as string, $options: 'i' } },
                { tags: { $in: [new RegExp(search as string, 'i')] } }
            ];
        }
        if (status) filter.status = status;
        if (category) filter.category = category;

        const items = await Blog.find(filter).sort({ createdAt: -1 }).populate('authorId', 'name email');
        res.json({ success: true, data: items, count: items.length });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/admin/blogs
export const createBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title } = req.body;
        if (!req.body.slug && title) {
            req.body.slug = title.toLowerCase().split(' ').join('-');
        }
        const newItem = await Blog.create(req.body);
        res.status(201).json({ success: true, data: newItem });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// PUT /api/admin/blogs/:id
export const updateBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedItem = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedItem) {
            res.status(404).json({ success: false, message: 'Blog not found' });
            return;
        }
        res.json({ success: true, data: updatedItem });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE /api/admin/blogs/:id
export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedItem = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            res.status(404).json({ success: false, message: 'Blog not found' });
            return;
        }
        res.json({ success: true, message: 'Blog deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

