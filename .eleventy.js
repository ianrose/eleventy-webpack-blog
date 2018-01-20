const { DateTime } = require("luxon");

function dateToISO(str) {
  return DateTime.fromJSDate(str).toISO({ includeOffset: true, suppressMilliseconds: true });
}

module.exports = function(config) {
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
    },
		nunjucksFilters: {
	    lastUpdatedDate: collection => {
	      // Newest date in the collection
	      return dateToISO(collection[ collection.length - 1 ].date);
	    },
	    rssDate: dateObj => {
	      return dateToISO(dateObj);
	    },
      url: url => {
        // If your blog lives in a subdirectory, change this:
        let rootDir = "/";
        if( !url || url === "/" ) {
          return rootDir;
        }
        return rootDir + url;
      }
		}
	};
};