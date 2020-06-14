
// Import Assert
var assert = require("assert");
var httpMocks  = require('node-mocks-http');

// Import file system
var fs = require('fs');

// Import sync database
var syncDB = require("../../DataBase/syncDB.js");

// Import api.js for test
var api = require("../../routes/api");

// Import Business Logic Factory
const businessLogicFactory = require('../../BusinessLogic/BusinessLogicFactory');

// Import Controller Factory
const controllerFactory = require('../../Controllers/ControllerFactory');

// User test
// Driver {nombre: TestDriverName, Apellido: TestDriverLastName, Cedula: 123456, Telefono: 567890, E-Mail: testdrivername@hotmail.com, Direccion: TestDriverDirection, Contraseña: 123456, Foto: "123456"}
// Car {Marca: TestBrand, Modelo: TestModel, Placa: TestPlate, Capadidad: 5, Foto: "/uploads/vehicles/123456.png"}
// Client {nombre: TestClientName, Apellido: TestClientLastName, E-Mail: testclientname@hotmail.com, Direccion: TestClientDirection, Contraseña: 123456}

// Test images
let userPhoto = fs.readFileSync(__dirname + '/userPhotoTest.png', 'base64');
let carPhoto = fs.readFileSync(__dirname + '/carPhotoTest.png', 'base64');

// Test data
let lastResult = undefined;

// Check Status Request in functions
async function checkStatusRequest (status, fun, params){

  // Simulate Request and Response
  var req = httpMocks.createRequest(params);
  var res = httpMocks.createResponse();

  // Make equal test
  lastResult = (await fun(req, res));
  assert.equal(lastResult.statusCode, status);

}

// Log client test
describe("Log client test:", async function(){
  
  // Bad request structure checks
  describe("Bad request in structure checks: ", async function() {
    it('If client log request doesn\'t have "error" key',   () => checkStatusRequest(400, api.logClientErrors, {method: 'POST', body: {}}))
    it('If client log request doesn\'t have "message" key', () => checkStatusRequest(400, api.logClientErrors, {method: 'POST', body: {error: {stack: "Stack message"}}}));
    it('If client log request doesn\'t have "stack" key',   () => checkStatusRequest(400, api.logClientErrors, {method: 'POST', body: {error: {message: "Test message"}}}));
  });

  // Good work
  describe("Ok in good work: ", async function() {
    it('If client log works', () => checkStatusRequest(200, api.logClientErrors, {method: 'POST', body: {error: {message: "Test message", stack: "Stack message"}}}));
  });

});

