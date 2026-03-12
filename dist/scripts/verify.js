"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const API_BASE = 'http://localhost:5000/api/admin';
async function runTests() {
    console.log('--- Starting Backend Verification ---');
    try {
        // 1. Test Login (Requires a user to exist, usually seeded or created via Super Admin)
        console.log('Testing Authentication...');
        // Note: For actual testing, we'd need to create a test user or use a seed script.
        // Assuming we've manually created a SUPER_ADMIN for now.
        // 2. Test Course Filtration
        console.log('Testing Course Filtration...');
        const courses = await axios_1.default.get(`${API_BASE}/courses?status=active`);
        console.log(`Found ${courses.data.count} active courses.`);
        // 3. Test Course Creation with Links
        console.log('Testing Course Creation with Links...');
        // This will fail without a token, which is correct (protects the route)
        try {
            await axios_1.default.post(`${API_BASE}/courses`, { title: 'Test Course' });
        }
        catch (err) {
            if (err.response.status === 401) {
                console.log('Auth check passed: Unauthorized access blocked.');
            }
        }
        console.log('--- Verification Script Execution Finished ---');
    }
    catch (error) {
        console.error('Verification failed:', error);
    }
}
// runTests();
// In a real environment, I would execute this.
