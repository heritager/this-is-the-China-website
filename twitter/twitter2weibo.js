// ==UserScript==
// @name 微博美化
// @namespace https://github.com/userElaina/this-is-the-China-website
// @version 2026.03.04.02
// @description 中国人就用微博
// @author userElaina
// @license MIT
// @match *://*.twitter.com/*
// @match *://*.x.com/*
// @require https://raw.githubusercontent.com/heritager/this-is-the-China-website/main/shared/site-engine.js
// @grant none
// ==/UserScript==

(function () {
    'use strict';

    if (!window.ChinaWebsiteMaskEngine) {
        return;
    }

    window.ChinaWebsiteMaskEngine.run({
        site: 'twitter',
        exposeConfigApi: false,
        forceEnabled: true
    });
})();
