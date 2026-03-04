(function (global) {
    'use strict';

    if (global.ChinaWebsiteMaskEngine) {
        return;
    }

    const ENGINE_VERSION = '2026.03.04.03';
    const ASSET_BASE = 'https://raw.githubusercontent.com/userElaina/this-is-the-China-website/main';
    const STORAGE_KEY = '__china_website_mask_config_v2__';

    const DEFAULT_CONFIG = {
        enabled: true,
        youtubeBrand: 'bilibili',
        googleBrand: 'baidu',
        siteEnabled: {
            google: true,
            wikipedia: true,
            youtube: true,
            github: true,
            steam: true,
            twitter: true,
            reddit: true,
            quora: true,
            ao3: true
        }
    };

    const YOUTUBE_BRANDS = {
        bilibili: {
            name: '哔哩哔哩',
            homeTitle: '哔哩哔哩 (゜-゜)つロ 干杯~-bilibili',
            favicon: 'youtube/bilibili.ico',
            logo: 'youtube/bilibili_big.svg',
            placeholder: '搜索哔哩哔哩',
            colorScheme: {
                accent: '#00a1d6',
                background: '#e3f7ff'
            }
        },
        xigua: {
            name: '西瓜视频',
            homeTitle: '西瓜视频 - 高清免费在线视频 - 点亮对生活的好奇心',
            favicon: 'youtube2xigua/xigua.ico',
            logo: 'youtube2xigua/xigua.svg',
            placeholder: '搜索西瓜视频',
            colorScheme: {
                accent: '#ff3d3d',
                background: '#fff1f1'
            }
        }
    };

    const SPA_SITES = new Set(['youtube', 'github', 'twitter', 'reddit', 'wikipedia', 'quora', 'ao3']);
    const DOM_OBSERVED_SITES = new Set(['youtube', 'github', 'twitter', 'reddit', 'wikipedia', 'google', 'quora', 'ao3']);

    function deepMerge(base, patch) {
        const out = Object.assign({}, base);
        Object.keys(patch || {}).forEach((key) => {
            const baseValue = out[key];
            const patchValue = patch[key];
            if (patchValue && typeof patchValue === 'object' && !Array.isArray(patchValue) && baseValue && typeof baseValue === 'object' && !Array.isArray(baseValue)) {
                out[key] = deepMerge(baseValue, patchValue);
            } else {
                out[key] = patchValue;
            }
        });
        return out;
    }

    function loadConfig() {
        let raw = {};
        try {
            raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        } catch (_err) {
            raw = {};
        }

        const merged = deepMerge(DEFAULT_CONFIG, raw);
        merged.youtubeBrand = merged.youtubeBrand === 'xigua' ? 'xigua' : 'bilibili';
        merged.googleBrand = merged.googleBrand === 'wild' ? 'wild' : 'baidu';
        return merged;
    }

    function setConfig(patch) {
        const current = loadConfig();
        const next = deepMerge(current, patch || {});
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
    }

    function resetConfig() {
        localStorage.removeItem(STORAGE_KEY);
        return loadConfig();
    }

    function exposeConfigApi(configRef) {
        global.chinaWebsiteMask = {
            getConfig() {
                return JSON.parse(JSON.stringify(configRef.value));
            },
            setConfig(patch) {
                const next = setConfig(patch);
                configRef.value = next;
                global.location.reload();
            },
            resetConfig() {
                const next = resetConfig();
                configRef.value = next;
                global.location.reload();
            }
        };
    }

    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn, { once: true });
        } else {
            fn();
        }
    }

    function repeat(fn, intervalMs, maxRuns) {
        let runs = 0;
        const timer = setInterval(() => {
            runs += 1;
            safeRun(fn);
            if (runs >= maxRuns) {
                clearInterval(timer);
            }
        }, intervalMs);
        return () => clearInterval(timer);
    }

    function safeRun(fn) {
        try {
            fn();
        } catch (_err) {
            // Site markup is unstable; keep script alive.
        }
    }

    function debounce(fn, delayMs) {
        let timer = null;
        return function debounced() {
            if (timer !== null) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                timer = null;
                safeRun(fn);
            }, delayMs);
        };
    }

    function observeNavigation(callback) {
        let last = location.href;
        const handleMaybeChanged = () => {
            if (location.href !== last) {
                last = location.href;
                callback();
            }
        };

        const patchHistory = (method) => {
            const original = history[method];
            if (typeof original !== 'function') {
                return;
            }
            history[method] = function patchedHistory(...args) {
                const result = original.apply(this, args);
                setTimeout(handleMaybeChanged, 0);
                return result;
            };
        };

        patchHistory('pushState');
        patchHistory('replaceState');
        window.addEventListener('popstate', handleMaybeChanged);
        window.addEventListener('hashchange', handleMaybeChanged);
        document.addEventListener('yt-navigate-finish', handleMaybeChanged);
        document.addEventListener('pjax:end', handleMaybeChanged);
    }

    function observeDom(callback, debounceMs) {
        const root = document.documentElement || document.body;
        if (!root) {
            return;
        }

        const onMutate = debounce(callback, debounceMs);
        const observer = new MutationObserver(() => {
            onMutate();
        });

        observer.observe(root, {
            childList: true,
            subtree: true,
            attributes: false
        });

        return observer;
    }

    function detectSite(hostname) {
        if (/(^|\.)google\./.test(hostname)) return 'google';
        if (/(^|\.)wikipedia\.org$/.test(hostname)) return 'wikipedia';
        if (/(^|\.)(youtube\.com|youtu\.be)$/.test(hostname)) return 'youtube';
        if (/(^|\.)github\.com$/.test(hostname)) return 'github';
        if (/(^|\.)(steampowered\.com|steamcommunity\.com)$/.test(hostname)) return 'steam';
        if (/(^|\.)(twitter\.com|x\.com)$/.test(hostname)) return 'twitter';
        if (/(^|\.)reddit\.com$/.test(hostname)) return 'reddit';
        if (/(^|\.)quora\.com$/.test(hostname)) return 'quora';
        if (/(^|\.)archiveofourown\.org$/.test(hostname)) return 'ao3';
        return '';
    }

    function resolveSite(options) {
        if (options && options.site) {
            return options.site;
        }
        return detectSite(location.hostname);
    }

    function asset(path) {
        if (!path) return '';
        if (/^https?:\/\//.test(path) || /^data:/.test(path)) {
            return path;
        }
        return `${ASSET_BASE}/${path}`;
    }

    function queryParam(name) {
        return new URLSearchParams(location.search).get(name) || '';
    }

    function titleWithoutSuffix(title) {
        return String(title || '')
            .replace(/\s*[-|]\s*YouTube\s*$/i, '')
            .replace(/\s*\/\s*(X|Twitter)\s*$/i, '')
            .replace(/\s*[-|]\s*(X|Twitter)\s*$/i, '')
            .trim();
    }

    function setTitle(title) {
        if (title && document.title !== title) {
            document.title = title;
        }
    }

    function setFavicon(url) {
        if (!document.head) return;
        const finalUrl = asset(url);
        let icon = document.querySelector('link[rel~="icon"]');
        if (!icon) {
            icon = document.createElement('link');
            icon.rel = 'icon';
            document.head.appendChild(icon);
        }
        if (icon.href !== finalUrl) {
            icon.href = finalUrl;
        }
    }

    function upsertStyle(id, cssText) {
        if (!document.head || !id || !cssText) return;
        let style = document.getElementById(id);
        if (!style) {
            style = document.createElement('style');
            style.id = id;
            document.head.appendChild(style);
        }
        if (style.textContent !== cssText) {
            style.textContent = cssText;
        }
    }

    function setPlaceholder(selectors, text) {
        let changed = false;
        selectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((node) => {
                if (node && node.placeholder !== text) {
                    node.placeholder = text;
                    changed = true;
                }
            });
        });
        return changed;
    }

    function replaceImage(selectors, src, options) {
        const finalSrc = asset(src);
        for (const selector of selectors) {
            const node = document.querySelector(selector);
            if (!node || node.tagName !== 'IMG') {
                continue;
            }
            if (node.src !== finalSrc) {
                node.src = finalSrc;
            }
            if (options && options.alt) {
                node.alt = options.alt;
            }
            if (options && options.width) {
                node.width = options.width;
            }
            if (options && options.height) {
                node.height = options.height;
            }
            node.removeAttribute('srcset');
            return true;
        }
        return false;
    }

    function replaceContainerImage(selector, src, options) {
        const container = document.querySelector(selector);
        if (!container) {
            return false;
        }
        if (container.dataset.cwmApplied === '1') {
            return true;
        }
        const img = document.createElement('img');
        img.src = asset(src);
        img.alt = (options && options.alt) || '';
        if (options && options.width) img.width = options.width;
        if (options && options.height) img.height = options.height;
        if (options && options.maxWidth) img.style.maxWidth = options.maxWidth;
        if (options && options.heightStyle) img.style.height = options.heightStyle;
        container.textContent = '';
        container.appendChild(img);
        container.dataset.cwmApplied = '1';
        return true;
    }

    function buildProfiles(config) {
        const ytBrand = YOUTUBE_BRANDS[config.youtubeBrand] || YOUTUBE_BRANDS.bilibili;
        const googleBrand = config.googleBrand === 'wild' ? 'wild' : 'baidu';
        const isWildGoogle = googleBrand === 'wild';

        return {
            google: {
                siteName: 'Google',
                favicon: isWildGoogle ? 'https://www.sogou.com/favicon.ico' : 'google/baidu.ico',
                colorScheme: {
                    accent: isWildGoogle ? '#e67e22' : '#4e6ef2',
                    background: isWildGoogle ? '#fff4e8' : '#4e6ef21f'
                },
                logoUrl: 'google/baidu_big.png',
                repeatIntervalMs: 1400,
                repeatMaxRuns: 60,
                observeNavigation: false,
                observeDom: true,
                styles: ({ profile }) => `
                    .RNNXgb, .o6juZc {
                        border: 0 !important;
                        border-radius: 0 !important;
                        box-shadow: none !important;
                        background: ${profile.colorScheme.background} !important;
                    }

                    .cwm-wild-google-logo {
                        font-size: 42px;
                        font-weight: 800;
                        color: #e67e22;
                        letter-spacing: 2px;
                    }
                `,
                placeholders: [
                    { selectors: ['textarea[name="q"]', 'input[name="q"]'], text: isWildGoogle ? '震惊一下，马上知道' : '百度一下' }
                ],
                title: () => {
                    const isScholar = location.hostname.startsWith('scholar.');
                    const isImages = location.pathname.includes('/imghp') || location.search.includes('tbm=isch');
                    const isSearch = location.pathname.includes('/search');
                    const q = queryParam('q');

                    if (isScholar) return q ? `${q} - ${isWildGoogle ? '震惊学术' : '百度学术'}` : `${isWildGoogle ? '震惊学术' : '百度学术'} - 保持学习的态度`;
                    if (isImages) return q ? `${q} - ${isWildGoogle ? '震惊图片' : '百度图片'}` : `${isWildGoogle ? '震惊图片，发现离谱世界' : '百度图片, 发现多彩世界'}`;
                    if (isSearch) return q ? `${q} - ${isWildGoogle ? '震惊搜索' : '百度搜索'}` : `${isWildGoogle ? '震惊搜索' : '百度搜索'}`;
                    return isWildGoogle ? '震惊一下，你就知道' : '百度一下，你就知道';
                },
                applyCustom: () => {
                    const selectors = [
                        'img[alt="Google"]',
                        'img[alt="Google Images"]',
                        'a[aria-label="Google"] img',
                        'a[aria-label="Google 首页"] img'
                    ];

                    if (isWildGoogle) {
                        const logo = document.querySelector(selectors.join(','));
                        if (logo && logo.parentElement) {
                            logo.style.display = 'none';
                            if (!logo.parentElement.querySelector('.cwm-wild-google-logo')) {
                                const textLogo = document.createElement('span');
                                textLogo.className = 'cwm-wild-google-logo';
                                textLogo.textContent = '震惊搜索';
                                logo.parentElement.appendChild(textLogo);
                            }
                        }
                        return;
                    }

                    replaceImage(selectors, 'google/baidu_big.png', { width: 234, height: 76, alt: '百度' });
                }
            },

            wikipedia: {
                siteName: 'Wikipedia',
                favicon: 'wikipedia/baidu.ico',
                logoUrl: 'wikipedia/baidu_big.png',
                repeatIntervalMs: 1600,
                repeatMaxRuns: 60,
                observeNavigation: true,
                observeDom: true,
                placeholders: [
                    { selectors: ['input.vector-search-box-input', 'input.cdx-text-input__input'], text: '搜索百度百科' }
                ],
                title: () => {
                    const heading = document.querySelector('#firstHeading, .mw-page-title-main, h1');
                    if (heading && heading.textContent) {
                        return `${heading.textContent.trim()} - 百度百科`;
                    }
                    return '百度百科';
                },
                applyCustom: () => {
                    const sub = document.getElementById('siteSub');
                    if (sub && sub.textContent !== '百度百科，全球领先的中文百科全书') {
                        sub.textContent = '百度百科，全球领先的中文百科全书';
                    }
                    replaceContainerImage('a.mw-wiki-logo, a.mw-logo', 'wikipedia/baidu_big.png', {
                        alt: '百度百科',
                        maxWidth: '140px',
                        heightStyle: 'auto'
                    });
                }
            },

            youtube: {
                siteName: 'YouTube',
                favicon: ytBrand.favicon,
                logoUrl: ytBrand.logo,
                colorScheme: ytBrand.colorScheme,
                repeatIntervalMs: 1200,
                repeatMaxRuns: 220,
                observeNavigation: true,
                observeDom: true,
                placeholders: [
                    { selectors: ['input#search', 'input[name="search_query"]', 'input.ytSearchboxComponentInput'], text: ytBrand.placeholder }
                ],
                styles: ({ profile }) => `
                    ytd-topbar-logo-renderer a#logo yt-icon,
                    ytd-topbar-logo-renderer a#logo #logo-icon {
                        opacity: 0 !important;
                    }

                    ytd-topbar-logo-renderer a#logo::before {
                        content: '';
                        display: block;
                        width: 120px;
                        height: 30px;
                        margin-top: 6px;
                        background: url('${asset(profile.logoUrl)}') no-repeat left center / contain;
                    }
                `,
                title: () => {
                    const path = location.pathname;
                    const q = queryParam('search_query');
                    const homeLike = path === '/' || path.startsWith('/feed') || path.startsWith('/@');
                    if (homeLike && !q) {
                        return ytBrand.homeTitle;
                    }
                    const base = titleWithoutSuffix(document.title);
                    return base ? `${base} - ${ytBrand.name}` : document.title;
                }
            },

            github: {
                siteName: 'GitHub',
                favicon: 'github/gitee.ico',
                logoUrl: 'github/gitee_white.svg',
                repeatIntervalMs: 1400,
                repeatMaxRuns: 100,
                observeNavigation: true,
                observeDom: true,
                placeholders: [
                    { selectors: ['input[aria-label="Search or jump to..."]', 'input[placeholder="Search or jump to..."]'], text: '搜索 Gitee' }
                ],
                styles: () => `
                    a.AppHeader-logo svg,
                    a[aria-label="Homepage"] svg {
                        opacity: 0 !important;
                    }

                    a.AppHeader-logo::before,
                    a[aria-label="Homepage"]::before {
                        content: '';
                        display: inline-block;
                        width: 32px;
                        height: 32px;
                        background: url('${asset('github/gitee_white.svg')}') no-repeat center / contain;
                        vertical-align: middle;
                    }

                    [data-color-mode="light"] a.AppHeader-logo::before,
                    [data-color-mode="light"] a[aria-label="Homepage"]::before {
                        background-image: url('${asset('github/gitee_black.svg')}');
                    }
                `,
                title: () => {
                    const t = document.title || '';
                    if (t.trim() === 'GitHub') {
                        return 'Gitee - 基于 Git 的代码托管和研发协作平台';
                    }
                    return t.replace(/GitHub/g, 'Gitee');
                }
            },

            steam: {
                siteName: 'Steam',
                favicon: '',
                logoUrl: 'steam/logo.svg',
                repeatIntervalMs: 1600,
                repeatMaxRuns: 70,
                observeNavigation: false,
                observeDom: true,
                styles: () => `
                    .home_page_gutter_giftcard,
                    .top_promo.ds_no_flags.app_impression_tracked {
                        display: none !important;
                    }
                `,
                title: () => (document.title || '').replace(/Steam/gi, '蒸汽平台'),
                applyCustom: () => {
                    const logo = document.querySelector('#logo_holder img, .logo_holder img, img[src*="steam_logo"]');
                    if (logo) {
                        logo.src = asset('steam/logo.svg');
                    }
                }
            },

            twitter: {
                siteName: 'Twitter',
                favicon: 'https://weibo.com/favicon.ico',
                logoUrl: 'https://weibo.com/favicon.ico',
                repeatIntervalMs: 1200,
                repeatMaxRuns: 220,
                observeNavigation: true,
                observeDom: true,
                placeholders: [
                    { selectors: ['input[data-testid="SearchBox_Search_Input"]', 'input[aria-label*="Search"]'], text: '搜索微博' }
                ],
                styles: ({ profile }) => `
                    a[aria-label="X"] svg,
                    a[aria-label="Twitter"] svg {
                        opacity: 0 !important;
                    }

                    a[aria-label="X"]::before,
                    a[aria-label="Twitter"]::before {
                        content: '';
                        display: block;
                        width: 26px;
                        height: 26px;
                        border-radius: 4px;
                        background: url('${asset(profile.logoUrl)}') no-repeat center / cover;
                    }
                `,
                title: () => {
                    const t = (document.title || '').trim();
                    if (!t || t === 'X' || t === 'Twitter') {
                        return '微博';
                    }
                    const base = titleWithoutSuffix(t);
                    return base ? `${base} - 微博` : '微博';
                }
            },

            reddit: {
                siteName: 'Reddit',
                favicon: 'reddit/baidu.ico',
                logoUrl: 'reddit/teiba_big.png',
                repeatIntervalMs: 1200,
                repeatMaxRuns: 200,
                observeNavigation: true,
                observeDom: true,
                placeholders: [
                    {
                        selectors: [
                            'input[type="search"]',
                            'input[placeholder*="Search Reddit"]',
                            'input[placeholder*="Search"]'
                        ],
                        text: '全吧搜索：搜索贴吧、帖子或用户'
                    }
                ],
                title: () => {
                    const seg = location.pathname.split('/').filter(Boolean);
                    if (seg.length === 0) return '百度贴吧——全球领先的中文社区';
                    if (seg[0] === 'r' && seg[1]) {
                        if (seg.length <= 2) return `${seg[1]}吧-百度贴吧——全球领先的中文社区`;
                        return `${seg[1]}吧 - 百度贴吧`;
                    }
                    if (seg[0] === 'user' && seg[1]) {
                        return `${seg[1]}的贴吧 - 百度贴吧`;
                    }
                    return '百度贴吧——全球领先的中文社区';
                },
                applyCustom: () => {
                    replaceContainerImage('#reddit-logo', 'reddit/teiba_big.png', {
                        alt: '百度贴吧',
                        width: 135,
                        height: 45
                    });
                }
            },

            quora: {
                siteName: 'Quora',
                favicon: 'https://static.zhihu.com/heifetz/favicon.ico',
                logoUrl: 'https://static.zhihu.com/heifetz/favicon.ico',
                colorScheme: {
                    accent: '#1677ff',
                    background: '#eaf3ff'
                },
                repeatIntervalMs: 1200,
                repeatMaxRuns: 200,
                observeNavigation: true,
                observeDom: true,
                placeholders: [
                    {
                        selectors: [
                            'input[type="search"]',
                            'input[placeholder*="Search Quora"]',
                            'input[aria-label*="Search"]'
                        ],
                        text: '搜索你感兴趣的问题'
                    }
                ],
                styles: () => `
                    a[href="/"] svg {
                        opacity: 0 !important;
                    }

                    a[href="/"]::before {
                        content: '知乎';
                        display: inline-block;
                        font-size: 26px;
                        font-weight: 700;
                        color: #1677ff;
                    }
                `,
                title: () => {
                    const home = location.pathname === '/';
                    if (home) {
                        return '知乎 - 有问题，就会有答案';
                    }
                    const base = (document.title || '').replace(/\s*[-|]\s*Quora[\s\S]*$/i, '').trim();
                    return base ? `${base} - 知乎` : '知乎 - 有问题，就会有答案';
                }
            },

            ao3: {
                siteName: 'Archive of Our Own',
                favicon: 'https://www.lofter.com/favicon.ico',
                logoUrl: 'https://www.lofter.com/favicon.ico',
                colorScheme: {
                    accent: '#35b558',
                    background: '#edf9f0'
                },
                repeatIntervalMs: 1300,
                repeatMaxRuns: 200,
                observeNavigation: true,
                observeDom: true,
                placeholders: [
                    {
                        selectors: [
                            '#site_search',
                            'input[name="work_search[query]"]',
                            'input[type="search"]'
                        ],
                        text: '搜索乐乎内容'
                    }
                ],
                styles: () => `
                    #header .heading a {
                        color: #35b558 !important;
                    }
                `,
                title: () => {
                    const t = (document.title || '').trim();
                    const cleaned = t
                        .replace(/\s*[-|]\s*Archive of Our Own[\s\S]*$/i, '')
                        .replace(/\s*[-|]\s*AO3[\s\S]*$/i, '')
                        .trim();
                    return cleaned ? `${cleaned} - 乐乎` : '乐乎 - 让兴趣，更有趣';
                },
                applyCustom: () => {
                    const logo = document.querySelector('#header .heading a, #header h1 a');
                    if (logo && logo.textContent !== '乐乎') {
                        logo.textContent = '乐乎';
                    }
                }
            }
        };
    }

    function applyProfile(site, profile) {
        if (!profile) return;

        if (profile.favicon) {
            setFavicon(profile.favicon);
        }

        if (Array.isArray(profile.placeholders)) {
            profile.placeholders.forEach((rule, index) => {
                setPlaceholder(rule.selectors || [], rule.text || '');
                if (profile.colorScheme && rule.selectors && rule.selectors.length > 0) {
                    const id = `cwm-placeholder-${site}-${index}`;
                    upsertStyle(id, `
                        ${rule.selectors.join(',')} {
                            caret-color: ${profile.colorScheme.accent || '#1677ff'} !important;
                        }
                    `);
                }
            });
        }

        if (typeof profile.styles === 'function') {
            upsertStyle(`cwm-style-${site}`, profile.styles({ profile, site }));
        } else if (typeof profile.styles === 'string') {
            upsertStyle(`cwm-style-${site}`, profile.styles);
        }

        if (profile.logoUrl && site === 'google') {
            replaceImage([
                'img[alt="Google"]',
                'img[alt="Google Images"]',
                'a[aria-label="Google"] img',
                'a[aria-label="Google 首页"] img'
            ], profile.logoUrl, { width: 234, height: 76, alt: '百度' });
        }

        if (typeof profile.title === 'function') {
            setTitle(profile.title());
        }

        if (typeof profile.applyCustom === 'function') {
            profile.applyCustom();
        }
    }

    function run(options) {
        const opts = Object.assign({
            site: '',
            exposeConfigApi: true,
            configOverride: null,
            forceEnabled: false
        }, options || {});

        const configRef = {
            value: opts.configOverride ? deepMerge(loadConfig(), opts.configOverride) : loadConfig()
        };

        if (opts.exposeConfigApi) {
            exposeConfigApi(configRef);
        }

        const site = resolveSite(opts);
        if (!site) {
            return { ok: false, reason: 'site_not_matched' };
        }

        if (!opts.forceEnabled) {
            if (!configRef.value.enabled) {
                return { ok: false, reason: 'globally_disabled' };
            }
            if (!configRef.value.siteEnabled[site]) {
                return { ok: false, reason: 'site_disabled' };
            }
        }

        const profiles = buildProfiles(configRef.value);
        const profile = profiles[site];
        if (!profile) {
            return { ok: false, reason: 'profile_not_found' };
        }

        const applyNow = () => applyProfile(site, profile);

        onReady(() => {
            safeRun(applyNow);

            repeat(
                applyNow,
                profile.repeatIntervalMs || 1400,
                profile.repeatMaxRuns || 80
            );

            if (profile.observeNavigation || SPA_SITES.has(site)) {
                observeNavigation(applyNow);
            }

            if (profile.observeDom || DOM_OBSERVED_SITES.has(site)) {
                observeDom(applyNow, 140);
            }
        });

        return { ok: true, site, version: ENGINE_VERSION };
    }

    global.ChinaWebsiteMaskEngine = {
        version: ENGINE_VERSION,
        asset,
        detectSite,
        loadConfig,
        setConfig,
        resetConfig,
        buildProfiles,
        run
    };
})(window);
