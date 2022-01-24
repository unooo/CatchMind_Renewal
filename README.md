# WebRTC 시리즈 4. CatchMind_Renewal
기존 CatchMind 프로젝트를 직접만든 WebRTC_Mesh를 이용해 리뉴얼 및 서버 구조 고도화

###  WebRTC 시리즈 1.
+ CatchMind : https://github.com/unooo/CatchMind
###  WebRTC 시리즈 2. 
+ p2p SFU 서버 구현 :  https://github.com/unooo/WebRTC_Mesh
###  WebRTC 시리즈 3. 
+ CatchMind_Renewal :  https://github.com/unooo/CatchMind_SFU

## 프로젝트 목적 - 백엔드 구조 고도화


### 1. Repository, Service, Controller Layer 계층 구조 분리
+ CatchMind_Renewal/MainApp/Controller
+ CatchMind_Renewal/MainApp/Service
+ CatchMind_Renewal/MainApp/Repository
### 2. Error/Exception/Exception Handler구현을 통한 예외처리
+ CatchMind_Renewal/MainApp/exception/
 
CatchMind_Renewal/MainApp/server.js
```
//ExpressJS의 전역 핸들러
let errorHandler = require('./exception/ErrorHandler');
app.use(errorHandler);
```
CatchMind_Renewal/MainApp/exception/ErrorHandler.js 
```
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
```

### 3. Transaction 기능 추가
and
### 4. ExpressJS의 전역 Error Handler 사용을 위한 Async 함수의 Wrapper 함수 구현 - 데코레이터 패턴 적용 
#### 적용 이유:
https://changjoopark.medium.com/express-%EB%9D%BC%EC%9A%B0%ED%8A%B8%EC%97%90%EC%84%9C-async-await%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EB%A0%A4%EB%A9%B4-7e8ffe0fcc84

CatchMind_Renewal/MainApp/lib/wrap.js /
```
const { startSession } = require('mongoose');
module.exports = (asyncFn) => { //데코레이터 패턴 적용
  return (async (req, res, next, ...args) => {
    let dbSession;
    try {
      dbSession = await startSession();
      dbSession.startTransaction();
      let ret = await asyncFn(req, res, next, ...args);
      await dbSession.commitTransaction();
      dbSession.endSession();
      return ret;
    } catch (error) {
      await dbSession.abortTransaction();
      dbSession.endSession();
      return next(error)
    }
  })
}
```
Controller 함수를 Wrap - example)
```
const wrap = require('../lib/wrap');
exports.post_register = wrap(async function (request, response) {
  ...
}
```
### 5. Jest, Supertest를 이용한 유닛, 통합테스트 구현
CatchMind_Renewal/MainApp/test/

## 실행화면
![image](https://user-images.githubusercontent.com/30948477/150801810-8c89e8b9-a25a-4d62-a877-a2f9ad390de8.png)

