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