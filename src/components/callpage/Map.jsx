import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { renderToStaticMarkup } from 'react-dom/server';
import HospitalInfo from '@components/callpage/HospitalInfo';

const Map = ({ hospitals = [], center = { lat: 37.5665, lng: 126.9780 }, zoom = 13, onCenterChanged, onHospitalSelect, className="" }) => {
    const { i18n } = useTranslation();
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markers = useRef([]);
    const currentLanguage = useRef(null);

    // 네이버 지도 API 스크립트 동적 로드 함수
    const loadNaverMapScript = (language) => {
        return new Promise((resolve, reject) => {
            // 기존 스크립트 제거
            const existingScript = document.querySelector('script[src*="oapi.map.naver.com"]');
            if (existingScript) {
                existingScript.remove();
            }

            // window.naver 객체도 제거
            if (window.naver) {
                delete window.naver;
            }

            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_ID}&language=${language}`;
            
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('네이버 지도 API 로드 실패'));
            
            document.head.appendChild(script);
        });
    };

    // 언어 설정 매핑
    const getMapLanguage = (lng) => {
        switch (lng) {
            case 'ko': return 'ko';
            case 'en': return 'en';
            case 'zh-CN': return 'zh';
            default: return 'ko';
        }
    };

    useEffect(() => {
        const initializeMap = async () => {
            const mapLanguage = getMapLanguage(i18n.language);
            
            // 언어가 변경되었거나 처음 로드하는 경우에만 스크립트 재로드
            if (currentLanguage.current !== mapLanguage) {
                try {
                    await loadNaverMapScript(mapLanguage);
                    currentLanguage.current = mapLanguage;
                } catch (error) {
                    console.error('네이버 지도 API 로드 실패:', error);
                    return;
                }
            }

            if (!window.naver) {
                console.error('Naver Maps API가 로드되지 않았습니다.');
                return;
            }

            // 지도 초기화
            const map = new window.naver.maps.Map(mapRef.current, {
                center: new window.naver.maps.LatLng(center.lat, center.lng),
                zoom: zoom,
                minZoom: 9,
                maxZoom: 18
            });

            mapInstance.current = map;

            // 지도 중심점 변경 이벤트 리스너
            if (onCenterChanged) {
                window.naver.maps.Event.addListener(map, 'center_changed', () => {
                    const center = map.getCenter();
                    onCenterChanged({ lat: center.lat(), lng: center.lng() });
                });
            }

            // 병원 마커 추가
            if (hospitals && hospitals.length > 0) {
                addHospitalMarkers(map, hospitals);
            }
        };

        initializeMap();

        return () => {
            // 마커 정리
            markers.current.forEach(marker => {
                marker.setMap(null);
            });
            markers.current = [];
        };
    }, [i18n.language]); // 지도는 한 번만 초기화

    useEffect(() => {
        if (mapInstance.current && hospitals) {
            // 기존 마커 제거
            markers.current.forEach(marker => {
                marker.setMap(null);
            });
            markers.current = [];

            // 새 마커 추가
            addHospitalMarkers(mapInstance.current, hospitals);
        }
    }, [hospitals]);

    const addHospitalMarkers = (map, hospitalList) => {
        hospitalList.forEach((hospital) => {
            // API 데이터의 경우 xPos, yPos 사용, 기본 데이터의 경우 lat, lng 사용
            const lat = hospital.yPos || hospital.lat;
            const lng = hospital.xPos || hospital.lng;
            
            if (!lat || !lng) return;

            const marker = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(lat, lng),
                map: map,
                title: hospital.yadmNm || hospital.title || hospital.name
            });

            // 정보창 내용 생성 (버튼 없이)
            const createInfoContent = (hospital) => {
                const hospitalName = hospital.yadmNm || hospital.title || hospital.name || '병원명 없음';
                const distance = hospital.distance ? `${Math.round(hospital.distance)}m` : '';
                const phone = hospital.telno || hospital.phone || '';
                const clCd = hospital.clCd || '';
                const dgsbjtCds = hospital.dgsbjtCd || [];

                return renderToStaticMarkup(
                    <HospitalInfo 
                        hospitalName={hospitalName}
                        distance={distance}
                        phone={phone}
                        clCd={clCd}
                        dgsbjtCds={dgsbjtCds}
                    />
                );
            };

            // 정보창 추가
            const infoWindow = new window.naver.maps.InfoWindow({
                content: createInfoContent(hospital),
                borderWidth: 1,
                anchorSize: new window.naver.maps.Size(30, 30),
                backgroundColor: '#fff'
            });

            // 마커 클릭 이벤트 - 정보창 표시 + 병원 선택
            window.naver.maps.Event.addListener(marker, 'click', () => {
                // 정보창 토글
                if (infoWindow.getMap()) {
                    infoWindow.close();
                    // 정보창을 닫을 때 병원 선택 해제
                    if (onHospitalSelect) {
                        onHospitalSelect(null);
                    }
                } else {
                    infoWindow.open(map, marker);
                    // 정보창을 열 때 병원 선택
                    if (onHospitalSelect) {
                        onHospitalSelect(hospital);
                    }
                }
            });

            markers.current.push(marker);
        });
    };

    return (
        <div 
            ref={mapRef} 
            className={className}
        />
    );
};

export default Map;