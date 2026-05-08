const User = require('../models/User');
const { getRecommendationsFromProlog } = require('../services/prologService');

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

        // Call Prolog Engine
        const rankedProducts = await getRecommendationsFromProlog(user._id.toString(), preferences);

        // rankedProducts is an array: [[Score, "ProductId"], ...]
        // In a real scenario, you would do a MongoDB `Product.find({ _id: { $in: productIds } })` here
        // and map the scores to the real database objects.
        // For now, we return the raw engine output which contains the ID strings from productFacts.pl

        res.status(200).json({
            success: true,
            count: rankedProducts.length,
            recommendations: rankedProducts.map(item => ({
                score: item[0],
                productId: item[1]
            }))
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
