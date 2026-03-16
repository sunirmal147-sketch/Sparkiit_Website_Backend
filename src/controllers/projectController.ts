import { Request, Response } from 'express';
import Project from '../models/Project';

// GET /api/admin/projects
export const getAllProjectsAdmin = async (_req: Request, res: Response): Promise<void> => {
    try {
        const projects = await Project.find().sort({ order: 1 });
        res.json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// POST /api/admin/projects
export const createProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// PUT /api/admin/projects/:id
export const updateProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!project) {
            res.status(404).json({ success: false, message: 'Project not found' });
            return;
        }
        res.json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// DELETE /api/admin/projects/:id
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            res.status(404).json({ success: false, message: 'Project not found' });
            return;
        }
        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
