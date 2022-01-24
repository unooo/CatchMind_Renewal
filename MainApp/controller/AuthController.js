const wrap = require('../lib/wrap');
let userService = require('../service/UserService');
let UserDTO_Create = require('../dto/UserDTO_Create');
let CreateUserError = require('../exception/UserError');
let LoginError = require('../exception/LoginError');

exports.get_register =wrap(async function (request, response) {
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    response.render('register', {ip});
});

exports.post_register = wrap(async function (request, response) {
    let post = request.body;
    let userDto = new UserDTO_Create(post.id,post.pwd,post.pwd2,post.displayName);    
    let ret = await userService.createUser(userDto);
    if(ret.status){
        request.login(ret.user, function (err) {
            response.redirect('/');    
        });        
    }else{
       throw new CreateUserError();
    }
})

exports.logIn = wrap(async function (request, response, next) {
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    response.status(200).render('login', { ip });
});

exports.logIn_process = wrap(async function (req, res, next, passport) {
    passport.authenticate('local', function (err, userInfo, info) {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (!userInfo) {
            console.log('loginError', info.message);
            return next(new LoginError(info.message));// return 아닌 throw시 오작동
        }
        return req.logIn(userInfo, function (err) { //여기서 userlove 는  serializeuser의 userlove로 넘겨준다
            console.log('start log in');
            if (err) { console.log(err); return next(err); }
            return res.redirect('/');
        });
    })(req, res, next);
});

exports.logOut = wrap(async function (request, response, next) {
    request.logout();
    request.session.destroy(function (err) {
        response.status(200).redirect('/');
    });
});

