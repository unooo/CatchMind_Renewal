
let CreateUserError = require('./UserError');
module.exports=function (err , req , res  , next )  {
    console.error(err.stack);
    if(err instanceof CreateUserError  ){
        response.redirect('/auth/register?ret='+err.name+":"+err.message);        
    }    
    res.status(500).send('Something broke!')
  }