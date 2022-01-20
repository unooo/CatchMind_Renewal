let CreateUserError = require('./CreateUserError');
module.exports=class extends CreateUserError{
    constructor(message) {
        super(message);
    }
}