"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignMembers = exports.deleteTarget = exports.getPerformanceStats = exports.setTarget = exports.getAllUsersForTeam = exports.getTeamPerformanceSummary = exports.getMyTeam = void 0;
const User_1 = __importDefault(require("../models/User"));
const Performance_1 = __importDefault(require("../models/Performance"));
const Order_1 = __importDefault(require("../models/Order"));
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * GET /api/admin/employees/team
 * Returns the list of users reporting to the current logged-in user.
 * SUPER_ADMIN sees all non-SUPER_ADMIN users.
 */
const getMyTeam = async (req, res) => {
    try {
        let leadId = req.user._id;
        // Allow SUPER_ADMIN to view specific teams
        if (req.user.role === 'SUPER_ADMIN' && req.query.leadId) {
            leadId = req.query.leadId;
            const subordinates = await User_1.default.find({ reportingTo: leadId }).select('-password').sort({ createdAt: -1 });
            res.json({ success: true, data: subordinates });
            return;
        }
        let subordinates;
        if (req.user.role === 'SUPER_ADMIN') {
            subordinates = await User_1.default.find({ role: { $ne: 'SUPER_ADMIN' } }).select('-password').sort({ createdAt: -1 });
        }
        else {
            subordinates = await User_1.default.find({ reportingTo: leadId }).select('-password').sort({ createdAt: -1 });
        }
        res.json({ success: true, data: subordinates });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyTeam = getMyTeam;
/**
 * GET /api/admin/employees/team-summary
 * Returns aggregated stats for the entire team.
 */
const getTeamPerformanceSummary = async (req, res) => {
    try {
        let leadId = req.user._id;
        // Support override for SUPER_ADMIN
        if (req.user.role === 'SUPER_ADMIN' && req.query.leadId) {
            leadId = req.query.leadId;
        }
        let query = { reportingTo: leadId };
        if (req.user.role === 'SUPER_ADMIN' && !req.query.leadId)
            query = { role: { $ne: 'SUPER_ADMIN' } };
        const subordinates = await User_1.default.find(query).select('_id');
        const subIds = subordinates.map(s => s._id);
        const { customStart, customEnd } = req.query;
        let orderMatch = { saleBy: { $in: subIds }, status: 'success' };
        let targetQuery = { userId: { $in: subIds } };
        if (customStart && customEnd) {
            const start = new Date(customStart);
            const end = new Date(customEnd);
            orderMatch.createdAt = { $gte: start, $lte: end };
            // Overlap check for targets
            targetQuery.$or = [
                { startDate: { $lte: end }, endDate: { $gte: start } }
            ];
        }
        const targets = await Performance_1.default.find(targetQuery);
        // Aggregate stats
        const totalTargetRevenue = targets.reduce((sum, t) => sum + (t.targetRevenue || 0), 0);
        const totalTargetCount = targets.reduce((sum, t) => sum + (t.targetCount || 0), 0);
        const totalManualRevenue = targets.reduce((sum, t) => sum + (t.manualAdjustmentAmount || 0), 0);
        const totalManualCount = targets.reduce((sum, t) => sum + (t.manualAdjustmentCount || 0), 0);
        // Fetch all successful orders for team
        const orders = await Order_1.default.aggregate([
            {
                $match: orderMatch
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$amount' },
                    totalCount: { $sum: 1 }
                }
            }
        ]);
        const sysRev = orders.length > 0 ? orders[0].totalRevenue : 0;
        const sysCount = orders.length > 0 ? orders[0].totalCount : 0;
        res.json({
            success: true,
            data: {
                memberCount: subIds.length,
                totalTargetRevenue,
                totalTargetCount,
                achievedRevenue: sysRev + totalManualRevenue,
                achievedCount: sysCount + totalManualCount,
                systemRevenue: sysRev,
                manualRevenue: totalManualRevenue,
                isCustomRange: !!(customStart && customEnd)
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getTeamPerformanceSummary = getTeamPerformanceSummary;
/**
 * GET /api/admin/employees/all-users
 * Returns all non-SUPER_ADMIN users for assignment purposes.
 */
const getAllUsersForTeam = async (req, res) => {
    try {
        const users = await User_1.default.find({ role: { $ne: 'SUPER_ADMIN' } }).select('-password').sort({ username: 1 });
        res.json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllUsersForTeam = getAllUsersForTeam;
/**
 * POST /api/admin/employees/target
 * Sets or updates a target for a subordinate.
 */
const setTarget = async (req, res) => {
    try {
        const leadId = req.user._id;
        const { _id, userId, title, startDate, endDate, targetRevenue, targetCount, manualAdjustmentAmount, manualAdjustmentCount } = req.body;
        if (!userId || !startDate || !endDate) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }
        // Verify that the target user reports to this lead (unless requester is SUPER_ADMIN)
        if (req.user.role !== 'SUPER_ADMIN') {
            const user = await User_1.default.findById(userId);
            if (!user || user.reportingTo?.toString() !== leadId.toString()) {
                res.status(403).json({ success: false, message: 'You can only set targets for your subordinates' });
                return;
            }
        }
        let performance;
        if (_id) {
            // Update by ID
            performance = await Performance_1.default.findByIdAndUpdate(_id, {
                userId,
                leadId,
                title,
                startDate,
                endDate,
                targetRevenue,
                targetCount,
                manualAdjustmentAmount,
                manualAdjustmentCount
            }, { new: true });
        }
        else {
            // Create or update by unique combination (original logic)
            performance = await Performance_1.default.findOneAndUpdate({ userId, startDate, endDate, leadId }, {
                title,
                targetRevenue,
                targetCount,
                manualAdjustmentAmount,
                manualAdjustmentCount
            }, { upsert: true, new: true });
        }
        res.json({ success: true, data: performance });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.setTarget = setTarget;
/**
 * GET /api/admin/employees/performance/:userId
 * Calculates real-time performance stats for a user.
 */
const getPerformanceStats = async (req, res) => {
    try {
        const { userId } = req.params;
        const requesterId = req.user._id;
        // check authorization: Admin, the lead, or the user themselves
        if (req.user.role !== 'SUPER_ADMIN' && req.user._id.toString() !== userId) {
            const user = await User_1.default.findById(userId);
            if (!user || user.reportingTo?.toString() !== requesterId.toString()) {
                res.status(403).json({ success: false, message: 'Unauthorized' });
                return;
            }
        }
        // Find active/recent targets
        const { customStart, customEnd } = req.query;
        let targetQuery = { userId };
        if (customStart && customEnd) {
            const start = new Date(customStart);
            const end = new Date(customEnd);
            targetQuery.$or = [
                { startDate: { $lte: end }, endDate: { $gte: start } }
            ];
        }
        const targets = await Performance_1.default.find(targetQuery).sort({ startDate: -1 });
        const stats = await Promise.all(targets.map(async (target) => {
            // Aggregate system orders for this user within this range
            const systemOrders = await Order_1.default.aggregate([
                {
                    $match: {
                        saleBy: new mongoose_1.default.Types.ObjectId(userId),
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getPerformanceStats = getPerformanceStats;
/**
 * DELETE /api/admin/employees/target/:id
 * Removes a performance target.
 */
const deleteTarget = async (req, res) => {
    try {
        const { id } = req.params;
        const target = await Performance_1.default.findById(id);
        if (!target) {
            res.status(404).json({ success: false, message: 'Target not found' });
            return;
        }
        // Only SUPER_ADMIN or the lead who created it can delete
        if (req.user.role !== 'SUPER_ADMIN' && target.leadId.toString() !== req.user._id.toString()) {
            res.status(403).json({ success: false, message: 'Unauthorized' });
            return;
        }
        await Performance_1.default.findByIdAndDelete(id);
        res.json({ success: true, message: 'Target deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteTarget = deleteTarget;
/**
 * POST /api/admin/employees/assign
 * Assigns multiple users to a reporting lead.
 */
const assignMembers = async (req, res) => {
    try {
        const { userIds, reportingTo } = req.body;
        const currentUserId = req.user._id;
        if (!Array.isArray(userIds)) {
            res.status(400).json({ success: false, message: 'userIds must be an array' });
            return;
        }
        // Determine target lead. SUPER_ADMIN can specify anyone. Others specify themselves.
        let targetLeadId = currentUserId;
        if (req.user.role === 'SUPER_ADMIN' && reportingTo) {
            targetLeadId = reportingTo;
        }
        // Verify targetLeadId is actually a lead/admin role
        const lead = await User_1.default.findById(targetLeadId);
        if (!lead || !['SUPER_ADMIN', 'ADMIN', 'TEAM_LEADER', 'MANAGER'].includes(lead.role)) {
            res.status(400).json({ success: false, message: 'Invalid target lead role' });
            return;
        }
        // Bulk update users
        await User_1.default.updateMany({ _id: { $in: userIds } }, { $set: { reportingTo: targetLeadId } });
        res.json({ success: true, message: `Successfully assigned ${userIds.length} members` });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.assignMembers = assignMembers;
