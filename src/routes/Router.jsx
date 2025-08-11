import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from '@components/layouts/MainLayout';
import SimpleLayout from '@components/layouts/SimpleLayout';
import HomePage from '@pages/HomePage';
import ChatPage from '@pages/ChatPage';
import MyPage from '@pages/MyPage';
import LanguagePage from '@pages/LanguagePage';

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="home" element={<HomePage />} />
                    <Route path="chat" element={<ChatPage />} />
                    <Route path="mypage" element={<MyPage />} />
                </Route>
                
                <Route path="/" element={<SimpleLayout />}>
                    <Route path="language" element={<LanguagePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;