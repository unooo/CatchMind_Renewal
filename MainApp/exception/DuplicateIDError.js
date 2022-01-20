let CreateUserError = require('./UserError');
module.exports=class extends CreateUserError{
    constructor(message) {
        super(message);
    }
}