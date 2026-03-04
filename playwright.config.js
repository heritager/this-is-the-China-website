// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    timeout: 30_000,
    expect: {
        toHaveScreenshot: {
            maxDiffPixelRatio: 0.02
        }
    },
    reporter: [['html', { open: 'never' }], ['list']],
    use: {
        viewport: { width: 1366, height: 900 },
        trace: 'on-first-retry',
        screenshot: 'only-on-failure'
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        }
    ]
});
