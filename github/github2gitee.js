// ==UserScript==
// @name 码云美化
// @namespace https://github.com/userElaina/this-is-the-China-website
// @version 2026.03.04.02
// @description 中国人就用码云
// @author userElaina
// @license MIT
// @match *://*.github.com/*
// @require https://raw.githubusercontent.com/userElaina/this-is-the-China-website/main/shared/site-engine.js
// @grant none
// ==/UserScript==

(function () {
    'use strict';

    if (!window.ChinaWebsiteMaskEngine) {
        return;
    }

    window.ChinaWebsiteMaskEngine.run({
        site: 'github',
        exposeConfigApi: false,
        forceEnabled: true
    });
})();
