const { DateTime } = require("luxon");

function dateToISO(str) {
  return DateTime.fromJSDate(str).toISO({ includeOffset: true, suppressMilliseconds: true });
}

module.exports = function(config) {
  config.addFilter("isoDate", dateObj => { return dateToISO(dateObj) } );
  config.addFilter("stripTrailingSlash", string => {
    return string.charAt(string.length - 1) == '/' ? string.slice(0, -1) : string;
  });

	return {
		templateFormats: [
      "png",
      "md",
      "hbs",
      "html",
      "css",
      "js",
      "json"
    ],
    markdownTemplateEngine: "hbs",
    htmlTemplateEngine: "hbs",
    dataTemplateEngine: "hbs",
    passthroughFileCopy: true,
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
	};
};