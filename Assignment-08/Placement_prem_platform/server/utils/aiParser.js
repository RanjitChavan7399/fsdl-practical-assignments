const extractAndParseJSON = (responseString) => {
    try {
        // First, check if the string itself is purely valid JSON
        return JSON.parse(responseString);
    } catch (e) {
        // If not, use regex to find a JSON block (maybe enclosed in markdown ```json ... ```)
        const jsonMatch = responseString.match(/```json\n([\s\S]*?)```/) || 
                          responseString.match(/```\n([\s\S]*?)```/) ||
                          responseString.match(/({[\s\S]*?})/);
        
        if (jsonMatch && jsonMatch[1]) {
            try {
                return JSON.parse(jsonMatch[1]);
            } catch (innerError) {
                console.error("Failed to parse extracted JSON content", innerError);
            }
        }
    }
    
    throw new Error('Failed to extract valid JSON from the response');
};

const validateKeys = (parsedObj, requiredKeys) => {
    for (const key of requiredKeys) {
        if (parsedObj[key] === undefined) {
            return false;
        }
    }
    return true;
};

module.exports = {
    extractAndParseJSON,
    validateKeys
};
