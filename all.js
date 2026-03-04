// ==UserScript==
// @name 国际网站伪装为国内网站（增强版）
// @namespace https://github.com/userElaina/this-is-the-China-website
// @version 2026.03.04.03
// @description 中国人就用中国网站（共享引擎版）
// @author userElaina, contributors
// @license MIT
// @match *://*.youtube.com/*
// @match *://*.youtu.be/*
// @match *://*.wikipedia.org/*
// @match *://*.github.com/*
// @match *://*.steampowered.com/*
// @match *://*.steamcommunity.com/*
// @match *://*.twitter.com/*
// @match *://*.x.com/*
// @match *://*.reddit.com/*
// @match *://*.quora.com/*
// @match *://*.archiveofourown.org/*
// @match *://*.google.com/
// @match *://*.google.com/webhp*
// @match *://*.google.com/search*
// @match *://*.google.com/imghp*
// @match *://scholar.google.com/*
// @match *://*.google.com.hk/
// @match *://*.google.com.hk/webhp*
// @match *://*.google.com.hk/search*
// @match *://*.google.com.hk/imghp*
// @match *://scholar.google.com.hk/*
// @match *://*.google.com.tw/
// @match *://*.google.com.tw/webhp*
// @match *://*.google.com.tw/search*
// @match *://*.google.com.tw/imghp*
// @match *://scholar.google.com.tw/*
// @match *://*.google.co.jp/
// @match *://*.google.co.jp/webhp*
// @match *://*.google.co.jp/search*
// @match *://*.google.co.jp/imghp*
// @match *://scholar.google.co.jp/*
// @icon https://raw.githubusercontent.com/userElaina/this-is-the-China-website/refs/heads/main/jing.png
// @require https://raw.githubusercontent.com/userElaina/this-is-the-China-website/main/shared/site-engine.js
// @grant none
// @run-at document-idle
// ==/UserScript==

(function () {
    'use strict';

    if (!window.ChinaWebsiteMaskEngine) {
        return;
    }

    window.ChinaWebsiteMaskEngine.run({
        exposeConfigApi: true
    });
})();
