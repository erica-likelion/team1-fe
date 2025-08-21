import api from "@utils/apiClient";

/**
 * 사전문진 API 서비스
 * API 명세서에 맞춘 실제 구현
 */

/**
 * 사전문진 생성 및 AI 분석 요청
 * @param {Object} precheckData - 사전문진 데이터
 * @param {string} precheckData.language - 입력 언어 ("english" | "chinese")
 * @param {string} precheckData.name - 환자 이름
 * @param {number} precheckData.age - 나이
 * @param {string} precheckData.nationality - 국적
 * @param {string} precheckData.gender - 성별 ("M" | "F")
 * @param {string} precheckData.description - 증상 설명
 * @returns {Promise<Object>} AI 분석 결과
 */
export const createPrecheck = async (precheckData) => {
    try {
        console.log('사전문진 API 요청:', precheckData);

        // API 명세서에 맞는 요청 데이터 검증
        const requiredFields = ['language', 'name', 'age', 'nationality', 'gender', 'description'];
        for (const field of requiredFields) {
            if (precheckData[field] === undefined || precheckData[field] === null) {
                throw new Error(`필수 필드가 누락되었습니다: ${field}`);
            }
        }

        // 성별 값 검증
        if (!['M', 'F'].includes(precheckData.gender)) {
            throw new Error('성별은 M 또는 F 값이어야 합니다.');
        }

        // 언어 값 검증
        if (!['english', 'chinese'].includes(precheckData.language)) {
            throw new Error('언어는 english 또는 chinese 값이어야 합니다.');
        }

        // 나이가 숫자인지 확인
        if (typeof precheckData.age !== 'number' || precheckData.age < 0) {
            throw new Error('나이는 양수여야 합니다.');
        }

        const response = await api.post('/api/precheck', {
            language: precheckData.language,
            name: precheckData.name,
            age: precheckData.age,
            nationality: precheckData.nationality,
            gender: precheckData.gender,
            description: precheckData.description
        });

        if (!response.data) {
            throw new Error('API 응답 데이터가 없습니다.');
        }

        console.log('사전문진 API 응답:', response.data);

        // 응답 데이터 구조 검증
        const requiredResponseFields = ['id', 'title', 'content', 'koreanContent', 'createdAt'];
        for (const field of requiredResponseFields) {
            if (response.data[field] === undefined) {
                console.warn(`응답에서 필드가 누락되었습니다: ${field}`);
            }
        }

        return response.data;

    } catch (error) {
        console.error('사전문진 생성 중 오류 발생:', error);
        
        // HTTP 상태 코드별 에러 처리
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || error.message;
            
            switch (status) {
                case 400:
                    throw new Error(`잘못된 요청입니다: ${message}`);
                case 401:
                    throw new Error('인증이 필요합니다.');
                case 403:
                    throw new Error('접근 권한이 없습니다.');
                case 404:
                    throw new Error('API 엔드포인트를 찾을 수 없습니다.');
                case 429:
                    throw new Error('요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
                case 500:
                    throw new Error('서버 내부 오류가 발생했습니다.');
                default:
                    throw new Error(`API 오류 (${status}): ${message}`);
            }
        } else if (error.request) {
            throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
        } else {
            throw new Error(`사전문진 생성 실패: ${error.message}`);
        }
    }
};

/**
 * 언어 코드 변환 유틸리티 함수
 * i18n 언어 코드를 API에서 요구하는 형식으로 변환
 * @param {string} i18nLanguage - i18n 언어 코드 (예: 'en', 'zh', 'ko')
 * @returns {string} API 언어 형식 ('english' | 'chinese')
 */
export const convertLanguageForAPI = (i18nLanguage) => {
    const languageMap = {
        'en': 'english',
        'en-US': 'english',
        'en-GB': 'english',
        'zh': 'chinese',
        'zh-CN': 'chinese',
        'zh-TW': 'chinese',
        'ko': 'english', // 한국어는 기본적으로 영어로 처리
        'ko-KR': 'english'
    };

    return languageMap[i18nLanguage] || 'english';
};

/**
 * 성별 코드 변환 유틸리티 함수
 * 다양한 성별 표현을 API 형식으로 변환
 * @param {string} gender - 성별 (한국어/영어/기타)
 * @returns {string} API 성별 코드 ('M' | 'F')
 */
