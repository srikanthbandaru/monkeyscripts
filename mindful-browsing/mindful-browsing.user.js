// ==UserScript==
// @name         Mindful Browsing
// @namespace    https://github.com/srikanthbandaru/monkeyscripts
// @version      1.0
// @description  Simple script to encourage mindful browsing
// @author       srikanthbandaru
// @match        *://*.facebook.com/*
// @match        *://*.youtube.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-start
// ==/UserScript==

(async function () {
  "use strict";

  const SITE_SETTINGS = {
    "facebook.com": {
      storageKey: "fb_active_mins",
      elapsedMins: 0,
      dailyLimitMins: 20,
      intervalMins: 4,
      breathingDuration: 5,
    },
    "youtube.com": {
      storageKey: "yt_active_mins",
      elapsedMins: 0,
      dailyLimitMins: 40,
      intervalMins: 10,
      breathingDuration: 5,
    },
  };

  let timerId = null;
  const currentDate = new Date().toISOString().split("T")[0];
  const currentHost = window.location.hostname;
  const breathingURL =
    "https://srikanthbandaru.github.io/monkeyscripts/mindful-browsing/breathing.html";

  const domainKey = Object.keys(SITE_SETTINGS).find((key) =>
    currentHost.includes(key),
  );
  const siteConfig = domainKey ? SITE_SETTINGS[domainKey] : null;

  if (!siteConfig) {
    console.log("Site not configured for mindful browsing.");
    return;
  }

  const storedDate = await GM.getValue("currentDate");
  //siteConfig.elapsedMins = 0;
  siteConfig.elapsedMins = (await GM.getValue(siteConfig.storageKey)) || 0;

  // daily reset
  if (storedDate !== currentDate) {
    siteConfig.elapsedMins = 0;
    await GM.setValue(siteConfig.storageKey, 0);
    await GM.setValue("currentDate", currentDate);
  }

  function redirectToBreathing({ limitReached }) {
    const returnUrl = encodeURIComponent(window.location.href);
    console.log(
      `Redirecting to: ${breathingURL}?duration=${siteConfig.breathingDuration}&returnUrl=${returnUrl}&limitReached=${limitReached}`,
    );
    window.location.href = `${breathingURL}?duration=${siteConfig.breathingDuration}&returnUrl=${returnUrl}&limitReached=${limitReached}`;
  }

  async function updateTimer() {
    siteConfig.elapsedMins++;
    await GM.setValue(siteConfig.storageKey, siteConfig.elapsedMins);

    console.log(
      `Active time on ${currentHost}:`,
      `${siteConfig.elapsedMins}/${siteConfig.dailyLimitMins} minutes`,
    );

    if (siteConfig.elapsedMins % siteConfig.intervalMins === 0) {
      redirectToBreathing({ limitReached: false });
      return;
    }

    if (siteConfig.elapsedMins >= siteConfig.dailyLimitMins) {
      stopTimer();
      redirectToBreathing({ limitReached: true });
    }
  }

  function startTimer() {
    if (!timerId) {
      timerId = setInterval(updateTimer, 60000);
      console.log(`Timer started for ${currentHost}`);
    }
  }

  function stopTimer() {
    timerId = null;
    console.log(`Timer stopped for ${currentHost}`);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      startTimer();
    } else {
      stopTimer();
    }
  });

  if (document.visibilityState === "visible") {
    startTimer();
  }
})();
