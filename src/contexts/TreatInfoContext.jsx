import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPrecheckFromForm } from '@apis/precheckApi';

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
            const apiResult = await createPrecheckFromForm(formData, currentLanguage);
            setResult(apiResult);
            return apiResult;
        } catch (err) {
            console.error('사전문진 제출 오류:', err);
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
            parseInt(formData.age) > 0 && 
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
                return age > 0 && age <= 150;
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