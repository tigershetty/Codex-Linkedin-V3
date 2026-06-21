import {Config} from '@remotion/cli/config';

// Use the Chrome we already have (puppeteer's Chrome-for-Testing) so Remotion
// does NOT try to download its own headless shell from a blocked CDN.
const chrome = process.env.CHROME_PATH;
if (chrome) {
  Config.setBrowserExecutable(chrome);
}
Config.setVideoImageFormat('jpeg');
Config.setChromiumOpenGlRenderer('angle');
Config.setConcurrency(1);
