
//Function used to check the request fields (valid emails, valid field lengths and valid text fields)
var validator = require('validator');

// Import logger
const logger = require('../../utils/logger/logger');

// Check fields
async function check_fields(req){
    data = req.body.request
    for (const key of Object.keys(data)) {
      var field = data[key]
      var fieldName = ""
      if(key == 'User_name' || key == 'Driver_name') {
        if (typeof field != "string" || !validator.isAlpha(validator.blacklist(field, ' '))) {
          return "El Nombre no es válido"
        } else {
          fieldName = "Nombre"
        }
      }
      if(key == 'User_last_name' || key == 'Driver_last_name') {
        if (typeof field != "string" || !validator.isAlpha(validator.blacklist(field, ' '))) {
          return "El Apellido no es válido"
        } else {
          fieldName = "Apellido"
        }
      }
      if(key == 'Driver_password' || key == 'User_password') {
        if (typeof field != "string" || validator.blacklist(field, ' ') == "") {
          return "La contraseña no es válida"
        } else {
          fieldName = "Contraseña"
        }
      }
      if(key == 'Driver_address' || key == 'User_address'){
        if (typeof field != "string" || validator.blacklist(field, ' ') == "") {
          return "La dirección no es válida"
        } else {
          fieldName = "Dirección"
        }   
      }
      if(key == 'Identity_card'){
        if (typeof field != "number" || !Number.isInteger(field) || field <= 0) {
          return "La Cédula no es válida"
        } else {
          fieldName = "Cédula"
        }
      }
      if(key == 'Driver_phone'){
        if (typeof field != "number" || !Number.isInteger(field) || field <= 0) {
          return "El Teléfono no es válido"
        } else {
          fieldName = "Teléfono"
        }
      }
      if(key == 'User_Email' || key == 'Driver_Email'){
        if (typeof field != "string" || !validator.isEmail(field)) {
          return "El E-Mail no es válido"
        } else {
          fieldName = "E-Mail"
        }
      }
      if(key == 'Driver_photo'){
        if (typeof field != "string" || validator.blacklist(field, ' ') == "") {
          return "El nombre de la Foto no es válido"
        } else {
          fieldName = "Nombre de la Foto"
        }   
      }
      if(key == 'foto_data'){
        if (typeof field != "string" || validator.blacklist(field, ' ') == "") {
          return "La Foto no es válida"
        } else {
          fieldName = "Foto"
        }   
      }
      if(key == 'Is_owner'){
        if (typeof field != "boolean") {
          return "El valor de si es dueño no es válido"
        } else {
          fieldName = "valor de si es dueño"
        }   
      }
      if(key == 'Photo'){
        if (typeof field != "string" || validator.blacklist(field, ' ') == "") {
          return "El nombre de la Foto no es válido"
        } else {
          fieldName = "Nombre de la Foto"
        }   
      }
      if(key == 'Plate'){
        if (typeof field != "string" || validator.blacklist(field, ' ') == "") {
          return "La Placa no es válida"
        } else {
          fieldName = "Placa"
        }   
      }
      if(key == 'Brand'){
        if (typeof field != "string" || validator.blacklist(field, ' ') == "") {
          return "La Marca no es válida"
        } else {
          fieldName = "Marca"
        }   
      }
      if(key == 'Model'){
        if (typeof field != "string" || validator.blacklist(field, ' ') == "") {
          return "El Modelo no es válido"
        } else {
          fieldName = "Modelo"
        }   
      }
      if((key == 'Payload_capacity')){
        if (typeof field != "number" || !Number.isInteger(field) || field <= 0) {
          return "La capacidad de carga no es válida"
        } else {
          fieldName = "La capacidad de carga"
        }
      }
      if((key == 'db_driver_id')){
        if (typeof field != "number" || !Number.isInteger(field) || field <= 0) {
          return "El ID del conductor no es válido"
        } else {
          fieldName = "ID del conductor"
        }
      }
      if((key=="Origin_coord")){
  
      }
      if((key=="Destination_coord")){
  
      }
      if((key == 'Weight') && !validator.isNumeric(field)){
        fieldName = "Peso"
        return "El Peso no es válido"
      }
      if((key=="Description")){
        fieldName = "Descripcion"
      }
      if((key=="Date")){
        fieldName = "Date"
      }
      if((key=="Id_user") && !validator.isNumeric(field)){
        fieldName = "Id_user"
        return "El id de usuario no es válido"
      }
      //length validation
      if(field.length == 0 && key!="Comments"){
        return "El campo '" + fieldName + "' no puede estar vacio"
      }
    }
    return true;
  }
  module.exports = {
    check_fields : check_fields
  };