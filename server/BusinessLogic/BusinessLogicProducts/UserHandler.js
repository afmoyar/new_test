
// Import ControllerFactory
ControllerFactory = require('../../Controllers/ControllerFactory');

// Import logger
const logger = require('../../utils/logger/logger');

//Used to hash password
var bcrypt = require('bcryptjs');

// Create user
async function createUser(req) {
    // Get atributes
    const { User_name, User_last_name, User_password, User_address, User_Email } = req.body.request;
    //Hash the password
    var User_password_hashed = bcrypt.hashSync(User_password, 10);
    // Create user
    let user = await ControllerFactory.getController("User").create(User_name, User_last_name, User_password_hashed, User_address, User_Email)
    if(user.status==1)
    {
        logger.info("UserHandler: User was created successfully.");
        return 1;
    }
    else{
        logger.error("UserHandler: " + user.error);
        return user.error;
    }
}

// Validate user
//status 0 = user not found
//status 1 = user found, id returned
//status -1 = error in UserModel.count, error message returned
//status -2 = error in UserModel.findAll from getUserByEmail, error message returned
async function validateUser(req) {
    // Get atributes
    const { User_Email, User_password } = req.body.request;

    // Validate user
    //count = await UserModel.count({ where: { User_Email: User_Email, User_password: User_password } })
    count = await ControllerFactory.getController("User").countWhere({User_Email:User_Email})
    if(count.status!=1)
    {
        logger.error("UserHandler: " + count.error);
        return {status: -1, data: count.error};
    }
    if (count.data > 0) {
        logger.info("UserHandler: email match");
        let user =await ControllerFactory.getController("User").getUserBy({User_Email:User_Email})
        if(user.status==1)
        {
            //Compare hashed passwords
            if(bcrypt.compareSync(User_password, user.data.User_password) == false){
            return {status: 0, data: 'Las contraseñas no coinciden'};
            }
            logger.info("UserHandler: succesfull call to getUserByEmail")
            return {status: 1, data: user.data};
        }else if(status==-1)
        {    logger.error("UserHandler: error from getUserBeEmail"+ error)
            return {status: -2, data: user.error};
        }
    }
        logger.info("UserHandler: User is not valid");
        return {status: 0, data: false};  ;
}

module.exports = { createUser: createUser, validateUser: validateUser };