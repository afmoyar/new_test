
// Import ModelFactory
ModelFactory = require('../../Models/ModelFactory');

// Import logger
const logger = require('../../utils/logger/logger');

//importing description values
const descprition = require('../../constants');

// Import status descriptions
const description = require("../../constants").status_description

//Return existing haulage data from user
async function getHaulages(user_id){
    try{
    var HaulageModel = await ModelFactory.getModel("Haulage")
    let haulages = await HaulageModel.findAll(
        { where: { Id_user: user_id } }
        )
    //query returns array of users that match were clause
    if(haulages.length==0)
    {
        logger.info("HaulageController: User has zero haulages")
        return {status:0, data:"no hulages found"}
    }
    else{
        logger.info("HaulageController: User haulages found")
        //h[0] should be the only user in array, .dataValues is Json containing atributes   return {status: 1,data: haulages.dataValues}
        return {status: 1, data: haulages}
    }

  } catch (error) {
    logger.info("HaulageController: "+ error)
    return {status:-1, data:error}
    }
}

// Create Haulage
//returns status 1 if created succesfully, data is new haulage
//returns status -1 if error
async function create(req) {

    try {
        // Get atributes
        const { Date, End_date, Id_user, Id_route, Id_cargo} = req;

        // Create Haulage
        let new_haulage = await ModelFactory.getModel("Haulage").create(
            {
                Date: Date,
                End_date: End_date,
                Id_user: Id_user,
                Id_route: Id_route,
                Id_cargo: Id_cargo,
                Id_status: descprition.status_description.RESERVED
            }
        );
        logger.info("HaulageController: Haulage was created successfully.");
        return {status: 1, data: new_haulage};

    } catch (error) {
        logger.error("HaulageController: " + error);
         return {status: -1, error:error};
    }
}

async function getRegisterBy(query){
    try{

        let list = await ModelFactory.getModel("Haulage").findAll(
            {
                where:query,
                raw:true,
                attributes:["Id_haulage","Date"]
            }
        )
        //console.log(weight.dataValues)
        logger.info("HaulageController: list was found successfully.");
        return {status: 1, data: list};
    }catch(error) {
        logger.error("HaulageController: " + error);
        return {status: -1, error:error};
    }

}

async function getRegisterByPk(Pk)
{
    try {
        let haulage = await ModelFactory.getModel("Haulage").findByPk(Pk,
            {
                raw: true
            })
        logger.info("HaulageController: register was returned successfully.");
        return {status: 1, data:haulage}

    } catch (error) {
        logger.error("HaulageController: " + error);
        return {status: -1, error: error};
    }
}

async function updateHaulageById(id, state, date)
{
    try {
        let result = await ModelFactory.getModel("Haulage").update(
            {Id_status: state, End_date: date},
            {returning: true, where: {Id_haulage: id}}
          )
        if (result) {
            return {status: 1}
        } else {
            logger.error("HaulageController: Query error");
            return {status: -1, error: "HaulageController: Query error"}
        }
    } catch (error) {
        logger.error("HaulageController: " + error);
        return {status: -1, error: error};
    }
}



async function setHaulageRating(haulage_id, rating_id)
{
    try {
        let result = await ModelFactory.getModel("Haulage").update(
            {Id_rating: rating_id}, //values
            {where: {Id_haulage: haulage_id}} //conditions
          )
        if (result) {
            return {status: 1}
        } else {
            logger.error("HaulageController: Query error");
            return {status: -1, error: "HaulageController: Query error"}
        }
    } catch (error) {
        logger.error("HaulageController: " + error);
        return {status: -1, error: error};
    }
}

module.exports = {
    create: create,
    getRegisterBy:getRegisterBy,
    getHaulages: getHaulages,
    getRegisterByPk:getRegisterByPk,
    updateHaulageById: updateHaulageById,
    setHaulageRating: setHaulageRating
};
