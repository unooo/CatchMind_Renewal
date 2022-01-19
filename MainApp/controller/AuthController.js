const wrap = require('../lib/wrap');
let userService = require('../service/UserService');

exports.logIn = function (request, response, next) {
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    response.render('login', { ip });
};

exports.logOut = function (request, response, next) {
    request.logout();
    request.session.destroy(function (err) {
        response.redirect('/');
    });
};

exports.logIn_process = function (req, res, next, passport) {
    passport.authenticate('local', function (err, userInfo, info) {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (!userInfo) {
            console.log('loginError', info.message);
            return res.redirect('/auth/login?ret=' + info.message);
        }
        return req.logIn(userInfo, function (err) { //여기서 userlove 는  serializeuser의 userlove로 넘겨준다
            console.log('start log in');
            if (err) { console.log(err); return next(err); }
            return res.redirect('/');
        });
    })(req, res, next);
};

exports.get_register = function (request, response) {
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    response.render('register', { ip });
};
exports.post_register = wrap(async function (request, response) {
    var post = request.body;
    var id = post.id;
    var pwd = post.pwd;
    var pwd_confirm = post.pwd2;
    var displayName = post.displayName;
    let ret = await userService.createUser(id,pwd,pwd_confirm,displayName);
    if(ret.status){
        request.login(ret.user, function (err) {
            response.redirect('/');    
        });        
    }else{
        response.redirect('/auth/register?ret='+ret.message);
    }
})
