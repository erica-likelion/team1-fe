/**
 * 채팅 관련 API 함수들
 */

import api from '@utils/apiClient';

/**
 * 사용자의 모든 채팅방 목록을 조회
 * @returns {Promise<Array>} 채팅방 목록
 * @example
 * const chatRooms = await getChatRooms();
 * // 응답 형태:
 * // [
 * //   {
 * //     id: "chat_001",
 * //     title: "병원 예약 문의",
 * //     description: "내과 예약 관련 통역 채팅",
 * //     createdAt: "2025-03-12"
 * //   }
 * // ]
 */
export const getChatRooms = async () => {
  try {
    //const response = await api.get('/api/chat/rooms');
    return [
      {
        id: 1,
        title: "Name1",
        roomCode: "slfknl2n2d",
        description: "내과 예약 관련 통역 채팅",
        createdAt: "2025-03-12"
      },
      {
        id: 2,
        title: "Name2",
        roomCode: "slfknl2n2d",
        description: "내과 예약 관련 통역 채팅",
        createdAt: "2025-03-12"
      },
      {
        id: 3,
        title: "Name3",
        roomCode: "slfknl2n2d",
        description: "내과 예약 관련 통역 채팅",
        createdAt: "2025-03-12"
      },
    ];
    //return response.data;
  } catch (error) {
    console.error('채팅방 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 새로운 채팅방 생성
 * @param {object} chatData 
 * @param {string} chatData.title - 채팅방 제목
 * @param {string} chatData.description - 채팅방 설명
 * @returns {Promise<object>} 생성된 채팅방 정보
 */
export const createChatRoom = async (chatData) => {
  try {
    const response = await api.post('/api/chat/rooms', chatData);
    return response.data;
  } catch (error) {
    console.error('채팅방 생성 실패:', error);
    throw error;
  }
};


/**
 * 특정 채팅방의 메시지 목록을 조회
 * @param {string} roomId - 채팅방 ID
 * @returns {Promise<Array>} 채팅 메시지 목록 (화면 표시용 형태)
 * @example
 * const messages = await getChatMessages('chat_001');
 * // 응답 형태:
 * // [
 * //   {
 * //     id: "1",
 * //     sender: "사용자", // "사용자" | "의료진"
 * //     content: "최근에 두통이 자주 발생해서 걱정이에요.",
 * //     koreanContent: "최근에 두통이 자주 발생해서 걱정이에요.",
 * //     timestamp: "2025-03-12T12:00:00.000Z",
 * //     type: "sent" // "sent" | "received"
 * //   }
 * // ]
 */
export const getChatMessages = async (roomId) => {
  try {
    // const response = await api.get(`/api/chat/rooms/${roomId}`);
    // return response.data;
    
    // 화면 표시용 목업 데이터
    return [
      {
        id: 1,
        sender: 'medi',
        message: '안녕하세요! 어떤 건강 관련 질문이 있으신가요?',
        koreanContent: 'k안녕하세요! 어떤 건강 관련 질문이 있으신가요?',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        roomId: 1
      },
      {
        id: 2,
        sender: 'user',
        message: '최근에 두통이 자주 발생해서 걱정이에요.',
        koreanContent: 'k최근에 두통이 자주 발생해서 걱정이에요.',
        createdAt: new Date(Date.now() - 3000000).toISOString(),
        roomId: 1
      },
      {
        id: 3,
        sender: 'medi',
        message: '두통의 빈도와 강도에 대해 자세히 알려주시겠어요? 언제부터 시작되었고, 어떤 상황에서 더 심해지는지 궁금합니다.',
        koreanContent: 'k두통의 빈도와 강도에 대해 자세히 알려주시겠어요? 언제부터 시작되었고, 어떤 상황에서 더 심해지는지 궁금합니다.',
        createdAt: new Date(Date.now() - 2900000).toISOString(),
        roomId: 1
      },
      {
        id: '4',
        sender: 'user',
        message: 'dd일주일 전부터 하루에 2-3번 정도 발생하고, 스트레스를 받을 때 더 심해지는 것 같아요.',
        koreanContent: 'k일주일 전부터 하루에 2-3번 정도 발생하고, 스트레스를 받을 때 더 심해지는 것 같아요.',
        createdAt: new Date(Date.now() - 2800000).toISOString(),
        roomId: 1
      },
      {
        id: '5',
        sender: 'medi',
        message: '스트레스성 두통일 가능성이 높아 보입니다. 충분한 휴식과 수분 섭취를 권합니다. 증상이 지속되면 병원 방문을 추천드려요.',
        koreanContent: 'k스트레스성 두통일 가능성이 높아 보입니다. 충분한 휴식과 수분 섭취를 권합니다. 증상이 지속되면 병원 방문을 추천드려요.',
        createdAt: new Date(Date.now() - 2700000).toISOString(),
        roomId: 1
      }
    ];
  } catch (error) {
    console.error('채팅 메시지 조회 실패:', error);
    throw error;
  }
};