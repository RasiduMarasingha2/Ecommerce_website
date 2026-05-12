const User = require('../models/User');
const Product = require('../models/Product');
const { getRecommendationsFromProlog, syncProductFacts } = require('../services/prologService');

// @desc    Save user onboarding answers
// @route   POST /api/recommendation/onboarding
// @access  Private
const saveUserOnboarding = async (req, res) => {
    try {
        const { category, budget, purpose, brand, style } = req.body;
        
        // Find user and update their recommendation map
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Initialize map if it doesn't exist
        if (!user.recommendationAnswers) {
            user.recommendationAnswers = new Map();
        }

        if (category) user.recommendationAnswers.set('category', category.toLowerCase());
        if (budget) user.recommendationAnswers.set('budget', budget.toLowerCase());
        if (purpose) user.recommendationAnswers.set('purpose', purpose.toLowerCase());
        if (brand) user.recommendationAnswers.set('brand', brand.toLowerCase());
        if (style) user.recommendationAnswers.set('style', style.toLowerCase());

        await user.save();

        res.status(200).json({ message: 'Onboarding preferences saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error saving onboarding' });
    }
};

// @desc    Get AI recommendations for a user
// @route   GET /api/recommendation/:userId
// @access  Private
const getRecommendations = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.recommendationAnswers || user.recommendationAnswers.size === 0) {
            return res.status(400).json({ message: 'User has not completed onboarding. No preferences found.' });
        }

        // Convert Map to basic object
        const preferences = Object.fromEntries(user.recommendationAnswers);

        // Fetch all products and sync
        const allProducts = await Product.find().populate('category');
        syncProductFacts(allProducts);

        // Call Prolog Engine
        const rankedProducts = await getRecommendationsFromProlog(user._id.toString(), preferences);

        // Fetch actual products
        const productIds = rankedProducts.map(item => item[1]);
        const productsFromDb = await Product.find({ _id: { $in: productIds } }).populate('category');

        // Create a map to keep the order from Prolog
        const productMap = {};
        productsFromDb.forEach(p => { productMap[p._id.toString()] = p; });

        const recommendations = rankedProducts
            .filter(item => productMap[item[1]]) // ensure it exists
            .map(item => ({
                score: item[0],
                product: productMap[item[1]]
            }));

        res.status(200).json({
            success: true,
            count: recommendations.length,
            recommendations
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error generating recommendations' });
    }
};

module.exports = {
    saveUserOnboarding,
    getRecommendations
};
