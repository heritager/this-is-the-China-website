// ==UserScript==
// @name 百度搜索美化
// @namespace https://github.com/userElaina/this-is-the-China-website
// @version 2026.03.04.02
// @description 中国人就用百度搜索
// @author userElaina
// @license MIT
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
// @require https://raw.githubusercontent.com/userElaina/this-is-the-China-website/main/shared/site-engine.js
// @grant none
// ==/UserScript==

(function () {
    'use strict';

    if (!window.ChinaWebsiteMaskEngine) {
        return;
    }

    window.ChinaWebsiteMaskEngine.run({
        site: 'google',
        exposeConfigApi: false,
        forceEnabled: true
    });
})();
