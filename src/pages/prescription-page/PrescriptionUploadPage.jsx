import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import ReactCrop, { centerCrop, makeAspectCrop, convertToPixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import TextButton from "@components/commons/TextButton"

import Document from "@assets/images/document.svg";
import Camera from "@assets/images/camera.svg";
import Gallery from "@assets/images/gallery.svg";
import Right from "@assets/images/white_chevron_right.svg";
import Close from "@assets/images/gray_close.svg";

/**
 * 처방전 업로드 페이지 컴포넌트
 * - 드래그 앤 드롭으로 이미지 업로드
 * - 카메라 촬영 기능
 * - 갤러리에서 이미지 선택
 * - 업로드된 이미지 스캔 처리
 */
const PrescriptionUploadPage = () => {
    // 페이지 네비게이션을 위한 훅
    const navigate = useNavigate();
    
    // 다국어 지원을 위한 번역 훅
    const { t } = useTranslation();
    
    // 업로드된 단일 파일 상태
    const [image, setImage] = useState(null);
    
    // 카메라 모드 활성화 여부
    const [isCamera, setIsCamera] = useState(false);
    
    // 카메라의 MediaStream 객체 (실시간 비디오 스트림)
    const [stream, setStream] = useState(null);
    
    // 이미지 미리보기 URL
    const [previewUrl, setPreviewUrl] = useState(null);
    
    // 크롭 모드 활성화 여부
    const [isCropping, setIsCropping] = useState(false);
    
    // 크롭 영역 설정
    const [crop, setCrop] = useState();
    
    // 크롭된 이미지 설정
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    
    // 크롭 이미지 요소 참조
    const imgRef = useRef(null);
    
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
     * - 카메라 스트림 트랙 중지
     * - 미리보기 URL 메모리 해제
     */
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [stream, previewUrl]);

    /**
     * 파일에 대한 미리보기 URL 생성
     * @param {File} file - 미리보기할 파일 객체
     */
    const createPreviewUrl = useCallback((file) => {
        setPreviewUrl(prevUrl => {
            // 기존 미리보기 URL이 있으면 메모리 해제
            if (prevUrl) {
                URL.revokeObjectURL(prevUrl);
            }
            return URL.createObjectURL(file);
        });
    }, []);

    /**
     * 이미지 로드 완료 시 초기 크롭 영역 설정
     */
    const onImageLoad = useCallback((e) => {
        const { width, height } = e.currentTarget;
        const crop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                1/Math.sqrt(2),
                width,
                height
            ),
            width,
            height
        );
        setCrop(crop);
    }, []);

    /**
     * 크롭된 이미지를 Canvas로 생성하여 Blob으로 변환
     */
    const getCroppedImg = useCallback((image, crop) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        const pixelCrop = convertToPixelCrop(
            crop,
            image.naturalWidth,
            image.naturalHeight
        );

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    console.error('Canvas is empty');
                    return;
                }
                const file = new File([blob], `cropped-prescription-${Date.now()}.jpg`, {
                    type: 'image/jpeg',
                });
                resolve(file);
            }, 'image/jpeg', 1);
        });
    }, []);

    /**
     * 크롭 완료 처리
     */
    const handleCropComplete = async () => {
        if (!imgRef.current || !crop) return;

        try {
            const croppedFile = await getCroppedImg(imgRef.current, crop);
            setImage(croppedFile);
            
            // 크롭된 이미지의 미리보기 URL 생성
            const croppedUrl = URL.createObjectURL(croppedFile);
            setCroppedImageUrl(croppedUrl);
            
            setIsCropping(false);
        } catch (error) {
            console.error('Crop failed:', error);
        }
    };

    /**
     * 크롭 취소 처리
     */
    const handleCropCancel = () => {
        setIsCropping(false);
        setCrop(undefined);
    };

    /**
     * 크롭 모드 시작
     */
    const startCropping = () => {
        if (image) {
            setIsCropping(true);
        }
    };

    /**
     * 드롭존에 파일이 드롭되었을 때 실행되는 콜백
     * @param {File[]} acceptedFiles - 허용된 파일들
     * @param {Object[]} rejectedFiles - 거부된 파일들
     */
    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        // 파일 형식이 맞지 않는 경우 에러 알림
        if (rejectedFiles.length > 0) {
            alert(t('prescription.upload.file_type_error'));
            return;
        }
        
        // 유효한 파일이 있는 경우 상태 업데이트
        if (acceptedFiles.length > 0) {
            setImage(acceptedFiles[0]);
            createPreviewUrl(acceptedFiles[0]);
            setCroppedImageUrl(null); // 새 이미지 선택 시 크롭된 이미지 초기화
            setIsCropping(true); // 자동으로 크롭 모드로 전환
        }
    }, [createPreviewUrl]);

    /**
     * react-dropzone 설정
     * - 드래그 앤 드롭 기능
     * - JPEG, PNG 파일만 허용
     * - 단일 파일만 업로드 가능
     */
    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png']
        },
        multiple: false,
        noClick: false,
        noKeyboard: true
    });

    /**
     * 카메라 스트림 시작
     * - 후면 카메라 우선 사용
     * - Full HD 해상도로 설정
     * - 실패 시 파일 선택으로 폴백
     */
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: 'environment' // 후면 카메라 선호
                }
            });
            setStream(mediaStream);
            setIsCamera(true);
        } catch (error) {
            // 카메라 접근 실패시 파일 선택으로 폴백
            handleFallbackFileInput();
        }
    };

    /**
     * 카메라 접근 실패 시 파일 선택 다이얼로그로 폴백
     * - 모바일에서 카메라 촬영 기능 사용
     */
    const handleFallbackFileInput = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment'; // 모바일에서 후면 카메라 촬영
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setImage(file);
                createPreviewUrl(file);
                setCroppedImageUrl(null); // 새 이미지 선택 시 크롭된 이미지 초기화
                setIsCropping(true); // 자동으로 크롭 모드로 전환
            }
        };
        input.click();
    };

    /**
     * 비디오 스트림에서 사진 캡처
     * - 원본 해상도 유지하여 캡처
     * - JPEG 형식으로 저장
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
            setImage(file);
            createPreviewUrl(file);
            setCroppedImageUrl(null); // 새 이미지 선택 시 크롭된 이미지 초기화
            setIsCropping(true); // 자동으로 크롭 모드로 전환
            stopCamera();
        }, 'image/jpeg', 1);
    };

    /**
     * 카메라 스트림 중지 및 리소스 정리
     * - 모든 비디오 트랙 중지
     * - 카메라 모드 해제
     */
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCamera(false);
    };

    /**
     * 카메라 촬영 버튼 클릭 핸들러
     * - 카메라 스트림 시작
     */
    const handleCameraCapture = () => {
        startCamera();
    };

    /**
     * 갤러리 선택 버튼 클릭 핸들러
     * - dropzone의 파일 선택 다이얼로그 열기
     */
    const handleGallerySelect = () => {
        open();
    };

    /**
     * 스캔 버튼 클릭 핸들러
     * - 업로드된 파일을 스캔 페이지로 전달
     * - 현재 언어 설정도 함께 전달
     */
    const handleScan = () => {
        if (!image) {
            alert(t('prescription.upload.no_file_selected'));
            return;
        }
        
        // 스캔 페이지로 이동하며 데이터 전달
        navigate('/prescription/scanning', { 
            state: { 
                image: image
            } 
        });
    };

    // 카메라 모드일 때 렌더링할 JSX
    if (isCamera) {
        return (
            <div className="flex flex-col px-5">
                {/* 카메라 비디오 스트림 영역 */}
                <div className="flex justify-center items-center">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="max-w-[335px] max-h-full h-auto object-contain"
                    />
                </div>
                
                {/* 카메라 제어 버튼들 */}
                <div className="mt-8 space-y-3">
                    <TextButton 
                        text={t('prescription.buttons.capture')} 
                        icon={Camera}
                        className="relative bg-[#3DE0AB] !text-[#00A270]"
                        onClick={capturePhoto}
                    />
                    <TextButton 
                        text={t('prescription.buttons.cancel')} 
                        icon={Close}
                        className="relative bg-gray-300 !text-[#909394]"
                        onClick={stopCamera}
                    />
                </div>
            </div>
        );
    }

    // 크롭 모드일 때 렌더링할 JSX
    if (isCropping) {
        return (
            <div className="flex flex-col px-5 justify-center items-center">
                <div className="text-center mb-6 mt-2">
                    <h2 className="text-2xl font-bold text-[#00A270] mb-2">
                        {t('prescription.crop.title')}
                    </h2>
                    <p className="text-sm text-gray-600 bg-[#3DE0AB]/10 px-4 py-2 rounded-lg border border-[#3DE0AB]/30">
                        {t('prescription.crop.description')}
                    </p>
                </div>
                <div className="flex max-w-[80%] mb-4 bg-black">
                    <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        aspect={undefined}
                        className=""
                    >
                        <img
                            ref={imgRef}
                            src={previewUrl}
                            onLoad={onImageLoad}
                            className="max-w-full object-contain"
                        />
                    </ReactCrop>
                </div>
                
                <div className="mt-8 space-y-3 w-full">
                    <TextButton 
                        text={t('prescription.crop.confirm')} 
                        className="relative bg-[#3DE0AB] !text-[#00A270]"
                        onClick={handleCropComplete}
                    />
                    <TextButton 
                        text={t('prescription.crop.cancel')}
                        className="relative bg-gray-300 !text-[#909394]"
                        onClick={handleCropCancel}
                    />
                </div>
            </div>
        );
    }

    // 일반 업로드 모드일 때 렌더링할 JSX
    return (
        <div className="flex flex-col px-5 pt-3.25 gap-6">
            {/* 드래그 앤 드롭 영역 */}
            <div 
                {...getRootProps()} 
                className={`flex flex-col justify-center items-center gap-3 p-3 w-full h-auto max-h-[500px] min-h-[225px] border-2 border-dashed rounded-[4px] transition-colors ${
                    isDragActive 
                        ? 'bg-[#3DE0AB20] border-[#3DE0AB]' 
                        : image
                        ? 'bg-[#3DE0AB10] border-[#3DE0AB]'
                        : 'bg-[#3DE0AB08] border-[#3DE0AB]'
                }`}
            >
                <input {...getInputProps()} />
                {image ? (
                    /* 파일이 업로드된 상태 */
                    <>
                        <img 
                            src={croppedImageUrl || previewUrl} 
                            alt={t('prescription.upload.uploaded_image_alt')} 
                            className="max-w-full max-h-[400px] object-contain rounded-md"
                        />
                        <p className="text-xs font-medium text-[#00C88D]">
                            {t('prescription.upload.file_uploaded')}
                        </p>
                        <div className="flex gap-2 mt-2">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    startCropping();
                                }}
                                className="text-xs text-blue-500 hover:text-blue-700 underline"
                            >
                                {t('prescription.upload.recrop')}
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setImage(null);
                                    if (previewUrl) {
                                        URL.revokeObjectURL(previewUrl);
                                        setPreviewUrl(null);
                                    }
                                    if (croppedImageUrl) {
                                        URL.revokeObjectURL(croppedImageUrl);
                                        setCroppedImageUrl(null);
                                    }
                                }}
                                className="text-xs text-red-500 hover:text-red-700 underline"
                            >
                                {t('prescription.upload.select_other_image')}
                            </button>
                        </div>
                    </>
                ) : isDragActive ? (
                    /* 드래그 중인 상태 */
                    <>
                        <img src={Document} alt="document" />
                        <p className="text-xs font-normal text-[#00C88D]">
                            {t('prescription.upload.drag_and_drop')}
                        </p>
                        <p className="text-xs font-normal text-[#B3BABD]">
                            {t('prescription.upload.file_format_description')}
                        </p>
                    </>
                ) : (
                    /* 기본 상태 */
                    <>
                        <img src={Document} alt="document" />
                        <p className="text-xs font-normal">
                            {t('prescription.upload.description')}
                        </p>
                        <p className="text-xs font-normal text-[#B3BABD]">
                            {t('prescription.upload.file_format_description')}
                        </p>
                    </>
                )}
            </div>

            {/* "또는" 구분선 */}
            <div className="flex items-center h-11">
                <div className="flex-1 h-px bg-[#A6A9AA]"></div>
                <span className="px-[14px] text-sm text-[#A6A9AA]">{t('prescription.upload.or')}</span>
                <div className="flex-1 h-px bg-[#A6A9AA]"></div>
            </div>

            {/* 카메라/갤러리 선택 버튼들 */}
            <div className="space-y-3 mt-3.25 mb-15.25">
                <TextButton 
                    text={t('prescription.buttons.camera')} 
                    icon={Camera} 
                    className="relative bg-[#9DEECF] !text-[#00A270]"
                    onClick={handleCameraCapture}
                />
                <TextButton 
                    text={t('prescription.buttons.gallery')} 
                    icon={Gallery} 
                    className="relative bg-[#9DEECF] !text-[#00A270]"
                    onClick={handleGallerySelect}
                />
            </div>

            {/* 스캔 시작 버튼 */}
            <TextButton 
                text={t('prescription.buttons.scan')} 
                icon={Right}
                onClick={handleScan}
                disabled={!image}
            />
        </div>
    );
};

export default PrescriptionUploadPage;