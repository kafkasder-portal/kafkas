import { useCallback, useEffect, useState } from 'react';

const useDeviceDetection = () => {
  // Initialize with safe defaults
  const [deviceInfo, setDeviceInfo] = useState(() => ({
    type: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 1920,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 1080,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    platform: typeof navigator !== 'undefined' ? navigator.platform : '',
    orientation:
      typeof window !== 'undefined'
        ? window.innerWidth > window.innerHeight
          ? 'landscape'
          : 'portrait'
        : 'landscape',
  }));

  const detectDevice = useCallback(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return; // SSR ortamında çalışmayı engelle
    }

    const width = window.innerWidth;
    const userAgent = navigator.userAgent.toLowerCase();

    // User Agent tabanlı mobil cihaz kontrolü
    const isMobileUA =
      /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      );
    const isTabletUA = /ipad|android.*tablet|tablet/i.test(userAgent);

    // Ekran boyutu tabanlı kontroller
    const isMobileScreen = width <= 768;
    const isTabletScreen = width > 768 && width <= 1024;
    const isDesktopScreen = width > 1024;

    // Final cihaz tipi belirleme
    let type = 'desktop';
    let isMobile = false;
    let isTablet = false;
    let isDesktop = true;

    if (isMobileUA || isMobileScreen) {
      type = 'mobile';
      isMobile = true;
      isTablet = false;
      isDesktop = false;
    } else if (isTabletUA || (isTabletScreen && !isMobileUA)) {
      type = 'tablet';
      isMobile = false;
      isTablet = true;
      isDesktop = false;
    } else if (isDesktopScreen && !isMobileUA && !isTabletUA) {
      type = 'desktop';
      isMobile = false;
      isTablet = false;
      isDesktop = true;
    }

    // Yönelim belirleme
    const orientation = width > window.innerHeight ? 'landscape' : 'portrait';

    return {
      type,
      isMobile,
      isTablet,
      isDesktop,
      screenWidth: width,
      screenHeight: typeof window !== 'undefined' ? window.innerHeight : 1080,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      platform: typeof navigator !== 'undefined' ? navigator.platform : '',
      orientation,
      // Ek bilgiler
      browser: getBrowserInfo(),
      os: getOSInfo(),
      touchSupport:
        typeof window !== 'undefined'
          ? 'ontouchstart' in window || navigator.maxTouchPoints > 0
          : false,
    };
  }, []);

  const getBrowserInfo = useCallback(() => {
    if (typeof navigator === 'undefined') return 'Unknown';
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('chrome')) return 'Chrome';
    if (userAgent.includes('firefox')) return 'Firefox';
    if (userAgent.includes('safari') && !userAgent.includes('chrome'))
      return 'Safari';
    if (userAgent.includes('edge')) return 'Edge';
    if (userAgent.includes('opera')) return 'Opera';
    return 'Unknown';
  }, []);

  const getOSInfo = useCallback(() => {
    if (typeof navigator === 'undefined') return 'Unknown';
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('windows')) return 'Windows';
    if (userAgent.includes('mac')) return 'macOS';
    if (userAgent.includes('linux')) return 'Linux';
    if (userAgent.includes('android')) return 'Android';
    if (
      userAgent.includes('ios') ||
      userAgent.includes('iphone') ||
      userAgent.includes('ipad')
    )
      return 'iOS';
    return 'Unknown';
  }, []);

  const handleResize = useCallback(() => {
    setDeviceInfo(detectDevice());
  }, [detectDevice]);

  useEffect(() => {
    // Sadece client-side'da çalıştır
    if (typeof window === 'undefined') return;

    // İlk yükleme
    const initialInfo = detectDevice();
    if (initialInfo) {
      setDeviceInfo(initialInfo);
    }

    // Resize event listener
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [detectDevice, handleResize]);

  return deviceInfo;
};

export default useDeviceDetection;
