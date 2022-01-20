let UserRepository = require('../../repository/user');
let UserService = require('../../service/UserService');
let UserDTO_Create = require('../../dto/UserDTO_Create');
let IdDuplicateError = require('../../exception/IdDuplicateError');
let PwConfirmDiffError = require('../../exception/PwConfirmDiffError');
const bcrypt = require('bcrypt');
const saltRounds = 10; //일종의 노이즈
let userDTO_Create;
UserRepository.create = jest.fn();
UserRepository.findOne = jest.fn();
let hash, userObj;
describe("UserService Create", () => {
    beforeEach(() => {
        userDTO_Create = new UserDTO_Create("bunge24", 1234, 1234, "윤현우");
        userObj = {
            id: userDTO_Create.id,
            password: hash,
            name: userDTO_Create.displayName
        };
        bcrypt.hash(userDTO_Create.pwd, saltRounds, async function (err, hashRet) {
            hash = hashRet;
        });
    });

    it("should call UserRepository.findOne_success", async () => {
        await UserService.createUser(userDTO_Create);
        expect(UserRepository.findOne).toBeCalledWith({ id: userDTO_Create.id });
    });

    it("should call UserRepository.findOne_fail", async () => {
        await UserService.createUser(userDTO_Create);
        expect(UserRepository.findOne).not.toBeCalledWith({ id: "strange ID" });
    });

    it("should handle id duplicate errors", async () => {
        UserRepository.findOne.mockReturnValue({});
        //expect(async () => { await UserService.createUser(userDTO_Create); }).rejects.toThrow(IdDuplicateError);
        expect(UserService.createUser(userDTO_Create)).rejects.toThrow(IdDuplicateError);
        UserRepository.findOne.mockReturnValue(null);
    });
    it("should handle pw confirm different errors", async () => {
        userDTO_Create.pwd = 1;
        //expect(async () => { await UserService.createUser(userDTO_Create); }).rejects.toThrow(PwConfirmDiffError);
        expect(UserService.createUser(userDTO_Create)).rejects.toThrow(PwConfirmDiffError);
    })

    it("should call UserRepository.create_success", async () => {
        await UserService.createUser(userDTO_Create);
        expect(UserRepository.create).toBeCalledWith(userObj);
    });

    it("should call UserRepository.create_fail", async () => {
        await UserService.createUser(userDTO_Create);
        expect(UserRepository.create).not.toBeCalledWith({});
    });

    it("return test with promise resolve", () => {
        expect(UserService.createUser(userDTO_Create)).resolves.toEqual({
            status: true,
            userObj
        })
    })

})

afterAll(() => {
    jest.resetModules();
});