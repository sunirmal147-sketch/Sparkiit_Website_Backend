const fetch = require('node-fetch');

const verify = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/public/homepage');
        const data = await res.json();
        console.log('Success:', data.success);
        console.log('Page Structure Length:', data.data.pageStructure?.length);
        console.log('First Section:', data.data.pageStructure?.[0]?.name);
        process.exit(0);
    } catch (error) {
        console.error('Error verifying:', error.message);
        process.exit(1);
    }
};

verify();
