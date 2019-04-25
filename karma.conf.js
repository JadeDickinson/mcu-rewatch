var webpackConfig = require("./webpack.config.js");

process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = function(config) {
    config.set({
        frameworks: ["mocha"],
        files: ['test/**/*.spec.ts'],
        preprocessors: {
            "**/*.spec.ts": ["webpack", "sourcemap"]
        },
        webpack: webpackConfig,
        reporters: ["spec"],
        browsers: ["ChromeHeadless"]
    });
}