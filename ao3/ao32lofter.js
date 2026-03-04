// ==UserScript==
// @name 乐乎美化（AO3）
// @namespace https://github.com/userElaina/this-is-the-China-website
// @version 2026.03.04.03
// @description 中国人就用乐乎
// @author userElaina
// @license MIT
// @match *://*.archiveofourown.org/*
// @require https://raw.githubusercontent.com/heritager/this-is-the-China-website/main/shared/site-engine.js
// @grant none
// ==/UserScript==

(function () {
    'use strict';

    if (!window.ChinaWebsiteMaskEngine) {
        return;
    }

    window.ChinaWebsiteMaskEngine.run({
        site: 'ao3',
        exposeConfigApi: false,
        forceEnabled: true
    });
})();
