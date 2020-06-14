//import logger
const logger = require('../../utils/logger/logger');
//import classes that implement observer pattern
const Observer = require("./Notifications/Observer").Observer;
const Subject = require("./Notifications/Subject").Subject;
//import types of notification ids
const constants = require("../../constants").notif_description
//import controller factory
const getController = require('../../Controllers/ControllerFactory').getController;

async function createDriversNoficiations(drivers,Id_haulage)
{
    try {
        const subject = new Subject()
        subject.notifications.add(constants.NEW_HAULAGE_ASSIGNED)
        for (const driver of drivers) {
            //console.log(driver)

            let Id_driver = driver.Id_driver
            let observer = new Observer(Id_driver,"Driver")
            await subject.registerObserver(observer,Id_haulage)
        }
        return {status:1} 
    } catch (error) {
        logger.error("NotificationHandler:"+ error)
        return {status:-1}
        
    }
    
}

async function createUserNoficiations(Id_haulage)
{
    const subject = new Subject()
    subject.notifications.add(constants.HAULAGE_DONE)
    let user_info = await getController("Haulage").getRegisterByPk(Id_haulage)
    if(user_info.status==-1)
    {
        logger.error("NotificationHandler:createUserNotifications: "+user_info.error)
        return {user_info}
    }
    let Id_user = user_info.data.Id_user
    let observer = new Observer(Id_user,"User")
    try {
        await subject.registerObserver(observer, Id_haulage)
        return {status:1}    
    } catch (error) {
        return {status:-1, error: error}   
    }
    
    
}

async function getNotifications(Id,type)
{
  
    const subject = new Subject()
    let notifications = await subject.notifyObserver(new Observer(Id,type))
    if(notifications.status==-1)
    {
        logger.error("NotificationHandler: "+ notifications.error)
        return {status: -1, error:"Hubo un error recuperando sus notificaciones"}
    } else if(notifications.status==0)
    {
        return {status:0,data:"No tiene nuevas notificaciones"}
    }

    return {status:notifications.status,data:notifications.data}
        
    
}

async function removeNotification(type_notif, type_of_user,Id,Id_haulage)
{
    
        const subject = new Subject()
        let result = await subject.removeObserver(new Observer(Id,type_of_user),Id_haulage,type_notif)
        if(result.status!=-1)
            return {status:result.status,data:""}
        else
        {
            logger.error("NotificationHandler: "+ result.error)
            return {status:-1,error: result.error}
        }
        
}
    




module.exports =
{
    createDriversNoficiations: createDriversNoficiations,
    getNotifications: getNotifications,
    removeNotification: removeNotification,
    createUserNoficiations: createUserNoficiations
}
    
