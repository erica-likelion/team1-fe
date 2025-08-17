/**
 * SearchContext - React Context API를 활용한 검색 상태 관리
 * 
 * [ Context API란? ]
 * - React에서 전역 상태를 관리하는 내장 기능
 * - props drilling(부모→자식→손자 등으로 props 전달) 없이 컴포넌트 간 상태 공유
 * - Provider로 감싼 하위 컴포넌트들이 Context 값에 접근 가능
 * 
 * [ 이 SearchContext의 역할 ]
 * - 모든 페이지에서 통합된 검색 상태 공유
 * - NavBar의 검색 버튼 클릭 시 검색 UI 토글
 * - 검색어 입력, 검색 결과 하이라이트 등 검색 관련 모든 상태 관리
 * 
 * [ 사용 방법 ]
 * 1. Router에서 <SearchProvider>로 앱 전체 감싸기 ✅
 * 2. 컴포넌트에서 const { isSearchMode, toggleSearchMode } = useSearch(); 로 사용
 * 3. 검색 버튼 클릭 시 toggleSearchMode() 호출하여 검색 모드 토글
 */

import { createContext, useContext, useReducer } from 'react';

// 1. Context 생성 - 검색 상태를 공유할 "그릇" 만들기
const SearchContext = createContext();

// 2. 초기 상태 정의 - 검색 관련 모든 상태값들
const initialState = {
  isSearchMode: false,        // 검색 모드 on/off (검색창 표시 여부)
  searchQuery: '',           // 사용자가 입력한 검색어
  highlightedIndex: 0,       // 현재 하이라이트된 검색 결과 인덱스 (나중에 사용)
  searchResults: []          // 검색 결과 배열 (나중에 사용)
};

// 3. 액션 타입 정의 - 상태를 변경할 수 있는 모든 액션들
const SEARCH_ACTIONS = {
  TOGGLE_SEARCH_MODE: 'TOGGLE_SEARCH_MODE',     // 검색 모드 on/off 토글
  SET_QUERY: 'SET_QUERY',
  SET_HIGHLIGHT_INDEX: 'SET_HIGHLIGHT_INDEX',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS'
};

// 4. 리듀서 함수 - 액션에 따라 상태를 어떻게 변경할지 정의
// 📝 리듀서란? (state, action) => newState 형태의 순수함수
const searchReducer = (state, action) => {
  switch (action.type) {
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

    case SEARCH_ACTIONS.SET_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
        highlightedIndex: 0
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
    toggleSearchMode: () => 
      dispatch({ type: SEARCH_ACTIONS.TOGGLE_SEARCH_MODE }),
    
    setQuery: (query) => 
      dispatch({ type: SEARCH_ACTIONS.SET_QUERY, payload: query }),
    
    setHighlightIndex: (index) => 
      dispatch({ type: SEARCH_ACTIONS.SET_HIGHLIGHT_INDEX, payload: index }),
    
    setSearchResults: (results) => 
      dispatch({ type: SEARCH_ACTIONS.SET_SEARCH_RESULTS, payload: results })
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
const { toggleSearchMode } = useSearch();
toggleSearchMode(); // 검색 모드 토글

// 검색어 입력
const { setQuery } = useSearch();
setQuery('검색어'); // 검색어 설정

// 검색 결과 하이라이트
const { setHighlightIndex } = useSearch();
setHighlightIndex(0); // 첫 번째 결과 하이라이트
*/