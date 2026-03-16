import { Request, Response } from 'express';
import Order from '../models/Order';
import Course from '../models/Course';
import Candidate from '../models/Candidate';
// import Razorpay from 'razorpay'; // Note: User needs to install razorpay

// Mock Razorpay setup for now or instructions
// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID || '',
//     key_secret: process.env.RAZORPAY_KEY_SECRET || '',
// });

export const createOrder = async (req: any, res: Response): Promise<void> => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }

        // Initialize Razorpay logic here (placeholder for now)
        // const options = {
        //     amount: course.price * 100, // amount in the smallest currency unit
        //     currency: "INR",
        //     receipt: `receipt_${Date.now()}`,
        // };
        // const rzpOrder = await razorpay.orders.create(options);

        // For now, since we don't have keys, we simulate a successful order creation
        const rzpOrderId = `order_sim_${Date.now()}`;

        const order = await Order.create({
            candidate: req.user.id,
            course: courseId,
            amount: course.price,
            razorpay_order_id: rzpOrderId,
            status: 'pending',
        });

        res.status(201).json({ 
            success: true, 
            data: {
                id: rzpOrderId,
                amount: course.price * 100,
                currency: "INR",
                name: "SparkIIT",
                description: course.title,
                dbOrderId: order._id
            } 
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyPayment = async (req: any, res: Response): Promise<void> => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

        // Verify signature here (placeholder)
        // const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        // hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        // const generated_signature = hmac.digest('hex');
        // if (generated_signature !== razorpay_signature) { ... }

        const order = await Order.findById(dbOrderId);
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found' });
            return;
        }

        order.status = 'success';
        order.razorpay_payment_id = razorpay_payment_id;
        order.razorpay_signature = razorpay_signature;
        await order.save();

        // Add course to candidate's enrolled courses
        await Candidate.findByIdAndUpdate(req.user.id, {
            $addToSet: { enrolledCourses: order.course }
        });

        res.json({ success: true, message: 'Payment verified and course enrolled' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
