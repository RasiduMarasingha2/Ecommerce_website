const { getRecommendationsFromProlog } = require('./Backend/services/prologService');

async function testProlog() {
    console.log("Testing Prolog Integration...");
    try {
        const preferences = {
            category: 'gaming',
            budget: 'medium',
            purpose: 'gaming',
            brand: 'premium'
        };
        const results = await getRecommendationsFromProlog('test_user', preferences);
        console.log("Prolog Recommendations:", results);
    } catch (err) {
        console.error("Test Failed:", err);
    }
}

testProlog();
