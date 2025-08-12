import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from '@components/layouts/MainLayout';
import SimpleLayout from '@components/layouts/SimpleLayout';
import HomePage from '@pages/HomePage';
import ChatPage from '@pages/ChatPage';
import MyPage from '@pages/MyPage';
import LanguagePage from '@pages/LanguagePage';
import PrescriptionPage from '@pages/PrescriptionPage';
import PrescriptionUploadPage from '@pages/PrescriptionUploadPage';
import PrescriptionScanningPage from '@pages/PrescriptionScanningPage';
import PrescriptionResultPage from '@pages/PrescriptionResultPage';

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
                    <Route path="prescription" element={<PrescriptionPage />} />
                    <Route path="prescription/upload" element={<PrescriptionUploadPage />} />
                    <Route path="prescription/scanning" element={<PrescriptionScanningPage />} />
                    <Route path="prescription/result" element={<PrescriptionResultPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;