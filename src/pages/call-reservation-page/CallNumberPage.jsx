/* 병원 전화 예약 페이지 (병원 선택) */

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSupportedHospitals } from "@hooks/useSupportedHospitals";
import { getHospitalsWithDetails } from "@apis/hospitalApi";
import TextButton from "@components/commons/TextButton";
import TitleBlock from "@components/commons/TitleBlock";
import DropdownRadio from "@components/forms/DropdownRadio";
import Map from "@components/callpage/Map";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";
import SearchIcon from "@assets/images/search.svg";


const CallNumberPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [selectedHospital, setSelectedHospital] = useState('');
    const [userLocation, setUserLocation] = useState({ lat: 37.2962, lng: 126.8365 }); // 디폴트 위치
    const [mapCenter, setMapCenter] = useState({ lat: 37.2962, lng: 126.8365 });
    const [nearbyHospitals, setNearbyHospitals] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const hospitals = useSupportedHospitals();

    // 병원 목록을 드롭다운용으로 변환
    const hospitalItems = hospitals.map((hospital, index) => ({
        key: index.toString(),
        text: hospital.title
    }));

    // 지도용 병원 데이터
    const hospitalData = [
        {
            title: t('hospitals.1.title'),
            description: t('hospitals.1.description'),
            lat: t('hospitals.1.lat'),
            lng: t('hospitals.1.lng'),
            address: t('hospitals.1.address'),
            phone: t('hospitals.1.phone')
        },
        {
            title: t('hospitals.2.title'),
            description: t('hospitals.2.description'),
            lat: t('hospitals.2.lat'),
            lng: t('hospitals.2.lng'),
            address: t('hospitals.2.address'),
            phone: t('hospitals.2.phone')
        },
        {
            title: t('hospitals.3.title'),
            description: t('hospitals.3.description'),
            lat: t('hospitals.3.lat'),
            lng: t('hospitals.3.lng'),
            address: t('hospitals.3.address'),
            phone: t('hospitals.3.phone')
        },
        {
            title: t('hospitals.4.title'),
            description: t('hospitals.4.description'),
            lat: t('hospitals.4.lat'),
            lng: t('hospitals.4.lng'),
            address: t('hospitals.4.address'),
            phone: t('hospitals.4.phone')
        },
        {
            title: t('hospitals.5.title'),
            description: t('hospitals.5.description'),
            lat: t('hospitals.5.lat'),
            lng: t('hospitals.5.lng'),
            address: t('hospitals.5.address'),
            phone: t('hospitals.5.phone')
        }
    ];

    // 사용자 위치 가져오기
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    setMapCenter({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.log('위치 정보를 가져올 수 없습니다:', error);
                    // 디폴트 위치 사용 (이미 설정됨)
                }
            );
        }
    }, []);

    // 현재 위치 근처 병원 검색
    const searchNearbyHospitals = async () => {
        setIsSearching(true);
        try {
            const hospitals = await getHospitalsWithDetails(mapCenter.lng, mapCenter.lat, 1000);
            setNearbyHospitals(hospitals);
            console.log('근처 병원 검색 결과:', hospitals);
        } catch (error) {
            console.error('병원 검색 중 오류 발생:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const canMoveNextStep = selectedHospital !== '';
    
    const handleHospitalChange = (value) => {
        setSelectedHospital(value);
        //console.log('선택된 병원:', hospitals[parseInt(value)]);
    };

    const handleNext = () => {
        if (canMoveNextStep) {
            const hospital = hospitals[parseInt(selectedHospital)];
            //console.log('선택된 병원:', hospital);
            navigate('/call-reservation/time');
        }
    };

    return (
        <div className="p-5">
            <TitleBlock
                title = {t('call.select.title')}
                subtitle = {t('call.select.description')}
            />
            
            <div className="mt-13">
                <DropdownRadio
                    value={selectedHospital}
                    onChange={handleHospitalChange}
                    items={hospitalItems}               
                    placeholder = {t('call.select.placeholder')}
                    className = 'h-14'
                    searchable = {true}
                    searchPlaceholder = {t('call.select.searchPlaceholder')}
                />      
            </div>

            <div className="mt-6">
                <div className="mb-3 flex justify-between items-center">
                    <span className="text-sm text-gray-600">지도에서 병원 위치 확인</span>
                    <button
                        onClick={searchNearbyHospitals}
                        disabled={isSearching}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <img src={SearchIcon} alt="검색" className="w-4 h-4" />
                        {isSearching ? '검색 중...' : '근처 병원 검색'}
                    </button>
                </div>
                <div>Hello</div>
                <div style={{ height: '200px', borderRadius: '8px', overflow: 'hidden' }}>
                    <Map 
                        hospitals={nearbyHospitals.length > 0 ? nearbyHospitals : hospitalData}
                        center={mapCenter}
                        zoom={13}
                        onCenterChanged={(center) => setMapCenter(center)}
                    />
                </div>
            </div>

            <TextButton
                text={t('call.buttons.submit')}
                onClick={handleNext}
                disabled={!canMoveNextStep}
                icon={WhiteChevronRight}
            />
            
        
        </div>
    );
};

export default CallNumberPage;