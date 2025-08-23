import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const Map = ({ hospitals = [], center = { lat: 37.5665, lng: 126.9780 }, zoom = 13, onCenterChanged }) => {
    const { i18n } = useTranslation();
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markers = useRef([]);

    useEffect(() => {
        if (!window.naver) {
            console.error('Naver Maps API가 로드되지 않았습니다.');
            return;
        }

        // 언어 설정 매핑
        const getMapLanguage = (lng) => {
            switch (lng) {
                case 'ko': return 'ko';
                case 'en': return 'en';
                case 'zh-CN': return 'zh';
                default: return 'ko';
            }
        };

        // 지도 초기화
        const map = new window.naver.maps.Map(mapRef.current, {
            center: new window.naver.maps.LatLng(center.lat, center.lng),
            zoom: zoom,
            minZoom: 9,
            maxZoom: 18,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: window.naver.maps.MapTypeControlStyle.BUTTON,
                position: window.naver.maps.Position.TOP_RIGHT
            },
            zoomControl: true,
            zoomControlOptions: {
                style: window.naver.maps.ZoomControlStyle.SMALL,
                position: window.naver.maps.Position.TOP_LEFT
            }
        });

        // 지도 언어 설정
        if (window.naver.maps.Service) {
            window.naver.maps.Service.setLanguage(getMapLanguage(i18n.language));
        }

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

        return () => {
            // 마커 정리
            markers.current.forEach(marker => {
                marker.setMap(null);
            });
            markers.current = [];
        };
    }, []); // 지도는 한 번만 초기화

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
                    content: `
                        <div style="
                            background: #4CAF50;
                            border: 2px solid white;
                            border-radius: 50%;
                            width: 20px;
                            height: 20px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                        ">
                            <span style="color: white; font-size: 12px; font-weight: bold;">H</span>
                        </div>
                    `,
                    size: new window.naver.maps.Size(24, 24),
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

                return `
                    <div style="padding: 15px; min-width: 250px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        <h4 style="margin: 0 0 8px 0; color: #333; font-size: 16px; font-weight: bold;">${hospitalName}</h4>
                        ${distance ? `<p style="margin: 0 0 5px 0; color: #666; font-size: 12px;">📍 거리: ${distance}</p>` : ''}
                        ${phone ? `<p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">📞 ${phone}</p>` : ''}
                        ${clCd ? `<div style="margin: 8px 0;">
                            <span style="background: #4CAF50; color: white; padding: 4px 8px; border-radius: 4px; font-size: 14px; font-weight: bold;">${clCd}</span>
                        </div>` : ''}
                        ${dgsbjtCds.length > 0 ? `<div style="margin: 8px 0 0 0;">
                            <div style="font-size: 11px; color: #888; margin-bottom: 4px;">진료과목:</div>
                            <div style="display: flex; flex-wrap: wrap; gap: 3px;">
                                ${dgsbjtCds.map(code => `<span style="background: #f0f0f0; color: #666; padding: 2px 6px; border-radius: 3px; font-size: 10px;">${code}</span>`).join('')}
                            </div>
                        </div>` : ''}
                    </div>
                `;
            };

            // 정보창 추가
            const infoWindow = new window.naver.maps.InfoWindow({
                content: createInfoContent(hospital),
                borderWidth: 1,
                anchorSize: new window.naver.maps.Size(30, 30),
                backgroundColor: '#fff'
            });

            // 마커 클릭 이벤트
            window.naver.maps.Event.addListener(marker, 'click', () => {
                if (infoWindow.getMap()) {
                    infoWindow.close();
                } else {
                    infoWindow.open(map, marker);
                }
            });

            markers.current.push(marker);
        });

        // 자동 범위 조정 비활성화 - 사용자가 직접 지도를 조작할 수 있도록 함
    };

    return (
        <div 
            ref={mapRef} 
            style={{ 
                width: '100%', 
                height: '400px',
                border: '1px solid #ddd',
                borderRadius: '8px'
            }}
        />
    );
};

export default Map;