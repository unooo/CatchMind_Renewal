let ChatRepository = require('../../repository/chat');
let ChatService = require('../../service/ChatService');
let ChatDTO_Create = require('../../dto/ChatDTO_Create');
ChatRepository.create=jest.fn();
ChatRepository.find=jest.fn();
let chatDTO_Create1,chatDTO_Create2,chatDTO_Create3;
describe("ChatService Create", () => {
    beforeEach(() => {
        chatDTO_Create1 = new ChatDTO_Create("roomId-1", "bunge24", "채팅 메세지 보내기 1");
        chatDTO_Create2 = new ChatDTO_Create("roomId-1", "bunge24", "채팅 메세지 보내기 2");        
        chatDTO_Create3 = new ChatDTO_Create("roomId-2", "bunge24", "채팅 메세지 보내기 3");                
    });

    it("should call ChatRepository.create func",async()=>{
        await ChatService.createChat(chatDTO_Create1);
        expect(ChatRepository.create).toBeCalledWith(chatDTO_Create1);
        expect(ChatRepository.create).not.toBeCalledWith(chatDTO_Create2);
    });

    it("should call ChatService.createChat return same chatRepository.create return ",async()=>{
        ChatRepository.create.mockImplementation(obj=>obj);
        expect(ChatService.createChat(chatDTO_Create1)).resolves.toEqual(chatDTO_Create1);
        expect(ChatService.createChat(chatDTO_Create1)).resolves.not.toEqual(chatDTO_Create2);
    });

    it("should call ChatRepository.find func",async()=>{
        await ChatService.readChatByRoomId("roomId-1");
        expect(ChatRepository.find).toBeCalledWith({roomId:"roomId-1"});
        expect(ChatRepository.find).not.toBeCalledWith({roomId:"roomId-2"});
    });

    it("should call ChatService.readChatByRoomId return same chatRepository.find return ",async()=>{
        ChatRepository.find.mockImplementation(obj=>obj);
        expect(ChatService.readChatByRoomId(chatDTO_Create1)).resolves.toEqual({roomId:chatDTO_Create1});
        expect(ChatService.readChatByRoomId(chatDTO_Create1)).resolves.not.toEqual({roomId:chatDTO_Create2});
    });
});


afterAll(() => {
    jest.resetModules();
});