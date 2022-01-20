let RoomRepository = require('../../repository/Room');
let RoomService = require('../../service/RoomService');
let RoomDTO_Create = require('../../dto/RoomDTO_Create');
let NotExistRoomIDError = require('../../exception/NotExistRoomIDError');
RoomRepository.create=jest.fn();
RoomRepository.find=jest.fn();
RoomRepository.findOne=jest.fn();
RoomRepository.findByIdAndDelete=jest.fn();
RoomRepository.findByIdAndUpdate=jest.fn();

let roomDTO_Create1,roomDTO_Create2,roomDTO_Create3;

beforeAll(()=>{
    roomDTO_Create1=new RoomDTO_Create("1번방","owner_1","owner_id_1");
    roomDTO_Create2=new RoomDTO_Create("2번방","owner_2","owner_id_2");
    roomDTO_Create3=new RoomDTO_Create("3번방","owner_3","owner_id_3");
})

describe("RoomService Create", () => {

    it("should call RoomRepository.create func",async()=>{
        await RoomService.createRoom(roomDTO_Create1);
        expect(RoomRepository.create).toBeCalledWith(roomDTO_Create1);
        expect(RoomRepository.create).not.toBeCalledWith(roomDTO_Create2);
    });

    it("should call RoomService.createChat return same RoomRepository.create return ",async()=>{
        RoomRepository.create.mockImplementation(obj=>obj);
        expect(RoomService.createRoom(roomDTO_Create1)).resolves.toEqual(roomDTO_Create1);
        expect(RoomService.createRoom(roomDTO_Create1)).resolves.not.toEqual(roomDTO_Create2);
    });

});

describe("RoomService readRoomList", () => {

    it("should call RoomRepository.find func",async()=>{
        await RoomService.readRoomList();
        expect(RoomRepository.find).toBeCalledTimes(1);       
    });

    it("should call RoomService.readRoomList return same RoomRepository.find return ",async()=>{
        RoomRepository.find.mockResolvedValue(roomDTO_Create1);
        expect(RoomService.readRoomList()).resolves.toEqual(roomDTO_Create1);
        expect(RoomService.readRoomList()).resolves.not.toEqual(roomDTO_Create2);
    });

});

describe("RoomService readRoom", () => {

    it("should call RoomRepository.findOne func",async()=>{
        await RoomService.readRoom("1번방");
        expect(RoomRepository.findOne).toBeCalledTimes(1);       
        expect(RoomRepository.findOne).toBeCalledWith({_id:"1번방"});    
        expect(RoomRepository.findOne).not.toBeCalledWith("2번방");    
    });

    it("should call RoomService.readRoom return same RoomRepository.findOne return ",async()=>{
        RoomRepository.findOne.mockResolvedValue(roomDTO_Create1);
        expect(RoomService.readRoomList("1번방")).resolves.toEqual(roomDTO_Create1);
        expect(RoomService.readRoomList("1번방")).resolves.not.toEqual(roomDTO_Create2);
    });

});

describe("RoomService deleteRoom", () => {

    it("should call RoomRepository.findByIdAndDelete func",async()=>{
        RoomRepository.findByIdAndDelete.mockResolvedValue({});
        await RoomService.deleteRoom("1번방");
        expect(RoomRepository.findByIdAndDelete).toBeCalledTimes(1);       
        expect(RoomRepository.findByIdAndDelete).toBeCalledWith("1번방");    
        expect(RoomRepository.findByIdAndDelete).not.toBeCalledWith("2번방");    
    });
    it("should call RoomService.deleteRoom return true when success ",async()=>{
        RoomRepository.findByIdAndDelete.mockResolvedValue({});
        expect(RoomService.deleteRoom("1번방")).resolves.toBeTruthy();        
    });
    it("should call RoomService.deleteRoom return false when fail ",async()=>{
        RoomRepository.findByIdAndDelete.mockResolvedValue(false);
        expect(RoomService.deleteRoom("1번방")).rejects.toThrow(NotExistRoomIDError);        
    });

});

describe("RoomService changeRoomAttendantsByRoomId", () => {

    it("should call RoomRepository.findOne func",async()=>{
        RoomRepository.findOne.mockResolvedValue({});
        await RoomService.changeRoomAttendantsByRoomId(0,"1번방");      
        expect(RoomRepository.findOne).toBeCalledWith({_id:"1번방"});    
        expect(RoomRepository.findOne).not.toBeCalledWith("2번방");    
    });

    it("should call RoomService.changeRoomAttendantsByRoomId return false when fail ",async()=>{
        RoomRepository.findOne.mockResolvedValue(false);
        expect(RoomService.changeRoomAttendantsByRoomId(0,"1번방")).rejects.toThrow(NotExistRoomIDError);        
    });

    it("mode test",async()=>{
        RoomRepository.findOne.mockResolvedValue({attendants_num:0});
        await RoomService.changeRoomAttendantsByRoomId(0,"1번방");      
        expect(RoomRepository.findByIdAndUpdate).toBeCalledWith("1번방",{attendants_num:1});            
        RoomRepository.findOne.mockResolvedValue({attendants_num:0});
         await RoomService.changeRoomAttendantsByRoomId(1,"1번방");      
         expect(RoomRepository.findByIdAndUpdate).toBeCalledWith("1번방",{attendants_num:-1});    
    })
});

it("function call test", async()=>{
    RoomRepository.findOne.mockResolvedValue({});
    expect( RoomService.changeRoomAttendantsByRoomId(0,"1번방")).toBeTruthy();     
})


afterAll(() => {
    jest.resetModules();
});