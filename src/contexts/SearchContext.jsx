/**
 * SearchContext - React Context API를 활용한 검색 상태 관리
 * 
 * [ Context API란? ]
 * - React에서 전역 상태를 관리하는 내장 기능
 * - props drilling(부모→자식→손자 등으로 props 전달) 없이 컴포넌트 간 상태 공유
 * - Provider로 감싼 하위 컴포넌트들이 Context 값에 접근 가능
 * 
 * [ 이 SearchContext의 역할 ]
 * - ChatPage와 미래의 ChatRoomPage에서 검색 상태 공유
 * - TopNavBar의 검색 버튼 클릭 시 각 페이지의 검색 UI 토글
 * - 검색어 입력, 검색 결과 하이라이트 등 검색 관련 모든 상태 관리
 * 
 * [ 사용 방법 ]
 * 1. Router에서 <SearchProvider>로 앱 전체 감싸기 ✅
 * 2. 컴포넌트에서 const { isSearchMode, toggleSearch } = useSearch(); 로 사용
 * 3. 검색 버튼 클릭 시 toggleSearch('chatList') 호출하여 검색 모드 토글
 */

import { createContext, useContext, useReducer } from 'react';

// 1. Context 생성 - 검색 상태를 공유할 "그릇" 만들기
const SearchContext = createContext();

// 2. 초기 상태 정의 - 검색 관련 모든 상태값들
const initialState = {
  isSearchMode: false,        // 검색 모드 on/off (검색창 표시 여부)
  searchQuery: '',           // 사용자가 입력한 검색어
  searchType: 'chatList',    // 검색 타입: 'chatList'(채팅방 목록) | 'chatMessage'(채팅 메시지)
  highlightedIndex: 0,       // 현재 하이라이트된 검색 결과 인덱스 (나중에 사용)
  searchResults: []          // 검색 결과 배열 (나중에 사용)
};

// 3. 액션 타입 정의 - 상태를 변경할 수 있는 모든 액션들
const SEARCH_ACTIONS = {
  // 🔧 액션을 더 명확하게 분리
  TOGGLE_SEARCH_MODE: 'TOGGLE_SEARCH_MODE',     // 단순 on/off 토글
  ENTER_SEARCH_MODE: 'ENTER_SEARCH_MODE',       // 특정 타입으로 검색 모드 진입
  EXIT_SEARCH_MODE: 'EXIT_SEARCH_MODE',         // 검색 모드 완전 종료
  SET_QUERY: 'SET_QUERY',
  SET_SEARCH_TYPE: 'SET_SEARCH_TYPE',
  SET_HIGHLIGHT_INDEX: 'SET_HIGHLIGHT_INDEX',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS'
};

// 4. 리듀서 함수 - 액션에 따라 상태를 어떻게 변경할지 정의
// 📝 리듀서란? (state, action) => newState 형태의 순수함수
const searchReducer = (state, action) => {
  switch (action.type) {
    // 🎯 단순 토글 (타입 변경 없음)
    case SEARCH_ACTIONS.TOGGLE_SEARCH_MODE:
      return {
        ...state,
        isSearchMode: !state.isSearchMode,
        // 검색 모드 종료 시에만 초기화
        ...(state.isSearchMode && {
          searchQuery: '',
          searchResults: [],
          highlightedIndex: 0
        })
      };

    // 🎯 특정 타입으로 검색 모드 진입
    case SEARCH_ACTIONS.ENTER_SEARCH_MODE:
      return {
        ...state,
        isSearchMode: true,
        searchType: action.payload, // payload는 무조건 있어야 함
        searchQuery: '',
        searchResults: [],
        highlightedIndex: 0
      };

    // 🎯 검색 모드 완전 종료
    case SEARCH_ACTIONS.EXIT_SEARCH_MODE:
      return {
        ...state,
        isSearchMode: false,
        searchQuery: '',
        searchResults: [],
        highlightedIndex: 0
        // searchType은 유지 (다음번 진입 시 기본값으로 사용)
      };

    case SEARCH_ACTIONS.SET_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
        highlightedIndex: 0
      };

    case SEARCH_ACTIONS.SET_SEARCH_TYPE:
      return {
        ...state,
        searchType: action.payload
      };

    case SEARCH_ACTIONS.SET_HIGHLIGHT_INDEX:
      return {
        ...state,
        highlightedIndex: action.payload
      };

    case SEARCH_ACTIONS.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload
      };

    default:
      return state;
  }
};

