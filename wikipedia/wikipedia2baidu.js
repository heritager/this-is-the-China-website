// ==UserScript==
// @name 百度百科美化
// @namespace https://github.com/userElaina/this-is-the-China-website
// @version 2026.03.04.02
// @description 中国人就用百度百科
// @author userElaina
// @license MIT
// @match *://*.wikipedia.org/*
// @require https://raw.githubusercontent.com/userElaina/this-is-the-China-website/main/shared/site-engine.js
// @grant none
// ==/UserScript==

(function () {
    'use strict';

    if (!window.ChinaWebsiteMaskEngine) {
        return;
    }

    window.ChinaWebsiteMaskEngine.run({
        site: 'wikipedia',
        exposeConfigApi: false,
        forceEnabled: true
    });
})();
