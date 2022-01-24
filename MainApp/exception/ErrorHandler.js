
let UserError = require('./UserError');
let RoomError = require('./RoomError');
let AuthenticateError = require('./AuthenticateError');
module.exports= async function (error , req , res  , next )  {  
    console.error(error.stack);    
    if(error instanceof UserError){
        //res.redirect('/auth/register?ret='+err.name+":"+err.message);        
        res.status(500).send({
            status:false,
            error:{
                name:error.name,
                message:error.message
            },
        });
    }else if(error instanceof RoomError){
        res.status(500).send({
            status:false,
            error:{
                name:error.name,
                message:error.message
            },
        });
    }else{
        res.status(500).send('Something broke!');
    }
    
  }