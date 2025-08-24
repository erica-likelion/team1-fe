/* 병원 전화 예약 페이지 (병원 선택) */

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getHospitalsWithDetails } from "@apis/hospitalApi";
import TextButton from "@components/commons/TextButton";
import TitleBlock from "@components/commons/TitleBlock";
import Map from "@components/callpage/Map";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";
import Search from "@assets/images/green_search.svg";
import Disabled_Search from "@assets/images/white_search.svg";

const CallSelectHospitalPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [selectedHospital, setSelectedHospital] = useState('');
    const [userLocation, setUserLocation] = useState({ lat: 37.2962, lng: 126.8365 }); // ERICA
    const [mapCenter, setMapCenter] = useState({ lat: 37.2962, lng: 126.8365 }); // ERICA
    const [nearbyHospitals, setNearbyHospitals] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);

    // 사용자 위치 가져오기
    const getCurrentLocation = async () => {
        if (!navigator.geolocation) {
            alert(t('call.select.unavailableGeo'));
            setIsLoadingLocation(false);
            return;
        }

        const options = {
            enableHighAccuracy: false, // 빠른 응답을 위해
            timeout: 8000,
            maximumAge: 300000 // 5분간 캐시 사용
        };

        setIsLoadingLocation(true);
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, options);
            });

            const { latitude, longitude } = position.coords;
            const location = { lat: latitude, lng: longitude };
            
            setUserLocation(location);
            setMapCenter(location);
            
        } catch (error) {
            alert(t('call.select.unavailableGeo'));
            console.log('위치 정보를 가져올 수 없습니다:', error);
        } finally {
            setIsLoadingLocation(false);
        }
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const handleReturnToUserLocation = () => {
        if (userLocation) {
            setMapCenter(userLocation);
        }
    };

    // 현재 위치 근처 병원 검색
    const searchNearbyHospitals = async () => {
        setIsSearching(true);
        try {
            const hospitals = await getHospitalsWithDetails(mapCenter.lng, mapCenter.lat, 1000);
            setNearbyHospitals(hospitals);
            //console.log('근처 병원 검색 결과:', hospitals);
        } catch (error) {
            console.error('병원 검색 중 오류 발생:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const canMoveNextStep = selectedHospital !== '';
    
    const handleHospitalSelect = (hospital) => {
        if (hospital === null) {
            // 병원 선택 해제
            setSelectedHospital('');
            //console.log('병원 선택 해제');
        } else {
            // 선택된 병원의 인덱스를 찾아서 설정
            const hospitalIndex = nearbyHospitals.findIndex(h => h.yadmNm === hospital.yadmNm);
            if (hospitalIndex !== -1) {
                setSelectedHospital(hospitalIndex.toString());
                //console.log('지도에서 선택된 병원:', hospital);
            }
        }
    };

    const handleNext = () => {
        if (canMoveNextStep) {
            const hospital = nearbyHospitals[parseInt(selectedHospital)];
            //console.log('선택된 병원:', hospital);
            navigate('/call-reservation/time');
        }
    };

    const relativeStyles = "relative bottom-auto left-auto transform-none translate-x-0 z-auto";

    return (
        <div className="p-5">
            <TitleBlock
                title = {t('call.select.title')}
                subtitle = {t('call.select.description')}
            />

            <div className="mt-6 space-y-3 mb-15">
                <div className="w-full h-auto">
                    <Map 
                        hospitals={nearbyHospitals}
                        center={mapCenter}
                        zoom={13}
                        userLocation={userLocation}
                        onCenterChanged={(center) => setMapCenter(center)}
                        onHospitalSelect={handleHospitalSelect}
                        onReturnToUserLocation={handleReturnToUserLocation}
                        onRequestLocation={getCurrentLocation}
                        isLoadingLocation={isLoadingLocation}
                        className="w-full h-[50vh]"
                    />
                </div>
                <TextButton 
                    text={isSearching ? t('call.buttons.searching') : t('call.buttons.search')}
                    onClick={searchNearbyHospitals}
                    disabled={isSearching}
                    icon={isSearching ? Disabled_Search : Search}
                    className={`${relativeStyles} w-full bg-[#9DEECF]  ${isSearching ? "" : "!text-[#00A270]"}`}
                />
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

export default CallSelectHospitalPage;