// 5. SearchProvider 컴포넌트 - Context 값을 하위 컴포넌트들에게 제공
// 📝 Provider란? Context 값을 "제공하는" 컴포넌트
export const SearchProvider = ({ children }) => {
  // useReducer로 상태와 dispatch 함수 생성
  const [state, dispatch] = useReducer(searchReducer, initialState);

  // 6. 액션 생성자들 - 컴포넌트에서 쉽게 사용할 수 있도록 함수로 래핑
  const actions = {
    // 🔧 더 명확한 함수들
    toggleSearchMode: () => 
      dispatch({ type: SEARCH_ACTIONS.TOGGLE_SEARCH_MODE }),
    
    enterSearchMode: (type = 'chatList') => 
      dispatch({ type: SEARCH_ACTIONS.ENTER_SEARCH_MODE, payload: type }),
    
    exitSearchMode: () => 
      dispatch({ type: SEARCH_ACTIONS.EXIT_SEARCH_MODE }),
    
    setQuery: (query) => 
      dispatch({ type: SEARCH_ACTIONS.SET_QUERY, payload: query }),
    
    setSearchType: (type) => 
      dispatch({ type: SEARCH_ACTIONS.SET_SEARCH_TYPE, payload: type }),
    
    setHighlightIndex: (index) => 
      dispatch({ type: SEARCH_ACTIONS.SET_HIGHLIGHT_INDEX, payload: index }),
    
    setSearchResults: (results) => 
      dispatch({ type: SEARCH_ACTIONS.SET_SEARCH_RESULTS, payload: results }),

    // 🎯 편의 함수들
    startChatListSearch: () => 
      dispatch({ type: SEARCH_ACTIONS.ENTER_SEARCH_MODE, payload: 'chatList' }),
    
    startChatMessageSearch: () => 
      dispatch({ type: SEARCH_ACTIONS.ENTER_SEARCH_MODE, payload: 'chatMessage' }),

    // 🔄 기존 호환성을 위한 함수 (기존 코드가 깨지지 않도록)
    toggleSearch: (type = 'chatList') => 
      dispatch({ type: SEARCH_ACTIONS.ENTER_SEARCH_MODE, payload: type }),
    
    clearSearch: () => 
      dispatch({ type: SEARCH_ACTIONS.EXIT_SEARCH_MODE })
  };

  // Provider로 state와 actions를 하위 컴포넌트들에게 제공
  return (
    <SearchContext.Provider value={{ ...state, ...actions }}>
      {children}
    </SearchContext.Provider>
  );
};

// 7. useSearch 커스텀 훅 - Context 값을 쉽게 사용할 수 있게 해주는 훅
export const useSearch = () => {
  const context = useContext(SearchContext);
  
  // SearchProvider 없이 useSearch를 사용하면 에러 발생
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  
  return context;
};

/* 
🎯 사용 예시:

// NavBar에서 검색 버튼 클릭
const { enterSearchMode } = useSearch();
enterSearchMode('chatList'); // 채팅방 목록 검색 모드로 진입

// 단순 토글만 하고 싶을 때
const { toggleSearchMode } = useSearch();
toggleSearchMode(); // 현재 상태만 뒤집기

// 검색 종료
const { exitSearchMode } = useSearch();
exitSearchMode(); // 모든 검색 관련 상태 초기화

// 편의 함수 사용
const { startChatListSearch, startChatMessageSearch } = useSearch();
startChatListSearch(); // 채팅방 목록 검색 시작
startChatMessageSearch(); // 채팅 메시지 검색 시작
*/