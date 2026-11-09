# Turnleaf

Read any PDF as a real book. Drag a page corner and the paper curls over, with the sound of a page turning.

Features: page-curl animation, paper sound, rotate, zoom (100 to 300%), full screen in portrait and landscape, reading modes (Day, Lamp, Sepia, Night), blue text option, one or two page layout. Your PDF never leaves your device. The app works offline.

This folder is a complete project. A GitHub workflow turns it into an Android app (APK) for you.

## Get the APK from GitHub (no Android Studio needed)

1. Create a new empty repository on GitHub.
2. Push this folder to it. In a terminal inside this folder:

   ```
   git init
   git add .
   git commit -m "Turnleaf"
   git branch -M main
   git remote add origin https://github.com/YOUR-NAME/turnleaf.git
   git push -u origin main
   ```

   Make sure the hidden `.github` folder is included. It holds the build workflow.
3. Open the repository's **Actions** tab. The **Build Android APK** workflow starts on its own. It takes about 5 to 10 minutes. You can also start it with **Run workflow**.
4. When it finishes, open the run and download **Turnleaf-APK** from the Artifacts section. Unzip it to get `app-debug.apk`.
5. Copy the APK to your phone and open it. Android asks you to allow installs from this source. Allow it once.

The APK is signed with a debug key. That is fine for your own phone. Publishing on Google Play needs a release build signed with your own keystore.

## Try it in a browser first

```
npm install
npm run serve
```

Then open http://localhost:5173.

## Build on your own computer

You need Node 22 or newer, Java 21 and Android Studio.

```
npm install
npm run build:www
npx cap add android
npx capacitor-assets generate --android
npx cap sync android
npx cap open android
```

In Android Studio, press Run to start it on a phone or emulator. After you change `src/index.html`, run `npm run android:sync` to copy it into the Android project.

## Where things are

| Path | What it is |
| --- | --- |
| `src/index.html` | The whole reader: layout, styles and code. Edit this file. |
| `scripts/build-www.js` | Copies the PDF engine, page-turn engine and fonts into the app so it works offline. |
| `capacitor.config.json` | App name (`Turnleaf`) and app id (`app.turnleaf.reader`). Change them here. |
| `assets/` | App icon and splash screen artwork. Replace the PNGs and rebuild to change them. |
| `.github/workflows/build-apk.yml` | The GitHub build. |

## Notes

- iPhone and iPad apps need a Mac with Xcode. Run `npx cap add ios` there.
- Libraries used: PDF.js 3.11.174 (Apache 2.0), StPageFlip 2.0.7 (MIT), fonts Literata and Instrument Sans (SIL Open Font License).
