
// Import ModelFactory
ModelFactory = require('../../Models/ModelFactory');

// Import logger
const logger = require('../../utils/logger/logger');

// Create Bill
async function create(req) {

    try {

        // Get atributes
        const { Amount, Id_haulage } = req;

        // Create Bill
        await ModelFactory.getModel("Bill").create(
            {
              Amount: Amount,
              Id_haulage: Id_haulage
            },
            {
                fields: ["Amount", "Id_haulage"]
            }
        );
        logger.info("BillController: Bill was created successfully.");
        return {status:1};
        
    } catch (error) {
        logger.error("BillController: " + error);
        return {status:-1, error: error};
    }

}

module.exports = { create: create };
