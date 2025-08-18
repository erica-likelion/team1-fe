import { createContext, useState, useContext } from 'react';

// 1. Context 생성 - 검색 상태를 공유할 "그릇" 만들기
const userContext = createContext();

export const UserProvider= ({children}) =>{
    const [user, setUser] = useState({name: "멋사", gender: "M"});

    return (
        <userContext.Provider value={{user, setUser}}>
            {children}
        </userContext.Provider>
    );
}

export const useUser = () => {
    return useContext(userContext);
}