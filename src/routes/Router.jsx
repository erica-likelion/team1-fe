import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from '@components/layouts/MainLayout';
import SimpleLayout from '@components/layouts/SimpleLayout';
import HomePage from '@pages/HomePage';
import ChatPage from '@pages/ChatPage';
import MyPage from '@pages/MyPage';
import LanguagePage from '@pages/LanguagePage';
import NamePage from '@pages/treat-info-form/NamePage'
import AgePage from '../pages/treat-info-form/AgePage';
import CountryPage from '../pages/treat-info-form/CountryPage';
import GenderPage from '../pages/treat-info-form/GenderPage';
import SymptomsPage from '../pages/treat-info-form/SymptomsPage';
import PrescriptionPage from '@pages/PrescriptionPage';
// import PrescriptionUploadPage from '@pages/PrescriptionUploadPage';
// import PrescriptionScanningPage from '@pages/PrescriptionScanningPage';
// import PrescriptionResultPage from '@pages/PrescriptionResultPage';

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
                    <Route path='treat-info-form-name' element={<NamePage />}/>
                    <Route path='treat-info-form-age' element={<AgePage />}/>
                    <Route path='treat-info-form-country' element={<CountryPage />}/>
                    <Route path='treat-info-form-gender' element={<GenderPage />}/>
                    <Route path='treat-info-form-symptoms' element={<SymptomsPage />}/>
                    <Route path="prescription" element={<PrescriptionPage />} />
                    {/* <Route path="prescription/upload" element={<PrescriptionUploadPage />} /> */}
                    {/* <Route path="prescription/scanning" element={<PrescriptionScanningPage />} /> */}
                    {/* <Route path="prescription/result" element={<PrescriptionResultPage />} /> */}
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;