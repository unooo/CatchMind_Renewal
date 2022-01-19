const bcrypt = require('bcrypt');
const saltRounds = 10; //일종의 노이즈
let User = require('../repository/user');
exports.createUser = async function (id, pwd, pwd_confirm, displayName) {
    let checkDuplicateId = await User.findOne({ id });
    console.log('checkDuplicateId ', checkDuplicateId)
    if (checkDuplicateId) {
        return {
            status: false,
            message: "ID_duplicated"
        };
    }

    if (pwd !== pwd_confirm) {
        return {
            status: false,
            message: "password_must_same"
        };
    }
    return await new Promise((resolve, reject) => {
        bcrypt.hash(pwd, saltRounds, async function (err, hash) {
            try {
                let user = await User.create({
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

};