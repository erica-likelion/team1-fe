import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { renderToStaticMarkup } from 'react-dom/server';
import HospitalInfo from '@components/callpage/HospitalInfo';
import Circle from "@assets/images/circle.svg";


const Map = ({ hospitals = [], center = { lat: 37.3121, lng: 126.8301 }, zoom, userLocation, onCenterChanged, onHospitalSelect, onReturnToUserLocation, onRequestLocation, isLoadingLocation, className="" }) => {
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

    const moveToUserLocation = () => {
        if (!mapInstance.current) return;
        
        // 위치 정보가 없으면 새로 조회 시도
        if (!userLocation) {
            onRequestLocation?.();
            return;
        }
        
        const newCenter = new window.naver.maps.LatLng(userLocation.lat, userLocation.lng);
        mapInstance.current.morph(newCenter); // Naver Map API의 애니메이션 이동 메서드
        
        if (onReturnToUserLocation) {
            onReturnToUserLocation();
        }
        
        if (onCenterChanged) {
            onCenterChanged(userLocation);
        }
    };

    // 지도 초기화 useEffect
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
                minZoom: 10,
                maxZoom: 16,
                mapDataControl: false, // @naver 아이콘
                scaleControl: false, // 척도 아이콘
                logoControl: true, // naver 아이콘 <- 이건 못지움
                logoControlOptions: {
                    position: window.naver.maps.Position.TOP_RIGHT
                }
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
            // 마커 정리 강화
            markers.current.forEach(marker => {
                if (marker) {
                    marker.setMap(null);
                }
            });
            markers.current = [];
            
            // 지도 인스턴스도 정리
            if (mapInstance.current) {
                mapInstance.current = null;
            }
        };
    }, [i18n.language]);

    // 위치 버튼 관리 useEffect
    useEffect(() => {
        if (!mapRef.current || !mapInstance.current) return;

        // 기존 버튼 제거
        const existingButton = mapRef.current.querySelector('[data-location-button]');
        if (existingButton) {
            existingButton.remove();
        }

        // 새 위치 버튼 추가
        const locationButton = document.createElement('button');
        locationButton.setAttribute('data-location-button', 'true');
        locationButton.innerHTML = `<img src=${Circle} alt="circle" className="w-6 h-6" />`;
        locationButton.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 10px;
            width: 44px;
            height: 44px;
            border: none;
            border-radius: 8px;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            cursor: pointer;
            font-size: 18px;
            z-index: 30;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            opacity: ${isLoadingLocation ? '0.5' : '1'};
        `;
        
        locationButton.addEventListener('click', moveToUserLocation);
        locationButton.disabled = isLoadingLocation; // 로딩 중일 때만 비활성화

        mapRef.current.appendChild(locationButton);

        return () => {
            const button = mapRef.current?.querySelector('[data-location-button]');
            if (button) {
                button.remove();
            }
        };
    }, [userLocation, isLoadingLocation]);

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
                title: hospital.yadmNm || hospital.title || hospital.name,
                icon: {
                    content: [
                        '<div style="',
                        'background: #00A270;',
                        'border: 2px solid white;',
                        'border-radius: 50%;',
                        'width: 24px;',
                        'height: 24px;',
                        'display: flex;',
                        'align-items: center;',
                        'justify-content: center;',
                        'box-shadow: 0 2px 4px rgba(0,0,0,0.3);',
                        '">',
                        '<span style="color: white; font-size: 14px; font-weight: bold;">+</span>',
                        '</div>'
                    ].join(''),
                    anchor: new window.naver.maps.Point(12, 12)
                }
            });

            // 정보창 내용 생성
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
                borderWidth: 0,
                backgroundColor: 'transparent',
                anchorSize: new window.naver.maps.Size(20, 15),
                anchorSkew: false,
                anchorColor: '#ffffff',
                pixelOffset: new window.naver.maps.Point(0, -5),
                maxWidth: 280,
                disableAutoPan: false
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