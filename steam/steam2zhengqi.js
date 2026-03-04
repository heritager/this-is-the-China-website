// ==UserScript==
// @name 蒸汽平台美化
// @namespace https://github.com/userElaina/this-is-the-China-website
// @version 2026.03.04.02
// @description 中国人就用蒸汽平台
// @author userElaina
// @license MIT
// @match *://*.steampowered.com/*
// @match *://*.steamcommunity.com/*
// @require https://raw.githubusercontent.com/heritager/this-is-the-China-website/main/shared/site-engine.js
// @grant none
// ==/UserScript==

(function () {
    'use strict';

    if (!window.ChinaWebsiteMaskEngine) {
        return;
    }

    window.ChinaWebsiteMaskEngine.run({
        site: 'steam',
        exposeConfigApi: false,
        forceEnabled: true
    });
})();