// Login test
describe("Login test:", async function() {

  // Before actions
  before(async function() {
    // DataBase connection
    await syncDB(); 
    // Insert client user test if doesn't exist
    await businessLogicFactory.getBusinessLogic("User").createUser({body:{request:{User_name: "TestClientName", User_last_name: "TestClientLastName", User_password: "123456", User_address: "TestClientDirection", User_Email: "testclientname@hotmail.com"}}}); 
     // Insert driver user test if doesn't exist
    await businessLogicFactory.getBusinessLogic("Driver").createDriver({body:{request:{Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Driver_password: "123456", Driver_address: "TestDriverDirection", Driver_Email: "testdrivername@hotmail.com", Driver_phone: 567890, Identity_card: 123456, Driver_photo: "/uploads/drivers/123456.png"}}});
  });

  // Bad request structure checks
  describe("Bad request in structure checks: ", async function() {
    it('If login doesn\'t have "type_of_user" key',         () => checkStatusRequest(400, api.login, {method: 'POST', body: {}}));
    it('If client login doesn\'t have "request" key',       () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "client"}, body: {}}));
    it('If client login doesn\'t have "User_Email" key',    () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "client"}, body: {request: {User_password: "123456"}}}));
    it('If client login doesn\'t have "User_password" key', () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "client"}, body: {request: {User_Email: "testclientname@hotmail.com"}}}));
    it('If driver login doesn\'t have "request" key',       () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "driver"}, body: {}}));
    it('If driver login doesn\'t have "User_Email" key',    () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "driver"}, body: {request: {User_password: "123456"}}}));
    it('If driver login doesn\'t have "User_password" key', () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "driver"}, body: {request: {User_Email: "testclientname@hotmail.com"}}}));  
  });

  // Data type checks
  describe("Bad request in data type checks: ", async function() {
    it('If login doesn\'t have String data type in "type_of_user" key',         () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: 345545}, body: {request: {User_Email: "testclientname@hotmail.com", User_password: "123456"}}}));  
    it('If client login doesn\'t have String data type in "User_Email" key',    () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "client"}, body: {request: {User_Email: 345432345, User_password: "123456"}}}));  
    it('If client login doesn\'t have String data type in "User_password" key', () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "client"}, body: {request: {User_Email: "testclientname@hotmail.com", User_password: 123456}}}));  
    it('If driver login doesn\'t have String data type in "User_Email" key',    () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "driver"}, body: {request: {User_Email: 345432345, User_password: "123456"}}}));  
    it('If driver login doesn\'t have String data type in "User_password" key', () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "driver"}, body: {request: {User_Email: "testclientname@hotmail.com", User_password: 123456}}}));  
  });

   // Data format checks
   describe("Bad request in data format checks: ", async function() {
    it('If login doesn\'t have "client" or "driver" values in "type_of_user" key',  () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "asdas"}, body: {request: {User_Email: " ", User_password: "123456"}}}));
    it('If client login have empty "User_Email" key',                               () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "client"}, body: {request: {User_Email: " ", User_password: "123456"}}}));
    it('If client login have empty "User_password" key',                            () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "client"}, body: {request: {User_Email: "testclientname@hotmail.com", User_password: " "}}}));
    it('If client login doesn\'t have correct e-mail format in "User_Email" key',   () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "client"}, body: {request: {User_Email: "234ewrw3", User_password: "123456"}}}));
    it('If driver login have empty "User_Email" key',                               () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "driver"}, body: {request: {User_Email: " ", User_password: "123456"}}}));
    it('If driver login have empty "User_password" key',                            () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "driver"}, body: {request: {User_Email: "testclientname@hotmail.com", User_password: " "}}}));
    it('If driver login doesn\'t have correct e-mail format in "User_Email" key',   () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "driver"}, body: {request: {User_Email: "234ewrw3", User_password: "123456"}}}));
  });

  // Good work
  describe("OK in good work checks: ", async function() {
    it('If client login works', () => checkStatusRequest(200, api.login, {method: 'POST', params: {type_of_user: "client"}, body: {request: {User_Email: "testclientname@hotmail.com", User_password: "123456"}}}));
    it('If driver login works', () => checkStatusRequest(200, api.login, {method: 'POST', params: {type_of_user: "driver"}, body: {request: {User_Email: "testdrivername@hotmail.com", User_password: "123456"}}}));
  });

});

// Driver signup test
describe("Driver signup test:", async function() {

  // Before actions
  before(async function() {
    // DataBase connection
    await syncDB();  
    // Delete test driver if exist
    await controllerFactory.getController("Driver").deleteByIdentityCard(123456);
  });

  // Bad request structure checks
  describe("Bad request in structure checks: ", async function() {
    it('If driver signup doesn\'t have "request" key',          () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {}}));
    it('If driver signup doesn\'t have "Driver_name" key',      () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have "Driver_last_name" key', () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Identity_card: "123456", Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have "Identity_card" key',    () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have "Driver_phone" key',     () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have "Driver_Email" key',     () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have "Driver_address" key',   () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have "Driver_password" key',  () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have "Driver_photo" key',     () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have "foto_data" key',        () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456"}}}));
  });

  // Data type checks
  describe("Bad request in data type checks: ", async function() {
    it('If driver signup doesn\'t have String data type in "Driver_name" key',      () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: 123456, Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have String data type in "Driver_last_name" key', () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: 123456, Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have Number data type in "Identity_card" key',    () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: "123456", Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have String data type in "Driver_phone" key',     () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: "567890", Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have String data type in "Driver_Email" key',     () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: 123456, Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have String data type in "Driver_address" key',   () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: 123456, Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have String data type in "Driver_password" key',  () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: 123456, Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have String data type in "Driver_photo" key',     () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: 123456, foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have String data type in "foto_data" key',        () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: 12323423}}}));
  });

  // Data format checks
  describe("Bad request in data format checks: ", async function() {
    it('If driver signup have digits in "Driver_name" key',                           () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "Test5Driver5Name", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have special characters in "Driver_name" key',               () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "Test_Driver_Name", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have empty "Driver_name" key',                               () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: " ", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have digits in "Driver_last_name" key',                      () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "Test5Driver5Last5Name", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have special characters in "Driver_last_name" key',          () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "Test_Driver_Last_Name", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have empty "Driver_last_name" key',                          () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: " ", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have numbers <= 0 in "Identity_card" key',                   () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: -123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have decimal number in "Identity_card" key',                 () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456.234, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have numbers <= 0 in "Driver_phone" key',                    () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: -567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have decimal number in "Driver_phone" key',                  () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 12345, Driver_phone: 567890.345, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have correct e-mail format in "Driver_Email" key',  () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 12345, Driver_phone: 567890, Driver_Email: "sdfsdfsdf", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have empty "Driver_Email" key',                              () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 12345, Driver_phone: 567890, Driver_Email: " ", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have empty "Driver_address" key',                            () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 12345, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: " ", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have empty "Driver_password" key',                           () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 12345, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: " ", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have empty "Driver_photo" key',                              () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 12345, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: " ", foto_data: userPhoto}}}));
    it('If driver signup have empty "foto_data" key',                                 () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 12345, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: " "}}}));

  });

  // Good work
  describe("OK in good work checks: ", async function() {
    
    // Before actions
    beforeEach(async function() {
      // Delete test driver if exist
      await controllerFactory.getController("Driver").deleteByIdentityCard(123456);
    });
    
    it('Should return Created if driver signup works', () => checkStatusRequest(201, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('Should return Created if driver signup works with blanks in name and last name', () => checkStatusRequest(201, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "Test Driver Name", Driver_last_name: "Test Driver Last Name", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));

  });

});

