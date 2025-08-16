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
        id: "chat_001",
        title: "Name1",
        description: "내과 예약 관련 통역 채팅",
        createdAt: "2025-03-12"
      },
      {
        id: "chat_002",
        title: "Name2",
        description: "내과 예약 관련 통역 채팅",
        createdAt: "2025-03-12"
      },
      {
        id: "chat_003",
        title: "Name3",
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
 * 특정 채팅방 정보 조회
 * @param {string} roomId - 채팅방 ID
 * @returns {Promise<object>} 채팅방 정보
 */
export const getChatRoom = async (roomId) => {
  try {
    const response = await api.get(`/api/chat/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    console.error('채팅방 조회 실패:', error);
    throw error;
  }
};