const fs = require('fs');
const path = require('path');
const models = ['Badge', 'Blog', 'Order', 'Coupon', 'Withdrawal', 'Location', 'Brand', 'FooterSetting', 'Menu', 'PageModel', 'SocialLink', 'Faq', 'Setting'];
const baseModelsPath = 'e:/Sparkiit_Website/Sparkiit_Website_Backend/src/models';
const baseControllersPath = 'e:/Sparkiit_Website/Sparkiit_Website_Backend/src/controllers';

models.forEach(m => {
  // Model
  const modelContent = `import mongoose, { Schema, Document } from 'mongoose';

export interface I${m} extends Document {
    name: string;
}

const ${m}Schema: Schema = new Schema({
    name: { type: String, required: true },
}, {
    timestamps: true
});

export default mongoose.models.${m} || mongoose.model<I${m}>('${m}', ${m}Schema);
`;
  fs.writeFileSync(path.join(baseModelsPath, `${m}.ts`), modelContent);

  // Controller
  const cName = m.charAt(0).toLowerCase() + m.slice(1);
  const controllerContent = `import { Request, Response } from 'express';
import ${m} from '../models/${m}';

export const getAll${m}s = async (req: Request, res: Response): Promise<void> => {
    try {
        const items = await ${m}.find();
        res.json({ success: true, data: items });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const create${m} = async (req: Request, res: Response): Promise<void> => {
    try {
        const newItem = new ${m}(req.body);
        await newItem.save();
        res.status(201).json({ success: true, data: newItem });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const update${m} = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedItem = await ${m}.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedItem) { res.status(404).json({ success: false, message: 'Not found' }); return; }
        res.json({ success: true, data: updatedItem });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const delete${m} = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedItem = await ${m}.findByIdAndDelete(req.params.id);
        if (!deletedItem) { res.status(404).json({ success: false, message: 'Not found' }); return; }
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
`;
  fs.writeFileSync(path.join(baseControllersPath, `${cName}Controller.ts`), controllerContent);
});
console.log('Models and Controllers created successfully!');
