
import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  AdmobConsentStatus,
  BannerAdPosition,
  BannerAdSize,
  BannerAdPluginEvents,
} from '@capacitor-community/admob';

const TEST_BANNER_ID =
  'ca-app-pub-3940256099942544/6300978111';

function showStatus(message) {
  let box = document.getElementById('admob-status');

  if (!box) {
    box = document.createElement('div');
    box.id = 'admob-status';
    box.style.cssText =
      'position:fixed;top:8px;left:8px;right:8px;' +
      'z-index:99999;background:#17302b;color:white;' +
      'padding:10px;border-radius:8px;font-size:13px;' +
      'direction:ltr;text-align:left;overflow-wrap:anywhere;';
    document.body.appendChild(box);
  }

  box.textContent = 'AdMob: ' + message;
}

async function startAdMob() {
  if (!Capacitor.isNativePlatform()) {
    showStatus('Not running as a native Android app');
    return;
  }

  try {
    showStatus('Checking consent...');

    let consent = await AdMob.requestConsentInfo();

    if (
      consent.isConsentFormAvailable &&
      consent.status === AdmobConsentStatus.REQUIRED
    ) {
      consent = await AdMob.showConsentForm();
    }

    if (!consent.canRequestAds) {
      showStatus('Consent does not allow ad requests yet');
      return;
    }

    await AdMob.addListener(
      BannerAdPluginEvents.Loaded,
      () => showStatus('TEST BANNER LOADED')
    );

    await AdMob.addListener(
      BannerAdPluginEvents.FailedToLoad,
      (error) => showStatus(
        'Banner failed: ' + JSON.stringify(error)
      )
    );

    showStatus('Initializing AdMob...');

    await AdMob.initialize();

    showStatus('Requesting test banner...');

    await AdMob.showBanner({
      adId: TEST_BANNER_ID,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.TOP_CENTER,
      margin: 0,
      isTesting: true,
      npa: true,
    });
  } catch (error) {
    showStatus(
      'ERROR: ' + (error?.message || String(error))
    );
  }
}

window.addEventListener('load', () => {
  setTimeout(() => {
    startAdMob();
  }, 1000);
}, { once: true });
