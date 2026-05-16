const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');


const syncProductFacts = (products) => {
    let facts = '% product(Id, Name, Category, Budget, Brand, Purpose)\n\n';

    products.forEach(p => {
        const id = p._id.toString();
        const name = (p.title || 'unknown').replace(/'/g, ""); // escape single quotes
        const category = p.category?.name?.toLowerCase().replace(/'/g, "") || 'other';

        let budget = 'medium';
        if (p.price < 50) budget = 'low';
        else if (p.price > 200) budget = 'high';


        let brand = 'any';
        if (p.tags && p.tags.includes('premium')) brand = 'premium';
        if (p.tags && p.tags.includes('budget')) brand = 'budget';


        let purpose = 'casual';
        if (category.includes('gaming') || (p.tags && p.tags.includes('gaming'))) purpose = 'gaming';
        if (category.includes('work') || category.includes('electronics') || (p.tags && p.tags.includes('work'))) purpose = 'work';

        facts += `product('${id}', '${name}', '${category}', '${budget}', '${brand}', '${purpose}').\n`;
    });

    const productFactsPath = path.join(__dirname, '../ai/productFacts.pl');
    fs.writeFileSync(productFactsPath, facts, 'utf8');
};

/**
 * Executes a Prolog query with dynamic user facts injected at runtime.
 * @param {string} userId - The ID of the user.
 * @param {Object} preferences - e.g. { category: 'gaming', budget: 'medium', purpose: 'gaming', brand: 'premium' }
 * @returns {Promise<Array>} - Resolves with ranked products: [ [Score, ProductId], ... ]
 */
const getRecommendationsFromProlog = (userId, preferences) => {
    return new Promise((resolve, reject) => {

        let factsStr = '';
        for (const [key, value] of Object.entries(preferences)) {

            factsStr += `assertz(user_pref('${userId}', ${key}, '${value}')), `;
        }


        const query = `${factsStr} recommend('${userId}', Recs), write(Recs), halt.`;

        const prologScriptPath = path.join(__dirname, '../ai/recommendation.pl');


        const command = `swipl -q -s "${prologScriptPath}" -g "${query}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Prolog Execution Error: ${error.message}`);
                return reject(error);
            }
            if (stderr && !stderr.includes('Warning')) {

                console.error(`Prolog Stderr: ${stderr}`);
            }

            try {


                let output = stdout.trim();
                if (!output || output === '[]') {
                    return resolve([]);
                }

                output = output.replace(/([a-zA-Z0-9_]+)/g, (match) => {

                    if (!isNaN(match)) return match;
                    return `"${match}"`;
                });

                const parsedArray = JSON.parse(output);
                resolve(parsedArray);
            } catch (err) {
                console.error('Failed to parse Prolog output:', stdout);
                reject(err);
            }
        });
    });
};

module.exports = {
    getRecommendationsFromProlog,
    syncProductFacts
};
