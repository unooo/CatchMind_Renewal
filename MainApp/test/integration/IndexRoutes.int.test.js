const request = require('supertest');
const app = require('../../server');
let UserRepository = require('../../repository/user');
it("Get / ", async () => {

    //given
    await request(app).post("/auth/register_process")
        .send({ id: "testId10", pwd: "pwd1111", pwd2: "pwd1111", displayName: "윤현우" });
    let res = await request(app)
        .post("/auth/login_process")
        .send({ id: "testId10", pwd: "pwd1111" });
    let cookie = res.headers['set-cookie'];
    //when    
    //로그인 유지를 위한 세션쿠키 세팅
    const response = await request(app).get("/").set('Cookie', [cookie]);
    expect(response.statusCode).toBe(200);

    //then
    await UserRepository.deleteOne({ id: 'testId10' });
});

it("Get / without login ", async () => {

    const response = await request(app).get("/");
    let retJson=JSON.parse(response.text);
    expect(response.statusCode).toBe(500);
    expect(retJson.status).toBe(false);
    expect(retJson.error.message).toBe('please login');

    //then
    await UserRepository.deleteOne({ id: 'testId10' });
})