const API_BASE = 'http://localhost:5000/api/admin';

async function seedTestimonials() {
    const testimonials = [
        {
            name: "John Doe",
            role: "Entrepreneur",
            content: "Sparkiit helped me scale my startup in record time. Their team is dedicated and highly skilled!",
            order: 1
        },
        {
            name: "Jane Smith",
            role: "Marketing Head",
            content: "The best agency I've ever worked with. Their creativity knows no bounds.",
            order: 2
        },
        {
            name: "Robert Brown",
            role: "CTO at Tech Corp",
            content: "Clean code, amazing design, and excellent communication. Highly recommended.",
            order: 3
        }
    ];

    for (const t of testimonials) {
        try {
            const res = await fetch(`${API_BASE}/testimonials`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(t)
            });
            const data = await res.json();
            console.log(`Created testimonial for ${t.name}:`, data.success);
        } catch (error) {
            console.error(`Error creating testimonial for ${t.name}:`, error.message);
        }
    }
}

seedTestimonials();
