// ==UserScript==
// @name 百度贴吧美化
// @namespace https://github.com/userElaina/this-is-the-China-website
// @version 2026.03.04.02
// @description 中国人就用百度贴吧
// @author userElaina
// @license MIT
// @match *://*.reddit.com/*
// @require https://raw.githubusercontent.com/heritager/this-is-the-China-website/main/shared/site-engine.js
// @grant none
// ==/UserScript==

(function () {
    'use strict';

    if (!window.ChinaWebsiteMaskEngine) {
        return;
    }

    window.ChinaWebsiteMaskEngine.run({
        site: 'reddit',
        exposeConfigApi: false,
        forceEnabled: true
    });
})();
