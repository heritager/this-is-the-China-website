const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const enginePath = path.join(__dirname, '..', 'shared', 'site-engine.js');
const engineCode = fs.readFileSync(enginePath, 'utf8');

const CASES = [
    {
        name: 'google-search',
        site: 'google',
        html: `
            <html>
              <head>
                <title>Google</title>
                <link rel="icon" href="https://www.google.com/favicon.ico">
              </head>
              <body>
                <div class="RNNXgb"><textarea name="q"></textarea></div>
                <img alt="Google" src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png">
              </body>
            </html>
        `,
        checks: async (page) => {
            await expect(page.locator('textarea[name="q"]')).toHaveAttribute('placeholder', '百度一下');
            await expect(page).toHaveTitle('百度一下，你就知道');
        }
    },
    {
        name: 'google-wild-home',
        site: 'google',
        configOverride: { googleBrand: 'wild' },
        html: `
            <html>
              <head>
                <title>Google</title>
              </head>
              <body>
                <div class="RNNXgb"><textarea name="q"></textarea></div>
                <a aria-label="Google"><img alt="Google" src="x.png"></a>
              </body>
            </html>
        `,
        checks: async (page) => {
            await expect(page.locator('textarea[name="q"]')).toHaveAttribute('placeholder', '震惊一下，马上知道');
            await expect(page).toHaveTitle('震惊一下，你就知道');
        }
    },
    {
        name: 'wikipedia-page',
        site: 'wikipedia',
        html: `
            <html>
              <head><title>Example - Wikipedia</title><link rel="icon" href="old.ico"></head>
              <body>
                <a class="mw-logo"></a>
                <div id="siteSub"></div>
                <h1 id="firstHeading">示例词条</h1>
                <input class="vector-search-box-input" placeholder="Search">
              </body>
            </html>
        `,
        checks: async (page) => {
            await expect(page.locator('input.vector-search-box-input')).toHaveAttribute('placeholder', '搜索百度百科');
            await expect(page).toHaveTitle('示例词条 - 百度百科');
            await expect(page.locator('#siteSub')).toHaveText('百度百科，全球领先的中文百科全书');
        }
    },
    {
        name: 'youtube-home-bilibili',
        site: 'youtube',
        configOverride: { youtubeBrand: 'bilibili' },
        html: `
            <html>
              <head><title>YouTube</title></head>
              <body>
                <ytd-topbar-logo-renderer>
                  <a id="logo"><yt-icon></yt-icon><div id="logo-icon"></div></a>
                </ytd-topbar-logo-renderer>
                <input id="search" placeholder="Search">
              </body>
            </html>
        `,
        checks: async (page) => {
            await expect(page.locator('input#search')).toHaveAttribute('placeholder', '搜索哔哩哔哩');
            await expect(page).toHaveTitle('哔哩哔哩 (゜-゜)つロ 干杯~-bilibili');
        }
    },
    {
        name: 'github-home',
        site: 'github',
        html: `
            <html>
              <head><title>GitHub</title><link rel="icon" href="/favicon.ico"></head>
              <body>
                <a class="AppHeader-logo"><svg></svg></a>
                <input aria-label="Search or jump to..." placeholder="Search or jump to...">
              </body>
            </html>
        `,
        checks: async (page) => {
            await expect(page.locator('input[aria-label="Search or jump to..."]')).toHaveAttribute('placeholder', '搜索 Gitee');
            await expect(page).toHaveTitle('Gitee - 基于 Git 的代码托管和研发协作平台');
        }
    },
    {
        name: 'quora-home',
        site: 'quora',
        html: `
            <html>
              <head><title>Quora</title><link rel="icon" href="/favicon.ico"></head>
              <body>
                <a href="/"><svg></svg></a>
                <input type="search" placeholder="Search Quora">
              </body>
            </html>
        `,
        checks: async (page) => {
            await expect(page.locator('input[type="search"]')).toHaveAttribute('placeholder', '搜索你感兴趣的问题');
            await expect(page).toHaveTitle('知乎 - 有问题，就会有答案');
        }
    },
    {
        name: 'ao3-home',
        site: 'ao3',
        html: `
            <html>
              <head><title>Archive of Our Own</title></head>
              <body>
                <div id="header">
                  <h1 class="heading"><a href="/">Archive of Our Own</a></h1>
                </div>
                <input id="site_search" placeholder="Search">
              </body>
            </html>
        `,
        checks: async (page) => {
            await expect(page.locator('#site_search')).toHaveAttribute('placeholder', '搜索乐乎内容');
            await expect(page).toHaveTitle('乐乎 - 让兴趣，更有趣');
            await expect(page.locator('#header .heading a')).toHaveText('乐乎');
        }
    },
    {
        name: 'reddit-sub',
        site: 'reddit',
        path: '/r/javascript/',
        html: `
            <html>
              <head><title>Reddit</title></head>
              <body>
                <div id="reddit-logo"></div>
                <input type="search" placeholder="Search Reddit">
              </body>
            </html>
        `,
        checks: async (page) => {
            await expect(page.locator('input[type="search"]')).toHaveAttribute('placeholder', '全吧搜索：搜索贴吧、帖子或用户');
            await expect(page).toHaveTitle('javascript吧-百度贴吧——全球领先的中文社区');
        }
    }
];

test.beforeEach(async ({ page }) => {
    await page.addInitScript({ content: engineCode });
});

for (const item of CASES) {
    test(item.name, async ({ page }) => {
        await page.setContent(item.html, { waitUntil: 'domcontentloaded' });

        if (item.path) {
            await page.evaluate((nextPath) => {
                history.replaceState({}, '', nextPath);
            }, item.path);
        }

        await page.evaluate(({ site, configOverride }) => {
            window.ChinaWebsiteMaskEngine.run({
                site,
                exposeConfigApi: false,
                forceEnabled: true,
                configOverride: configOverride || null
            });
        }, { site: item.site, configOverride: item.configOverride || null });

        await page.waitForTimeout(220);
        await item.checks(page);

        await expect(page).toHaveScreenshot(`${item.name}.png`, {
            animations: 'disabled',
            caret: 'hide',
            fullPage: true
        });
    });
}
