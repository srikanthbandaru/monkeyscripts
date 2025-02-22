// ==UserScript==
// @author       srikanthbandaru
// @name         Reddit Old Redirect
// @description  Redirects to old.reddit.com
// @namespace    https://github.com/srikanthbandaru/monkeyscripts
// @match        https://www.reddit.com/*
// @version      0.1
// ==/UserScript==

(function() {
    'use strict';

    // Only redirect if we're not already on old.reddit.com
    if (!window.location.hostname.startsWith('old.')) {
        window.location.hostname = 'old.reddit.com';
    }
})(); 