// Vehicle signup test
describe("Vehicle signup test:", async function() {
  
  // Driver id
  var db_driver_id = undefined;

  // Before actions
  before(async function() {
    // DataBase connection
    await syncDB();  
    // Get regiter test driver
    db_driver_id = (await lastResult)._getJSONData().db_driver_id;
    // Delete test vehicle if exist
    await controllerFactory.getController("Vehicle").deleteByPlate("TestPlate");
  });

  // Bad request structure checks
  describe("Bad request in structure checks: ", async function() {
    it('If vehicle signup doesn\'t have "request" key',           () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {}}));
    it('If vehicle signup doesn\'t have "Identity_card" key',     () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Plate: "TestPlate", db_driver_id: db_driver_id, Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have "Plate" key',             () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have "Brand" key',             () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have "Model" key',             () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have "Payload_capacity" key',  () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have "Photo" key',             () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have "foto_data" key',         () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", Is_owner: true}}}));
    it('If vehicle signup doesn\'t have "Is_owner" key',          () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto}}}));
  });

  // Data type checks
  describe("Bad request in data type checks: ", async function() {
    it('If vehicle signup doesn\'t have Number data type in "Identity_card" key',     () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: "123456", db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have String data type in "Plate" key',             () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: 123456, Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have String data type in "Brand" key',             () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: 123456, Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have String data type in "Model" key',             () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: 123456, Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have Number data type in "Payload_capacity" key',  () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: "5", Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have String data type in "Photo" key',             () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: 123456, foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have String data type in "foto_data" key',         () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: 123456, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have Boolean data type in "Is_owner" key',         () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: "sdfsd"}}}));
  });

  // Data format checks
  describe("Bad request in data format checks: ", async function() {
    it('If vehicle signup have numbers <= 0 in "Identity_card" key',    () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: -123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup have decimal number in "Identity_card" key',  () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456.234, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup have empty "Plate" key',                      () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: " ", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup have empty "Brand" key',                      () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: " ", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup have empty "Model" key',                      () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: " ", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup have number <= 0 in "Payload_capacity" key',  () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: -5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup have empty "Photo" key',                      () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: " ", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup have empty "foto_data" key',                  () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: " ", Is_owner: true}}}));
  });

  // Good work
  describe("OK in good work checks: ", async function() {
    
    // Before actions
    beforeEach(async function() {
      // Delete test vehicle if exist
      await controllerFactory.getController("Vehicle").deleteByPlate("TestPlate");
    });
    
    it('Should return Created if driver vehicle works',  () => checkStatusRequest(201, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));

  });

});