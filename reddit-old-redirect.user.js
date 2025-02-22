// ==UserScript==
// @author       srikanthbandaru
// @name         Reddit Old Redirect
// @description  Redirects to old.reddit.com
// @namespace    https://github.com/srikanthbandaru/monkeyscripts
// @match        https://www.reddit.com/*
// @version      0.1
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Only redirect if we're not already on old.reddit.com
    if (!window.location.hostname.startsWith('old.')) {
        window.location.replace('https://old.reddit.com' + window.location.pathname + window.location.search);
    }
})(); 