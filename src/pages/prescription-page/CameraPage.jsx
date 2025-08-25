import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef, useCallback } from "react";

import TextButton from "@components/commons/TextButton"

import Camera from "@assets/images/camera.svg";
import Close from "@assets/images/gray_close.svg";

/**
 * 카메라 촬영 전용 페이지 컴포넌트
 * - 후면 카메라 우선 사용
 * - 사진 촬영 및 업로드 페이지로 전달
 */
const CameraPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    // 카메라의 MediaStream 객체 (실시간 비디오 스트림)
    const [stream, setStream] = useState(null);
    
    // 비디오 요소에 대한 참조
    const videoRef = useRef(null);

    /**
     * stream이 변경될 때 비디오 요소에 스트림 연결
     */
    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    /**
     * 컴포넌트 언마운트 시 리소스 정리
     */
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    /**
     * 카메라 스트림 시작
     * - 후면 카메라 우선 사용
     * - Full HD 해상도로 설정
     */
    const startCamera = useCallback(async () => {
        try {
            // 첫 번째 시도: 후면 카메라 강제 사용
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: { exact: 'environment' }
                }
            });
            setStream(mediaStream);
        } catch (error) {
            console.log('후면 카메라 exact 모드 실패, fallback 시도:', error);
            
            try {
                // 두 번째 시도: 후면 카메라 선호
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                        facingMode: 'environment'
                    }
                });
                setStream(mediaStream);
            } catch (fallbackError) {
                console.log('후면 카메라 선호 모드도 실패:', fallbackError);
                
                // 세 번째 시도: 기본 카메라
                try {
                    const mediaStream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            width: { ideal: 1920 },
                            height: { ideal: 1080 }
                        }
                    });
                    setStream(mediaStream);
                } catch (finalError) {
                    console.error('모든 카메라 시도 실패:', finalError);
                    alert('카메라에 접근할 수 없습니다. 권한을 확인해주세요.');
                    navigate(-1); // 이전 페이지로 돌아가기
                }
            }
        }
    }, [navigate]);

    /**
     * 페이지 로드 시 자동으로 카메라 시작
     */
    useEffect(() => {
        startCamera();
    }, [startCamera]);

    /**
     * 비디오 스트림에서 사진 캡처
     */
    const capturePhoto = () => {
        if (!videoRef.current) return;
        
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // 원본 비디오 크기 그대로 캡처 (비율 유지)
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        // Canvas를 Blob으로 변환하여 파일 생성
        canvas.toBlob((blob) => {
            const file = new File([blob], `prescription-${Date.now()}.jpg`, {
                type: 'image/jpeg',
            });
            
            // 카메라 스트림 중지
            stopCamera();
            
            // 촬영한 이미지와 함께 업로드 페이지로 이동
            navigate('/prescription/upload', { 
                state: { 
                    capturedImage: file 
                } 
            });
        }, 'image/jpeg', 1);
    };

    /**
     * 카메라 스트림 중지 및 리소스 정리
     */
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    return (
        <div className="px-5">
            {/* 카메라 비디오 스트림 영역 */}
            <div className="w-full">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="max-w-full w-auto h-auto object-contain"
                />
            </div>
            
            <TextButton 
                icon={Camera}
                className="!w-[70px] !h-[70px] !rounded-full !p-[0px] bg-[#9DEECF] !text-[#00A270] [&>img]:w-[50px] [&>img]:h-[50px]"
                onClick={capturePhoto}
            />
        </div>
    );
};

export default CameraPage;