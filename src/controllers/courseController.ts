import { Request, Response } from 'express';
import Course from '../models/Course';

// GET /api/admin/courses
export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search, status, category, batchStatus, minPrice, maxPrice, sortBy, level, instructorId, isPopular, showHomepage } = req.query;
        const filter: Record<string, any> = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search as string, $options: 'i' } },
                { description: { $regex: search as string, $options: 'i' } },
            ];
        }
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (batchStatus) filter.batchStatus = batchStatus;
        if (level) filter.level = level;
        if (instructorId) filter.instructorId = instructorId;
        if (isPopular !== undefined) filter.isPopular = isPopular === 'true';
        if (showHomepage !== undefined) filter.showHomepage = showHomepage === 'true';

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        let sortOption: any = { createdAt: -1 };
        if (sortBy === 'price_asc') sortOption = { price: 1 };
        else if (sortBy === 'price_desc') sortOption = { price: -1 };
        else if (sortBy === 'newest') sortOption = { createdAt: -1 };
        else if (sortBy === 'oldest') sortOption = { createdAt: 1 };

        const courses = await Course.find(filter).sort(sortOption).populate('instructorId', 'name email');
        res.json({ success: true, data: courses, count: courses.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// GET /api/admin/courses/:id
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await Course.findById(req.params.id).populate('instructorId', 'name email');
        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }
        res.json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// POST /api/admin/courses
export const createCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json({ success: true, data: course });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};


// PUT /api/admin/courses/:id
export const updateCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }
        res.json({ success: true, data: course });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE /api/admin/courses/:id
export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }
        res.json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

