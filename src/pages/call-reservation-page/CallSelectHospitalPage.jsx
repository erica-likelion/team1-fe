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
    const [userLocation, setUserLocation] = useState({ lat: 37.2962, lng: 126.8365 }); // 디폴트 위치
    const [mapCenter, setMapCenter] = useState({ lat: 37.2962, lng: 126.8365 });
    const [nearbyHospitals, setNearbyHospitals] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

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
                        onCenterChanged={(center) => setMapCenter(center)}
                        onHospitalSelect={handleHospitalSelect}
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