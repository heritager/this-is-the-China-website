// ==UserScript==
// @name 知乎美化（Quora）
// @namespace https://github.com/userElaina/this-is-the-China-website
// @version 2026.03.04.03
// @description 中国人就用知乎
// @author userElaina
// @license MIT
// @match *://*.quora.com/*
// @require https://raw.githubusercontent.com/heritager/this-is-the-China-website/main/shared/site-engine.js
// @grant none
// ==/UserScript==

(function () {
    'use strict';

    if (!window.ChinaWebsiteMaskEngine) {
        return;
    }

    window.ChinaWebsiteMaskEngine.run({
        site: 'quora',
        exposeConfigApi: false,
        forceEnabled: true
    });
})();
