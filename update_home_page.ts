import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PageModel from './src/models/PageModel';

dotenv.config();

const update = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB');

        const homeSections = [
            { name: 'HeroSection', enabled: true, order: 1 },
            { name: 'Marquee', enabled: true, order: 2 },
            { name: 'HorizontalScroll', enabled: true, order: 3 },
            { name: 'ServicesOverview', enabled: true, order: 4 },
            { name: 'Collaborations', enabled: true, order: 5 },
            { name: 'OurStory', enabled: true, order: 6 },
            { name: 'Colleges', enabled: true, order: 7 },
            { name: 'ReviewSection', enabled: true, order: 8 },
            { name: 'WorkingProcess', enabled: true, order: 9 },
            { name: 'LatestProjects', enabled: true, order: 10 },
            { name: 'ParallaxImage', enabled: true, order: 11 },
            { name: 'CompanyInsights', enabled: true, order: 12 },
            { name: 'RoadmapSection', enabled: true, order: 13 },
            { name: 'FeaturedIn', enabled: true, order: 14 },
            { name: 'Testimonials', enabled: true, order: 15 },
            { name: 'MentorsSection', enabled: true, order: 16 }
        ];

        let homePage = await PageModel.findOne({ name: 'Home' });
        if (homePage) {
            homePage.sections = homeSections;
            if (!homePage.slug) homePage.slug = 'home';
            await homePage.save();
            console.log('Updated existing Home page structure');
        } else {
            await PageModel.create({ name: 'Home', slug: 'home', sections: homeSections });
            console.log('Created new Home page structure');
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

update();
