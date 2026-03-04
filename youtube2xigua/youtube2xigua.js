// ==UserScript==
// @name 西瓜视频美化
// @namespace https://github.com/userElaina/this-is-the-China-website
// @version 2026.03.04.02
// @description 中国人就用西瓜视频
// @author userElaina
// @license MIT
// @match *://*.youtube.com/*
// @match *://*.youtu.be/*
// @require https://raw.githubusercontent.com/heritager/this-is-the-China-website/main/shared/site-engine.js
// @grant none
// ==/UserScript==

(function () {
    'use strict';

    if (!window.ChinaWebsiteMaskEngine) {
        return;
    }

    window.ChinaWebsiteMaskEngine.run({
        site: 'youtube',
        exposeConfigApi: false,
        forceEnabled: true,
        configOverride: {
            youtubeBrand: 'xigua'
        }
    });
})();
