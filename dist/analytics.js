(() => {
  // src/metrics/measureMetrics/getDomLoad.ts
  var getDomLoad = (navigationEntry) => navigationEntry.domComplete;

  // src/metrics/measureMetrics/getNetworkingEvents.ts
  var getNetworkingEvents = () => {
    const resourceListEntries = performance.getEntriesByType("resource");
    let initiatorTypes = ["css", "script", "link", "img", "subdocument", "other"];
    const resources = [];
    resourceListEntries.forEach((resource) => {
      const {name, initiatorType, duration, transferSize} = resource;
      if (initiatorTypes.indexOf(initiatorType) == -1) {
        return;
      }
      resources.push({
        url: name,
        type: initiatorType,
        duration,
        transferSize
      });
    });
    return resources;
  };

  // src/metrics/measureMetrics/getTTFB.ts
  var getTTFB = (navigationEntry) => {
    return navigationEntry.responseStart - navigationEntry.requestStart;
  };

  // src/metrics/measureMetrics/getFCP.ts
  var getFCP = (performance2) => {
    const firstContentfulPaintEntry = performance2.getEntriesByType("paint")[0];
    return firstContentfulPaintEntry ? firstContentfulPaintEntry.startTime : 0;
  };

  // src/metrics/measureMetrics/getWindowLoad.ts
  var getWindowLoad = (navigationEntry) => navigationEntry.loadEventEnd - navigationEntry.loadEventStart;

  // src/metrics/getMetrics.ts
  var getMetrics = () => {
    const {performance: performance2} = window;
    const navigationEntry = performance2.getEntriesByType("navigation")[0];
    return {
      ttfb: getTTFB(navigationEntry),
      fcp: getFCP(performance2),
      domComplete: getDomLoad(navigationEntry),
      windowLoadEvent: getWindowLoad(navigationEntry),
      resources: getNetworkingEvents()
    };
  };

  // src/metrics/postMetrics.ts
  var postMetrics = async (metrics) => {
    const api = "http://localhost:8080/api/v1/metrics";
    const metricsData = {
      ...metrics,
      user_agent: navigator.userAgent,
      url: window.location.href
    };
    let request = await fetch(`${api}`, {
      method: "post",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(metricsData)
    });
  };

  // src/index.ts
  /*!
   * Analaytics.js
   * Performance Analaytics javascript file. This js collects web vitals & web performance data.
   * https://mayadag.com/
   * 
   * Released under the MIT license
   *
   * Date: 2021-03-27T10:59Z
   */
  var Perfanalytics = () => {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const metrics = getMetrics();
        postMetrics(metrics);
      });
    }, false);
  };
  Perfanalytics();
})();
//# sourceMappingURL=analytics.js.map
