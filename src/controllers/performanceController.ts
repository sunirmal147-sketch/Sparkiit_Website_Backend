import { Request, Response } from 'express';
import User from '../models/User';
import Performance from '../models/Performance';
import Order from '../models/Order';
import mongoose from 'mongoose';

/**
 * GET /api/admin/employees/team
 * Returns the list of users reporting to the current logged-in user.
 */
export const getMyTeam = async (req: any, res: Response): Promise<void> => {
    try {
        const leadId = req.user._id;
        const subordinates = await User.find({ reportingTo: leadId }).select('-password');
        res.json({ success: true, data: subordinates });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * POST /api/admin/employees/target
 * Sets or updates a target for a subordinate.
 */
export const setTarget = async (req: any, res: Response): Promise<void> => {
    try {
        const leadId = req.user._id;
        const { userId, title, startDate, endDate, targetRevenue, targetCount, manualAdjustmentAmount, manualAdjustmentCount } = req.body;

        if (!userId || !startDate || !endDate) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }

        // Verify that the target user reports to this lead (unless requester is SUPER_ADMIN)
        if (req.user.role !== 'SUPER_ADMIN') {
            const user = await User.findById(userId);
            if (!user || user.reportingTo?.toString() !== leadId.toString()) {
                res.status(403).json({ success: false, message: 'You can only set targets for your subordinates' });
                return;
            }
        }

        const performance = await Performance.findOneAndUpdate(
            { userId, startDate, endDate, leadId },
            { 
                title, 
                targetRevenue, 
                targetCount, 
                manualAdjustmentAmount, 
                manualAdjustmentCount 
            },
            { upsert: true, new: true }
        );

        res.json({ success: true, data: performance });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/admin/employees/performance/:userId
 * Calculates real-time performance stats for a user.
 */
export const getPerformanceStats = async (req: any, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const requesterId = req.user._id;

        // check authorization: Admin, the lead, or the user themselves
        if (req.user.role !== 'SUPER_ADMIN' && req.user._id.toString() !== userId) {
            const user = await User.findById(userId);
            if (!user || user.reportingTo?.toString() !== requesterId.toString()) {
                res.status(403).json({ success: false, message: 'Unauthorized' });
                return;
            }
        }

        // Find active/recent targets
        const targets = await Performance.find({ userId }).sort({ startDate: -1 });

        const stats = await Promise.all(targets.map(async (target) => {
            // Aggregate system orders for this user within this range
            const systemOrders = await Order.aggregate([
                {
                    $match: {
                        saleBy: new mongoose.Types.ObjectId(userId),
                        status: 'success',
                        createdAt: { $gte: new Date(target.startDate), $lte: new Date(target.endDate) }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$amount' },
                        totalCount: { $sum: 1 }
                    }
                }
            ]);

            const sysRev = systemOrders.length > 0 ? systemOrders[0].totalRevenue : 0;
            const sysCount = systemOrders.length > 0 ? systemOrders[0].totalCount : 0;

            return {
                _id: target._id,
                title: target.title,
                startDate: target.startDate,
                endDate: target.endDate,
                targetRevenue: target.targetRevenue,
                targetCount: target.targetCount,
                achievedRevenue: sysRev + target.manualAdjustmentAmount,
                achievedCount: sysCount + target.manualAdjustmentCount,
                systemRevenue: sysRev,
                systemCount: sysCount,
                manualRevenue: target.manualAdjustmentAmount,
                manualCount: target.manualAdjustmentCount
            };
        }));

        res.json({ success: true, data: stats });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
