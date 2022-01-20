const wrap = require('../lib/wrap');
const bcrypt = require('bcrypt');
const saltRounds = 10; //일종의 노이즈
let UserRepository = require('../repository/user');
let IdDuplicateError = require('../exception/IdDuplicateError');
let PwConfirmDiffError = require('../exception/PwConfirmDiffError');
exports.createUser = async function ({id, pwd, pwd_confirm, displayName}) {
    let checkDuplicateId = await UserRepository.findOne({ id });
    if (checkDuplicateId) {
        throw new IdDuplicateError("ID_duplicated");
    }
    if (pwd !== pwd_confirm) {
        throw new PwConfirmDiffError("password_must_same");       
    }
    return await new Promise((resolve, reject) => {
        bcrypt.hash(pwd, saltRounds, async function (err, hash) {
            try {
                let user = await UserRepository.create({
                    id,
                    password: hash,
                    name: displayName,
                });
                resolve({
                    status: true,
                    user,
                })
            } catch (error) {
                reject(error);
            }
        });
    })

} ;