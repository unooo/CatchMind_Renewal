let UserError = require('./UserError');
module.exports=class extends UserError{
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
      }
}