export const convertGenderForAPI = (gender) => {
    const genderStr = gender.toLowerCase();
    
    if (genderStr.includes('남') || genderStr.includes('male') || genderStr === 'm') {
        return 'M';
    } else if (genderStr.includes('여') || genderStr.includes('female') || genderStr === 'f') {
        return 'F';
    }
    
    throw new Error('올바른 성별 정보를 입력해주세요.');
};

/**
 * 사전문진 생성을 위한 헬퍼 함수
 * 폼 데이터를 API 형식으로 변환하여 요청
 * @param {Object} formData - 폼에서 입력받은 데이터
 * @param {string} formData.symptoms - 증상 설명
 * @param {string} formData.name - 환자 이름
 * @param {number|string} formData.age - 나이
 * @param {string} formData.gender - 성별
 * @param {string} formData.nationality - 국적
 * @param {string} currentLanguage - 현재 언어 설정
 * @returns {Promise<Object>} 사전문진 결과
 */
export const createPrecheckFromForm = async (formData, currentLanguage = 'en') => {
    try {
        // 폼 데이터를 API 형식으로 변환
        const apiData = {
            language: convertLanguageForAPI(currentLanguage),
            name: formData.name.trim(),
            age: typeof formData.age === 'string' ? parseInt(formData.age) : formData.age,
            nationality: formData.nationality.trim().toLowerCase(),
            gender: convertGenderForAPI(formData.gender),
            description: formData.symptoms.trim()
        };

        // 추가 검증
        if (!apiData.name || apiData.name.length < 1) {
            throw new Error('이름을 입력해주세요.');
        }

        if (isNaN(apiData.age) || apiData.age < 0 || apiData.age > 150) {
            throw new Error('올바른 나이를 입력해주세요. (0-150)');
        }

        if (!apiData.nationality || apiData.nationality.length < 2) {
            throw new Error('국적을 입력해주세요.');
        }

        if (!apiData.description || apiData.description.length < 1) {
            throw new Error('증상을 입력해주세요.');
        }

        return await createPrecheck(apiData);

    } catch (error) {
        console.error('폼 데이터 처리 중 오류:', error);
        throw error;
    }
};

/**
 * 사전문진 목록 조회
 * @param {Object} params - 조회 옵션
 * @param {number} [params.page] - 페이지 번호 (1부터 시작)
 * @param {number} [params.limit] - 페이지당 항목 수
 * @param {string} [params.sortBy] - 정렬 기준 ('createdAt', 'id')
 * @param {string} [params.sortOrder] - 정렬 순서 ('asc', 'desc')
 * @returns {Promise<Array>} 사전문진 목록
 */
export const getPrecheckHistory = async (params = {}) => {
    try {
        console.log('사전문진 목록 조회:', params);

        // 쿼리 파라미터 구성
        const queryParams = new URLSearchParams();
        
        if (params.page) {
            queryParams.append('page', params.page.toString());
        }
        if (params.limit) {
            queryParams.append('limit', params.limit.toString());
        }
        if (params.sortBy) {
            queryParams.append('sortBy', params.sortBy);
        }
        if (params.sortOrder) {
            queryParams.append('sortOrder', params.sortOrder);
        }

        const queryString = queryParams.toString();
        const url = queryString ? `/api/precheck?${queryString}` : '/api/precheck';

        const response = await api.get(url);

        if (!response.data) {
            throw new Error('API 응답 데이터가 없습니다.');
        }

        console.log('사전문진 목록 응답:', response.data);

        // 응답이 배열인지 확인
        if (!Array.isArray(response.data)) {
            throw new Error('예상과 다른 응답 형식입니다.');
        }

        // 각 항목의 필수 필드 검증
        response.data.forEach((item, index) => {
            const requiredFields = ['id', 'title', 'createdAt'];
            for (const field of requiredFields) {
                if (item[field] === undefined) {
                    console.warn(`항목 ${index}에서 필드가 누락되었습니다: ${field}`);
                }
            }
        });

        return response.data;

    } catch (error) {
        console.error('사전문진 목록 조회 중 오류 발생:', error);
        
        // HTTP 상태 코드별 에러 처리
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || error.message;
            
            switch (status) {
                case 400:
                    throw new Error(`잘못된 요청입니다: ${message}`);
                case 401:
                    throw new Error('인증이 필요합니다.');
                case 403:
                    throw new Error('접근 권한이 없습니다.');
                case 404:
                    throw new Error('문진 목록을 찾을 수 없습니다.');
                case 500:
                    throw new Error('서버 내부 오류가 발생했습니다.');
                default:
                    throw new Error(`API 오류 (${status}): ${message}`);
            }
        } else if (error.request) {
            throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
        } else {
            throw new Error(`문진 목록 조회 실패: ${error.message}`);
        }
    }
};

