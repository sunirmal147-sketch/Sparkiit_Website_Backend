"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Test API Route
router.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is healthy' });
});
exports.default = router;
