const { exec } = require('child_process');
const path = require('path');

/**
 * Executes a Prolog query with dynamic user facts injected at runtime.
 * @param {string} userId - The ID of the user.
 * @param {Object} preferences - e.g. { category: 'gaming', budget: 'medium', purpose: 'gaming', brand: 'premium' }
 * @returns {Promise<Array>} - Resolves with ranked products: [ [Score, ProductId], ... ]
 */
const getRecommendationsFromProlog = (userId, preferences) => {
    return new Promise((resolve, reject) => {
        // 1. Build the dynamic assertion facts string
        let factsStr = '';
        for (const [key, value] of Object.entries(preferences)) {
            // value is expected to be a string/atom, e.g., 'gaming'
            factsStr += `assertz(user_pref('${userId}', ${key}, '${value}')), `;
        }

        // 2. Build the final query: Assert facts, then query recommend, then halt.
        // E.g., assertz(user_pref('u1', category, 'gaming')), recommend('u1', Recs), write(Recs), halt.
        const query = `${factsStr} recommend('${userId}', Recs), write(Recs), halt.`;

        const prologScriptPath = path.join(__dirname, '../ai/recommendation.pl');
        
        // Use double quotes for the query to avoid conflicts in windows
        const command = `swipl -q -s "${prologScriptPath}" -g "${query}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Prolog Execution Error: ${error.message}`);
                return reject(error);
            }
            if (stderr && !stderr.includes('Warning')) {
                // Some versions of SWI-Prolog output warnings to stderr. Ignore them unless it's a real error.
                console.error(`Prolog Stderr: ${stderr}`);
            }

            try {
                // stdout should be something like: [[100,p1],[70,p2],[50,p9]]
                // We need to parse this string into a JavaScript array.
                // It looks like a JSON array, but might have spacing or lack quotes around strings.
                
                let output = stdout.trim();
                if (!output || output === '[]') {
                    return resolve([]);
                }

                // Convert Prolog list format to valid JSON string
                // Example: [[100,p1],[70,p2]] -> [[100,"p1"],[70,"p2"]]
                output = output.replace(/([a-zA-Z0-9_]+)/g, (match) => {
                    // Don't quote numbers
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
    getRecommendationsFromProlog
};