/**
 * 특정 사전문진 상세 조회
 * @param {number} id - 조회할 문진 ID
 * @returns {Promise<Object>} 사전문진 상세 정보
 */
export const getPrecheckDetail = async (id) => {
    try {
        if (!id || typeof id !== 'number') {
            throw new Error('올바른 문진 ID를 입력해주세요.');
        }

        console.log('사전문진 상세 조회:', id);

        const response = await api.get(`/api/precheck/${id}`);

        if (!response.data) {
            throw new Error('문진 정보를 찾을 수 없습니다.');
        }

        console.log('사전문진 상세 응답:', response.data);

        return response.data;

    } catch (error) {
        console.error('사전문진 상세 조회 중 오류 발생:', error);
        
        if (error.response?.status === 404) {
            throw new Error('해당 문진을 찾을 수 없습니다.');
        }
        
        throw new Error(`문진 상세 조회 실패: ${error.message}`);
    }
};

/**
 * 최근 사전문진 목록 조회 (편의 함수)
 * @param {number} [limit=10] - 조회할 항목 수
 * @returns {Promise<Array>} 최근 사전문진 목록
 */
export const getRecentPrechecks = async (limit = 10) => {
    return await getPrecheckHistory({
        limit,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
};

/**
 * 목업 데이터를 위한 개발용 함수 (개발 단계에서만 사용)
 * 실제 API 호출 전에 테스트용으로 사용
 */
export const createPrecheckMock = async (precheckData) => {
    // 개발 환경에서만 작동
    if (!import.meta.env.DEV) {
        throw new Error('목업 함수는 개발 환경에서만 사용할 수 있습니다.');
    }

    // 2-3초 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 목업 응답 생성
    const mockResponse = {
        id: Date.now(),
        title: precheckData.language === 'english' 
            ? `Medical consultation for ${precheckData.name}` 
            : `${precheckData.name}的医疗咨询`,
        koreanTitle: `${precheckData.name}님의 의료 상담`,
        content: precheckData.language === 'english'
            ? `Patient ${precheckData.name} (${precheckData.age} years old, ${precheckData.nationality}) reports: ${precheckData.description}. Based on the symptoms described, we recommend scheduling a consultation with a healthcare provider for proper evaluation and treatment.`
            : `患者${precheckData.name}（${precheckData.age}岁，${precheckData.nationality}）报告：${precheckData.description}。根据所描述的症状，我们建议安排与医疗保健提供者的咨询，以进行适当的评估和治疗。`,
        koreanContent: `환자 ${precheckData.name}님 (${precheckData.age}세, ${precheckData.nationality})의 증상: ${precheckData.description}. 설명하신 증상을 바탕으로 적절한 평가와 치료를 위해 의료진과의 상담을 권장합니다.`,
        createdAt: new Date().toISOString().split('T')[0]
    };

    return mockResponse;
};

/**
 * 목업 문진 목록 (개발용)
 */
export const getPrecheckHistoryMock = async () => {
    if (!import.meta.env.DEV) {
        throw new Error('목업 함수는 개발 환경에서만 사용할 수 있습니다.');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    return [
        {
            id: 1,
            title: "두통 및 발열 증상 문진",
            createdAt: "2024-08-21"
        },
        {
            id: 2,
            title: "복통 및 소화불량 문진", 
            createdAt: "2024-08-20"
        },
        {
            id: 3,
            title: "기침 및 목아픔 문진",
            createdAt: "2024-08-19"
        }
    ];
};