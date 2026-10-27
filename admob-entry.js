
import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  AdmobConsentStatus,
  BannerAdPosition,
  BannerAdSize,
} from '@capacitor-community/admob';

const TEST_BANNER_ID =
  'ca-app-pub-3940256099942544/6300978111';

async function startAdMob() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    let consent = await AdMob.requestConsentInfo();

    if (
      consent.isConsentFormAvailable &&
      consent.status === AdmobConsentStatus.REQUIRED
    ) {
      consent = await AdMob.showConsentForm();
    }

    if (!consent.canRequestAds) {
      console.info('AdMob consent is not ready.');
      return;
    }

    await AdMob.initialize();

    await AdMob.showBanner({
      adId: TEST_BANNER_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true,
      npa: true,
    });
  } catch (error) {
    console.error('AdMob error:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    startAdMob,
    { once: true }
  );
} else {
  void startAdMob();
}
