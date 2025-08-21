import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPrecheckFromForm, createPrecheckMock } from '@apis/precheckApi';

const TreatInfoContext = createContext();

export const useTreatInfo = () => {
    const context = useContext(TreatInfoContext);
    if (!context) {
        throw new Error('useTreatInfo must be used within a TreatInfoProvider');
    }
    return context;
};

export const TreatInfoProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        symptoms: '',
        name: '',
        age: '',
        gender: '',
        nationality: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // 개별 필드 업데이트
    const updateField = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    // 전체 폼 데이터 업데이트
    const updateFormData = useCallback((data) => {
        setFormData(prev => ({
            ...prev,
            ...data
        }));
    }, []);

    // 폼 데이터 초기화
    const resetForm = useCallback(() => {
        setFormData({
            symptoms: '',
            name: '',
            age: '',
            gender: '',
            nationality: ''
        });
        setResult(null);
        setError(null);
    }, []);

    // 사전문진 제출
    const submitTreatInfo = useCallback(async (currentLanguage = 'en') => {
        setIsLoading(true);
        setError(null);
        
        try {
            console.log('제출할 폼 데이터:', formData);
            
            // 개발 환경에서는 목업 사용 여부를 결정
            const USE_MOCK = import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL;
            
            let apiResult;
            if (USE_MOCK) {
                console.log('🧪 목업 데이터를 사용합니다 (서버 미배포 상태)');
                
                // 목업용 데이터 변환
                const mockData = {
                    language: currentLanguage === 'ko' ? 'korean' : currentLanguage === 'zh-CN' ? 'chinese' : 'english',
                    name: formData.name,
                    age: parseInt(formData.age),
                    nationality: formData.nationality,
                    gender: formData.gender,
                    description: formData.symptoms
                };
                
                apiResult = await createPrecheckMock(mockData);
            } else {
                console.log('🌐 실제 API 서버에 요청을 보냅니다');
                apiResult = await createPrecheckFromForm(formData, currentLanguage);
            }
            
            setResult(apiResult);
            return apiResult;
        } catch (err) {
            console.error('사전문진 제출 오류:', err);
            
            // 실제 API 실패시 목업으로 fallback (선택적)
            if (err.message.includes('ERR_CONNECTION_REFUSED') || err.message.includes('Network Error')) {
                console.log('🔄 서버 연결 실패, 목업 데이터로 fallback');
                try {
                    const mockData = {
                        language: currentLanguage === 'ko' ? 'korean' : currentLanguage === 'zh-CN' ? 'chinese' : 'english',
                        name: formData.name,
                        age: parseInt(formData.age),
                        nationality: formData.nationality,
                        gender: formData.gender,
                        description: formData.symptoms
                    };
                    
                    const mockResult = await createPrecheckMock(mockData);
                    setResult(mockResult);
                    return mockResult;
                } catch (mockErr) {
                    setError('목업 데이터도 실패했습니다: ' + mockErr.message);
                    throw mockErr;
                }
            }
            
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [formData]);

    // 폼 유효성 검사
    const isFormValid = useCallback(() => {
        return (
            formData.symptoms.trim().length >= 10 &&
            formData.name.trim().length >= 1 &&
            formData.age && 
            parseInt(formData.age) >= 0 && 
            parseInt(formData.age) <= 150 &&
            formData.gender &&
            formData.nationality.trim().length >= 2
        );
    }, [formData]);

    // 각 페이지별 유효성 검사
    const isStepValid = useCallback((step) => {
        switch (step) {
            case 'symptoms':
                return formData.symptoms.trim().length >= 1;
            case 'name':
                return formData.name.trim().length >= 1;
            case 'age':
                const age = parseInt(formData.age);
                return age >= 0 && age <= 150;
            case 'gender':
                return !!formData.gender;
            case 'nationality':
                return formData.nationality.trim().length >= 2;
            default:
                return false;
        }
    }, [formData]);

    const value = {
        // 상태
        formData,
        isLoading,
        result,
        error,
        
        // 액션
        updateField,
        updateFormData,
        resetForm,
        submitTreatInfo,
        
        // 유효성 검사
        isFormValid,
        isStepValid
    };

    return (
        <TreatInfoContext.Provider value={value}>
            {children}
        </TreatInfoContext.Provider>
    );
};

export default TreatInfoContext;