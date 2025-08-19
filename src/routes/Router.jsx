import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SearchProvider } from '@contexts/SearchContext';
import { UserProvider } from '@contexts/UserContext';

import MainLayout from '@components/layouts/MainLayout';
import SimpleLayout from '@components/layouts/SimpleLayout';
import SplashPage from '@pages/SplashPage';
import HomePage from '@pages/HomePage';
import ChatPage from '@pages/chat-page/ChatPage';
import ChatRoomPage from '@pages/chat-page/ChatRoomPage';
import ChatQRcodePage from '@pages/chat-page/ChatQRcodePage';
import MyPage from '@pages/MyPage';
import LanguagePage from '@pages/LanguagePage';
import NamePage from '@pages/treat-info-form/NamePage'
import AgePage from '@/pages/treat-info-form/AgePage';
import CountryPage from '@pages/treat-info-form/CountryPage';
import GenderPage from '@pages/treat-info-form/GenderPage';
import SymptomsPage from '@pages/treat-info-form/SymptomsPage';
import PrescriptionPage from '@pages/prescription-page/PrescriptionPage';
import PrescriptionUploadPage from '@pages/prescription-page/PrescriptionUploadPage';
import PrescriptionScanningPage from '@pages/prescription-page/PrescriptionScanningPage';
import PrescriptionResultPage from '@pages/prescription-page/PrescriptionResultPage';
import TreantInfoScanningPage from '@/pages/treat-info-form/TreantInfoScanningPage';
import TreantInfoResultPage from '@/pages/treat-info-form/TreatInfoResultPage';

const Router = () => {
    return (
        <BrowserRouter>
            <SearchProvider>
                <UserProvider>
                    <Routes>
                        <Route path="/" element={<SplashPage />} />
                        
                        <Route path="/" element={<MainLayout />}>
                            <Route path="home" element={<HomePage />} />
                            <Route path="chat" element={<ChatPage />} />
                            <Route path="mypage" element={<MyPage />} />
                        </Route>
                        
                        <Route path="/" element={<SimpleLayout />}>
                            <Route path="chat/:roomId/:roomCode" element={<ChatRoomPage />} />
                            <Route path="chat/:roomId/:roomCode/qr" element={<ChatQRcodePage />}/>
                            <Route path="language" element={<LanguagePage />} />
                            <Route path='treat-info-form/name' element={<NamePage />}/>
                            <Route path='treat-info-form/age' element={<AgePage />}/>
                            <Route path='treat-info-form/country' element={<CountryPage />}/>
                            <Route path='treat-info-form/gender' element={<GenderPage />}/>
                            <Route path='treat-info-form/symptoms' element={<SymptomsPage />}/>
                            <Route path="prescription" element={<PrescriptionPage />} />
                            <Route path="prescription/upload" element={<PrescriptionUploadPage />} />
                            <Route path="prescription/result" element={<PrescriptionResultPage />} />
                        </Route>
                        
                        <Route path="prescription/scanning" element={<PrescriptionScanningPage />} />
                        <Route path="treat-info/scanning" element={<TreantInfoScanningPage />} />
                    </Routes>
                </UserProvider>
            </SearchProvider>
        </BrowserRouter>
    )
}

export default Router;