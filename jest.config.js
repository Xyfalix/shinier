module.exports = {
  setupFiles: ["./jest.polyfills.js"],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
};
