
// Import ModelFactory
ModelFactory = require('../../Models/ModelFactory');

// Import logger
const logger = require('../../utils/logger/logger');

//Return cargo information
async function getCargoInfo(cargo_id){
    try{
    var CargoModel = await ModelFactory.getModel("Cargo")
    let cargo_info = await CargoModel.findAll(
        { where: { Id_cargo: cargo_id } }
        )
    //query returns array of users that match were clause
    if(cargo_info.length==0)
    {
        logger.info("CargoController: No cargo found with that id")
        return {status:0, data:" No cargo information found with that id"}
    }
    else{
        logger.info("CargoController: Cargo info found")
        return {status: 1, data: cargo_info[0].dataValues}
    }

  } catch (error) {
    logger.info("CargoController: "+ error)
    return {status:-1, data:error}
    }
}

// Create Cargo
async function create(req) {

    try {

        // Get atributes
        const { Weight, Description, Comments } = req;

        // Create Cargo
        let new_Cargo = await ModelFactory.getModel("Cargo").create(
            {
                Weight: Weight,
                Description: Description,
                Comments: Comments
            }
        );
        logger.info("CargoController: Cargo was created successfully.");
        return {status: 1, data: new_Cargo.Id_cargo};

    } catch (error) {
        logger.error("CargoController: " + error);
        return {status: -1, error: error};
    }

}

module.exports = { create: create, getCargoInfo: getCargoInfo };
