const request = require('supertest');
const app = require('../../server');
let UserRepository = require('../../repository/user');
it("GET /auth/register", async () => {
    const response = await request(app)
        .get("/auth/register");
    expect(response.statusCode).toBe(200);
});

it("POST /auth/register_process", async () => {
    const response = await request(app)
        .post("/auth/register_process")
        .send({ id: "testId1", pwd: "pwd1111", pwd2: "pwd1111", displayName: "윤현우" })
        .expect('Location', /\//);
    expect(response.statusCode).toBe(302);    
    await UserRepository.deleteOne({ id: 'testId1' });
});

it("POST /auth/register_process Duplicate ID Exception", async () => {
    await request(app)
        .post("/auth/register_process")
        .send({ id: "testId2", pwd: "pwd1111", pwd2: "pwd1111", displayName: "윤현우" });
    const response = await request(app)
        .post("/auth/register_process")
        .send({ id: "testId2", pwd: "pwd1111", pwd2: "pwd1111", displayName: "윤현우" })
        .expect(500);
        expect(response.body.status).toEqual(false);  
        await UserRepository.deleteOne({ id: 'testId2' });  
});

it("POST /auth/register_process Confirm pwd Exception", async () => {
    const response = await request(app)
        .post("/auth/register_process")
        .send({ id: "testId3", pwd: "pwd1111", pwd2: "2", displayName: "윤현우" })
        .expect(500);
        expect(response.body.status).toEqual(false);  
        await UserRepository.deleteOne({ id: 'testId3' });  
});

it("GET /auth/login", async () => {
    const response = await request(app)
        .get("/auth/login");
    expect(response.statusCode).toBe(200);
});

it("POST /auth/login_process", async () => {
    await request(app)
    .post("/auth/register_process")
    .send({ id: "testId4", pwd: "pwd1111", pwd2: "pwd1111", displayName: "윤현우" });

    const response = await request(app)
        .post("/auth/login_process")
        .send({ id: "testId4", pwd: "pwd1111" })
        .expect('Location', /\//);
    expect(response.statusCode).toBe(302);

    await UserRepository.deleteOne({ id: 'testId4' });  
});

it("POST /auth/login_process confirm id error", async () => {
    await request(app)
        .post("/auth/register_process")
        .send({ id: "testId6", pwd: "pwd1111", pwd2: "pwd1111", displayName: "윤현우" });

    const response = await request(app)
        .post("/auth/login_process")
        .send({ id: "strangeID", pwd: "pwd1111" })
     .expect(500);
    //expect(response.body.status).toEqual(false);
    await UserRepository.deleteOne({ id: 'testId6' });

});

it("POST /auth/login_process confirm pwd error", async () => {
    await request(app)
    .post("/auth/register_process")
    .send({ id: "testId7", pwd: "pwd1111", pwd2: "pwd1111", displayName: "윤현우" });

    const response = await request(app)
        .post("/auth/login_process")
        .send({ id: "testId7", pwd: "strange pwd" })
        .expect(500);
    expect(response.body.status).toEqual(false);     

    await UserRepository.deleteOne({ id: 'testId7' });  
});

it("GET /auth/logOut", async () => {
    await request(app)
        .post("/auth/register_process")
        .send({ id: "testId8", pwd: "pwd1111", pwd2: "pwd1111", displayName: "윤현우" });
    await request(app)
        .post("/auth/login_process")
        .send({ id: "testId8", pwd: "pwd1111" });

    const response = await request(app)
        .get("/auth/logOut")
        .expect('Location', /\//);
    expect(response.statusCode).toBe(302);
    await UserRepository.deleteOne({ id: 'testId8' });  
})