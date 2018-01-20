/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "8c2ad7b4676d513b44f9"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/bundles/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

__webpack_require__(2);

console.log('hello world');

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

// these aren't really private, but nor are they really useful to document

/**
 * @private
 */
var LuxonError = function (_Error) {
  inherits(LuxonError, _Error);

  function LuxonError() {
    classCallCheck(this, LuxonError);
    return possibleConstructorReturn(this, _Error.apply(this, arguments));
  }

  return LuxonError;
}(Error);

/**
 * @private
 */


var InvalidDateTimeError = function (_LuxonError) {
  inherits(InvalidDateTimeError, _LuxonError);

  function InvalidDateTimeError(reason) {
    classCallCheck(this, InvalidDateTimeError);
    return possibleConstructorReturn(this, _LuxonError.call(this, 'Invalid DateTime: ' + reason));
  }

  return InvalidDateTimeError;
}(LuxonError);

/**
 * @private
 */
var InvalidIntervalError = function (_LuxonError2) {
  inherits(InvalidIntervalError, _LuxonError2);

  function InvalidIntervalError(reason) {
    classCallCheck(this, InvalidIntervalError);
    return possibleConstructorReturn(this, _LuxonError2.call(this, 'Invalid Interval: ' + reason));
  }

  return InvalidIntervalError;
}(LuxonError);

/**
 * @private
 */
var InvalidDurationError = function (_LuxonError3) {
  inherits(InvalidDurationError, _LuxonError3);

  function InvalidDurationError(reason) {
    classCallCheck(this, InvalidDurationError);
    return possibleConstructorReturn(this, _LuxonError3.call(this, 'Invalid Duration: ' + reason));
  }

  return InvalidDurationError;
}(LuxonError);

/**
 * @private
 */
var ConflictingSpecificationError = function (_LuxonError4) {
  inherits(ConflictingSpecificationError, _LuxonError4);

  function ConflictingSpecificationError() {
    classCallCheck(this, ConflictingSpecificationError);
    return possibleConstructorReturn(this, _LuxonError4.apply(this, arguments));
  }

  return ConflictingSpecificationError;
}(LuxonError);

/**
 * @private
 */
var InvalidUnitError = function (_LuxonError5) {
  inherits(InvalidUnitError, _LuxonError5);

  function InvalidUnitError(unit) {
    classCallCheck(this, InvalidUnitError);
    return possibleConstructorReturn(this, _LuxonError5.call(this, 'Invalid unit ' + unit));
  }

  return InvalidUnitError;
}(LuxonError);

/**
 * @private
 */
var InvalidArgumentError = function (_LuxonError6) {
  inherits(InvalidArgumentError, _LuxonError6);

  function InvalidArgumentError() {
    classCallCheck(this, InvalidArgumentError);
    return possibleConstructorReturn(this, _LuxonError6.apply(this, arguments));
  }

  return InvalidArgumentError;
}(LuxonError);

/**
 * @private
 */
var ZoneIsAbstractError = function (_LuxonError7) {
  inherits(ZoneIsAbstractError, _LuxonError7);

  function ZoneIsAbstractError() {
    classCallCheck(this, ZoneIsAbstractError);
    return possibleConstructorReturn(this, _LuxonError7.call(this, 'Zone is an abstract class'));
  }

  return ZoneIsAbstractError;
}(LuxonError);

/* eslint no-unused-vars: "off" */
/**
 * @interface
*/
var Zone = function () {
  function Zone() {
    classCallCheck(this, Zone);
  }

  /**
   * Returns the offset's common name (such as EST) at the specified timestamp
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to get the name
   * @param {Object} opts - Options to affect the format
   * @param {string} opts.format - What style of offset to return. Accepts 'long' or 'short'.
   * @param {string} opts.localeCode - What locale to return the offset name in. Defaults to us-en
   * @return {string}
   */
  Zone.offsetName = function offsetName(ts, opts) {
    throw new ZoneIsAbstractError();
  };

  /**
   * Return the offset in minutes for this zone at the specified timestamp.
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to compute the offset
   * @return {number}
   */


  Zone.prototype.offset = function offset(ts) {
    throw new ZoneIsAbstractError();
  };

  /**
   * Return whether this Zone is equal to another zoner
   * @abstract
   * @param {Zone} otherZone - the zone to compare
   * @return {boolean}
   */


  Zone.prototype.equals = function equals(otherZone) {
    throw new ZoneIsAbstractError();
  };

  /**
   * Return whether this Zone is valid.
   * @abstract
   * @return {boolean}
   */


  createClass(Zone, [{
    key: 'type',

    /**
     * The type of zone
     * @abstract
     * @return {string}
     */
    get: function get$$1() {
      throw new ZoneIsAbstractError();
    }

    /**
     * The name of this zone.
     * @abstract
     * @return {string}
     */

  }, {
    key: 'name',
    get: function get$$1() {
      throw new ZoneIsAbstractError();
    }

    /**
     * Returns whether the offset is known to be fixed for the whole year.
     * @abstract
     * @return {boolean}
     */

  }, {
    key: 'universal',
    get: function get$$1() {
      throw new ZoneIsAbstractError();
    }
  }, {
    key: 'isValid',
    get: function get$$1() {
      throw new ZoneIsAbstractError();
    }
  }]);
  return Zone;
}();

var singleton = null;

/**
 * @private
 */

var LocalZone = function (_Zone) {
  inherits(LocalZone, _Zone);

  function LocalZone() {
    classCallCheck(this, LocalZone);
    return possibleConstructorReturn(this, _Zone.apply(this, arguments));
  }

  LocalZone.prototype.offsetName = function offsetName(ts, _ref) {
    var format = _ref.format,
        locale = _ref.locale;

    return Util.parseZoneInfo(ts, format, locale);
  };

  LocalZone.prototype.offset = function offset(ts) {
    return -new Date(ts).getTimezoneOffset();
  };

  LocalZone.prototype.equals = function equals(otherZone) {
    return otherZone.type === 'local';
  };

  createClass(LocalZone, [{
    key: 'type',
    get: function get$$1() {
      return 'local';
    }
  }, {
    key: 'name',
    get: function get$$1() {
      if (Util.hasIntl()) {
        return new Intl.DateTimeFormat().resolvedOptions().timeZone;
      } else return 'local';
    }
  }, {
    key: 'universal',
    get: function get$$1() {
      return false;
    }
  }, {
    key: 'isValid',
    get: function get$$1() {
      return true;
    }
  }], [{
    key: 'instance',
    get: function get$$1() {
      if (singleton === null) {
        singleton = new LocalZone();
      }
      return singleton;
    }
  }]);
  return LocalZone;
}(Zone);

var dtfCache = {};
function makeDTF(zone) {
  if (!dtfCache[zone]) {
    dtfCache[zone] = new Intl.DateTimeFormat('en-US', {
      hour12: false,
      timeZone: zone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
  return dtfCache[zone];
}

var typeToPos = {
  year: 0,
  month: 1,
  day: 2,
  hour: 3,
  minute: 4,
  second: 5
};

function hackyOffset(dtf, date) {
  var formatted = dtf.format(date).replace(/\u200E/g, ''),
      parsed = /(\d+)\/(\d+)\/(\d+),? (\d+):(\d+):(\d+)/.exec(formatted),
      fMonth = parsed[1],
      fDay = parsed[2],
      fYear = parsed[3],
      fHour = parsed[4],
      fMinute = parsed[5],
      fSecond = parsed[6];

  return [fYear, fMonth, fDay, fHour, fMinute, fSecond];
}

function partsOffset(dtf, date) {
  var formatted = dtf.formatToParts(date),
      filled = [];
  for (var i = 0; i < formatted.length; i++) {
    var _formatted$i = formatted[i],
        type = _formatted$i.type,
        value = _formatted$i.value,
        pos = typeToPos[type];


    if (!Util.isUndefined(pos)) {
      filled[pos] = parseInt(value, 10);
    }
  }
  return filled;
}

/**
 * @private
 */

var IANAZone = function (_Zone) {
  inherits(IANAZone, _Zone);

  IANAZone.isValidSpecifier = function isValidSpecifier(s) {
    return s && s.match(/^[a-z_+-]{1,256}\/[a-z_+-]{1,256}$/i);
  };

  IANAZone.isValidZone = function isValidZone(zone) {
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: zone }).format();
      return true;
    } catch (e) {
      return false;
    }
  };

  // Etc/GMT+8 -> 480


  IANAZone.parseGMTOffset = function parseGMTOffset(specifier) {
    if (specifier) {
      var match = specifier.match(/^Etc\/GMT([+-]\d{1,2})$/i);
      if (match) {
        return 60 * parseInt(match[1]);
      }
    }
    return null;
  };

  function IANAZone(name) {
    classCallCheck(this, IANAZone);

    var _this = possibleConstructorReturn(this, _Zone.call(this));

    _this.zoneName = name;
    _this.valid = IANAZone.isValidZone(name);
    return _this;
  }

  IANAZone.prototype.offsetName = function offsetName(ts, _ref) {
    var format = _ref.format,
        locale = _ref.locale;

    return Util.parseZoneInfo(ts, format, locale, this.zoneName);
  };

  IANAZone.prototype.offset = function offset(ts) {
    var date = new Date(ts),
        dtf = makeDTF(this.zoneName),
        _ref2 = dtf.formatToParts ? partsOffset(dtf, date) : hackyOffset(dtf, date),
        fYear = _ref2[0],
        fMonth = _ref2[1],
        fDay = _ref2[2],
        fHour = _ref2[3],
        fMinute = _ref2[4],
        fSecond = _ref2[5],
        asUTC = Date.UTC(fYear, fMonth - 1, fDay, fHour, fMinute, fSecond);

    var asTS = date.valueOf();
    asTS -= asTS % 1000;
    return (asUTC - asTS) / (60 * 1000);
  };

  IANAZone.prototype.equals = function equals(otherZone) {
    return otherZone.type === 'iana' && otherZone.zoneName === this.zoneName;
  };

  createClass(IANAZone, [{
    key: 'type',
    get: function get$$1() {
      return 'iana';
    }
  }, {
    key: 'name',
    get: function get$$1() {
      return this.zoneName;
    }
  }, {
    key: 'universal',
    get: function get$$1() {
      return false;
    }
  }, {
    key: 'isValid',
    get: function get$$1() {
      return this.valid;
    }
  }]);
  return IANAZone;
}(Zone);

var singleton$1 = null;

function hoursMinutesOffset(z) {
  var hours = Math.trunc(z.fixed / 60),
      minutes = Math.abs(z.fixed % 60),
      sign = hours > 0 ? '+' : '-',
      base = sign + Math.abs(hours);
  return minutes > 0 ? base + ':' + Util.padStart(minutes, 2) : base;
}

/**
 * @private
 */

var FixedOffsetZone = function (_Zone) {
  inherits(FixedOffsetZone, _Zone);

  FixedOffsetZone.instance = function instance(offset) {
    return offset === 0 ? FixedOffsetZone.utcInstance : new FixedOffsetZone(offset);
  };

  FixedOffsetZone.parseSpecifier = function parseSpecifier(s) {
    if (s) {
      var r = s.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);
      if (r) {
        return new FixedOffsetZone(Util.signedOffset(r[1], r[2]));
      }
    }
    return null;
  };

  createClass(FixedOffsetZone, null, [{
    key: 'utcInstance',
    get: function get$$1() {
      if (singleton$1 === null) {
        singleton$1 = new FixedOffsetZone(0);
      }
      return singleton$1;
    }
  }]);

  function FixedOffsetZone(offset) {
    classCallCheck(this, FixedOffsetZone);

    var _this = possibleConstructorReturn(this, _Zone.call(this));

    _this.fixed = offset;
    return _this;
  }

  FixedOffsetZone.prototype.offsetName = function offsetName() {
    return this.name;
  };

  FixedOffsetZone.prototype.offset = function offset() {
    return this.fixed;
  };

  FixedOffsetZone.prototype.equals = function equals(otherZone) {
    return otherZone.type === 'fixed' && otherZone.fixed === this.fixed;
  };

  createClass(FixedOffsetZone, [{
    key: 'type',
    get: function get$$1() {
      return 'fixed';
    }
  }, {
    key: 'name',
    get: function get$$1() {
      return this.fixed === 0 ? 'UTC' : 'UTC' + hoursMinutesOffset(this);
    }
  }, {
    key: 'universal',
    get: function get$$1() {
      return true;
    }
  }, {
    key: 'isValid',
    get: function get$$1() {
      return true;
    }
  }]);
  return FixedOffsetZone;
}(Zone);

var singleton$2 = null;

var InvalidZone = function (_Zone) {
  inherits(InvalidZone, _Zone);

  function InvalidZone() {
    classCallCheck(this, InvalidZone);
    return possibleConstructorReturn(this, _Zone.apply(this, arguments));
  }

  InvalidZone.prototype.offsetName = function offsetName() {
    return null;
  };

  InvalidZone.prototype.offset = function offset() {
    return NaN;
  };

  InvalidZone.prototype.equals = function equals() {
    return false;
  };

  createClass(InvalidZone, [{
    key: 'type',
    get: function get$$1() {
      return 'invalid';
    }
  }, {
    key: 'name',
    get: function get$$1() {
      return null;
    }
  }, {
    key: 'universal',
    get: function get$$1() {
      return false;
    }
  }, {
    key: 'isValid',
    get: function get$$1() {
      return false;
    }
  }], [{
    key: 'instance',
    get: function get$$1() {
      if (singleton$2 === null) {
        singleton$2 = new InvalidZone();
      }
      return singleton$2;
    }
  }]);
  return InvalidZone;
}(Zone);

/**
 * @private
 */

var Formats = function Formats() {
  classCallCheck(this, Formats);
};

Formats.DATE_SHORT = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric'
};

Formats.DATE_MED = {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
};

Formats.DATE_FULL = {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

Formats.DATE_HUGE = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long'
};

Formats.TIME_SIMPLE = {
  hour: 'numeric',
  minute: '2-digit'
};

Formats.TIME_WITH_SECONDS = {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit'
};

Formats.TIME_WITH_SHORT_OFFSET = {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'short'
};

Formats.TIME_WITH_LONG_OFFSET = {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'long'
};

Formats.TIME_24_SIMPLE = {
  hour: 'numeric',
  minute: '2-digit',
  hour12: false
};

/**
 * {@link toLocaleString}; format like '09:30:23', always 24-hour.
 */
Formats.TIME_24_WITH_SECONDS = {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
};

/**
 * {@link toLocaleString}; format like '09:30:23 EDT', always 24-hour.
 */
Formats.TIME_24_WITH_SHORT_OFFSET = {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZoneName: 'short'
};

/**
 * {@link toLocaleString}; format like '09:30:23 Eastern Daylight Time', always 24-hour.
 */
Formats.TIME_24_WITH_LONG_OFFSET = {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZoneName: 'long'
};

/**
 * {@link toLocaleString}; format like '10/14/1983, 9:30 AM'. Only 12-hour if the locale is.
 */
Formats.DATETIME_SHORT = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit'
};

/**
 * {@link toLocaleString}; format like '10/14/1983, 9:30:33 AM'. Only 12-hour if the locale is.
 */
Formats.DATETIME_SHORT_WITH_SECONDS = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit'
};

Formats.DATETIME_MED = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit'
};

Formats.DATETIME_MED_WITH_SECONDS = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit'
};

Formats.DATETIME_FULL = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZoneName: 'short'
};

Formats.DATETIME_FULL_WITH_SECONDS = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'short'
};

Formats.DATETIME_HUGE = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
  hour: 'numeric',
  minute: '2-digit',
  timeZoneName: 'long'
};

Formats.DATETIME_HUGE_WITH_SECONDS = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'long'
};

function stringify(obj) {
  return JSON.stringify(obj, Object.keys(obj).sort());
}

/**
 * @private
 */

var English = function () {
  function English() {
    classCallCheck(this, English);
  }

  English.months = function months(length) {
    switch (length) {
      case 'narrow':
        return English.monthsNarrow;
      case 'short':
        return English.monthsShort;
      case 'long':
        return English.monthsLong;
      case 'numeric':
        return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
      case '2-digit':
        return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
      default:
        return null;
    }
  };

  English.weekdays = function weekdays(length) {
    switch (length) {
      case 'narrow':
        return English.weekdaysNarrow;
      case 'short':
        return English.weekdaysShort;
      case 'long':
        return English.weekdaysLong;
      case 'numeric':
        return ['1', '2', '3', '4', '5', '6', '7'];
      default:
        return null;
    }
  };

  English.eras = function eras(length) {
    switch (length) {
      case 'narrow':
        return English.erasNarrow;
      case 'short':
        return English.erasShort;
      case 'long':
        return English.erasLong;
      default:
        return null;
    }
  };

  English.meridiemForDateTime = function meridiemForDateTime(dt) {
    return English.meridiems[dt.hour < 12 ? 0 : 1];
  };

  English.weekdayForDateTime = function weekdayForDateTime(dt, length) {
    return English.weekdays(length)[dt.weekday - 1];
  };

  English.monthForDateTime = function monthForDateTime(dt, length) {
    return English.months(length)[dt.month - 1];
  };

  English.eraForDateTime = function eraForDateTime(dt, length) {
    return English.eras(length)[dt.year < 0 ? 0 : 1];
  };

  English.formatString = function formatString(knownFormat) {
    // these all have the offsets removed because we don't have access to them
    // without all the intl stuff this is backfilling
    var filtered = Util.pick(knownFormat, ['weekday', 'era', 'year', 'month', 'day', 'hour', 'minute', 'second', 'timeZoneName', 'hour12']),
        key = stringify(filtered),
        dateTimeHuge = 'EEEE, LLLL d, yyyy, h:mm a';
    switch (key) {
      case stringify(Formats.DATE_SHORT):
        return 'M/d/yyyy';
      case stringify(Formats.DATE_MED):
        return 'LLL d, yyyy';
      case stringify(Formats.DATE_FULL):
        return 'LLLL d, yyyy';
      case stringify(Formats.DATE_HUGE):
        return 'EEEE, LLLL d, yyyy';
      case stringify(Formats.TIME_SIMPLE):
        return 'h:mm a';
      case stringify(Formats.TIME_WITH_SECONDS):
        return 'h:mm:ss a';
      case stringify(Formats.TIME_WITH_SHORT_OFFSET):
        return 'h:mm a';
      case stringify(Formats.TIME_WITH_LONG_OFFSET):
        return 'h:mm a';
      case stringify(Formats.TIME_24_SIMPLE):
        return 'HH:mm';
      case stringify(Formats.TIME_24_WITH_SECONDS):
        return 'HH:mm:ss';
      case stringify(Formats.TIME_24_WITH_SHORT_OFFSET):
        return 'HH:mm';
      case stringify(Formats.TIME_24_WITH_LONG_OFFSET):
        return 'HH:mm';
      case stringify(Formats.DATETIME_SHORT):
        return 'M/d/yyyy, h:mm a';
      case stringify(Formats.DATETIME_MED):
        return 'LLL d, yyyy, h:mm a';
      case stringify(Formats.DATETIME_FULL):
        return 'LLLL d, yyyy, h:mm a';
      case stringify(Formats.DATETIME_HUGE):
        return dateTimeHuge;
      case stringify(Formats.DATETIME_SHORT_WITH_SECONDS):
        return 'M/d/yyyy, h:mm:ss a';
      case stringify(Formats.DATETIME_MED_WITH_SECONDS):
        return 'LLL d, yyyy, h:mm:ss a';
      case stringify(Formats.DATETIME_FULL_WITH_SECONDS):
        return 'LLLL d, yyyy, h:mm:ss a';
      case stringify(Formats.DATETIME_HUGE_WITH_SECONDS):
        return 'EEEE, LLLL d, yyyy, h:mm:ss a';
      default:
        return dateTimeHuge;
    }
  };

  createClass(English, null, [{
    key: 'monthsLong',
    get: function get$$1() {
      return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    }
  }, {
    key: 'monthsShort',
    get: function get$$1() {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
  }, {
    key: 'monthsNarrow',
    get: function get$$1() {
      return ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    }
  }, {
    key: 'weekdaysLong',
    get: function get$$1() {
      return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    }
  }, {
    key: 'weekdaysShort',
    get: function get$$1() {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }
  }, {
    key: 'weekdaysNarrow',
    get: function get$$1() {
      return ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    }
  }, {
    key: 'meridiems',
    get: function get$$1() {
      return ['AM', 'PM'];
    }
  }, {
    key: 'erasLong',
    get: function get$$1() {
      return ['Before Christ', 'Anno Domini'];
    }
  }, {
    key: 'erasShort',
    get: function get$$1() {
      return ['BC', 'AD'];
    }
  }, {
    key: 'erasNarrow',
    get: function get$$1() {
      return ['B', 'A'];
    }
  }]);
  return English;
}();

function stringifyTokens(splits, tokenToString) {
  var s = '';
  for (var _iterator = splits, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var token = _ref;

    if (token.literal) {
      s += token.val;
    } else {
      s += tokenToString(token.val);
    }
  }
  return s;
}

var tokenToObject = {
  D: Formats.DATE_SHORT,
  DD: Formats.DATE_MED,
  DDD: Formats.DATE_FULL,
  DDDD: Formats.DATE_HUGE,
  t: Formats.TIME_SIMPLE,
  tt: Formats.TIME_WITH_SECONDS,
  ttt: Formats.TIME_WITH_SHORT_OFFSET,
  tttt: Formats.TIME_WITH_LONG_OFFSET,
  T: Formats.TIME_24_SIMPLE,
  TT: Formats.TIME_24_WITH_SECONDS,
  TTT: Formats.TIME_24_WITH_SHORT_OFFSET,
  TTTT: Formats.TIME_24_WITH_LONG_OFFSET,
  f: Formats.DATETIME_SHORT,
  ff: Formats.DATETIME_MED,
  fff: Formats.DATETIME_FULL,
  ffff: Formats.DATETIME_HUGE,
  F: Formats.DATETIME_SHORT_WITH_SECONDS,
  FF: Formats.DATETIME_MED_WITH_SECONDS,
  FFF: Formats.DATETIME_FULL_WITH_SECONDS,
  FFFF: Formats.DATETIME_HUGE_WITH_SECONDS
};

/**
 * @private
 */

var Formatter = function () {
  Formatter.create = function create(locale) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var formatOpts = Object.assign({}, { round: true }, opts);
    return new Formatter(locale, formatOpts);
  };

  Formatter.parseFormat = function parseFormat(fmt) {
    var current = null,
        currentFull = '',
        bracketed = false;
    var splits = [];
    for (var i = 0; i < fmt.length; i++) {
      var c = fmt.charAt(i);
      if (c === "'") {
        if (currentFull.length > 0) {
          splits.push({ literal: bracketed, val: currentFull });
        }
        current = null;
        currentFull = '';
        bracketed = !bracketed;
      } else if (bracketed) {
        currentFull += c;
      } else if (c === current) {
        currentFull += c;
      } else {
        if (currentFull.length > 0) {
          splits.push({ literal: false, val: currentFull });
        }
        currentFull = c;
        current = c;
      }
    }

    if (currentFull.length > 0) {
      splits.push({ literal: bracketed, val: currentFull });
    }

    return splits;
  };

  function Formatter(locale, formatOpts) {
    classCallCheck(this, Formatter);

    this.opts = formatOpts;
    this.loc = locale;
    this.systemLoc = null;
  }

  Formatter.prototype.formatWithSystemDefault = function formatWithSystemDefault(dt, opts) {
    if (this.systemLoc === null) {
      this.systemLoc = this.loc.redefaultToSystem();
    }
    var df = this.systemLoc.dtFormatter(dt, Object.assign({}, this.opts, opts));
    return df.format();
  };

  Formatter.prototype.formatDateTime = function formatDateTime(dt) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var df = this.loc.dtFormatter(dt, Object.assign({}, this.opts, opts));
    return df.format();
  };

  Formatter.prototype.formatDateTimeParts = function formatDateTimeParts(dt) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var df = this.loc.dtFormatter(dt, Object.assign({}, this.opts, opts));
    return df.formatToParts();
  };

  Formatter.prototype.resolvedOptions = function resolvedOptions(dt) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var df = this.loc.dtFormatter(dt, Object.assign({}, this.opts, opts));
    return df.resolvedOptions();
  };

  Formatter.prototype.num = function num(n) {
    var p = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var opts = Object.assign({}, this.opts);

    if (p > 0) {
      opts.padTo = p;
    }

    return this.loc.numberFormatter(opts).format(n);
  };

  Formatter.prototype.formatDateTimeFromString = function formatDateTimeFromString(dt, fmt) {
    var _this = this;

    var knownEnglish = this.loc.listingMode() === 'en';
    var string = function string(opts, extract) {
      return _this.loc.extract(dt, opts, extract);
    },
        formatOffset = function formatOffset(opts) {
      if (dt.isOffsetFixed && dt.offset === 0 && opts.allowZ) {
        return 'Z';
      }

      var hours = Math.trunc(dt.offset / 60),
          minutes = Math.abs(dt.offset % 60),
          sign = hours >= 0 ? '+' : '-',
          base = '' + sign + Math.abs(hours);

      switch (opts.format) {
        case 'short':
          return '' + sign + _this.num(Math.abs(hours), 2) + ':' + _this.num(minutes, 2);
        case 'narrow':
          return minutes > 0 ? base + ':' + minutes : base;
        case 'techie':
          return '' + sign + _this.num(Math.abs(hours), 2) + _this.num(minutes, 2);
        default:
          throw new RangeError('Value format ' + opts.format + ' is out of range for property format');
      }
    },
        meridiem = function meridiem() {
      return knownEnglish ? English.meridiemForDateTime(dt) : string({ hour: 'numeric', hour12: true }, 'dayperiod');
    },
        month = function month(length, standalone) {
      return knownEnglish ? English.monthForDateTime(dt, length) : string(standalone ? { month: length } : { month: length, day: 'numeric' }, 'month');
    },
        weekday = function weekday(length, standalone) {
      return knownEnglish ? English.weekdayForDateTime(dt, length) : string(standalone ? { weekday: length } : { weekday: length, month: 'long', day: 'numeric' }, 'weekday');
    },
        maybeMacro = function maybeMacro(token) {
      var macro = tokenToObject[token];
      if (macro) {
        return _this.formatWithSystemDefault(dt, macro);
      } else {
        return token;
      }
    },
        era = function era(length) {
      return knownEnglish ? English.eraForDateTime(dt, length) : string({ era: length }, 'era');
    },
        tokenToString = function tokenToString(token) {
      var outputCal = _this.loc.outputCalendar;

      // Where possible: http://cldr.unicode.org/translation/date-time#TOC-Stand-Alone-vs.-Format-Styles
      switch (token) {
        // ms
        case 'S':
          return _this.num(dt.millisecond);
        case 'u':
        // falls through
        case 'SSS':
          return _this.num(dt.millisecond, 3);
        // seconds
        case 's':
          return _this.num(dt.second);
        case 'ss':
          return _this.num(dt.second, 2);
        // minutes
        case 'm':
          return _this.num(dt.minute);
        case 'mm':
          return _this.num(dt.minute, 2);
        // hours
        case 'h':
          return _this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12);
        case 'hh':
          return _this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12, 2);
        case 'H':
          return _this.num(dt.hour);
        case 'HH':
          return _this.num(dt.hour, 2);
        // offset
        case 'Z':
          // like +6
          return formatOffset({ format: 'narrow', allowZ: true });
        case 'ZZ':
          // like +06:00
          return formatOffset({ format: 'short', allowZ: true });
        case 'ZZZ':
          // like +0600
          return formatOffset({ format: 'techie', allowZ: false });
        case 'ZZZZ':
          // like EST
          return dt.offsetNameShort;
        case 'ZZZZZ':
          // like Eastern Standard Time
          return dt.offsetNameLong;
        // zone
        case 'z':
          // like America/New_York
          return dt.zoneName;
        // meridiems
        case 'a':
          return meridiem();
        // dates
        case 'd':
          return outputCal ? string({ day: 'numeric' }, 'day') : _this.num(dt.day);
        case 'dd':
          return outputCal ? string({ day: '2-digit' }, 'day') : _this.num(dt.day, 2);
        // weekdays - standalone
        case 'c':
          // like 1
          return _this.num(dt.weekday);
        case 'ccc':
          // like 'Tues'
          return weekday('short', true);
        case 'cccc':
          // like 'Tuesday'
          return weekday('long', true);
        case 'ccccc':
          // like 'T'
          return weekday('narrow', true);
        // weekdays - format
        case 'E':
          // like 1
          return _this.num(dt.weekday);
        case 'EEE':
          // like 'Tues'
          return weekday('short', false);
        case 'EEEE':
          // like 'Tuesday'
          return weekday('long', false);
        case 'EEEEE':
          // like 'T'
          return weekday('narrow', false);
        // months - standalone
        case 'L':
          // like 1
          return outputCal ? string({ month: 'numeric', day: 'numeric' }, 'month') : _this.num(dt.month);
        case 'LL':
          // like 01, doesn't seem to work
          return outputCal ? string({ month: '2-digit', day: 'numeric' }, 'month') : _this.num(dt.month, 2);
        case 'LLL':
          // like Jan
          return month('short', true);
        case 'LLLL':
          // like January
          return month('long', true);
        case 'LLLLL':
          // like J
          return month('narrow', true);
        // months - format
        case 'M':
          // like 1
          return outputCal ? string({ month: 'numeric' }, 'month') : _this.num(dt.month);
        case 'MM':
          // like 01
          return outputCal ? string({ month: '2-digit' }, 'month') : _this.num(dt.month, 2);
        case 'MMM':
          // like Jan
          return month('short', false);
        case 'MMMM':
          // like January
          return month('long', false);
        case 'MMMMM':
          // like J
          return month('narrow', false);
        // years
        case 'y':
          // like 2014
          return outputCal ? string({ year: 'numeric' }, 'year') : _this.num(dt.year);
        case 'yy':
          // like 14
          return outputCal ? string({ year: '2-digit' }, 'year') : _this.num(dt.year.toString().slice(-2), 2);
        case 'yyyy':
          // like 0012
          return outputCal ? string({ year: 'numeric' }, 'year') : _this.num(dt.year, 4);
        case 'yyyyyy':
          // like 000012
          return outputCal ? string({ year: 'numeric' }, 'year') : _this.num(dt.year, 6);
        // eras
        case 'G':
          // like AD
          return era('short');
        case 'GG':
          // like Anno Domini
          return era('long');
        case 'GGGGG':
          return era('narrow');
        case 'kk':
          return _this.num(dt.weekYear.toString().slice(-2), 2);
        case 'kkkk':
          return _this.num(dt.weekYear, 4);
        case 'W':
          return _this.num(dt.weekNumber);
        case 'WW':
          return _this.num(dt.weekNumber, 2);
        case 'o':
          return _this.num(dt.ordinal);
        case 'ooo':
          return _this.num(dt.ordinal, 3);
        default:
          return maybeMacro(token);
      }
    };

    return stringifyTokens(Formatter.parseFormat(fmt), tokenToString);
  };

  Formatter.prototype.formatDurationFromString = function formatDurationFromString(dur, fmt) {
    var _this2 = this;

    var tokenToField = function tokenToField(token) {
      switch (token[0]) {
        case 'S':
          return 'millisecond';
        case 's':
          return 'second';
        case 'm':
          return 'minute';
        case 'h':
          return 'hour';
        case 'd':
          return 'day';
        case 'M':
          return 'month';
        case 'y':
          return 'year';
        default:
          return null;
      }
    },
        tokenToString = function tokenToString(lildur) {
      return function (token) {
        var mapped = tokenToField(token);
        if (mapped) {
          return _this2.num(lildur.get(mapped), token.length);
        } else {
          return token;
        }
      };
    },
        tokens = Formatter.parseFormat(fmt),
        realTokens = tokens.reduce(function (found, _ref2) {
      var literal = _ref2.literal,
          val = _ref2.val;
      return literal ? found : found.concat(val);
    }, []),
        collapsed = dur.shiftTo.apply(dur, realTokens.map(tokenToField).filter(function (t) {
      return t;
    }));
    return stringifyTokens(tokens, tokenToString(collapsed));
  };

  return Formatter;
}();

var sysLocaleCache = null;
function systemLocale() {
  if (sysLocaleCache) {
    return sysLocaleCache;
  } else if (Util.hasIntl()) {
    sysLocaleCache = new Intl.DateTimeFormat().resolvedOptions().locale;
    return sysLocaleCache;
  } else {
    sysLocaleCache = 'en-US';
    return sysLocaleCache;
  }
}

function intlConfigString(locale, numberingSystem, outputCalendar) {
  if (Util.hasIntl()) {
    locale = Array.isArray(locale) ? locale : [locale];

    if (outputCalendar || numberingSystem) {
      locale = locale.map(function (l) {
        l += '-u';

        if (outputCalendar) {
          l += '-ca-' + outputCalendar;
        }

        if (numberingSystem) {
          l += '-nu-' + numberingSystem;
        }
        return l;
      });
    }
    return locale;
  } else {
    return [];
  }
}

function mapMonths(f) {
  var ms = [];
  for (var i = 1; i <= 12; i++) {
    var dt = DateTime.utc(2016, i, 1);
    ms.push(f(dt));
  }
  return ms;
}

function mapWeekdays(f) {
  var ms = [];
  for (var i = 1; i <= 7; i++) {
    var dt = DateTime.utc(2016, 11, 13 + i);
    ms.push(f(dt));
  }
  return ms;
}

function listStuff(loc, length, defaultOK, englishFn, intlFn) {
  var mode = loc.listingMode(defaultOK);

  if (mode === 'error') {
    return null;
  } else if (mode === 'en') {
    return englishFn(length);
  } else {
    return intlFn(length);
  }
}

/**
 * @private
 */

var PolyNumberFormatter = function () {
  function PolyNumberFormatter(opts) {
    classCallCheck(this, PolyNumberFormatter);

    this.padTo = opts.padTo || 0;
    this.round = opts.round || false;
  }

  PolyNumberFormatter.prototype.format = function format(i) {
    var maybeRounded = this.round ? Math.round(i) : i;
    return Util.padStart(maybeRounded.toString(), this.padTo);
  };

  return PolyNumberFormatter;
}();

var PolyDateFormatter = function () {
  function PolyDateFormatter(dt, intl, opts) {
    classCallCheck(this, PolyDateFormatter);

    this.opts = opts;
    this.hasIntl = Util.hasIntl();

    var z = void 0;
    if (dt.zone.universal && this.hasIntl) {
      // if we have a fixed-offset zone that isn't actually UTC,
      // (like UTC+8), we need to make do with just displaying
      // the time in UTC; the formatter doesn't know how to handle UTC+8
      this.dt = dt.offset === 0 ? dt : DateTime.fromMillis(dt.ts + dt.offset * 60 * 1000);
      z = 'UTC';
    } else if (dt.zone.type === 'local') {
      this.dt = dt;
    } else {
      this.dt = dt;
      z = dt.zone.name;
    }

    if (this.hasIntl) {
      var realIntlOpts = Object.assign({}, this.opts);
      if (z) {
        realIntlOpts.timeZone = z;
      }
      this.dtf = new Intl.DateTimeFormat(intl, realIntlOpts);
    }
  }

  PolyDateFormatter.prototype.format = function format() {
    if (this.hasIntl) {
      return this.dtf.format(this.dt.toJSDate());
    } else {
      var tokenFormat = English.formatString(this.opts),
          loc = Locale.create('en-US');
      return Formatter.create(loc).formatDateTimeFromString(this.dt, tokenFormat);
    }
  };

  PolyDateFormatter.prototype.formatToParts = function formatToParts() {
    if (this.hasIntl && Util.hasFormatToParts()) {
      return this.dtf.formatToParts(this.dt.toJSDate());
    } else {
      // This is kind of a cop out. We actually could do this for English. However, we couldn't do it for intl strings
      // and IMO it's too weird to have an uncanny valley like that
      return [];
    }
  };

  PolyDateFormatter.prototype.resolvedOptions = function resolvedOptions() {
    if (this.hasIntl) {
      return this.dtf.resolvedOptions();
    } else {
      return {
        locale: 'en-US',
        numberingSystem: 'latn',
        outputCalendar: 'gregory'
      };
    }
  };

  return PolyDateFormatter;
}();

/**
 * @private
 */

var Locale = function () {
  Locale.fromOpts = function fromOpts(opts) {
    return Locale.create(opts.locale, opts.numberingSystem, opts.outputCalendar, opts.defaultToEN);
  };

  Locale.create = function create(locale, numberingSystem, outputCalendar) {
    var defaultToEN = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    var specifiedLocale = locale || Settings.defaultLocale,

    // the system locale is useful for human readable strings but annoying for parsing/formatting known formats
    localeR = specifiedLocale || (defaultToEN ? 'en-US' : systemLocale()),
        numberingSystemR = numberingSystem || Settings.defaultNumberingSystem,
        outputCalendarR = outputCalendar || Settings.defaultOutputCalendar;
    return new Locale(localeR, numberingSystemR, outputCalendarR, specifiedLocale);
  };

  Locale.resetCache = function resetCache() {
    sysLocaleCache = null;
  };

  Locale.fromObject = function fromObject() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        locale = _ref.locale,
        numberingSystem = _ref.numberingSystem,
        outputCalendar = _ref.outputCalendar;

    return Locale.create(locale, numberingSystem, outputCalendar);
  };

  function Locale(locale, numbering, outputCalendar, specifiedLocale) {
    classCallCheck(this, Locale);

    this.locale = locale;
    this.numberingSystem = numbering;
    this.outputCalendar = outputCalendar;
    this.intl = intlConfigString(this.locale, this.numberingSystem, this.outputCalendar);

    this.weekdaysCache = { format: {}, standalone: {} };
    this.monthsCache = { format: {}, standalone: {} };
    this.meridiemCache = null;
    this.eraCache = {};

    this.specifiedLocale = specifiedLocale;
  }

  // todo: cache me


  Locale.prototype.listingMode = function listingMode() {
    var defaultOk = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    var hasIntl = Util.hasIntl(),
        hasFTP = hasIntl && Util.hasFormatToParts(),
        isActuallyEn = this.locale === 'en' || this.locale.toLowerCase() === 'en-us' || hasIntl && Intl.DateTimeFormat(this.intl).resolvedOptions().locale.startsWith('en-us'),
        hasNoWeirdness = (this.numberingSystem === null || this.numberingSystem === 'latn') && (this.outputCalendar === null || this.outputCalendar === 'gregory');

    if (!hasFTP && !(isActuallyEn && hasNoWeirdness) && !defaultOk) {
      return 'error';
    } else if (!hasFTP || isActuallyEn && hasNoWeirdness) {
      return 'en';
    } else {
      return 'intl';
    }
  };

  Locale.prototype.clone = function clone(alts) {
    if (!alts || Object.getOwnPropertyNames(alts).length === 0) {
      return this;
    } else {
      return Locale.create(alts.locale || this.specifiedLocale, alts.numberingSystem || this.numberingSystem, alts.outputCalendar || this.outputCalendar, alts.defaultToEN || false);
    }
  };

  Locale.prototype.redefaultToEN = function redefaultToEN() {
    var alts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return this.clone(Object.assign({}, alts, { defaultToEN: true }));
  };

  Locale.prototype.redefaultToSystem = function redefaultToSystem() {
    var alts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return this.clone(Object.assign({}, alts, { defaultToEN: false }));
  };

  Locale.prototype.months = function months(length) {
    var _this = this;

    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var defaultOK = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    return listStuff(this, length, defaultOK, English.months, function () {
      var intl = format ? { month: length, day: 'numeric' } : { month: length },
          formatStr = format ? 'format' : 'standalone';
      if (!_this.monthsCache[formatStr][length]) {
        _this.monthsCache[formatStr][length] = mapMonths(function (dt) {
          return _this.extract(dt, intl, 'month');
        });
      }
      return _this.monthsCache[formatStr][length];
    });
  };

  Locale.prototype.weekdays = function weekdays(length) {
    var _this2 = this;

    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var defaultOK = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    return listStuff(this, length, defaultOK, English.weekdays, function () {
      var intl = format ? { weekday: length, year: 'numeric', month: 'long', day: 'numeric' } : { weekday: length },
          formatStr = format ? 'format' : 'standalone';
      if (!_this2.weekdaysCache[formatStr][length]) {
        _this2.weekdaysCache[formatStr][length] = mapWeekdays(function (dt) {
          return _this2.extract(dt, intl, 'weekday');
        });
      }
      return _this2.weekdaysCache[formatStr][length];
    });
  };

  Locale.prototype.meridiems = function meridiems() {
    var _this3 = this;

    var defaultOK = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    return listStuff(this, undefined, defaultOK, function () {
      return English.meridiems;
    }, function () {
      // In theory there could be aribitrary day periods. We're gonna assume there are exactly two
      // for AM and PM. This is probably wrong, but it's makes parsing way easier.
      if (!_this3.meridiemCache) {
        var intl = { hour: 'numeric', hour12: true };
        _this3.meridiemCache = [DateTime.utc(2016, 11, 13, 9), DateTime.utc(2016, 11, 13, 19)].map(function (dt) {
          return _this3.extract(dt, intl, 'dayperiod');
        });
      }

      return _this3.meridiemCache;
    });
  };

  Locale.prototype.eras = function eras(length) {
    var _this4 = this;

    var defaultOK = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    return listStuff(this, length, defaultOK, English.eras, function () {
      var intl = { era: length };

      // This is utter bullshit. Different calendars are going to define eras totally differently. What I need is the minimum set of dates
      // to definitely enumerate them.
      if (!_this4.eraCache[length]) {
        _this4.eraCache[length] = [DateTime.utc(-40, 1, 1), DateTime.utc(2017, 1, 1)].map(function (dt) {
          return _this4.extract(dt, intl, 'era');
        });
      }

      return _this4.eraCache[length];
    });
  };

  Locale.prototype.extract = function extract(dt, intlOpts, field) {
    var df = this.dtFormatter(dt, intlOpts),
        results = df.formatToParts(),
        matching = results.find(function (m) {
      return m.type.toLowerCase() === field;
    });

    return matching ? matching.value : null;
  };

  Locale.prototype.numberFormatter = function numberFormatter() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var intlOpts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (Util.hasIntl()) {
      var realIntlOpts = Object.assign({ useGrouping: false }, intlOpts);

      if (opts.padTo > 0) {
        realIntlOpts.minimumIntegerDigits = opts.padTo;
      }

      if (opts.round) {
        realIntlOpts.maximumFractionDigits = 0;
      }

      return new Intl.NumberFormat(this.intl, realIntlOpts);
    } else {
      return new PolyNumberFormatter(opts);
    }
  };

  Locale.prototype.dtFormatter = function dtFormatter(dt) {
    var intlOpts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return new PolyDateFormatter(dt, this.intl, intlOpts);
  };

  Locale.prototype.equals = function equals(other) {
    return this.locale === other.locale && this.numberingSystem === other.numberingSystem && this.outputCalendar === other.outputCalendar;
  };

  return Locale;
}();

var now = function now() {
  return new Date().valueOf();
};
var defaultZone = null;
var defaultLocale = null;
var defaultNumberingSystem = null;
var defaultOutputCalendar = null;
var throwOnInvalid = false;

/**
 * Settings contains static getters and setters that control Luxon's overall behavior. Luxon is a simple library with few options, but the ones it does have live here.
 */
var Settings = function () {
  function Settings() {
    classCallCheck(this, Settings);
  }

  /**
   * Reset Luxon's global caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  Settings.resetCaches = function resetCaches() {
    Locale.resetCache();
  };

  createClass(Settings, null, [{
    key: 'now',

    /**
     * Get the callback for returning the current timestamp.
     * @type {function}
     */
    get: function get$$1() {
      return now;
    }

    /**
     * Set the callback for returning the current timestamp.
     * @type {function}
     */
    ,
    set: function set$$1(n) {
      now = n;
    }

    /**
     * Get the default time zone to create DateTimes in.
     * @type {string}
     */

  }, {
    key: 'defaultZoneName',
    get: function get$$1() {
      return (defaultZone || LocalZone.instance).name;
    }

    /**
     * Set the default time zone to create DateTimes in. Does not affect existing instances.
     * @type {string}
     */
    ,
    set: function set$$1(z) {
      defaultZone = Util.normalizeZone(z);
    }

    /**
     * Get the default time zone object to create DateTimes in. Does not affect existing instances.
     * @type {Zone}
     */

  }, {
    key: 'defaultZone',
    get: function get$$1() {
      return defaultZone || LocalZone.instance;
    }

    /**
     * Get the default locale to create DateTimes with. Does not affect existing instances.
     * @type {string}
     */

  }, {
    key: 'defaultLocale',
    get: function get$$1() {
      return defaultLocale;
    }

    /**
     * Set the default locale to create DateTimes with. Does not affect existing instances.
     * @type {string}
     */
    ,
    set: function set$$1(locale) {
      defaultLocale = locale;
    }

    /**
     * Get the default numbering system to create DateTimes with. Does not affect existing instances.
     * @type {string}
     */

  }, {
    key: 'defaultNumberingSystem',
    get: function get$$1() {
      return defaultNumberingSystem;
    }

    /**
     * Set the default numbering system to create DateTimes with. Does not affect existing instances.
     * @type {string}
     */
    ,
    set: function set$$1(numberingSystem) {
      defaultNumberingSystem = numberingSystem;
    }

    /**
     * Get the default output calendar to create DateTimes with. Does not affect existing instances.
     * @type {string}
     */

  }, {
    key: 'defaultOutputCalendar',
    get: function get$$1() {
      return defaultOutputCalendar;
    }

    /**
     * Set the default output calendar to create DateTimes with. Does not affect existing instances.
     * @type {string}
     */
    ,
    set: function set$$1(outputCalendar) {
      defaultOutputCalendar = outputCalendar;
    }

    /**
     * Get whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
     * @type {Zone}
     */

  }, {
    key: 'throwOnInvalid',
    get: function get$$1() {
      return throwOnInvalid;
    }

    /**
     * Set whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
     * @type {Zone}
     */
    ,
    set: function set$$1(t) {
      throwOnInvalid = t;
    }
  }]);
  return Settings;
}();

/*
  This is just a junk drawer, containing anything used across multiple classes.
  Because Luxon is small(ish), this should stay small and we won't worry about splitting
  it up into, say, parsingUtil.js and basicUtil.js and so on. But they are divided up by feature area.
*/

/**
 * @private
 */

var Util = function () {
  function Util() {
    classCallCheck(this, Util);
  }

  // TYPES

  Util.isUndefined = function isUndefined(o) {
    return typeof o === 'undefined';
  };

  Util.isNumber = function isNumber(o) {
    return typeof o === 'number';
  };

  Util.isString = function isString(o) {
    return typeof o === 'string';
  };

  Util.isDate = function isDate(o) {
    return Object.prototype.toString.call(o) === '[object Date]';
  };

  // OBJECTS AND ARRAYS

  Util.maybeArray = function maybeArray(thing) {
    return Array.isArray(thing) ? thing : [thing];
  };

  Util.bestBy = function bestBy(arr, by, compare) {
    if (arr.length === 0) {
      return undefined;
    }
    return arr.reduce(function (best, next) {
      var pair = [by(next), next];
      if (!best) {
        return pair;
      } else if (compare.apply(null, [best[0], pair[0]]) === best[0]) {
        return best;
      } else {
        return pair;
      }
    }, null)[1];
  };

  Util.pick = function pick(obj, keys) {
    return keys.reduce(function (a, k) {
      a[k] = obj[k];
      return a;
    }, {});
  };

  // NUMBERS AND STRINGS

  Util.numberBetween = function numberBetween(thing, bottom, top) {
    return Util.isNumber(thing) && thing >= bottom && thing <= top;
  };

  Util.padStart = function padStart(input) {
    var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

    return ('0'.repeat(n) + input).slice(-n);
  };

  Util.parseMillis = function parseMillis(fraction) {
    if (fraction) {
      var f = parseFloat('0.' + fraction) * 1000;
      return Math.round(f);
    } else {
      return 0;
    }
  };

  // DATE BASICS

  Util.isLeapYear = function isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  };

  Util.daysInYear = function daysInYear(year) {
    return Util.isLeapYear(year) ? 366 : 365;
  };

  Util.daysInMonth = function daysInMonth(year, month) {
    if (month === 2) {
      return Util.isLeapYear(year) ? 29 : 28;
    } else {
      return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
    }
  };

  Util.untruncateYear = function untruncateYear(year) {
    if (year > 99) {
      return year;
    } else return year > 60 ? 1900 + year : 2000 + year;
  };

  // PARSING

  Util.parseZoneInfo = function parseZoneInfo(ts, offsetFormat, locale) {
    var timeZone = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    var date = new Date(ts),
        intl = {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };

    if (timeZone) {
      intl.timeZone = timeZone;
    }

    var modified = Object.assign({ timeZoneName: offsetFormat }, intl),
        hasIntl = Util.hasIntl();

    if (hasIntl && Util.hasFormatToParts()) {
      var parsed = new Intl.DateTimeFormat(locale, modified).formatToParts(date).find(function (m) {
        return m.type.toLowerCase() === 'timezonename';
      });
      return parsed ? parsed.value : null;
    } else if (hasIntl) {
      // this probably doesn't work for all locales
      var without = new Intl.DateTimeFormat(locale, intl).format(date),
          included = new Intl.DateTimeFormat(locale, modified).format(date),
          diffed = included.substring(without.length),
          trimmed = diffed.replace(/^[, ]+/, '');
      return trimmed;
    } else {
      return null;
    }
  };

  // signedOffset('-5', '30') -> -330


  Util.signedOffset = function signedOffset(offHourStr, offMinuteStr) {
    var offHour = parseInt(offHourStr, 10) || 0,
        offMin = parseInt(offMinuteStr, 10) || 0,
        offMinSigned = offHour < 0 ? -offMin : offMin;
    return offHour * 60 + offMinSigned;
  };

  // COERCION

  Util.friendlyDuration = function friendlyDuration(duration) {
    if (Util.isNumber(duration)) {
      return Duration.fromMillis(duration);
    } else if (duration instanceof Duration) {
      return duration;
    } else if (duration instanceof Object) {
      return Duration.fromObject(duration);
    } else {
      throw new InvalidArgumentError('Unknown duration argument');
    }
  };

  Util.friendlyDateTime = function friendlyDateTime(dateTimeish) {
    if (dateTimeish instanceof DateTime) {
      return dateTimeish;
    } else if (dateTimeish.valueOf && Util.isNumber(dateTimeish.valueOf())) {
      return DateTime.fromJSDate(dateTimeish);
    } else if (dateTimeish instanceof Object) {
      return DateTime.fromObject(dateTimeish);
    } else {
      throw new InvalidArgumentError('Unknown datetime argument');
    }
  };

  Util.normalizeZone = function normalizeZone(input) {
    var offset = void 0;
    if (Util.isUndefined(input) || input === null) {
      return Settings.defaultZone;
    } else if (input instanceof Zone) {
      return input;
    } else if (Util.isString(input)) {
      var lowered = input.toLowerCase();
      if (lowered === 'local') return LocalZone.instance;else if (lowered === 'utc') return FixedOffsetZone.utcInstance;else if ((offset = IANAZone.parseGMTOffset(input)) != null) {
        // handle Etc/GMT-4, which V8 chokes on
        return FixedOffsetZone.instance(offset);
      } else if (IANAZone.isValidSpecifier(lowered)) return new IANAZone(input);else return FixedOffsetZone.parseSpecifier(lowered) || InvalidZone.instance;
    } else if (Util.isNumber(input)) {
      return FixedOffsetZone.instance(input);
    } else if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && input.offset) {
      // This is dumb, but the instanceof check above doesn't seem to really work
      // so we're duck checking it
      return input;
    } else {
      return InvalidZone.instance;
    }
  };

  Util.normalizeObject = function normalizeObject(obj, normalizer) {
    var ignoreUnknown = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var normalized = {};
    for (var u in obj) {
      if (obj.hasOwnProperty(u)) {
        var v = obj[u];
        if (v !== null && !Util.isUndefined(v) && !Number.isNaN(v)) {
          var mapped = normalizer(u, ignoreUnknown);
          if (mapped) {
            normalized[mapped] = v;
          }
        }
      }
    }
    return normalized;
  };

  Util.timeObject = function timeObject(obj) {
    return Util.pick(obj, ['hour', 'minute', 'second', 'millisecond']);
  };

  // CAPABILITIES

  Util.hasIntl = function hasIntl() {
    return typeof Intl !== 'undefined' && Intl.DateTimeFormat;
  };

  Util.hasFormatToParts = function hasFormatToParts() {
    return !Util.isUndefined(Intl.DateTimeFormat.prototype.formatToParts);
  };

  return Util;
}();

/*
This file handles parsing for well-specified formats. Here's how it works:
 * Two things go into parsing: a regex to match with and an extractor to take apart the groups in the match.
 * An extractor is just a function that takes a regex match array and returns a { year: ..., month: ... } object
 * parse() does the work of executing the regex and applying the extractor. It takes multiple regex/extractor pairs to try in sequence.
 * Extractors can take a "cursor" representing the offset in the match to look at. This makes it easy to combine extractors.
 * combineExtractors() does the work of combining them, keeping track of the cursor through multiple extractions.
 * Some extractions are super dumb and simpleParse and fromStrings help DRY them.
*/

function combineRegexes() {
  for (var _len = arguments.length, regexes = Array(_len), _key = 0; _key < _len; _key++) {
    regexes[_key] = arguments[_key];
  }

  var full = regexes.reduce(function (f, r) {
    return f + r.source;
  }, '');
  return RegExp('^' + full + '$');
}

function combineExtractors() {
  for (var _len2 = arguments.length, extractors = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    extractors[_key2] = arguments[_key2];
  }

  return function (m) {
    return extractors.reduce(function (_ref, ex) {
      var mergedVals = _ref[0],
          mergedZone = _ref[1],
          cursor = _ref[2];

      var _ex = ex(m, cursor),
          val = _ex[0],
          zone = _ex[1],
          next = _ex[2];

      return [Object.assign(mergedVals, val), mergedZone || zone, next];
    }, [{}, null, 1]).slice(0, 2);
  };
}

function parse(s) {
  if (s == null) {
    return [null, null];
  }

  for (var _len3 = arguments.length, patterns = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    patterns[_key3 - 1] = arguments[_key3];
  }

  for (var _iterator = patterns, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref3;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref3 = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref3 = _i.value;
    }

    var _ref2 = _ref3;
    var regex = _ref2[0];
    var extractor = _ref2[1];

    var m = regex.exec(s);
    if (m) {
      return extractor(m);
    }
  }
  return [null, null];
}

function simpleParse() {
  for (var _len4 = arguments.length, keys = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    keys[_key4] = arguments[_key4];
  }

  return function (match, cursor) {
    var ret = {};
    var i = void 0;

    for (i = 0; i < keys.length; i++) {
      ret[keys[i]] = parseInt(match[cursor + i]);
    }
    return [ret, null, cursor + i];
  };
}

// ISO and SQL parsing
var offsetRegex = /(?:(Z)|([+-]\d\d)(?::?(\d\d))?)/;
var isoTimeBaseRegex = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,9}))?)?)?/;
var isoTimeRegex = RegExp('' + isoTimeBaseRegex.source + offsetRegex.source + '?');
var isoTimeExtensionRegex = RegExp('(?:T' + isoTimeRegex.source + ')?');
var isoYmdRegex = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/;
var isoWeekRegex = /(\d{4})-?W(\d\d)-?(\d)/;
var isoOrdinalRegex = /(\d{4})-?(\d{3})/;
var extractISOWeekData = simpleParse('weekYear', 'weekNumber', 'weekDay');
var extractISOOrdinalData = simpleParse('year', 'ordinal');
var sqlYmdRegex = /(\d{4})-(\d\d)-(\d\d)/;
var sqlTimeRegex = RegExp(isoTimeBaseRegex.source + ' ?(?:' + offsetRegex.source + '|([a-zA-Z_]{1,256}/[a-zA-Z_]{1,256}))?');
var sqlTimeExtensionRegex = RegExp('(?: ' + sqlTimeRegex.source + ')?');

function extractISOYmd(match, cursor) {
  var item = {
    year: parseInt(match[cursor]),
    month: parseInt(match[cursor + 1]) || 1,
    day: parseInt(match[cursor + 2]) || 1
  };

  return [item, null, cursor + 3];
}

function extractISOTime(match, cursor) {
  var item = {
    hour: parseInt(match[cursor]) || 0,
    minute: parseInt(match[cursor + 1]) || 0,
    second: parseInt(match[cursor + 2]) || 0,
    millisecond: Util.parseMillis(match[cursor + 3])
  };

  return [item, null, cursor + 4];
}

function extractISOOffset(match, cursor) {
  var local = !match[cursor] && !match[cursor + 1],
      fullOffset = Util.signedOffset(match[cursor + 1], match[cursor + 2]),
      zone = local ? null : FixedOffsetZone.instance(fullOffset);
  return [{}, zone, cursor + 3];
}

function extractIANAZone(match, cursor) {
  var zone = match[cursor] ? new IANAZone(match[cursor]) : null;
  return [{}, zone, cursor + 1];
}

// ISO duration parsing

var isoDuration = /^P(?:(?:(\d{1,9})Y)?(?:(\d{1,9})M)?(?:(\d{1,9})D)?(?:T(?:(\d{1,9})H)?(?:(\d{1,9})M)?(?:(\d{1,9})S)?)?|(\d{1,9})W)$/;

function extractISODuration(match) {
  var yearStr = match[1],
      monthStr = match[2],
      dayStr = match[3],
      hourStr = match[4],
      minuteStr = match[5],
      secondStr = match[6],
      weekStr = match[7];


  return {
    years: parseInt(yearStr),
    months: parseInt(monthStr),
    weeks: parseInt(weekStr),
    days: parseInt(dayStr),
    hours: parseInt(hourStr),
    minutes: parseInt(minuteStr),
    seconds: parseInt(secondStr)
  };
}

// These are a little braindead. EDT *should* tell us that we're in, say, America/New_York
// and not just that we're in -240 *right now*. But since I don't think these are used that often
// I'm just going to ignore that
var obsOffsets = {
  GMT: 0,
  EDT: -4 * 60,
  EST: -5 * 60,
  CDT: -5 * 60,
  CST: -6 * 60,
  MDT: -6 * 60,
  MST: -7 * 60,
  PDT: -7 * 60,
  PST: -8 * 60
};

function fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
  var result = {
    year: yearStr.length === 2 ? Util.untruncateYear(parseInt(yearStr)) : parseInt(yearStr),
    month: monthStr.length === 2 ? parseInt(monthStr, 10) : English.monthsShort.indexOf(monthStr) + 1,
    day: parseInt(dayStr),
    hour: parseInt(hourStr),
    minute: parseInt(minuteStr)
  };

  if (secondStr) result.second = parseInt(secondStr);
  if (weekdayStr) {
    result.weekday = weekdayStr.length > 3 ? English.weekdaysLong.indexOf(weekdayStr) + 1 : English.weekdaysShort.indexOf(weekdayStr) + 1;
  }

  return result;
}

// RFC 2822/5322
var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;

function extractRFC2822(match) {
  var weekdayStr = match[1],
      dayStr = match[2],
      monthStr = match[3],
      yearStr = match[4],
      hourStr = match[5],
      minuteStr = match[6],
      secondStr = match[7],
      obsOffset = match[8],
      milOffset = match[9],
      offHourStr = match[10],
      offMinuteStr = match[11],
      result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);


  var offset = void 0;
  if (obsOffset) {
    offset = obsOffsets[obsOffset];
  } else if (milOffset) {
    offset = 0;
  } else {
    offset = Util.signedOffset(offHourStr, offMinuteStr);
  }

  return [result, new FixedOffsetZone(offset)];
}

function preprocessRFC2822(s) {
  // Remove comments and folding whitespace and replace multiple-spaces with a single space
  return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').trim();
}

// http date

var rfc1123 = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/;
var rfc850 = /^(Monday|Tuesday|Wedsday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/;
var ascii = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;

function extractRFC1123Or850(match) {
  var weekdayStr = match[1],
      dayStr = match[2],
      monthStr = match[3],
      yearStr = match[4],
      hourStr = match[5],
      minuteStr = match[6],
      secondStr = match[7],
      result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);

  return [result, FixedOffsetZone.utcInstance];
}

function extractASCII(match) {
  var weekdayStr = match[1],
      monthStr = match[2],
      dayStr = match[3],
      hourStr = match[4],
      minuteStr = match[5],
      secondStr = match[6],
      yearStr = match[7],
      result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);

  return [result, FixedOffsetZone.utcInstance];
}

/**
 * @private
 */

var RegexParser = function () {
  function RegexParser() {
    classCallCheck(this, RegexParser);
  }

  RegexParser.parseISODate = function parseISODate(s) {
    return parse(s, [combineRegexes(isoYmdRegex, isoTimeExtensionRegex), combineExtractors(extractISOYmd, extractISOTime, extractISOOffset)], [combineRegexes(isoWeekRegex, isoTimeExtensionRegex), combineExtractors(extractISOWeekData, extractISOTime, extractISOOffset)], [combineRegexes(isoOrdinalRegex, isoTimeExtensionRegex), combineExtractors(extractISOOrdinalData, extractISOTime)], [combineRegexes(isoTimeRegex), combineExtractors(extractISOTime, extractISOOffset)]);
  };

  RegexParser.parseRFC2822Date = function parseRFC2822Date(s) {
    return parse(preprocessRFC2822(s), [rfc2822, extractRFC2822]);
  };

  RegexParser.parseHTTPDate = function parseHTTPDate(s) {
    return parse(s, [rfc1123, extractRFC1123Or850], [rfc850, extractRFC1123Or850], [ascii, extractASCII]);
  };

  RegexParser.parseISODuration = function parseISODuration(s) {
    return parse(s, [isoDuration, extractISODuration]);
  };

  RegexParser.parseSQL = function parseSQL(s) {
    return parse(s, [combineRegexes(sqlYmdRegex, sqlTimeExtensionRegex), combineExtractors(extractISOYmd, extractISOTime, extractISOOffset, extractIANAZone)], [combineRegexes(sqlTimeRegex), combineExtractors(extractISOTime, extractISOOffset, extractIANAZone)]);
  };

  return RegexParser;
}();

var INVALID$1 = 'Invalid Duration';

// unit conversion constants
var lowOrderMatrix = {
  weeks: {
    days: 7,
    hours: 7 * 24,
    minutes: 7 * 24 * 60,
    seconds: 7 * 24 * 60 * 60,
    milliseconds: 7 * 24 * 60 * 60 * 1000
  },
  days: {
    hours: 24,
    minutes: 24 * 60,
    seconds: 24 * 60 * 60,
    milliseconds: 24 * 60 * 60 * 1000
  },
  hours: { minutes: 60, seconds: 60 * 60, milliseconds: 60 * 60 * 1000 },
  minutes: { seconds: 60, milliseconds: 60 * 1000 },
  seconds: { milliseconds: 1000 }
};
var casualMatrix = Object.assign({
  years: {
    months: 12,
    weeks: 52,
    days: 365,
    hours: 365 * 24,
    minutes: 365 * 24 * 60,
    seconds: 365 * 24 * 60 * 60,
    milliseconds: 365 * 24 * 60 * 60 * 1000
  },
  months: {
    weeks: 4,
    days: 30,
    hours: 30 * 24,
    minutes: 30 * 24 * 60,
    seconds: 30 * 24 * 60 * 60,
    milliseconds: 30 * 24 * 60 * 60 * 1000
  }
}, lowOrderMatrix);
var daysInYearAccurate = 146097.0 / 400;
var daysInMonthAccurate = 146097.0 / 4800;
var accurateMatrix = Object.assign({
  years: {
    months: 12,
    weeks: daysInYearAccurate / 7,
    days: daysInYearAccurate,
    hours: daysInYearAccurate * 24,
    minutes: daysInYearAccurate * 24 * 60,
    seconds: daysInYearAccurate * 24 * 60 * 60,
    milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1000
  },
  months: {
    weeks: daysInMonthAccurate / 7,
    days: daysInMonthAccurate,
    hours: daysInYearAccurate * 24,
    minutes: daysInYearAccurate * 24 * 60,
    seconds: daysInYearAccurate * 24 * 60 * 60,
    milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1000
  }
}, lowOrderMatrix);

// units ordered by size
var orderedUnits$1 = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];

// clone really means "create another instance just like this one, but with these changes"
function clone$1(dur, alts) {
  var clear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  // deep merge for vals
  var conf = {
    values: clear ? alts.values : Object.assign({}, dur.values, alts.values || {}),
    loc: dur.loc.clone(alts.loc),
    conversionAccuracy: alts.conversionAccuracy || dur.conversionAccuracy
  };
  return new Duration(conf);
}

// some functions really care about the absolute value of a duration, so combined with
// normalize() this tells us whether this duration is positive or negative
function isHighOrderNegative(obj) {
  // only rule is that the highest-order part must be non-negative
  for (var _iterator = orderedUnits$1, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var k = _ref;

    if (obj[k]) return obj[k] < 0;
  }
  return false;
}

/**
 * A Duration object represents a period of time, like "2 months" or "1 day, 1 hour". Conceptually, it's just a map of units to their quantities, accompanied by some additional configuration and methods for creating, parsing, interrogating, transforming, and formatting them. They can be used on their own or in conjunction with other Luxon types; for example, you can use {@link DateTime.plus} to add a Duration object to a DateTime, producing another DateTime.
 *
 * Here is a brief overview of commonly used methods and getters in Duration:
 *
 * * **Creation** To create a Duration, use {@link Duration.fromMillis}, {@link Duration.fromObject}, or {@link Duration.fromISO}.
 * * **Unit values** See the {@link years}, {@link months}, {@link weeks}, {@link days}, {@link hours}, {@link minutes}, {@link seconds}, {@link milliseconds} accessors.
 * * **Configuration** See  {@link locale} and {@link numberingSystem} accessors.
 * * **Transformation** To create new Durations out of old ones use {@link plus}, {@link minus}, {@link normalize}, {@link set}, {@link reconfigure}, {@link shiftTo}, and {@link negate}.
 * * **Output** To convert the Duration into other representations, see {@link as}, {@link toISO}, {@link toFormat}, and {@link toJSON}
 *
 * There's are more methods documented below. In addition, for more information on subtler topics like internationalization and validity, see the external documentation.
 */
var Duration = function () {
  /**
   * @private
   */
  function Duration(config) {
    classCallCheck(this, Duration);

    var accurate = config.conversionAccuracy === 'longterm' || false;
    /**
     * @access private
     */
    this.values = config.values;
    /**
     * @access private
     */
    this.loc = config.loc || Locale.create();
    /**
     * @access private
     */
    this.conversionAccuracy = accurate ? 'longterm' : 'casual';
    /**
     * @access private
     */
    this.invalid = config.invalidReason || null;
    /**
     * @access private
     */
    this.matrix = accurate ? accurateMatrix : casualMatrix;
  }

  /**
   * Create Duration from a number of milliseconds.
   * @param {number} count of milliseconds
   * @param {Object} opts - options for parsing
   * @param {string} [obj.locale='en-US'] - the locale to use
   * @param {string} obj.numberingSystem - the numbering system to use
   * @param {string} [obj.conversionAccuracy='casual'] - the conversion system to use
   * @return {Duration}
   */


  Duration.fromMillis = function fromMillis(count, opts) {
    return Duration.fromObject(Object.assign({ milliseconds: count }, opts));
  };

  /**
   * Create an Duration from a Javascript object with keys like 'years' and 'hours'.
   * @param {Object} obj - the object to create the DateTime from
   * @param {number} obj.years
   * @param {number} obj.months
   * @param {number} obj.weeks
   * @param {number} obj.days
   * @param {number} obj.hours
   * @param {number} obj.minutes
   * @param {number} obj.seconds
   * @param {number} obj.milliseconds
   * @param {string} [obj.locale='en-US'] - the locale to use
   * @param {string} obj.numberingSystem - the numbering system to use
   * @param {string} [obj.conversionAccuracy='casual'] - the conversion system to use
   * @return {Duration}
   */


  Duration.fromObject = function fromObject(obj) {
    return new Duration({
      values: Util.normalizeObject(obj, Duration.normalizeUnit, true),
      loc: Locale.fromObject(obj),
      conversionAccuracy: obj.conversionAccuracy
    });
  };

  /**
   * Create a Duration from an ISO 8601 duration string.
   * @param {string} text - text to parse
   * @param {Object} opts - options for parsing
   * @param {string} [obj.locale='en-US'] - the locale to use
   * @param {string} obj.numberingSystem - the numbering system to use
   * @param {string} [obj.conversionAccuracy='casual'] - the conversion system to use
   * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
   * @example Duration.fromISO('P3Y6M4DT12H30M5S').toObject() //=> { years: 3, months: 6, day: 4, hours: 12, minutes: 30, seconds: 5 }
   * @example Duration.fromISO('PT23H').toObject() //=> { hours: 23 }
   * @example Duration.fromISO('P5Y3M').toObject() //=> { years: 5, months: 3 }
   * @return {Duration}
   */


  Duration.fromISO = function fromISO(text, opts) {
    var obj = Object.assign(RegexParser.parseISODuration(text), opts);
    return Duration.fromObject(obj);
  };

  /**
   * Create an invalid Duration.
   * @param {string} reason - reason this is invalid
   * @return {Duration}
   */


  Duration.invalid = function invalid(reason) {
    if (!reason) {
      throw new InvalidArgumentError('need to specify a reason the Duration is invalid');
    }
    if (Settings.throwOnInvalid) {
      throw new InvalidDurationError(reason);
    } else {
      return new Duration({ invalidReason: reason });
    }
  };

  /**
   * @private
   */


  Duration.normalizeUnit = function normalizeUnit(unit) {
    var ignoreUnknown = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var normalized = {
      year: 'years',
      years: 'years',
      month: 'months',
      months: 'months',
      week: 'weeks',
      weeks: 'weeks',
      day: 'days',
      days: 'days',
      hour: 'hours',
      hours: 'hours',
      minute: 'minutes',
      minutes: 'minutes',
      second: 'seconds',
      seconds: 'seconds',
      millisecond: 'milliseconds',
      milliseconds: 'milliseconds'
    }[unit ? unit.toLowerCase() : unit];

    if (!ignoreUnknown && !normalized) throw new InvalidUnitError(unit);

    return normalized;
  };

  /**
   * Get  the locale of a Duration, such 'en-GB'
   * @return {string}
   */


  /**
   * Returns a string representation of this Duration formatted according to the specified format string.
   * @param {string} fmt - the format string
   * @param {object} opts - options
   * @param {boolean} opts.round - round numerical values
   * @return {string}
   */
  Duration.prototype.toFormat = function toFormat(fmt) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return this.isValid ? Formatter.create(this.loc, opts).formatDurationFromString(this, fmt) : INVALID$1;
  };

  /**
   * Returns a Javascript object with this Duration's values.
   * @param opts - options for generating the object
   * @param {boolean} [opts.includeConfig=false] - include configuration attributes in the output
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toObject() //=> { years: 1, days: 6, seconds: 2 }
   * @return {object}
   */


  Duration.prototype.toObject = function toObject() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!this.isValid) return {};

    var base = Object.assign({}, this.values);

    if (opts.includeConfig) {
      base.conversionAccuracy = this.conversionAccuracy;
      base.numberingSystem = this.loc.numberingSystem;
      base.locale = this.loc.locale;
    }
    return base;
  };

  /**
   * Returns an ISO 8601-compliant string representation of this Duration.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
   * @example Duration.fromObject({ years: 3, seconds: 45 }).toISO() //=> 'P3YT45S'
   * @example Duration.fromObject({ months: 4, seconds: 45 }).toISO() //=> 'P4MT45S'
   * @example Duration.fromObject({ months: 5 }).toISO() //=> 'P5M'
   * @example Duration.fromObject({ minutes: 5 }).toISO() //=> 'PT5M'
   * @return {string}
   */


  Duration.prototype.toISO = function toISO() {
    // we could use the formatter, but this is an easier way to get the minimum string
    if (!this.isValid) return null;

    var s = 'P',
        norm = this.normalize();

    // ISO durations are always positive, so take the absolute value
    norm = isHighOrderNegative(norm.values) ? norm.negate() : norm;

    if (norm.years > 0) s += norm.years + 'Y';
    if (norm.months > 0) s += norm.months + 'M';
    if (norm.days > 0 || norm.weeks > 0) s += norm.days + norm.weeks * 7 + 'D';
    if (norm.hours > 0 || norm.minutes > 0 || norm.seconds > 0 || norm.milliseconds > 0) s += 'T';
    if (norm.hours > 0) s += norm.hours + 'H';
    if (norm.minutes > 0) s += norm.minutes + 'M';
    if (norm.seconds > 0) s += norm.seconds + 'S';
    return s;
  };

  /**
   * Returns an ISO 8601 representation of this Duration appropriate for use in JSON.
   * @return {string}
   */


  Duration.prototype.toJSON = function toJSON() {
    return this.toISO();
  };

  /**
   * Returns an ISO 8601 representation of this Duration appropriate for use in debugging.
   * @return {string}
   */


  Duration.prototype.toString = function toString() {
    return this.toISO();
  };

  /**
   * Returns a string representation of this Duration appropriate for the REPL.
   * @return {string}
   */


  Duration.prototype.inspect = function inspect() {
    if (this.isValid) {
      return 'Duration {\n  values: ' + this.toISO() + ',\n  locale: ' + this.locale + ',\n  conversionAccuracy: ' + this.conversionAccuracy + ' }';
    } else {
      return 'Duration { Invalid, reason: ' + this.invalidReason + ' }';
    }
  };

  /**
   * Make this Duration longer by the specified amount. Return a newly-constructed Duration.
   * @param {Duration|number|object} duration - The amount to add. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @return {Duration}
   */


  Duration.prototype.plus = function plus(duration) {
    if (!this.isValid) return this;

    var dur = Util.friendlyDuration(duration),
        result = {};

    for (var _iterator2 = orderedUnits$1, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var k = _ref2;

      var val = dur.get(k) + this.get(k);
      if (val !== 0) {
        result[k] = val;
      }
    }

    return clone$1(this, { values: result }, true);
  };

  /**
   * Make this Duration shorter by the specified amount. Return a newly-constructed Duration.
   * @param {Duration|number|object} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @return {Duration}
   */


  Duration.prototype.minus = function minus(duration) {
    if (!this.isValid) return this;

    var dur = Util.friendlyDuration(duration);
    return this.plus(dur.negate());
  };

  /**
   * Get the value of unit.
   * @param {string} unit - a unit such as 'minute' or 'day'
   * @example Duration.fromObject({years: 2, days: 3}).years //=> 2
   * @example Duration.fromObject({years: 2, days: 3}).months //=> 0
   * @example Duration.fromObject({years: 2, days: 3}).days //=> 3
   * @return {number}
   */


  Duration.prototype.get = function get$$1(unit) {
    return this[Duration.normalizeUnit(unit)];
  };

  /**
   * "Set" the values of specified units. Return a newly-constructed Duration.
   * @param {object} values - a mapping of units to numbers
   * @example dur.set({ years: 2017 })
   * @example dur.set({ hours: 8, minutes: 30 })
   * @return {Duration}
   */


  Duration.prototype.set = function set$$1(values) {
    var mixed = Object.assign(this.values, Util.normalizeObject(values, Duration.normalizeUnit));
    return clone$1(this, { values: mixed });
  };

  /**
   * "Set" the locale and/or numberingSystem.  Returns a newly-constructed Duration.
   * @example dur.reconfigure({ locale: 'en-GB' })
   * @return {Duration}
   */


  Duration.prototype.reconfigure = function reconfigure() {
    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        locale = _ref3.locale,
        numberingSystem = _ref3.numberingSystem,
        conversionAccuracy = _ref3.conversionAccuracy;

    var loc = this.loc.clone({ locale: locale, numberingSystem: numberingSystem }),
        opts = { loc: loc };

    if (conversionAccuracy) {
      opts.conversionAccuracy = conversionAccuracy;
    }

    return clone$1(this, opts);
  };

  /**
   * Return the length of the duration in the specified unit.
   * @param {string} unit - a unit such as 'minutes' or 'days'
   * @example Duration.fromObject({years: 1}).as('days') //=> 365
   * @example Duration.fromObject({years: 1}).as('months') //=> 12
   * @example Duration.fromObject({hours: 60}).as('days') //=> 2.5
   * @return {number}
   */


  Duration.prototype.as = function as(unit) {
    return this.isValid ? this.shiftTo(unit).get(unit) : NaN;
  };

  /**
   * Reduce this Duration to its canonical representation in its current units.
   * @example Duration.fromObject({ years: 2, days: 5000 }).normalize().toObject() //=> { years: 15, days: 255 }
   * @example Duration.fromObject({ hours: 12, minutes: -45 }).normalize().toObject() //=> { hours: 11, minutes: 15 }
   * @return {Duration}
   */


  Duration.prototype.normalize = function normalize() {
    if (!this.isValid) return this;

    var neg = isHighOrderNegative(this.values),
        dur = neg ? this.negate() : this,
        shifted = dur.shiftTo.apply(dur, Object.keys(this.values));
    return neg ? shifted.negate() : shifted;
  };

  /**
   * Convert this Duration into its representation in a different set of units.
   * @example Duration.fromObject({ hours: 1, seconds: 30 }).shiftTo('minutes', 'milliseconds').toObject() //=> { minutes: 60, milliseconds: 30000 }
   * @return {Duration}
   */


  Duration.prototype.shiftTo = function shiftTo() {
    for (var _len = arguments.length, units = Array(_len), _key = 0; _key < _len; _key++) {
      units[_key] = arguments[_key];
    }

    if (!this.isValid) return this;

    if (units.length === 0) {
      return this;
    }

    units = units.map(function (u) {
      return Duration.normalizeUnit(u);
    });

    var built = {},
        accumulated = {},
        vals = this.toObject();
    var lastUnit = void 0;

    for (var _iterator3 = orderedUnits$1, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref4;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref4 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref4 = _i3.value;
      }

      var k = _ref4;

      if (units.indexOf(k) >= 0) {
        lastUnit = k;

        var own = 0;

        // anything we haven't boiled down yet should get boiled to this unit
        for (var ak in accumulated) {
          if (accumulated.hasOwnProperty(ak)) {
            own += this.matrix[ak][k] * accumulated[ak];
            accumulated[ak] = 0;
          }
        }

        // plus anything that's already in this unit
        if (Util.isNumber(vals[k])) {
          own += vals[k];
        }

        var i = Math.trunc(own);
        built[k] = i;
        accumulated[k] = own - i;

        // plus anything further down the chain that should be rolled up in to this
        for (var down in vals) {
          if (orderedUnits$1.indexOf(down) > orderedUnits$1.indexOf(k)) {
            var conv = this.matrix[k][down],
                added = Math.floor(vals[down] / conv);
            built[k] += added;
            vals[down] -= added * conv;
          }
        }
        // otherwise, keep it in the wings to boil it later
      } else if (Util.isNumber(vals[k])) {
        accumulated[k] = vals[k];
      }
    }

    // anything leftover becomes the decimal for the last unit
    if (lastUnit) {
      for (var key in accumulated) {
        if (accumulated.hasOwnProperty(key)) {
          if (accumulated[key] > 0) {
            built[lastUnit] += key === lastUnit ? accumulated[key] : accumulated[key] / this.matrix[lastUnit][key];
          }
        }
      }
    }
    return clone$1(this, { values: built }, true);
  };

  /**
   * Return the negative of this Duration.
   * @example Duration.fromObject({ hours: 1, seconds: 30 }).negate().toObject() //=> { hours: -1, seconds: -30 }
   * @return {Duration}
   */


  Duration.prototype.negate = function negate() {
    if (!this.isValid) return this;
    var negated = {};
    for (var _iterator4 = Object.keys(this.values), _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
      var _ref5;

      if (_isArray4) {
        if (_i4 >= _iterator4.length) break;
        _ref5 = _iterator4[_i4++];
      } else {
        _i4 = _iterator4.next();
        if (_i4.done) break;
        _ref5 = _i4.value;
      }

      var k = _ref5;

      negated[k] = -this.values[k];
    }
    return clone$1(this, { values: negated }, true);
  };

  /**
   * Get the years.
   * @return {number}
   */


  /**
   * Equality check
   * Two Durations are equal iff they have the same units and the same values for each unit.
   * @param {Duration} other
   * @return {boolean}
   */
  Duration.prototype.equals = function equals(other) {
    if (!this.isValid || !other.isValid) {
      return false;
    }

    if (!this.loc.equals(other.loc)) {
      return false;
    }

    for (var _iterator5 = orderedUnits$1, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
      var _ref6;

      if (_isArray5) {
        if (_i5 >= _iterator5.length) break;
        _ref6 = _iterator5[_i5++];
      } else {
        _i5 = _iterator5.next();
        if (_i5.done) break;
        _ref6 = _i5.value;
      }

      var u = _ref6;

      if (this.values[u] !== other.values[u]) {
        return false;
      }
    }
    return true;
  };

  createClass(Duration, [{
    key: 'locale',
    get: function get$$1() {
      return this.loc.locale;
    }

    /**
     * Get the numbering system of a Duration, such 'beng'. The numbering system is used when formatting the Duration
     *
     * @return {string}
     */

  }, {
    key: 'numberingSystem',
    get: function get$$1() {
      return this.loc.numberingSystem;
    }
  }, {
    key: 'years',
    get: function get$$1() {
      return this.isValid ? this.values.years || 0 : NaN;
    }

    /**
     * Get the months.
     * @return {number}
     */

  }, {
    key: 'months',
    get: function get$$1() {
      return this.isValid ? this.values.months || 0 : NaN;
    }

    /**
     * Get the weeks
     * @return {number}
     */

  }, {
    key: 'weeks',
    get: function get$$1() {
      return this.isValid ? this.values.weeks || 0 : NaN;
    }

    /**
     * Get the days.
     * @return {number}
     */

  }, {
    key: 'days',
    get: function get$$1() {
      return this.isValid ? this.values.days || 0 : NaN;
    }

    /**
     * Get the hours.
     * @return {number}
     */

  }, {
    key: 'hours',
    get: function get$$1() {
      return this.isValid ? this.values.hours || 0 : NaN;
    }

    /**
     * Get the minutes.
     * @return {number}
     */

  }, {
    key: 'minutes',
    get: function get$$1() {
      return this.isValid ? this.values.minutes || 0 : NaN;
    }

    /**
     * Get the seconds.
     * @return {number}
     */

  }, {
    key: 'seconds',
    get: function get$$1() {
      return this.isValid ? this.values.seconds || 0 : NaN;
    }

    /**
     * Get the milliseconds.
     * @return {number}
     */

  }, {
    key: 'milliseconds',
    get: function get$$1() {
      return this.isValid ? this.values.milliseconds || 0 : NaN;
    }

    /**
     * Returns whether the Duration is invalid. Invalid durations are returned by diff operations
     * on invalid DateTimes or Intervals.
     * @return {boolean}
     */

  }, {
    key: 'isValid',
    get: function get$$1() {
      return this.invalidReason === null;
    }

    /**
     * Returns an explanation of why this Duration became invalid, or null if the Duration is valid
     * @return {string}
     */

  }, {
    key: 'invalidReason',
    get: function get$$1() {
      return this.invalid;
    }
  }]);
  return Duration;
}();

var INVALID$2 = 'Invalid Interval';

// checks if the start is equal to or before the end
function validateStartEnd(start, end) {
  return !!start && !!end && start.isValid && end.isValid && start <= end;
}

/**
 * An Interval object represents a half-open interval of time, where each endpoint is a {@link DateTime}. Conceptually, it's a container for those two endpoints, accompanied by methods for creating, parsing, interrogating, comparing, transforming, and formatting them.
 *
 * Here is a brief overview of the most commonly used methods and getters in Interval:
 *
 * * **Creation** To create an Interval, use {@link fromDateTimes}, {@link after}, {@link before}, or {@link fromISO}.
 * * **Accessors** Use {@link start} and {@link end} to get the start and end.
 * * **Interrogation** To analyze the Interval, use {@link count}, {@link length}, {@link hasSame}, {@link contains}, {@link isAfter}, or {@link isBefore}.
 * * **Transformation** To create other Intervals out of this one, use {@link set}, {@link splitAt}, {@link splitBy}, {@link divideEqually}, {@link merge}, {@link xor}, {@link union}, {@link intersection}, or {@link difference}.
 * * **Comparison** To compare this Interval to another one, use {@link equals}, {@link overlaps}, {@link abutsStart}, {@link abutsEnd}, {@link engulfs}
 * * **Output*** To convert the Interval into other representations, see {@link toString}, {@link toISO}, {@link toFormat}, and {@link toDuration}.
 */
var Interval = function () {
  /**
   * @private
   */
  function Interval(config) {
    classCallCheck(this, Interval);

    /**
     * @access private
     */
    this.s = config.start;
    /**
     * @access private
     */
    this.e = config.end;
    /**
     * @access private
     */
    this.invalid = config.invalidReason || null;
  }

  /**
   * Create an invalid Interval.
   * @return {Interval}
   */


  Interval.invalid = function invalid(reason) {
    if (!reason) {
      throw new InvalidArgumentError('need to specify a reason the DateTime is invalid');
    }
    if (Settings.throwOnInvalid) {
      throw new InvalidIntervalError(reason);
    } else {
      return new Interval({ invalidReason: reason });
    }
  };

  /**
   * Create an Interval from a start DateTime and an end DateTime. Inclusive of the start but not the end.
   * @param {DateTime|object|Date} start
   * @param {DateTime|object|Date} end
   * @return {Interval}
   */


  Interval.fromDateTimes = function fromDateTimes(start, end) {
    var builtStart = Util.friendlyDateTime(start),
        builtEnd = Util.friendlyDateTime(end);

    return new Interval({
      start: builtStart,
      end: builtEnd,
      invalidReason: validateStartEnd(builtStart, builtEnd) ? null : 'invalid endpoints'
    });
  };

  /**
   * Create an Interval from a start DateTime and a Duration to extend to.
   * @param {DateTime|object|Date} start
   * @param {Duration|number|object} duration - the length of the Interval.
   * @return {Interval}
   */


  Interval.after = function after(start, duration) {
    var dur = Util.friendlyDuration(duration),
        dt = Util.friendlyDateTime(start);
    return Interval.fromDateTimes(dt, dt.plus(dur));
  };

  /**
   * Create an Interval from an end DateTime and a Duration to extend backwards to.
   * @param {DateTime|object|Date} end
   * @param {Duration|number|object} duration - the length of the Interval.
   * @return {Interval}
   */


  Interval.before = function before(end, duration) {
    var dur = Util.friendlyDuration(duration),
        dt = Util.friendlyDateTime(end);
    return Interval.fromDateTimes(dt.minus(dur), dt);
  };

  /**
   * Create an Interval from an ISO 8601 string
   * @param {string} string - the ISO string to parse
   * @param {object} opts - options to pass {@see DateTime.fromISO}
   * @return {Interval}
   */


  Interval.fromISO = function fromISO(string, opts) {
    if (string) {
      var _string$split = string.split(/\//),
          s = _string$split[0],
          e = _string$split[1];

      if (s && e) {
        return Interval.fromDateTimes(DateTime.fromISO(s, opts), DateTime.fromISO(e, opts));
      }
    }
    return Interval.invalid('invalid ISO format');
  };

  /**
   * Returns the start of the Interval
   * @return {DateTime}
   */


  /**
   * Returns the length of the Interval in the specified unit.
   * @param {string} unit - the unit (such as 'hours' or 'days') to return the length in.
   * @return {number}
   */
  Interval.prototype.length = function length() {
    var unit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'milliseconds';

    return this.isValid ? this.toDuration.apply(this, [unit]).get(unit) : NaN;
  };

  /**
   * Returns the count of minutes, hours, days, months, or years included in the Interval, even in part.
   * Unlike {@link length} this counts sections of the calendar, not periods of time, e.g. specifying 'day'
   * asks 'what dates are included in this interval?', not 'how many days long is this interval?'
   * @param {string} [unit='milliseconds'] - the unit of time to count.
   * @return {number}
   */


  Interval.prototype.count = function count() {
    var unit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'milliseconds';

    if (!this.isValid) return NaN;
    var start = this.start.startOf(unit),
        end = this.end.startOf(unit);
    return Math.floor(end.diff(start, unit).get(unit)) + 1;
  };

  /**
   * Returns whether this Interval's start and end are both in the same unit of time
   * @param {string} unit - the unit of time to check sameness on
   * @return {boolean}
   */


  Interval.prototype.hasSame = function hasSame(unit) {
    return this.isValid ? this.e.minus(1).hasSame(this.s, unit) : false;
  };

  /**
   * Return whether this Interval has the same start and end DateTimes.
   * @return {boolean}
   */


  Interval.prototype.isEmpty = function isEmpty() {
    return this.s.valueOf() === this.e.valueOf();
  };

  /**
   * Return whether this Interval's start is after the specified DateTime.
   * @param {DateTime} dateTime
   * @return {boolean}
   */


  Interval.prototype.isAfter = function isAfter(dateTime) {
    if (!this.isValid) return false;
    return this.s > dateTime;
  };

  /**
   * Return whether this Interval's end is before the specified DateTime.
   * @param {Datetime} dateTime
   * @return {boolean}
   */


  Interval.prototype.isBefore = function isBefore(dateTime) {
    if (!this.isValid) return false;
    return this.e.plus(1) < dateTime;
  };

  /**
   * Return whether this Interval contains the specified DateTime.
   * @param {DateTime} dateTime
   * @return {boolean}
   */


  Interval.prototype.contains = function contains(dateTime) {
    if (!this.isValid) return false;
    return this.s <= dateTime && this.e > dateTime;
  };

  /**
   * "Sets" the start and/or end dates. Returns a newly-constructed Interval.
   * @param {object} values - the values to set
   * @param {DateTime} values.start - the starting DateTime
   * @param {DateTime} values.end - the ending DateTime
   * @return {Interval}
   */


  Interval.prototype.set = function set$$1() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        start = _ref.start,
        end = _ref.end;

    if (!this.isValid) return this;
    return Interval.fromDateTimes(start || this.s, end || this.e);
  };

  /**
   * Split this Interval at each of the specified DateTimes
   * @param {...DateTimes} dateTimes - the unit of time to count.
   * @return {[Interval]}
   */


  Interval.prototype.splitAt = function splitAt() {
    if (!this.isValid) return [];

    for (var _len = arguments.length, dateTimes = Array(_len), _key = 0; _key < _len; _key++) {
      dateTimes[_key] = arguments[_key];
    }

    var sorted = dateTimes.map(Util.friendlyDateTime).sort(),
        results = [];
    var s = this.s,
        i = 0;


    while (s < this.e) {
      var added = sorted[i] || this.e,
          next = +added > +this.e ? this.e : added;
      results.push(Interval.fromDateTimes(s, next));
      s = next;
      i += 1;
    }

    return results;
  };

  /**
   * Split this Interval into smaller Intervals, each of the specified length.
   * Left over time is grouped into a smaller interval
   * @param {Duration|number|object} duration - The length of each resulting interval.
   * @return {[Interval]}
   */


  Interval.prototype.splitBy = function splitBy(duration) {
    if (!this.isValid) return [];
    var dur = Util.friendlyDuration(duration),
        results = [];
    var s = this.s,
        added = void 0,
        next = void 0;


    while (s < this.e) {
      added = s.plus(dur);
      next = +added > +this.e ? this.e : added;
      results.push(Interval.fromDateTimes(s, next));
      s = next;
    }

    return results;
  };

  /**
   * Split this Interval into the specified number of smaller intervals.
   * @param {number} numberOfParts - The number of Intervals to divide the Interval into.
   * @return {[Interval]}
   */


  Interval.prototype.divideEqually = function divideEqually(numberOfParts) {
    if (!this.isValid) return [];
    return this.splitBy(this.length() / numberOfParts).slice(0, numberOfParts);
  };

  /**
   * Return whether this Interval overlaps with the specified Interval
   * @param {Interval} other
   * @return {boolean}
   */


  Interval.prototype.overlaps = function overlaps(other) {
    return this.e > other.s && this.s < other.e;
  };

  /**
   * Return whether this Interval's end is adjacent to the specified Interval's start.
   * @param {Interval} other
   * @return {boolean}
   */


  Interval.prototype.abutsStart = function abutsStart(other) {
    if (!this.isValid) return false;
    return +this.e === +other.s;
  };

  /**
   * Return whether this Interval's start is adjacent to the specified Interval's end.
   * @param {Interval} other
   * @return {boolean}
   */


  Interval.prototype.abutsEnd = function abutsEnd(other) {
    if (!this.isValid) return false;
    return +other.e === +this.s;
  };

  /**
   * Return whether this Interval engulfs the start and end of the specified Interval.
   * @param {Interval} other
   * @return {boolean}
   */


  Interval.prototype.engulfs = function engulfs(other) {
    if (!this.isValid) return false;
    return this.s <= other.s && this.e >= other.e;
  };

  /**
   * Return whether this Interval has the same start and end as the specified Interval.
   * @param {Interval} other
   * @return {boolean}
   */


  Interval.prototype.equals = function equals(other) {
    return this.s.equals(other.s) && this.e.equals(other.e);
  };

  /**
   * Return an Interval representing the intersection of this Interval and the specified Interval.
   * Specifically, the resulting Interval has the maximum start time and the minimum end time of the two Intervals.
   * Returns null if the intersection is empty, i.e., the intervals don't intersect.
   * @param {Interval} other
   * @return {Interval}
   */


  Interval.prototype.intersection = function intersection(other) {
    if (!this.isValid) return this;
    var s = this.s > other.s ? this.s : other.s,
        e = this.e < other.e ? this.e : other.e;

    if (s > e) {
      return null;
    } else {
      return Interval.fromDateTimes(s, e);
    }
  };

  /**
   * Return an Interval representing the union of this Interval and the specified Interval.
   * Specifically, the resulting Interval has the minimum start time and the maximum end time of the two Intervals.
   * @param {Interval} other
   * @return {Interval}
   */


  Interval.prototype.union = function union(other) {
    if (!this.isValid) return this;
    var s = this.s < other.s ? this.s : other.s,
        e = this.e > other.e ? this.e : other.e;
    return Interval.fromDateTimes(s, e);
  };

  /**
   * Merge an array of Intervals into a equivalent minimal set of Intervals.
   * Combines overlapping and adjacent Intervals.
   * @param {[Interval]} intervals
   * @return {[Interval]}
   */


  Interval.merge = function merge(intervals) {
    var _intervals$sort$reduc = intervals.sort(function (a, b) {
      return a.s - b.s;
    }).reduce(function (_ref2, item) {
      var sofar = _ref2[0],
          current = _ref2[1];

      if (!current) {
        return [sofar, item];
      } else if (current.overlaps(item) || current.abutsStart(item)) {
        return [sofar, current.union(item)];
      } else {
        return [sofar.concat([current]), item];
      }
    }, [[], null]),
        found = _intervals$sort$reduc[0],
        final = _intervals$sort$reduc[1];

    if (final) {
      found.push(final);
    }
    return found;
  };

  /**
   * Return an array of Intervals representing the spans of time that only appear in one of the specified Intervals.
   * @param {[Interval]} intervals
   * @return {[Interval]}
   */


  Interval.xor = function xor(intervals) {
    var _Array$prototype;

    var start = null,
        currentCount = 0;
    var results = [],
        ends = intervals.map(function (i) {
      return [{ time: i.s, type: 's' }, { time: i.e, type: 'e' }];
    }),
        flattened = (_Array$prototype = Array.prototype).concat.apply(_Array$prototype, ends),
        arr = flattened.sort(function (a, b) {
      return a.time - b.time;
    });

    for (var _iterator = arr, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref3 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref3 = _i.value;
      }

      var i = _ref3;

      currentCount += i.type === 's' ? 1 : -1;

      if (currentCount === 1) {
        start = i.time;
      } else {
        if (start && +start !== +i.time) {
          results.push(Interval.fromDateTimes(start, i.time));
        }

        start = null;
      }
    }

    return Interval.merge(results);
  };

  /**
   * Return an Interval representing the span of time in this Interval that doesn't overlap with any of the specified Intervals.
   * @param {...Interval} intervals
   * @return {Interval}
   */


  Interval.prototype.difference = function difference() {
    var _this = this;

    for (var _len2 = arguments.length, intervals = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      intervals[_key2] = arguments[_key2];
    }

    return Interval.xor([this].concat(intervals)).map(function (i) {
      return _this.intersection(i);
    }).filter(function (i) {
      return i && !i.isEmpty();
    });
  };

  /**
   * Returns a string representation of this Interval appropriate for debugging.
   * @return {string}
   */


  Interval.prototype.toString = function toString() {
    if (!this.isValid) return INVALID$2;
    return '[' + this.s.toISO() + ' \u2013 ' + this.e.toISO() + ')';
  };

  /**
   * Returns a string representation of this Interval appropriate for the REPL.
   * @return {string}
   */


  Interval.prototype.inspect = function inspect() {
    if (this.isValid) {
      return 'Interval {\n  start: ' + this.start.toISO() + ',\n  end: ' + this.end.toISO() + ',\n  zone:   ' + this.start.zone.name + ',\n  locale:   ' + this.start.locale + ' }';
    } else {
      return 'Interval { Invalid, reason: ' + this.invalidReason + ' }';
    }
  };

  /**
   * Returns an ISO 8601-compliant string representation of this Interval.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {object} opts - The same options as {@link DateTime.toISO}
   * @return {string}
   */


  Interval.prototype.toISO = function toISO(opts) {
    if (!this.isValid) return INVALID$2;
    return this.s.toISO(opts) + '/' + this.e.toISO(opts);
  };

  /**
   * Returns a string representation of this Interval formatted according to the specified format string.
   * @param {string} dateFormat - the format string. This string formats the start and end time. See {@link DateTime.toFormat} for details.
   * @param {object} opts - options
   * @param {string} [opts.separator =  ' – '] - a separator to place between the start and end representations
   * @return {string}
   */


  Interval.prototype.toFormat = function toFormat(dateFormat) {
    var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref4$separator = _ref4.separator,
        separator = _ref4$separator === undefined ? ' – ' : _ref4$separator;

    if (!this.isValid) return INVALID$2;
    return '' + this.s.toFormat(dateFormat) + separator + this.e.toFormat(dateFormat);
  };

  /**
   * Return a Duration representing the time spanned by this interval.
   * @param {string|string[]} [unit=['milliseconds']] - the unit or units (such as 'hours' or 'days') to include in the duration.
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @example Interval.fromDateTimes(dt1, dt2).toDuration().toObject() //=> { milliseconds: 88489257 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration('days').toObject() //=> { days: 1.0241812152777778 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration(['hours', 'minutes']).toObject() //=> { hours: 24, minutes: 34.82095 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration(['hours', 'minutes', 'seconds']).toObject() //=> { hours: 24, minutes: 34, seconds: 49.257 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration('seconds').toObject() //=> { seconds: 88489.257 }
   * @return {Duration}
   */


  Interval.prototype.toDuration = function toDuration(unit, opts) {
    if (!this.isValid) {
      return Duration.invalid(this.invalidReason);
    }
    return this.e.diff(this.s, unit, opts);
  };

  createClass(Interval, [{
    key: 'start',
    get: function get$$1() {
      return this.isValid ? this.s : null;
    }

    /**
     * Returns the end of the Interval
     * @return {DateTime}
     */

  }, {
    key: 'end',
    get: function get$$1() {
      return this.isValid ? this.e : null;
    }

    /**
     * Returns whether this Interval's end is at least its start, i.e. that the Interval isn't 'backwards'.
     * @return {boolean}
     */

  }, {
    key: 'isValid',
    get: function get$$1() {
      return this.invalidReason === null;
    }

    /**
     * Returns an explanation of why this Interval became invalid, or null if the Interval is valid
     * @return {string}
     */

  }, {
    key: 'invalidReason',
    get: function get$$1() {
      return this.invalid;
    }
  }]);
  return Interval;
}();

/**
 * The Info class contains static methods for retrieving general time and date related data. For example, it has methods for finding out if a time zone has a DST, for listing the months in any supported locale, and for discovering which of Luxon features are available in the current environment.
 */
var Info = function () {
  function Info() {
    classCallCheck(this, Info);
  }

  /**
   * Return whether the specified zone contains a DST.
   * @param {string|Zone} [zone='local'] - Zone to check. Defaults to the environment's local zone.
   * @return {boolean}
   */
  Info.hasDST = function hasDST() {
    var zone = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Settings.defaultZone;

    var proto = DateTime.local().setZone(zone).set({ month: 12 });

    return !zone.universal && proto.offset !== proto.set({ month: 6 }).offset;
  };

  /**
   * Return whether the specified zone is a valid IANA specifier.
   * @param {string} zone - Zone to check
   * @return {boolean}
   */


  Info.isValidIANAZone = function isValidIANAZone(zone) {
    return !!IANAZone.isValidSpecifier(zone) && IANAZone.isValidZone(zone);
  };

  /**
   * Return an array of standalone month names.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param {string} [length='long'] - the length of the month representation, such as "numeric", "2-digit", "narrow", "short", "long"
   * @param {object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @param {string} [opts.outputCalendar='gregory'] - the calendar
   * @example Info.months()[0] //=> 'January'
   * @example Info.months('short')[0] //=> 'Jan'
   * @example Info.months('numeric')[0] //=> '1'
   * @example Info.months('short', { locale: 'fr-CA' } )[0] //=> 'janv.'
   * @example Info.months('numeric', { locale: 'ar' })[0] //=> '١'
   * @example Info.months('long', { outputCalendar: 'islamic' })[0] //=> 'Rabiʻ I'
   * @return {[string]}
   */


  Info.months = function months() {
    var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'long';

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$locale = _ref.locale,
        locale = _ref$locale === undefined ? null : _ref$locale,
        _ref$numberingSystem = _ref.numberingSystem,
        numberingSystem = _ref$numberingSystem === undefined ? null : _ref$numberingSystem,
        _ref$outputCalendar = _ref.outputCalendar,
        outputCalendar = _ref$outputCalendar === undefined ? 'gregory' : _ref$outputCalendar;

    return Locale.create(locale, numberingSystem, outputCalendar).months(length);
  };

  /**
   * Return an array of format month names.
   * Format months differ from standalone months in that they're meant to appear next to the day of the month. In some languages, that
   * changes the string.
   * See {@link months}
   * @param {string} [length='long'] - the length of the month representation, such as "numeric", "2-digit", "narrow", "short", "long"
   * @param {object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.numbering=null] - the numbering system
   * @param {string} [opts.outputCalendar='gregory'] - the calendar
   * @return {[string]}
   */


  Info.monthsFormat = function monthsFormat() {
    var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'long';

    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$locale = _ref2.locale,
        locale = _ref2$locale === undefined ? null : _ref2$locale,
        _ref2$numberingSystem = _ref2.numberingSystem,
        numberingSystem = _ref2$numberingSystem === undefined ? null : _ref2$numberingSystem,
        _ref2$outputCalendar = _ref2.outputCalendar,
        outputCalendar = _ref2$outputCalendar === undefined ? 'gregory' : _ref2$outputCalendar;

    return Locale.create(locale, numberingSystem, outputCalendar).months(length, true);
  };

  /**
   * Return an array of standalone week names.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param {string} [length='long'] - the length of the month representation, such as "narrow", "short", "long".
   * @param {object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.numbering=null] - the numbering system
   * @param {string} [opts.outputCalendar='gregory'] - the calendar
   * @example Info.weekdays()[0] //=> 'Monday'
   * @example Info.weekdays('short')[0] //=> 'Mon'
   * @example Info.weekdays('short', { locale: 'fr-CA' })[0] //=> 'lun.'
   * @example Info.weekdays('short', { locale: 'ar' })[0] //=> 'الاثنين'
   * @return {[string]}
   */


  Info.weekdays = function weekdays() {
    var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'long';

    var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref3$locale = _ref3.locale,
        locale = _ref3$locale === undefined ? null : _ref3$locale,
        _ref3$numberingSystem = _ref3.numberingSystem,
        numberingSystem = _ref3$numberingSystem === undefined ? null : _ref3$numberingSystem;

    return Locale.create(locale, numberingSystem, null).weekdays(length);
  };

  /**
   * Return an array of format week names.
   * Format weekdays differ from standalone weekdays in that they're meant to appear next to more date information. In some languages, that
   * changes the string.
   * See {@link weekdays}
   * @param {string} [length='long'] - the length of the month representation, such as "narrow", "short", "long".
   * @param {object} opts - options
   * @param {string} [opts.locale=null] - the locale code
   * @param {string} [opts.numbering=null] - the numbering system
   * @param {string} [opts.outputCalendar='gregory'] - the calendar
   * @return {[string]}
   */


  Info.weekdaysFormat = function weekdaysFormat() {
    var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'long';

    var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref4$locale = _ref4.locale,
        locale = _ref4$locale === undefined ? null : _ref4$locale,
        _ref4$numberingSystem = _ref4.numberingSystem,
        numberingSystem = _ref4$numberingSystem === undefined ? null : _ref4$numberingSystem;

    return Locale.create(locale, numberingSystem, null).weekdays(length, true);
  };

  /**
   * Return an array of meridiems.
   * @param {object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @example Info.meridiems() //=> [ 'AM', 'PM' ]
   * @example Info.meridiems({ locale: 'de' }) //=> [ 'vorm.', 'nachm.' ]
   * @return {[string]}
   */


  Info.meridiems = function meridiems() {
    var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref5$locale = _ref5.locale,
        locale = _ref5$locale === undefined ? null : _ref5$locale;

    return Locale.create(locale).meridiems();
  };

  /**
   * Return an array of eras, such as ['BC', 'AD']. The locale can be specified, but the calendar system is always Gregorian.
   * @param {string} [length='short'] - the length of the era representation, such as "short" or "long".
   * @param {object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @example Info.eras() //=> [ 'BC', 'AD' ]
   * @example Info.eras('long') //=> [ 'Before Christ', 'Anno Domini' ]
   * @example Info.eras('long', { locale: 'fr' }) //=> [ 'avant Jésus-Christ', 'après Jésus-Christ' ]
   * @return {[string]}
   */


  Info.eras = function eras() {
    var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'short';

    var _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref6$locale = _ref6.locale,
        locale = _ref6$locale === undefined ? null : _ref6$locale;

    return Locale.create(locale, null, 'gregory').eras(length);
  };

  /**
   * Return the set of available features in this environment.
   * Some features of Luxon are not available in all environments. For example, on older browsers, timezone support is not available. Use this function to figure out if that's the case.
   * Keys:
   * * `zones`: whether this environment supports IANA timezones
   * * `intlTokens`: whether this environment supports internationalized token-based formatting/parsing
   * * `intl`: whether this environment supports general internationalization
   * @example Info.features() //=> { intl: true, intlTokens: false, zones: true }
   * @return {object}
   */


  Info.features = function features() {
    var intl = false,
        intlTokens = false,
        zones = false;

    if (Util.hasIntl()) {
      intl = true;
      intlTokens = Util.hasFormatToParts();

      try {
        zones = new Intl.DateTimeFormat('en', { timeZone: 'America/New_York' }).resolvedOptions().timeZone === 'America/New_York';
      } catch (e) {
        zones = false;
      }
    }

    return { intl: intl, intlTokens: intlTokens, zones: zones };
  };

  return Info;
}();

var MISSING_FTP = 'missing Intl.DateTimeFormat.formatToParts support';

function intUnit(regex) {
  var post = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (i) {
    return i;
  };

  return { regex: regex, deser: function deser(_ref) {
      var s = _ref[0];
      return post(parseInt(s));
    } };
}

function fixListRegex(s) {
  // make dots optional and also make them literal
  return s.replace(/\./, '\\.?');
}

function stripInsensitivities(s) {
  return s.replace(/\./, '').toLowerCase();
}

function oneOf(strings, startIndex) {
  if (strings === null) {
    return null;
  } else {
    return {
      regex: RegExp(strings.map(fixListRegex).join('|')),
      deser: function deser(_ref2) {
        var s = _ref2[0];
        return strings.findIndex(function (i) {
          return stripInsensitivities(s) === stripInsensitivities(i);
        }) + startIndex;
      }
    };
  }
}

function offset(regex, groups) {
  return { regex: regex, deser: function deser(_ref3) {
      var h = _ref3[1],
          m = _ref3[2];
      return Util.signedOffset(h, m);
    }, groups: groups };
}

function simple(regex) {
  return { regex: regex, deser: function deser(_ref4) {
      var s = _ref4[0];
      return s;
    } };
}

function unitForToken(token, loc) {
  var one = /\d/,
      two = /\d{2}/,
      three = /\d{3}/,
      four = /\d{4}/,
      oneOrTwo = /\d{1,2}/,
      oneToThree = /\d{1,3}/,
      twoToFour = /\d{2,4}/,
      literal = function literal(t) {
    return { regex: RegExp(t.val), deser: function deser(_ref5) {
        var s = _ref5[0];
        return s;
      }, literal: true };
  },
      unitate = function unitate(t) {
    if (token.literal) {
      return literal(t);
    }
    switch (t.val) {
      // era
      case 'G':
        return oneOf(loc.eras('short', false), 0);
      case 'GG':
        return oneOf(loc.eras('long', false), 0);
      // years
      case 'y':
        return intUnit(/\d{1,6}/);
      case 'yy':
        return intUnit(twoToFour, Util.untruncateYear);
      case 'yyyy':
        return intUnit(four);
      case 'yyyyy':
        return intUnit(/\d{4,6}/);
      case 'yyyyyy':
        return intUnit(/\d{6}/);
      // months
      case 'M':
        return intUnit(oneOrTwo);
      case 'MM':
        return intUnit(two);
      case 'MMM':
        return oneOf(loc.months('short', false, false), 1);
      case 'MMMM':
        return oneOf(loc.months('long', false, false), 1);
      case 'L':
        return intUnit(oneOrTwo);
      case 'LL':
        return intUnit(two);
      case 'LLL':
        return oneOf(loc.months('short', true, false), 1);
      case 'LLLL':
        return oneOf(loc.months('long', true, false), 1);
      // dates
      case 'd':
        return intUnit(oneOrTwo);
      case 'dd':
        return intUnit(two);
      // ordinals
      case 'o':
        return intUnit(oneToThree);
      case 'ooo':
        return intUnit(three);
      // time
      case 'HH':
        return intUnit(two);
      case 'H':
        return intUnit(oneOrTwo);
      case 'hh':
        return intUnit(two);
      case 'h':
        return intUnit(oneOrTwo);
      case 'mm':
        return intUnit(two);
      case 'm':
        return intUnit(oneOrTwo);
      case 's':
        return intUnit(oneOrTwo);
      case 'ss':
        return intUnit(two);
      case 'S':
        return intUnit(oneToThree);
      case 'SSS':
        return intUnit(three);
      case 'u':
        return simple(/\d{1,9}/);
      // meridiem
      case 'a':
        return oneOf(loc.meridiems(), 0);
      // weekYear (k)
      case 'kkkk':
        return intUnit(four);
      case 'kk':
        return intUnit(twoToFour, Util.untruncateYear);
      // weekNumber (W)
      case 'W':
        return intUnit(oneOrTwo);
      case 'WW':
        return intUnit(two);
      // weekdays
      case 'E':
      case 'c':
        return intUnit(one);
      case 'EEE':
        return oneOf(loc.weekdays('short', false, false), 1);
      case 'EEEE':
        return oneOf(loc.weekdays('long', false, false), 1);
      case 'ccc':
        return oneOf(loc.weekdays('short', true, false), 1);
      case 'cccc':
        return oneOf(loc.weekdays('long', true, false), 1);
      // offset/zone
      case 'Z':
      case 'ZZ':
        return offset(/([+-]\d{1,2})(?::(\d{2}))?/, 2);
      case 'ZZZ':
        return offset(/([+-]\d{1,2})(\d{2})?/, 2);
      // we don't support ZZZZ (PST) or ZZZZZ (Pacific Standard Time) in parsing
      // because we don't have any way to figure out what they are
      case 'z':
        return simple(/[A-Za-z_]{1,256}\/[A-Za-z_]{1,256}/);
      default:
        return literal(t);
    }
  };

  var unit = unitate(token) || {
    invalidReason: MISSING_FTP
  };

  unit.token = token;

  return unit;
}

function buildRegex(units) {
  var re = units.map(function (u) {
    return u.regex;
  }).reduce(function (f, r) {
    return f + '(' + r.source + ')';
  }, '');
  return ['^' + re + '$', units];
}

function match(input, regex, handlers) {
  var matches = input.match(regex);

  if (matches) {
    var all = {};
    var matchIndex = 1;
    for (var i in handlers) {
      if (handlers.hasOwnProperty(i)) {
        var h = handlers[i],
            groups = h.groups ? h.groups + 1 : 1;
        if (!h.literal && h.token) {
          all[h.token.val[0]] = h.deser(matches.slice(matchIndex, matchIndex + groups));
        }
        matchIndex += groups;
      }
    }
    return [matches, all];
  } else {
    return [matches, {}];
  }
}

function dateTimeFromMatches(matches) {
  var toField = function toField(token) {
    switch (token) {
      case 'S':
        return 'millisecond';
      case 's':
        return 'second';
      case 'm':
        return 'minute';
      case 'h':
      case 'H':
        return 'hour';
      case 'd':
        return 'day';
      case 'o':
        return 'ordinal';
      case 'L':
      case 'M':
        return 'month';
      case 'y':
        return 'year';
      case 'E':
      case 'c':
        return 'weekday';
      case 'W':
        return 'weekNumber';
      case 'k':
        return 'weekYear';
      default:
        return null;
    }
  };

  var zone = void 0;
  if (!Util.isUndefined(matches.Z)) {
    zone = new FixedOffsetZone(matches.Z);
  } else if (!Util.isUndefined(matches.z)) {
    zone = new IANAZone(matches.z);
  } else {
    zone = null;
  }

  if (!Util.isUndefined(matches.h)) {
    if (matches.h < 12 && matches.a === 1) {
      matches.h += 12;
    } else if (matches.h === 12 && matches.a === 0) {
      matches.h = 0;
    }
  }

  if (matches.G === 0 && matches.y) {
    matches.y = -matches.y;
  }

  if (!Util.isUndefined(matches.u)) {
    matches.S = Util.parseMillis(matches.u);
  }

  var vals = Object.keys(matches).reduce(function (r, k) {
    var f = toField(k);
    if (f) {
      r[f] = matches[k];
    }

    return r;
  }, {});

  return [vals, zone];
}

/**
 * @private
 */

var TokenParser = function () {
  function TokenParser(loc) {
    classCallCheck(this, TokenParser);

    this.loc = loc;
  }

  TokenParser.prototype.explainParse = function explainParse(input, format) {
    var _this = this;

    var tokens = Formatter.parseFormat(format),
        units = tokens.map(function (t) {
      return unitForToken(t, _this.loc);
    }),
        disqualifyingUnit = units.find(function (t) {
      return t.invalidReason;
    });

    if (disqualifyingUnit) {
      return { input: input, tokens: tokens, invalidReason: disqualifyingUnit.invalidReason };
    } else {
      var _buildRegex = buildRegex(units),
          regexString = _buildRegex[0],
          handlers = _buildRegex[1],
          regex = RegExp(regexString, 'i'),
          _match = match(input, regex, handlers),
          rawMatches = _match[0],
          matches = _match[1],
          _ref6 = matches ? dateTimeFromMatches(matches) : [null, null],
          result = _ref6[0],
          zone = _ref6[1];

      return { input: input, tokens: tokens, regex: regex, rawMatches: rawMatches, matches: matches, result: result, zone: zone };
    }
  };

  TokenParser.prototype.parseDateTime = function parseDateTime(input, format) {
    var _explainParse = this.explainParse(input, format),
        result = _explainParse.result,
        zone = _explainParse.zone,
        invalidReason = _explainParse.invalidReason;

    return [result, zone, invalidReason];
  };

  return TokenParser;
}();

var nonLeapLadder = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
var leapLadder = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

function dayOfWeek(year, month, day) {
  var js = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return js === 0 ? 7 : js;
}

function lastWeekNumber(weekYear) {
  var p1 = (weekYear + Math.floor(weekYear / 4) - Math.floor(weekYear / 100) + Math.floor(weekYear / 400)) % 7,
      last = weekYear - 1,
      p2 = (last + Math.floor(last / 4) - Math.floor(last / 100) + Math.floor(last / 400)) % 7;
  return p1 === 4 || p2 === 3 ? 53 : 52;
}

function computeOrdinal(year, month, day) {
  return day + (Util.isLeapYear(year) ? leapLadder : nonLeapLadder)[month - 1];
}

function uncomputeOrdinal(year, ordinal) {
  var table = Util.isLeapYear(year) ? leapLadder : nonLeapLadder,
      month0 = table.findIndex(function (i) {
    return i < ordinal;
  }),
      day = ordinal - table[month0];
  return { month: month0 + 1, day: day };
}

/**
 * @private
 */

var Conversions = function () {
  function Conversions() {
    classCallCheck(this, Conversions);
  }

  Conversions.gregorianToWeek = function gregorianToWeek(gregObj) {
    var year = gregObj.year,
        month = gregObj.month,
        day = gregObj.day,
        ordinal = computeOrdinal(year, month, day),
        weekday = dayOfWeek(year, month, day);


    var weekNumber = Math.floor((ordinal - weekday + 10) / 7),
        weekYear = void 0;

    if (weekNumber < 1) {
      weekYear = year - 1;
      weekNumber = lastWeekNumber(weekYear);
    } else if (weekNumber > lastWeekNumber(year)) {
      weekYear = year + 1;
      weekNumber = 1;
    } else {
      weekYear = year;
    }

    return Object.assign({ weekYear: weekYear, weekNumber: weekNumber, weekday: weekday }, Util.timeObject(gregObj));
  };

  Conversions.weekToGregorian = function weekToGregorian(weekData) {
    var weekYear = weekData.weekYear,
        weekNumber = weekData.weekNumber,
        weekday = weekData.weekday,
        weekdayOfJan4 = dayOfWeek(weekYear, 1, 4),
        daysInYear = Util.daysInYear(weekYear);

    var ordinal = weekNumber * 7 + weekday - weekdayOfJan4 - 3,
        year = void 0;

    if (ordinal < 1) {
      year = weekYear - 1;
      ordinal += Util.daysInYear(year);
    } else if (ordinal > daysInYear) {
      year = weekYear + 1;
      ordinal -= Util.daysInYear(year);
    } else {
      year = weekYear;
    }

    var _uncomputeOrdinal = uncomputeOrdinal(year, ordinal),
        month = _uncomputeOrdinal.month,
        day = _uncomputeOrdinal.day;

    return Object.assign({ year: year, month: month, day: day }, Util.timeObject(weekData));
  };

  Conversions.gregorianToOrdinal = function gregorianToOrdinal(gregData) {
    var year = gregData.year,
        month = gregData.month,
        day = gregData.day,
        ordinal = computeOrdinal(year, month, day);


    return Object.assign({ year: year, ordinal: ordinal }, Util.timeObject(gregData));
  };

  Conversions.ordinalToGregorian = function ordinalToGregorian(ordinalData) {
    var year = ordinalData.year,
        ordinal = ordinalData.ordinal,
        _uncomputeOrdinal2 = uncomputeOrdinal(year, ordinal),
        month = _uncomputeOrdinal2.month,
        day = _uncomputeOrdinal2.day;

    return Object.assign({ year: year, month: month, day: day }, Util.timeObject(ordinalData));
  };

  Conversions.hasInvalidWeekData = function hasInvalidWeekData(obj) {
    var validYear = Util.isNumber(obj.weekYear),
        validWeek = Util.numberBetween(obj.weekNumber, 1, lastWeekNumber(obj.weekYear)),
        validWeekday = Util.numberBetween(obj.weekday, 1, 7);

    if (!validYear) {
      return 'weekYear out of range';
    } else if (!validWeek) {
      return 'week out of range';
    } else if (!validWeekday) {
      return 'weekday out of range';
    } else return false;
  };

  Conversions.hasInvalidOrdinalData = function hasInvalidOrdinalData(obj) {
    var validYear = Util.isNumber(obj.year),
        validOrdinal = Util.numberBetween(obj.ordinal, 1, Util.daysInYear(obj.year));

    if (!validYear) {
      return 'year out of range';
    } else if (!validOrdinal) {
      return 'ordinal out of range';
    } else return false;
  };

  Conversions.hasInvalidGregorianData = function hasInvalidGregorianData(obj) {
    var validYear = Util.isNumber(obj.year),
        validMonth = Util.numberBetween(obj.month, 1, 12),
        validDay = Util.numberBetween(obj.day, 1, Util.daysInMonth(obj.year, obj.month));

    if (!validYear) {
      return 'year out of range';
    } else if (!validMonth) {
      return 'month out of range';
    } else if (!validDay) {
      return 'day out of range';
    } else return false;
  };

  Conversions.hasInvalidTimeData = function hasInvalidTimeData(obj) {
    var validHour = Util.numberBetween(obj.hour, 0, 23),
        validMinute = Util.numberBetween(obj.minute, 0, 59),
        validSecond = Util.numberBetween(obj.second, 0, 59),
        validMillisecond = Util.numberBetween(obj.millisecond, 0, 999);

    if (!validHour) {
      return 'hour out of range';
    } else if (!validMinute) {
      return 'minute out of range';
    } else if (!validSecond) {
      return 'second out of range';
    } else if (!validMillisecond) {
      return 'millisecond out of range';
    } else return false;
  };

  return Conversions;
}();

var INVALID = 'Invalid DateTime';
var INVALID_INPUT = 'invalid input';
var UNSUPPORTED_ZONE = 'unsupported zone';
var UNPARSABLE = 'unparsable';

// we cache week data on the DT object and this intermediates the cache
function possiblyCachedWeekData(dt) {
  if (dt.weekData === null) {
    dt.weekData = Conversions.gregorianToWeek(dt.c);
  }
  return dt.weekData;
}

// clone really means, "make a new object with these modifications". all "setters" really use this
// to create a new object while only changing some of the properties
function clone(inst, alts) {
  var current = {
    ts: inst.ts,
    zone: inst.zone,
    c: inst.c,
    o: inst.o,
    loc: inst.loc,
    invalidReason: inst.invalidReason
  };
  return new DateTime(Object.assign({}, current, alts, { old: current }));
}

// find the right offset a given local time. The o input is our guess, which determines which
// offset we'll pick in ambiguous cases (e.g. there are two 3 AMs b/c Fallback DST)
function fixOffset(localTS, o, tz) {
  // Our UTC time is just a guess because our offset is just a guess
  var utcGuess = localTS - o * 60 * 1000;

  // Test whether the zone matches the offset for this ts
  var o2 = tz.offset(utcGuess);

  // If so, offset didn't change and we're done
  if (o === o2) {
    return [utcGuess, o];
  }

  // If not, change the ts by the difference in the offset
  utcGuess -= (o2 - o) * 60 * 1000;

  // If that gives us the local time we want, we're done
  var o3 = tz.offset(utcGuess);
  if (o2 === o3) {
    return [utcGuess, o2];
  }

  // If it's different, we're in a hole time. The offset has changed, but the we don't adjust the time
  return [localTS - Math.min(o2, o3) * 60 * 1000, Math.max(o2, o3)];
}

// convert an epoch timestamp into a calendar object with the given offset
function tsToObj(ts, offset) {
  ts += offset * 60 * 1000;

  var d = new Date(ts);

  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    second: d.getUTCSeconds(),
    millisecond: d.getUTCMilliseconds()
  };
}

// covert a calendar object to a local timestamp (epoch, but with the offset baked in)
function objToLocalTS(obj) {
  var d = Date.UTC(obj.year, obj.month - 1, obj.day, obj.hour, obj.minute, obj.second, obj.millisecond);

  // javascript is stupid and i hate it
  if (obj.year < 100 && obj.year >= 0) {
    d = new Date(d);
    d.setUTCFullYear(obj.year);
  }
  return +d;
}

// convert a calendar object to a epoch timestamp
function objToTS(obj, offset, zone) {
  return fixOffset(objToLocalTS(obj), offset, zone);
}

// create a new DT instance by adding a duration, adjusting for DSTs
function adjustTime(inst, dur) {
  var oPre = inst.o,
      c = Object.assign({}, inst.c, {
    year: inst.c.year + dur.years,
    month: inst.c.month + dur.months,
    day: inst.c.day + dur.days + dur.weeks * 7
  }),
      millisToAdd = Duration.fromObject({
    hours: dur.hours,
    minutes: dur.minutes,
    seconds: dur.seconds,
    milliseconds: dur.milliseconds
  }).as('milliseconds'),
      localTS = objToLocalTS(c);

  var _fixOffset = fixOffset(localTS, oPre, inst.zone),
      ts = _fixOffset[0],
      o = _fixOffset[1];

  if (millisToAdd !== 0) {
    ts += millisToAdd;
    // that could have changed the offset by going over a DST, but we want to keep the ts the same
    o = inst.zone.offset(ts);
  }

  return { ts: ts, o: o };
}

// helper useful in turning the results of parsing into real dates
// by handling the zone options
function parseDataToDateTime(parsed, parsedZone, opts) {
  var setZone = opts.setZone,
      zone = opts.zone;

  if (parsed && Object.keys(parsed).length !== 0) {
    var interpretationZone = parsedZone || zone,
        inst = DateTime.fromObject(Object.assign(parsed, opts, {
      zone: interpretationZone
    }));
    return setZone ? inst : inst.setZone(zone);
  } else {
    return DateTime.invalid(UNPARSABLE);
  }
}

// if you want to output a technical format (e.g. RFC 2822), this helper
// helps handle the details
function toTechFormat(dt, format) {
  return dt.isValid ? Formatter.create(Locale.create('en-US')).formatDateTimeFromString(dt, format) : null;
}

// technical time formats (e.g. the time part of ISO 8601), take some options
// and this commonizes their handling
function toTechTimeFormat(dt, _ref) {
  var _ref$suppressSeconds = _ref.suppressSeconds,
      suppressSeconds = _ref$suppressSeconds === undefined ? false : _ref$suppressSeconds,
      _ref$suppressMillisec = _ref.suppressMilliseconds,
      suppressMilliseconds = _ref$suppressMillisec === undefined ? false : _ref$suppressMillisec,
      _ref$includeOffset = _ref.includeOffset,
      includeOffset = _ref$includeOffset === undefined ? true : _ref$includeOffset,
      _ref$includeZone = _ref.includeZone,
      includeZone = _ref$includeZone === undefined ? false : _ref$includeZone,
      _ref$spaceZone = _ref.spaceZone,
      spaceZone = _ref$spaceZone === undefined ? false : _ref$spaceZone;

  var fmt = 'HH:mm';

  if (!suppressSeconds || dt.second !== 0 || dt.millisecond !== 0) {
    fmt += ':ss';
    if (!suppressMilliseconds || dt.millisecond !== 0) {
      fmt += '.SSS';
    }
  }

  if ((includeZone || includeOffset) && spaceZone) {
    fmt += ' ';
  }

  if (includeZone) {
    fmt += 'z';
  } else if (includeOffset) {
    fmt += 'ZZ';
  }

  return toTechFormat(dt, fmt);
}

// defaults for unspecified units in the supported calendars
var defaultUnitValues = {
  month: 1,
  day: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
};
var defaultWeekUnitValues = {
  weekNumber: 1,
  weekday: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
};
var defaultOrdinalUnitValues = {
  ordinal: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
};

// Units in the supported calendars, sorted by bigness
var orderedUnits = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'];
var orderedWeekUnits = ['weekYear', 'weekNumber', 'weekday', 'hour', 'minute', 'second', 'millisecond'];
var orderedOrdinalUnits = ['year', 'ordinal', 'hour', 'minute', 'second', 'millisecond'];

// standardize case and plurality in units
function normalizeUnit(unit) {
  var ignoreUnknown = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var normalized = {
    year: 'year',
    years: 'year',
    month: 'month',
    months: 'month',
    day: 'day',
    days: 'day',
    hour: 'hour',
    hours: 'hour',
    minute: 'minute',
    minutes: 'minute',
    second: 'second',
    seconds: 'second',
    millisecond: 'millisecond',
    milliseconds: 'millisecond',
    weekday: 'weekday',
    weekdays: 'weekday',
    weeknumber: 'weekNumber',
    weeksnumber: 'weekNumber',
    weeknumbers: 'weekNumber',
    weekyear: 'weekYear',
    weekyears: 'weekYear',
    ordinal: 'ordinal'
  }[unit ? unit.toLowerCase() : unit];

  if (!ignoreUnknown && !normalized) throw new InvalidUnitError(unit);

  return normalized;
}

// this is a dumbed down version of fromObject() that runs about 60% faster
// but doesn't do any validation, makes a bunch of assumptions about what units
// are present, and so on.
function quickDT(obj, zone) {
  // assume we have the higher-order units
  for (var _iterator = orderedUnits, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref2;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref2 = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref2 = _i.value;
    }

    var u = _ref2;

    if (Util.isUndefined(obj[u])) {
      obj[u] = defaultUnitValues[u];
    }
  }

  var invalidReason = Conversions.hasInvalidGregorianData(obj) || Conversions.hasInvalidTimeData(obj);
  if (invalidReason) {
    return DateTime.invalid(invalidReason);
  }

  var tsNow = Settings.now(),
      offsetProvis = zone.offset(tsNow),
      _objToTS = objToTS(obj, offsetProvis, zone),
      ts = _objToTS[0],
      o = _objToTS[1];


  return new DateTime({
    ts: ts,
    zone: zone,
    o: o
  });
}

/**
 * A DateTime is an immutable data structure representing a specific date and time and accompanying methods. It contains class and instance methods for creating, parsing, interrogating, transforming, and formatting them.
 *
 * A DateTime comprises of:
 * * A timestamp. Each DateTime instance refers to a specific millisecond of the Unix epoch.
 * * A time zone. Each instance is considered in the context of a specific zone (by default the local system's zone).
 * * Configuration properties that effect how output strings are formatted, such as `locale`, `numberingSystem`, and `outputCalendar`.
 *
 * Here is a brief overview of the most commonly used functionality it provides:
 *
 * * **Creation**: To create a DateTime from its components, use one of its factory class methods: {@link local}, {@link utc}, and (most flexibly) {@link fromObject}. To create one from a standard string format, use {@link fromISO}, {@link fromHTTP}, and {@link fromRFC2822}. To create one from a custom string format, use {@link fromFormat}. To create one from a native JS date, use {@link fromJSDate}.
 * * **Gregorian calendar and time**: To examine the Gregorian properties of a DateTime individually (i.e as opposed to collectively through {@link toObject}), use the {@link year}, {@link month},
 * {@link day}, {@link hour}, {@link minute}, {@link second}, {@link millisecond} accessors.
 * * **Week calendar**: For ISO week calendar attributes, see the {@link weekYear}, {@link weekNumber}, and {@link weekday} accessors.
 * * **Configuration** See the {@link locale} and {@link numberingSystem} accessors.
 * * **Transformation**: To transform the DateTime into other DateTimes, use {@link set}, {@link reconfigure}, {@link setZone}, {@link setLocale}, {@link plus}, {@link minus}, {@link endOf}, {@link startOf}, {@link toUTC}, and {@link toLocal}.
 * * **Output**: To convert the DateTime to other representations, use the {@link toJSON}, {@link toISO}, {@link toHTTP}, {@link toObject}, {@link toRFC2822}, {@link toString}, {@link toLocaleString}, {@link toFormat}, {@link valueOf} and {@link toJSDate}.
 *
 * There's plenty others documented below. In addition, for more information on subtler topics like internationalization, time zones, alternative calendars, validity, and so on, see the external documentation.
 */
var DateTime = function () {
  /**
   * @access private
   */
  function DateTime(config) {
    classCallCheck(this, DateTime);

    var zone = config.zone || Settings.defaultZone,
        invalidReason = config.invalidReason || (Number.isNaN(config.ts) ? INVALID_INPUT : null) || (!zone.isValid ? UNSUPPORTED_ZONE : null);
    /**
     * @access private
     */
    this.ts = Util.isUndefined(config.ts) ? Settings.now() : config.ts;

    var c = null,
        o = null;
    if (!invalidReason) {
      var unchanged = config.old && config.old.ts === this.ts && config.old.zone.equals(zone);
      c = unchanged ? config.old.c : tsToObj(this.ts, zone.offset(this.ts));
      o = unchanged ? config.old.o : zone.offset(this.ts);
    }

    /**
     * @access private
     */
    this.zone = zone;
    /**
     * @access private
     */
    this.loc = config.loc || Locale.create();
    /**
     * @access private
     */
    this.invalid = invalidReason;
    /**
     * @access private
     */
    this.weekData = null;
    /**
     * @access private
     */
    this.c = c;
    /**
     * @access private
     */
    this.o = o;
  }

  // CONSTRUCT

  /**
   * Create a local DateTime
   * @param {number} year - The calendar year. If omitted (as in, call `local()` with no arguments), the current time will be used
   * @param {number} [month=1] - The month, 1-indexed
   * @param {number} [day=1] - The day of the month
   * @param {number} [hour=0] - The hour of the day, in 24-hour time
   * @param {number} [minute=0] - The minute of the hour, i.e. a number between 0 and 59
   * @param {number} [second=0] - The second of the minute, i.e. a number between 0 and 59
   * @param {number} [millisecond=0] - The millisecond of the second, i.e. a number between 0 and 999
   * @example DateTime.local()                            //~> now
   * @example DateTime.local(2017)                        //~> 2017-01-01T00:00:00
   * @example DateTime.local(2017, 3)                     //~> 2017-03-01T00:00:00
   * @example DateTime.local(2017, 3, 12)                 //~> 2017-03-12T00:00:00
   * @example DateTime.local(2017, 3, 12, 5)              //~> 2017-03-12T05:00:00
   * @example DateTime.local(2017, 3, 12, 5, 45)          //~> 2017-03-12T05:45:00
   * @example DateTime.local(2017, 3, 12, 5, 45, 10)      //~> 2017-03-12T05:45:10
   * @example DateTime.local(2017, 3, 12, 5, 45, 10, 765) //~> 2017-03-12T05:45:10.675
   * @return {DateTime}
   */


  DateTime.local = function local(year, month, day, hour, minute, second, millisecond) {
    if (Util.isUndefined(year)) {
      return new DateTime({ ts: Settings.now() });
    } else {
      return quickDT({
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second,
        millisecond: millisecond
      }, Settings.defaultZone);
    }
  };

  /**
   * Create a DateTime in UTC
   * @param {number} year - The calendar year. If omitted (as in, call `utc()` with no arguments), the current time will be used
   * @param {number} [month=1] - The month, 1-indexed
   * @param {number} [day=1] - The day of the month
   * @param {number} [hour=0] - The hour of the day, in 24-hour time
   * @param {number} [minute=0] - The minute of the hour, i.e. a number between 0 and 59
   * @param {number} [second=0] - The second of the minute, i.e. a number between 0 and 59
   * @param {number} [millisecond=0] - The millisecond of the second, i.e. a number between 0 and 999
   * @example DateTime.utc()                            //~> now
   * @example DateTime.utc(2017)                        //~> 2017-01-01T00:00:00Z
   * @example DateTime.utc(2017, 3)                     //~> 2017-03-01T00:00:00Z
   * @example DateTime.utc(2017, 3, 12)                 //~> 2017-03-12T00:00:00Z
   * @example DateTime.utc(2017, 3, 12, 5)              //~> 2017-03-12T05:00:00Z
   * @example DateTime.utc(2017, 3, 12, 5, 45)          //~> 2017-03-12T05:45:00Z
   * @example DateTime.utc(2017, 3, 12, 5, 45, 10)      //~> 2017-03-12T05:45:10Z
   * @example DateTime.utc(2017, 3, 12, 5, 45, 10, 765) //~> 2017-03-12T05:45:10.675Z
   * @return {DateTime}
   */


  DateTime.utc = function utc(year, month, day, hour, minute, second, millisecond) {
    if (Util.isUndefined(year)) {
      return new DateTime({
        ts: Settings.now(),
        zone: FixedOffsetZone.utcInstance
      });
    } else {
      return quickDT({
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second,
        millisecond: millisecond
      }, FixedOffsetZone.utcInstance);
    }
  };

  /**
   * Create an DateTime from a Javascript Date object. Uses the default zone.
   * @param {Date} date - a Javascript Date object
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @return {DateTime}
   */


  DateTime.fromJSDate = function fromJSDate(date) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return new DateTime({
      ts: Util.isDate(date) ? date.valueOf() : NaN,
      zone: Util.normalizeZone(options.zone),
      loc: Locale.fromObject(options)
    });
  };

  /**
   * Create an DateTime from a count of epoch milliseconds. Uses the default zone.
   * @param {number} milliseconds - a number of milliseconds since 1970 UTC
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
   * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} options.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @return {DateTime}
   */


  DateTime.fromMillis = function fromMillis(milliseconds) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return new DateTime({
      ts: milliseconds,
      zone: Util.normalizeZone(options.zone),
      loc: Locale.fromObject(options)
    });
  };

  /**
   * Create an DateTime from a Javascript object with keys like 'year' and 'hour' with reasonable defaults.
   * @param {Object} obj - the object to create the DateTime from
   * @param {number} obj.year - a year, such as 1987
   * @param {number} obj.month - a month, 1-12
   * @param {number} obj.day - a day of the month, 1-31, depending on the month
   * @param {number} obj.ordinal - day of the year, 1-365 or 366
   * @param {number} obj.weekYear - an ISO week year
   * @param {number} obj.weekNumber - an ISO week number, between 1 and 52 or 53, depending on the year
   * @param {number} obj.weekday - an ISO weekday, 1-7, where 1 is Monday and 7 is Sunday
   * @param {number} obj.hour - hour of the day, 0-23
   * @param {number} obj.minute - minute of the hour, 0-59
   * @param {number} obj.second - second of the minute, 0-59
   * @param {number} obj.millisecond - millisecond of the second, 0-999
   * @param {string|Zone} [obj.zone='local'] - interpret the numbers in the context of a particular zone. Can take any value taken as the first argument to setZone()
   * @param {string} [obj.locale='en-US'] - a locale to set on the resulting DateTime instance
   * @param {string} obj.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} obj.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @example DateTime.fromObject({ year: 1982, month: 5, day: 25}).toISODate() //=> '1982-05-25'
   * @example DateTime.fromObject({ year: 1982 }).toISODate() //=> '1982-01-01T00'
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }) //~> today at 10:26:06
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6, zone: 'utc' }),
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6, zone: 'local' })
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6, zone: 'America/New_York' })
   * @example DateTime.fromObject({ weekYear: 2016, weekNumber: 2, weekday: 3 }).toISODate() //=> '2016-01-13'
   * @return {DateTime}
   */


  DateTime.fromObject = function fromObject(obj) {
    var zoneToUse = Util.normalizeZone(obj.zone);
    if (!zoneToUse.isValid) {
      return DateTime.invalid(UNSUPPORTED_ZONE);
    }

    var tsNow = Settings.now(),
        offsetProvis = zoneToUse.offset(tsNow),
        normalized = Util.normalizeObject(obj, normalizeUnit, true),
        containsOrdinal = !Util.isUndefined(normalized.ordinal),
        containsGregorYear = !Util.isUndefined(normalized.year),
        containsGregorMD = !Util.isUndefined(normalized.month) || !Util.isUndefined(normalized.day),
        containsGregor = containsGregorYear || containsGregorMD,
        definiteWeekDef = normalized.weekYear || normalized.weekNumber,
        loc = Locale.fromObject(obj);

    // cases:
    // just a weekday -> this week's instance of that weekday, no worries
    // (gregorian data or ordinal) + (weekYear or weekNumber) -> error
    // (gregorian month or day) + ordinal -> error
    // otherwise just use weeks or ordinals or gregorian, depending on what's specified

    if ((containsGregor || containsOrdinal) && definiteWeekDef) {
      throw new ConflictingSpecificationError("Can't mix weekYear/weekNumber units with year/month/day or ordinals");
    }

    if (containsGregorMD && containsOrdinal) {
      throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");
    }

    var useWeekData = definiteWeekDef || normalized.weekday && !containsGregor;

    // configure ourselves to deal with gregorian dates or week stuff
    var units = void 0,
        defaultValues = void 0,
        objNow = tsToObj(tsNow, offsetProvis);
    if (useWeekData) {
      units = orderedWeekUnits;
      defaultValues = defaultWeekUnitValues;
      objNow = Conversions.gregorianToWeek(objNow);
    } else if (containsOrdinal) {
      units = orderedOrdinalUnits;
      defaultValues = defaultOrdinalUnitValues;
      objNow = Conversions.gregorianToOrdinal(objNow);
    } else {
      units = orderedUnits;
      defaultValues = defaultUnitValues;
    }

    // set default values for missing stuff
    var foundFirst = false;
    for (var _iterator2 = units, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref3 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref3 = _i2.value;
      }

      var u = _ref3;

      var v = normalized[u];
      if (!Util.isUndefined(v)) {
        foundFirst = true;
      } else if (foundFirst) {
        normalized[u] = defaultValues[u];
      } else {
        normalized[u] = objNow[u];
      }
    }

    // make sure the values we have are in range
    var higherOrderInvalid = useWeekData ? Conversions.hasInvalidWeekData(normalized) : containsOrdinal ? Conversions.hasInvalidOrdinalData(normalized) : Conversions.hasInvalidGregorianData(normalized),
        invalidReason = higherOrderInvalid || Conversions.hasInvalidTimeData(normalized);

    if (invalidReason) {
      return DateTime.invalid(invalidReason);
    }

    // compute the actual time
    var gregorian = useWeekData ? Conversions.weekToGregorian(normalized) : containsOrdinal ? Conversions.ordinalToGregorian(normalized) : normalized,
        _objToTS2 = objToTS(gregorian, offsetProvis, zoneToUse),
        tsFinal = _objToTS2[0],
        offsetFinal = _objToTS2[1],
        inst = new DateTime({
      ts: tsFinal,
      zone: zoneToUse,
      o: offsetFinal,
      loc: loc
    });

    // gregorian data + weekday serves only to validate
    if (normalized.weekday && containsGregor && obj.weekday !== inst.weekday) {
      return DateTime.invalid('mismatched weekday');
    }

    return inst;
  };

  /**
   * Create a DateTime from an ISO 8601 string
   * @param {string} text - the ISO string
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the time to this zone
   * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='en-US'] - a locale to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @example DateTime.fromISO('2016-05-25T09:08:34.123')
   * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00')
   * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00', {setZone: true})
   * @example DateTime.fromISO('2016-05-25T09:08:34.123', {zone: 'utc'})
   * @example DateTime.fromISO('2016-W05-4')
   * @return {DateTime}
   */


  DateTime.fromISO = function fromISO(text) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _RegexParser$parseISO = RegexParser.parseISODate(text),
        vals = _RegexParser$parseISO[0],
        parsedZone = _RegexParser$parseISO[1];

    return parseDataToDateTime(vals, parsedZone, opts);
  };

  /**
   * Create a DateTime from an RFC 2822 string
   * @param {string} text - the RFC 2822 string
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - convert the time to this zone. Since the offset is always specified in the string itself, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
   * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='en-US'] - a locale to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @example DateTime.fromRFC2822('25 Nov 2016 13:23:12 GMT')
   * @example DateTime.fromRFC2822('Tue, 25 Nov 2016 13:23:12 +0600')
   * @example DateTime.fromRFC2822('25 Nov 2016 13:23 Z')
   * @return {DateTime}
   */


  DateTime.fromRFC2822 = function fromRFC2822(text) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _RegexParser$parseRFC = RegexParser.parseRFC2822Date(text),
        vals = _RegexParser$parseRFC[0],
        parsedZone = _RegexParser$parseRFC[1];

    return parseDataToDateTime(vals, parsedZone, opts);
  };

  /**
   * Create a DateTime from an HTTP header date
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
   * @param {string} text - the HTTP header date
   * @param {object} options - options to affect the creation
   * @param {string|Zone} [options.zone='local'] - convert the time to this zone. Since HTTP dates are always in UTC, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
   * @param {boolean} [options.setZone=false] - override the zone with the fixed-offset zone specified in the string. For HTTP dates, this is always UTC, so this option is equivalent to setting the `zone` option to 'utc', but this option is included for consistency with similar methods.
   * @param {string} [options.locale='en-US'] - a locale to set on the resulting DateTime instance
   * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} options.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @example DateTime.fromHTTP('Sun, 06 Nov 1994 08:49:37 GMT')
   * @example DateTime.fromHTTP('Sunday, 06-Nov-94 08:49:37 GMT')
   * @example DateTime.fromHTTP('Sun Nov  6 08:49:37 1994')
   * @return {DateTime}
   */


  DateTime.fromHTTP = function fromHTTP(text) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _RegexParser$parseHTT = RegexParser.parseHTTPDate(text),
        vals = _RegexParser$parseHTT[0],
        parsedZone = _RegexParser$parseHTT[1];

    return parseDataToDateTime(vals, parsedZone, options);
  };

  /**
   * Create a DateTime from an input string and format string
   * Defaults to en-US if no locale has been specified, regardless of the system's locale
   * @param {string} text - the string to parse
   * @param {string} fmt - the format the string is expected to be in (see description)
   * @param {Object} options - options to affect the creation
   * @param {string|Zone} [options.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
   * @param {boolean} [options.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
   * @param {string} [options.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
   * @param {string} options.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
   * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @return {DateTime}
   */


  DateTime.fromFormat = function fromFormat(text, fmt) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (Util.isUndefined(text) || Util.isUndefined(fmt)) {
      throw new InvalidArgumentError('fromFormat requires an input string and a format');
    }

    var _options$locale = options.locale,
        locale = _options$locale === undefined ? null : _options$locale,
        _options$numberingSys = options.numberingSystem,
        numberingSystem = _options$numberingSys === undefined ? null : _options$numberingSys,
        parser = new TokenParser(Locale.fromOpts({ locale: locale, numberingSystem: numberingSystem, defaultToEN: true })),
        _parser$parseDateTime = parser.parseDateTime(text, fmt),
        vals = _parser$parseDateTime[0],
        parsedZone = _parser$parseDateTime[1],
        invalidReason = _parser$parseDateTime[2];

    if (invalidReason) {
      return DateTime.invalid(invalidReason);
    } else {
      return parseDataToDateTime(vals, parsedZone, options);
    }
  };

  /**
   * @deprecated use fromFormat instead
   */


  DateTime.fromString = function fromString(text, fmt) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return DateTime.fromFormat(text, fmt, opts);
  };

  /**
   * Create a DateTime from a SQL date, time, or datetime
   * Defaults to en-US if no locale has been specified, regardless of the system's locale
   * @param {string} text - the string to parse
   * @param {Object} options - options to affect the creation
   * @param {string|Zone} [options.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
   * @param {boolean} [options.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
   * @param {string} [options.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
   * @param {string} options.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
   * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @example DateTime.fromSQL('2017-05-15')
   * @example DateTime.fromSQL('2017-05-15 09:12:34')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342+06:00')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles', { setZone: true })
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342', { zone: 'America/Los_Angeles' })
   * @example DateTime.fromSQL('09:12:34.342')
   * @return {DateTime}
   */


  DateTime.fromSQL = function fromSQL(text) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _RegexParser$parseSQL = RegexParser.parseSQL(text),
        vals = _RegexParser$parseSQL[0],
        parsedZone = _RegexParser$parseSQL[1];

    return parseDataToDateTime(vals, parsedZone, options);
  };

  /**
   * Create an invalid DateTime.
   * @return {DateTime}
   */


  DateTime.invalid = function invalid(reason) {
    if (!reason) {
      throw new InvalidArgumentError('need to specify a reason the DateTime is invalid');
    }
    if (Settings.throwOnInvalid) {
      throw new InvalidDateTimeError(reason);
    } else {
      return new DateTime({ invalidReason: reason });
    }
  };

  // INFO

  /**
   * Get the value of unit.
   * @param {string} unit - a unit such as 'minute' or 'day'
   * @example DateTime.local(2017, 7, 4).get('month'); //=> 7
   * @example DateTime.local(2017, 7, 4).get('day'); //=> 4
   * @return {number}
   */


  DateTime.prototype.get = function get$$1(unit) {
    return this[unit];
  };

  /**
   * Returns whether the DateTime is valid. Invalid DateTimes occur when:
   * * The DateTime was created from invalid calendar information, such as the 13th month or February 30
   * * The DateTime was created by an operation on another invalid date
   * @return {boolean}
   */


  /**
   * Returns the resolved Intl options for this DateTime.
   * This is useful in understanding the behavior of formatting methods
   * @param {object} opts - the same options as toLocaleString
   * @return {object}
   */
  DateTime.prototype.resolvedLocaleOpts = function resolvedLocaleOpts() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _Formatter$create$res = Formatter.create(this.loc.clone(opts), opts).resolvedOptions(this),
        locale = _Formatter$create$res.locale,
        numberingSystem = _Formatter$create$res.numberingSystem,
        calendar = _Formatter$create$res.calendar;

    return { locale: locale, numberingSystem: numberingSystem, outputCalendar: calendar };
  };

  // TRANSFORM

  /**
   * "Set" the DateTime's zone to UTC. Returns a newly-constructed DateTime.
   *
   * Equivalent to {@link setZone}('utc')
   * @param {number} [offset=0] - optionally, an offset from UTC in minutes
   * @param {object} [opts={}] - options to pass to `setZone()`
   * @return {DateTime}
   */


  DateTime.prototype.toUTC = function toUTC() {
    var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return this.setZone(FixedOffsetZone.instance(offset), opts);
  };

  /**
   * "Set" the DateTime's zone to the host's local zone. Returns a newly-constructed DateTime.
   *
   * Equivalent to `setZone('local')`
   * @return {DateTime}
   */


  DateTime.prototype.toLocal = function toLocal() {
    return this.setZone(new LocalZone());
  };

  /**
   * "Set" the DateTime's zone to specified zone. Returns a newly-constructed DateTime.
   *
   * By default, the setter keeps the underlying time the same (as in, the same UTC timestamp), but the new instance will report different local times and consider DSTs when making computations, as with {@link plus}. You may wish to use {@link toLocal} and {@link toUTC} which provide simple convenience wrappers for commonly used zones.
   * @param {string|Zone} [zone='local'] - a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'utc+3', or the strings 'local' or 'utc'. You may also supply an instance of a {@link Zone} class.
   * @param {object} opts - options
   * @param {boolean} [opts.keepLocalTime=false] - If true, adjust the underlying time so that the local time stays the same, but in the target zone. You should rarely need this.
   * @return {DateTime}
   */


  DateTime.prototype.setZone = function setZone(zone) {
    var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref4$keepLocalTime = _ref4.keepLocalTime,
        keepLocalTime = _ref4$keepLocalTime === undefined ? false : _ref4$keepLocalTime,
        _ref4$keepCalendarTim = _ref4.keepCalendarTime,
        keepCalendarTime = _ref4$keepCalendarTim === undefined ? false : _ref4$keepCalendarTim;

    zone = Util.normalizeZone(zone);
    if (zone.equals(this.zone)) {
      return this;
    } else if (!zone.isValid) {
      return DateTime.invalid(UNSUPPORTED_ZONE);
    } else {
      var newTS = keepLocalTime || keepCalendarTime // keepCalendarTime is the deprecated name for keepLocalTime
      ? this.ts + (this.o - zone.offset(this.ts)) * 60 * 1000 : this.ts;
      return clone(this, { ts: newTS, zone: zone });
    }
  };

  /**
   * "Set" the locale, numberingSystem, or outputCalendar. Returns a newly-constructed DateTime.
   * @param {object} properties - the properties to set
   * @example DateTime.local(2017, 5, 25).reconfigure({ locale: 'en-GB' })
   * @return {DateTime}
   */


  DateTime.prototype.reconfigure = function reconfigure() {
    var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        locale = _ref5.locale,
        numberingSystem = _ref5.numberingSystem,
        outputCalendar = _ref5.outputCalendar;

    var loc = this.loc.clone({ locale: locale, numberingSystem: numberingSystem, outputCalendar: outputCalendar });
    return clone(this, { loc: loc });
  };

  /**
   * "Set" the locale. Returns a newly-constructed DateTime.
   * Just a convenient alias for reconfigure({ locale })
   * @example DateTime.local(2017, 5, 25).setLocale('en-GB')
   * @return {DateTime}
   */


  DateTime.prototype.setLocale = function setLocale(locale) {
    return this.reconfigure({ locale: locale });
  };

  /**
   * "Set" the values of specified units. Returns a newly-constructed DateTime.
   * You can only set units with this method; for "setting" metadata, see {@link reconfigure} and {@link setZone}.
   * @param {object} values - a mapping of units to numbers
   * @example dt.set({ year: 2017 })
   * @example dt.set({ hour: 8, minute: 30 })
   * @example dt.set({ weekday: 5 })
   * @example dt.set({ year: 2005, ordinal: 234 })
   * @return {DateTime}
   */


  DateTime.prototype.set = function set$$1(values) {
    if (!this.isValid) return this;

    var normalized = Util.normalizeObject(values, normalizeUnit),
        settingWeekStuff = !Util.isUndefined(normalized.weekYear) || !Util.isUndefined(normalized.weekNumber) || !Util.isUndefined(normalized.weekday);

    var mixed = void 0;
    if (settingWeekStuff) {
      mixed = Conversions.weekToGregorian(Object.assign(Conversions.gregorianToWeek(this.c), normalized));
    } else if (!Util.isUndefined(normalized.ordinal)) {
      mixed = Conversions.ordinalToGregorian(Object.assign(Conversions.gregorianToOrdinal(this.c), normalized));
    } else {
      mixed = Object.assign(this.toObject(), normalized);

      // if we didn't set the day but we ended up on an overflow date,
      // use the last day of the right month
      if (Util.isUndefined(normalized.day)) {
        mixed.day = Math.min(Util.daysInMonth(mixed.year, mixed.month), mixed.day);
      }
    }

    var _objToTS3 = objToTS(mixed, this.o, this.zone),
        ts = _objToTS3[0],
        o = _objToTS3[1];

    return clone(this, { ts: ts, o: o });
  };

  /**
   * Add a period of time to this DateTime and return the resulting DateTime
   *
   * Adding hours, minutes, seconds, or milliseconds increases the timestamp by the right number of milliseconds. Adding days, months, or years shifts the calendar, accounting for DSTs and leap years along the way. Thus, `dt.plus({ hours: 24 })` may result in a different time than `dt.plus({ days: 1 })` if there's a DST shift in between.
   * @param {Duration|number|object} duration - The amount to add. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @example DateTime.local().plus(123) //~> in 123 milliseconds
   * @example DateTime.local().plus({ minutes: 15 }) //~> in 15 minutes
   * @example DateTime.local().plus({ days: 1 }) //~> this time tomorrow
   * @example DateTime.local().plus({ days: -1 }) //~> this time yesterday
   * @example DateTime.local().plus({ hours: 3, minutes: 13 }) //~> in 1 hr, 13 min
   * @example DateTime.local().plus(Duration.fromObject({ hours: 3, minutes: 13 })) //~> in 1 hr, 13 min
   * @return {DateTime}
   */


  DateTime.prototype.plus = function plus(duration) {
    if (!this.isValid) return this;
    var dur = Util.friendlyDuration(duration);
    return clone(this, adjustTime(this, dur));
  };

  /**
   * Subtract a period of time to this DateTime and return the resulting DateTime
   * See {@link plus}
   * @param {Duration|number|object} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   @return {DateTime}
  */


  DateTime.prototype.minus = function minus(duration) {
    if (!this.isValid) return this;
    var dur = Util.friendlyDuration(duration).negate();
    return clone(this, adjustTime(this, dur));
  };

  /**
   * "Set" this DateTime to the beginning of a unit of time.
   * @param {string} unit - The unit to go to the beginning of. Can be 'year', 'month', 'day', 'hour', 'minute', 'second', or 'millisecond'.
   * @example DateTime.local(2014, 3, 3).startOf('month').toISODate(); //=> '2014-03-01'
   * @example DateTime.local(2014, 3, 3).startOf('year').toISODate(); //=> '2014-01-01'
   * @example DateTime.local(2014, 3, 3, 5, 30).startOf('day').toISOTime(); //=> '00:00.000-05:00'
   * @example DateTime.local(2014, 3, 3, 5, 30).startOf('hour').toISOTime(); //=> '05:00:00.000-05:00'
   * @return {DateTime}
   */


  DateTime.prototype.startOf = function startOf(unit) {
    if (!this.isValid) return this;
    var o = {},
        normalizedUnit = Duration.normalizeUnit(unit);
    switch (normalizedUnit) {
      case 'years':
        o.month = 1;
      // falls through
      case 'months':
        o.day = 1;
      // falls through
      case 'weeks':
      case 'days':
        o.hour = 0;
      // falls through
      case 'hours':
        o.minute = 0;
      // falls through
      case 'minutes':
        o.second = 0;
      // falls through
      case 'seconds':
        o.millisecond = 0;
        break;
      case 'milliseconds':
        break;
      default:
        throw new InvalidUnitError(unit);
    }

    if (normalizedUnit === 'weeks') {
      o.weekday = 1;
    }

    return this.set(o);
  };

  /**
   * "Set" this DateTime to the end (i.e. the last millisecond) of a unit of time
   * @param {string} unit - The unit to go to the end of. Can be 'year', 'month', 'day', 'hour', 'minute', 'second', or 'millisecond'.
   * @example DateTime.local(2014, 3, 3).endOf('month').toISO(); //=> '2014-03-03T00:00:00.000-05:00'
   * @example DateTime.local(2014, 3, 3).endOf('year').toISO(); //=> '2014-12-31T23:59:59.999-05:00'
   * @example DateTime.local(2014, 3, 3, 5, 30).endOf('day').toISO(); //=> '2014-03-03T23:59:59.999-05:00'
   * @example DateTime.local(2014, 3, 3, 5, 30).endOf('hour').toISO(); //=> '2014-03-03T05:59:59.999-05:00'
   * @return {DateTime}
   */


  DateTime.prototype.endOf = function endOf(unit) {
    var _startOf$plus;

    return this.isValid ? this.startOf(unit).plus((_startOf$plus = {}, _startOf$plus[unit] = 1, _startOf$plus)).minus(1) : this;
  };

  // OUTPUT

  /**
   * Returns a string representation of this DateTime formatted according to the specified format string.
   * **You may not want this.** See {@link toLocaleString} for a more flexible formatting tool. See the documentation for the specific format tokens supported.
   * Defaults to en-US if no locale has been specified, regardless of the system's locale
   * @param {string} fmt - the format string
   * @param {object} opts - options
   * @param {boolean} opts.round - round numerical values
   * @example DateTime.local().toFormat('yyyy LLL dd') //=> '2017 Apr 22'
   * @example DateTime.local().setLocale('fr').toFormat('yyyy LLL dd') //=> '2017 avr. 22'
   * @example DateTime.local().toFormat("HH 'hours and' mm 'minutes'") //=> '20 hours and 55 minutes'
   * @return {string}
   */


  DateTime.prototype.toFormat = function toFormat(fmt) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return this.isValid ? Formatter.create(this.loc.redefaultToEN(), opts).formatDateTimeFromString(this, fmt) : INVALID;
  };

  /**
   * Returns a localized string representing this date. Accepts the same options as the Intl.DateTimeFormat constructor and any presets defined by Luxon, such as `DateTime.DATE_FULL` or `DateTime.TIME_SIMPLE`.
   * The exact behavior of this method is browser-specific, but in general it will return an appropriate representation.
   * of the DateTime in the assigned locale.
   * Defaults to the system's locale if no locale has been specified
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param opts {object} - Intl.DateTimeFormat constructor options
   * @example DateTime.local().toLocaleString(); //=> 4/20/2017
   * @example DateTime.local().setLocale('en-gb').toLocaleString(); //=> '20/04/2017'
   * @example DateTime.local().toLocaleString(DateTime.DATE_FULL); //=> 'April 20, 2017'
   * @example DateTime.local().toLocaleString(DateTime.TIME_SIMPLE); //=> '11:32 AM'
   * @example DateTime.local().toLocaleString(DateTime.DATETIME_SHORT); //=> '4/20/2017, 11:32 AM'
   * @example DateTime.local().toLocaleString({weekday: 'long', month: 'long', day: '2-digit'}); //=> 'Thu, Apr 20'
   * @example DateTime.local().toLocaleString({weekday: 'long', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit'}); //=> 'Thu, Apr 20, 11:27'
   * @example DateTime.local().toLocaleString({hour: '2-digit', minute: '2-digit'}); //=> '11:32'
   * @return {string}
   */


  DateTime.prototype.toLocaleString = function toLocaleString() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Formats.DATE_SHORT;

    return this.isValid ? Formatter.create(this.loc.clone(opts), opts).formatDateTime(this) : INVALID;
  };

  /**
   * Returns an array of format "parts", i.e. individual tokens along with metadata. This is allows callers to post-process individual sections of the formatted output.
   * Defaults to the system's locale if no locale has been specified
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts
   * @param opts {object} - Intl.DateTimeFormat constructor options, same as `toLocaleString`.
   * @example DateTime.local().toLocaleString(); //=> [
   *                                    //=>   { type: 'day', value: '25' },
   *                                    //=>   { type: 'literal', value: '/' },
   *                                    //=>   { type: 'month', value: '05' },
   *                                    //=>   { type: 'literal', value: '/' },
   *                                    //=>   { type: 'year', value: '1982' }
   *                                    //=> ]
   */


  DateTime.prototype.toLocaleParts = function toLocaleParts() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return this.isValid ? Formatter.create(this.loc.clone(opts), opts).formatDateTimeParts(this) : [];
  };

  /**
   * Returns an ISO 8601-compliant string representation of this DateTime
   * @param {object} opts - options
   * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
   * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @example DateTime.utc(1982, 5, 25).toISO() //=> '1982-05-25T00:00:00.000Z'
   * @example DateTime.local().toISO() //=> '2017-04-22T20:47:05.335-04:00'
   * @example DateTime.local().toISO({ includeOffset: false }) //=> '2017-04-22T20:47:05.335'
   * @return {string}
   */


  DateTime.prototype.toISO = function toISO() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!this.isValid) {
      return null;
    }

    return this.toISODate() + 'T' + this.toISOTime(opts);
  };

  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's date component
   * @example DateTime.utc(1982, 5, 25).toISODate() //=> '1982-05-25'
   * @return {string}
   */


  DateTime.prototype.toISODate = function toISODate() {
    return toTechFormat(this, 'yyyy-MM-dd');
  };

  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's week date
   * @example DateTime.utc(1982, 5, 25).toISOWeekDate() //=> '1982-W21-2'
   * @return {string}
   */


  DateTime.prototype.toISOWeekDate = function toISOWeekDate() {
    return toTechFormat(this, "kkkk-'W'WW-c");
  };

  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's time component
   * @param {object} opts - options
   * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
   * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @example DateTime.utc().hour(7).minute(34).toISOTime() //=> '07:34:19.361Z'
   * @example DateTime.utc().hour(7).minute(34).toISOTime({ suppressSeconds: true }) //=> '07:34Z'
   * @return {string}
   */


  DateTime.prototype.toISOTime = function toISOTime() {
    var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref6$suppressMillise = _ref6.suppressMilliseconds,
        suppressMilliseconds = _ref6$suppressMillise === undefined ? false : _ref6$suppressMillise,
        _ref6$suppressSeconds = _ref6.suppressSeconds,
        suppressSeconds = _ref6$suppressSeconds === undefined ? false : _ref6$suppressSeconds,
        _ref6$includeOffset = _ref6.includeOffset,
        includeOffset = _ref6$includeOffset === undefined ? true : _ref6$includeOffset;

    return toTechTimeFormat(this, { suppressSeconds: suppressSeconds, suppressMilliseconds: suppressMilliseconds, includeOffset: includeOffset });
  };

  /**
   * Returns an RFC 2822-compatible string representation of this DateTime, always in UTC
   * @example DateTime.utc(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 +0000'
   * @example DateTime.local(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 -0400'
   * @return {string}
   */


  DateTime.prototype.toRFC2822 = function toRFC2822() {
    return toTechFormat(this, 'EEE, dd LLL yyyy hh:mm:ss ZZZ');
  };

  /**
   * Returns a string representation of this DateTime appropriate for use in HTTP headers.
   * Specifically, the string conforms to RFC 1123.
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
   * @example DateTime.utc(2014, 7, 13).toHTTP() //=> 'Sun, 13 Jul 2014 00:00:00 GMT'
   * @example DateTime.utc(2014, 7, 13, 19).toHTTP() //=> 'Sun, 13 Jul 2014 19:00:00 GMT'
   * @return {string}
   */


  DateTime.prototype.toHTTP = function toHTTP() {
    return toTechFormat(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
  };

  /**
   * Returns a string representation of this DateTime appropriate for use in SQL Date
   * @example DateTime.utc(2014, 7, 13).toSQLDate() //=> '2014-07-13'
   * @return {string}
   */


  DateTime.prototype.toSQLDate = function toSQLDate() {
    return toTechFormat(this, 'yyyy-MM-dd');
  };

  /**
   * Returns a string representation of this DateTime appropriate for use in SQL Time
   * @param {object} opts - options
   * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overides includeOffset.
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @example DateTime.utc().toSQL() //=> '05:15:16.345'
   * @example DateTime.local().toSQL() //=> '05:15:16.345 -04:00'
   * @example DateTime.local().toSQL({ includeOffset: false }) //=> '05:15:16.345'
   * @example DateTime.local().toSQL({ includeZone: false }) //=> '05:15:16.345 America/New_York'
   * @return {string}
   */


  DateTime.prototype.toSQLTime = function toSQLTime() {
    var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref7$includeOffset = _ref7.includeOffset,
        includeOffset = _ref7$includeOffset === undefined ? true : _ref7$includeOffset,
        _ref7$includeZone = _ref7.includeZone,
        includeZone = _ref7$includeZone === undefined ? false : _ref7$includeZone;

    return toTechTimeFormat(this, { includeOffset: includeOffset, includeZone: includeZone, spaceZone: true });
  };

  /**
   * Returns a string representation of this DateTime appropriate for use in SQL DateTime
   * @param {object} opts - options
   * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overrides includeOffset.
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @example DateTime.utc(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 Z'
   * @example DateTime.local(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 -04:00'
   * @example DateTime.local(2014, 7, 13).toSQL({ includeOffset: false }) //=> '2014-07-13 00:00:00.000'
   * @example DateTime.local(2014, 7, 13).toSQL({ includeZone: false }) //=> '2014-07-13 00:00:00.000 America/New_York'
   * @return {string}
   */


  DateTime.prototype.toSQL = function toSQL() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!this.isValid) {
      return null;
    }

    return this.toSQLDate() + ' ' + this.toSQLTime(opts);
  };

  /**
   * Returns a string representation of this DateTime appropriate for debugging
   * @return {string}
   */


  DateTime.prototype.toString = function toString() {
    return this.isValid ? this.toISO() : INVALID;
  };

  /**
   * Returns a string representation of this DateTime appropriate for the REPL.
   * @return {string}
   */


  DateTime.prototype.inspect = function inspect() {
    if (this.isValid) {
      return 'DateTime {\n  ts: ' + this.toISO() + ',\n  zone: ' + this.zone.name + ',\n  locale: ' + this.locale + ' }';
    } else {
      return 'DateTime { Invalid, reason: ' + this.invalidReason + ' }';
    }
  };

  /**
   * Returns the epoch milliseconds of this DateTime
   * @return {number}
   */


  DateTime.prototype.valueOf = function valueOf() {
    return this.isValid ? this.ts : NaN;
  };

  /**
   * Returns an ISO 8601 representation of this DateTime appropriate for use in JSON.
   * @return {string}
   */


  DateTime.prototype.toJSON = function toJSON() {
    return this.toISO();
  };

  /**
   * Returns a Javascript object with this DateTime's year, month, day, and so on.
   * @param opts - options for generating the object
   * @param {boolean} [opts.includeConfig=false] - include configuration attributes in the output
   * @example DateTime.local().toObject() //=> { year: 2017, month: 4, day: 22, hour: 20, minute: 49, second: 42, millisecond: 268 }
   * @return {object}
   */


  DateTime.prototype.toObject = function toObject() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!this.isValid) return {};

    var base = Object.assign({}, this.c);

    if (opts.includeConfig) {
      base.outputCalendar = this.outputCalendar;
      base.numberingSystem = this.loc.numberingSystem;
      base.locale = this.loc.locale;
    }
    return base;
  };

  /**
   * Returns a Javascript Date equivalent to this DateTime.
   * @return {Date}
   */


  DateTime.prototype.toJSDate = function toJSDate() {
    return new Date(this.isValid ? this.ts : NaN);
  };

  // COMPARE

  /**
   * Return the difference between two DateTimes as a Duration.
   * @param {DateTime} otherDateTime - the DateTime to compare this one to
   * @param {string|string[]} [unit=['milliseconds']] - the unit or array of units (such as 'hours' or 'days') to include in the duration.
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @example
   * var i1 = DateTime.fromISO('1982-05-25T09:45'),
   *     i2 = DateTime.fromISO('1983-10-14T10:30');
   * i2.diff(i1).toObject() //=> { milliseconds: 43807500000 }
   * i2.diff(i1, 'hours').toObject() //=> { hours: 12168.75 }
   * i2.diff(i1, ['months', 'days']).toObject() //=> { months: 16, days: 19.03125 }
   * i2.diff(i1, ['months', 'days', 'hours']).toObject() //=> { months: 16, days: 19, hours: 0.75 }
   * @return {Duration}
   */


  DateTime.prototype.diff = function diff(otherDateTime) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'milliseconds';
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (!this.isValid || !otherDateTime.isValid) return Duration.invalid(this.invalidReason || otherDateTime.invalidReason);

    var units = Util.maybeArray(unit).map(Duration.normalizeUnit);

    var flipped = otherDateTime.valueOf() > this.valueOf(),
        post = flipped ? otherDateTime : this,
        accum = {};

    var cursor = flipped ? this : otherDateTime,
        lowestOrder = null;

    if (units.indexOf('years') >= 0) {
      var dYear = post.year - cursor.year;

      cursor = cursor.set({ year: post.year });

      if (cursor > post) {
        cursor = cursor.minus({ years: 1 });
        dYear -= 1;
      }

      accum.years = dYear;
      lowestOrder = 'years';
    }

    if (units.indexOf('months') >= 0) {
      var _dYear = post.year - cursor.year;
      var dMonth = post.month - cursor.month + _dYear * 12;

      cursor = cursor.set({ year: post.year, month: post.month });

      if (cursor > post) {
        cursor = cursor.minus({ months: 1 });
        dMonth -= 1;
      }

      accum.months = dMonth;
      lowestOrder = 'months';
    }

    var computeDayDelta = function computeDayDelta() {
      var utcDayStart = function utcDayStart(dt) {
        return dt.toUTC(0, { keepLocalTime: true }).startOf('day').valueOf();
      },
          ms = utcDayStart(post) - utcDayStart(cursor);
      return Math.floor(Duration.fromMillis(ms, opts).shiftTo('days').days);
    };

    if (units.indexOf('weeks') >= 0) {
      var days = computeDayDelta();
      var weeks = (days - days % 7) / 7;
      cursor = cursor.plus({ weeks: weeks });

      if (cursor > post) {
        cursor = cursor.minus({ weeks: 1 });
        weeks -= 1;
      }

      accum.weeks = weeks;
      lowestOrder = 'weeks';
    }

    if (units.indexOf('days') >= 0) {
      var _days = computeDayDelta();
      cursor = cursor.set({
        year: post.year,
        month: post.month,
        day: post.day
      });

      if (cursor > post) {
        cursor = cursor.minus({ days: 1 });
        _days -= 1;
      }

      accum.days = _days;
      lowestOrder = 'days';
    }

    var remaining = Duration.fromMillis(post - cursor, opts),
        moreUnits = units.filter(function (u) {
      return ['hours', 'minutes', 'seconds', 'milliseconds'].indexOf(u) >= 0;
    }),
        shiftTo = moreUnits.length > 0 ? moreUnits : [lowestOrder],
        shifted = remaining.shiftTo.apply(remaining, shiftTo),
        merged = shifted.plus(Duration.fromObject(Object.assign(accum, opts)));

    return flipped ? merged.negate() : merged;
  };

  /**
   * Return the difference between this DateTime and right now.
   * See {@link diff}
   * @param {string|string[]} [unit=['milliseconds']] - the unit or units units (such as 'hours' or 'days') to include in the duration
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @return {Duration}
   */


  DateTime.prototype.diffNow = function diffNow() {
    var unit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'milliseconds';
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return this.diff(DateTime.local(), unit, opts);
  };

  /**
   * Return an Interval spanning between this DateTime and another DateTime
   * @param {DateTime} otherDateTime - the other end point of the Interval
   * @return {Duration}
   */


  DateTime.prototype.until = function until(otherDateTime) {
    return this.isValid ? Interval.fromDateTimes(this, otherDateTime) : this;
  };

  /**
   * Return whether this DateTime is in the same unit of time as another DateTime
   * @param {DateTime} otherDateTime - the other DateTime
   * @param {string} unit - the unit of time to check sameness on
   * @example DateTime.local().hasSame(otherDT, 'day'); //~> true if both the same calendar day
   * @return {boolean}
   */


  DateTime.prototype.hasSame = function hasSame(otherDateTime, unit) {
    if (!this.isValid) return false;
    if (unit === 'millisecond') {
      return this.valueOf() === otherDateTime.valueOf();
    } else {
      var inputMs = otherDateTime.valueOf();
      return this.startOf(unit) <= inputMs && inputMs <= this.endOf(unit);
    }
  };

  /**
   * Equality check
   * Two DateTimes are equal iff they represent the same millisecond
   * @param {DateTime} other - the other DateTime
   * @return {boolean}
   */


  DateTime.prototype.equals = function equals(other) {
    return this.isValid && other.isValid ? this.valueOf() === other.valueOf() && this.zone.equals(other.zone) && this.loc.equals(other.loc) : false;
  };

  /**
   * Return the min of several date times
   * @param {...DateTime} dateTimes - the DateTimes from which to choose the minimum
   * @return {DateTime} the min DateTime, or undefined if called with no argument
   */


  DateTime.min = function min() {
    for (var _len = arguments.length, dateTimes = Array(_len), _key = 0; _key < _len; _key++) {
      dateTimes[_key] = arguments[_key];
    }

    return Util.bestBy(dateTimes, function (i) {
      return i.valueOf();
    }, Math.min);
  };

  /**
   * Return the max of several date times
   * @param {...DateTime} dateTimes - the DateTimes from which to choose the maximum
   * @return {DateTime} the max DateTime, or undefined if called with no argument
   */


  DateTime.max = function max() {
    for (var _len2 = arguments.length, dateTimes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      dateTimes[_key2] = arguments[_key2];
    }

    return Util.bestBy(dateTimes, function (i) {
      return i.valueOf();
    }, Math.max);
  };

  // MISC

  /**
   * Explain how a string would be parsed by fromFormat()
   * @param {string} text - the string to parse
   * @param {string} fmt - the format the string is expected to be in (see description)
   * @param {object} options - options taken by fromFormat()
   * @return {object}
   */


  DateTime.fromFormatExplain = function fromFormatExplain(text, fmt) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var parser = new TokenParser(Locale.fromOpts(options));
    return parser.explainParse(text, fmt);
  };

  /**
   * @deprecated use fromFormatExplain instead
   */


  DateTime.fromStringExplain = function fromStringExplain(text, fmt) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return DateTime.fromFormatExplain(text, fmt, options);
  };

  // FORMAT PRESETS

  /**
   * {@link toLocaleString} format like 10/14/1983
   */


  createClass(DateTime, [{
    key: 'isValid',
    get: function get$$1() {
      return this.invalidReason === null;
    }

    /**
     * Returns an explanation of why this DateTime became invalid, or null if the DateTime is valid
     * @return {string}
     */

  }, {
    key: 'invalidReason',
    get: function get$$1() {
      return this.invalid;
    }

    /**
     * Get the locale of a DateTime, such 'en-GB'. The locale is used when formatting the DateTime
     *
     * @return {string}
     */

  }, {
    key: 'locale',
    get: function get$$1() {
      return this.loc.locale;
    }

    /**
     * Get the numbering system of a DateTime, such 'beng'. The numbering system is used when formatting the DateTime
     *
     * @return {string}
     */

  }, {
    key: 'numberingSystem',
    get: function get$$1() {
      return this.loc.numberingSystem;
    }

    /**
     * Get the output calendar of a DateTime, such 'islamic'. The output calendar is used when formatting the DateTime
     *
     * @return {string}
     */

  }, {
    key: 'outputCalendar',
    get: function get$$1() {
      return this.loc.outputCalendar;
    }

    /**
     * Get the name of the time zone.
     * @return {String}
     */

  }, {
    key: 'zoneName',
    get: function get$$1() {
      return this.zone.name;
    }

    /**
     * Get the year
     * @example DateTime.local(2017, 5, 25).year //=> 2017
     * @return {number}
     */

  }, {
    key: 'year',
    get: function get$$1() {
      return this.isValid ? this.c.year : NaN;
    }

    /**
     * Get the month (1-12).
     * @example DateTime.local(2017, 5, 25).month //=> 5
     * @return {number}
     */

  }, {
    key: 'month',
    get: function get$$1() {
      return this.isValid ? this.c.month : NaN;
    }

    /**
     * Get the day of the month (1-30ish).
     * @example DateTime.local(2017, 5, 25).day //=> 25
     * @return {number}
     */

  }, {
    key: 'day',
    get: function get$$1() {
      return this.isValid ? this.c.day : NaN;
    }

    /**
     * Get the hour of the day (0-23).
     * @example DateTime.local(2017, 5, 25, 9).hour //=> 9
     * @return {number}
     */

  }, {
    key: 'hour',
    get: function get$$1() {
      return this.isValid ? this.c.hour : NaN;
    }

    /**
     * Get the minute of the hour (0-59).
     * @example DateTime.local(2017, 5, 25, 9, 30).minute //=> 30
     * @return {number}
     */

  }, {
    key: 'minute',
    get: function get$$1() {
      return this.isValid ? this.c.minute : NaN;
    }

    /**
     * Get the second of the minute (0-59).
     * @example DateTime.local(2017, 5, 25, 9, 30, 52).second //=> 52
     * @return {number}
     */

  }, {
    key: 'second',
    get: function get$$1() {
      return this.isValid ? this.c.second : NaN;
    }

    /**
     * Get the millisecond of the second (0-999).
     * @example DateTime.local(2017, 5, 25, 9, 30, 52, 654).millisecond //=> 654
     * @return {number}
     */

  }, {
    key: 'millisecond',
    get: function get$$1() {
      return this.isValid ? this.c.millisecond : NaN;
    }

    /**
     * Get the week year
     * @see https://en.wikipedia.org/wiki/ISO_week_date
     * @example DateTime.local(2014, 11, 31).weekYear //=> 2015
     * @return {number}
     */

  }, {
    key: 'weekYear',
    get: function get$$1() {
      return this.isValid ? possiblyCachedWeekData(this).weekYear : NaN;
    }

    /**
     * Get the week number of the week year (1-52ish).
     * @see https://en.wikipedia.org/wiki/ISO_week_date
     * @example DateTime.local(2017, 5, 25).weekNumber //=> 21
     * @return {number}
     */

  }, {
    key: 'weekNumber',
    get: function get$$1() {
      return this.isValid ? possiblyCachedWeekData(this).weekNumber : NaN;
    }

    /**
     * Get the day of the week.
     * 1 is Monday and 7 is Sunday
     * @see https://en.wikipedia.org/wiki/ISO_week_date
     * @example DateTime.local(2014, 11, 31).weekday //=> 4
     * @return {number}
     */

  }, {
    key: 'weekday',
    get: function get$$1() {
      return this.isValid ? possiblyCachedWeekData(this).weekday : NaN;
    }

    /**
     * Get the ordinal (i.e. the day of the year)
     * @example DateTime.local(2017, 5, 25).ordinal //=> 145
     * @return {number|DateTime}
     */

  }, {
    key: 'ordinal',
    get: function get$$1() {
      return this.isValid ? Conversions.gregorianToOrdinal(this.c).ordinal : NaN;
    }

    /**
     * Get the human readable short month name, such as 'Oct'.
     * Defaults to the system's locale if no locale has been specified
     * @example DateTime.local(2017, 10, 30).monthShort //=> Oct
     * @return {string}
     */

  }, {
    key: 'monthShort',
    get: function get$$1() {
      return this.isValid ? Info.months('short', { locale: this.locale })[this.month - 1] : null;
    }

    /**
     * Get the human readable long month name, such as 'October'.
     * Defaults to the system's locale if no locale has been specified
     * @example DateTime.local(2017, 10, 30).monthLong //=> October
     * @return {string}
     */

  }, {
    key: 'monthLong',
    get: function get$$1() {
      return this.isValid ? Info.months('long', { locale: this.locale })[this.month - 1] : null;
    }

    /**
     * Get the human readable short weekday, such as 'Mon'.
     * Defaults to the system's locale if no locale has been specified
     * @example DateTime.local(2017, 10, 30).weekdayShort //=> Mon
     * @return {string}
     */

  }, {
    key: 'weekdayShort',
    get: function get$$1() {
      return this.isValid ? Info.weekdays('short', { locale: this.locale })[this.weekday - 1] : null;
    }

    /**
     * Get the human readable long weekday, such as 'Monday'.
     * Defaults to the system's locale if no locale has been specified
     * @example DateTime.local(2017, 10, 30).weekdayLong //=> Monday
     * @return {string}
     */

  }, {
    key: 'weekdayLong',
    get: function get$$1() {
      return this.isValid ? Info.weekdays('long', { locale: this.locale })[this.weekday - 1] : null;
    }

    /**
     * Get the UTC offset of this DateTime in minutes
     * @example DateTime.local().offset //=> -240
     * @example DateTime.utc().offset //=> 0
     * @return {number}
     */

  }, {
    key: 'offset',
    get: function get$$1() {
      return this.isValid ? this.zone.offset(this.ts) : NaN;
    }

    /**
     * Get the short human name for the zone's current offset, for example "EST" or "EDT".
     * Defaults to the system's locale if no locale has been specified
     * @return {String}
     */

  }, {
    key: 'offsetNameShort',
    get: function get$$1() {
      if (this.isValid) {
        return this.zone.offsetName(this.ts, {
          format: 'short',
          locale: this.locale
        });
      } else {
        return null;
      }
    }

    /**
     * Get the long human name for the zone's current offset, for example "Eastern Standard Time" or "Eastern Daylight Time".
     * Defaults to the system's locale if no locale has been specified
     * @return {String}
     */

  }, {
    key: 'offsetNameLong',
    get: function get$$1() {
      if (this.isValid) {
        return this.zone.offsetName(this.ts, {
          format: 'long',
          locale: this.locale
        });
      } else {
        return null;
      }
    }

    /**
     * Get whether this zone's offset ever changes, as in a DST.
     * @return {boolean}
     */

  }, {
    key: 'isOffsetFixed',
    get: function get$$1() {
      return this.zone.universal;
    }

    /**
     * Get whether the DateTime is in a DST.
     * @return {boolean}
     */

  }, {
    key: 'isInDST',
    get: function get$$1() {
      if (this.isOffsetFixed) {
        return false;
      } else {
        return this.offset > this.set({ month: 1 }).offset || this.offset > this.set({ month: 5 }).offset;
      }
    }

    /**
     * Returns true if this DateTime is in a leap year, false otherwise
     * @example DateTime.local(2016).isInLeapYear //=> true
     * @example DateTime.local(2013).isInLeapYear //=> false
     * @return {boolean}
     */

  }, {
    key: 'isInLeapYear',
    get: function get$$1() {
      return Util.isLeapYear(this.year);
    }

    /**
     * Returns the number of days in this DateTime's month
     * @example DateTime.local(2016, 2).daysInMonth //=> 29
     * @example DateTime.local(2016, 3).daysInMonth //=> 31
     * @return {number}
     */

  }, {
    key: 'daysInMonth',
    get: function get$$1() {
      return Util.daysInMonth(this.year, this.month);
    }

    /**
     * Returns the number of days in this DateTime's year
     * @example DateTime.local(2016).daysInYear //=> 366
     * @example DateTime.local(2013).daysInYear //=> 365
     * @return {number}
     */

  }, {
    key: 'daysInYear',
    get: function get$$1() {
      return this.isValid ? Util.daysInYear(this.year) : NaN;
    }
  }], [{
    key: 'DATE_SHORT',
    get: function get$$1() {
      return Formats.DATE_SHORT;
    }

    /**
     * {@link toLocaleString} format like 'Oct 14, 1983'
     */

  }, {
    key: 'DATE_MED',
    get: function get$$1() {
      return Formats.DATE_MED;
    }

    /**
     * {@link toLocaleString} format like 'October 14, 1983'
     */

  }, {
    key: 'DATE_FULL',
    get: function get$$1() {
      return Formats.DATE_FULL;
    }

    /**
     * {@link toLocaleString} format like 'Tuesday, October 14, 1983'
     */

  }, {
    key: 'DATE_HUGE',
    get: function get$$1() {
      return Formats.DATE_HUGE;
    }

    /**
     * {@link toLocaleString} format like '09:30 AM'. Only 12-hour if the locale is.
     */

  }, {
    key: 'TIME_SIMPLE',
    get: function get$$1() {
      return Formats.TIME_SIMPLE;
    }

    /**
     * {@link toLocaleString} format like '09:30:23 AM'. Only 12-hour if the locale is.
     */

  }, {
    key: 'TIME_WITH_SECONDS',
    get: function get$$1() {
      return Formats.TIME_WITH_SECONDS;
    }

    /**
     * {@link toLocaleString} format like '09:30:23 AM EDT'. Only 12-hour if the locale is.
     */

  }, {
    key: 'TIME_WITH_SHORT_OFFSET',
    get: function get$$1() {
      return Formats.TIME_WITH_SHORT_OFFSET;
    }

    /**
     * {@link toLocaleString} format like '09:30:23 AM Eastern Daylight Time'. Only 12-hour if the locale is.
     */

  }, {
    key: 'TIME_WITH_LONG_OFFSET',
    get: function get$$1() {
      return Formats.TIME_WITH_LONG_OFFSET;
    }

    /**
     * {@link toLocaleString} format like '09:30', always 24-hour.
     */

  }, {
    key: 'TIME_24_SIMPLE',
    get: function get$$1() {
      return Formats.TIME_24_SIMPLE;
    }

    /**
     * {@link toLocaleString} format like '09:30:23', always 24-hour.
     */

  }, {
    key: 'TIME_24_WITH_SECONDS',
    get: function get$$1() {
      return Formats.TIME_24_WITH_SECONDS;
    }

    /**
     * {@link toLocaleString} format like '09:30:23 EDT', always 24-hour.
     */

  }, {
    key: 'TIME_24_WITH_SHORT_OFFSET',
    get: function get$$1() {
      return Formats.TIME_24_WITH_SHORT_OFFSET;
    }

    /**
     * {@link toLocaleString} format like '09:30:23 Eastern Daylight Time', always 24-hour.
     */

  }, {
    key: 'TIME_24_WITH_LONG_OFFSET',
    get: function get$$1() {
      return Formats.TIME_24_WITH_LONG_OFFSET;
    }

    /**
     * {@link toLocaleString} format like '10/14/1983, 9:30 AM'. Only 12-hour if the locale is.
     */

  }, {
    key: 'DATETIME_SHORT',
    get: function get$$1() {
      return Formats.DATETIME_SHORT;
    }

    /**
     * {@link toLocaleString} format like '10/14/1983, 9:30:33 AM'. Only 12-hour if the locale is.
     */

  }, {
    key: 'DATETIME_SHORT_WITH_SECONDS',
    get: function get$$1() {
      return Formats.DATETIME_SHORT_WITH_SECONDS;
    }

    /**
     * {@link toLocaleString} format like 'Oct 14, 1983, 9:30 AM'. Only 12-hour if the locale is.
     */

  }, {
    key: 'DATETIME_MED',
    get: function get$$1() {
      return Formats.DATETIME_MED;
    }

    /**
     * {@link toLocaleString} format like 'Oct 14, 1983, 9:30:33 AM'. Only 12-hour if the locale is.
     */

  }, {
    key: 'DATETIME_MED_WITH_SECONDS',
    get: function get$$1() {
      return Formats.DATETIME_MED_WITH_SECONDS;
    }

    /**
     * {@link toLocaleString} format like 'October 14, 1983, 9:30 AM EDT'. Only 12-hour if the locale is.
     */

  }, {
    key: 'DATETIME_FULL',
    get: function get$$1() {
      return Formats.DATETIME_FULL;
    }

    /**
     * {@link toLocaleString} format like 'October 14, 1983, 9:303 AM EDT'. Only 12-hour if the locale is.
     */

  }, {
    key: 'DATETIME_FULL_WITH_SECONDS',
    get: function get$$1() {
      return Formats.DATETIME_FULL_WITH_SECONDS;
    }

    /**
     * {@link toLocaleString} format like 'Friday, October 14, 1983, 9:30 AM Eastern Daylight Time'. Only 12-hour if the locale is.
     */

  }, {
    key: 'DATETIME_HUGE',
    get: function get$$1() {
      return Formats.DATETIME_HUGE;
    }

    /**
     * {@link toLocaleString} format like 'Friday, October 14, 1983, 9:30:33 AM Eastern Daylight Time'. Only 12-hour if the locale is.
     */

  }, {
    key: 'DATETIME_HUGE_WITH_SECONDS',
    get: function get$$1() {
      return Formats.DATETIME_HUGE_WITH_SECONDS;
    }
  }]);
  return DateTime;
}();

exports.DateTime = DateTime;
exports.Duration = Duration;
exports.Interval = Interval;
exports.Info = Info;
exports.Zone = Zone;
exports.Settings = Settings;
//# sourceMappingURL=luxon.js.map


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOGMyYWQ3YjQ2NzZkNTEzYjQ0ZjkiLCJ3ZWJwYWNrOi8vLy4vX3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9fc3JjL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2x1eG9uL2J1aWxkL2Nqcy1icm93c2VyL2x1eG9uLmpzIl0sIm5hbWVzIjpbImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUVBQTJEO0FBQzNEO0FBQ0E7QUFDQSxXQUFHOztBQUVILG9EQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdEQUFnRDtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7OztBQUlBO0FBQ0Esc0RBQThDO0FBQzlDO0FBQ0E7QUFDQSxvQ0FBNEI7QUFDNUIscUNBQTZCO0FBQzdCLHlDQUFpQzs7QUFFakMsK0NBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDhDQUFzQztBQUN0QztBQUNBO0FBQ0EscUNBQTZCO0FBQzdCLHFDQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5QkFBaUIsOEJBQThCO0FBQy9DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7QUFFQSw0REFBb0Q7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQW1CLDJCQUEyQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBa0IsY0FBYztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBYSw0QkFBNEI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQWMsNEJBQTRCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esc0JBQWMsNEJBQTRCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUFnQix1Q0FBdUM7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUFnQix1Q0FBdUM7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0Isc0JBQXNCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLGdCQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFhLHdDQUF3QztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBLDhDQUFzQyx1QkFBdUI7O0FBRTdEO0FBQ0E7Ozs7Ozs7Ozs7QUNudEJBOztBQUNBOztBQUVBQSxRQUFRQyxHQUFSLENBQVksYUFBWixFOzs7Ozs7QUNIQSx5Qzs7Ozs7OztBQ0FBOztBQUVBLDhDQUE4QyxjQUFjOztBQUU1RDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7Ozs7Ozs7Ozs7OztBQVlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixrQkFBa0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7QUFVRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOzs7Ozs7Ozs7Ozs7QUFZQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsY0FBYztBQUNkOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixzQkFBc0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1DQUFtQyxNQUFNLFdBQVcsTUFBTTtBQUMxRDs7QUFFQTtBQUNBO0FBQ0Esd0NBQXdDLGlCQUFpQjtBQUN6RDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQSxvREFBb0QsSUFBSTtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNDQUFzQyxJQUFJLFNBQVMsRUFBRTtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUksc0JBQXNCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBSSxzQkFBc0I7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUksc0JBQXNCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJLHNCQUFzQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBSSxzQkFBc0I7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFD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O0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLElBQUk7QUFDVDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxrQ0FBa0MsNkJBQTZCO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0EseURBQXlELCtEQUErRDtBQUN4SDtBQUNBO0FBQ0EsT0FBTyx5RUFBeUU7QUFDaEYsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxpRkFBaUYsd0JBQXdCO0FBQ3pHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvRUFBb0UsYUFBYTtBQUNqRjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBLDBFQUEwRSxlQUFlO0FBQ3pGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUssS0FBSztBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNEZBQTRGLGVBQWU7QUFDM0c7QUFDQTs7QUFFQSwrSUFBK0k7QUFDL0k7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9FQUFvRSxlQUFlO0FBQ25GO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGVBQWUsaUJBQWlCO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLCtEQUErRCxJQUFJO0FBQ25FO0FBQ0E7QUFDQSwyQkFBMkIsRUFBRSxJQUFJLEVBQUU7QUFDbkMsd0JBQXdCLEVBQUU7QUFDMUIsMkJBQTJCLEVBQUUsT0FBTyxFQUFFO0FBQ3RDO0FBQ0E7QUFDQSx1QkFBdUIsRUFBRTtBQUN6QixnR0FBZ0csTUFBTSxXQUFXLE1BQU07QUFDdkg7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjs7QUFFQTtBQUNBO0FBQ0EsWUFBWTtBQUNaOztBQUVBOztBQUVBLCtCQUErQixJQUFJLFdBQVcsSUFBSSxXQUFXLElBQUksZUFBZSxJQUFJLFdBQVcsSUFBSSxXQUFXLElBQUksV0FBVyxJQUFJOztBQUVqSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHlEQUF5RCxJQUFJLDBEQUEwRCxJQUFJOztBQUUzSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSw0R0FBNEcsRUFBRTtBQUM5RztBQUNBLGtJQUFrSSxFQUFFOztBQUVwSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILFVBQVUsOERBQThEO0FBQ3hFLFlBQVksdUNBQXVDO0FBQ25ELFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtEQUFrRCwrQkFBK0I7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFKQUFxSjtBQUNySjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyVkFBMlYsMkJBQTJCLG9CQUFvQjtBQUMxWTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsMEJBQTBCLEdBQUcsMEJBQTBCLE1BQU0sdUJBQXVCO0FBQ2pJLDhCQUE4QixZQUFZLEdBQUcsYUFBYSxHQUFHLFlBQVksR0FBRyxXQUFXLEdBQUcsWUFBWSxHQUFHLGNBQWMsR0FBRyxjQUFjLEdBQUcsbUJBQW1CO0FBQzlKLDZCQUE2QixhQUFhLE1BQU0sc0JBQXNCO0FBQ3RFLHFFQUFxRSxXQUFXLEdBQUcsWUFBWSxHQUFHLGdCQUFnQixHQUFHLFVBQVUsR0FBRyxrQkFBa0IsR0FBRyxjQUFjLE9BQU8sYUFBYTtBQUN6TCx5RUFBeUUsU0FBUyxHQUFHLFlBQVksR0FBRyxlQUFlLE9BQU87QUFDMUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGNBQWM7QUFDZDs7O0FBR0E7QUFDQSw4Q0FBOEMsc0JBQXNCO0FBQ3BFOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEI7QUFDQSxvRUFBb0U7QUFDcEUseURBQXlEO0FBQ3pELHlEQUF5RDtBQUN6RCxjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYztBQUNkOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsMkJBQTJCLHdCQUF3QjtBQUNuRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsUUFBUTtBQUNyQixjQUFjO0FBQ2Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLG1DQUFtQyxnQ0FBZ0MsbUJBQW1CO0FBQ3RGLGNBQWM7QUFDZDs7O0FBR0E7QUFDQTs7QUFFQTs7QUFFQSwrQkFBK0I7O0FBRS9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyx3QkFBd0I7QUFDM0QsbUNBQW1DLHlCQUF5QjtBQUM1RCxtQ0FBbUMsWUFBWTtBQUMvQyxtQ0FBbUMsYUFBYTtBQUNoRCxjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDs7O0FBR0E7QUFDQTtBQUNBLHdCQUF3QiwwSEFBMEg7QUFDbEosS0FBSztBQUNMLHdCQUF3Qiw4Q0FBOEM7QUFDdEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSx1QkFBdUI7QUFDcEMsY0FBYztBQUNkOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsK0pBQStKO0FBQy9KOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDBCQUEwQixpQkFBaUI7QUFDM0M7O0FBRUE7QUFDQTtBQUNBLGFBQWEsdUJBQXVCO0FBQ3BDLGNBQWM7QUFDZDs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixtQ0FBbUMsa0JBQWtCO0FBQ3JELG1DQUFtQyxrQkFBa0I7QUFDckQsbUNBQW1DLGtCQUFrQjtBQUNyRCxjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLHVCQUF1QixjQUFjO0FBQ3JDLHVCQUF1Qix3QkFBd0I7QUFDL0MsY0FBYztBQUNkOzs7QUFHQTtBQUNBO0FBQ0EsMEJBQTBCLGdCQUFnQjtBQUMxQzs7QUFFQTtBQUNBO0FBQ0EsK0JBQStCLGtCQUFrQjtBQUNqRCxjQUFjO0FBQ2Q7OztBQUdBO0FBQ0Esc0ZBQXNGO0FBQ3RGO0FBQ0E7QUFDQTs7QUFFQSw4QkFBOEIsbURBQW1EO0FBQ2pGLGdCQUFnQjs7QUFFaEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixtQ0FBbUMsU0FBUztBQUM1QyxtQ0FBbUMsU0FBUztBQUM1QyxtQ0FBbUMsVUFBVTtBQUM3QyxjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUNBQW1DLHVCQUF1QiwrQkFBK0I7QUFDekYsbUNBQW1DLDBCQUEwQiwrQkFBK0I7QUFDNUYsY0FBYztBQUNkOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1DQUFtQyx3QkFBd0Isc0RBQXNEO0FBQ2pILGNBQWM7QUFDZDs7O0FBR0E7QUFDQSxvRUFBb0UsYUFBYTtBQUNqRjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxrQkFBa0I7QUFDbEIsd0JBQXdCO0FBQ3hCO0FBQ0E7O0FBRUEsK0pBQStKO0FBQy9KOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsZ0JBQWdCO0FBQzFDOztBQUVBO0FBQ0E7QUFDQSxtQ0FBbUMsd0JBQXdCLDRCQUE0QjtBQUN2RixjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLHlLQUF5SztBQUN6Szs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLDBCQUEwQixrQkFBa0I7QUFDNUM7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSwrSkFBK0o7QUFDL0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5RkFBeUYsZUFBZTtBQUN4RztBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsb0JBQW9CLEdBQUcsWUFBWSxHQUFHLGFBQWEsTUFBTSxjQUFjO0FBQ3JILHdCQUF3QixZQUFZLE1BQU0sVUFBVTtBQUNwRCxxREFBcUQsWUFBWSxHQUFHLGFBQWEsR0FBRyxjQUFjLEdBQUcsZUFBZSxHQUFHLGNBQWMsTUFBTSxlQUFlO0FBQzFKLHdFQUF3RSxVQUFVLEdBQUcsY0FBYyxHQUFHLGNBQWMsR0FBRyxvQkFBb0IsR0FBRyxZQUFZLEdBQUcsVUFBVSxHQUFHLFlBQVksR0FBRyxtQkFBbUIsTUFBTSxpQkFBaUI7QUFDbk8sa0VBQWtFLGFBQWEsR0FBRyxlQUFlLEdBQUcsaUJBQWlCLEdBQUcsZUFBZSxHQUFHO0FBQzFJLDBFQUEwRSxlQUFlLEdBQUcsWUFBWSxHQUFHLGVBQWUsT0FBTyxpQkFBaUI7QUFDbEo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLDJCQUEyQix3QkFBd0I7QUFDbkQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxxQkFBcUI7QUFDbEMsYUFBYSxxQkFBcUI7QUFDbEMsY0FBYztBQUNkOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLGFBQWEscUJBQXFCO0FBQ2xDLGFBQWEsdUJBQXVCO0FBQ3BDLGNBQWM7QUFDZDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxxQkFBcUI7QUFDbEMsYUFBYSx1QkFBdUI7QUFDcEMsY0FBYztBQUNkOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPLHlCQUF5QjtBQUM3QyxjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYztBQUNkO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLGFBQWE7QUFDMUI7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYztBQUNkOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsU0FBUztBQUN0QixjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFNBQVM7QUFDdEIsY0FBYztBQUNkOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCLGNBQWM7QUFDZDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLFNBQVM7QUFDdEIsYUFBYSxTQUFTO0FBQ3RCLGNBQWM7QUFDZDs7O0FBR0E7QUFDQSxxRkFBcUY7QUFDckY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsYUFBYTtBQUMxQixjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7O0FBRUEsd0VBQXdFLGFBQWE7QUFDckY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLHVCQUF1QjtBQUNwQyxjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGNBQWM7QUFDZDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsU0FBUztBQUN0QixjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCLGNBQWM7QUFDZDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsU0FBUztBQUN0QixjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFNBQVM7QUFDdEIsY0FBYztBQUNkOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCLGNBQWM7QUFDZDs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCLGNBQWM7QUFDZDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCLGNBQWM7QUFDZDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsV0FBVztBQUN4QixjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsV0FBVztBQUN4QixjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLHVCQUF1QixHQUFHLHVCQUF1QjtBQUNoRSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCw0SUFBNEk7QUFDNUk7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFlBQVk7QUFDekIsY0FBYztBQUNkOzs7QUFHQTtBQUNBOztBQUVBLDJFQUEyRSxlQUFlO0FBQzFGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkOzs7QUFHQTtBQUNBO0FBQ0Esd0JBQXdCLDBKQUEwSjtBQUNsTCxLQUFLO0FBQ0wsd0JBQXdCLDhDQUE4QztBQUN0RTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTyw2QkFBNkI7QUFDakQsY0FBYztBQUNkOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPLGtGQUFrRix3QkFBd0I7QUFDOUgsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixjQUFjO0FBQ2Q7OztBQUdBO0FBQ0Esc0ZBQXNGO0FBQ3RGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLGdCQUFnQjtBQUM3QixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLDZFQUE2RTtBQUM3RSxtRkFBbUY7QUFDbkYsaUdBQWlHO0FBQ2pHLDRHQUE0RztBQUM1RyxzRkFBc0Y7QUFDdEYsY0FBYztBQUNkOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsWUFBWTtBQUN6QixjQUFjO0FBQ2Q7QUFDQTtBQUNBOztBQUVBLG9EQUFvRCxZQUFZOztBQUVoRSwwREFBMEQsV0FBVztBQUNyRTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGNBQWM7QUFDZDs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLGtCQUFrQjtBQUN0RCxzQ0FBc0MsZUFBZTtBQUNyRCxtQ0FBbUMsNEJBQTRCO0FBQy9ELGNBQWM7QUFDZDs7O0FBR0E7QUFDQTs7QUFFQSxxRkFBcUY7QUFDckY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7O0FBRUEsc0ZBQXNGO0FBQ3RGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBLHNDQUFzQyxrQkFBa0I7QUFDeEQsc0NBQXNDLGVBQWU7QUFDckQsY0FBYztBQUNkOzs7QUFHQTtBQUNBOztBQUVBLHNGQUFzRjtBQUN0RjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYztBQUNkOzs7QUFHQTtBQUNBOztBQUVBLHNGQUFzRjtBQUN0RjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0EsOEJBQThCLGVBQWU7QUFDN0MsY0FBYztBQUNkOzs7QUFHQTtBQUNBLHNGQUFzRjtBQUN0RjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQSxpQ0FBaUMsZUFBZTtBQUNoRCxjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7O0FBRUEsc0ZBQXNGO0FBQ3RGO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQyxjQUFjO0FBQ2Q7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtDQUErQywrQkFBK0I7QUFDOUUsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQSxZQUFZO0FBQ1o7O0FBRUE7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IsRUFBRTtBQUNsQixrQkFBa0IsRUFBRTtBQUNwQixpQkFBaUIsRUFBRTtBQUNuQixxQkFBcUIsSUFBSTtBQUN6Qix1QkFBdUIsSUFBSTtBQUMzQixzQkFBc0IsSUFBSTtBQUMxQjtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0EsT0FBTztBQUNQLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsSUFBSTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLElBQUk7QUFDL0I7QUFDQSwyQkFBMkIsRUFBRTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixJQUFJO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLElBQUksU0FBUyxFQUFFO0FBQzlDO0FBQ0EsK0JBQStCLElBQUksS0FBSyxFQUFFO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxNQUFNLFlBQVksTUFBTTtBQUN6RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsdUJBQXVCO0FBQ3ZCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUcsSUFBSTs7QUFFUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLGNBQWM7QUFDZCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxVQUFVO0FBQ1Y7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBLDBCQUEwQiwrREFBK0Q7QUFDekY7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsMEJBQTBCLHFDQUFxQztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSwwQkFBMEIsK0JBQStCO0FBQ3pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwwQkFBMEIscUNBQXFDO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0Msa0JBQWtCLGVBQWU7QUFDdkU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFB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O0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQSxrREFBa0Qsc0JBQXNCO0FBQ3hFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsaURBQWlELHNCQUFzQjtBQUN2RTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLG9EQUFvRCxzQkFBc0I7QUFDMUU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQSxtREFBbUQsc0JBQXNCO0FBQ3pFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsdUNBQXVDLFdBQVcsb0NBQW9DLFdBQVc7QUFDakc7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEscUJBQXFCO0FBQzdCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEscUJBQXFCO0FBQzdCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEscUJBQXFCO0FBQzdCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEscUJBQXFCO0FBQzdCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEscUJBQXFCO0FBQzdCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEscUJBQXFCO0FBQzdCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEscUJBQXFCO0FBQzdCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEscUJBQXFCO0FBQzdCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEscUJBQXFCO0FBQzdCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEscUJBQXFCO0FBQzdCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEscUJBQXFCO0FBQzdCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEscUJBQXFCO0FBQzdCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEscUJBQXFCO0FBQzdCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEscUJBQXFCO0FBQzdCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEscUJBQXFCO0FBQzdCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEscUJBQXFCO0FBQzdCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEscUJBQXFCO0FBQzdCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEscUJBQXFCO0FBQzdCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEscUJBQXFCO0FBQzdCOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdGZ1bmN0aW9uIGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKSB7XG4gXHRcdGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHR9XG4gXHR2YXIgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2sgPSB3aW5kb3dbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdO1xuIFx0d2luZG93W1wid2VicGFja0hvdFVwZGF0ZVwiXSA9IFxyXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0XHRpZihwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHR9IDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XHJcbiBcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiBcdFx0c2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xyXG4gXHRcdHNjcmlwdC5jaGFyc2V0ID0gXCJ1dGYtOFwiO1xyXG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCI7XHJcbiBcdFx0O1xyXG4gXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRNYW5pZmVzdChyZXF1ZXN0VGltZW91dCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0cmVxdWVzdFRpbWVvdXQgPSByZXF1ZXN0VGltZW91dCB8fCAxMDAwMDtcclxuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiBcdFx0XHRpZih0eXBlb2YgWE1MSHR0cFJlcXVlc3QgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKFwiTm8gYnJvd3NlciBzdXBwb3J0XCIpKTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0UGF0aCA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNvblwiO1xyXG4gXHRcdFx0XHRyZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgcmVxdWVzdFBhdGgsIHRydWUpO1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnRpbWVvdXQgPSByZXF1ZXN0VGltZW91dDtcclxuIFx0XHRcdFx0cmVxdWVzdC5zZW5kKG51bGwpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChlcnIpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSByZXR1cm47XHJcbiBcdFx0XHRcdGlmKHJlcXVlc3Quc3RhdHVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0Ly8gdGltZW91dFxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiB0aW1lZCBvdXQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzID09PSA0MDQpIHtcclxuIFx0XHRcdFx0XHQvLyBubyB1cGRhdGUgYXZhaWxhYmxlXHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSgpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgIT09IDIwMCAmJiByZXF1ZXN0LnN0YXR1cyAhPT0gMzA0KSB7XHJcbiBcdFx0XHRcdFx0Ly8gb3RoZXIgZmFpbHVyZVxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiBmYWlsZWQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdHZhciB1cGRhdGUgPSBKU09OLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGUpIHtcclxuIFx0XHRcdFx0XHRcdHJlamVjdChlKTtcclxuIFx0XHRcdFx0XHRcdHJldHVybjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSh1cGRhdGUpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcblxuIFx0XHJcbiBcdFxyXG4gXHR2YXIgaG90QXBwbHlPblVwZGF0ZSA9IHRydWU7XHJcbiBcdHZhciBob3RDdXJyZW50SGFzaCA9IFwiOGMyYWQ3YjQ2NzZkNTEzYjQ0ZjlcIjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90UmVxdWVzdFRpbWVvdXQgPSAxMDAwMDtcclxuIFx0dmFyIGhvdEN1cnJlbnRNb2R1bGVEYXRhID0ge307XHJcbiBcdHZhciBob3RDdXJyZW50Q2hpbGRNb2R1bGU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRpZighbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xyXG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcclxuIFx0XHRcdGlmKG1lLmhvdC5hY3RpdmUpIHtcclxuIFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XSkge1xyXG4gXHRcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA8IDApXHJcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA8IDApXHJcbiBcdFx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcclxuIFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlcXVlc3QgKyBcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgKyBtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhyZXF1ZXN0KTtcclxuIFx0XHR9O1xyXG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XHJcbiBcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuIFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fTtcclxuIFx0XHRmb3IodmFyIG5hbWUgaW4gX193ZWJwYWNrX3JlcXVpcmVfXykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKF9fd2VicGFja19yZXF1aXJlX18sIG5hbWUpICYmIG5hbWUgIT09IFwiZVwiKSB7XHJcbiBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgT2JqZWN0RmFjdG9yeShuYW1lKSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcdGZuLmUgPSBmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicmVhZHlcIilcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRmaW5pc2hDaHVua0xvYWRpbmcoKTtcclxuIFx0XHRcdFx0dGhyb3cgZXJyO1xyXG4gXHRcdFx0fSk7XHJcbiBcdFxyXG4gXHRcdFx0ZnVuY3Rpb24gZmluaXNoQ2h1bmtMb2FkaW5nKCkge1xyXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XHJcbiBcdFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcclxuIFx0XHRcdFx0XHRpZighaG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYoaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9O1xyXG4gXHRcdHJldHVybiBmbjtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaG90ID0ge1xyXG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxyXG4gXHRcdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcclxuIFx0XHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXHJcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcclxuIFx0XHJcbiBcdFx0XHQvLyBNb2R1bGUgQVBJXHJcbiBcdFx0XHRhY3RpdmU6IHRydWUsXHJcbiBcdFx0XHRhY2NlcHQ6IGZ1bmN0aW9uKGRlcCwgY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRlY2xpbmU6IGZ1bmN0aW9uKGRlcCkge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBdID0gdHJ1ZTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxyXG4gXHRcdFx0Y2hlY2s6IGhvdENoZWNrLFxyXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxyXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGlmKCFsKSByZXR1cm4gaG90U3RhdHVzO1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxyXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXHJcbiBcdFx0fTtcclxuIFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSB1bmRlZmluZWQ7XHJcbiBcdFx0cmV0dXJuIGhvdDtcclxuIFx0fVxyXG4gXHRcclxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XHJcbiBcdHZhciBob3RTdGF0dXMgPSBcImlkbGVcIjtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcclxuIFx0XHRob3RTdGF0dXMgPSBuZXdTdGF0dXM7XHJcbiBcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0aG90U3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHQvLyB3aGlsZSBkb3dubG9hZGluZ1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcclxuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdERlZmVycmVkO1xyXG4gXHRcclxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXHJcbiBcdHZhciBob3RVcGRhdGUsIGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XHJcbiBcdFx0dmFyIGlzTnVtYmVyID0gKCtpZCkgKyBcIlwiID09PSBpZDtcclxuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwiaWRsZVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcclxuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiY2hlY2tcIik7XHJcbiBcdFx0cmV0dXJuIGhvdERvd25sb2FkTWFuaWZlc3QoaG90UmVxdWVzdFRpbWVvdXQpLnRoZW4oZnVuY3Rpb24odXBkYXRlKSB7XHJcbiBcdFx0XHRpZighdXBkYXRlKSB7XHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0XHRcdHJldHVybiBudWxsO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90QXZhaWxhYmxlRmlsZXNNYXAgPSB1cGRhdGUuYztcclxuIFx0XHRcdGhvdFVwZGF0ZU5ld0hhc2ggPSB1cGRhdGUuaDtcclxuIFx0XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZTogcmVzb2x2ZSxcclxuIFx0XHRcdFx0XHRyZWplY3Q6IHJlamVjdFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHRob3RVcGRhdGUgPSB7fTtcclxuIFx0XHRcdHZhciBjaHVua0lkID0gMDtcclxuIFx0XHRcdHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1sb25lLWJsb2Nrc1xyXG4gXHRcdFx0XHQvKmdsb2JhbHMgY2h1bmtJZCAqL1xyXG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRpZighaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxyXG4gXHRcdFx0cmV0dXJuO1xyXG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XHJcbiBcdFx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0aWYoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xyXG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzKys7XHJcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJyZWFkeVwiKTtcclxuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcclxuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XHJcbiBcdFx0aWYoIWRlZmVycmVkKSByZXR1cm47XHJcbiBcdFx0aWYoaG90QXBwbHlPblVwZGF0ZSkge1xyXG4gXHRcdFx0Ly8gV3JhcCBkZWZlcnJlZCBvYmplY3QgaW4gUHJvbWlzZSB0byBtYXJrIGl0IGFzIGEgd2VsbC1oYW5kbGVkIFByb21pc2UgdG9cclxuIFx0XHRcdC8vIGF2b2lkIHRyaWdnZXJpbmcgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcm5pbmcgaW4gQ2hyb21lLlxyXG4gXHRcdFx0Ly8gU2VlIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ2NTY2NlxyXG4gXHRcdFx0UHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0cmV0dXJuIGhvdEFwcGx5KGhvdEFwcGx5T25VcGRhdGUpO1xyXG4gXHRcdFx0fSkudGhlbihcclxuIFx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiBcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0KTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpIHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcclxuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIGNiO1xyXG4gXHRcdHZhciBpO1xyXG4gXHRcdHZhciBqO1xyXG4gXHRcdHZhciBtb2R1bGU7XHJcbiBcdFx0dmFyIG1vZHVsZUlkO1xyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcclxuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpLm1hcChmdW5jdGlvbihpZCkge1xyXG4gXHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxyXG4gXHRcdFx0XHRcdGlkOiBpZFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZighbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9tYWluKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0aWYoIXBhcmVudCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcclxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXHJcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xyXG4gXHRcdFx0fTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcclxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcclxuIFx0XHRcdFx0aWYoYS5pbmRleE9mKGl0ZW0pIDwgMClcclxuIFx0XHRcdFx0XHRhLnB1c2goaXRlbSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxyXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcclxuIFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIik7XHJcbiBcdFx0fTtcclxuIFx0XHJcbiBcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xyXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xyXG4gXHRcdFx0XHRpZihob3RVcGRhdGVbaWRdKSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xyXG4gXHRcdFx0XHRpZihyZXN1bHQuY2hhaW4pIHtcclxuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0c3dpdGNoKHJlc3VsdC50eXBlKSB7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIgaW4gXCIgKyByZXN1bHQucGFyZW50SWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25VbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EaXNwb3NlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcclxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoYWJvcnRFcnJvcikge1xyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xyXG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0FwcGx5KSB7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0XHRcdFx0Zm9yKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSwgcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvRGlzcG9zZSkge1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXHJcbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xyXG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XHJcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XHJcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0dmFyIGlkeDtcclxuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcclxuIFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRpZighbW9kdWxlKSBjb250aW51ZTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xyXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcclxuIFx0XHRcdFx0Y2IoZGF0YSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xyXG4gXHRcclxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXHJcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxyXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHdoZW4gZGlzcG9zaW5nIHRoZXJlIGlzIG5vIG5lZWQgdG8gY2FsbCBkaXNwb3NlIGhhbmRsZXJcclxuIFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHR2YXIgY2hpbGQgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZS5jaGlsZHJlbltqXV07XHJcbiBcdFx0XHRcdGlmKCFjaGlsZCkgY29udGludWU7XHJcbiBcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSB7XHJcbiBcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgZGVwZW5kZW5jeTtcclxuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobW9kdWxlKSB7XHJcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcclxuIFx0XHRcdFx0XHRcdGlkeCA9IG1vZHVsZS5jaGlsZHJlbi5pbmRleE9mKGRlcGVuZGVuY3kpO1xyXG4gXHRcdFx0XHRcdFx0aWYoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdCBpbiBcImFwcGx5XCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJhcHBseVwiKTtcclxuIFx0XHJcbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcclxuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcclxuIFx0XHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xyXG4gXHRcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcclxuIFx0XHRcdFx0XHRcdGlmKGNiKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKGNhbGxiYWNrcy5pbmRleE9mKGNiKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gXHRcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xyXG4gXHRcdFx0XHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldLFxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcclxuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycjIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcclxuIFx0XHRcdFx0XHRcdFx0XHRvcmdpbmFsRXJyb3I6IGVyciwgLy8gVE9ETyByZW1vdmUgaW4gd2VicGFjayA0XHJcbiBcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnIyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvYnVuZGxlcy9cIjtcblxuIFx0Ly8gX193ZWJwYWNrX2hhc2hfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5oID0gZnVuY3Rpb24oKSB7IHJldHVybiBob3RDdXJyZW50SGFzaDsgfTtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZSgwKShfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA4YzJhZDdiNDY3NmQ1MTNiNDRmOSIsImltcG9ydCAnLi9pbmRleC5zY3NzJ1xuaW1wb3J0ICdsdXhvbidcblxuY29uc29sZS5sb2coJ2hlbGxvIHdvcmxkJylcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9fc3JjL2luZGV4LmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL19zcmMvaW5kZXguc2Nzc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqO1xufSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG59O1xuXG5cblxuXG5cblxuXG5cblxuXG5cbnZhciBjbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59O1xuXG52YXIgY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gIH07XG59KCk7XG5cblxuXG5cblxuXG5cblxuXG52YXIgaW5oZXJpdHMgPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59O1xuXG5cblxuXG5cblxuXG5cblxuXG5cbnZhciBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuID0gZnVuY3Rpb24gKHNlbGYsIGNhbGwpIHtcbiAgaWYgKCFzZWxmKSB7XG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICB9XG5cbiAgcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7XG59O1xuXG4vLyB0aGVzZSBhcmVuJ3QgcmVhbGx5IHByaXZhdGUsIGJ1dCBub3IgYXJlIHRoZXkgcmVhbGx5IHVzZWZ1bCB0byBkb2N1bWVudFxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbnZhciBMdXhvbkVycm9yID0gZnVuY3Rpb24gKF9FcnJvcikge1xuICBpbmhlcml0cyhMdXhvbkVycm9yLCBfRXJyb3IpO1xuXG4gIGZ1bmN0aW9uIEx1eG9uRXJyb3IoKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgTHV4b25FcnJvcik7XG4gICAgcmV0dXJuIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX0Vycm9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9XG5cbiAgcmV0dXJuIEx1eG9uRXJyb3I7XG59KEVycm9yKTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5cblxudmFyIEludmFsaWREYXRlVGltZUVycm9yID0gZnVuY3Rpb24gKF9MdXhvbkVycm9yKSB7XG4gIGluaGVyaXRzKEludmFsaWREYXRlVGltZUVycm9yLCBfTHV4b25FcnJvcik7XG5cbiAgZnVuY3Rpb24gSW52YWxpZERhdGVUaW1lRXJyb3IocmVhc29uKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgSW52YWxpZERhdGVUaW1lRXJyb3IpO1xuICAgIHJldHVybiBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9MdXhvbkVycm9yLmNhbGwodGhpcywgJ0ludmFsaWQgRGF0ZVRpbWU6ICcgKyByZWFzb24pKTtcbiAgfVxuXG4gIHJldHVybiBJbnZhbGlkRGF0ZVRpbWVFcnJvcjtcbn0oTHV4b25FcnJvcik7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xudmFyIEludmFsaWRJbnRlcnZhbEVycm9yID0gZnVuY3Rpb24gKF9MdXhvbkVycm9yMikge1xuICBpbmhlcml0cyhJbnZhbGlkSW50ZXJ2YWxFcnJvciwgX0x1eG9uRXJyb3IyKTtcblxuICBmdW5jdGlvbiBJbnZhbGlkSW50ZXJ2YWxFcnJvcihyZWFzb24pIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBJbnZhbGlkSW50ZXJ2YWxFcnJvcik7XG4gICAgcmV0dXJuIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX0x1eG9uRXJyb3IyLmNhbGwodGhpcywgJ0ludmFsaWQgSW50ZXJ2YWw6ICcgKyByZWFzb24pKTtcbiAgfVxuXG4gIHJldHVybiBJbnZhbGlkSW50ZXJ2YWxFcnJvcjtcbn0oTHV4b25FcnJvcik7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xudmFyIEludmFsaWREdXJhdGlvbkVycm9yID0gZnVuY3Rpb24gKF9MdXhvbkVycm9yMykge1xuICBpbmhlcml0cyhJbnZhbGlkRHVyYXRpb25FcnJvciwgX0x1eG9uRXJyb3IzKTtcblxuICBmdW5jdGlvbiBJbnZhbGlkRHVyYXRpb25FcnJvcihyZWFzb24pIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBJbnZhbGlkRHVyYXRpb25FcnJvcik7XG4gICAgcmV0dXJuIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX0x1eG9uRXJyb3IzLmNhbGwodGhpcywgJ0ludmFsaWQgRHVyYXRpb246ICcgKyByZWFzb24pKTtcbiAgfVxuXG4gIHJldHVybiBJbnZhbGlkRHVyYXRpb25FcnJvcjtcbn0oTHV4b25FcnJvcik7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xudmFyIENvbmZsaWN0aW5nU3BlY2lmaWNhdGlvbkVycm9yID0gZnVuY3Rpb24gKF9MdXhvbkVycm9yNCkge1xuICBpbmhlcml0cyhDb25mbGljdGluZ1NwZWNpZmljYXRpb25FcnJvciwgX0x1eG9uRXJyb3I0KTtcblxuICBmdW5jdGlvbiBDb25mbGljdGluZ1NwZWNpZmljYXRpb25FcnJvcigpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBDb25mbGljdGluZ1NwZWNpZmljYXRpb25FcnJvcik7XG4gICAgcmV0dXJuIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX0x1eG9uRXJyb3I0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9XG5cbiAgcmV0dXJuIENvbmZsaWN0aW5nU3BlY2lmaWNhdGlvbkVycm9yO1xufShMdXhvbkVycm9yKTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG52YXIgSW52YWxpZFVuaXRFcnJvciA9IGZ1bmN0aW9uIChfTHV4b25FcnJvcjUpIHtcbiAgaW5oZXJpdHMoSW52YWxpZFVuaXRFcnJvciwgX0x1eG9uRXJyb3I1KTtcblxuICBmdW5jdGlvbiBJbnZhbGlkVW5pdEVycm9yKHVuaXQpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBJbnZhbGlkVW5pdEVycm9yKTtcbiAgICByZXR1cm4gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfTHV4b25FcnJvcjUuY2FsbCh0aGlzLCAnSW52YWxpZCB1bml0ICcgKyB1bml0KSk7XG4gIH1cblxuICByZXR1cm4gSW52YWxpZFVuaXRFcnJvcjtcbn0oTHV4b25FcnJvcik7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xudmFyIEludmFsaWRBcmd1bWVudEVycm9yID0gZnVuY3Rpb24gKF9MdXhvbkVycm9yNikge1xuICBpbmhlcml0cyhJbnZhbGlkQXJndW1lbnRFcnJvciwgX0x1eG9uRXJyb3I2KTtcblxuICBmdW5jdGlvbiBJbnZhbGlkQXJndW1lbnRFcnJvcigpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBJbnZhbGlkQXJndW1lbnRFcnJvcik7XG4gICAgcmV0dXJuIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX0x1eG9uRXJyb3I2LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9XG5cbiAgcmV0dXJuIEludmFsaWRBcmd1bWVudEVycm9yO1xufShMdXhvbkVycm9yKTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG52YXIgWm9uZUlzQWJzdHJhY3RFcnJvciA9IGZ1bmN0aW9uIChfTHV4b25FcnJvcjcpIHtcbiAgaW5oZXJpdHMoWm9uZUlzQWJzdHJhY3RFcnJvciwgX0x1eG9uRXJyb3I3KTtcblxuICBmdW5jdGlvbiBab25lSXNBYnN0cmFjdEVycm9yKCkge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFpvbmVJc0Fic3RyYWN0RXJyb3IpO1xuICAgIHJldHVybiBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9MdXhvbkVycm9yNy5jYWxsKHRoaXMsICdab25lIGlzIGFuIGFic3RyYWN0IGNsYXNzJykpO1xuICB9XG5cbiAgcmV0dXJuIFpvbmVJc0Fic3RyYWN0RXJyb3I7XG59KEx1eG9uRXJyb3IpO1xuXG4vKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IFwib2ZmXCIgKi9cbi8qKlxuICogQGludGVyZmFjZVxuKi9cbnZhciBab25lID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBab25lKCkge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFpvbmUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG9mZnNldCdzIGNvbW1vbiBuYW1lIChzdWNoIGFzIEVTVCkgYXQgdGhlIHNwZWNpZmllZCB0aW1lc3RhbXBcbiAgICogQGFic3RyYWN0XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0cyAtIEVwb2NoIG1pbGxpc2Vjb25kcyBmb3Igd2hpY2ggdG8gZ2V0IHRoZSBuYW1lXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIC0gT3B0aW9ucyB0byBhZmZlY3QgdGhlIGZvcm1hdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0cy5mb3JtYXQgLSBXaGF0IHN0eWxlIG9mIG9mZnNldCB0byByZXR1cm4uIEFjY2VwdHMgJ2xvbmcnIG9yICdzaG9ydCcuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLmxvY2FsZUNvZGUgLSBXaGF0IGxvY2FsZSB0byByZXR1cm4gdGhlIG9mZnNldCBuYW1lIGluLiBEZWZhdWx0cyB0byB1cy1lblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBab25lLm9mZnNldE5hbWUgPSBmdW5jdGlvbiBvZmZzZXROYW1lKHRzLCBvcHRzKSB7XG4gICAgdGhyb3cgbmV3IFpvbmVJc0Fic3RyYWN0RXJyb3IoKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBvZmZzZXQgaW4gbWludXRlcyBmb3IgdGhpcyB6b25lIGF0IHRoZSBzcGVjaWZpZWQgdGltZXN0YW1wLlxuICAgKiBAYWJzdHJhY3RcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRzIC0gRXBvY2ggbWlsbGlzZWNvbmRzIGZvciB3aGljaCB0byBjb21wdXRlIHRoZSBvZmZzZXRcbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cblxuXG4gIFpvbmUucHJvdG90eXBlLm9mZnNldCA9IGZ1bmN0aW9uIG9mZnNldCh0cykge1xuICAgIHRocm93IG5ldyBab25lSXNBYnN0cmFjdEVycm9yKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybiB3aGV0aGVyIHRoaXMgWm9uZSBpcyBlcXVhbCB0byBhbm90aGVyIHpvbmVyXG4gICAqIEBhYnN0cmFjdFxuICAgKiBAcGFyYW0ge1pvbmV9IG90aGVyWm9uZSAtIHRoZSB6b25lIHRvIGNvbXBhcmVcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG5cblxuICBab25lLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMob3RoZXJab25lKSB7XG4gICAgdGhyb3cgbmV3IFpvbmVJc0Fic3RyYWN0RXJyb3IoKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJuIHdoZXRoZXIgdGhpcyBab25lIGlzIHZhbGlkLlxuICAgKiBAYWJzdHJhY3RcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG5cblxuICBjcmVhdGVDbGFzcyhab25lLCBbe1xuICAgIGtleTogJ3R5cGUnLFxuXG4gICAgLyoqXG4gICAgICogVGhlIHR5cGUgb2Ygem9uZVxuICAgICAqIEBhYnN0cmFjdFxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHRocm93IG5ldyBab25lSXNBYnN0cmFjdEVycm9yKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhpcyB6b25lLlxuICAgICAqIEBhYnN0cmFjdFxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnbmFtZScsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICB0aHJvdyBuZXcgWm9uZUlzQWJzdHJhY3RFcnJvcigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2hldGhlciB0aGUgb2Zmc2V0IGlzIGtub3duIHRvIGJlIGZpeGVkIGZvciB0aGUgd2hvbGUgeWVhci5cbiAgICAgKiBAYWJzdHJhY3RcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICd1bml2ZXJzYWwnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgdGhyb3cgbmV3IFpvbmVJc0Fic3RyYWN0RXJyb3IoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdpc1ZhbGlkJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHRocm93IG5ldyBab25lSXNBYnN0cmFjdEVycm9yKCk7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBab25lO1xufSgpO1xuXG52YXIgc2luZ2xldG9uID0gbnVsbDtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5cbnZhciBMb2NhbFpvbmUgPSBmdW5jdGlvbiAoX1pvbmUpIHtcbiAgaW5oZXJpdHMoTG9jYWxab25lLCBfWm9uZSk7XG5cbiAgZnVuY3Rpb24gTG9jYWxab25lKCkge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIExvY2FsWm9uZSk7XG4gICAgcmV0dXJuIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX1pvbmUuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH1cblxuICBMb2NhbFpvbmUucHJvdG90eXBlLm9mZnNldE5hbWUgPSBmdW5jdGlvbiBvZmZzZXROYW1lKHRzLCBfcmVmKSB7XG4gICAgdmFyIGZvcm1hdCA9IF9yZWYuZm9ybWF0LFxuICAgICAgICBsb2NhbGUgPSBfcmVmLmxvY2FsZTtcblxuICAgIHJldHVybiBVdGlsLnBhcnNlWm9uZUluZm8odHMsIGZvcm1hdCwgbG9jYWxlKTtcbiAgfTtcblxuICBMb2NhbFpvbmUucHJvdG90eXBlLm9mZnNldCA9IGZ1bmN0aW9uIG9mZnNldCh0cykge1xuICAgIHJldHVybiAtbmV3IERhdGUodHMpLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gIH07XG5cbiAgTG9jYWxab25lLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMob3RoZXJab25lKSB7XG4gICAgcmV0dXJuIG90aGVyWm9uZS50eXBlID09PSAnbG9jYWwnO1xuICB9O1xuXG4gIGNyZWF0ZUNsYXNzKExvY2FsWm9uZSwgW3tcbiAgICBrZXk6ICd0eXBlJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiAnbG9jYWwnO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ25hbWUnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgaWYgKFV0aWwuaGFzSW50bCgpKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdCgpLnJlc29sdmVkT3B0aW9ucygpLnRpbWVab25lO1xuICAgICAgfSBlbHNlIHJldHVybiAnbG9jYWwnO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3VuaXZlcnNhbCcsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnaXNWYWxpZCcsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1dLCBbe1xuICAgIGtleTogJ2luc3RhbmNlJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIGlmIChzaW5nbGV0b24gPT09IG51bGwpIHtcbiAgICAgICAgc2luZ2xldG9uID0gbmV3IExvY2FsWm9uZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNpbmdsZXRvbjtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIExvY2FsWm9uZTtcbn0oWm9uZSk7XG5cbnZhciBkdGZDYWNoZSA9IHt9O1xuZnVuY3Rpb24gbWFrZURURih6b25lKSB7XG4gIGlmICghZHRmQ2FjaGVbem9uZV0pIHtcbiAgICBkdGZDYWNoZVt6b25lXSA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdlbi1VUycsIHtcbiAgICAgIGhvdXIxMjogZmFsc2UsXG4gICAgICB0aW1lWm9uZTogem9uZSxcbiAgICAgIHllYXI6ICdudW1lcmljJyxcbiAgICAgIG1vbnRoOiAnMi1kaWdpdCcsXG4gICAgICBkYXk6ICcyLWRpZ2l0JyxcbiAgICAgIGhvdXI6ICcyLWRpZ2l0JyxcbiAgICAgIG1pbnV0ZTogJzItZGlnaXQnLFxuICAgICAgc2Vjb25kOiAnMi1kaWdpdCdcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZHRmQ2FjaGVbem9uZV07XG59XG5cbnZhciB0eXBlVG9Qb3MgPSB7XG4gIHllYXI6IDAsXG4gIG1vbnRoOiAxLFxuICBkYXk6IDIsXG4gIGhvdXI6IDMsXG4gIG1pbnV0ZTogNCxcbiAgc2Vjb25kOiA1XG59O1xuXG5mdW5jdGlvbiBoYWNreU9mZnNldChkdGYsIGRhdGUpIHtcbiAgdmFyIGZvcm1hdHRlZCA9IGR0Zi5mb3JtYXQoZGF0ZSkucmVwbGFjZSgvXFx1MjAwRS9nLCAnJyksXG4gICAgICBwYXJzZWQgPSAvKFxcZCspXFwvKFxcZCspXFwvKFxcZCspLD8gKFxcZCspOihcXGQrKTooXFxkKykvLmV4ZWMoZm9ybWF0dGVkKSxcbiAgICAgIGZNb250aCA9IHBhcnNlZFsxXSxcbiAgICAgIGZEYXkgPSBwYXJzZWRbMl0sXG4gICAgICBmWWVhciA9IHBhcnNlZFszXSxcbiAgICAgIGZIb3VyID0gcGFyc2VkWzRdLFxuICAgICAgZk1pbnV0ZSA9IHBhcnNlZFs1XSxcbiAgICAgIGZTZWNvbmQgPSBwYXJzZWRbNl07XG5cbiAgcmV0dXJuIFtmWWVhciwgZk1vbnRoLCBmRGF5LCBmSG91ciwgZk1pbnV0ZSwgZlNlY29uZF07XG59XG5cbmZ1bmN0aW9uIHBhcnRzT2Zmc2V0KGR0ZiwgZGF0ZSkge1xuICB2YXIgZm9ybWF0dGVkID0gZHRmLmZvcm1hdFRvUGFydHMoZGF0ZSksXG4gICAgICBmaWxsZWQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmb3JtYXR0ZWQubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgX2Zvcm1hdHRlZCRpID0gZm9ybWF0dGVkW2ldLFxuICAgICAgICB0eXBlID0gX2Zvcm1hdHRlZCRpLnR5cGUsXG4gICAgICAgIHZhbHVlID0gX2Zvcm1hdHRlZCRpLnZhbHVlLFxuICAgICAgICBwb3MgPSB0eXBlVG9Qb3NbdHlwZV07XG5cblxuICAgIGlmICghVXRpbC5pc1VuZGVmaW5lZChwb3MpKSB7XG4gICAgICBmaWxsZWRbcG9zXSA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBmaWxsZWQ7XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuXG52YXIgSUFOQVpvbmUgPSBmdW5jdGlvbiAoX1pvbmUpIHtcbiAgaW5oZXJpdHMoSUFOQVpvbmUsIF9ab25lKTtcblxuICBJQU5BWm9uZS5pc1ZhbGlkU3BlY2lmaWVyID0gZnVuY3Rpb24gaXNWYWxpZFNwZWNpZmllcihzKSB7XG4gICAgcmV0dXJuIHMgJiYgcy5tYXRjaCgvXlthLXpfKy1dezEsMjU2fVxcL1thLXpfKy1dezEsMjU2fSQvaSk7XG4gIH07XG5cbiAgSUFOQVpvbmUuaXNWYWxpZFpvbmUgPSBmdW5jdGlvbiBpc1ZhbGlkWm9uZSh6b25lKSB7XG4gICAgdHJ5IHtcbiAgICAgIG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdlbi1VUycsIHsgdGltZVpvbmU6IHpvbmUgfSkuZm9ybWF0KCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIC8vIEV0Yy9HTVQrOCAtPiA0ODBcblxuXG4gIElBTkFab25lLnBhcnNlR01UT2Zmc2V0ID0gZnVuY3Rpb24gcGFyc2VHTVRPZmZzZXQoc3BlY2lmaWVyKSB7XG4gICAgaWYgKHNwZWNpZmllcikge1xuICAgICAgdmFyIG1hdGNoID0gc3BlY2lmaWVyLm1hdGNoKC9eRXRjXFwvR01UKFsrLV1cXGR7MSwyfSkkL2kpO1xuICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHJldHVybiA2MCAqIHBhcnNlSW50KG1hdGNoWzFdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG5cbiAgZnVuY3Rpb24gSUFOQVpvbmUobmFtZSkge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIElBTkFab25lKTtcblxuICAgIHZhciBfdGhpcyA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX1pvbmUuY2FsbCh0aGlzKSk7XG5cbiAgICBfdGhpcy56b25lTmFtZSA9IG5hbWU7XG4gICAgX3RoaXMudmFsaWQgPSBJQU5BWm9uZS5pc1ZhbGlkWm9uZShuYW1lKTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBJQU5BWm9uZS5wcm90b3R5cGUub2Zmc2V0TmFtZSA9IGZ1bmN0aW9uIG9mZnNldE5hbWUodHMsIF9yZWYpIHtcbiAgICB2YXIgZm9ybWF0ID0gX3JlZi5mb3JtYXQsXG4gICAgICAgIGxvY2FsZSA9IF9yZWYubG9jYWxlO1xuXG4gICAgcmV0dXJuIFV0aWwucGFyc2Vab25lSW5mbyh0cywgZm9ybWF0LCBsb2NhbGUsIHRoaXMuem9uZU5hbWUpO1xuICB9O1xuXG4gIElBTkFab25lLnByb3RvdHlwZS5vZmZzZXQgPSBmdW5jdGlvbiBvZmZzZXQodHMpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHRzKSxcbiAgICAgICAgZHRmID0gbWFrZURURih0aGlzLnpvbmVOYW1lKSxcbiAgICAgICAgX3JlZjIgPSBkdGYuZm9ybWF0VG9QYXJ0cyA/IHBhcnRzT2Zmc2V0KGR0ZiwgZGF0ZSkgOiBoYWNreU9mZnNldChkdGYsIGRhdGUpLFxuICAgICAgICBmWWVhciA9IF9yZWYyWzBdLFxuICAgICAgICBmTW9udGggPSBfcmVmMlsxXSxcbiAgICAgICAgZkRheSA9IF9yZWYyWzJdLFxuICAgICAgICBmSG91ciA9IF9yZWYyWzNdLFxuICAgICAgICBmTWludXRlID0gX3JlZjJbNF0sXG4gICAgICAgIGZTZWNvbmQgPSBfcmVmMls1XSxcbiAgICAgICAgYXNVVEMgPSBEYXRlLlVUQyhmWWVhciwgZk1vbnRoIC0gMSwgZkRheSwgZkhvdXIsIGZNaW51dGUsIGZTZWNvbmQpO1xuXG4gICAgdmFyIGFzVFMgPSBkYXRlLnZhbHVlT2YoKTtcbiAgICBhc1RTIC09IGFzVFMgJSAxMDAwO1xuICAgIHJldHVybiAoYXNVVEMgLSBhc1RTKSAvICg2MCAqIDEwMDApO1xuICB9O1xuXG4gIElBTkFab25lLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMob3RoZXJab25lKSB7XG4gICAgcmV0dXJuIG90aGVyWm9uZS50eXBlID09PSAnaWFuYScgJiYgb3RoZXJab25lLnpvbmVOYW1lID09PSB0aGlzLnpvbmVOYW1lO1xuICB9O1xuXG4gIGNyZWF0ZUNsYXNzKElBTkFab25lLCBbe1xuICAgIGtleTogJ3R5cGUnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuICdpYW5hJztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICduYW1lJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnpvbmVOYW1lO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3VuaXZlcnNhbCcsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnaXNWYWxpZCcsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWxpZDtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIElBTkFab25lO1xufShab25lKTtcblxudmFyIHNpbmdsZXRvbiQxID0gbnVsbDtcblxuZnVuY3Rpb24gaG91cnNNaW51dGVzT2Zmc2V0KHopIHtcbiAgdmFyIGhvdXJzID0gTWF0aC50cnVuYyh6LmZpeGVkIC8gNjApLFxuICAgICAgbWludXRlcyA9IE1hdGguYWJzKHouZml4ZWQgJSA2MCksXG4gICAgICBzaWduID0gaG91cnMgPiAwID8gJysnIDogJy0nLFxuICAgICAgYmFzZSA9IHNpZ24gKyBNYXRoLmFicyhob3Vycyk7XG4gIHJldHVybiBtaW51dGVzID4gMCA/IGJhc2UgKyAnOicgKyBVdGlsLnBhZFN0YXJ0KG1pbnV0ZXMsIDIpIDogYmFzZTtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5cbnZhciBGaXhlZE9mZnNldFpvbmUgPSBmdW5jdGlvbiAoX1pvbmUpIHtcbiAgaW5oZXJpdHMoRml4ZWRPZmZzZXRab25lLCBfWm9uZSk7XG5cbiAgRml4ZWRPZmZzZXRab25lLmluc3RhbmNlID0gZnVuY3Rpb24gaW5zdGFuY2Uob2Zmc2V0KSB7XG4gICAgcmV0dXJuIG9mZnNldCA9PT0gMCA/IEZpeGVkT2Zmc2V0Wm9uZS51dGNJbnN0YW5jZSA6IG5ldyBGaXhlZE9mZnNldFpvbmUob2Zmc2V0KTtcbiAgfTtcblxuICBGaXhlZE9mZnNldFpvbmUucGFyc2VTcGVjaWZpZXIgPSBmdW5jdGlvbiBwYXJzZVNwZWNpZmllcihzKSB7XG4gICAgaWYgKHMpIHtcbiAgICAgIHZhciByID0gcy5tYXRjaCgvXnV0Yyg/OihbKy1dXFxkezEsMn0pKD86OihcXGR7Mn0pKT8pPyQvaSk7XG4gICAgICBpZiAocikge1xuICAgICAgICByZXR1cm4gbmV3IEZpeGVkT2Zmc2V0Wm9uZShVdGlsLnNpZ25lZE9mZnNldChyWzFdLCByWzJdKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIGNyZWF0ZUNsYXNzKEZpeGVkT2Zmc2V0Wm9uZSwgbnVsbCwgW3tcbiAgICBrZXk6ICd1dGNJbnN0YW5jZScsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICBpZiAoc2luZ2xldG9uJDEgPT09IG51bGwpIHtcbiAgICAgICAgc2luZ2xldG9uJDEgPSBuZXcgRml4ZWRPZmZzZXRab25lKDApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNpbmdsZXRvbiQxO1xuICAgIH1cbiAgfV0pO1xuXG4gIGZ1bmN0aW9uIEZpeGVkT2Zmc2V0Wm9uZShvZmZzZXQpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBGaXhlZE9mZnNldFpvbmUpO1xuXG4gICAgdmFyIF90aGlzID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfWm9uZS5jYWxsKHRoaXMpKTtcblxuICAgIF90aGlzLmZpeGVkID0gb2Zmc2V0O1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIEZpeGVkT2Zmc2V0Wm9uZS5wcm90b3R5cGUub2Zmc2V0TmFtZSA9IGZ1bmN0aW9uIG9mZnNldE5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgfTtcblxuICBGaXhlZE9mZnNldFpvbmUucHJvdG90eXBlLm9mZnNldCA9IGZ1bmN0aW9uIG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5maXhlZDtcbiAgfTtcblxuICBGaXhlZE9mZnNldFpvbmUucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyhvdGhlclpvbmUpIHtcbiAgICByZXR1cm4gb3RoZXJab25lLnR5cGUgPT09ICdmaXhlZCcgJiYgb3RoZXJab25lLmZpeGVkID09PSB0aGlzLmZpeGVkO1xuICB9O1xuXG4gIGNyZWF0ZUNsYXNzKEZpeGVkT2Zmc2V0Wm9uZSwgW3tcbiAgICBrZXk6ICd0eXBlJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiAnZml4ZWQnO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ25hbWUnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZml4ZWQgPT09IDAgPyAnVVRDJyA6ICdVVEMnICsgaG91cnNNaW51dGVzT2Zmc2V0KHRoaXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3VuaXZlcnNhbCcsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdpc1ZhbGlkJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfV0pO1xuICByZXR1cm4gRml4ZWRPZmZzZXRab25lO1xufShab25lKTtcblxudmFyIHNpbmdsZXRvbiQyID0gbnVsbDtcblxudmFyIEludmFsaWRab25lID0gZnVuY3Rpb24gKF9ab25lKSB7XG4gIGluaGVyaXRzKEludmFsaWRab25lLCBfWm9uZSk7XG5cbiAgZnVuY3Rpb24gSW52YWxpZFpvbmUoKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgSW52YWxpZFpvbmUpO1xuICAgIHJldHVybiBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9ab25lLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9XG5cbiAgSW52YWxpZFpvbmUucHJvdG90eXBlLm9mZnNldE5hbWUgPSBmdW5jdGlvbiBvZmZzZXROYW1lKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIEludmFsaWRab25lLnByb3RvdHlwZS5vZmZzZXQgPSBmdW5jdGlvbiBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIE5hTjtcbiAgfTtcblxuICBJbnZhbGlkWm9uZS5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gZXF1YWxzKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBjcmVhdGVDbGFzcyhJbnZhbGlkWm9uZSwgW3tcbiAgICBrZXk6ICd0eXBlJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiAnaW52YWxpZCc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnbmFtZScsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICd1bml2ZXJzYWwnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2lzVmFsaWQnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfV0sIFt7XG4gICAga2V5OiAnaW5zdGFuY2UnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgaWYgKHNpbmdsZXRvbiQyID09PSBudWxsKSB7XG4gICAgICAgIHNpbmdsZXRvbiQyID0gbmV3IEludmFsaWRab25lKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2luZ2xldG9uJDI7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBJbnZhbGlkWm9uZTtcbn0oWm9uZSk7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuXG52YXIgRm9ybWF0cyA9IGZ1bmN0aW9uIEZvcm1hdHMoKSB7XG4gIGNsYXNzQ2FsbENoZWNrKHRoaXMsIEZvcm1hdHMpO1xufTtcblxuRm9ybWF0cy5EQVRFX1NIT1JUID0ge1xuICB5ZWFyOiAnbnVtZXJpYycsXG4gIG1vbnRoOiAnbnVtZXJpYycsXG4gIGRheTogJ251bWVyaWMnXG59O1xuXG5Gb3JtYXRzLkRBVEVfTUVEID0ge1xuICB5ZWFyOiAnbnVtZXJpYycsXG4gIG1vbnRoOiAnc2hvcnQnLFxuICBkYXk6ICdudW1lcmljJ1xufTtcblxuRm9ybWF0cy5EQVRFX0ZVTEwgPSB7XG4gIHllYXI6ICdudW1lcmljJyxcbiAgbW9udGg6ICdsb25nJyxcbiAgZGF5OiAnbnVtZXJpYydcbn07XG5cbkZvcm1hdHMuREFURV9IVUdFID0ge1xuICB5ZWFyOiAnbnVtZXJpYycsXG4gIG1vbnRoOiAnbG9uZycsXG4gIGRheTogJ251bWVyaWMnLFxuICB3ZWVrZGF5OiAnbG9uZydcbn07XG5cbkZvcm1hdHMuVElNRV9TSU1QTEUgPSB7XG4gIGhvdXI6ICdudW1lcmljJyxcbiAgbWludXRlOiAnMi1kaWdpdCdcbn07XG5cbkZvcm1hdHMuVElNRV9XSVRIX1NFQ09ORFMgPSB7XG4gIGhvdXI6ICdudW1lcmljJyxcbiAgbWludXRlOiAnMi1kaWdpdCcsXG4gIHNlY29uZDogJzItZGlnaXQnXG59O1xuXG5Gb3JtYXRzLlRJTUVfV0lUSF9TSE9SVF9PRkZTRVQgPSB7XG4gIGhvdXI6ICdudW1lcmljJyxcbiAgbWludXRlOiAnMi1kaWdpdCcsXG4gIHNlY29uZDogJzItZGlnaXQnLFxuICB0aW1lWm9uZU5hbWU6ICdzaG9ydCdcbn07XG5cbkZvcm1hdHMuVElNRV9XSVRIX0xPTkdfT0ZGU0VUID0ge1xuICBob3VyOiAnbnVtZXJpYycsXG4gIG1pbnV0ZTogJzItZGlnaXQnLFxuICBzZWNvbmQ6ICcyLWRpZ2l0JyxcbiAgdGltZVpvbmVOYW1lOiAnbG9uZydcbn07XG5cbkZvcm1hdHMuVElNRV8yNF9TSU1QTEUgPSB7XG4gIGhvdXI6ICdudW1lcmljJyxcbiAgbWludXRlOiAnMi1kaWdpdCcsXG4gIGhvdXIxMjogZmFsc2Vcbn07XG5cbi8qKlxuICoge0BsaW5rIHRvTG9jYWxlU3RyaW5nfTsgZm9ybWF0IGxpa2UgJzA5OjMwOjIzJywgYWx3YXlzIDI0LWhvdXIuXG4gKi9cbkZvcm1hdHMuVElNRV8yNF9XSVRIX1NFQ09ORFMgPSB7XG4gIGhvdXI6ICdudW1lcmljJyxcbiAgbWludXRlOiAnMi1kaWdpdCcsXG4gIHNlY29uZDogJzItZGlnaXQnLFxuICBob3VyMTI6IGZhbHNlXG59O1xuXG4vKipcbiAqIHtAbGluayB0b0xvY2FsZVN0cmluZ307IGZvcm1hdCBsaWtlICcwOTozMDoyMyBFRFQnLCBhbHdheXMgMjQtaG91ci5cbiAqL1xuRm9ybWF0cy5USU1FXzI0X1dJVEhfU0hPUlRfT0ZGU0VUID0ge1xuICBob3VyOiAnbnVtZXJpYycsXG4gIG1pbnV0ZTogJzItZGlnaXQnLFxuICBzZWNvbmQ6ICcyLWRpZ2l0JyxcbiAgaG91cjEyOiBmYWxzZSxcbiAgdGltZVpvbmVOYW1lOiAnc2hvcnQnXG59O1xuXG4vKipcbiAqIHtAbGluayB0b0xvY2FsZVN0cmluZ307IGZvcm1hdCBsaWtlICcwOTozMDoyMyBFYXN0ZXJuIERheWxpZ2h0IFRpbWUnLCBhbHdheXMgMjQtaG91ci5cbiAqL1xuRm9ybWF0cy5USU1FXzI0X1dJVEhfTE9OR19PRkZTRVQgPSB7XG4gIGhvdXI6ICdudW1lcmljJyxcbiAgbWludXRlOiAnMi1kaWdpdCcsXG4gIHNlY29uZDogJzItZGlnaXQnLFxuICBob3VyMTI6IGZhbHNlLFxuICB0aW1lWm9uZU5hbWU6ICdsb25nJ1xufTtcblxuLyoqXG4gKiB7QGxpbmsgdG9Mb2NhbGVTdHJpbmd9OyBmb3JtYXQgbGlrZSAnMTAvMTQvMTk4MywgOTozMCBBTScuIE9ubHkgMTItaG91ciBpZiB0aGUgbG9jYWxlIGlzLlxuICovXG5Gb3JtYXRzLkRBVEVUSU1FX1NIT1JUID0ge1xuICB5ZWFyOiAnbnVtZXJpYycsXG4gIG1vbnRoOiAnbnVtZXJpYycsXG4gIGRheTogJ251bWVyaWMnLFxuICBob3VyOiAnbnVtZXJpYycsXG4gIG1pbnV0ZTogJzItZGlnaXQnXG59O1xuXG4vKipcbiAqIHtAbGluayB0b0xvY2FsZVN0cmluZ307IGZvcm1hdCBsaWtlICcxMC8xNC8xOTgzLCA5OjMwOjMzIEFNJy4gT25seSAxMi1ob3VyIGlmIHRoZSBsb2NhbGUgaXMuXG4gKi9cbkZvcm1hdHMuREFURVRJTUVfU0hPUlRfV0lUSF9TRUNPTkRTID0ge1xuICB5ZWFyOiAnbnVtZXJpYycsXG4gIG1vbnRoOiAnbnVtZXJpYycsXG4gIGRheTogJ251bWVyaWMnLFxuICBob3VyOiAnbnVtZXJpYycsXG4gIG1pbnV0ZTogJzItZGlnaXQnLFxuICBzZWNvbmQ6ICcyLWRpZ2l0J1xufTtcblxuRm9ybWF0cy5EQVRFVElNRV9NRUQgPSB7XG4gIHllYXI6ICdudW1lcmljJyxcbiAgbW9udGg6ICdzaG9ydCcsXG4gIGRheTogJ251bWVyaWMnLFxuICBob3VyOiAnbnVtZXJpYycsXG4gIG1pbnV0ZTogJzItZGlnaXQnXG59O1xuXG5Gb3JtYXRzLkRBVEVUSU1FX01FRF9XSVRIX1NFQ09ORFMgPSB7XG4gIHllYXI6ICdudW1lcmljJyxcbiAgbW9udGg6ICdzaG9ydCcsXG4gIGRheTogJ251bWVyaWMnLFxuICBob3VyOiAnbnVtZXJpYycsXG4gIG1pbnV0ZTogJzItZGlnaXQnLFxuICBzZWNvbmQ6ICcyLWRpZ2l0J1xufTtcblxuRm9ybWF0cy5EQVRFVElNRV9GVUxMID0ge1xuICB5ZWFyOiAnbnVtZXJpYycsXG4gIG1vbnRoOiAnbG9uZycsXG4gIGRheTogJ251bWVyaWMnLFxuICBob3VyOiAnbnVtZXJpYycsXG4gIG1pbnV0ZTogJzItZGlnaXQnLFxuICB0aW1lWm9uZU5hbWU6ICdzaG9ydCdcbn07XG5cbkZvcm1hdHMuREFURVRJTUVfRlVMTF9XSVRIX1NFQ09ORFMgPSB7XG4gIHllYXI6ICdudW1lcmljJyxcbiAgbW9udGg6ICdsb25nJyxcbiAgZGF5OiAnbnVtZXJpYycsXG4gIGhvdXI6ICdudW1lcmljJyxcbiAgbWludXRlOiAnMi1kaWdpdCcsXG4gIHNlY29uZDogJzItZGlnaXQnLFxuICB0aW1lWm9uZU5hbWU6ICdzaG9ydCdcbn07XG5cbkZvcm1hdHMuREFURVRJTUVfSFVHRSA9IHtcbiAgeWVhcjogJ251bWVyaWMnLFxuICBtb250aDogJ2xvbmcnLFxuICBkYXk6ICdudW1lcmljJyxcbiAgd2Vla2RheTogJ2xvbmcnLFxuICBob3VyOiAnbnVtZXJpYycsXG4gIG1pbnV0ZTogJzItZGlnaXQnLFxuICB0aW1lWm9uZU5hbWU6ICdsb25nJ1xufTtcblxuRm9ybWF0cy5EQVRFVElNRV9IVUdFX1dJVEhfU0VDT05EUyA9IHtcbiAgeWVhcjogJ251bWVyaWMnLFxuICBtb250aDogJ2xvbmcnLFxuICBkYXk6ICdudW1lcmljJyxcbiAgd2Vla2RheTogJ2xvbmcnLFxuICBob3VyOiAnbnVtZXJpYycsXG4gIG1pbnV0ZTogJzItZGlnaXQnLFxuICBzZWNvbmQ6ICcyLWRpZ2l0JyxcbiAgdGltZVpvbmVOYW1lOiAnbG9uZydcbn07XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeShvYmopIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaiwgT2JqZWN0LmtleXMob2JqKS5zb3J0KCkpO1xufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cblxudmFyIEVuZ2xpc2ggPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEVuZ2xpc2goKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgRW5nbGlzaCk7XG4gIH1cblxuICBFbmdsaXNoLm1vbnRocyA9IGZ1bmN0aW9uIG1vbnRocyhsZW5ndGgpIHtcbiAgICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgICAgY2FzZSAnbmFycm93JzpcbiAgICAgICAgcmV0dXJuIEVuZ2xpc2gubW9udGhzTmFycm93O1xuICAgICAgY2FzZSAnc2hvcnQnOlxuICAgICAgICByZXR1cm4gRW5nbGlzaC5tb250aHNTaG9ydDtcbiAgICAgIGNhc2UgJ2xvbmcnOlxuICAgICAgICByZXR1cm4gRW5nbGlzaC5tb250aHNMb25nO1xuICAgICAgY2FzZSAnbnVtZXJpYyc6XG4gICAgICAgIHJldHVybiBbJzEnLCAnMicsICczJywgJzQnLCAnNScsICc2JywgJzcnLCAnOCcsICc5JywgJzEwJywgJzExJywgJzEyJ107XG4gICAgICBjYXNlICcyLWRpZ2l0JzpcbiAgICAgICAgcmV0dXJuIFsnMDEnLCAnMDInLCAnMDMnLCAnMDQnLCAnMDUnLCAnMDYnLCAnMDcnLCAnMDgnLCAnMDknLCAnMTAnLCAnMTEnLCAnMTInXTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfTtcblxuICBFbmdsaXNoLndlZWtkYXlzID0gZnVuY3Rpb24gd2Vla2RheXMobGVuZ3RoKSB7XG4gICAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICAgIGNhc2UgJ25hcnJvdyc6XG4gICAgICAgIHJldHVybiBFbmdsaXNoLndlZWtkYXlzTmFycm93O1xuICAgICAgY2FzZSAnc2hvcnQnOlxuICAgICAgICByZXR1cm4gRW5nbGlzaC53ZWVrZGF5c1Nob3J0O1xuICAgICAgY2FzZSAnbG9uZyc6XG4gICAgICAgIHJldHVybiBFbmdsaXNoLndlZWtkYXlzTG9uZztcbiAgICAgIGNhc2UgJ251bWVyaWMnOlxuICAgICAgICByZXR1cm4gWycxJywgJzInLCAnMycsICc0JywgJzUnLCAnNicsICc3J107XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgRW5nbGlzaC5lcmFzID0gZnVuY3Rpb24gZXJhcyhsZW5ndGgpIHtcbiAgICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgICAgY2FzZSAnbmFycm93JzpcbiAgICAgICAgcmV0dXJuIEVuZ2xpc2guZXJhc05hcnJvdztcbiAgICAgIGNhc2UgJ3Nob3J0JzpcbiAgICAgICAgcmV0dXJuIEVuZ2xpc2guZXJhc1Nob3J0O1xuICAgICAgY2FzZSAnbG9uZyc6XG4gICAgICAgIHJldHVybiBFbmdsaXNoLmVyYXNMb25nO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xuXG4gIEVuZ2xpc2gubWVyaWRpZW1Gb3JEYXRlVGltZSA9IGZ1bmN0aW9uIG1lcmlkaWVtRm9yRGF0ZVRpbWUoZHQpIHtcbiAgICByZXR1cm4gRW5nbGlzaC5tZXJpZGllbXNbZHQuaG91ciA8IDEyID8gMCA6IDFdO1xuICB9O1xuXG4gIEVuZ2xpc2gud2Vla2RheUZvckRhdGVUaW1lID0gZnVuY3Rpb24gd2Vla2RheUZvckRhdGVUaW1lKGR0LCBsZW5ndGgpIHtcbiAgICByZXR1cm4gRW5nbGlzaC53ZWVrZGF5cyhsZW5ndGgpW2R0LndlZWtkYXkgLSAxXTtcbiAgfTtcblxuICBFbmdsaXNoLm1vbnRoRm9yRGF0ZVRpbWUgPSBmdW5jdGlvbiBtb250aEZvckRhdGVUaW1lKGR0LCBsZW5ndGgpIHtcbiAgICByZXR1cm4gRW5nbGlzaC5tb250aHMobGVuZ3RoKVtkdC5tb250aCAtIDFdO1xuICB9O1xuXG4gIEVuZ2xpc2guZXJhRm9yRGF0ZVRpbWUgPSBmdW5jdGlvbiBlcmFGb3JEYXRlVGltZShkdCwgbGVuZ3RoKSB7XG4gICAgcmV0dXJuIEVuZ2xpc2guZXJhcyhsZW5ndGgpW2R0LnllYXIgPCAwID8gMCA6IDFdO1xuICB9O1xuXG4gIEVuZ2xpc2guZm9ybWF0U3RyaW5nID0gZnVuY3Rpb24gZm9ybWF0U3RyaW5nKGtub3duRm9ybWF0KSB7XG4gICAgLy8gdGhlc2UgYWxsIGhhdmUgdGhlIG9mZnNldHMgcmVtb3ZlZCBiZWNhdXNlIHdlIGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoZW1cbiAgICAvLyB3aXRob3V0IGFsbCB0aGUgaW50bCBzdHVmZiB0aGlzIGlzIGJhY2tmaWxsaW5nXG4gICAgdmFyIGZpbHRlcmVkID0gVXRpbC5waWNrKGtub3duRm9ybWF0LCBbJ3dlZWtkYXknLCAnZXJhJywgJ3llYXInLCAnbW9udGgnLCAnZGF5JywgJ2hvdXInLCAnbWludXRlJywgJ3NlY29uZCcsICd0aW1lWm9uZU5hbWUnLCAnaG91cjEyJ10pLFxuICAgICAgICBrZXkgPSBzdHJpbmdpZnkoZmlsdGVyZWQpLFxuICAgICAgICBkYXRlVGltZUh1Z2UgPSAnRUVFRSwgTExMTCBkLCB5eXl5LCBoOm1tIGEnO1xuICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICBjYXNlIHN0cmluZ2lmeShGb3JtYXRzLkRBVEVfU0hPUlQpOlxuICAgICAgICByZXR1cm4gJ00vZC95eXl5JztcbiAgICAgIGNhc2Ugc3RyaW5naWZ5KEZvcm1hdHMuREFURV9NRUQpOlxuICAgICAgICByZXR1cm4gJ0xMTCBkLCB5eXl5JztcbiAgICAgIGNhc2Ugc3RyaW5naWZ5KEZvcm1hdHMuREFURV9GVUxMKTpcbiAgICAgICAgcmV0dXJuICdMTExMIGQsIHl5eXknO1xuICAgICAgY2FzZSBzdHJpbmdpZnkoRm9ybWF0cy5EQVRFX0hVR0UpOlxuICAgICAgICByZXR1cm4gJ0VFRUUsIExMTEwgZCwgeXl5eSc7XG4gICAgICBjYXNlIHN0cmluZ2lmeShGb3JtYXRzLlRJTUVfU0lNUExFKTpcbiAgICAgICAgcmV0dXJuICdoOm1tIGEnO1xuICAgICAgY2FzZSBzdHJpbmdpZnkoRm9ybWF0cy5USU1FX1dJVEhfU0VDT05EUyk6XG4gICAgICAgIHJldHVybiAnaDptbTpzcyBhJztcbiAgICAgIGNhc2Ugc3RyaW5naWZ5KEZvcm1hdHMuVElNRV9XSVRIX1NIT1JUX09GRlNFVCk6XG4gICAgICAgIHJldHVybiAnaDptbSBhJztcbiAgICAgIGNhc2Ugc3RyaW5naWZ5KEZvcm1hdHMuVElNRV9XSVRIX0xPTkdfT0ZGU0VUKTpcbiAgICAgICAgcmV0dXJuICdoOm1tIGEnO1xuICAgICAgY2FzZSBzdHJpbmdpZnkoRm9ybWF0cy5USU1FXzI0X1NJTVBMRSk6XG4gICAgICAgIHJldHVybiAnSEg6bW0nO1xuICAgICAgY2FzZSBzdHJpbmdpZnkoRm9ybWF0cy5USU1FXzI0X1dJVEhfU0VDT05EUyk6XG4gICAgICAgIHJldHVybiAnSEg6bW06c3MnO1xuICAgICAgY2FzZSBzdHJpbmdpZnkoRm9ybWF0cy5USU1FXzI0X1dJVEhfU0hPUlRfT0ZGU0VUKTpcbiAgICAgICAgcmV0dXJuICdISDptbSc7XG4gICAgICBjYXNlIHN0cmluZ2lmeShGb3JtYXRzLlRJTUVfMjRfV0lUSF9MT05HX09GRlNFVCk6XG4gICAgICAgIHJldHVybiAnSEg6bW0nO1xuICAgICAgY2FzZSBzdHJpbmdpZnkoRm9ybWF0cy5EQVRFVElNRV9TSE9SVCk6XG4gICAgICAgIHJldHVybiAnTS9kL3l5eXksIGg6bW0gYSc7XG4gICAgICBjYXNlIHN0cmluZ2lmeShGb3JtYXRzLkRBVEVUSU1FX01FRCk6XG4gICAgICAgIHJldHVybiAnTExMIGQsIHl5eXksIGg6bW0gYSc7XG4gICAgICBjYXNlIHN0cmluZ2lmeShGb3JtYXRzLkRBVEVUSU1FX0ZVTEwpOlxuICAgICAgICByZXR1cm4gJ0xMTEwgZCwgeXl5eSwgaDptbSBhJztcbiAgICAgIGNhc2Ugc3RyaW5naWZ5KEZvcm1hdHMuREFURVRJTUVfSFVHRSk6XG4gICAgICAgIHJldHVybiBkYXRlVGltZUh1Z2U7XG4gICAgICBjYXNlIHN0cmluZ2lmeShGb3JtYXRzLkRBVEVUSU1FX1NIT1JUX1dJVEhfU0VDT05EUyk6XG4gICAgICAgIHJldHVybiAnTS9kL3l5eXksIGg6bW06c3MgYSc7XG4gICAgICBjYXNlIHN0cmluZ2lmeShGb3JtYXRzLkRBVEVUSU1FX01FRF9XSVRIX1NFQ09ORFMpOlxuICAgICAgICByZXR1cm4gJ0xMTCBkLCB5eXl5LCBoOm1tOnNzIGEnO1xuICAgICAgY2FzZSBzdHJpbmdpZnkoRm9ybWF0cy5EQVRFVElNRV9GVUxMX1dJVEhfU0VDT05EUyk6XG4gICAgICAgIHJldHVybiAnTExMTCBkLCB5eXl5LCBoOm1tOnNzIGEnO1xuICAgICAgY2FzZSBzdHJpbmdpZnkoRm9ybWF0cy5EQVRFVElNRV9IVUdFX1dJVEhfU0VDT05EUyk6XG4gICAgICAgIHJldHVybiAnRUVFRSwgTExMTCBkLCB5eXl5LCBoOm1tOnNzIGEnO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGRhdGVUaW1lSHVnZTtcbiAgICB9XG4gIH07XG5cbiAgY3JlYXRlQ2xhc3MoRW5nbGlzaCwgbnVsbCwgW3tcbiAgICBrZXk6ICdtb250aHNMb25nJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiBbJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLCAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdtb250aHNTaG9ydCcsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsICdPY3QnLCAnTm92JywgJ0RlYyddO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ21vbnRoc05hcnJvdycsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gWydKJywgJ0YnLCAnTScsICdBJywgJ00nLCAnSicsICdKJywgJ0EnLCAnUycsICdPJywgJ04nLCAnRCddO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3dlZWtkYXlzTG9uZycsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gWydNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5JywgJ1N1bmRheSddO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3dlZWtkYXlzU2hvcnQnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIFsnTW9uJywgJ1R1ZScsICdXZWQnLCAnVGh1JywgJ0ZyaScsICdTYXQnLCAnU3VuJ107XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnd2Vla2RheXNOYXJyb3cnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIFsnTScsICdUJywgJ1cnLCAnVCcsICdGJywgJ1MnLCAnUyddO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ21lcmlkaWVtcycsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gWydBTScsICdQTSddO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2VyYXNMb25nJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiBbJ0JlZm9yZSBDaHJpc3QnLCAnQW5ubyBEb21pbmknXTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdlcmFzU2hvcnQnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIFsnQkMnLCAnQUQnXTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdlcmFzTmFycm93JyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiBbJ0InLCAnQSddO1xuICAgIH1cbiAgfV0pO1xuICByZXR1cm4gRW5nbGlzaDtcbn0oKTtcblxuZnVuY3Rpb24gc3RyaW5naWZ5VG9rZW5zKHNwbGl0cywgdG9rZW5Ub1N0cmluZykge1xuICB2YXIgcyA9ICcnO1xuICBmb3IgKHZhciBfaXRlcmF0b3IgPSBzcGxpdHMsIF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheShfaXRlcmF0b3IpLCBfaSA9IDAsIF9pdGVyYXRvciA9IF9pc0FycmF5ID8gX2l0ZXJhdG9yIDogX2l0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgdmFyIF9yZWY7XG5cbiAgICBpZiAoX2lzQXJyYXkpIHtcbiAgICAgIGlmIChfaSA+PSBfaXRlcmF0b3IubGVuZ3RoKSBicmVhaztcbiAgICAgIF9yZWYgPSBfaXRlcmF0b3JbX2krK107XG4gICAgfSBlbHNlIHtcbiAgICAgIF9pID0gX2l0ZXJhdG9yLm5leHQoKTtcbiAgICAgIGlmIChfaS5kb25lKSBicmVhaztcbiAgICAgIF9yZWYgPSBfaS52YWx1ZTtcbiAgICB9XG5cbiAgICB2YXIgdG9rZW4gPSBfcmVmO1xuXG4gICAgaWYgKHRva2VuLmxpdGVyYWwpIHtcbiAgICAgIHMgKz0gdG9rZW4udmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICBzICs9IHRva2VuVG9TdHJpbmcodG9rZW4udmFsKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHM7XG59XG5cbnZhciB0b2tlblRvT2JqZWN0ID0ge1xuICBEOiBGb3JtYXRzLkRBVEVfU0hPUlQsXG4gIEREOiBGb3JtYXRzLkRBVEVfTUVELFxuICBEREQ6IEZvcm1hdHMuREFURV9GVUxMLFxuICBEREREOiBGb3JtYXRzLkRBVEVfSFVHRSxcbiAgdDogRm9ybWF0cy5USU1FX1NJTVBMRSxcbiAgdHQ6IEZvcm1hdHMuVElNRV9XSVRIX1NFQ09ORFMsXG4gIHR0dDogRm9ybWF0cy5USU1FX1dJVEhfU0hPUlRfT0ZGU0VULFxuICB0dHR0OiBGb3JtYXRzLlRJTUVfV0lUSF9MT05HX09GRlNFVCxcbiAgVDogRm9ybWF0cy5USU1FXzI0X1NJTVBMRSxcbiAgVFQ6IEZvcm1hdHMuVElNRV8yNF9XSVRIX1NFQ09ORFMsXG4gIFRUVDogRm9ybWF0cy5USU1FXzI0X1dJVEhfU0hPUlRfT0ZGU0VULFxuICBUVFRUOiBGb3JtYXRzLlRJTUVfMjRfV0lUSF9MT05HX09GRlNFVCxcbiAgZjogRm9ybWF0cy5EQVRFVElNRV9TSE9SVCxcbiAgZmY6IEZvcm1hdHMuREFURVRJTUVfTUVELFxuICBmZmY6IEZvcm1hdHMuREFURVRJTUVfRlVMTCxcbiAgZmZmZjogRm9ybWF0cy5EQVRFVElNRV9IVUdFLFxuICBGOiBGb3JtYXRzLkRBVEVUSU1FX1NIT1JUX1dJVEhfU0VDT05EUyxcbiAgRkY6IEZvcm1hdHMuREFURVRJTUVfTUVEX1dJVEhfU0VDT05EUyxcbiAgRkZGOiBGb3JtYXRzLkRBVEVUSU1FX0ZVTExfV0lUSF9TRUNPTkRTLFxuICBGRkZGOiBGb3JtYXRzLkRBVEVUSU1FX0hVR0VfV0lUSF9TRUNPTkRTXG59O1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cblxudmFyIEZvcm1hdHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgRm9ybWF0dGVyLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShsb2NhbGUpIHtcbiAgICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICB2YXIgZm9ybWF0T3B0cyA9IE9iamVjdC5hc3NpZ24oe30sIHsgcm91bmQ6IHRydWUgfSwgb3B0cyk7XG4gICAgcmV0dXJuIG5ldyBGb3JtYXR0ZXIobG9jYWxlLCBmb3JtYXRPcHRzKTtcbiAgfTtcblxuICBGb3JtYXR0ZXIucGFyc2VGb3JtYXQgPSBmdW5jdGlvbiBwYXJzZUZvcm1hdChmbXQpIHtcbiAgICB2YXIgY3VycmVudCA9IG51bGwsXG4gICAgICAgIGN1cnJlbnRGdWxsID0gJycsXG4gICAgICAgIGJyYWNrZXRlZCA9IGZhbHNlO1xuICAgIHZhciBzcGxpdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZtdC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGMgPSBmbXQuY2hhckF0KGkpO1xuICAgICAgaWYgKGMgPT09IFwiJ1wiKSB7XG4gICAgICAgIGlmIChjdXJyZW50RnVsbC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgc3BsaXRzLnB1c2goeyBsaXRlcmFsOiBicmFja2V0ZWQsIHZhbDogY3VycmVudEZ1bGwgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudCA9IG51bGw7XG4gICAgICAgIGN1cnJlbnRGdWxsID0gJyc7XG4gICAgICAgIGJyYWNrZXRlZCA9ICFicmFja2V0ZWQ7XG4gICAgICB9IGVsc2UgaWYgKGJyYWNrZXRlZCkge1xuICAgICAgICBjdXJyZW50RnVsbCArPSBjO1xuICAgICAgfSBlbHNlIGlmIChjID09PSBjdXJyZW50KSB7XG4gICAgICAgIGN1cnJlbnRGdWxsICs9IGM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY3VycmVudEZ1bGwubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHNwbGl0cy5wdXNoKHsgbGl0ZXJhbDogZmFsc2UsIHZhbDogY3VycmVudEZ1bGwgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudEZ1bGwgPSBjO1xuICAgICAgICBjdXJyZW50ID0gYztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY3VycmVudEZ1bGwubGVuZ3RoID4gMCkge1xuICAgICAgc3BsaXRzLnB1c2goeyBsaXRlcmFsOiBicmFja2V0ZWQsIHZhbDogY3VycmVudEZ1bGwgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNwbGl0cztcbiAgfTtcblxuICBmdW5jdGlvbiBGb3JtYXR0ZXIobG9jYWxlLCBmb3JtYXRPcHRzKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgRm9ybWF0dGVyKTtcblxuICAgIHRoaXMub3B0cyA9IGZvcm1hdE9wdHM7XG4gICAgdGhpcy5sb2MgPSBsb2NhbGU7XG4gICAgdGhpcy5zeXN0ZW1Mb2MgPSBudWxsO1xuICB9XG5cbiAgRm9ybWF0dGVyLnByb3RvdHlwZS5mb3JtYXRXaXRoU3lzdGVtRGVmYXVsdCA9IGZ1bmN0aW9uIGZvcm1hdFdpdGhTeXN0ZW1EZWZhdWx0KGR0LCBvcHRzKSB7XG4gICAgaWYgKHRoaXMuc3lzdGVtTG9jID09PSBudWxsKSB7XG4gICAgICB0aGlzLnN5c3RlbUxvYyA9IHRoaXMubG9jLnJlZGVmYXVsdFRvU3lzdGVtKCk7XG4gICAgfVxuICAgIHZhciBkZiA9IHRoaXMuc3lzdGVtTG9jLmR0Rm9ybWF0dGVyKGR0LCBPYmplY3QuYXNzaWduKHt9LCB0aGlzLm9wdHMsIG9wdHMpKTtcbiAgICByZXR1cm4gZGYuZm9ybWF0KCk7XG4gIH07XG5cbiAgRm9ybWF0dGVyLnByb3RvdHlwZS5mb3JtYXREYXRlVGltZSA9IGZ1bmN0aW9uIGZvcm1hdERhdGVUaW1lKGR0KSB7XG4gICAgdmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgdmFyIGRmID0gdGhpcy5sb2MuZHRGb3JtYXR0ZXIoZHQsIE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0cywgb3B0cykpO1xuICAgIHJldHVybiBkZi5mb3JtYXQoKTtcbiAgfTtcblxuICBGb3JtYXR0ZXIucHJvdG90eXBlLmZvcm1hdERhdGVUaW1lUGFydHMgPSBmdW5jdGlvbiBmb3JtYXREYXRlVGltZVBhcnRzKGR0KSB7XG4gICAgdmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgdmFyIGRmID0gdGhpcy5sb2MuZHRGb3JtYXR0ZXIoZHQsIE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0cywgb3B0cykpO1xuICAgIHJldHVybiBkZi5mb3JtYXRUb1BhcnRzKCk7XG4gIH07XG5cbiAgRm9ybWF0dGVyLnByb3RvdHlwZS5yZXNvbHZlZE9wdGlvbnMgPSBmdW5jdGlvbiByZXNvbHZlZE9wdGlvbnMoZHQpIHtcbiAgICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICB2YXIgZGYgPSB0aGlzLmxvYy5kdEZvcm1hdHRlcihkdCwgT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRzLCBvcHRzKSk7XG4gICAgcmV0dXJuIGRmLnJlc29sdmVkT3B0aW9ucygpO1xuICB9O1xuXG4gIEZvcm1hdHRlci5wcm90b3R5cGUubnVtID0gZnVuY3Rpb24gbnVtKG4pIHtcbiAgICB2YXIgcCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMDtcblxuICAgIHZhciBvcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRzKTtcblxuICAgIGlmIChwID4gMCkge1xuICAgICAgb3B0cy5wYWRUbyA9IHA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubG9jLm51bWJlckZvcm1hdHRlcihvcHRzKS5mb3JtYXQobik7XG4gIH07XG5cbiAgRm9ybWF0dGVyLnByb3RvdHlwZS5mb3JtYXREYXRlVGltZUZyb21TdHJpbmcgPSBmdW5jdGlvbiBmb3JtYXREYXRlVGltZUZyb21TdHJpbmcoZHQsIGZtdCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIga25vd25FbmdsaXNoID0gdGhpcy5sb2MubGlzdGluZ01vZGUoKSA9PT0gJ2VuJztcbiAgICB2YXIgc3RyaW5nID0gZnVuY3Rpb24gc3RyaW5nKG9wdHMsIGV4dHJhY3QpIHtcbiAgICAgIHJldHVybiBfdGhpcy5sb2MuZXh0cmFjdChkdCwgb3B0cywgZXh0cmFjdCk7XG4gICAgfSxcbiAgICAgICAgZm9ybWF0T2Zmc2V0ID0gZnVuY3Rpb24gZm9ybWF0T2Zmc2V0KG9wdHMpIHtcbiAgICAgIGlmIChkdC5pc09mZnNldEZpeGVkICYmIGR0Lm9mZnNldCA9PT0gMCAmJiBvcHRzLmFsbG93Wikge1xuICAgICAgICByZXR1cm4gJ1onO1xuICAgICAgfVxuXG4gICAgICB2YXIgaG91cnMgPSBNYXRoLnRydW5jKGR0Lm9mZnNldCAvIDYwKSxcbiAgICAgICAgICBtaW51dGVzID0gTWF0aC5hYnMoZHQub2Zmc2V0ICUgNjApLFxuICAgICAgICAgIHNpZ24gPSBob3VycyA+PSAwID8gJysnIDogJy0nLFxuICAgICAgICAgIGJhc2UgPSAnJyArIHNpZ24gKyBNYXRoLmFicyhob3Vycyk7XG5cbiAgICAgIHN3aXRjaCAob3B0cy5mb3JtYXQpIHtcbiAgICAgICAgY2FzZSAnc2hvcnQnOlxuICAgICAgICAgIHJldHVybiAnJyArIHNpZ24gKyBfdGhpcy5udW0oTWF0aC5hYnMoaG91cnMpLCAyKSArICc6JyArIF90aGlzLm51bShtaW51dGVzLCAyKTtcbiAgICAgICAgY2FzZSAnbmFycm93JzpcbiAgICAgICAgICByZXR1cm4gbWludXRlcyA+IDAgPyBiYXNlICsgJzonICsgbWludXRlcyA6IGJhc2U7XG4gICAgICAgIGNhc2UgJ3RlY2hpZSc6XG4gICAgICAgICAgcmV0dXJuICcnICsgc2lnbiArIF90aGlzLm51bShNYXRoLmFicyhob3VycyksIDIpICsgX3RoaXMubnVtKG1pbnV0ZXMsIDIpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdWYWx1ZSBmb3JtYXQgJyArIG9wdHMuZm9ybWF0ICsgJyBpcyBvdXQgb2YgcmFuZ2UgZm9yIHByb3BlcnR5IGZvcm1hdCcpO1xuICAgICAgfVxuICAgIH0sXG4gICAgICAgIG1lcmlkaWVtID0gZnVuY3Rpb24gbWVyaWRpZW0oKSB7XG4gICAgICByZXR1cm4ga25vd25FbmdsaXNoID8gRW5nbGlzaC5tZXJpZGllbUZvckRhdGVUaW1lKGR0KSA6IHN0cmluZyh7IGhvdXI6ICdudW1lcmljJywgaG91cjEyOiB0cnVlIH0sICdkYXlwZXJpb2QnKTtcbiAgICB9LFxuICAgICAgICBtb250aCA9IGZ1bmN0aW9uIG1vbnRoKGxlbmd0aCwgc3RhbmRhbG9uZSkge1xuICAgICAgcmV0dXJuIGtub3duRW5nbGlzaCA/IEVuZ2xpc2gubW9udGhGb3JEYXRlVGltZShkdCwgbGVuZ3RoKSA6IHN0cmluZyhzdGFuZGFsb25lID8geyBtb250aDogbGVuZ3RoIH0gOiB7IG1vbnRoOiBsZW5ndGgsIGRheTogJ251bWVyaWMnIH0sICdtb250aCcpO1xuICAgIH0sXG4gICAgICAgIHdlZWtkYXkgPSBmdW5jdGlvbiB3ZWVrZGF5KGxlbmd0aCwgc3RhbmRhbG9uZSkge1xuICAgICAgcmV0dXJuIGtub3duRW5nbGlzaCA/IEVuZ2xpc2gud2Vla2RheUZvckRhdGVUaW1lKGR0LCBsZW5ndGgpIDogc3RyaW5nKHN0YW5kYWxvbmUgPyB7IHdlZWtkYXk6IGxlbmd0aCB9IDogeyB3ZWVrZGF5OiBsZW5ndGgsIG1vbnRoOiAnbG9uZycsIGRheTogJ251bWVyaWMnIH0sICd3ZWVrZGF5Jyk7XG4gICAgfSxcbiAgICAgICAgbWF5YmVNYWNybyA9IGZ1bmN0aW9uIG1heWJlTWFjcm8odG9rZW4pIHtcbiAgICAgIHZhciBtYWNybyA9IHRva2VuVG9PYmplY3RbdG9rZW5dO1xuICAgICAgaWYgKG1hY3JvKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5mb3JtYXRXaXRoU3lzdGVtRGVmYXVsdChkdCwgbWFjcm8pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgfVxuICAgIH0sXG4gICAgICAgIGVyYSA9IGZ1bmN0aW9uIGVyYShsZW5ndGgpIHtcbiAgICAgIHJldHVybiBrbm93bkVuZ2xpc2ggPyBFbmdsaXNoLmVyYUZvckRhdGVUaW1lKGR0LCBsZW5ndGgpIDogc3RyaW5nKHsgZXJhOiBsZW5ndGggfSwgJ2VyYScpO1xuICAgIH0sXG4gICAgICAgIHRva2VuVG9TdHJpbmcgPSBmdW5jdGlvbiB0b2tlblRvU3RyaW5nKHRva2VuKSB7XG4gICAgICB2YXIgb3V0cHV0Q2FsID0gX3RoaXMubG9jLm91dHB1dENhbGVuZGFyO1xuXG4gICAgICAvLyBXaGVyZSBwb3NzaWJsZTogaHR0cDovL2NsZHIudW5pY29kZS5vcmcvdHJhbnNsYXRpb24vZGF0ZS10aW1lI1RPQy1TdGFuZC1BbG9uZS12cy4tRm9ybWF0LVN0eWxlc1xuICAgICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgICAvLyBtc1xuICAgICAgICBjYXNlICdTJzpcbiAgICAgICAgICByZXR1cm4gX3RoaXMubnVtKGR0Lm1pbGxpc2Vjb25kKTtcbiAgICAgICAgY2FzZSAndSc6XG4gICAgICAgIC8vIGZhbGxzIHRocm91Z2hcbiAgICAgICAgY2FzZSAnU1NTJzpcbiAgICAgICAgICByZXR1cm4gX3RoaXMubnVtKGR0Lm1pbGxpc2Vjb25kLCAzKTtcbiAgICAgICAgLy8gc2Vjb25kc1xuICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICByZXR1cm4gX3RoaXMubnVtKGR0LnNlY29uZCk7XG4gICAgICAgIGNhc2UgJ3NzJzpcbiAgICAgICAgICByZXR1cm4gX3RoaXMubnVtKGR0LnNlY29uZCwgMik7XG4gICAgICAgIC8vIG1pbnV0ZXNcbiAgICAgICAgY2FzZSAnbSc6XG4gICAgICAgICAgcmV0dXJuIF90aGlzLm51bShkdC5taW51dGUpO1xuICAgICAgICBjYXNlICdtbSc6XG4gICAgICAgICAgcmV0dXJuIF90aGlzLm51bShkdC5taW51dGUsIDIpO1xuICAgICAgICAvLyBob3Vyc1xuICAgICAgICBjYXNlICdoJzpcbiAgICAgICAgICByZXR1cm4gX3RoaXMubnVtKGR0LmhvdXIgJSAxMiA9PT0gMCA/IDEyIDogZHQuaG91ciAlIDEyKTtcbiAgICAgICAgY2FzZSAnaGgnOlxuICAgICAgICAgIHJldHVybiBfdGhpcy5udW0oZHQuaG91ciAlIDEyID09PSAwID8gMTIgOiBkdC5ob3VyICUgMTIsIDIpO1xuICAgICAgICBjYXNlICdIJzpcbiAgICAgICAgICByZXR1cm4gX3RoaXMubnVtKGR0LmhvdXIpO1xuICAgICAgICBjYXNlICdISCc6XG4gICAgICAgICAgcmV0dXJuIF90aGlzLm51bShkdC5ob3VyLCAyKTtcbiAgICAgICAgLy8gb2Zmc2V0XG4gICAgICAgIGNhc2UgJ1onOlxuICAgICAgICAgIC8vIGxpa2UgKzZcbiAgICAgICAgICByZXR1cm4gZm9ybWF0T2Zmc2V0KHsgZm9ybWF0OiAnbmFycm93JywgYWxsb3daOiB0cnVlIH0pO1xuICAgICAgICBjYXNlICdaWic6XG4gICAgICAgICAgLy8gbGlrZSArMDY6MDBcbiAgICAgICAgICByZXR1cm4gZm9ybWF0T2Zmc2V0KHsgZm9ybWF0OiAnc2hvcnQnLCBhbGxvd1o6IHRydWUgfSk7XG4gICAgICAgIGNhc2UgJ1paWic6XG4gICAgICAgICAgLy8gbGlrZSArMDYwMFxuICAgICAgICAgIHJldHVybiBmb3JtYXRPZmZzZXQoeyBmb3JtYXQ6ICd0ZWNoaWUnLCBhbGxvd1o6IGZhbHNlIH0pO1xuICAgICAgICBjYXNlICdaWlpaJzpcbiAgICAgICAgICAvLyBsaWtlIEVTVFxuICAgICAgICAgIHJldHVybiBkdC5vZmZzZXROYW1lU2hvcnQ7XG4gICAgICAgIGNhc2UgJ1paWlpaJzpcbiAgICAgICAgICAvLyBsaWtlIEVhc3Rlcm4gU3RhbmRhcmQgVGltZVxuICAgICAgICAgIHJldHVybiBkdC5vZmZzZXROYW1lTG9uZztcbiAgICAgICAgLy8gem9uZVxuICAgICAgICBjYXNlICd6JzpcbiAgICAgICAgICAvLyBsaWtlIEFtZXJpY2EvTmV3X1lvcmtcbiAgICAgICAgICByZXR1cm4gZHQuem9uZU5hbWU7XG4gICAgICAgIC8vIG1lcmlkaWVtc1xuICAgICAgICBjYXNlICdhJzpcbiAgICAgICAgICByZXR1cm4gbWVyaWRpZW0oKTtcbiAgICAgICAgLy8gZGF0ZXNcbiAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgICAgcmV0dXJuIG91dHB1dENhbCA/IHN0cmluZyh7IGRheTogJ251bWVyaWMnIH0sICdkYXknKSA6IF90aGlzLm51bShkdC5kYXkpO1xuICAgICAgICBjYXNlICdkZCc6XG4gICAgICAgICAgcmV0dXJuIG91dHB1dENhbCA/IHN0cmluZyh7IGRheTogJzItZGlnaXQnIH0sICdkYXknKSA6IF90aGlzLm51bShkdC5kYXksIDIpO1xuICAgICAgICAvLyB3ZWVrZGF5cyAtIHN0YW5kYWxvbmVcbiAgICAgICAgY2FzZSAnYyc6XG4gICAgICAgICAgLy8gbGlrZSAxXG4gICAgICAgICAgcmV0dXJuIF90aGlzLm51bShkdC53ZWVrZGF5KTtcbiAgICAgICAgY2FzZSAnY2NjJzpcbiAgICAgICAgICAvLyBsaWtlICdUdWVzJ1xuICAgICAgICAgIHJldHVybiB3ZWVrZGF5KCdzaG9ydCcsIHRydWUpO1xuICAgICAgICBjYXNlICdjY2NjJzpcbiAgICAgICAgICAvLyBsaWtlICdUdWVzZGF5J1xuICAgICAgICAgIHJldHVybiB3ZWVrZGF5KCdsb25nJywgdHJ1ZSk7XG4gICAgICAgIGNhc2UgJ2NjY2NjJzpcbiAgICAgICAgICAvLyBsaWtlICdUJ1xuICAgICAgICAgIHJldHVybiB3ZWVrZGF5KCduYXJyb3cnLCB0cnVlKTtcbiAgICAgICAgLy8gd2Vla2RheXMgLSBmb3JtYXRcbiAgICAgICAgY2FzZSAnRSc6XG4gICAgICAgICAgLy8gbGlrZSAxXG4gICAgICAgICAgcmV0dXJuIF90aGlzLm51bShkdC53ZWVrZGF5KTtcbiAgICAgICAgY2FzZSAnRUVFJzpcbiAgICAgICAgICAvLyBsaWtlICdUdWVzJ1xuICAgICAgICAgIHJldHVybiB3ZWVrZGF5KCdzaG9ydCcsIGZhbHNlKTtcbiAgICAgICAgY2FzZSAnRUVFRSc6XG4gICAgICAgICAgLy8gbGlrZSAnVHVlc2RheSdcbiAgICAgICAgICByZXR1cm4gd2Vla2RheSgnbG9uZycsIGZhbHNlKTtcbiAgICAgICAgY2FzZSAnRUVFRUUnOlxuICAgICAgICAgIC8vIGxpa2UgJ1QnXG4gICAgICAgICAgcmV0dXJuIHdlZWtkYXkoJ25hcnJvdycsIGZhbHNlKTtcbiAgICAgICAgLy8gbW9udGhzIC0gc3RhbmRhbG9uZVxuICAgICAgICBjYXNlICdMJzpcbiAgICAgICAgICAvLyBsaWtlIDFcbiAgICAgICAgICByZXR1cm4gb3V0cHV0Q2FsID8gc3RyaW5nKHsgbW9udGg6ICdudW1lcmljJywgZGF5OiAnbnVtZXJpYycgfSwgJ21vbnRoJykgOiBfdGhpcy5udW0oZHQubW9udGgpO1xuICAgICAgICBjYXNlICdMTCc6XG4gICAgICAgICAgLy8gbGlrZSAwMSwgZG9lc24ndCBzZWVtIHRvIHdvcmtcbiAgICAgICAgICByZXR1cm4gb3V0cHV0Q2FsID8gc3RyaW5nKHsgbW9udGg6ICcyLWRpZ2l0JywgZGF5OiAnbnVtZXJpYycgfSwgJ21vbnRoJykgOiBfdGhpcy5udW0oZHQubW9udGgsIDIpO1xuICAgICAgICBjYXNlICdMTEwnOlxuICAgICAgICAgIC8vIGxpa2UgSmFuXG4gICAgICAgICAgcmV0dXJuIG1vbnRoKCdzaG9ydCcsIHRydWUpO1xuICAgICAgICBjYXNlICdMTExMJzpcbiAgICAgICAgICAvLyBsaWtlIEphbnVhcnlcbiAgICAgICAgICByZXR1cm4gbW9udGgoJ2xvbmcnLCB0cnVlKTtcbiAgICAgICAgY2FzZSAnTExMTEwnOlxuICAgICAgICAgIC8vIGxpa2UgSlxuICAgICAgICAgIHJldHVybiBtb250aCgnbmFycm93JywgdHJ1ZSk7XG4gICAgICAgIC8vIG1vbnRocyAtIGZvcm1hdFxuICAgICAgICBjYXNlICdNJzpcbiAgICAgICAgICAvLyBsaWtlIDFcbiAgICAgICAgICByZXR1cm4gb3V0cHV0Q2FsID8gc3RyaW5nKHsgbW9udGg6ICdudW1lcmljJyB9LCAnbW9udGgnKSA6IF90aGlzLm51bShkdC5tb250aCk7XG4gICAgICAgIGNhc2UgJ01NJzpcbiAgICAgICAgICAvLyBsaWtlIDAxXG4gICAgICAgICAgcmV0dXJuIG91dHB1dENhbCA/IHN0cmluZyh7IG1vbnRoOiAnMi1kaWdpdCcgfSwgJ21vbnRoJykgOiBfdGhpcy5udW0oZHQubW9udGgsIDIpO1xuICAgICAgICBjYXNlICdNTU0nOlxuICAgICAgICAgIC8vIGxpa2UgSmFuXG4gICAgICAgICAgcmV0dXJuIG1vbnRoKCdzaG9ydCcsIGZhbHNlKTtcbiAgICAgICAgY2FzZSAnTU1NTSc6XG4gICAgICAgICAgLy8gbGlrZSBKYW51YXJ5XG4gICAgICAgICAgcmV0dXJuIG1vbnRoKCdsb25nJywgZmFsc2UpO1xuICAgICAgICBjYXNlICdNTU1NTSc6XG4gICAgICAgICAgLy8gbGlrZSBKXG4gICAgICAgICAgcmV0dXJuIG1vbnRoKCduYXJyb3cnLCBmYWxzZSk7XG4gICAgICAgIC8vIHllYXJzXG4gICAgICAgIGNhc2UgJ3knOlxuICAgICAgICAgIC8vIGxpa2UgMjAxNFxuICAgICAgICAgIHJldHVybiBvdXRwdXRDYWwgPyBzdHJpbmcoeyB5ZWFyOiAnbnVtZXJpYycgfSwgJ3llYXInKSA6IF90aGlzLm51bShkdC55ZWFyKTtcbiAgICAgICAgY2FzZSAneXknOlxuICAgICAgICAgIC8vIGxpa2UgMTRcbiAgICAgICAgICByZXR1cm4gb3V0cHV0Q2FsID8gc3RyaW5nKHsgeWVhcjogJzItZGlnaXQnIH0sICd5ZWFyJykgOiBfdGhpcy5udW0oZHQueWVhci50b1N0cmluZygpLnNsaWNlKC0yKSwgMik7XG4gICAgICAgIGNhc2UgJ3l5eXknOlxuICAgICAgICAgIC8vIGxpa2UgMDAxMlxuICAgICAgICAgIHJldHVybiBvdXRwdXRDYWwgPyBzdHJpbmcoeyB5ZWFyOiAnbnVtZXJpYycgfSwgJ3llYXInKSA6IF90aGlzLm51bShkdC55ZWFyLCA0KTtcbiAgICAgICAgY2FzZSAneXl5eXl5JzpcbiAgICAgICAgICAvLyBsaWtlIDAwMDAxMlxuICAgICAgICAgIHJldHVybiBvdXRwdXRDYWwgPyBzdHJpbmcoeyB5ZWFyOiAnbnVtZXJpYycgfSwgJ3llYXInKSA6IF90aGlzLm51bShkdC55ZWFyLCA2KTtcbiAgICAgICAgLy8gZXJhc1xuICAgICAgICBjYXNlICdHJzpcbiAgICAgICAgICAvLyBsaWtlIEFEXG4gICAgICAgICAgcmV0dXJuIGVyYSgnc2hvcnQnKTtcbiAgICAgICAgY2FzZSAnR0cnOlxuICAgICAgICAgIC8vIGxpa2UgQW5ubyBEb21pbmlcbiAgICAgICAgICByZXR1cm4gZXJhKCdsb25nJyk7XG4gICAgICAgIGNhc2UgJ0dHR0dHJzpcbiAgICAgICAgICByZXR1cm4gZXJhKCduYXJyb3cnKTtcbiAgICAgICAgY2FzZSAna2snOlxuICAgICAgICAgIHJldHVybiBfdGhpcy5udW0oZHQud2Vla1llYXIudG9TdHJpbmcoKS5zbGljZSgtMiksIDIpO1xuICAgICAgICBjYXNlICdra2trJzpcbiAgICAgICAgICByZXR1cm4gX3RoaXMubnVtKGR0LndlZWtZZWFyLCA0KTtcbiAgICAgICAgY2FzZSAnVyc6XG4gICAgICAgICAgcmV0dXJuIF90aGlzLm51bShkdC53ZWVrTnVtYmVyKTtcbiAgICAgICAgY2FzZSAnV1cnOlxuICAgICAgICAgIHJldHVybiBfdGhpcy5udW0oZHQud2Vla051bWJlciwgMik7XG4gICAgICAgIGNhc2UgJ28nOlxuICAgICAgICAgIHJldHVybiBfdGhpcy5udW0oZHQub3JkaW5hbCk7XG4gICAgICAgIGNhc2UgJ29vbyc6XG4gICAgICAgICAgcmV0dXJuIF90aGlzLm51bShkdC5vcmRpbmFsLCAzKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gbWF5YmVNYWNybyh0b2tlbik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBzdHJpbmdpZnlUb2tlbnMoRm9ybWF0dGVyLnBhcnNlRm9ybWF0KGZtdCksIHRva2VuVG9TdHJpbmcpO1xuICB9O1xuXG4gIEZvcm1hdHRlci5wcm90b3R5cGUuZm9ybWF0RHVyYXRpb25Gcm9tU3RyaW5nID0gZnVuY3Rpb24gZm9ybWF0RHVyYXRpb25Gcm9tU3RyaW5nKGR1ciwgZm10KSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICB2YXIgdG9rZW5Ub0ZpZWxkID0gZnVuY3Rpb24gdG9rZW5Ub0ZpZWxkKHRva2VuKSB7XG4gICAgICBzd2l0Y2ggKHRva2VuWzBdKSB7XG4gICAgICAgIGNhc2UgJ1MnOlxuICAgICAgICAgIHJldHVybiAnbWlsbGlzZWNvbmQnO1xuICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICByZXR1cm4gJ3NlY29uZCc7XG4gICAgICAgIGNhc2UgJ20nOlxuICAgICAgICAgIHJldHVybiAnbWludXRlJztcbiAgICAgICAgY2FzZSAnaCc6XG4gICAgICAgICAgcmV0dXJuICdob3VyJztcbiAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgICAgcmV0dXJuICdkYXknO1xuICAgICAgICBjYXNlICdNJzpcbiAgICAgICAgICByZXR1cm4gJ21vbnRoJztcbiAgICAgICAgY2FzZSAneSc6XG4gICAgICAgICAgcmV0dXJuICd5ZWFyJztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgICAgICB0b2tlblRvU3RyaW5nID0gZnVuY3Rpb24gdG9rZW5Ub1N0cmluZyhsaWxkdXIpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgdmFyIG1hcHBlZCA9IHRva2VuVG9GaWVsZCh0b2tlbik7XG4gICAgICAgIGlmIChtYXBwZWQpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMyLm51bShsaWxkdXIuZ2V0KG1hcHBlZCksIHRva2VuLmxlbmd0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgICAgIHRva2VucyA9IEZvcm1hdHRlci5wYXJzZUZvcm1hdChmbXQpLFxuICAgICAgICByZWFsVG9rZW5zID0gdG9rZW5zLnJlZHVjZShmdW5jdGlvbiAoZm91bmQsIF9yZWYyKSB7XG4gICAgICB2YXIgbGl0ZXJhbCA9IF9yZWYyLmxpdGVyYWwsXG4gICAgICAgICAgdmFsID0gX3JlZjIudmFsO1xuICAgICAgcmV0dXJuIGxpdGVyYWwgPyBmb3VuZCA6IGZvdW5kLmNvbmNhdCh2YWwpO1xuICAgIH0sIFtdKSxcbiAgICAgICAgY29sbGFwc2VkID0gZHVyLnNoaWZ0VG8uYXBwbHkoZHVyLCByZWFsVG9rZW5zLm1hcCh0b2tlblRvRmllbGQpLmZpbHRlcihmdW5jdGlvbiAodCkge1xuICAgICAgcmV0dXJuIHQ7XG4gICAgfSkpO1xuICAgIHJldHVybiBzdHJpbmdpZnlUb2tlbnModG9rZW5zLCB0b2tlblRvU3RyaW5nKGNvbGxhcHNlZCkpO1xuICB9O1xuXG4gIHJldHVybiBGb3JtYXR0ZXI7XG59KCk7XG5cbnZhciBzeXNMb2NhbGVDYWNoZSA9IG51bGw7XG5mdW5jdGlvbiBzeXN0ZW1Mb2NhbGUoKSB7XG4gIGlmIChzeXNMb2NhbGVDYWNoZSkge1xuICAgIHJldHVybiBzeXNMb2NhbGVDYWNoZTtcbiAgfSBlbHNlIGlmIChVdGlsLmhhc0ludGwoKSkge1xuICAgIHN5c0xvY2FsZUNhY2hlID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoKS5yZXNvbHZlZE9wdGlvbnMoKS5sb2NhbGU7XG4gICAgcmV0dXJuIHN5c0xvY2FsZUNhY2hlO1xuICB9IGVsc2Uge1xuICAgIHN5c0xvY2FsZUNhY2hlID0gJ2VuLVVTJztcbiAgICByZXR1cm4gc3lzTG9jYWxlQ2FjaGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW50bENvbmZpZ1N0cmluZyhsb2NhbGUsIG51bWJlcmluZ1N5c3RlbSwgb3V0cHV0Q2FsZW5kYXIpIHtcbiAgaWYgKFV0aWwuaGFzSW50bCgpKSB7XG4gICAgbG9jYWxlID0gQXJyYXkuaXNBcnJheShsb2NhbGUpID8gbG9jYWxlIDogW2xvY2FsZV07XG5cbiAgICBpZiAob3V0cHV0Q2FsZW5kYXIgfHwgbnVtYmVyaW5nU3lzdGVtKSB7XG4gICAgICBsb2NhbGUgPSBsb2NhbGUubWFwKGZ1bmN0aW9uIChsKSB7XG4gICAgICAgIGwgKz0gJy11JztcblxuICAgICAgICBpZiAob3V0cHV0Q2FsZW5kYXIpIHtcbiAgICAgICAgICBsICs9ICctY2EtJyArIG91dHB1dENhbGVuZGFyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG51bWJlcmluZ1N5c3RlbSkge1xuICAgICAgICAgIGwgKz0gJy1udS0nICsgbnVtYmVyaW5nU3lzdGVtO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBsb2NhbGU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcE1vbnRocyhmKSB7XG4gIHZhciBtcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMTsgaSA8PSAxMjsgaSsrKSB7XG4gICAgdmFyIGR0ID0gRGF0ZVRpbWUudXRjKDIwMTYsIGksIDEpO1xuICAgIG1zLnB1c2goZihkdCkpO1xuICB9XG4gIHJldHVybiBtcztcbn1cblxuZnVuY3Rpb24gbWFwV2Vla2RheXMoZikge1xuICB2YXIgbXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPD0gNzsgaSsrKSB7XG4gICAgdmFyIGR0ID0gRGF0ZVRpbWUudXRjKDIwMTYsIDExLCAxMyArIGkpO1xuICAgIG1zLnB1c2goZihkdCkpO1xuICB9XG4gIHJldHVybiBtcztcbn1cblxuZnVuY3Rpb24gbGlzdFN0dWZmKGxvYywgbGVuZ3RoLCBkZWZhdWx0T0ssIGVuZ2xpc2hGbiwgaW50bEZuKSB7XG4gIHZhciBtb2RlID0gbG9jLmxpc3RpbmdNb2RlKGRlZmF1bHRPSyk7XG5cbiAgaWYgKG1vZGUgPT09ICdlcnJvcicpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSBlbHNlIGlmIChtb2RlID09PSAnZW4nKSB7XG4gICAgcmV0dXJuIGVuZ2xpc2hGbihsZW5ndGgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBpbnRsRm4obGVuZ3RoKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cblxudmFyIFBvbHlOdW1iZXJGb3JtYXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFBvbHlOdW1iZXJGb3JtYXR0ZXIob3B0cykge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFBvbHlOdW1iZXJGb3JtYXR0ZXIpO1xuXG4gICAgdGhpcy5wYWRUbyA9IG9wdHMucGFkVG8gfHwgMDtcbiAgICB0aGlzLnJvdW5kID0gb3B0cy5yb3VuZCB8fCBmYWxzZTtcbiAgfVxuXG4gIFBvbHlOdW1iZXJGb3JtYXR0ZXIucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uIGZvcm1hdChpKSB7XG4gICAgdmFyIG1heWJlUm91bmRlZCA9IHRoaXMucm91bmQgPyBNYXRoLnJvdW5kKGkpIDogaTtcbiAgICByZXR1cm4gVXRpbC5wYWRTdGFydChtYXliZVJvdW5kZWQudG9TdHJpbmcoKSwgdGhpcy5wYWRUbyk7XG4gIH07XG5cbiAgcmV0dXJuIFBvbHlOdW1iZXJGb3JtYXR0ZXI7XG59KCk7XG5cbnZhciBQb2x5RGF0ZUZvcm1hdHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gUG9seURhdGVGb3JtYXR0ZXIoZHQsIGludGwsIG9wdHMpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBQb2x5RGF0ZUZvcm1hdHRlcik7XG5cbiAgICB0aGlzLm9wdHMgPSBvcHRzO1xuICAgIHRoaXMuaGFzSW50bCA9IFV0aWwuaGFzSW50bCgpO1xuXG4gICAgdmFyIHogPSB2b2lkIDA7XG4gICAgaWYgKGR0LnpvbmUudW5pdmVyc2FsICYmIHRoaXMuaGFzSW50bCkge1xuICAgICAgLy8gaWYgd2UgaGF2ZSBhIGZpeGVkLW9mZnNldCB6b25lIHRoYXQgaXNuJ3QgYWN0dWFsbHkgVVRDLFxuICAgICAgLy8gKGxpa2UgVVRDKzgpLCB3ZSBuZWVkIHRvIG1ha2UgZG8gd2l0aCBqdXN0IGRpc3BsYXlpbmdcbiAgICAgIC8vIHRoZSB0aW1lIGluIFVUQzsgdGhlIGZvcm1hdHRlciBkb2Vzbid0IGtub3cgaG93IHRvIGhhbmRsZSBVVEMrOFxuICAgICAgdGhpcy5kdCA9IGR0Lm9mZnNldCA9PT0gMCA/IGR0IDogRGF0ZVRpbWUuZnJvbU1pbGxpcyhkdC50cyArIGR0Lm9mZnNldCAqIDYwICogMTAwMCk7XG4gICAgICB6ID0gJ1VUQyc7XG4gICAgfSBlbHNlIGlmIChkdC56b25lLnR5cGUgPT09ICdsb2NhbCcpIHtcbiAgICAgIHRoaXMuZHQgPSBkdDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kdCA9IGR0O1xuICAgICAgeiA9IGR0LnpvbmUubmFtZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNJbnRsKSB7XG4gICAgICB2YXIgcmVhbEludGxPcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRzKTtcbiAgICAgIGlmICh6KSB7XG4gICAgICAgIHJlYWxJbnRsT3B0cy50aW1lWm9uZSA9IHo7XG4gICAgICB9XG4gICAgICB0aGlzLmR0ZiA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGludGwsIHJlYWxJbnRsT3B0cyk7XG4gICAgfVxuICB9XG5cbiAgUG9seURhdGVGb3JtYXR0ZXIucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uIGZvcm1hdCgpIHtcbiAgICBpZiAodGhpcy5oYXNJbnRsKSB7XG4gICAgICByZXR1cm4gdGhpcy5kdGYuZm9ybWF0KHRoaXMuZHQudG9KU0RhdGUoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB0b2tlbkZvcm1hdCA9IEVuZ2xpc2guZm9ybWF0U3RyaW5nKHRoaXMub3B0cyksXG4gICAgICAgICAgbG9jID0gTG9jYWxlLmNyZWF0ZSgnZW4tVVMnKTtcbiAgICAgIHJldHVybiBGb3JtYXR0ZXIuY3JlYXRlKGxvYykuZm9ybWF0RGF0ZVRpbWVGcm9tU3RyaW5nKHRoaXMuZHQsIHRva2VuRm9ybWF0KTtcbiAgICB9XG4gIH07XG5cbiAgUG9seURhdGVGb3JtYXR0ZXIucHJvdG90eXBlLmZvcm1hdFRvUGFydHMgPSBmdW5jdGlvbiBmb3JtYXRUb1BhcnRzKCkge1xuICAgIGlmICh0aGlzLmhhc0ludGwgJiYgVXRpbC5oYXNGb3JtYXRUb1BhcnRzKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmR0Zi5mb3JtYXRUb1BhcnRzKHRoaXMuZHQudG9KU0RhdGUoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRoaXMgaXMga2luZCBvZiBhIGNvcCBvdXQuIFdlIGFjdHVhbGx5IGNvdWxkIGRvIHRoaXMgZm9yIEVuZ2xpc2guIEhvd2V2ZXIsIHdlIGNvdWxkbid0IGRvIGl0IGZvciBpbnRsIHN0cmluZ3NcbiAgICAgIC8vIGFuZCBJTU8gaXQncyB0b28gd2VpcmQgdG8gaGF2ZSBhbiB1bmNhbm55IHZhbGxleSBsaWtlIHRoYXRcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gIH07XG5cbiAgUG9seURhdGVGb3JtYXR0ZXIucHJvdG90eXBlLnJlc29sdmVkT3B0aW9ucyA9IGZ1bmN0aW9uIHJlc29sdmVkT3B0aW9ucygpIHtcbiAgICBpZiAodGhpcy5oYXNJbnRsKSB7XG4gICAgICByZXR1cm4gdGhpcy5kdGYucmVzb2x2ZWRPcHRpb25zKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxvY2FsZTogJ2VuLVVTJyxcbiAgICAgICAgbnVtYmVyaW5nU3lzdGVtOiAnbGF0bicsXG4gICAgICAgIG91dHB1dENhbGVuZGFyOiAnZ3JlZ29yeSdcbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBQb2x5RGF0ZUZvcm1hdHRlcjtcbn0oKTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5cbnZhciBMb2NhbGUgPSBmdW5jdGlvbiAoKSB7XG4gIExvY2FsZS5mcm9tT3B0cyA9IGZ1bmN0aW9uIGZyb21PcHRzKG9wdHMpIHtcbiAgICByZXR1cm4gTG9jYWxlLmNyZWF0ZShvcHRzLmxvY2FsZSwgb3B0cy5udW1iZXJpbmdTeXN0ZW0sIG9wdHMub3V0cHV0Q2FsZW5kYXIsIG9wdHMuZGVmYXVsdFRvRU4pO1xuICB9O1xuXG4gIExvY2FsZS5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUobG9jYWxlLCBudW1iZXJpbmdTeXN0ZW0sIG91dHB1dENhbGVuZGFyKSB7XG4gICAgdmFyIGRlZmF1bHRUb0VOID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiBmYWxzZTtcblxuICAgIHZhciBzcGVjaWZpZWRMb2NhbGUgPSBsb2NhbGUgfHwgU2V0dGluZ3MuZGVmYXVsdExvY2FsZSxcblxuICAgIC8vIHRoZSBzeXN0ZW0gbG9jYWxlIGlzIHVzZWZ1bCBmb3IgaHVtYW4gcmVhZGFibGUgc3RyaW5ncyBidXQgYW5ub3lpbmcgZm9yIHBhcnNpbmcvZm9ybWF0dGluZyBrbm93biBmb3JtYXRzXG4gICAgbG9jYWxlUiA9IHNwZWNpZmllZExvY2FsZSB8fCAoZGVmYXVsdFRvRU4gPyAnZW4tVVMnIDogc3lzdGVtTG9jYWxlKCkpLFxuICAgICAgICBudW1iZXJpbmdTeXN0ZW1SID0gbnVtYmVyaW5nU3lzdGVtIHx8IFNldHRpbmdzLmRlZmF1bHROdW1iZXJpbmdTeXN0ZW0sXG4gICAgICAgIG91dHB1dENhbGVuZGFyUiA9IG91dHB1dENhbGVuZGFyIHx8IFNldHRpbmdzLmRlZmF1bHRPdXRwdXRDYWxlbmRhcjtcbiAgICByZXR1cm4gbmV3IExvY2FsZShsb2NhbGVSLCBudW1iZXJpbmdTeXN0ZW1SLCBvdXRwdXRDYWxlbmRhclIsIHNwZWNpZmllZExvY2FsZSk7XG4gIH07XG5cbiAgTG9jYWxlLnJlc2V0Q2FjaGUgPSBmdW5jdGlvbiByZXNldENhY2hlKCkge1xuICAgIHN5c0xvY2FsZUNhY2hlID0gbnVsbDtcbiAgfTtcblxuICBMb2NhbGUuZnJvbU9iamVjdCA9IGZ1bmN0aW9uIGZyb21PYmplY3QoKSB7XG4gICAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9LFxuICAgICAgICBsb2NhbGUgPSBfcmVmLmxvY2FsZSxcbiAgICAgICAgbnVtYmVyaW5nU3lzdGVtID0gX3JlZi5udW1iZXJpbmdTeXN0ZW0sXG4gICAgICAgIG91dHB1dENhbGVuZGFyID0gX3JlZi5vdXRwdXRDYWxlbmRhcjtcblxuICAgIHJldHVybiBMb2NhbGUuY3JlYXRlKGxvY2FsZSwgbnVtYmVyaW5nU3lzdGVtLCBvdXRwdXRDYWxlbmRhcik7XG4gIH07XG5cbiAgZnVuY3Rpb24gTG9jYWxlKGxvY2FsZSwgbnVtYmVyaW5nLCBvdXRwdXRDYWxlbmRhciwgc3BlY2lmaWVkTG9jYWxlKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgTG9jYWxlKTtcblxuICAgIHRoaXMubG9jYWxlID0gbG9jYWxlO1xuICAgIHRoaXMubnVtYmVyaW5nU3lzdGVtID0gbnVtYmVyaW5nO1xuICAgIHRoaXMub3V0cHV0Q2FsZW5kYXIgPSBvdXRwdXRDYWxlbmRhcjtcbiAgICB0aGlzLmludGwgPSBpbnRsQ29uZmlnU3RyaW5nKHRoaXMubG9jYWxlLCB0aGlzLm51bWJlcmluZ1N5c3RlbSwgdGhpcy5vdXRwdXRDYWxlbmRhcik7XG5cbiAgICB0aGlzLndlZWtkYXlzQ2FjaGUgPSB7IGZvcm1hdDoge30sIHN0YW5kYWxvbmU6IHt9IH07XG4gICAgdGhpcy5tb250aHNDYWNoZSA9IHsgZm9ybWF0OiB7fSwgc3RhbmRhbG9uZToge30gfTtcbiAgICB0aGlzLm1lcmlkaWVtQ2FjaGUgPSBudWxsO1xuICAgIHRoaXMuZXJhQ2FjaGUgPSB7fTtcblxuICAgIHRoaXMuc3BlY2lmaWVkTG9jYWxlID0gc3BlY2lmaWVkTG9jYWxlO1xuICB9XG5cbiAgLy8gdG9kbzogY2FjaGUgbWVcblxuXG4gIExvY2FsZS5wcm90b3R5cGUubGlzdGluZ01vZGUgPSBmdW5jdGlvbiBsaXN0aW5nTW9kZSgpIHtcbiAgICB2YXIgZGVmYXVsdE9rID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0cnVlO1xuXG4gICAgdmFyIGhhc0ludGwgPSBVdGlsLmhhc0ludGwoKSxcbiAgICAgICAgaGFzRlRQID0gaGFzSW50bCAmJiBVdGlsLmhhc0Zvcm1hdFRvUGFydHMoKSxcbiAgICAgICAgaXNBY3R1YWxseUVuID0gdGhpcy5sb2NhbGUgPT09ICdlbicgfHwgdGhpcy5sb2NhbGUudG9Mb3dlckNhc2UoKSA9PT0gJ2VuLXVzJyB8fCBoYXNJbnRsICYmIEludGwuRGF0ZVRpbWVGb3JtYXQodGhpcy5pbnRsKS5yZXNvbHZlZE9wdGlvbnMoKS5sb2NhbGUuc3RhcnRzV2l0aCgnZW4tdXMnKSxcbiAgICAgICAgaGFzTm9XZWlyZG5lc3MgPSAodGhpcy5udW1iZXJpbmdTeXN0ZW0gPT09IG51bGwgfHwgdGhpcy5udW1iZXJpbmdTeXN0ZW0gPT09ICdsYXRuJykgJiYgKHRoaXMub3V0cHV0Q2FsZW5kYXIgPT09IG51bGwgfHwgdGhpcy5vdXRwdXRDYWxlbmRhciA9PT0gJ2dyZWdvcnknKTtcblxuICAgIGlmICghaGFzRlRQICYmICEoaXNBY3R1YWxseUVuICYmIGhhc05vV2VpcmRuZXNzKSAmJiAhZGVmYXVsdE9rKSB7XG4gICAgICByZXR1cm4gJ2Vycm9yJztcbiAgICB9IGVsc2UgaWYgKCFoYXNGVFAgfHwgaXNBY3R1YWxseUVuICYmIGhhc05vV2VpcmRuZXNzKSB7XG4gICAgICByZXR1cm4gJ2VuJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdpbnRsJztcbiAgICB9XG4gIH07XG5cbiAgTG9jYWxlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uIGNsb25lKGFsdHMpIHtcbiAgICBpZiAoIWFsdHMgfHwgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYWx0cykubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIExvY2FsZS5jcmVhdGUoYWx0cy5sb2NhbGUgfHwgdGhpcy5zcGVjaWZpZWRMb2NhbGUsIGFsdHMubnVtYmVyaW5nU3lzdGVtIHx8IHRoaXMubnVtYmVyaW5nU3lzdGVtLCBhbHRzLm91dHB1dENhbGVuZGFyIHx8IHRoaXMub3V0cHV0Q2FsZW5kYXIsIGFsdHMuZGVmYXVsdFRvRU4gfHwgZmFsc2UpO1xuICAgIH1cbiAgfTtcblxuICBMb2NhbGUucHJvdG90eXBlLnJlZGVmYXVsdFRvRU4gPSBmdW5jdGlvbiByZWRlZmF1bHRUb0VOKCkge1xuICAgIHZhciBhbHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICAgIHJldHVybiB0aGlzLmNsb25lKE9iamVjdC5hc3NpZ24oe30sIGFsdHMsIHsgZGVmYXVsdFRvRU46IHRydWUgfSkpO1xuICB9O1xuXG4gIExvY2FsZS5wcm90b3R5cGUucmVkZWZhdWx0VG9TeXN0ZW0gPSBmdW5jdGlvbiByZWRlZmF1bHRUb1N5c3RlbSgpIHtcbiAgICB2YXIgYWx0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgICByZXR1cm4gdGhpcy5jbG9uZShPYmplY3QuYXNzaWduKHt9LCBhbHRzLCB7IGRlZmF1bHRUb0VOOiBmYWxzZSB9KSk7XG4gIH07XG5cbiAgTG9jYWxlLnByb3RvdHlwZS5tb250aHMgPSBmdW5jdGlvbiBtb250aHMobGVuZ3RoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBmb3JtYXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZhbHNlO1xuICAgIHZhciBkZWZhdWx0T0sgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHRydWU7XG5cbiAgICByZXR1cm4gbGlzdFN0dWZmKHRoaXMsIGxlbmd0aCwgZGVmYXVsdE9LLCBFbmdsaXNoLm1vbnRocywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGludGwgPSBmb3JtYXQgPyB7IG1vbnRoOiBsZW5ndGgsIGRheTogJ251bWVyaWMnIH0gOiB7IG1vbnRoOiBsZW5ndGggfSxcbiAgICAgICAgICBmb3JtYXRTdHIgPSBmb3JtYXQgPyAnZm9ybWF0JyA6ICdzdGFuZGFsb25lJztcbiAgICAgIGlmICghX3RoaXMubW9udGhzQ2FjaGVbZm9ybWF0U3RyXVtsZW5ndGhdKSB7XG4gICAgICAgIF90aGlzLm1vbnRoc0NhY2hlW2Zvcm1hdFN0cl1bbGVuZ3RoXSA9IG1hcE1vbnRocyhmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuZXh0cmFjdChkdCwgaW50bCwgJ21vbnRoJyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF90aGlzLm1vbnRoc0NhY2hlW2Zvcm1hdFN0cl1bbGVuZ3RoXTtcbiAgICB9KTtcbiAgfTtcblxuICBMb2NhbGUucHJvdG90eXBlLndlZWtkYXlzID0gZnVuY3Rpb24gd2Vla2RheXMobGVuZ3RoKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICB2YXIgZm9ybWF0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcbiAgICB2YXIgZGVmYXVsdE9LID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB0cnVlO1xuXG4gICAgcmV0dXJuIGxpc3RTdHVmZih0aGlzLCBsZW5ndGgsIGRlZmF1bHRPSywgRW5nbGlzaC53ZWVrZGF5cywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGludGwgPSBmb3JtYXQgPyB7IHdlZWtkYXk6IGxlbmd0aCwgeWVhcjogJ251bWVyaWMnLCBtb250aDogJ2xvbmcnLCBkYXk6ICdudW1lcmljJyB9IDogeyB3ZWVrZGF5OiBsZW5ndGggfSxcbiAgICAgICAgICBmb3JtYXRTdHIgPSBmb3JtYXQgPyAnZm9ybWF0JyA6ICdzdGFuZGFsb25lJztcbiAgICAgIGlmICghX3RoaXMyLndlZWtkYXlzQ2FjaGVbZm9ybWF0U3RyXVtsZW5ndGhdKSB7XG4gICAgICAgIF90aGlzMi53ZWVrZGF5c0NhY2hlW2Zvcm1hdFN0cl1bbGVuZ3RoXSA9IG1hcFdlZWtkYXlzKGZ1bmN0aW9uIChkdCkge1xuICAgICAgICAgIHJldHVybiBfdGhpczIuZXh0cmFjdChkdCwgaW50bCwgJ3dlZWtkYXknKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX3RoaXMyLndlZWtkYXlzQ2FjaGVbZm9ybWF0U3RyXVtsZW5ndGhdO1xuICAgIH0pO1xuICB9O1xuXG4gIExvY2FsZS5wcm90b3R5cGUubWVyaWRpZW1zID0gZnVuY3Rpb24gbWVyaWRpZW1zKCkge1xuICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgdmFyIGRlZmF1bHRPSyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdHJ1ZTtcblxuICAgIHJldHVybiBsaXN0U3R1ZmYodGhpcywgdW5kZWZpbmVkLCBkZWZhdWx0T0ssIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBFbmdsaXNoLm1lcmlkaWVtcztcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBJbiB0aGVvcnkgdGhlcmUgY291bGQgYmUgYXJpYml0cmFyeSBkYXkgcGVyaW9kcy4gV2UncmUgZ29ubmEgYXNzdW1lIHRoZXJlIGFyZSBleGFjdGx5IHR3b1xuICAgICAgLy8gZm9yIEFNIGFuZCBQTS4gVGhpcyBpcyBwcm9iYWJseSB3cm9uZywgYnV0IGl0J3MgbWFrZXMgcGFyc2luZyB3YXkgZWFzaWVyLlxuICAgICAgaWYgKCFfdGhpczMubWVyaWRpZW1DYWNoZSkge1xuICAgICAgICB2YXIgaW50bCA9IHsgaG91cjogJ251bWVyaWMnLCBob3VyMTI6IHRydWUgfTtcbiAgICAgICAgX3RoaXMzLm1lcmlkaWVtQ2FjaGUgPSBbRGF0ZVRpbWUudXRjKDIwMTYsIDExLCAxMywgOSksIERhdGVUaW1lLnV0YygyMDE2LCAxMSwgMTMsIDE5KV0ubWFwKGZ1bmN0aW9uIChkdCkge1xuICAgICAgICAgIHJldHVybiBfdGhpczMuZXh0cmFjdChkdCwgaW50bCwgJ2RheXBlcmlvZCcpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF90aGlzMy5tZXJpZGllbUNhY2hlO1xuICAgIH0pO1xuICB9O1xuXG4gIExvY2FsZS5wcm90b3R5cGUuZXJhcyA9IGZ1bmN0aW9uIGVyYXMobGVuZ3RoKSB7XG4gICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICB2YXIgZGVmYXVsdE9LID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0cnVlO1xuXG4gICAgcmV0dXJuIGxpc3RTdHVmZih0aGlzLCBsZW5ndGgsIGRlZmF1bHRPSywgRW5nbGlzaC5lcmFzLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaW50bCA9IHsgZXJhOiBsZW5ndGggfTtcblxuICAgICAgLy8gVGhpcyBpcyB1dHRlciBidWxsc2hpdC4gRGlmZmVyZW50IGNhbGVuZGFycyBhcmUgZ29pbmcgdG8gZGVmaW5lIGVyYXMgdG90YWxseSBkaWZmZXJlbnRseS4gV2hhdCBJIG5lZWQgaXMgdGhlIG1pbmltdW0gc2V0IG9mIGRhdGVzXG4gICAgICAvLyB0byBkZWZpbml0ZWx5IGVudW1lcmF0ZSB0aGVtLlxuICAgICAgaWYgKCFfdGhpczQuZXJhQ2FjaGVbbGVuZ3RoXSkge1xuICAgICAgICBfdGhpczQuZXJhQ2FjaGVbbGVuZ3RoXSA9IFtEYXRlVGltZS51dGMoLTQwLCAxLCAxKSwgRGF0ZVRpbWUudXRjKDIwMTcsIDEsIDEpXS5tYXAoZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzNC5leHRyYWN0KGR0LCBpbnRsLCAnZXJhJyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX3RoaXM0LmVyYUNhY2hlW2xlbmd0aF07XG4gICAgfSk7XG4gIH07XG5cbiAgTG9jYWxlLnByb3RvdHlwZS5leHRyYWN0ID0gZnVuY3Rpb24gZXh0cmFjdChkdCwgaW50bE9wdHMsIGZpZWxkKSB7XG4gICAgdmFyIGRmID0gdGhpcy5kdEZvcm1hdHRlcihkdCwgaW50bE9wdHMpLFxuICAgICAgICByZXN1bHRzID0gZGYuZm9ybWF0VG9QYXJ0cygpLFxuICAgICAgICBtYXRjaGluZyA9IHJlc3VsdHMuZmluZChmdW5jdGlvbiAobSkge1xuICAgICAgcmV0dXJuIG0udHlwZS50b0xvd2VyQ2FzZSgpID09PSBmaWVsZDtcbiAgICB9KTtcblxuICAgIHJldHVybiBtYXRjaGluZyA/IG1hdGNoaW5nLnZhbHVlIDogbnVsbDtcbiAgfTtcblxuICBMb2NhbGUucHJvdG90eXBlLm51bWJlckZvcm1hdHRlciA9IGZ1bmN0aW9uIG51bWJlckZvcm1hdHRlcigpIHtcbiAgICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG4gICAgdmFyIGludGxPcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgIGlmIChVdGlsLmhhc0ludGwoKSkge1xuICAgICAgdmFyIHJlYWxJbnRsT3B0cyA9IE9iamVjdC5hc3NpZ24oeyB1c2VHcm91cGluZzogZmFsc2UgfSwgaW50bE9wdHMpO1xuXG4gICAgICBpZiAob3B0cy5wYWRUbyA+IDApIHtcbiAgICAgICAgcmVhbEludGxPcHRzLm1pbmltdW1JbnRlZ2VyRGlnaXRzID0gb3B0cy5wYWRUbztcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdHMucm91bmQpIHtcbiAgICAgICAgcmVhbEludGxPcHRzLm1heGltdW1GcmFjdGlvbkRpZ2l0cyA9IDA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgSW50bC5OdW1iZXJGb3JtYXQodGhpcy5pbnRsLCByZWFsSW50bE9wdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IFBvbHlOdW1iZXJGb3JtYXR0ZXIob3B0cyk7XG4gICAgfVxuICB9O1xuXG4gIExvY2FsZS5wcm90b3R5cGUuZHRGb3JtYXR0ZXIgPSBmdW5jdGlvbiBkdEZvcm1hdHRlcihkdCkge1xuICAgIHZhciBpbnRsT3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICByZXR1cm4gbmV3IFBvbHlEYXRlRm9ybWF0dGVyKGR0LCB0aGlzLmludGwsIGludGxPcHRzKTtcbiAgfTtcblxuICBMb2NhbGUucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyhvdGhlcikge1xuICAgIHJldHVybiB0aGlzLmxvY2FsZSA9PT0gb3RoZXIubG9jYWxlICYmIHRoaXMubnVtYmVyaW5nU3lzdGVtID09PSBvdGhlci5udW1iZXJpbmdTeXN0ZW0gJiYgdGhpcy5vdXRwdXRDYWxlbmRhciA9PT0gb3RoZXIub3V0cHV0Q2FsZW5kYXI7XG4gIH07XG5cbiAgcmV0dXJuIExvY2FsZTtcbn0oKTtcblxudmFyIG5vdyA9IGZ1bmN0aW9uIG5vdygpIHtcbiAgcmV0dXJuIG5ldyBEYXRlKCkudmFsdWVPZigpO1xufTtcbnZhciBkZWZhdWx0Wm9uZSA9IG51bGw7XG52YXIgZGVmYXVsdExvY2FsZSA9IG51bGw7XG52YXIgZGVmYXVsdE51bWJlcmluZ1N5c3RlbSA9IG51bGw7XG52YXIgZGVmYXVsdE91dHB1dENhbGVuZGFyID0gbnVsbDtcbnZhciB0aHJvd09uSW52YWxpZCA9IGZhbHNlO1xuXG4vKipcbiAqIFNldHRpbmdzIGNvbnRhaW5zIHN0YXRpYyBnZXR0ZXJzIGFuZCBzZXR0ZXJzIHRoYXQgY29udHJvbCBMdXhvbidzIG92ZXJhbGwgYmVoYXZpb3IuIEx1eG9uIGlzIGEgc2ltcGxlIGxpYnJhcnkgd2l0aCBmZXcgb3B0aW9ucywgYnV0IHRoZSBvbmVzIGl0IGRvZXMgaGF2ZSBsaXZlIGhlcmUuXG4gKi9cbnZhciBTZXR0aW5ncyA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU2V0dGluZ3MoKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgU2V0dGluZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IEx1eG9uJ3MgZ2xvYmFsIGNhY2hlcy4gU2hvdWxkIG9ubHkgYmUgbmVjZXNzYXJ5IGluIHRlc3Rpbmcgc2NlbmFyaW9zLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgU2V0dGluZ3MucmVzZXRDYWNoZXMgPSBmdW5jdGlvbiByZXNldENhY2hlcygpIHtcbiAgICBMb2NhbGUucmVzZXRDYWNoZSgpO1xuICB9O1xuXG4gIGNyZWF0ZUNsYXNzKFNldHRpbmdzLCBudWxsLCBbe1xuICAgIGtleTogJ25vdycsXG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGNhbGxiYWNrIGZvciByZXR1cm5pbmcgdGhlIGN1cnJlbnQgdGltZXN0YW1wLlxuICAgICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiBub3c7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBjYWxsYmFjayBmb3IgcmV0dXJuaW5nIHRoZSBjdXJyZW50IHRpbWVzdGFtcC5cbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAgICovXG4gICAgLFxuICAgIHNldDogZnVuY3Rpb24gc2V0JCQxKG4pIHtcbiAgICAgIG5vdyA9IG47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBkZWZhdWx0IHRpbWUgem9uZSB0byBjcmVhdGUgRGF0ZVRpbWVzIGluLlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2RlZmF1bHRab25lTmFtZScsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gKGRlZmF1bHRab25lIHx8IExvY2FsWm9uZS5pbnN0YW5jZSkubmFtZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIGRlZmF1bHQgdGltZSB6b25lIHRvIGNyZWF0ZSBEYXRlVGltZXMgaW4uIERvZXMgbm90IGFmZmVjdCBleGlzdGluZyBpbnN0YW5jZXMuXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICAsXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQkJDEoeikge1xuICAgICAgZGVmYXVsdFpvbmUgPSBVdGlsLm5vcm1hbGl6ZVpvbmUoeik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBkZWZhdWx0IHRpbWUgem9uZSBvYmplY3QgdG8gY3JlYXRlIERhdGVUaW1lcyBpbi4gRG9lcyBub3QgYWZmZWN0IGV4aXN0aW5nIGluc3RhbmNlcy5cbiAgICAgKiBAdHlwZSB7Wm9uZX1cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnZGVmYXVsdFpvbmUnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIGRlZmF1bHRab25lIHx8IExvY2FsWm9uZS5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGRlZmF1bHQgbG9jYWxlIHRvIGNyZWF0ZSBEYXRlVGltZXMgd2l0aC4gRG9lcyBub3QgYWZmZWN0IGV4aXN0aW5nIGluc3RhbmNlcy5cbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdkZWZhdWx0TG9jYWxlJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiBkZWZhdWx0TG9jYWxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgZGVmYXVsdCBsb2NhbGUgdG8gY3JlYXRlIERhdGVUaW1lcyB3aXRoLiBEb2VzIG5vdCBhZmZlY3QgZXhpc3RpbmcgaW5zdGFuY2VzLlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgLFxuICAgIHNldDogZnVuY3Rpb24gc2V0JCQxKGxvY2FsZSkge1xuICAgICAgZGVmYXVsdExvY2FsZSA9IGxvY2FsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGRlZmF1bHQgbnVtYmVyaW5nIHN5c3RlbSB0byBjcmVhdGUgRGF0ZVRpbWVzIHdpdGguIERvZXMgbm90IGFmZmVjdCBleGlzdGluZyBpbnN0YW5jZXMuXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnZGVmYXVsdE51bWJlcmluZ1N5c3RlbScsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gZGVmYXVsdE51bWJlcmluZ1N5c3RlbTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIGRlZmF1bHQgbnVtYmVyaW5nIHN5c3RlbSB0byBjcmVhdGUgRGF0ZVRpbWVzIHdpdGguIERvZXMgbm90IGFmZmVjdCBleGlzdGluZyBpbnN0YW5jZXMuXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICAsXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQkJDEobnVtYmVyaW5nU3lzdGVtKSB7XG4gICAgICBkZWZhdWx0TnVtYmVyaW5nU3lzdGVtID0gbnVtYmVyaW5nU3lzdGVtO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgZGVmYXVsdCBvdXRwdXQgY2FsZW5kYXIgdG8gY3JlYXRlIERhdGVUaW1lcyB3aXRoLiBEb2VzIG5vdCBhZmZlY3QgZXhpc3RpbmcgaW5zdGFuY2VzLlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2RlZmF1bHRPdXRwdXRDYWxlbmRhcicsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gZGVmYXVsdE91dHB1dENhbGVuZGFyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgZGVmYXVsdCBvdXRwdXQgY2FsZW5kYXIgdG8gY3JlYXRlIERhdGVUaW1lcyB3aXRoLiBEb2VzIG5vdCBhZmZlY3QgZXhpc3RpbmcgaW5zdGFuY2VzLlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgLFxuICAgIHNldDogZnVuY3Rpb24gc2V0JCQxKG91dHB1dENhbGVuZGFyKSB7XG4gICAgICBkZWZhdWx0T3V0cHV0Q2FsZW5kYXIgPSBvdXRwdXRDYWxlbmRhcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgd2hldGhlciBMdXhvbiB3aWxsIHRocm93IHdoZW4gaXQgZW5jb3VudGVycyBpbnZhbGlkIERhdGVUaW1lcywgRHVyYXRpb25zLCBvciBJbnRlcnZhbHNcbiAgICAgKiBAdHlwZSB7Wm9uZX1cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAndGhyb3dPbkludmFsaWQnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIHRocm93T25JbnZhbGlkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB3aGV0aGVyIEx1eG9uIHdpbGwgdGhyb3cgd2hlbiBpdCBlbmNvdW50ZXJzIGludmFsaWQgRGF0ZVRpbWVzLCBEdXJhdGlvbnMsIG9yIEludGVydmFsc1xuICAgICAqIEB0eXBlIHtab25lfVxuICAgICAqL1xuICAgICxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCQkMSh0KSB7XG4gICAgICB0aHJvd09uSW52YWxpZCA9IHQ7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBTZXR0aW5ncztcbn0oKTtcblxuLypcbiAgVGhpcyBpcyBqdXN0IGEganVuayBkcmF3ZXIsIGNvbnRhaW5pbmcgYW55dGhpbmcgdXNlZCBhY3Jvc3MgbXVsdGlwbGUgY2xhc3Nlcy5cbiAgQmVjYXVzZSBMdXhvbiBpcyBzbWFsbChpc2gpLCB0aGlzIHNob3VsZCBzdGF5IHNtYWxsIGFuZCB3ZSB3b24ndCB3b3JyeSBhYm91dCBzcGxpdHRpbmdcbiAgaXQgdXAgaW50bywgc2F5LCBwYXJzaW5nVXRpbC5qcyBhbmQgYmFzaWNVdGlsLmpzIGFuZCBzbyBvbi4gQnV0IHRoZXkgYXJlIGRpdmlkZWQgdXAgYnkgZmVhdHVyZSBhcmVhLlxuKi9cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5cbnZhciBVdGlsID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBVdGlsKCkge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFV0aWwpO1xuICB9XG5cbiAgLy8gVFlQRVNcblxuICBVdGlsLmlzVW5kZWZpbmVkID0gZnVuY3Rpb24gaXNVbmRlZmluZWQobykge1xuICAgIHJldHVybiB0eXBlb2YgbyA9PT0gJ3VuZGVmaW5lZCc7XG4gIH07XG5cbiAgVXRpbC5pc051bWJlciA9IGZ1bmN0aW9uIGlzTnVtYmVyKG8pIHtcbiAgICByZXR1cm4gdHlwZW9mIG8gPT09ICdudW1iZXInO1xuICB9O1xuXG4gIFV0aWwuaXNTdHJpbmcgPSBmdW5jdGlvbiBpc1N0cmluZyhvKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvID09PSAnc3RyaW5nJztcbiAgfTtcblxuICBVdGlsLmlzRGF0ZSA9IGZ1bmN0aW9uIGlzRGF0ZShvKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xuICB9O1xuXG4gIC8vIE9CSkVDVFMgQU5EIEFSUkFZU1xuXG4gIFV0aWwubWF5YmVBcnJheSA9IGZ1bmN0aW9uIG1heWJlQXJyYXkodGhpbmcpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh0aGluZykgPyB0aGluZyA6IFt0aGluZ107XG4gIH07XG5cbiAgVXRpbC5iZXN0QnkgPSBmdW5jdGlvbiBiZXN0QnkoYXJyLCBieSwgY29tcGFyZSkge1xuICAgIGlmIChhcnIubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gYXJyLnJlZHVjZShmdW5jdGlvbiAoYmVzdCwgbmV4dCkge1xuICAgICAgdmFyIHBhaXIgPSBbYnkobmV4dCksIG5leHRdO1xuICAgICAgaWYgKCFiZXN0KSB7XG4gICAgICAgIHJldHVybiBwYWlyO1xuICAgICAgfSBlbHNlIGlmIChjb21wYXJlLmFwcGx5KG51bGwsIFtiZXN0WzBdLCBwYWlyWzBdXSkgPT09IGJlc3RbMF0pIHtcbiAgICAgICAgcmV0dXJuIGJlc3Q7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcGFpcjtcbiAgICAgIH1cbiAgICB9LCBudWxsKVsxXTtcbiAgfTtcblxuICBVdGlsLnBpY2sgPSBmdW5jdGlvbiBwaWNrKG9iaiwga2V5cykge1xuICAgIHJldHVybiBrZXlzLnJlZHVjZShmdW5jdGlvbiAoYSwgaykge1xuICAgICAgYVtrXSA9IG9ialtrXTtcbiAgICAgIHJldHVybiBhO1xuICAgIH0sIHt9KTtcbiAgfTtcblxuICAvLyBOVU1CRVJTIEFORCBTVFJJTkdTXG5cbiAgVXRpbC5udW1iZXJCZXR3ZWVuID0gZnVuY3Rpb24gbnVtYmVyQmV0d2Vlbih0aGluZywgYm90dG9tLCB0b3ApIHtcbiAgICByZXR1cm4gVXRpbC5pc051bWJlcih0aGluZykgJiYgdGhpbmcgPj0gYm90dG9tICYmIHRoaW5nIDw9IHRvcDtcbiAgfTtcblxuICBVdGlsLnBhZFN0YXJ0ID0gZnVuY3Rpb24gcGFkU3RhcnQoaW5wdXQpIHtcbiAgICB2YXIgbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMjtcblxuICAgIHJldHVybiAoJzAnLnJlcGVhdChuKSArIGlucHV0KS5zbGljZSgtbik7XG4gIH07XG5cbiAgVXRpbC5wYXJzZU1pbGxpcyA9IGZ1bmN0aW9uIHBhcnNlTWlsbGlzKGZyYWN0aW9uKSB7XG4gICAgaWYgKGZyYWN0aW9uKSB7XG4gICAgICB2YXIgZiA9IHBhcnNlRmxvYXQoJzAuJyArIGZyYWN0aW9uKSAqIDEwMDA7XG4gICAgICByZXR1cm4gTWF0aC5yb3VuZChmKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9O1xuXG4gIC8vIERBVEUgQkFTSUNTXG5cbiAgVXRpbC5pc0xlYXBZZWFyID0gZnVuY3Rpb24gaXNMZWFwWWVhcih5ZWFyKSB7XG4gICAgcmV0dXJuIHllYXIgJSA0ID09PSAwICYmICh5ZWFyICUgMTAwICE9PSAwIHx8IHllYXIgJSA0MDAgPT09IDApO1xuICB9O1xuXG4gIFV0aWwuZGF5c0luWWVhciA9IGZ1bmN0aW9uIGRheXNJblllYXIoeWVhcikge1xuICAgIHJldHVybiBVdGlsLmlzTGVhcFllYXIoeWVhcikgPyAzNjYgOiAzNjU7XG4gIH07XG5cbiAgVXRpbC5kYXlzSW5Nb250aCA9IGZ1bmN0aW9uIGRheXNJbk1vbnRoKHllYXIsIG1vbnRoKSB7XG4gICAgaWYgKG1vbnRoID09PSAyKSB7XG4gICAgICByZXR1cm4gVXRpbC5pc0xlYXBZZWFyKHllYXIpID8gMjkgOiAyODtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFszMSwgbnVsbCwgMzEsIDMwLCAzMSwgMzAsIDMxLCAzMSwgMzAsIDMxLCAzMCwgMzFdW21vbnRoIC0gMV07XG4gICAgfVxuICB9O1xuXG4gIFV0aWwudW50cnVuY2F0ZVllYXIgPSBmdW5jdGlvbiB1bnRydW5jYXRlWWVhcih5ZWFyKSB7XG4gICAgaWYgKHllYXIgPiA5OSkge1xuICAgICAgcmV0dXJuIHllYXI7XG4gICAgfSBlbHNlIHJldHVybiB5ZWFyID4gNjAgPyAxOTAwICsgeWVhciA6IDIwMDAgKyB5ZWFyO1xuICB9O1xuXG4gIC8vIFBBUlNJTkdcblxuICBVdGlsLnBhcnNlWm9uZUluZm8gPSBmdW5jdGlvbiBwYXJzZVpvbmVJbmZvKHRzLCBvZmZzZXRGb3JtYXQsIGxvY2FsZSkge1xuICAgIHZhciB0aW1lWm9uZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogbnVsbDtcblxuICAgIHZhciBkYXRlID0gbmV3IERhdGUodHMpLFxuICAgICAgICBpbnRsID0ge1xuICAgICAgaG91cjEyOiBmYWxzZSxcbiAgICAgIHllYXI6ICdudW1lcmljJyxcbiAgICAgIG1vbnRoOiAnMi1kaWdpdCcsXG4gICAgICBkYXk6ICcyLWRpZ2l0JyxcbiAgICAgIGhvdXI6ICcyLWRpZ2l0JyxcbiAgICAgIG1pbnV0ZTogJzItZGlnaXQnXG4gICAgfTtcblxuICAgIGlmICh0aW1lWm9uZSkge1xuICAgICAgaW50bC50aW1lWm9uZSA9IHRpbWVab25lO1xuICAgIH1cblxuICAgIHZhciBtb2RpZmllZCA9IE9iamVjdC5hc3NpZ24oeyB0aW1lWm9uZU5hbWU6IG9mZnNldEZvcm1hdCB9LCBpbnRsKSxcbiAgICAgICAgaGFzSW50bCA9IFV0aWwuaGFzSW50bCgpO1xuXG4gICAgaWYgKGhhc0ludGwgJiYgVXRpbC5oYXNGb3JtYXRUb1BhcnRzKCkpIHtcbiAgICAgIHZhciBwYXJzZWQgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGUsIG1vZGlmaWVkKS5mb3JtYXRUb1BhcnRzKGRhdGUpLmZpbmQoZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgcmV0dXJuIG0udHlwZS50b0xvd2VyQ2FzZSgpID09PSAndGltZXpvbmVuYW1lJztcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHBhcnNlZCA/IHBhcnNlZC52YWx1ZSA6IG51bGw7XG4gICAgfSBlbHNlIGlmIChoYXNJbnRsKSB7XG4gICAgICAvLyB0aGlzIHByb2JhYmx5IGRvZXNuJ3Qgd29yayBmb3IgYWxsIGxvY2FsZXNcbiAgICAgIHZhciB3aXRob3V0ID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobG9jYWxlLCBpbnRsKS5mb3JtYXQoZGF0ZSksXG4gICAgICAgICAgaW5jbHVkZWQgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGUsIG1vZGlmaWVkKS5mb3JtYXQoZGF0ZSksXG4gICAgICAgICAgZGlmZmVkID0gaW5jbHVkZWQuc3Vic3RyaW5nKHdpdGhvdXQubGVuZ3RoKSxcbiAgICAgICAgICB0cmltbWVkID0gZGlmZmVkLnJlcGxhY2UoL15bLCBdKy8sICcnKTtcbiAgICAgIHJldHVybiB0cmltbWVkO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgLy8gc2lnbmVkT2Zmc2V0KCctNScsICczMCcpIC0+IC0zMzBcblxuXG4gIFV0aWwuc2lnbmVkT2Zmc2V0ID0gZnVuY3Rpb24gc2lnbmVkT2Zmc2V0KG9mZkhvdXJTdHIsIG9mZk1pbnV0ZVN0cikge1xuICAgIHZhciBvZmZIb3VyID0gcGFyc2VJbnQob2ZmSG91clN0ciwgMTApIHx8IDAsXG4gICAgICAgIG9mZk1pbiA9IHBhcnNlSW50KG9mZk1pbnV0ZVN0ciwgMTApIHx8IDAsXG4gICAgICAgIG9mZk1pblNpZ25lZCA9IG9mZkhvdXIgPCAwID8gLW9mZk1pbiA6IG9mZk1pbjtcbiAgICByZXR1cm4gb2ZmSG91ciAqIDYwICsgb2ZmTWluU2lnbmVkO1xuICB9O1xuXG4gIC8vIENPRVJDSU9OXG5cbiAgVXRpbC5mcmllbmRseUR1cmF0aW9uID0gZnVuY3Rpb24gZnJpZW5kbHlEdXJhdGlvbihkdXJhdGlvbikge1xuICAgIGlmIChVdGlsLmlzTnVtYmVyKGR1cmF0aW9uKSkge1xuICAgICAgcmV0dXJuIER1cmF0aW9uLmZyb21NaWxsaXMoZHVyYXRpb24pO1xuICAgIH0gZWxzZSBpZiAoZHVyYXRpb24gaW5zdGFuY2VvZiBEdXJhdGlvbikge1xuICAgICAgcmV0dXJuIGR1cmF0aW9uO1xuICAgIH0gZWxzZSBpZiAoZHVyYXRpb24gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgIHJldHVybiBEdXJhdGlvbi5mcm9tT2JqZWN0KGR1cmF0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEludmFsaWRBcmd1bWVudEVycm9yKCdVbmtub3duIGR1cmF0aW9uIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9O1xuXG4gIFV0aWwuZnJpZW5kbHlEYXRlVGltZSA9IGZ1bmN0aW9uIGZyaWVuZGx5RGF0ZVRpbWUoZGF0ZVRpbWVpc2gpIHtcbiAgICBpZiAoZGF0ZVRpbWVpc2ggaW5zdGFuY2VvZiBEYXRlVGltZSkge1xuICAgICAgcmV0dXJuIGRhdGVUaW1laXNoO1xuICAgIH0gZWxzZSBpZiAoZGF0ZVRpbWVpc2gudmFsdWVPZiAmJiBVdGlsLmlzTnVtYmVyKGRhdGVUaW1laXNoLnZhbHVlT2YoKSkpIHtcbiAgICAgIHJldHVybiBEYXRlVGltZS5mcm9tSlNEYXRlKGRhdGVUaW1laXNoKTtcbiAgICB9IGVsc2UgaWYgKGRhdGVUaW1laXNoIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICByZXR1cm4gRGF0ZVRpbWUuZnJvbU9iamVjdChkYXRlVGltZWlzaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkQXJndW1lbnRFcnJvcignVW5rbm93biBkYXRldGltZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgfTtcblxuICBVdGlsLm5vcm1hbGl6ZVpvbmUgPSBmdW5jdGlvbiBub3JtYWxpemVab25lKGlucHV0KSB7XG4gICAgdmFyIG9mZnNldCA9IHZvaWQgMDtcbiAgICBpZiAoVXRpbC5pc1VuZGVmaW5lZChpbnB1dCkgfHwgaW5wdXQgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBTZXR0aW5ncy5kZWZhdWx0Wm9uZTtcbiAgICB9IGVsc2UgaWYgKGlucHV0IGluc3RhbmNlb2YgWm9uZSkge1xuICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH0gZWxzZSBpZiAoVXRpbC5pc1N0cmluZyhpbnB1dCkpIHtcbiAgICAgIHZhciBsb3dlcmVkID0gaW5wdXQudG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmIChsb3dlcmVkID09PSAnbG9jYWwnKSByZXR1cm4gTG9jYWxab25lLmluc3RhbmNlO2Vsc2UgaWYgKGxvd2VyZWQgPT09ICd1dGMnKSByZXR1cm4gRml4ZWRPZmZzZXRab25lLnV0Y0luc3RhbmNlO2Vsc2UgaWYgKChvZmZzZXQgPSBJQU5BWm9uZS5wYXJzZUdNVE9mZnNldChpbnB1dCkpICE9IG51bGwpIHtcbiAgICAgICAgLy8gaGFuZGxlIEV0Yy9HTVQtNCwgd2hpY2ggVjggY2hva2VzIG9uXG4gICAgICAgIHJldHVybiBGaXhlZE9mZnNldFpvbmUuaW5zdGFuY2Uob2Zmc2V0KTtcbiAgICAgIH0gZWxzZSBpZiAoSUFOQVpvbmUuaXNWYWxpZFNwZWNpZmllcihsb3dlcmVkKSkgcmV0dXJuIG5ldyBJQU5BWm9uZShpbnB1dCk7ZWxzZSByZXR1cm4gRml4ZWRPZmZzZXRab25lLnBhcnNlU3BlY2lmaWVyKGxvd2VyZWQpIHx8IEludmFsaWRab25lLmluc3RhbmNlO1xuICAgIH0gZWxzZSBpZiAoVXRpbC5pc051bWJlcihpbnB1dCkpIHtcbiAgICAgIHJldHVybiBGaXhlZE9mZnNldFpvbmUuaW5zdGFuY2UoaW5wdXQpO1xuICAgIH0gZWxzZSBpZiAoKHR5cGVvZiBpbnB1dCA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YoaW5wdXQpKSA9PT0gJ29iamVjdCcgJiYgaW5wdXQub2Zmc2V0KSB7XG4gICAgICAvLyBUaGlzIGlzIGR1bWIsIGJ1dCB0aGUgaW5zdGFuY2VvZiBjaGVjayBhYm92ZSBkb2Vzbid0IHNlZW0gdG8gcmVhbGx5IHdvcmtcbiAgICAgIC8vIHNvIHdlJ3JlIGR1Y2sgY2hlY2tpbmcgaXRcbiAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIEludmFsaWRab25lLmluc3RhbmNlO1xuICAgIH1cbiAgfTtcblxuICBVdGlsLm5vcm1hbGl6ZU9iamVjdCA9IGZ1bmN0aW9uIG5vcm1hbGl6ZU9iamVjdChvYmosIG5vcm1hbGl6ZXIpIHtcbiAgICB2YXIgaWdub3JlVW5rbm93biA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogZmFsc2U7XG5cbiAgICB2YXIgbm9ybWFsaXplZCA9IHt9O1xuICAgIGZvciAodmFyIHUgaW4gb2JqKSB7XG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHUpKSB7XG4gICAgICAgIHZhciB2ID0gb2JqW3VdO1xuICAgICAgICBpZiAodiAhPT0gbnVsbCAmJiAhVXRpbC5pc1VuZGVmaW5lZCh2KSAmJiAhTnVtYmVyLmlzTmFOKHYpKSB7XG4gICAgICAgICAgdmFyIG1hcHBlZCA9IG5vcm1hbGl6ZXIodSwgaWdub3JlVW5rbm93bik7XG4gICAgICAgICAgaWYgKG1hcHBlZCkge1xuICAgICAgICAgICAgbm9ybWFsaXplZFttYXBwZWRdID0gdjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG4gIH07XG5cbiAgVXRpbC50aW1lT2JqZWN0ID0gZnVuY3Rpb24gdGltZU9iamVjdChvYmopIHtcbiAgICByZXR1cm4gVXRpbC5waWNrKG9iaiwgWydob3VyJywgJ21pbnV0ZScsICdzZWNvbmQnLCAnbWlsbGlzZWNvbmQnXSk7XG4gIH07XG5cbiAgLy8gQ0FQQUJJTElUSUVTXG5cbiAgVXRpbC5oYXNJbnRsID0gZnVuY3Rpb24gaGFzSW50bCgpIHtcbiAgICByZXR1cm4gdHlwZW9mIEludGwgIT09ICd1bmRlZmluZWQnICYmIEludGwuRGF0ZVRpbWVGb3JtYXQ7XG4gIH07XG5cbiAgVXRpbC5oYXNGb3JtYXRUb1BhcnRzID0gZnVuY3Rpb24gaGFzRm9ybWF0VG9QYXJ0cygpIHtcbiAgICByZXR1cm4gIVV0aWwuaXNVbmRlZmluZWQoSW50bC5EYXRlVGltZUZvcm1hdC5wcm90b3R5cGUuZm9ybWF0VG9QYXJ0cyk7XG4gIH07XG5cbiAgcmV0dXJuIFV0aWw7XG59KCk7XG5cbi8qXG5UaGlzIGZpbGUgaGFuZGxlcyBwYXJzaW5nIGZvciB3ZWxsLXNwZWNpZmllZCBmb3JtYXRzLiBIZXJlJ3MgaG93IGl0IHdvcmtzOlxuICogVHdvIHRoaW5ncyBnbyBpbnRvIHBhcnNpbmc6IGEgcmVnZXggdG8gbWF0Y2ggd2l0aCBhbmQgYW4gZXh0cmFjdG9yIHRvIHRha2UgYXBhcnQgdGhlIGdyb3VwcyBpbiB0aGUgbWF0Y2guXG4gKiBBbiBleHRyYWN0b3IgaXMganVzdCBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSByZWdleCBtYXRjaCBhcnJheSBhbmQgcmV0dXJucyBhIHsgeWVhcjogLi4uLCBtb250aDogLi4uIH0gb2JqZWN0XG4gKiBwYXJzZSgpIGRvZXMgdGhlIHdvcmsgb2YgZXhlY3V0aW5nIHRoZSByZWdleCBhbmQgYXBwbHlpbmcgdGhlIGV4dHJhY3Rvci4gSXQgdGFrZXMgbXVsdGlwbGUgcmVnZXgvZXh0cmFjdG9yIHBhaXJzIHRvIHRyeSBpbiBzZXF1ZW5jZS5cbiAqIEV4dHJhY3RvcnMgY2FuIHRha2UgYSBcImN1cnNvclwiIHJlcHJlc2VudGluZyB0aGUgb2Zmc2V0IGluIHRoZSBtYXRjaCB0byBsb29rIGF0LiBUaGlzIG1ha2VzIGl0IGVhc3kgdG8gY29tYmluZSBleHRyYWN0b3JzLlxuICogY29tYmluZUV4dHJhY3RvcnMoKSBkb2VzIHRoZSB3b3JrIG9mIGNvbWJpbmluZyB0aGVtLCBrZWVwaW5nIHRyYWNrIG9mIHRoZSBjdXJzb3IgdGhyb3VnaCBtdWx0aXBsZSBleHRyYWN0aW9ucy5cbiAqIFNvbWUgZXh0cmFjdGlvbnMgYXJlIHN1cGVyIGR1bWIgYW5kIHNpbXBsZVBhcnNlIGFuZCBmcm9tU3RyaW5ncyBoZWxwIERSWSB0aGVtLlxuKi9cblxuZnVuY3Rpb24gY29tYmluZVJlZ2V4ZXMoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCByZWdleGVzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgcmVnZXhlc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHZhciBmdWxsID0gcmVnZXhlcy5yZWR1Y2UoZnVuY3Rpb24gKGYsIHIpIHtcbiAgICByZXR1cm4gZiArIHIuc291cmNlO1xuICB9LCAnJyk7XG4gIHJldHVybiBSZWdFeHAoJ14nICsgZnVsbCArICckJyk7XG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVFeHRyYWN0b3JzKCkge1xuICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGV4dHJhY3RvcnMgPSBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgIGV4dHJhY3RvcnNbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAobSkge1xuICAgIHJldHVybiBleHRyYWN0b3JzLnJlZHVjZShmdW5jdGlvbiAoX3JlZiwgZXgpIHtcbiAgICAgIHZhciBtZXJnZWRWYWxzID0gX3JlZlswXSxcbiAgICAgICAgICBtZXJnZWRab25lID0gX3JlZlsxXSxcbiAgICAgICAgICBjdXJzb3IgPSBfcmVmWzJdO1xuXG4gICAgICB2YXIgX2V4ID0gZXgobSwgY3Vyc29yKSxcbiAgICAgICAgICB2YWwgPSBfZXhbMF0sXG4gICAgICAgICAgem9uZSA9IF9leFsxXSxcbiAgICAgICAgICBuZXh0ID0gX2V4WzJdO1xuXG4gICAgICByZXR1cm4gW09iamVjdC5hc3NpZ24obWVyZ2VkVmFscywgdmFsKSwgbWVyZ2VkWm9uZSB8fCB6b25lLCBuZXh0XTtcbiAgICB9LCBbe30sIG51bGwsIDFdKS5zbGljZSgwLCAyKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcGFyc2Uocykge1xuICBpZiAocyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFtudWxsLCBudWxsXTtcbiAgfVxuXG4gIGZvciAodmFyIF9sZW4zID0gYXJndW1lbnRzLmxlbmd0aCwgcGF0dGVybnMgPSBBcnJheShfbGVuMyA+IDEgPyBfbGVuMyAtIDEgOiAwKSwgX2tleTMgPSAxOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgcGF0dGVybnNbX2tleTMgLSAxXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gIH1cblxuICBmb3IgKHZhciBfaXRlcmF0b3IgPSBwYXR0ZXJucywgX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5KF9pdGVyYXRvciksIF9pID0gMCwgX2l0ZXJhdG9yID0gX2lzQXJyYXkgPyBfaXRlcmF0b3IgOiBfaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICB2YXIgX3JlZjM7XG5cbiAgICBpZiAoX2lzQXJyYXkpIHtcbiAgICAgIGlmIChfaSA+PSBfaXRlcmF0b3IubGVuZ3RoKSBicmVhaztcbiAgICAgIF9yZWYzID0gX2l0ZXJhdG9yW19pKytdO1xuICAgIH0gZWxzZSB7XG4gICAgICBfaSA9IF9pdGVyYXRvci5uZXh0KCk7XG4gICAgICBpZiAoX2kuZG9uZSkgYnJlYWs7XG4gICAgICBfcmVmMyA9IF9pLnZhbHVlO1xuICAgIH1cblxuICAgIHZhciBfcmVmMiA9IF9yZWYzO1xuICAgIHZhciByZWdleCA9IF9yZWYyWzBdO1xuICAgIHZhciBleHRyYWN0b3IgPSBfcmVmMlsxXTtcblxuICAgIHZhciBtID0gcmVnZXguZXhlYyhzKTtcbiAgICBpZiAobSkge1xuICAgICAgcmV0dXJuIGV4dHJhY3RvcihtKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFtudWxsLCBudWxsXTtcbn1cblxuZnVuY3Rpb24gc2ltcGxlUGFyc2UoKSB7XG4gIGZvciAodmFyIF9sZW40ID0gYXJndW1lbnRzLmxlbmd0aCwga2V5cyA9IEFycmF5KF9sZW40KSwgX2tleTQgPSAwOyBfa2V5NCA8IF9sZW40OyBfa2V5NCsrKSB7XG4gICAga2V5c1tfa2V5NF0gPSBhcmd1bWVudHNbX2tleTRdO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChtYXRjaCwgY3Vyc29yKSB7XG4gICAgdmFyIHJldCA9IHt9O1xuICAgIHZhciBpID0gdm9pZCAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJldFtrZXlzW2ldXSA9IHBhcnNlSW50KG1hdGNoW2N1cnNvciArIGldKTtcbiAgICB9XG4gICAgcmV0dXJuIFtyZXQsIG51bGwsIGN1cnNvciArIGldO1xuICB9O1xufVxuXG4vLyBJU08gYW5kIFNRTCBwYXJzaW5nXG52YXIgb2Zmc2V0UmVnZXggPSAvKD86KFopfChbKy1dXFxkXFxkKSg/Ojo/KFxcZFxcZCkpPykvO1xudmFyIGlzb1RpbWVCYXNlUmVnZXggPSAvKFxcZFxcZCkoPzo6PyhcXGRcXGQpKD86Oj8oXFxkXFxkKSg/OlsuLF0oXFxkezEsOX0pKT8pPyk/LztcbnZhciBpc29UaW1lUmVnZXggPSBSZWdFeHAoJycgKyBpc29UaW1lQmFzZVJlZ2V4LnNvdXJjZSArIG9mZnNldFJlZ2V4LnNvdXJjZSArICc/Jyk7XG52YXIgaXNvVGltZUV4dGVuc2lvblJlZ2V4ID0gUmVnRXhwKCcoPzpUJyArIGlzb1RpbWVSZWdleC5zb3VyY2UgKyAnKT8nKTtcbnZhciBpc29ZbWRSZWdleCA9IC8oWystXVxcZHs2fXxcXGR7NH0pKD86LT8oXFxkXFxkKSg/Oi0/KFxcZFxcZCkpPyk/LztcbnZhciBpc29XZWVrUmVnZXggPSAvKFxcZHs0fSktP1coXFxkXFxkKS0/KFxcZCkvO1xudmFyIGlzb09yZGluYWxSZWdleCA9IC8oXFxkezR9KS0/KFxcZHszfSkvO1xudmFyIGV4dHJhY3RJU09XZWVrRGF0YSA9IHNpbXBsZVBhcnNlKCd3ZWVrWWVhcicsICd3ZWVrTnVtYmVyJywgJ3dlZWtEYXknKTtcbnZhciBleHRyYWN0SVNPT3JkaW5hbERhdGEgPSBzaW1wbGVQYXJzZSgneWVhcicsICdvcmRpbmFsJyk7XG52YXIgc3FsWW1kUmVnZXggPSAvKFxcZHs0fSktKFxcZFxcZCktKFxcZFxcZCkvO1xudmFyIHNxbFRpbWVSZWdleCA9IFJlZ0V4cChpc29UaW1lQmFzZVJlZ2V4LnNvdXJjZSArICcgPyg/OicgKyBvZmZzZXRSZWdleC5zb3VyY2UgKyAnfChbYS16QS1aX117MSwyNTZ9L1thLXpBLVpfXXsxLDI1Nn0pKT8nKTtcbnZhciBzcWxUaW1lRXh0ZW5zaW9uUmVnZXggPSBSZWdFeHAoJyg/OiAnICsgc3FsVGltZVJlZ2V4LnNvdXJjZSArICcpPycpO1xuXG5mdW5jdGlvbiBleHRyYWN0SVNPWW1kKG1hdGNoLCBjdXJzb3IpIHtcbiAgdmFyIGl0ZW0gPSB7XG4gICAgeWVhcjogcGFyc2VJbnQobWF0Y2hbY3Vyc29yXSksXG4gICAgbW9udGg6IHBhcnNlSW50KG1hdGNoW2N1cnNvciArIDFdKSB8fCAxLFxuICAgIGRheTogcGFyc2VJbnQobWF0Y2hbY3Vyc29yICsgMl0pIHx8IDFcbiAgfTtcblxuICByZXR1cm4gW2l0ZW0sIG51bGwsIGN1cnNvciArIDNdO1xufVxuXG5mdW5jdGlvbiBleHRyYWN0SVNPVGltZShtYXRjaCwgY3Vyc29yKSB7XG4gIHZhciBpdGVtID0ge1xuICAgIGhvdXI6IHBhcnNlSW50KG1hdGNoW2N1cnNvcl0pIHx8IDAsXG4gICAgbWludXRlOiBwYXJzZUludChtYXRjaFtjdXJzb3IgKyAxXSkgfHwgMCxcbiAgICBzZWNvbmQ6IHBhcnNlSW50KG1hdGNoW2N1cnNvciArIDJdKSB8fCAwLFxuICAgIG1pbGxpc2Vjb25kOiBVdGlsLnBhcnNlTWlsbGlzKG1hdGNoW2N1cnNvciArIDNdKVxuICB9O1xuXG4gIHJldHVybiBbaXRlbSwgbnVsbCwgY3Vyc29yICsgNF07XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RJU09PZmZzZXQobWF0Y2gsIGN1cnNvcikge1xuICB2YXIgbG9jYWwgPSAhbWF0Y2hbY3Vyc29yXSAmJiAhbWF0Y2hbY3Vyc29yICsgMV0sXG4gICAgICBmdWxsT2Zmc2V0ID0gVXRpbC5zaWduZWRPZmZzZXQobWF0Y2hbY3Vyc29yICsgMV0sIG1hdGNoW2N1cnNvciArIDJdKSxcbiAgICAgIHpvbmUgPSBsb2NhbCA/IG51bGwgOiBGaXhlZE9mZnNldFpvbmUuaW5zdGFuY2UoZnVsbE9mZnNldCk7XG4gIHJldHVybiBbe30sIHpvbmUsIGN1cnNvciArIDNdO1xufVxuXG5mdW5jdGlvbiBleHRyYWN0SUFOQVpvbmUobWF0Y2gsIGN1cnNvcikge1xuICB2YXIgem9uZSA9IG1hdGNoW2N1cnNvcl0gPyBuZXcgSUFOQVpvbmUobWF0Y2hbY3Vyc29yXSkgOiBudWxsO1xuICByZXR1cm4gW3t9LCB6b25lLCBjdXJzb3IgKyAxXTtcbn1cblxuLy8gSVNPIGR1cmF0aW9uIHBhcnNpbmdcblxudmFyIGlzb0R1cmF0aW9uID0gL15QKD86KD86KFxcZHsxLDl9KVkpPyg/OihcXGR7MSw5fSlNKT8oPzooXFxkezEsOX0pRCk/KD86VCg/OihcXGR7MSw5fSlIKT8oPzooXFxkezEsOX0pTSk/KD86KFxcZHsxLDl9KVMpPyk/fChcXGR7MSw5fSlXKSQvO1xuXG5mdW5jdGlvbiBleHRyYWN0SVNPRHVyYXRpb24obWF0Y2gpIHtcbiAgdmFyIHllYXJTdHIgPSBtYXRjaFsxXSxcbiAgICAgIG1vbnRoU3RyID0gbWF0Y2hbMl0sXG4gICAgICBkYXlTdHIgPSBtYXRjaFszXSxcbiAgICAgIGhvdXJTdHIgPSBtYXRjaFs0XSxcbiAgICAgIG1pbnV0ZVN0ciA9IG1hdGNoWzVdLFxuICAgICAgc2Vjb25kU3RyID0gbWF0Y2hbNl0sXG4gICAgICB3ZWVrU3RyID0gbWF0Y2hbN107XG5cblxuICByZXR1cm4ge1xuICAgIHllYXJzOiBwYXJzZUludCh5ZWFyU3RyKSxcbiAgICBtb250aHM6IHBhcnNlSW50KG1vbnRoU3RyKSxcbiAgICB3ZWVrczogcGFyc2VJbnQod2Vla1N0ciksXG4gICAgZGF5czogcGFyc2VJbnQoZGF5U3RyKSxcbiAgICBob3VyczogcGFyc2VJbnQoaG91clN0ciksXG4gICAgbWludXRlczogcGFyc2VJbnQobWludXRlU3RyKSxcbiAgICBzZWNvbmRzOiBwYXJzZUludChzZWNvbmRTdHIpXG4gIH07XG59XG5cbi8vIFRoZXNlIGFyZSBhIGxpdHRsZSBicmFpbmRlYWQuIEVEVCAqc2hvdWxkKiB0ZWxsIHVzIHRoYXQgd2UncmUgaW4sIHNheSwgQW1lcmljYS9OZXdfWW9ya1xuLy8gYW5kIG5vdCBqdXN0IHRoYXQgd2UncmUgaW4gLTI0MCAqcmlnaHQgbm93Ki4gQnV0IHNpbmNlIEkgZG9uJ3QgdGhpbmsgdGhlc2UgYXJlIHVzZWQgdGhhdCBvZnRlblxuLy8gSSdtIGp1c3QgZ29pbmcgdG8gaWdub3JlIHRoYXRcbnZhciBvYnNPZmZzZXRzID0ge1xuICBHTVQ6IDAsXG4gIEVEVDogLTQgKiA2MCxcbiAgRVNUOiAtNSAqIDYwLFxuICBDRFQ6IC01ICogNjAsXG4gIENTVDogLTYgKiA2MCxcbiAgTURUOiAtNiAqIDYwLFxuICBNU1Q6IC03ICogNjAsXG4gIFBEVDogLTcgKiA2MCxcbiAgUFNUOiAtOCAqIDYwXG59O1xuXG5mdW5jdGlvbiBmcm9tU3RyaW5ncyh3ZWVrZGF5U3RyLCB5ZWFyU3RyLCBtb250aFN0ciwgZGF5U3RyLCBob3VyU3RyLCBtaW51dGVTdHIsIHNlY29uZFN0cikge1xuICB2YXIgcmVzdWx0ID0ge1xuICAgIHllYXI6IHllYXJTdHIubGVuZ3RoID09PSAyID8gVXRpbC51bnRydW5jYXRlWWVhcihwYXJzZUludCh5ZWFyU3RyKSkgOiBwYXJzZUludCh5ZWFyU3RyKSxcbiAgICBtb250aDogbW9udGhTdHIubGVuZ3RoID09PSAyID8gcGFyc2VJbnQobW9udGhTdHIsIDEwKSA6IEVuZ2xpc2gubW9udGhzU2hvcnQuaW5kZXhPZihtb250aFN0cikgKyAxLFxuICAgIGRheTogcGFyc2VJbnQoZGF5U3RyKSxcbiAgICBob3VyOiBwYXJzZUludChob3VyU3RyKSxcbiAgICBtaW51dGU6IHBhcnNlSW50KG1pbnV0ZVN0cilcbiAgfTtcblxuICBpZiAoc2Vjb25kU3RyKSByZXN1bHQuc2Vjb25kID0gcGFyc2VJbnQoc2Vjb25kU3RyKTtcbiAgaWYgKHdlZWtkYXlTdHIpIHtcbiAgICByZXN1bHQud2Vla2RheSA9IHdlZWtkYXlTdHIubGVuZ3RoID4gMyA/IEVuZ2xpc2gud2Vla2RheXNMb25nLmluZGV4T2Yod2Vla2RheVN0cikgKyAxIDogRW5nbGlzaC53ZWVrZGF5c1Nob3J0LmluZGV4T2Yod2Vla2RheVN0cikgKyAxO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gUkZDIDI4MjIvNTMyMlxudmFyIHJmYzI4MjIgPSAvXig/OihNb258VHVlfFdlZHxUaHV8RnJpfFNhdHxTdW4pLFxccyk/KFxcZHsxLDJ9KVxccyhKYW58RmVifE1hcnxBcHJ8TWF5fEp1bnxKdWx8QXVnfFNlcHxPY3R8Tm92fERlYylcXHMoXFxkezIsNH0pXFxzKFxcZFxcZCk6KFxcZFxcZCkoPzo6KFxcZFxcZCkpP1xccyg/OihVVHxHTVR8W0VDTVBdW1NEXVQpfChbWnpdKXwoPzooWystXVxcZFxcZCkoXFxkXFxkKSkpJC87XG5cbmZ1bmN0aW9uIGV4dHJhY3RSRkMyODIyKG1hdGNoKSB7XG4gIHZhciB3ZWVrZGF5U3RyID0gbWF0Y2hbMV0sXG4gICAgICBkYXlTdHIgPSBtYXRjaFsyXSxcbiAgICAgIG1vbnRoU3RyID0gbWF0Y2hbM10sXG4gICAgICB5ZWFyU3RyID0gbWF0Y2hbNF0sXG4gICAgICBob3VyU3RyID0gbWF0Y2hbNV0sXG4gICAgICBtaW51dGVTdHIgPSBtYXRjaFs2XSxcbiAgICAgIHNlY29uZFN0ciA9IG1hdGNoWzddLFxuICAgICAgb2JzT2Zmc2V0ID0gbWF0Y2hbOF0sXG4gICAgICBtaWxPZmZzZXQgPSBtYXRjaFs5XSxcbiAgICAgIG9mZkhvdXJTdHIgPSBtYXRjaFsxMF0sXG4gICAgICBvZmZNaW51dGVTdHIgPSBtYXRjaFsxMV0sXG4gICAgICByZXN1bHQgPSBmcm9tU3RyaW5ncyh3ZWVrZGF5U3RyLCB5ZWFyU3RyLCBtb250aFN0ciwgZGF5U3RyLCBob3VyU3RyLCBtaW51dGVTdHIsIHNlY29uZFN0cik7XG5cblxuICB2YXIgb2Zmc2V0ID0gdm9pZCAwO1xuICBpZiAob2JzT2Zmc2V0KSB7XG4gICAgb2Zmc2V0ID0gb2JzT2Zmc2V0c1tvYnNPZmZzZXRdO1xuICB9IGVsc2UgaWYgKG1pbE9mZnNldCkge1xuICAgIG9mZnNldCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgb2Zmc2V0ID0gVXRpbC5zaWduZWRPZmZzZXQob2ZmSG91clN0ciwgb2ZmTWludXRlU3RyKTtcbiAgfVxuXG4gIHJldHVybiBbcmVzdWx0LCBuZXcgRml4ZWRPZmZzZXRab25lKG9mZnNldCldO1xufVxuXG5mdW5jdGlvbiBwcmVwcm9jZXNzUkZDMjgyMihzKSB7XG4gIC8vIFJlbW92ZSBjb21tZW50cyBhbmQgZm9sZGluZyB3aGl0ZXNwYWNlIGFuZCByZXBsYWNlIG11bHRpcGxlLXNwYWNlcyB3aXRoIGEgc2luZ2xlIHNwYWNlXG4gIHJldHVybiBzLnJlcGxhY2UoL1xcKFteKV0qXFwpfFtcXG5cXHRdL2csICcgJykucmVwbGFjZSgvKFxcc1xccyspL2csICcgJykudHJpbSgpO1xufVxuXG4vLyBodHRwIGRhdGVcblxudmFyIHJmYzExMjMgPSAvXihNb258VHVlfFdlZHxUaHV8RnJpfFNhdHxTdW4pLCAoXFxkXFxkKSAoSmFufEZlYnxNYXJ8QXByfE1heXxKdW58SnVsfEF1Z3xTZXB8T2N0fE5vdnxEZWMpIChcXGR7NH0pIChcXGRcXGQpOihcXGRcXGQpOihcXGRcXGQpIEdNVCQvO1xudmFyIHJmYzg1MCA9IC9eKE1vbmRheXxUdWVzZGF5fFdlZHNkYXl8VGh1cnNkYXl8RnJpZGF5fFNhdHVyZGF5fFN1bmRheSksIChcXGRcXGQpLShKYW58RmVifE1hcnxBcHJ8TWF5fEp1bnxKdWx8QXVnfFNlcHxPY3R8Tm92fERlYyktKFxcZFxcZCkgKFxcZFxcZCk6KFxcZFxcZCk6KFxcZFxcZCkgR01UJC87XG52YXIgYXNjaWkgPSAvXihNb258VHVlfFdlZHxUaHV8RnJpfFNhdHxTdW4pIChKYW58RmVifE1hcnxBcHJ8TWF5fEp1bnxKdWx8QXVnfFNlcHxPY3R8Tm92fERlYykgKCBcXGR8XFxkXFxkKSAoXFxkXFxkKTooXFxkXFxkKTooXFxkXFxkKSAoXFxkezR9KSQvO1xuXG5mdW5jdGlvbiBleHRyYWN0UkZDMTEyM09yODUwKG1hdGNoKSB7XG4gIHZhciB3ZWVrZGF5U3RyID0gbWF0Y2hbMV0sXG4gICAgICBkYXlTdHIgPSBtYXRjaFsyXSxcbiAgICAgIG1vbnRoU3RyID0gbWF0Y2hbM10sXG4gICAgICB5ZWFyU3RyID0gbWF0Y2hbNF0sXG4gICAgICBob3VyU3RyID0gbWF0Y2hbNV0sXG4gICAgICBtaW51dGVTdHIgPSBtYXRjaFs2XSxcbiAgICAgIHNlY29uZFN0ciA9IG1hdGNoWzddLFxuICAgICAgcmVzdWx0ID0gZnJvbVN0cmluZ3Mod2Vla2RheVN0ciwgeWVhclN0ciwgbW9udGhTdHIsIGRheVN0ciwgaG91clN0ciwgbWludXRlU3RyLCBzZWNvbmRTdHIpO1xuXG4gIHJldHVybiBbcmVzdWx0LCBGaXhlZE9mZnNldFpvbmUudXRjSW5zdGFuY2VdO1xufVxuXG5mdW5jdGlvbiBleHRyYWN0QVNDSUkobWF0Y2gpIHtcbiAgdmFyIHdlZWtkYXlTdHIgPSBtYXRjaFsxXSxcbiAgICAgIG1vbnRoU3RyID0gbWF0Y2hbMl0sXG4gICAgICBkYXlTdHIgPSBtYXRjaFszXSxcbiAgICAgIGhvdXJTdHIgPSBtYXRjaFs0XSxcbiAgICAgIG1pbnV0ZVN0ciA9IG1hdGNoWzVdLFxuICAgICAgc2Vjb25kU3RyID0gbWF0Y2hbNl0sXG4gICAgICB5ZWFyU3RyID0gbWF0Y2hbN10sXG4gICAgICByZXN1bHQgPSBmcm9tU3RyaW5ncyh3ZWVrZGF5U3RyLCB5ZWFyU3RyLCBtb250aFN0ciwgZGF5U3RyLCBob3VyU3RyLCBtaW51dGVTdHIsIHNlY29uZFN0cik7XG5cbiAgcmV0dXJuIFtyZXN1bHQsIEZpeGVkT2Zmc2V0Wm9uZS51dGNJbnN0YW5jZV07XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuXG52YXIgUmVnZXhQYXJzZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFJlZ2V4UGFyc2VyKCkge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFJlZ2V4UGFyc2VyKTtcbiAgfVxuXG4gIFJlZ2V4UGFyc2VyLnBhcnNlSVNPRGF0ZSA9IGZ1bmN0aW9uIHBhcnNlSVNPRGF0ZShzKSB7XG4gICAgcmV0dXJuIHBhcnNlKHMsIFtjb21iaW5lUmVnZXhlcyhpc29ZbWRSZWdleCwgaXNvVGltZUV4dGVuc2lvblJlZ2V4KSwgY29tYmluZUV4dHJhY3RvcnMoZXh0cmFjdElTT1ltZCwgZXh0cmFjdElTT1RpbWUsIGV4dHJhY3RJU09PZmZzZXQpXSwgW2NvbWJpbmVSZWdleGVzKGlzb1dlZWtSZWdleCwgaXNvVGltZUV4dGVuc2lvblJlZ2V4KSwgY29tYmluZUV4dHJhY3RvcnMoZXh0cmFjdElTT1dlZWtEYXRhLCBleHRyYWN0SVNPVGltZSwgZXh0cmFjdElTT09mZnNldCldLCBbY29tYmluZVJlZ2V4ZXMoaXNvT3JkaW5hbFJlZ2V4LCBpc29UaW1lRXh0ZW5zaW9uUmVnZXgpLCBjb21iaW5lRXh0cmFjdG9ycyhleHRyYWN0SVNPT3JkaW5hbERhdGEsIGV4dHJhY3RJU09UaW1lKV0sIFtjb21iaW5lUmVnZXhlcyhpc29UaW1lUmVnZXgpLCBjb21iaW5lRXh0cmFjdG9ycyhleHRyYWN0SVNPVGltZSwgZXh0cmFjdElTT09mZnNldCldKTtcbiAgfTtcblxuICBSZWdleFBhcnNlci5wYXJzZVJGQzI4MjJEYXRlID0gZnVuY3Rpb24gcGFyc2VSRkMyODIyRGF0ZShzKSB7XG4gICAgcmV0dXJuIHBhcnNlKHByZXByb2Nlc3NSRkMyODIyKHMpLCBbcmZjMjgyMiwgZXh0cmFjdFJGQzI4MjJdKTtcbiAgfTtcblxuICBSZWdleFBhcnNlci5wYXJzZUhUVFBEYXRlID0gZnVuY3Rpb24gcGFyc2VIVFRQRGF0ZShzKSB7XG4gICAgcmV0dXJuIHBhcnNlKHMsIFtyZmMxMTIzLCBleHRyYWN0UkZDMTEyM09yODUwXSwgW3JmYzg1MCwgZXh0cmFjdFJGQzExMjNPcjg1MF0sIFthc2NpaSwgZXh0cmFjdEFTQ0lJXSk7XG4gIH07XG5cbiAgUmVnZXhQYXJzZXIucGFyc2VJU09EdXJhdGlvbiA9IGZ1bmN0aW9uIHBhcnNlSVNPRHVyYXRpb24ocykge1xuICAgIHJldHVybiBwYXJzZShzLCBbaXNvRHVyYXRpb24sIGV4dHJhY3RJU09EdXJhdGlvbl0pO1xuICB9O1xuXG4gIFJlZ2V4UGFyc2VyLnBhcnNlU1FMID0gZnVuY3Rpb24gcGFyc2VTUUwocykge1xuICAgIHJldHVybiBwYXJzZShzLCBbY29tYmluZVJlZ2V4ZXMoc3FsWW1kUmVnZXgsIHNxbFRpbWVFeHRlbnNpb25SZWdleCksIGNvbWJpbmVFeHRyYWN0b3JzKGV4dHJhY3RJU09ZbWQsIGV4dHJhY3RJU09UaW1lLCBleHRyYWN0SVNPT2Zmc2V0LCBleHRyYWN0SUFOQVpvbmUpXSwgW2NvbWJpbmVSZWdleGVzKHNxbFRpbWVSZWdleCksIGNvbWJpbmVFeHRyYWN0b3JzKGV4dHJhY3RJU09UaW1lLCBleHRyYWN0SVNPT2Zmc2V0LCBleHRyYWN0SUFOQVpvbmUpXSk7XG4gIH07XG5cbiAgcmV0dXJuIFJlZ2V4UGFyc2VyO1xufSgpO1xuXG52YXIgSU5WQUxJRCQxID0gJ0ludmFsaWQgRHVyYXRpb24nO1xuXG4vLyB1bml0IGNvbnZlcnNpb24gY29uc3RhbnRzXG52YXIgbG93T3JkZXJNYXRyaXggPSB7XG4gIHdlZWtzOiB7XG4gICAgZGF5czogNyxcbiAgICBob3VyczogNyAqIDI0LFxuICAgIG1pbnV0ZXM6IDcgKiAyNCAqIDYwLFxuICAgIHNlY29uZHM6IDcgKiAyNCAqIDYwICogNjAsXG4gICAgbWlsbGlzZWNvbmRzOiA3ICogMjQgKiA2MCAqIDYwICogMTAwMFxuICB9LFxuICBkYXlzOiB7XG4gICAgaG91cnM6IDI0LFxuICAgIG1pbnV0ZXM6IDI0ICogNjAsXG4gICAgc2Vjb25kczogMjQgKiA2MCAqIDYwLFxuICAgIG1pbGxpc2Vjb25kczogMjQgKiA2MCAqIDYwICogMTAwMFxuICB9LFxuICBob3VyczogeyBtaW51dGVzOiA2MCwgc2Vjb25kczogNjAgKiA2MCwgbWlsbGlzZWNvbmRzOiA2MCAqIDYwICogMTAwMCB9LFxuICBtaW51dGVzOiB7IHNlY29uZHM6IDYwLCBtaWxsaXNlY29uZHM6IDYwICogMTAwMCB9LFxuICBzZWNvbmRzOiB7IG1pbGxpc2Vjb25kczogMTAwMCB9XG59O1xudmFyIGNhc3VhbE1hdHJpeCA9IE9iamVjdC5hc3NpZ24oe1xuICB5ZWFyczoge1xuICAgIG1vbnRoczogMTIsXG4gICAgd2Vla3M6IDUyLFxuICAgIGRheXM6IDM2NSxcbiAgICBob3VyczogMzY1ICogMjQsXG4gICAgbWludXRlczogMzY1ICogMjQgKiA2MCxcbiAgICBzZWNvbmRzOiAzNjUgKiAyNCAqIDYwICogNjAsXG4gICAgbWlsbGlzZWNvbmRzOiAzNjUgKiAyNCAqIDYwICogNjAgKiAxMDAwXG4gIH0sXG4gIG1vbnRoczoge1xuICAgIHdlZWtzOiA0LFxuICAgIGRheXM6IDMwLFxuICAgIGhvdXJzOiAzMCAqIDI0LFxuICAgIG1pbnV0ZXM6IDMwICogMjQgKiA2MCxcbiAgICBzZWNvbmRzOiAzMCAqIDI0ICogNjAgKiA2MCxcbiAgICBtaWxsaXNlY29uZHM6IDMwICogMjQgKiA2MCAqIDYwICogMTAwMFxuICB9XG59LCBsb3dPcmRlck1hdHJpeCk7XG52YXIgZGF5c0luWWVhckFjY3VyYXRlID0gMTQ2MDk3LjAgLyA0MDA7XG52YXIgZGF5c0luTW9udGhBY2N1cmF0ZSA9IDE0NjA5Ny4wIC8gNDgwMDtcbnZhciBhY2N1cmF0ZU1hdHJpeCA9IE9iamVjdC5hc3NpZ24oe1xuICB5ZWFyczoge1xuICAgIG1vbnRoczogMTIsXG4gICAgd2Vla3M6IGRheXNJblllYXJBY2N1cmF0ZSAvIDcsXG4gICAgZGF5czogZGF5c0luWWVhckFjY3VyYXRlLFxuICAgIGhvdXJzOiBkYXlzSW5ZZWFyQWNjdXJhdGUgKiAyNCxcbiAgICBtaW51dGVzOiBkYXlzSW5ZZWFyQWNjdXJhdGUgKiAyNCAqIDYwLFxuICAgIHNlY29uZHM6IGRheXNJblllYXJBY2N1cmF0ZSAqIDI0ICogNjAgKiA2MCxcbiAgICBtaWxsaXNlY29uZHM6IGRheXNJblllYXJBY2N1cmF0ZSAqIDI0ICogNjAgKiA2MCAqIDEwMDBcbiAgfSxcbiAgbW9udGhzOiB7XG4gICAgd2Vla3M6IGRheXNJbk1vbnRoQWNjdXJhdGUgLyA3LFxuICAgIGRheXM6IGRheXNJbk1vbnRoQWNjdXJhdGUsXG4gICAgaG91cnM6IGRheXNJblllYXJBY2N1cmF0ZSAqIDI0LFxuICAgIG1pbnV0ZXM6IGRheXNJblllYXJBY2N1cmF0ZSAqIDI0ICogNjAsXG4gICAgc2Vjb25kczogZGF5c0luWWVhckFjY3VyYXRlICogMjQgKiA2MCAqIDYwLFxuICAgIG1pbGxpc2Vjb25kczogZGF5c0luWWVhckFjY3VyYXRlICogMjQgKiA2MCAqIDYwICogMTAwMFxuICB9XG59LCBsb3dPcmRlck1hdHJpeCk7XG5cbi8vIHVuaXRzIG9yZGVyZWQgYnkgc2l6ZVxudmFyIG9yZGVyZWRVbml0cyQxID0gWyd5ZWFycycsICdtb250aHMnLCAnd2Vla3MnLCAnZGF5cycsICdob3VycycsICdtaW51dGVzJywgJ3NlY29uZHMnLCAnbWlsbGlzZWNvbmRzJ107XG5cbi8vIGNsb25lIHJlYWxseSBtZWFucyBcImNyZWF0ZSBhbm90aGVyIGluc3RhbmNlIGp1c3QgbGlrZSB0aGlzIG9uZSwgYnV0IHdpdGggdGhlc2UgY2hhbmdlc1wiXG5mdW5jdGlvbiBjbG9uZSQxKGR1ciwgYWx0cykge1xuICB2YXIgY2xlYXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IGZhbHNlO1xuXG4gIC8vIGRlZXAgbWVyZ2UgZm9yIHZhbHNcbiAgdmFyIGNvbmYgPSB7XG4gICAgdmFsdWVzOiBjbGVhciA/IGFsdHMudmFsdWVzIDogT2JqZWN0LmFzc2lnbih7fSwgZHVyLnZhbHVlcywgYWx0cy52YWx1ZXMgfHwge30pLFxuICAgIGxvYzogZHVyLmxvYy5jbG9uZShhbHRzLmxvYyksXG4gICAgY29udmVyc2lvbkFjY3VyYWN5OiBhbHRzLmNvbnZlcnNpb25BY2N1cmFjeSB8fCBkdXIuY29udmVyc2lvbkFjY3VyYWN5XG4gIH07XG4gIHJldHVybiBuZXcgRHVyYXRpb24oY29uZik7XG59XG5cbi8vIHNvbWUgZnVuY3Rpb25zIHJlYWxseSBjYXJlIGFib3V0IHRoZSBhYnNvbHV0ZSB2YWx1ZSBvZiBhIGR1cmF0aW9uLCBzbyBjb21iaW5lZCB3aXRoXG4vLyBub3JtYWxpemUoKSB0aGlzIHRlbGxzIHVzIHdoZXRoZXIgdGhpcyBkdXJhdGlvbiBpcyBwb3NpdGl2ZSBvciBuZWdhdGl2ZVxuZnVuY3Rpb24gaXNIaWdoT3JkZXJOZWdhdGl2ZShvYmopIHtcbiAgLy8gb25seSBydWxlIGlzIHRoYXQgdGhlIGhpZ2hlc3Qtb3JkZXIgcGFydCBtdXN0IGJlIG5vbi1uZWdhdGl2ZVxuICBmb3IgKHZhciBfaXRlcmF0b3IgPSBvcmRlcmVkVW5pdHMkMSwgX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5KF9pdGVyYXRvciksIF9pID0gMCwgX2l0ZXJhdG9yID0gX2lzQXJyYXkgPyBfaXRlcmF0b3IgOiBfaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICB2YXIgX3JlZjtcblxuICAgIGlmIChfaXNBcnJheSkge1xuICAgICAgaWYgKF9pID49IF9pdGVyYXRvci5sZW5ndGgpIGJyZWFrO1xuICAgICAgX3JlZiA9IF9pdGVyYXRvcltfaSsrXTtcbiAgICB9IGVsc2Uge1xuICAgICAgX2kgPSBfaXRlcmF0b3IubmV4dCgpO1xuICAgICAgaWYgKF9pLmRvbmUpIGJyZWFrO1xuICAgICAgX3JlZiA9IF9pLnZhbHVlO1xuICAgIH1cblxuICAgIHZhciBrID0gX3JlZjtcblxuICAgIGlmIChvYmpba10pIHJldHVybiBvYmpba10gPCAwO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBBIER1cmF0aW9uIG9iamVjdCByZXByZXNlbnRzIGEgcGVyaW9kIG9mIHRpbWUsIGxpa2UgXCIyIG1vbnRoc1wiIG9yIFwiMSBkYXksIDEgaG91clwiLiBDb25jZXB0dWFsbHksIGl0J3MganVzdCBhIG1hcCBvZiB1bml0cyB0byB0aGVpciBxdWFudGl0aWVzLCBhY2NvbXBhbmllZCBieSBzb21lIGFkZGl0aW9uYWwgY29uZmlndXJhdGlvbiBhbmQgbWV0aG9kcyBmb3IgY3JlYXRpbmcsIHBhcnNpbmcsIGludGVycm9nYXRpbmcsIHRyYW5zZm9ybWluZywgYW5kIGZvcm1hdHRpbmcgdGhlbS4gVGhleSBjYW4gYmUgdXNlZCBvbiB0aGVpciBvd24gb3IgaW4gY29uanVuY3Rpb24gd2l0aCBvdGhlciBMdXhvbiB0eXBlczsgZm9yIGV4YW1wbGUsIHlvdSBjYW4gdXNlIHtAbGluayBEYXRlVGltZS5wbHVzfSB0byBhZGQgYSBEdXJhdGlvbiBvYmplY3QgdG8gYSBEYXRlVGltZSwgcHJvZHVjaW5nIGFub3RoZXIgRGF0ZVRpbWUuXG4gKlxuICogSGVyZSBpcyBhIGJyaWVmIG92ZXJ2aWV3IG9mIGNvbW1vbmx5IHVzZWQgbWV0aG9kcyBhbmQgZ2V0dGVycyBpbiBEdXJhdGlvbjpcbiAqXG4gKiAqICoqQ3JlYXRpb24qKiBUbyBjcmVhdGUgYSBEdXJhdGlvbiwgdXNlIHtAbGluayBEdXJhdGlvbi5mcm9tTWlsbGlzfSwge0BsaW5rIER1cmF0aW9uLmZyb21PYmplY3R9LCBvciB7QGxpbmsgRHVyYXRpb24uZnJvbUlTT30uXG4gKiAqICoqVW5pdCB2YWx1ZXMqKiBTZWUgdGhlIHtAbGluayB5ZWFyc30sIHtAbGluayBtb250aHN9LCB7QGxpbmsgd2Vla3N9LCB7QGxpbmsgZGF5c30sIHtAbGluayBob3Vyc30sIHtAbGluayBtaW51dGVzfSwge0BsaW5rIHNlY29uZHN9LCB7QGxpbmsgbWlsbGlzZWNvbmRzfSBhY2Nlc3NvcnMuXG4gKiAqICoqQ29uZmlndXJhdGlvbioqIFNlZSAge0BsaW5rIGxvY2FsZX0gYW5kIHtAbGluayBudW1iZXJpbmdTeXN0ZW19IGFjY2Vzc29ycy5cbiAqICogKipUcmFuc2Zvcm1hdGlvbioqIFRvIGNyZWF0ZSBuZXcgRHVyYXRpb25zIG91dCBvZiBvbGQgb25lcyB1c2Uge0BsaW5rIHBsdXN9LCB7QGxpbmsgbWludXN9LCB7QGxpbmsgbm9ybWFsaXplfSwge0BsaW5rIHNldH0sIHtAbGluayByZWNvbmZpZ3VyZX0sIHtAbGluayBzaGlmdFRvfSwgYW5kIHtAbGluayBuZWdhdGV9LlxuICogKiAqKk91dHB1dCoqIFRvIGNvbnZlcnQgdGhlIER1cmF0aW9uIGludG8gb3RoZXIgcmVwcmVzZW50YXRpb25zLCBzZWUge0BsaW5rIGFzfSwge0BsaW5rIHRvSVNPfSwge0BsaW5rIHRvRm9ybWF0fSwgYW5kIHtAbGluayB0b0pTT059XG4gKlxuICogVGhlcmUncyBhcmUgbW9yZSBtZXRob2RzIGRvY3VtZW50ZWQgYmVsb3cuIEluIGFkZGl0aW9uLCBmb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiBzdWJ0bGVyIHRvcGljcyBsaWtlIGludGVybmF0aW9uYWxpemF0aW9uIGFuZCB2YWxpZGl0eSwgc2VlIHRoZSBleHRlcm5hbCBkb2N1bWVudGF0aW9uLlxuICovXG52YXIgRHVyYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gRHVyYXRpb24oY29uZmlnKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgRHVyYXRpb24pO1xuXG4gICAgdmFyIGFjY3VyYXRlID0gY29uZmlnLmNvbnZlcnNpb25BY2N1cmFjeSA9PT0gJ2xvbmd0ZXJtJyB8fCBmYWxzZTtcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnZhbHVlcyA9IGNvbmZpZy52YWx1ZXM7XG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5sb2MgPSBjb25maWcubG9jIHx8IExvY2FsZS5jcmVhdGUoKTtcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNvbnZlcnNpb25BY2N1cmFjeSA9IGFjY3VyYXRlID8gJ2xvbmd0ZXJtJyA6ICdjYXN1YWwnO1xuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuaW52YWxpZCA9IGNvbmZpZy5pbnZhbGlkUmVhc29uIHx8IG51bGw7XG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5tYXRyaXggPSBhY2N1cmF0ZSA/IGFjY3VyYXRlTWF0cml4IDogY2FzdWFsTWF0cml4O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBEdXJhdGlvbiBmcm9tIGEgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcy5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IG9mIG1pbGxpc2Vjb25kc1xuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0cyAtIG9wdGlvbnMgZm9yIHBhcnNpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtvYmoubG9jYWxlPSdlbi1VUyddIC0gdGhlIGxvY2FsZSB0byB1c2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IG9iai5udW1iZXJpbmdTeXN0ZW0gLSB0aGUgbnVtYmVyaW5nIHN5c3RlbSB0byB1c2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtvYmouY29udmVyc2lvbkFjY3VyYWN5PSdjYXN1YWwnXSAtIHRoZSBjb252ZXJzaW9uIHN5c3RlbSB0byB1c2VcbiAgICogQHJldHVybiB7RHVyYXRpb259XG4gICAqL1xuXG5cbiAgRHVyYXRpb24uZnJvbU1pbGxpcyA9IGZ1bmN0aW9uIGZyb21NaWxsaXMoY291bnQsIG9wdHMpIHtcbiAgICByZXR1cm4gRHVyYXRpb24uZnJvbU9iamVjdChPYmplY3QuYXNzaWduKHsgbWlsbGlzZWNvbmRzOiBjb3VudCB9LCBvcHRzKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBEdXJhdGlvbiBmcm9tIGEgSmF2YXNjcmlwdCBvYmplY3Qgd2l0aCBrZXlzIGxpa2UgJ3llYXJzJyBhbmQgJ2hvdXJzJy5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9iaiAtIHRoZSBvYmplY3QgdG8gY3JlYXRlIHRoZSBEYXRlVGltZSBmcm9tXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBvYmoueWVhcnNcbiAgICogQHBhcmFtIHtudW1iZXJ9IG9iai5tb250aHNcbiAgICogQHBhcmFtIHtudW1iZXJ9IG9iai53ZWVrc1xuICAgKiBAcGFyYW0ge251bWJlcn0gb2JqLmRheXNcbiAgICogQHBhcmFtIHtudW1iZXJ9IG9iai5ob3Vyc1xuICAgKiBAcGFyYW0ge251bWJlcn0gb2JqLm1pbnV0ZXNcbiAgICogQHBhcmFtIHtudW1iZXJ9IG9iai5zZWNvbmRzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBvYmoubWlsbGlzZWNvbmRzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb2JqLmxvY2FsZT0nZW4tVVMnXSAtIHRoZSBsb2NhbGUgdG8gdXNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvYmoubnVtYmVyaW5nU3lzdGVtIC0gdGhlIG51bWJlcmluZyBzeXN0ZW0gdG8gdXNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb2JqLmNvbnZlcnNpb25BY2N1cmFjeT0nY2FzdWFsJ10gLSB0aGUgY29udmVyc2lvbiBzeXN0ZW0gdG8gdXNlXG4gICAqIEByZXR1cm4ge0R1cmF0aW9ufVxuICAgKi9cblxuXG4gIER1cmF0aW9uLmZyb21PYmplY3QgPSBmdW5jdGlvbiBmcm9tT2JqZWN0KG9iaikge1xuICAgIHJldHVybiBuZXcgRHVyYXRpb24oe1xuICAgICAgdmFsdWVzOiBVdGlsLm5vcm1hbGl6ZU9iamVjdChvYmosIER1cmF0aW9uLm5vcm1hbGl6ZVVuaXQsIHRydWUpLFxuICAgICAgbG9jOiBMb2NhbGUuZnJvbU9iamVjdChvYmopLFxuICAgICAgY29udmVyc2lvbkFjY3VyYWN5OiBvYmouY29udmVyc2lvbkFjY3VyYWN5XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIER1cmF0aW9uIGZyb20gYW4gSVNPIDg2MDEgZHVyYXRpb24gc3RyaW5nLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIHRleHQgdG8gcGFyc2VcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdHMgLSBvcHRpb25zIGZvciBwYXJzaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb2JqLmxvY2FsZT0nZW4tVVMnXSAtIHRoZSBsb2NhbGUgdG8gdXNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvYmoubnVtYmVyaW5nU3lzdGVtIC0gdGhlIG51bWJlcmluZyBzeXN0ZW0gdG8gdXNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb2JqLmNvbnZlcnNpb25BY2N1cmFjeT0nY2FzdWFsJ10gLSB0aGUgY29udmVyc2lvbiBzeXN0ZW0gdG8gdXNlXG4gICAqIEBzZWUgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSVNPXzg2MDEjRHVyYXRpb25zXG4gICAqIEBleGFtcGxlIER1cmF0aW9uLmZyb21JU08oJ1AzWTZNNERUMTJIMzBNNVMnKS50b09iamVjdCgpIC8vPT4geyB5ZWFyczogMywgbW9udGhzOiA2LCBkYXk6IDQsIGhvdXJzOiAxMiwgbWludXRlczogMzAsIHNlY29uZHM6IDUgfVxuICAgKiBAZXhhbXBsZSBEdXJhdGlvbi5mcm9tSVNPKCdQVDIzSCcpLnRvT2JqZWN0KCkgLy89PiB7IGhvdXJzOiAyMyB9XG4gICAqIEBleGFtcGxlIER1cmF0aW9uLmZyb21JU08oJ1A1WTNNJykudG9PYmplY3QoKSAvLz0+IHsgeWVhcnM6IDUsIG1vbnRoczogMyB9XG4gICAqIEByZXR1cm4ge0R1cmF0aW9ufVxuICAgKi9cblxuXG4gIER1cmF0aW9uLmZyb21JU08gPSBmdW5jdGlvbiBmcm9tSVNPKHRleHQsIG9wdHMpIHtcbiAgICB2YXIgb2JqID0gT2JqZWN0LmFzc2lnbihSZWdleFBhcnNlci5wYXJzZUlTT0R1cmF0aW9uKHRleHQpLCBvcHRzKTtcbiAgICByZXR1cm4gRHVyYXRpb24uZnJvbU9iamVjdChvYmopO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gaW52YWxpZCBEdXJhdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlYXNvbiAtIHJlYXNvbiB0aGlzIGlzIGludmFsaWRcbiAgICogQHJldHVybiB7RHVyYXRpb259XG4gICAqL1xuXG5cbiAgRHVyYXRpb24uaW52YWxpZCA9IGZ1bmN0aW9uIGludmFsaWQocmVhc29uKSB7XG4gICAgaWYgKCFyZWFzb24pIHtcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkQXJndW1lbnRFcnJvcignbmVlZCB0byBzcGVjaWZ5IGEgcmVhc29uIHRoZSBEdXJhdGlvbiBpcyBpbnZhbGlkJyk7XG4gICAgfVxuICAgIGlmIChTZXR0aW5ncy50aHJvd09uSW52YWxpZCkge1xuICAgICAgdGhyb3cgbmV3IEludmFsaWREdXJhdGlvbkVycm9yKHJlYXNvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgRHVyYXRpb24oeyBpbnZhbGlkUmVhc29uOiByZWFzb24gfSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cblxuXG4gIER1cmF0aW9uLm5vcm1hbGl6ZVVuaXQgPSBmdW5jdGlvbiBub3JtYWxpemVVbml0KHVuaXQpIHtcbiAgICB2YXIgaWdub3JlVW5rbm93biA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZmFsc2U7XG5cbiAgICB2YXIgbm9ybWFsaXplZCA9IHtcbiAgICAgIHllYXI6ICd5ZWFycycsXG4gICAgICB5ZWFyczogJ3llYXJzJyxcbiAgICAgIG1vbnRoOiAnbW9udGhzJyxcbiAgICAgIG1vbnRoczogJ21vbnRocycsXG4gICAgICB3ZWVrOiAnd2Vla3MnLFxuICAgICAgd2Vla3M6ICd3ZWVrcycsXG4gICAgICBkYXk6ICdkYXlzJyxcbiAgICAgIGRheXM6ICdkYXlzJyxcbiAgICAgIGhvdXI6ICdob3VycycsXG4gICAgICBob3VyczogJ2hvdXJzJyxcbiAgICAgIG1pbnV0ZTogJ21pbnV0ZXMnLFxuICAgICAgbWludXRlczogJ21pbnV0ZXMnLFxuICAgICAgc2Vjb25kOiAnc2Vjb25kcycsXG4gICAgICBzZWNvbmRzOiAnc2Vjb25kcycsXG4gICAgICBtaWxsaXNlY29uZDogJ21pbGxpc2Vjb25kcycsXG4gICAgICBtaWxsaXNlY29uZHM6ICdtaWxsaXNlY29uZHMnXG4gICAgfVt1bml0ID8gdW5pdC50b0xvd2VyQ2FzZSgpIDogdW5pdF07XG5cbiAgICBpZiAoIWlnbm9yZVVua25vd24gJiYgIW5vcm1hbGl6ZWQpIHRocm93IG5ldyBJbnZhbGlkVW5pdEVycm9yKHVuaXQpO1xuXG4gICAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCAgdGhlIGxvY2FsZSBvZiBhIER1cmF0aW9uLCBzdWNoICdlbi1HQidcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cblxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgRHVyYXRpb24gZm9ybWF0dGVkIGFjY29yZGluZyB0byB0aGUgc3BlY2lmaWVkIGZvcm1hdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmbXQgLSB0aGUgZm9ybWF0IHN0cmluZ1xuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0cyAtIG9wdGlvbnNcbiAgICogQHBhcmFtIHtib29sZWFufSBvcHRzLnJvdW5kIC0gcm91bmQgbnVtZXJpY2FsIHZhbHVlc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBEdXJhdGlvbi5wcm90b3R5cGUudG9Gb3JtYXQgPSBmdW5jdGlvbiB0b0Zvcm1hdChmbXQpIHtcbiAgICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICByZXR1cm4gdGhpcy5pc1ZhbGlkID8gRm9ybWF0dGVyLmNyZWF0ZSh0aGlzLmxvYywgb3B0cykuZm9ybWF0RHVyYXRpb25Gcm9tU3RyaW5nKHRoaXMsIGZtdCkgOiBJTlZBTElEJDE7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBKYXZhc2NyaXB0IG9iamVjdCB3aXRoIHRoaXMgRHVyYXRpb24ncyB2YWx1ZXMuXG4gICAqIEBwYXJhbSBvcHRzIC0gb3B0aW9ucyBmb3IgZ2VuZXJhdGluZyB0aGUgb2JqZWN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuaW5jbHVkZUNvbmZpZz1mYWxzZV0gLSBpbmNsdWRlIGNvbmZpZ3VyYXRpb24gYXR0cmlidXRlcyBpbiB0aGUgb3V0cHV0XG4gICAqIEBleGFtcGxlIER1cmF0aW9uLmZyb21PYmplY3QoeyB5ZWFyczogMSwgZGF5czogNiwgc2Vjb25kczogMiB9KS50b09iamVjdCgpIC8vPT4geyB5ZWFyczogMSwgZGF5czogNiwgc2Vjb25kczogMiB9XG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG5cblxuICBEdXJhdGlvbi5wcm90b3R5cGUudG9PYmplY3QgPSBmdW5jdGlvbiB0b09iamVjdCgpIHtcbiAgICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgICBpZiAoIXRoaXMuaXNWYWxpZCkgcmV0dXJuIHt9O1xuXG4gICAgdmFyIGJhc2UgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnZhbHVlcyk7XG5cbiAgICBpZiAob3B0cy5pbmNsdWRlQ29uZmlnKSB7XG4gICAgICBiYXNlLmNvbnZlcnNpb25BY2N1cmFjeSA9IHRoaXMuY29udmVyc2lvbkFjY3VyYWN5O1xuICAgICAgYmFzZS5udW1iZXJpbmdTeXN0ZW0gPSB0aGlzLmxvYy5udW1iZXJpbmdTeXN0ZW07XG4gICAgICBiYXNlLmxvY2FsZSA9IHRoaXMubG9jLmxvY2FsZTtcbiAgICB9XG4gICAgcmV0dXJuIGJhc2U7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gSVNPIDg2MDEtY29tcGxpYW50IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIER1cmF0aW9uLlxuICAgKiBAc2VlIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0lTT184NjAxI0R1cmF0aW9uc1xuICAgKiBAZXhhbXBsZSBEdXJhdGlvbi5mcm9tT2JqZWN0KHsgeWVhcnM6IDMsIHNlY29uZHM6IDQ1IH0pLnRvSVNPKCkgLy89PiAnUDNZVDQ1UydcbiAgICogQGV4YW1wbGUgRHVyYXRpb24uZnJvbU9iamVjdCh7IG1vbnRoczogNCwgc2Vjb25kczogNDUgfSkudG9JU08oKSAvLz0+ICdQNE1UNDVTJ1xuICAgKiBAZXhhbXBsZSBEdXJhdGlvbi5mcm9tT2JqZWN0KHsgbW9udGhzOiA1IH0pLnRvSVNPKCkgLy89PiAnUDVNJ1xuICAgKiBAZXhhbXBsZSBEdXJhdGlvbi5mcm9tT2JqZWN0KHsgbWludXRlczogNSB9KS50b0lTTygpIC8vPT4gJ1BUNU0nXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG5cblxuICBEdXJhdGlvbi5wcm90b3R5cGUudG9JU08gPSBmdW5jdGlvbiB0b0lTTygpIHtcbiAgICAvLyB3ZSBjb3VsZCB1c2UgdGhlIGZvcm1hdHRlciwgYnV0IHRoaXMgaXMgYW4gZWFzaWVyIHdheSB0byBnZXQgdGhlIG1pbmltdW0gc3RyaW5nXG4gICAgaWYgKCF0aGlzLmlzVmFsaWQpIHJldHVybiBudWxsO1xuXG4gICAgdmFyIHMgPSAnUCcsXG4gICAgICAgIG5vcm0gPSB0aGlzLm5vcm1hbGl6ZSgpO1xuXG4gICAgLy8gSVNPIGR1cmF0aW9ucyBhcmUgYWx3YXlzIHBvc2l0aXZlLCBzbyB0YWtlIHRoZSBhYnNvbHV0ZSB2YWx1ZVxuICAgIG5vcm0gPSBpc0hpZ2hPcmRlck5lZ2F0aXZlKG5vcm0udmFsdWVzKSA/IG5vcm0ubmVnYXRlKCkgOiBub3JtO1xuXG4gICAgaWYgKG5vcm0ueWVhcnMgPiAwKSBzICs9IG5vcm0ueWVhcnMgKyAnWSc7XG4gICAgaWYgKG5vcm0ubW9udGhzID4gMCkgcyArPSBub3JtLm1vbnRocyArICdNJztcbiAgICBpZiAobm9ybS5kYXlzID4gMCB8fCBub3JtLndlZWtzID4gMCkgcyArPSBub3JtLmRheXMgKyBub3JtLndlZWtzICogNyArICdEJztcbiAgICBpZiAobm9ybS5ob3VycyA+IDAgfHwgbm9ybS5taW51dGVzID4gMCB8fCBub3JtLnNlY29uZHMgPiAwIHx8IG5vcm0ubWlsbGlzZWNvbmRzID4gMCkgcyArPSAnVCc7XG4gICAgaWYgKG5vcm0uaG91cnMgPiAwKSBzICs9IG5vcm0uaG91cnMgKyAnSCc7XG4gICAgaWYgKG5vcm0ubWludXRlcyA+IDApIHMgKz0gbm9ybS5taW51dGVzICsgJ00nO1xuICAgIGlmIChub3JtLnNlY29uZHMgPiAwKSBzICs9IG5vcm0uc2Vjb25kcyArICdTJztcbiAgICByZXR1cm4gcztcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhbiBJU08gODYwMSByZXByZXNlbnRhdGlvbiBvZiB0aGlzIER1cmF0aW9uIGFwcHJvcHJpYXRlIGZvciB1c2UgaW4gSlNPTi5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cblxuXG4gIER1cmF0aW9uLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHRoaXMudG9JU08oKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhbiBJU08gODYwMSByZXByZXNlbnRhdGlvbiBvZiB0aGlzIER1cmF0aW9uIGFwcHJvcHJpYXRlIGZvciB1c2UgaW4gZGVidWdnaW5nLlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuXG5cbiAgRHVyYXRpb24ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMudG9JU08oKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIER1cmF0aW9uIGFwcHJvcHJpYXRlIGZvciB0aGUgUkVQTC5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cblxuXG4gIER1cmF0aW9uLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCgpIHtcbiAgICBpZiAodGhpcy5pc1ZhbGlkKSB7XG4gICAgICByZXR1cm4gJ0R1cmF0aW9uIHtcXG4gIHZhbHVlczogJyArIHRoaXMudG9JU08oKSArICcsXFxuICBsb2NhbGU6ICcgKyB0aGlzLmxvY2FsZSArICcsXFxuICBjb252ZXJzaW9uQWNjdXJhY3k6ICcgKyB0aGlzLmNvbnZlcnNpb25BY2N1cmFjeSArICcgfSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnRHVyYXRpb24geyBJbnZhbGlkLCByZWFzb246ICcgKyB0aGlzLmludmFsaWRSZWFzb24gKyAnIH0nO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogTWFrZSB0aGlzIER1cmF0aW9uIGxvbmdlciBieSB0aGUgc3BlY2lmaWVkIGFtb3VudC4gUmV0dXJuIGEgbmV3bHktY29uc3RydWN0ZWQgRHVyYXRpb24uXG4gICAqIEBwYXJhbSB7RHVyYXRpb258bnVtYmVyfG9iamVjdH0gZHVyYXRpb24gLSBUaGUgYW1vdW50IHRvIGFkZC4gRWl0aGVyIGEgTHV4b24gRHVyYXRpb24sIGEgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcywgdGhlIG9iamVjdCBhcmd1bWVudCB0byBEdXJhdGlvbi5mcm9tT2JqZWN0KClcbiAgICogQHJldHVybiB7RHVyYXRpb259XG4gICAqL1xuXG5cbiAgRHVyYXRpb24ucHJvdG90eXBlLnBsdXMgPSBmdW5jdGlvbiBwbHVzKGR1cmF0aW9uKSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQpIHJldHVybiB0aGlzO1xuXG4gICAgdmFyIGR1ciA9IFV0aWwuZnJpZW5kbHlEdXJhdGlvbihkdXJhdGlvbiksXG4gICAgICAgIHJlc3VsdCA9IHt9O1xuXG4gICAgZm9yICh2YXIgX2l0ZXJhdG9yMiA9IG9yZGVyZWRVbml0cyQxLCBfaXNBcnJheTIgPSBBcnJheS5pc0FycmF5KF9pdGVyYXRvcjIpLCBfaTIgPSAwLCBfaXRlcmF0b3IyID0gX2lzQXJyYXkyID8gX2l0ZXJhdG9yMiA6IF9pdGVyYXRvcjJbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgIHZhciBfcmVmMjtcblxuICAgICAgaWYgKF9pc0FycmF5Mikge1xuICAgICAgICBpZiAoX2kyID49IF9pdGVyYXRvcjIubGVuZ3RoKSBicmVhaztcbiAgICAgICAgX3JlZjIgPSBfaXRlcmF0b3IyW19pMisrXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9pMiA9IF9pdGVyYXRvcjIubmV4dCgpO1xuICAgICAgICBpZiAoX2kyLmRvbmUpIGJyZWFrO1xuICAgICAgICBfcmVmMiA9IF9pMi52YWx1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGsgPSBfcmVmMjtcblxuICAgICAgdmFyIHZhbCA9IGR1ci5nZXQoaykgKyB0aGlzLmdldChrKTtcbiAgICAgIGlmICh2YWwgIT09IDApIHtcbiAgICAgICAgcmVzdWx0W2tdID0gdmFsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjbG9uZSQxKHRoaXMsIHsgdmFsdWVzOiByZXN1bHQgfSwgdHJ1ZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIE1ha2UgdGhpcyBEdXJhdGlvbiBzaG9ydGVyIGJ5IHRoZSBzcGVjaWZpZWQgYW1vdW50LiBSZXR1cm4gYSBuZXdseS1jb25zdHJ1Y3RlZCBEdXJhdGlvbi5cbiAgICogQHBhcmFtIHtEdXJhdGlvbnxudW1iZXJ8b2JqZWN0fSBkdXJhdGlvbiAtIFRoZSBhbW91bnQgdG8gc3VidHJhY3QuIEVpdGhlciBhIEx1eG9uIER1cmF0aW9uLCBhIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIHRoZSBvYmplY3QgYXJndW1lbnQgdG8gRHVyYXRpb24uZnJvbU9iamVjdCgpXG4gICAqIEByZXR1cm4ge0R1cmF0aW9ufVxuICAgKi9cblxuXG4gIER1cmF0aW9uLnByb3RvdHlwZS5taW51cyA9IGZ1bmN0aW9uIG1pbnVzKGR1cmF0aW9uKSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQpIHJldHVybiB0aGlzO1xuXG4gICAgdmFyIGR1ciA9IFV0aWwuZnJpZW5kbHlEdXJhdGlvbihkdXJhdGlvbik7XG4gICAgcmV0dXJuIHRoaXMucGx1cyhkdXIubmVnYXRlKCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHZhbHVlIG9mIHVuaXQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1bml0IC0gYSB1bml0IHN1Y2ggYXMgJ21pbnV0ZScgb3IgJ2RheSdcbiAgICogQGV4YW1wbGUgRHVyYXRpb24uZnJvbU9iamVjdCh7eWVhcnM6IDIsIGRheXM6IDN9KS55ZWFycyAvLz0+IDJcbiAgICogQGV4YW1wbGUgRHVyYXRpb24uZnJvbU9iamVjdCh7eWVhcnM6IDIsIGRheXM6IDN9KS5tb250aHMgLy89PiAwXG4gICAqIEBleGFtcGxlIER1cmF0aW9uLmZyb21PYmplY3Qoe3llYXJzOiAyLCBkYXlzOiAzfSkuZGF5cyAvLz0+IDNcbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cblxuXG4gIER1cmF0aW9uLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQkJDEodW5pdCkge1xuICAgIHJldHVybiB0aGlzW0R1cmF0aW9uLm5vcm1hbGl6ZVVuaXQodW5pdCldO1xuICB9O1xuXG4gIC8qKlxuICAgKiBcIlNldFwiIHRoZSB2YWx1ZXMgb2Ygc3BlY2lmaWVkIHVuaXRzLiBSZXR1cm4gYSBuZXdseS1jb25zdHJ1Y3RlZCBEdXJhdGlvbi5cbiAgICogQHBhcmFtIHtvYmplY3R9IHZhbHVlcyAtIGEgbWFwcGluZyBvZiB1bml0cyB0byBudW1iZXJzXG4gICAqIEBleGFtcGxlIGR1ci5zZXQoeyB5ZWFyczogMjAxNyB9KVxuICAgKiBAZXhhbXBsZSBkdXIuc2V0KHsgaG91cnM6IDgsIG1pbnV0ZXM6IDMwIH0pXG4gICAqIEByZXR1cm4ge0R1cmF0aW9ufVxuICAgKi9cblxuXG4gIER1cmF0aW9uLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQkJDEodmFsdWVzKSB7XG4gICAgdmFyIG1peGVkID0gT2JqZWN0LmFzc2lnbih0aGlzLnZhbHVlcywgVXRpbC5ub3JtYWxpemVPYmplY3QodmFsdWVzLCBEdXJhdGlvbi5ub3JtYWxpemVVbml0KSk7XG4gICAgcmV0dXJuIGNsb25lJDEodGhpcywgeyB2YWx1ZXM6IG1peGVkIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBcIlNldFwiIHRoZSBsb2NhbGUgYW5kL29yIG51bWJlcmluZ1N5c3RlbS4gIFJldHVybnMgYSBuZXdseS1jb25zdHJ1Y3RlZCBEdXJhdGlvbi5cbiAgICogQGV4YW1wbGUgZHVyLnJlY29uZmlndXJlKHsgbG9jYWxlOiAnZW4tR0InIH0pXG4gICAqIEByZXR1cm4ge0R1cmF0aW9ufVxuICAgKi9cblxuXG4gIER1cmF0aW9uLnByb3RvdHlwZS5yZWNvbmZpZ3VyZSA9IGZ1bmN0aW9uIHJlY29uZmlndXJlKCkge1xuICAgIHZhciBfcmVmMyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge30sXG4gICAgICAgIGxvY2FsZSA9IF9yZWYzLmxvY2FsZSxcbiAgICAgICAgbnVtYmVyaW5nU3lzdGVtID0gX3JlZjMubnVtYmVyaW5nU3lzdGVtLFxuICAgICAgICBjb252ZXJzaW9uQWNjdXJhY3kgPSBfcmVmMy5jb252ZXJzaW9uQWNjdXJhY3k7XG5cbiAgICB2YXIgbG9jID0gdGhpcy5sb2MuY2xvbmUoeyBsb2NhbGU6IGxvY2FsZSwgbnVtYmVyaW5nU3lzdGVtOiBudW1iZXJpbmdTeXN0ZW0gfSksXG4gICAgICAgIG9wdHMgPSB7IGxvYzogbG9jIH07XG5cbiAgICBpZiAoY29udmVyc2lvbkFjY3VyYWN5KSB7XG4gICAgICBvcHRzLmNvbnZlcnNpb25BY2N1cmFjeSA9IGNvbnZlcnNpb25BY2N1cmFjeTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2xvbmUkMSh0aGlzLCBvcHRzKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBsZW5ndGggb2YgdGhlIGR1cmF0aW9uIGluIHRoZSBzcGVjaWZpZWQgdW5pdC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVuaXQgLSBhIHVuaXQgc3VjaCBhcyAnbWludXRlcycgb3IgJ2RheXMnXG4gICAqIEBleGFtcGxlIER1cmF0aW9uLmZyb21PYmplY3Qoe3llYXJzOiAxfSkuYXMoJ2RheXMnKSAvLz0+IDM2NVxuICAgKiBAZXhhbXBsZSBEdXJhdGlvbi5mcm9tT2JqZWN0KHt5ZWFyczogMX0pLmFzKCdtb250aHMnKSAvLz0+IDEyXG4gICAqIEBleGFtcGxlIER1cmF0aW9uLmZyb21PYmplY3Qoe2hvdXJzOiA2MH0pLmFzKCdkYXlzJykgLy89PiAyLjVcbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cblxuXG4gIER1cmF0aW9uLnByb3RvdHlwZS5hcyA9IGZ1bmN0aW9uIGFzKHVuaXQpIHtcbiAgICByZXR1cm4gdGhpcy5pc1ZhbGlkID8gdGhpcy5zaGlmdFRvKHVuaXQpLmdldCh1bml0KSA6IE5hTjtcbiAgfTtcblxuICAvKipcbiAgICogUmVkdWNlIHRoaXMgRHVyYXRpb24gdG8gaXRzIGNhbm9uaWNhbCByZXByZXNlbnRhdGlvbiBpbiBpdHMgY3VycmVudCB1bml0cy5cbiAgICogQGV4YW1wbGUgRHVyYXRpb24uZnJvbU9iamVjdCh7IHllYXJzOiAyLCBkYXlzOiA1MDAwIH0pLm5vcm1hbGl6ZSgpLnRvT2JqZWN0KCkgLy89PiB7IHllYXJzOiAxNSwgZGF5czogMjU1IH1cbiAgICogQGV4YW1wbGUgRHVyYXRpb24uZnJvbU9iamVjdCh7IGhvdXJzOiAxMiwgbWludXRlczogLTQ1IH0pLm5vcm1hbGl6ZSgpLnRvT2JqZWN0KCkgLy89PiB7IGhvdXJzOiAxMSwgbWludXRlczogMTUgfVxuICAgKiBAcmV0dXJuIHtEdXJhdGlvbn1cbiAgICovXG5cblxuICBEdXJhdGlvbi5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24gbm9ybWFsaXplKCkge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKSByZXR1cm4gdGhpcztcblxuICAgIHZhciBuZWcgPSBpc0hpZ2hPcmRlck5lZ2F0aXZlKHRoaXMudmFsdWVzKSxcbiAgICAgICAgZHVyID0gbmVnID8gdGhpcy5uZWdhdGUoKSA6IHRoaXMsXG4gICAgICAgIHNoaWZ0ZWQgPSBkdXIuc2hpZnRUby5hcHBseShkdXIsIE9iamVjdC5rZXlzKHRoaXMudmFsdWVzKSk7XG4gICAgcmV0dXJuIG5lZyA/IHNoaWZ0ZWQubmVnYXRlKCkgOiBzaGlmdGVkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0IHRoaXMgRHVyYXRpb24gaW50byBpdHMgcmVwcmVzZW50YXRpb24gaW4gYSBkaWZmZXJlbnQgc2V0IG9mIHVuaXRzLlxuICAgKiBAZXhhbXBsZSBEdXJhdGlvbi5mcm9tT2JqZWN0KHsgaG91cnM6IDEsIHNlY29uZHM6IDMwIH0pLnNoaWZ0VG8oJ21pbnV0ZXMnLCAnbWlsbGlzZWNvbmRzJykudG9PYmplY3QoKSAvLz0+IHsgbWludXRlczogNjAsIG1pbGxpc2Vjb25kczogMzAwMDAgfVxuICAgKiBAcmV0dXJuIHtEdXJhdGlvbn1cbiAgICovXG5cblxuICBEdXJhdGlvbi5wcm90b3R5cGUuc2hpZnRUbyA9IGZ1bmN0aW9uIHNoaWZ0VG8oKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHVuaXRzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICB1bml0c1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaXNWYWxpZCkgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAodW5pdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1bml0cyA9IHVuaXRzLm1hcChmdW5jdGlvbiAodSkge1xuICAgICAgcmV0dXJuIER1cmF0aW9uLm5vcm1hbGl6ZVVuaXQodSk7XG4gICAgfSk7XG5cbiAgICB2YXIgYnVpbHQgPSB7fSxcbiAgICAgICAgYWNjdW11bGF0ZWQgPSB7fSxcbiAgICAgICAgdmFscyA9IHRoaXMudG9PYmplY3QoKTtcbiAgICB2YXIgbGFzdFVuaXQgPSB2b2lkIDA7XG5cbiAgICBmb3IgKHZhciBfaXRlcmF0b3IzID0gb3JkZXJlZFVuaXRzJDEsIF9pc0FycmF5MyA9IEFycmF5LmlzQXJyYXkoX2l0ZXJhdG9yMyksIF9pMyA9IDAsIF9pdGVyYXRvcjMgPSBfaXNBcnJheTMgPyBfaXRlcmF0b3IzIDogX2l0ZXJhdG9yM1tTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgdmFyIF9yZWY0O1xuXG4gICAgICBpZiAoX2lzQXJyYXkzKSB7XG4gICAgICAgIGlmIChfaTMgPj0gX2l0ZXJhdG9yMy5sZW5ndGgpIGJyZWFrO1xuICAgICAgICBfcmVmNCA9IF9pdGVyYXRvcjNbX2kzKytdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2kzID0gX2l0ZXJhdG9yMy5uZXh0KCk7XG4gICAgICAgIGlmIChfaTMuZG9uZSkgYnJlYWs7XG4gICAgICAgIF9yZWY0ID0gX2kzLnZhbHVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgayA9IF9yZWY0O1xuXG4gICAgICBpZiAodW5pdHMuaW5kZXhPZihrKSA+PSAwKSB7XG4gICAgICAgIGxhc3RVbml0ID0gaztcblxuICAgICAgICB2YXIgb3duID0gMDtcblxuICAgICAgICAvLyBhbnl0aGluZyB3ZSBoYXZlbid0IGJvaWxlZCBkb3duIHlldCBzaG91bGQgZ2V0IGJvaWxlZCB0byB0aGlzIHVuaXRcbiAgICAgICAgZm9yICh2YXIgYWsgaW4gYWNjdW11bGF0ZWQpIHtcbiAgICAgICAgICBpZiAoYWNjdW11bGF0ZWQuaGFzT3duUHJvcGVydHkoYWspKSB7XG4gICAgICAgICAgICBvd24gKz0gdGhpcy5tYXRyaXhbYWtdW2tdICogYWNjdW11bGF0ZWRbYWtdO1xuICAgICAgICAgICAgYWNjdW11bGF0ZWRbYWtdID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwbHVzIGFueXRoaW5nIHRoYXQncyBhbHJlYWR5IGluIHRoaXMgdW5pdFxuICAgICAgICBpZiAoVXRpbC5pc051bWJlcih2YWxzW2tdKSkge1xuICAgICAgICAgIG93biArPSB2YWxzW2tdO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGkgPSBNYXRoLnRydW5jKG93bik7XG4gICAgICAgIGJ1aWx0W2tdID0gaTtcbiAgICAgICAgYWNjdW11bGF0ZWRba10gPSBvd24gLSBpO1xuXG4gICAgICAgIC8vIHBsdXMgYW55dGhpbmcgZnVydGhlciBkb3duIHRoZSBjaGFpbiB0aGF0IHNob3VsZCBiZSByb2xsZWQgdXAgaW4gdG8gdGhpc1xuICAgICAgICBmb3IgKHZhciBkb3duIGluIHZhbHMpIHtcbiAgICAgICAgICBpZiAob3JkZXJlZFVuaXRzJDEuaW5kZXhPZihkb3duKSA+IG9yZGVyZWRVbml0cyQxLmluZGV4T2YoaykpIHtcbiAgICAgICAgICAgIHZhciBjb252ID0gdGhpcy5tYXRyaXhba11bZG93bl0sXG4gICAgICAgICAgICAgICAgYWRkZWQgPSBNYXRoLmZsb29yKHZhbHNbZG93bl0gLyBjb252KTtcbiAgICAgICAgICAgIGJ1aWx0W2tdICs9IGFkZGVkO1xuICAgICAgICAgICAgdmFsc1tkb3duXSAtPSBhZGRlZCAqIGNvbnY7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIG90aGVyd2lzZSwga2VlcCBpdCBpbiB0aGUgd2luZ3MgdG8gYm9pbCBpdCBsYXRlclxuICAgICAgfSBlbHNlIGlmIChVdGlsLmlzTnVtYmVyKHZhbHNba10pKSB7XG4gICAgICAgIGFjY3VtdWxhdGVkW2tdID0gdmFsc1trXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBhbnl0aGluZyBsZWZ0b3ZlciBiZWNvbWVzIHRoZSBkZWNpbWFsIGZvciB0aGUgbGFzdCB1bml0XG4gICAgaWYgKGxhc3RVbml0KSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gYWNjdW11bGF0ZWQpIHtcbiAgICAgICAgaWYgKGFjY3VtdWxhdGVkLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBpZiAoYWNjdW11bGF0ZWRba2V5XSA+IDApIHtcbiAgICAgICAgICAgIGJ1aWx0W2xhc3RVbml0XSArPSBrZXkgPT09IGxhc3RVbml0ID8gYWNjdW11bGF0ZWRba2V5XSA6IGFjY3VtdWxhdGVkW2tleV0gLyB0aGlzLm1hdHJpeFtsYXN0VW5pdF1ba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNsb25lJDEodGhpcywgeyB2YWx1ZXM6IGJ1aWx0IH0sIHRydWUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIG5lZ2F0aXZlIG9mIHRoaXMgRHVyYXRpb24uXG4gICAqIEBleGFtcGxlIER1cmF0aW9uLmZyb21PYmplY3QoeyBob3VyczogMSwgc2Vjb25kczogMzAgfSkubmVnYXRlKCkudG9PYmplY3QoKSAvLz0+IHsgaG91cnM6IC0xLCBzZWNvbmRzOiAtMzAgfVxuICAgKiBAcmV0dXJuIHtEdXJhdGlvbn1cbiAgICovXG5cblxuICBEdXJhdGlvbi5wcm90b3R5cGUubmVnYXRlID0gZnVuY3Rpb24gbmVnYXRlKCkge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKSByZXR1cm4gdGhpcztcbiAgICB2YXIgbmVnYXRlZCA9IHt9O1xuICAgIGZvciAodmFyIF9pdGVyYXRvcjQgPSBPYmplY3Qua2V5cyh0aGlzLnZhbHVlcyksIF9pc0FycmF5NCA9IEFycmF5LmlzQXJyYXkoX2l0ZXJhdG9yNCksIF9pNCA9IDAsIF9pdGVyYXRvcjQgPSBfaXNBcnJheTQgPyBfaXRlcmF0b3I0IDogX2l0ZXJhdG9yNFtTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgdmFyIF9yZWY1O1xuXG4gICAgICBpZiAoX2lzQXJyYXk0KSB7XG4gICAgICAgIGlmIChfaTQgPj0gX2l0ZXJhdG9yNC5sZW5ndGgpIGJyZWFrO1xuICAgICAgICBfcmVmNSA9IF9pdGVyYXRvcjRbX2k0KytdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2k0ID0gX2l0ZXJhdG9yNC5uZXh0KCk7XG4gICAgICAgIGlmIChfaTQuZG9uZSkgYnJlYWs7XG4gICAgICAgIF9yZWY1ID0gX2k0LnZhbHVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgayA9IF9yZWY1O1xuXG4gICAgICBuZWdhdGVkW2tdID0gLXRoaXMudmFsdWVzW2tdO1xuICAgIH1cbiAgICByZXR1cm4gY2xvbmUkMSh0aGlzLCB7IHZhbHVlczogbmVnYXRlZCB9LCB0cnVlKTtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IHRoZSB5ZWFycy5cbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cblxuXG4gIC8qKlxuICAgKiBFcXVhbGl0eSBjaGVja1xuICAgKiBUd28gRHVyYXRpb25zIGFyZSBlcXVhbCBpZmYgdGhleSBoYXZlIHRoZSBzYW1lIHVuaXRzIGFuZCB0aGUgc2FtZSB2YWx1ZXMgZm9yIGVhY2ggdW5pdC5cbiAgICogQHBhcmFtIHtEdXJhdGlvbn0gb3RoZXJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIER1cmF0aW9uLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMob3RoZXIpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCB8fCAhb3RoZXIuaXNWYWxpZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5sb2MuZXF1YWxzKG90aGVyLmxvYykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBfaXRlcmF0b3I1ID0gb3JkZXJlZFVuaXRzJDEsIF9pc0FycmF5NSA9IEFycmF5LmlzQXJyYXkoX2l0ZXJhdG9yNSksIF9pNSA9IDAsIF9pdGVyYXRvcjUgPSBfaXNBcnJheTUgPyBfaXRlcmF0b3I1IDogX2l0ZXJhdG9yNVtTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgdmFyIF9yZWY2O1xuXG4gICAgICBpZiAoX2lzQXJyYXk1KSB7XG4gICAgICAgIGlmIChfaTUgPj0gX2l0ZXJhdG9yNS5sZW5ndGgpIGJyZWFrO1xuICAgICAgICBfcmVmNiA9IF9pdGVyYXRvcjVbX2k1KytdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2k1ID0gX2l0ZXJhdG9yNS5uZXh0KCk7XG4gICAgICAgIGlmIChfaTUuZG9uZSkgYnJlYWs7XG4gICAgICAgIF9yZWY2ID0gX2k1LnZhbHVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgdSA9IF9yZWY2O1xuXG4gICAgICBpZiAodGhpcy52YWx1ZXNbdV0gIT09IG90aGVyLnZhbHVlc1t1XSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNyZWF0ZUNsYXNzKER1cmF0aW9uLCBbe1xuICAgIGtleTogJ2xvY2FsZScsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gdGhpcy5sb2MubG9jYWxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgbnVtYmVyaW5nIHN5c3RlbSBvZiBhIER1cmF0aW9uLCBzdWNoICdiZW5nJy4gVGhlIG51bWJlcmluZyBzeXN0ZW0gaXMgdXNlZCB3aGVuIGZvcm1hdHRpbmcgdGhlIER1cmF0aW9uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ251bWJlcmluZ1N5c3RlbScsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gdGhpcy5sb2MubnVtYmVyaW5nU3lzdGVtO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3llYXJzJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQgPyB0aGlzLnZhbHVlcy55ZWFycyB8fCAwIDogTmFOO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgbW9udGhzLlxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnbW9udGhzJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQgPyB0aGlzLnZhbHVlcy5tb250aHMgfHwgMCA6IE5hTjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHdlZWtzXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICd3ZWVrcycsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkID8gdGhpcy52YWx1ZXMud2Vla3MgfHwgMCA6IE5hTjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGRheXMuXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdkYXlzJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQgPyB0aGlzLnZhbHVlcy5kYXlzIHx8IDAgOiBOYU47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBob3Vycy5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2hvdXJzJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQgPyB0aGlzLnZhbHVlcy5ob3VycyB8fCAwIDogTmFOO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgbWludXRlcy5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ21pbnV0ZXMnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCA/IHRoaXMudmFsdWVzLm1pbnV0ZXMgfHwgMCA6IE5hTjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHNlY29uZHMuXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdzZWNvbmRzJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQgPyB0aGlzLnZhbHVlcy5zZWNvbmRzIHx8IDAgOiBOYU47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBtaWxsaXNlY29uZHMuXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdtaWxsaXNlY29uZHMnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCA/IHRoaXMudmFsdWVzLm1pbGxpc2Vjb25kcyB8fCAwIDogTmFOO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2hldGhlciB0aGUgRHVyYXRpb24gaXMgaW52YWxpZC4gSW52YWxpZCBkdXJhdGlvbnMgYXJlIHJldHVybmVkIGJ5IGRpZmYgb3BlcmF0aW9uc1xuICAgICAqIG9uIGludmFsaWQgRGF0ZVRpbWVzIG9yIEludGVydmFscy5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdpc1ZhbGlkJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmludmFsaWRSZWFzb24gPT09IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBleHBsYW5hdGlvbiBvZiB3aHkgdGhpcyBEdXJhdGlvbiBiZWNhbWUgaW52YWxpZCwgb3IgbnVsbCBpZiB0aGUgRHVyYXRpb24gaXMgdmFsaWRcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2ludmFsaWRSZWFzb24nLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW52YWxpZDtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIER1cmF0aW9uO1xufSgpO1xuXG52YXIgSU5WQUxJRCQyID0gJ0ludmFsaWQgSW50ZXJ2YWwnO1xuXG4vLyBjaGVja3MgaWYgdGhlIHN0YXJ0IGlzIGVxdWFsIHRvIG9yIGJlZm9yZSB0aGUgZW5kXG5mdW5jdGlvbiB2YWxpZGF0ZVN0YXJ0RW5kKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuICEhc3RhcnQgJiYgISFlbmQgJiYgc3RhcnQuaXNWYWxpZCAmJiBlbmQuaXNWYWxpZCAmJiBzdGFydCA8PSBlbmQ7XG59XG5cbi8qKlxuICogQW4gSW50ZXJ2YWwgb2JqZWN0IHJlcHJlc2VudHMgYSBoYWxmLW9wZW4gaW50ZXJ2YWwgb2YgdGltZSwgd2hlcmUgZWFjaCBlbmRwb2ludCBpcyBhIHtAbGluayBEYXRlVGltZX0uIENvbmNlcHR1YWxseSwgaXQncyBhIGNvbnRhaW5lciBmb3IgdGhvc2UgdHdvIGVuZHBvaW50cywgYWNjb21wYW5pZWQgYnkgbWV0aG9kcyBmb3IgY3JlYXRpbmcsIHBhcnNpbmcsIGludGVycm9nYXRpbmcsIGNvbXBhcmluZywgdHJhbnNmb3JtaW5nLCBhbmQgZm9ybWF0dGluZyB0aGVtLlxuICpcbiAqIEhlcmUgaXMgYSBicmllZiBvdmVydmlldyBvZiB0aGUgbW9zdCBjb21tb25seSB1c2VkIG1ldGhvZHMgYW5kIGdldHRlcnMgaW4gSW50ZXJ2YWw6XG4gKlxuICogKiAqKkNyZWF0aW9uKiogVG8gY3JlYXRlIGFuIEludGVydmFsLCB1c2Uge0BsaW5rIGZyb21EYXRlVGltZXN9LCB7QGxpbmsgYWZ0ZXJ9LCB7QGxpbmsgYmVmb3JlfSwgb3Ige0BsaW5rIGZyb21JU099LlxuICogKiAqKkFjY2Vzc29ycyoqIFVzZSB7QGxpbmsgc3RhcnR9IGFuZCB7QGxpbmsgZW5kfSB0byBnZXQgdGhlIHN0YXJ0IGFuZCBlbmQuXG4gKiAqICoqSW50ZXJyb2dhdGlvbioqIFRvIGFuYWx5emUgdGhlIEludGVydmFsLCB1c2Uge0BsaW5rIGNvdW50fSwge0BsaW5rIGxlbmd0aH0sIHtAbGluayBoYXNTYW1lfSwge0BsaW5rIGNvbnRhaW5zfSwge0BsaW5rIGlzQWZ0ZXJ9LCBvciB7QGxpbmsgaXNCZWZvcmV9LlxuICogKiAqKlRyYW5zZm9ybWF0aW9uKiogVG8gY3JlYXRlIG90aGVyIEludGVydmFscyBvdXQgb2YgdGhpcyBvbmUsIHVzZSB7QGxpbmsgc2V0fSwge0BsaW5rIHNwbGl0QXR9LCB7QGxpbmsgc3BsaXRCeX0sIHtAbGluayBkaXZpZGVFcXVhbGx5fSwge0BsaW5rIG1lcmdlfSwge0BsaW5rIHhvcn0sIHtAbGluayB1bmlvbn0sIHtAbGluayBpbnRlcnNlY3Rpb259LCBvciB7QGxpbmsgZGlmZmVyZW5jZX0uXG4gKiAqICoqQ29tcGFyaXNvbioqIFRvIGNvbXBhcmUgdGhpcyBJbnRlcnZhbCB0byBhbm90aGVyIG9uZSwgdXNlIHtAbGluayBlcXVhbHN9LCB7QGxpbmsgb3ZlcmxhcHN9LCB7QGxpbmsgYWJ1dHNTdGFydH0sIHtAbGluayBhYnV0c0VuZH0sIHtAbGluayBlbmd1bGZzfVxuICogKiAqKk91dHB1dCoqKiBUbyBjb252ZXJ0IHRoZSBJbnRlcnZhbCBpbnRvIG90aGVyIHJlcHJlc2VudGF0aW9ucywgc2VlIHtAbGluayB0b1N0cmluZ30sIHtAbGluayB0b0lTT30sIHtAbGluayB0b0Zvcm1hdH0sIGFuZCB7QGxpbmsgdG9EdXJhdGlvbn0uXG4gKi9cbnZhciBJbnRlcnZhbCA9IGZ1bmN0aW9uICgpIHtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBJbnRlcnZhbChjb25maWcpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBJbnRlcnZhbCk7XG5cbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnMgPSBjb25maWcuc3RhcnQ7XG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5lID0gY29uZmlnLmVuZDtcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmludmFsaWQgPSBjb25maWcuaW52YWxpZFJlYXNvbiB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBpbnZhbGlkIEludGVydmFsLlxuICAgKiBAcmV0dXJuIHtJbnRlcnZhbH1cbiAgICovXG5cblxuICBJbnRlcnZhbC5pbnZhbGlkID0gZnVuY3Rpb24gaW52YWxpZChyZWFzb24pIHtcbiAgICBpZiAoIXJlYXNvbikge1xuICAgICAgdGhyb3cgbmV3IEludmFsaWRBcmd1bWVudEVycm9yKCduZWVkIHRvIHNwZWNpZnkgYSByZWFzb24gdGhlIERhdGVUaW1lIGlzIGludmFsaWQnKTtcbiAgICB9XG4gICAgaWYgKFNldHRpbmdzLnRocm93T25JbnZhbGlkKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZEludGVydmFsRXJyb3IocmVhc29uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh7IGludmFsaWRSZWFzb246IHJlYXNvbiB9KTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBJbnRlcnZhbCBmcm9tIGEgc3RhcnQgRGF0ZVRpbWUgYW5kIGFuIGVuZCBEYXRlVGltZS4gSW5jbHVzaXZlIG9mIHRoZSBzdGFydCBidXQgbm90IHRoZSBlbmQuXG4gICAqIEBwYXJhbSB7RGF0ZVRpbWV8b2JqZWN0fERhdGV9IHN0YXJ0XG4gICAqIEBwYXJhbSB7RGF0ZVRpbWV8b2JqZWN0fERhdGV9IGVuZFxuICAgKiBAcmV0dXJuIHtJbnRlcnZhbH1cbiAgICovXG5cblxuICBJbnRlcnZhbC5mcm9tRGF0ZVRpbWVzID0gZnVuY3Rpb24gZnJvbURhdGVUaW1lcyhzdGFydCwgZW5kKSB7XG4gICAgdmFyIGJ1aWx0U3RhcnQgPSBVdGlsLmZyaWVuZGx5RGF0ZVRpbWUoc3RhcnQpLFxuICAgICAgICBidWlsdEVuZCA9IFV0aWwuZnJpZW5kbHlEYXRlVGltZShlbmQpO1xuXG4gICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh7XG4gICAgICBzdGFydDogYnVpbHRTdGFydCxcbiAgICAgIGVuZDogYnVpbHRFbmQsXG4gICAgICBpbnZhbGlkUmVhc29uOiB2YWxpZGF0ZVN0YXJ0RW5kKGJ1aWx0U3RhcnQsIGJ1aWx0RW5kKSA/IG51bGwgOiAnaW52YWxpZCBlbmRwb2ludHMnXG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBJbnRlcnZhbCBmcm9tIGEgc3RhcnQgRGF0ZVRpbWUgYW5kIGEgRHVyYXRpb24gdG8gZXh0ZW5kIHRvLlxuICAgKiBAcGFyYW0ge0RhdGVUaW1lfG9iamVjdHxEYXRlfSBzdGFydFxuICAgKiBAcGFyYW0ge0R1cmF0aW9ufG51bWJlcnxvYmplY3R9IGR1cmF0aW9uIC0gdGhlIGxlbmd0aCBvZiB0aGUgSW50ZXJ2YWwuXG4gICAqIEByZXR1cm4ge0ludGVydmFsfVxuICAgKi9cblxuXG4gIEludGVydmFsLmFmdGVyID0gZnVuY3Rpb24gYWZ0ZXIoc3RhcnQsIGR1cmF0aW9uKSB7XG4gICAgdmFyIGR1ciA9IFV0aWwuZnJpZW5kbHlEdXJhdGlvbihkdXJhdGlvbiksXG4gICAgICAgIGR0ID0gVXRpbC5mcmllbmRseURhdGVUaW1lKHN0YXJ0KTtcbiAgICByZXR1cm4gSW50ZXJ2YWwuZnJvbURhdGVUaW1lcyhkdCwgZHQucGx1cyhkdXIpKTtcbiAgfTtcblxuICAvKipcbiAgICogQ3JlYXRlIGFuIEludGVydmFsIGZyb20gYW4gZW5kIERhdGVUaW1lIGFuZCBhIER1cmF0aW9uIHRvIGV4dGVuZCBiYWNrd2FyZHMgdG8uXG4gICAqIEBwYXJhbSB7RGF0ZVRpbWV8b2JqZWN0fERhdGV9IGVuZFxuICAgKiBAcGFyYW0ge0R1cmF0aW9ufG51bWJlcnxvYmplY3R9IGR1cmF0aW9uIC0gdGhlIGxlbmd0aCBvZiB0aGUgSW50ZXJ2YWwuXG4gICAqIEByZXR1cm4ge0ludGVydmFsfVxuICAgKi9cblxuXG4gIEludGVydmFsLmJlZm9yZSA9IGZ1bmN0aW9uIGJlZm9yZShlbmQsIGR1cmF0aW9uKSB7XG4gICAgdmFyIGR1ciA9IFV0aWwuZnJpZW5kbHlEdXJhdGlvbihkdXJhdGlvbiksXG4gICAgICAgIGR0ID0gVXRpbC5mcmllbmRseURhdGVUaW1lKGVuZCk7XG4gICAgcmV0dXJuIEludGVydmFsLmZyb21EYXRlVGltZXMoZHQubWludXMoZHVyKSwgZHQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gSW50ZXJ2YWwgZnJvbSBhbiBJU08gODYwMSBzdHJpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyAtIHRoZSBJU08gc3RyaW5nIHRvIHBhcnNlXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRzIC0gb3B0aW9ucyB0byBwYXNzIHtAc2VlIERhdGVUaW1lLmZyb21JU099XG4gICAqIEByZXR1cm4ge0ludGVydmFsfVxuICAgKi9cblxuXG4gIEludGVydmFsLmZyb21JU08gPSBmdW5jdGlvbiBmcm9tSVNPKHN0cmluZywgb3B0cykge1xuICAgIGlmIChzdHJpbmcpIHtcbiAgICAgIHZhciBfc3RyaW5nJHNwbGl0ID0gc3RyaW5nLnNwbGl0KC9cXC8vKSxcbiAgICAgICAgICBzID0gX3N0cmluZyRzcGxpdFswXSxcbiAgICAgICAgICBlID0gX3N0cmluZyRzcGxpdFsxXTtcblxuICAgICAgaWYgKHMgJiYgZSkge1xuICAgICAgICByZXR1cm4gSW50ZXJ2YWwuZnJvbURhdGVUaW1lcyhEYXRlVGltZS5mcm9tSVNPKHMsIG9wdHMpLCBEYXRlVGltZS5mcm9tSVNPKGUsIG9wdHMpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEludGVydmFsLmludmFsaWQoJ2ludmFsaWQgSVNPIGZvcm1hdCcpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzdGFydCBvZiB0aGUgSW50ZXJ2YWxcbiAgICogQHJldHVybiB7RGF0ZVRpbWV9XG4gICAqL1xuXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGUgSW50ZXJ2YWwgaW4gdGhlIHNwZWNpZmllZCB1bml0LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdW5pdCAtIHRoZSB1bml0IChzdWNoIGFzICdob3Vycycgb3IgJ2RheXMnKSB0byByZXR1cm4gdGhlIGxlbmd0aCBpbi5cbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cbiAgSW50ZXJ2YWwucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uIGxlbmd0aCgpIHtcbiAgICB2YXIgdW5pdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJ21pbGxpc2Vjb25kcyc7XG5cbiAgICByZXR1cm4gdGhpcy5pc1ZhbGlkID8gdGhpcy50b0R1cmF0aW9uLmFwcGx5KHRoaXMsIFt1bml0XSkuZ2V0KHVuaXQpIDogTmFOO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjb3VudCBvZiBtaW51dGVzLCBob3VycywgZGF5cywgbW9udGhzLCBvciB5ZWFycyBpbmNsdWRlZCBpbiB0aGUgSW50ZXJ2YWwsIGV2ZW4gaW4gcGFydC5cbiAgICogVW5saWtlIHtAbGluayBsZW5ndGh9IHRoaXMgY291bnRzIHNlY3Rpb25zIG9mIHRoZSBjYWxlbmRhciwgbm90IHBlcmlvZHMgb2YgdGltZSwgZS5nLiBzcGVjaWZ5aW5nICdkYXknXG4gICAqIGFza3MgJ3doYXQgZGF0ZXMgYXJlIGluY2x1ZGVkIGluIHRoaXMgaW50ZXJ2YWw/Jywgbm90ICdob3cgbWFueSBkYXlzIGxvbmcgaXMgdGhpcyBpbnRlcnZhbD8nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbdW5pdD0nbWlsbGlzZWNvbmRzJ10gLSB0aGUgdW5pdCBvZiB0aW1lIHRvIGNvdW50LlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAqL1xuXG5cbiAgSW50ZXJ2YWwucHJvdG90eXBlLmNvdW50ID0gZnVuY3Rpb24gY291bnQoKSB7XG4gICAgdmFyIHVuaXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICdtaWxsaXNlY29uZHMnO1xuXG4gICAgaWYgKCF0aGlzLmlzVmFsaWQpIHJldHVybiBOYU47XG4gICAgdmFyIHN0YXJ0ID0gdGhpcy5zdGFydC5zdGFydE9mKHVuaXQpLFxuICAgICAgICBlbmQgPSB0aGlzLmVuZC5zdGFydE9mKHVuaXQpO1xuICAgIHJldHVybiBNYXRoLmZsb29yKGVuZC5kaWZmKHN0YXJ0LCB1bml0KS5nZXQodW5pdCkpICsgMTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIHRoaXMgSW50ZXJ2YWwncyBzdGFydCBhbmQgZW5kIGFyZSBib3RoIGluIHRoZSBzYW1lIHVuaXQgb2YgdGltZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdW5pdCAtIHRoZSB1bml0IG9mIHRpbWUgdG8gY2hlY2sgc2FtZW5lc3Mgb25cbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG5cblxuICBJbnRlcnZhbC5wcm90b3R5cGUuaGFzU2FtZSA9IGZ1bmN0aW9uIGhhc1NhbWUodW5pdCkge1xuICAgIHJldHVybiB0aGlzLmlzVmFsaWQgPyB0aGlzLmUubWludXMoMSkuaGFzU2FtZSh0aGlzLnMsIHVuaXQpIDogZmFsc2U7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybiB3aGV0aGVyIHRoaXMgSW50ZXJ2YWwgaGFzIHRoZSBzYW1lIHN0YXJ0IGFuZCBlbmQgRGF0ZVRpbWVzLlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cblxuXG4gIEludGVydmFsLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5zLnZhbHVlT2YoKSA9PT0gdGhpcy5lLnZhbHVlT2YoKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJuIHdoZXRoZXIgdGhpcyBJbnRlcnZhbCdzIHN0YXJ0IGlzIGFmdGVyIHRoZSBzcGVjaWZpZWQgRGF0ZVRpbWUuXG4gICAqIEBwYXJhbSB7RGF0ZVRpbWV9IGRhdGVUaW1lXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuXG5cbiAgSW50ZXJ2YWwucHJvdG90eXBlLmlzQWZ0ZXIgPSBmdW5jdGlvbiBpc0FmdGVyKGRhdGVUaW1lKSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdGhpcy5zID4gZGF0ZVRpbWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybiB3aGV0aGVyIHRoaXMgSW50ZXJ2YWwncyBlbmQgaXMgYmVmb3JlIHRoZSBzcGVjaWZpZWQgRGF0ZVRpbWUuXG4gICAqIEBwYXJhbSB7RGF0ZXRpbWV9IGRhdGVUaW1lXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuXG5cbiAgSW50ZXJ2YWwucHJvdG90eXBlLmlzQmVmb3JlID0gZnVuY3Rpb24gaXNCZWZvcmUoZGF0ZVRpbWUpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0aGlzLmUucGx1cygxKSA8IGRhdGVUaW1lO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gd2hldGhlciB0aGlzIEludGVydmFsIGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgRGF0ZVRpbWUuXG4gICAqIEBwYXJhbSB7RGF0ZVRpbWV9IGRhdGVUaW1lXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuXG5cbiAgSW50ZXJ2YWwucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gY29udGFpbnMoZGF0ZVRpbWUpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0aGlzLnMgPD0gZGF0ZVRpbWUgJiYgdGhpcy5lID4gZGF0ZVRpbWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIFwiU2V0c1wiIHRoZSBzdGFydCBhbmQvb3IgZW5kIGRhdGVzLiBSZXR1cm5zIGEgbmV3bHktY29uc3RydWN0ZWQgSW50ZXJ2YWwuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZXMgLSB0aGUgdmFsdWVzIHRvIHNldFxuICAgKiBAcGFyYW0ge0RhdGVUaW1lfSB2YWx1ZXMuc3RhcnQgLSB0aGUgc3RhcnRpbmcgRGF0ZVRpbWVcbiAgICogQHBhcmFtIHtEYXRlVGltZX0gdmFsdWVzLmVuZCAtIHRoZSBlbmRpbmcgRGF0ZVRpbWVcbiAgICogQHJldHVybiB7SW50ZXJ2YWx9XG4gICAqL1xuXG5cbiAgSW50ZXJ2YWwucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldCQkMSgpIHtcbiAgICB2YXIgX3JlZiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge30sXG4gICAgICAgIHN0YXJ0ID0gX3JlZi5zdGFydCxcbiAgICAgICAgZW5kID0gX3JlZi5lbmQ7XG5cbiAgICBpZiAoIXRoaXMuaXNWYWxpZCkgcmV0dXJuIHRoaXM7XG4gICAgcmV0dXJuIEludGVydmFsLmZyb21EYXRlVGltZXMoc3RhcnQgfHwgdGhpcy5zLCBlbmQgfHwgdGhpcy5lKTtcbiAgfTtcblxuICAvKipcbiAgICogU3BsaXQgdGhpcyBJbnRlcnZhbCBhdCBlYWNoIG9mIHRoZSBzcGVjaWZpZWQgRGF0ZVRpbWVzXG4gICAqIEBwYXJhbSB7Li4uRGF0ZVRpbWVzfSBkYXRlVGltZXMgLSB0aGUgdW5pdCBvZiB0aW1lIHRvIGNvdW50LlxuICAgKiBAcmV0dXJuIHtbSW50ZXJ2YWxdfVxuICAgKi9cblxuXG4gIEludGVydmFsLnByb3RvdHlwZS5zcGxpdEF0ID0gZnVuY3Rpb24gc3BsaXRBdCgpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCkgcmV0dXJuIFtdO1xuXG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGRhdGVUaW1lcyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgZGF0ZVRpbWVzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHZhciBzb3J0ZWQgPSBkYXRlVGltZXMubWFwKFV0aWwuZnJpZW5kbHlEYXRlVGltZSkuc29ydCgpLFxuICAgICAgICByZXN1bHRzID0gW107XG4gICAgdmFyIHMgPSB0aGlzLnMsXG4gICAgICAgIGkgPSAwO1xuXG5cbiAgICB3aGlsZSAocyA8IHRoaXMuZSkge1xuICAgICAgdmFyIGFkZGVkID0gc29ydGVkW2ldIHx8IHRoaXMuZSxcbiAgICAgICAgICBuZXh0ID0gK2FkZGVkID4gK3RoaXMuZSA/IHRoaXMuZSA6IGFkZGVkO1xuICAgICAgcmVzdWx0cy5wdXNoKEludGVydmFsLmZyb21EYXRlVGltZXMocywgbmV4dCkpO1xuICAgICAgcyA9IG5leHQ7XG4gICAgICBpICs9IDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNwbGl0IHRoaXMgSW50ZXJ2YWwgaW50byBzbWFsbGVyIEludGVydmFscywgZWFjaCBvZiB0aGUgc3BlY2lmaWVkIGxlbmd0aC5cbiAgICogTGVmdCBvdmVyIHRpbWUgaXMgZ3JvdXBlZCBpbnRvIGEgc21hbGxlciBpbnRlcnZhbFxuICAgKiBAcGFyYW0ge0R1cmF0aW9ufG51bWJlcnxvYmplY3R9IGR1cmF0aW9uIC0gVGhlIGxlbmd0aCBvZiBlYWNoIHJlc3VsdGluZyBpbnRlcnZhbC5cbiAgICogQHJldHVybiB7W0ludGVydmFsXX1cbiAgICovXG5cblxuICBJbnRlcnZhbC5wcm90b3R5cGUuc3BsaXRCeSA9IGZ1bmN0aW9uIHNwbGl0QnkoZHVyYXRpb24pIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCkgcmV0dXJuIFtdO1xuICAgIHZhciBkdXIgPSBVdGlsLmZyaWVuZGx5RHVyYXRpb24oZHVyYXRpb24pLFxuICAgICAgICByZXN1bHRzID0gW107XG4gICAgdmFyIHMgPSB0aGlzLnMsXG4gICAgICAgIGFkZGVkID0gdm9pZCAwLFxuICAgICAgICBuZXh0ID0gdm9pZCAwO1xuXG5cbiAgICB3aGlsZSAocyA8IHRoaXMuZSkge1xuICAgICAgYWRkZWQgPSBzLnBsdXMoZHVyKTtcbiAgICAgIG5leHQgPSArYWRkZWQgPiArdGhpcy5lID8gdGhpcy5lIDogYWRkZWQ7XG4gICAgICByZXN1bHRzLnB1c2goSW50ZXJ2YWwuZnJvbURhdGVUaW1lcyhzLCBuZXh0KSk7XG4gICAgICBzID0gbmV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvKipcbiAgICogU3BsaXQgdGhpcyBJbnRlcnZhbCBpbnRvIHRoZSBzcGVjaWZpZWQgbnVtYmVyIG9mIHNtYWxsZXIgaW50ZXJ2YWxzLlxuICAgKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyT2ZQYXJ0cyAtIFRoZSBudW1iZXIgb2YgSW50ZXJ2YWxzIHRvIGRpdmlkZSB0aGUgSW50ZXJ2YWwgaW50by5cbiAgICogQHJldHVybiB7W0ludGVydmFsXX1cbiAgICovXG5cblxuICBJbnRlcnZhbC5wcm90b3R5cGUuZGl2aWRlRXF1YWxseSA9IGZ1bmN0aW9uIGRpdmlkZUVxdWFsbHkobnVtYmVyT2ZQYXJ0cykge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKSByZXR1cm4gW107XG4gICAgcmV0dXJuIHRoaXMuc3BsaXRCeSh0aGlzLmxlbmd0aCgpIC8gbnVtYmVyT2ZQYXJ0cykuc2xpY2UoMCwgbnVtYmVyT2ZQYXJ0cyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybiB3aGV0aGVyIHRoaXMgSW50ZXJ2YWwgb3ZlcmxhcHMgd2l0aCB0aGUgc3BlY2lmaWVkIEludGVydmFsXG4gICAqIEBwYXJhbSB7SW50ZXJ2YWx9IG90aGVyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuXG5cbiAgSW50ZXJ2YWwucHJvdG90eXBlLm92ZXJsYXBzID0gZnVuY3Rpb24gb3ZlcmxhcHMob3RoZXIpIHtcbiAgICByZXR1cm4gdGhpcy5lID4gb3RoZXIucyAmJiB0aGlzLnMgPCBvdGhlci5lO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gd2hldGhlciB0aGlzIEludGVydmFsJ3MgZW5kIGlzIGFkamFjZW50IHRvIHRoZSBzcGVjaWZpZWQgSW50ZXJ2YWwncyBzdGFydC5cbiAgICogQHBhcmFtIHtJbnRlcnZhbH0gb3RoZXJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG5cblxuICBJbnRlcnZhbC5wcm90b3R5cGUuYWJ1dHNTdGFydCA9IGZ1bmN0aW9uIGFidXRzU3RhcnQob3RoZXIpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiArdGhpcy5lID09PSArb3RoZXIucztcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJuIHdoZXRoZXIgdGhpcyBJbnRlcnZhbCdzIHN0YXJ0IGlzIGFkamFjZW50IHRvIHRoZSBzcGVjaWZpZWQgSW50ZXJ2YWwncyBlbmQuXG4gICAqIEBwYXJhbSB7SW50ZXJ2YWx9IG90aGVyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuXG5cbiAgSW50ZXJ2YWwucHJvdG90eXBlLmFidXRzRW5kID0gZnVuY3Rpb24gYWJ1dHNFbmQob3RoZXIpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiArb3RoZXIuZSA9PT0gK3RoaXMucztcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJuIHdoZXRoZXIgdGhpcyBJbnRlcnZhbCBlbmd1bGZzIHRoZSBzdGFydCBhbmQgZW5kIG9mIHRoZSBzcGVjaWZpZWQgSW50ZXJ2YWwuXG4gICAqIEBwYXJhbSB7SW50ZXJ2YWx9IG90aGVyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuXG5cbiAgSW50ZXJ2YWwucHJvdG90eXBlLmVuZ3VsZnMgPSBmdW5jdGlvbiBlbmd1bGZzKG90aGVyKSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdGhpcy5zIDw9IG90aGVyLnMgJiYgdGhpcy5lID49IG90aGVyLmU7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybiB3aGV0aGVyIHRoaXMgSW50ZXJ2YWwgaGFzIHRoZSBzYW1lIHN0YXJ0IGFuZCBlbmQgYXMgdGhlIHNwZWNpZmllZCBJbnRlcnZhbC5cbiAgICogQHBhcmFtIHtJbnRlcnZhbH0gb3RoZXJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG5cblxuICBJbnRlcnZhbC5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gZXF1YWxzKG90aGVyKSB7XG4gICAgcmV0dXJuIHRoaXMucy5lcXVhbHMob3RoZXIucykgJiYgdGhpcy5lLmVxdWFscyhvdGhlci5lKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJuIGFuIEludGVydmFsIHJlcHJlc2VudGluZyB0aGUgaW50ZXJzZWN0aW9uIG9mIHRoaXMgSW50ZXJ2YWwgYW5kIHRoZSBzcGVjaWZpZWQgSW50ZXJ2YWwuXG4gICAqIFNwZWNpZmljYWxseSwgdGhlIHJlc3VsdGluZyBJbnRlcnZhbCBoYXMgdGhlIG1heGltdW0gc3RhcnQgdGltZSBhbmQgdGhlIG1pbmltdW0gZW5kIHRpbWUgb2YgdGhlIHR3byBJbnRlcnZhbHMuXG4gICAqIFJldHVybnMgbnVsbCBpZiB0aGUgaW50ZXJzZWN0aW9uIGlzIGVtcHR5LCBpLmUuLCB0aGUgaW50ZXJ2YWxzIGRvbid0IGludGVyc2VjdC5cbiAgICogQHBhcmFtIHtJbnRlcnZhbH0gb3RoZXJcbiAgICogQHJldHVybiB7SW50ZXJ2YWx9XG4gICAqL1xuXG5cbiAgSW50ZXJ2YWwucHJvdG90eXBlLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uIGludGVyc2VjdGlvbihvdGhlcikge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKSByZXR1cm4gdGhpcztcbiAgICB2YXIgcyA9IHRoaXMucyA+IG90aGVyLnMgPyB0aGlzLnMgOiBvdGhlci5zLFxuICAgICAgICBlID0gdGhpcy5lIDwgb3RoZXIuZSA/IHRoaXMuZSA6IG90aGVyLmU7XG5cbiAgICBpZiAocyA+IGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gSW50ZXJ2YWwuZnJvbURhdGVUaW1lcyhzLCBlKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbiBJbnRlcnZhbCByZXByZXNlbnRpbmcgdGhlIHVuaW9uIG9mIHRoaXMgSW50ZXJ2YWwgYW5kIHRoZSBzcGVjaWZpZWQgSW50ZXJ2YWwuXG4gICAqIFNwZWNpZmljYWxseSwgdGhlIHJlc3VsdGluZyBJbnRlcnZhbCBoYXMgdGhlIG1pbmltdW0gc3RhcnQgdGltZSBhbmQgdGhlIG1heGltdW0gZW5kIHRpbWUgb2YgdGhlIHR3byBJbnRlcnZhbHMuXG4gICAqIEBwYXJhbSB7SW50ZXJ2YWx9IG90aGVyXG4gICAqIEByZXR1cm4ge0ludGVydmFsfVxuICAgKi9cblxuXG4gIEludGVydmFsLnByb3RvdHlwZS51bmlvbiA9IGZ1bmN0aW9uIHVuaW9uKG90aGVyKSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQpIHJldHVybiB0aGlzO1xuICAgIHZhciBzID0gdGhpcy5zIDwgb3RoZXIucyA/IHRoaXMucyA6IG90aGVyLnMsXG4gICAgICAgIGUgPSB0aGlzLmUgPiBvdGhlci5lID8gdGhpcy5lIDogb3RoZXIuZTtcbiAgICByZXR1cm4gSW50ZXJ2YWwuZnJvbURhdGVUaW1lcyhzLCBlKTtcbiAgfTtcblxuICAvKipcbiAgICogTWVyZ2UgYW4gYXJyYXkgb2YgSW50ZXJ2YWxzIGludG8gYSBlcXVpdmFsZW50IG1pbmltYWwgc2V0IG9mIEludGVydmFscy5cbiAgICogQ29tYmluZXMgb3ZlcmxhcHBpbmcgYW5kIGFkamFjZW50IEludGVydmFscy5cbiAgICogQHBhcmFtIHtbSW50ZXJ2YWxdfSBpbnRlcnZhbHNcbiAgICogQHJldHVybiB7W0ludGVydmFsXX1cbiAgICovXG5cblxuICBJbnRlcnZhbC5tZXJnZSA9IGZ1bmN0aW9uIG1lcmdlKGludGVydmFscykge1xuICAgIHZhciBfaW50ZXJ2YWxzJHNvcnQkcmVkdWMgPSBpbnRlcnZhbHMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGEucyAtIGIucztcbiAgICB9KS5yZWR1Y2UoZnVuY3Rpb24gKF9yZWYyLCBpdGVtKSB7XG4gICAgICB2YXIgc29mYXIgPSBfcmVmMlswXSxcbiAgICAgICAgICBjdXJyZW50ID0gX3JlZjJbMV07XG5cbiAgICAgIGlmICghY3VycmVudCkge1xuICAgICAgICByZXR1cm4gW3NvZmFyLCBpdGVtXTtcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudC5vdmVybGFwcyhpdGVtKSB8fCBjdXJyZW50LmFidXRzU3RhcnQoaXRlbSkpIHtcbiAgICAgICAgcmV0dXJuIFtzb2ZhciwgY3VycmVudC51bmlvbihpdGVtKV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW3NvZmFyLmNvbmNhdChbY3VycmVudF0pLCBpdGVtXTtcbiAgICAgIH1cbiAgICB9LCBbW10sIG51bGxdKSxcbiAgICAgICAgZm91bmQgPSBfaW50ZXJ2YWxzJHNvcnQkcmVkdWNbMF0sXG4gICAgICAgIGZpbmFsID0gX2ludGVydmFscyRzb3J0JHJlZHVjWzFdO1xuXG4gICAgaWYgKGZpbmFsKSB7XG4gICAgICBmb3VuZC5wdXNoKGZpbmFsKTtcbiAgICB9XG4gICAgcmV0dXJuIGZvdW5kO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gYW4gYXJyYXkgb2YgSW50ZXJ2YWxzIHJlcHJlc2VudGluZyB0aGUgc3BhbnMgb2YgdGltZSB0aGF0IG9ubHkgYXBwZWFyIGluIG9uZSBvZiB0aGUgc3BlY2lmaWVkIEludGVydmFscy5cbiAgICogQHBhcmFtIHtbSW50ZXJ2YWxdfSBpbnRlcnZhbHNcbiAgICogQHJldHVybiB7W0ludGVydmFsXX1cbiAgICovXG5cblxuICBJbnRlcnZhbC54b3IgPSBmdW5jdGlvbiB4b3IoaW50ZXJ2YWxzKSB7XG4gICAgdmFyIF9BcnJheSRwcm90b3R5cGU7XG5cbiAgICB2YXIgc3RhcnQgPSBudWxsLFxuICAgICAgICBjdXJyZW50Q291bnQgPSAwO1xuICAgIHZhciByZXN1bHRzID0gW10sXG4gICAgICAgIGVuZHMgPSBpbnRlcnZhbHMubWFwKGZ1bmN0aW9uIChpKSB7XG4gICAgICByZXR1cm4gW3sgdGltZTogaS5zLCB0eXBlOiAncycgfSwgeyB0aW1lOiBpLmUsIHR5cGU6ICdlJyB9XTtcbiAgICB9KSxcbiAgICAgICAgZmxhdHRlbmVkID0gKF9BcnJheSRwcm90b3R5cGUgPSBBcnJheS5wcm90b3R5cGUpLmNvbmNhdC5hcHBseShfQXJyYXkkcHJvdG90eXBlLCBlbmRzKSxcbiAgICAgICAgYXJyID0gZmxhdHRlbmVkLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBhLnRpbWUgLSBiLnRpbWU7XG4gICAgfSk7XG5cbiAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSBhcnIsIF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheShfaXRlcmF0b3IpLCBfaSA9IDAsIF9pdGVyYXRvciA9IF9pc0FycmF5ID8gX2l0ZXJhdG9yIDogX2l0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICB2YXIgX3JlZjM7XG5cbiAgICAgIGlmIChfaXNBcnJheSkge1xuICAgICAgICBpZiAoX2kgPj0gX2l0ZXJhdG9yLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgIF9yZWYzID0gX2l0ZXJhdG9yW19pKytdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2kgPSBfaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICBpZiAoX2kuZG9uZSkgYnJlYWs7XG4gICAgICAgIF9yZWYzID0gX2kudmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBpID0gX3JlZjM7XG5cbiAgICAgIGN1cnJlbnRDb3VudCArPSBpLnR5cGUgPT09ICdzJyA/IDEgOiAtMTtcblxuICAgICAgaWYgKGN1cnJlbnRDb3VudCA9PT0gMSkge1xuICAgICAgICBzdGFydCA9IGkudGltZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzdGFydCAmJiArc3RhcnQgIT09ICtpLnRpbWUpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2goSW50ZXJ2YWwuZnJvbURhdGVUaW1lcyhzdGFydCwgaS50aW1lKSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIEludGVydmFsLm1lcmdlKHJlc3VsdHMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gYW4gSW50ZXJ2YWwgcmVwcmVzZW50aW5nIHRoZSBzcGFuIG9mIHRpbWUgaW4gdGhpcyBJbnRlcnZhbCB0aGF0IGRvZXNuJ3Qgb3ZlcmxhcCB3aXRoIGFueSBvZiB0aGUgc3BlY2lmaWVkIEludGVydmFscy5cbiAgICogQHBhcmFtIHsuLi5JbnRlcnZhbH0gaW50ZXJ2YWxzXG4gICAqIEByZXR1cm4ge0ludGVydmFsfVxuICAgKi9cblxuXG4gIEludGVydmFsLnByb3RvdHlwZS5kaWZmZXJlbmNlID0gZnVuY3Rpb24gZGlmZmVyZW5jZSgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBpbnRlcnZhbHMgPSBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgaW50ZXJ2YWxzW19rZXkyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgfVxuXG4gICAgcmV0dXJuIEludGVydmFsLnhvcihbdGhpc10uY29uY2F0KGludGVydmFscykpLm1hcChmdW5jdGlvbiAoaSkge1xuICAgICAgcmV0dXJuIF90aGlzLmludGVyc2VjdGlvbihpKTtcbiAgICB9KS5maWx0ZXIoZnVuY3Rpb24gKGkpIHtcbiAgICAgIHJldHVybiBpICYmICFpLmlzRW1wdHkoKTtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIEludGVydmFsIGFwcHJvcHJpYXRlIGZvciBkZWJ1Z2dpbmcuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG5cblxuICBJbnRlcnZhbC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCkgcmV0dXJuIElOVkFMSUQkMjtcbiAgICByZXR1cm4gJ1snICsgdGhpcy5zLnRvSVNPKCkgKyAnIFxcdTIwMTMgJyArIHRoaXMuZS50b0lTTygpICsgJyknO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgSW50ZXJ2YWwgYXBwcm9wcmlhdGUgZm9yIHRoZSBSRVBMLlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuXG5cbiAgSW50ZXJ2YWwucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0KCkge1xuICAgIGlmICh0aGlzLmlzVmFsaWQpIHtcbiAgICAgIHJldHVybiAnSW50ZXJ2YWwge1xcbiAgc3RhcnQ6ICcgKyB0aGlzLnN0YXJ0LnRvSVNPKCkgKyAnLFxcbiAgZW5kOiAnICsgdGhpcy5lbmQudG9JU08oKSArICcsXFxuICB6b25lOiAgICcgKyB0aGlzLnN0YXJ0LnpvbmUubmFtZSArICcsXFxuICBsb2NhbGU6ICAgJyArIHRoaXMuc3RhcnQubG9jYWxlICsgJyB9JztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdJbnRlcnZhbCB7IEludmFsaWQsIHJlYXNvbjogJyArIHRoaXMuaW52YWxpZFJlYXNvbiArICcgfSc7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIElTTyA4NjAxLWNvbXBsaWFudCBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBJbnRlcnZhbC5cbiAgICogQHNlZSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JU09fODYwMSNUaW1lX2ludGVydmFsc1xuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0cyAtIFRoZSBzYW1lIG9wdGlvbnMgYXMge0BsaW5rIERhdGVUaW1lLnRvSVNPfVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuXG5cbiAgSW50ZXJ2YWwucHJvdG90eXBlLnRvSVNPID0gZnVuY3Rpb24gdG9JU08ob3B0cykge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKSByZXR1cm4gSU5WQUxJRCQyO1xuICAgIHJldHVybiB0aGlzLnMudG9JU08ob3B0cykgKyAnLycgKyB0aGlzLmUudG9JU08ob3B0cyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBJbnRlcnZhbCBmb3JtYXR0ZWQgYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpZWQgZm9ybWF0IHN0cmluZy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRhdGVGb3JtYXQgLSB0aGUgZm9ybWF0IHN0cmluZy4gVGhpcyBzdHJpbmcgZm9ybWF0cyB0aGUgc3RhcnQgYW5kIGVuZCB0aW1lLiBTZWUge0BsaW5rIERhdGVUaW1lLnRvRm9ybWF0fSBmb3IgZGV0YWlscy5cbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdHMgLSBvcHRpb25zXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5zZXBhcmF0b3IgPSAgJyDigJMgJ10gLSBhIHNlcGFyYXRvciB0byBwbGFjZSBiZXR3ZWVuIHRoZSBzdGFydCBhbmQgZW5kIHJlcHJlc2VudGF0aW9uc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuXG5cbiAgSW50ZXJ2YWwucHJvdG90eXBlLnRvRm9ybWF0ID0gZnVuY3Rpb24gdG9Gb3JtYXQoZGF0ZUZvcm1hdCkge1xuICAgIHZhciBfcmVmNCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge30sXG4gICAgICAgIF9yZWY0JHNlcGFyYXRvciA9IF9yZWY0LnNlcGFyYXRvcixcbiAgICAgICAgc2VwYXJhdG9yID0gX3JlZjQkc2VwYXJhdG9yID09PSB1bmRlZmluZWQgPyAnIOKAkyAnIDogX3JlZjQkc2VwYXJhdG9yO1xuXG4gICAgaWYgKCF0aGlzLmlzVmFsaWQpIHJldHVybiBJTlZBTElEJDI7XG4gICAgcmV0dXJuICcnICsgdGhpcy5zLnRvRm9ybWF0KGRhdGVGb3JtYXQpICsgc2VwYXJhdG9yICsgdGhpcy5lLnRvRm9ybWF0KGRhdGVGb3JtYXQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBEdXJhdGlvbiByZXByZXNlbnRpbmcgdGhlIHRpbWUgc3Bhbm5lZCBieSB0aGlzIGludGVydmFsLlxuICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gW3VuaXQ9WydtaWxsaXNlY29uZHMnXV0gLSB0aGUgdW5pdCBvciB1bml0cyAoc3VjaCBhcyAnaG91cnMnIG9yICdkYXlzJykgdG8gaW5jbHVkZSBpbiB0aGUgZHVyYXRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIC0gb3B0aW9ucyB0aGF0IGFmZmVjdCB0aGUgY3JlYXRpb24gb2YgdGhlIER1cmF0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5jb252ZXJzaW9uQWNjdXJhY3k9J2Nhc3VhbCddIC0gdGhlIGNvbnZlcnNpb24gc3lzdGVtIHRvIHVzZVxuICAgKiBAZXhhbXBsZSBJbnRlcnZhbC5mcm9tRGF0ZVRpbWVzKGR0MSwgZHQyKS50b0R1cmF0aW9uKCkudG9PYmplY3QoKSAvLz0+IHsgbWlsbGlzZWNvbmRzOiA4ODQ4OTI1NyB9XG4gICAqIEBleGFtcGxlIEludGVydmFsLmZyb21EYXRlVGltZXMoZHQxLCBkdDIpLnRvRHVyYXRpb24oJ2RheXMnKS50b09iamVjdCgpIC8vPT4geyBkYXlzOiAxLjAyNDE4MTIxNTI3Nzc3NzggfVxuICAgKiBAZXhhbXBsZSBJbnRlcnZhbC5mcm9tRGF0ZVRpbWVzKGR0MSwgZHQyKS50b0R1cmF0aW9uKFsnaG91cnMnLCAnbWludXRlcyddKS50b09iamVjdCgpIC8vPT4geyBob3VyczogMjQsIG1pbnV0ZXM6IDM0LjgyMDk1IH1cbiAgICogQGV4YW1wbGUgSW50ZXJ2YWwuZnJvbURhdGVUaW1lcyhkdDEsIGR0MikudG9EdXJhdGlvbihbJ2hvdXJzJywgJ21pbnV0ZXMnLCAnc2Vjb25kcyddKS50b09iamVjdCgpIC8vPT4geyBob3VyczogMjQsIG1pbnV0ZXM6IDM0LCBzZWNvbmRzOiA0OS4yNTcgfVxuICAgKiBAZXhhbXBsZSBJbnRlcnZhbC5mcm9tRGF0ZVRpbWVzKGR0MSwgZHQyKS50b0R1cmF0aW9uKCdzZWNvbmRzJykudG9PYmplY3QoKSAvLz0+IHsgc2Vjb25kczogODg0ODkuMjU3IH1cbiAgICogQHJldHVybiB7RHVyYXRpb259XG4gICAqL1xuXG5cbiAgSW50ZXJ2YWwucHJvdG90eXBlLnRvRHVyYXRpb24gPSBmdW5jdGlvbiB0b0R1cmF0aW9uKHVuaXQsIG9wdHMpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCkge1xuICAgICAgcmV0dXJuIER1cmF0aW9uLmludmFsaWQodGhpcy5pbnZhbGlkUmVhc29uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZS5kaWZmKHRoaXMucywgdW5pdCwgb3B0cyk7XG4gIH07XG5cbiAgY3JlYXRlQ2xhc3MoSW50ZXJ2YWwsIFt7XG4gICAga2V5OiAnc3RhcnQnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCA/IHRoaXMucyA6IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZW5kIG9mIHRoZSBJbnRlcnZhbFxuICAgICAqIEByZXR1cm4ge0RhdGVUaW1lfVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdlbmQnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCA/IHRoaXMuZSA6IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIHRoaXMgSW50ZXJ2YWwncyBlbmQgaXMgYXQgbGVhc3QgaXRzIHN0YXJ0LCBpLmUuIHRoYXQgdGhlIEludGVydmFsIGlzbid0ICdiYWNrd2FyZHMnLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2lzVmFsaWQnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW52YWxpZFJlYXNvbiA9PT0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGV4cGxhbmF0aW9uIG9mIHdoeSB0aGlzIEludGVydmFsIGJlY2FtZSBpbnZhbGlkLCBvciBudWxsIGlmIHRoZSBJbnRlcnZhbCBpcyB2YWxpZFxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnaW52YWxpZFJlYXNvbicsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnZhbGlkO1xuICAgIH1cbiAgfV0pO1xuICByZXR1cm4gSW50ZXJ2YWw7XG59KCk7XG5cbi8qKlxuICogVGhlIEluZm8gY2xhc3MgY29udGFpbnMgc3RhdGljIG1ldGhvZHMgZm9yIHJldHJpZXZpbmcgZ2VuZXJhbCB0aW1lIGFuZCBkYXRlIHJlbGF0ZWQgZGF0YS4gRm9yIGV4YW1wbGUsIGl0IGhhcyBtZXRob2RzIGZvciBmaW5kaW5nIG91dCBpZiBhIHRpbWUgem9uZSBoYXMgYSBEU1QsIGZvciBsaXN0aW5nIHRoZSBtb250aHMgaW4gYW55IHN1cHBvcnRlZCBsb2NhbGUsIGFuZCBmb3IgZGlzY292ZXJpbmcgd2hpY2ggb2YgTHV4b24gZmVhdHVyZXMgYXJlIGF2YWlsYWJsZSBpbiB0aGUgY3VycmVudCBlbnZpcm9ubWVudC5cbiAqL1xudmFyIEluZm8gPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEluZm8oKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgSW5mbyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHdoZXRoZXIgdGhlIHNwZWNpZmllZCB6b25lIGNvbnRhaW5zIGEgRFNULlxuICAgKiBAcGFyYW0ge3N0cmluZ3xab25lfSBbem9uZT0nbG9jYWwnXSAtIFpvbmUgdG8gY2hlY2suIERlZmF1bHRzIHRvIHRoZSBlbnZpcm9ubWVudCdzIGxvY2FsIHpvbmUuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBJbmZvLmhhc0RTVCA9IGZ1bmN0aW9uIGhhc0RTVCgpIHtcbiAgICB2YXIgem9uZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogU2V0dGluZ3MuZGVmYXVsdFpvbmU7XG5cbiAgICB2YXIgcHJvdG8gPSBEYXRlVGltZS5sb2NhbCgpLnNldFpvbmUoem9uZSkuc2V0KHsgbW9udGg6IDEyIH0pO1xuXG4gICAgcmV0dXJuICF6b25lLnVuaXZlcnNhbCAmJiBwcm90by5vZmZzZXQgIT09IHByb3RvLnNldCh7IG1vbnRoOiA2IH0pLm9mZnNldDtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJuIHdoZXRoZXIgdGhlIHNwZWNpZmllZCB6b25lIGlzIGEgdmFsaWQgSUFOQSBzcGVjaWZpZXIuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB6b25lIC0gWm9uZSB0byBjaGVja1xuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cblxuXG4gIEluZm8uaXNWYWxpZElBTkFab25lID0gZnVuY3Rpb24gaXNWYWxpZElBTkFab25lKHpvbmUpIHtcbiAgICByZXR1cm4gISFJQU5BWm9uZS5pc1ZhbGlkU3BlY2lmaWVyKHpvbmUpICYmIElBTkFab25lLmlzVmFsaWRab25lKHpvbmUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gYW4gYXJyYXkgb2Ygc3RhbmRhbG9uZSBtb250aCBuYW1lcy5cbiAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9EYXRlVGltZUZvcm1hdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2xlbmd0aD0nbG9uZyddIC0gdGhlIGxlbmd0aCBvZiB0aGUgbW9udGggcmVwcmVzZW50YXRpb24sIHN1Y2ggYXMgXCJudW1lcmljXCIsIFwiMi1kaWdpdFwiLCBcIm5hcnJvd1wiLCBcInNob3J0XCIsIFwibG9uZ1wiXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRzIC0gb3B0aW9uc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMubG9jYWxlXSAtIHRoZSBsb2NhbGUgY29kZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMubnVtYmVyaW5nU3lzdGVtPW51bGxdIC0gdGhlIG51bWJlcmluZyBzeXN0ZW1cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLm91dHB1dENhbGVuZGFyPSdncmVnb3J5J10gLSB0aGUgY2FsZW5kYXJcbiAgICogQGV4YW1wbGUgSW5mby5tb250aHMoKVswXSAvLz0+ICdKYW51YXJ5J1xuICAgKiBAZXhhbXBsZSBJbmZvLm1vbnRocygnc2hvcnQnKVswXSAvLz0+ICdKYW4nXG4gICAqIEBleGFtcGxlIEluZm8ubW9udGhzKCdudW1lcmljJylbMF0gLy89PiAnMSdcbiAgICogQGV4YW1wbGUgSW5mby5tb250aHMoJ3Nob3J0JywgeyBsb2NhbGU6ICdmci1DQScgfSApWzBdIC8vPT4gJ2phbnYuJ1xuICAgKiBAZXhhbXBsZSBJbmZvLm1vbnRocygnbnVtZXJpYycsIHsgbG9jYWxlOiAnYXInIH0pWzBdIC8vPT4gJ9mhJ1xuICAgKiBAZXhhbXBsZSBJbmZvLm1vbnRocygnbG9uZycsIHsgb3V0cHV0Q2FsZW5kYXI6ICdpc2xhbWljJyB9KVswXSAvLz0+ICdSYWJpyrsgSSdcbiAgICogQHJldHVybiB7W3N0cmluZ119XG4gICAqL1xuXG5cbiAgSW5mby5tb250aHMgPSBmdW5jdGlvbiBtb250aHMoKSB7XG4gICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJ2xvbmcnO1xuXG4gICAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9LFxuICAgICAgICBfcmVmJGxvY2FsZSA9IF9yZWYubG9jYWxlLFxuICAgICAgICBsb2NhbGUgPSBfcmVmJGxvY2FsZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IF9yZWYkbG9jYWxlLFxuICAgICAgICBfcmVmJG51bWJlcmluZ1N5c3RlbSA9IF9yZWYubnVtYmVyaW5nU3lzdGVtLFxuICAgICAgICBudW1iZXJpbmdTeXN0ZW0gPSBfcmVmJG51bWJlcmluZ1N5c3RlbSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IF9yZWYkbnVtYmVyaW5nU3lzdGVtLFxuICAgICAgICBfcmVmJG91dHB1dENhbGVuZGFyID0gX3JlZi5vdXRwdXRDYWxlbmRhcixcbiAgICAgICAgb3V0cHV0Q2FsZW5kYXIgPSBfcmVmJG91dHB1dENhbGVuZGFyID09PSB1bmRlZmluZWQgPyAnZ3JlZ29yeScgOiBfcmVmJG91dHB1dENhbGVuZGFyO1xuXG4gICAgcmV0dXJuIExvY2FsZS5jcmVhdGUobG9jYWxlLCBudW1iZXJpbmdTeXN0ZW0sIG91dHB1dENhbGVuZGFyKS5tb250aHMobGVuZ3RoKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJuIGFuIGFycmF5IG9mIGZvcm1hdCBtb250aCBuYW1lcy5cbiAgICogRm9ybWF0IG1vbnRocyBkaWZmZXIgZnJvbSBzdGFuZGFsb25lIG1vbnRocyBpbiB0aGF0IHRoZXkncmUgbWVhbnQgdG8gYXBwZWFyIG5leHQgdG8gdGhlIGRheSBvZiB0aGUgbW9udGguIEluIHNvbWUgbGFuZ3VhZ2VzLCB0aGF0XG4gICAqIGNoYW5nZXMgdGhlIHN0cmluZy5cbiAgICogU2VlIHtAbGluayBtb250aHN9XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbbGVuZ3RoPSdsb25nJ10gLSB0aGUgbGVuZ3RoIG9mIHRoZSBtb250aCByZXByZXNlbnRhdGlvbiwgc3VjaCBhcyBcIm51bWVyaWNcIiwgXCIyLWRpZ2l0XCIsIFwibmFycm93XCIsIFwic2hvcnRcIiwgXCJsb25nXCJcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdHMgLSBvcHRpb25zXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5sb2NhbGVdIC0gdGhlIGxvY2FsZSBjb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5udW1iZXJpbmc9bnVsbF0gLSB0aGUgbnVtYmVyaW5nIHN5c3RlbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMub3V0cHV0Q2FsZW5kYXI9J2dyZWdvcnknXSAtIHRoZSBjYWxlbmRhclxuICAgKiBAcmV0dXJuIHtbc3RyaW5nXX1cbiAgICovXG5cblxuICBJbmZvLm1vbnRoc0Zvcm1hdCA9IGZ1bmN0aW9uIG1vbnRoc0Zvcm1hdCgpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnbG9uZyc7XG5cbiAgICB2YXIgX3JlZjIgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9LFxuICAgICAgICBfcmVmMiRsb2NhbGUgPSBfcmVmMi5sb2NhbGUsXG4gICAgICAgIGxvY2FsZSA9IF9yZWYyJGxvY2FsZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IF9yZWYyJGxvY2FsZSxcbiAgICAgICAgX3JlZjIkbnVtYmVyaW5nU3lzdGVtID0gX3JlZjIubnVtYmVyaW5nU3lzdGVtLFxuICAgICAgICBudW1iZXJpbmdTeXN0ZW0gPSBfcmVmMiRudW1iZXJpbmdTeXN0ZW0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBfcmVmMiRudW1iZXJpbmdTeXN0ZW0sXG4gICAgICAgIF9yZWYyJG91dHB1dENhbGVuZGFyID0gX3JlZjIub3V0cHV0Q2FsZW5kYXIsXG4gICAgICAgIG91dHB1dENhbGVuZGFyID0gX3JlZjIkb3V0cHV0Q2FsZW5kYXIgPT09IHVuZGVmaW5lZCA/ICdncmVnb3J5JyA6IF9yZWYyJG91dHB1dENhbGVuZGFyO1xuXG4gICAgcmV0dXJuIExvY2FsZS5jcmVhdGUobG9jYWxlLCBudW1iZXJpbmdTeXN0ZW0sIG91dHB1dENhbGVuZGFyKS5tb250aHMobGVuZ3RoLCB0cnVlKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJuIGFuIGFycmF5IG9mIHN0YW5kYWxvbmUgd2VlayBuYW1lcy5cbiAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9EYXRlVGltZUZvcm1hdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2xlbmd0aD0nbG9uZyddIC0gdGhlIGxlbmd0aCBvZiB0aGUgbW9udGggcmVwcmVzZW50YXRpb24sIHN1Y2ggYXMgXCJuYXJyb3dcIiwgXCJzaG9ydFwiLCBcImxvbmdcIi5cbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdHMgLSBvcHRpb25zXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5sb2NhbGVdIC0gdGhlIGxvY2FsZSBjb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5udW1iZXJpbmc9bnVsbF0gLSB0aGUgbnVtYmVyaW5nIHN5c3RlbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMub3V0cHV0Q2FsZW5kYXI9J2dyZWdvcnknXSAtIHRoZSBjYWxlbmRhclxuICAgKiBAZXhhbXBsZSBJbmZvLndlZWtkYXlzKClbMF0gLy89PiAnTW9uZGF5J1xuICAgKiBAZXhhbXBsZSBJbmZvLndlZWtkYXlzKCdzaG9ydCcpWzBdIC8vPT4gJ01vbidcbiAgICogQGV4YW1wbGUgSW5mby53ZWVrZGF5cygnc2hvcnQnLCB7IGxvY2FsZTogJ2ZyLUNBJyB9KVswXSAvLz0+ICdsdW4uJ1xuICAgKiBAZXhhbXBsZSBJbmZvLndlZWtkYXlzKCdzaG9ydCcsIHsgbG9jYWxlOiAnYXInIH0pWzBdIC8vPT4gJ9in2YTYp9ir2YbZitmGJ1xuICAgKiBAcmV0dXJuIHtbc3RyaW5nXX1cbiAgICovXG5cblxuICBJbmZvLndlZWtkYXlzID0gZnVuY3Rpb24gd2Vla2RheXMoKSB7XG4gICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJ2xvbmcnO1xuXG4gICAgdmFyIF9yZWYzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fSxcbiAgICAgICAgX3JlZjMkbG9jYWxlID0gX3JlZjMubG9jYWxlLFxuICAgICAgICBsb2NhbGUgPSBfcmVmMyRsb2NhbGUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBfcmVmMyRsb2NhbGUsXG4gICAgICAgIF9yZWYzJG51bWJlcmluZ1N5c3RlbSA9IF9yZWYzLm51bWJlcmluZ1N5c3RlbSxcbiAgICAgICAgbnVtYmVyaW5nU3lzdGVtID0gX3JlZjMkbnVtYmVyaW5nU3lzdGVtID09PSB1bmRlZmluZWQgPyBudWxsIDogX3JlZjMkbnVtYmVyaW5nU3lzdGVtO1xuXG4gICAgcmV0dXJuIExvY2FsZS5jcmVhdGUobG9jYWxlLCBudW1iZXJpbmdTeXN0ZW0sIG51bGwpLndlZWtkYXlzKGxlbmd0aCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbiBhcnJheSBvZiBmb3JtYXQgd2VlayBuYW1lcy5cbiAgICogRm9ybWF0IHdlZWtkYXlzIGRpZmZlciBmcm9tIHN0YW5kYWxvbmUgd2Vla2RheXMgaW4gdGhhdCB0aGV5J3JlIG1lYW50IHRvIGFwcGVhciBuZXh0IHRvIG1vcmUgZGF0ZSBpbmZvcm1hdGlvbi4gSW4gc29tZSBsYW5ndWFnZXMsIHRoYXRcbiAgICogY2hhbmdlcyB0aGUgc3RyaW5nLlxuICAgKiBTZWUge0BsaW5rIHdlZWtkYXlzfVxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2xlbmd0aD0nbG9uZyddIC0gdGhlIGxlbmd0aCBvZiB0aGUgbW9udGggcmVwcmVzZW50YXRpb24sIHN1Y2ggYXMgXCJuYXJyb3dcIiwgXCJzaG9ydFwiLCBcImxvbmdcIi5cbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdHMgLSBvcHRpb25zXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5sb2NhbGU9bnVsbF0gLSB0aGUgbG9jYWxlIGNvZGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLm51bWJlcmluZz1udWxsXSAtIHRoZSBudW1iZXJpbmcgc3lzdGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5vdXRwdXRDYWxlbmRhcj0nZ3JlZ29yeSddIC0gdGhlIGNhbGVuZGFyXG4gICAqIEByZXR1cm4ge1tzdHJpbmddfVxuICAgKi9cblxuXG4gIEluZm8ud2Vla2RheXNGb3JtYXQgPSBmdW5jdGlvbiB3ZWVrZGF5c0Zvcm1hdCgpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnbG9uZyc7XG5cbiAgICB2YXIgX3JlZjQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9LFxuICAgICAgICBfcmVmNCRsb2NhbGUgPSBfcmVmNC5sb2NhbGUsXG4gICAgICAgIGxvY2FsZSA9IF9yZWY0JGxvY2FsZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IF9yZWY0JGxvY2FsZSxcbiAgICAgICAgX3JlZjQkbnVtYmVyaW5nU3lzdGVtID0gX3JlZjQubnVtYmVyaW5nU3lzdGVtLFxuICAgICAgICBudW1iZXJpbmdTeXN0ZW0gPSBfcmVmNCRudW1iZXJpbmdTeXN0ZW0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBfcmVmNCRudW1iZXJpbmdTeXN0ZW07XG5cbiAgICByZXR1cm4gTG9jYWxlLmNyZWF0ZShsb2NhbGUsIG51bWJlcmluZ1N5c3RlbSwgbnVsbCkud2Vla2RheXMobGVuZ3RoLCB0cnVlKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJuIGFuIGFycmF5IG9mIG1lcmlkaWVtcy5cbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdHMgLSBvcHRpb25zXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5sb2NhbGVdIC0gdGhlIGxvY2FsZSBjb2RlXG4gICAqIEBleGFtcGxlIEluZm8ubWVyaWRpZW1zKCkgLy89PiBbICdBTScsICdQTScgXVxuICAgKiBAZXhhbXBsZSBJbmZvLm1lcmlkaWVtcyh7IGxvY2FsZTogJ2RlJyB9KSAvLz0+IFsgJ3Zvcm0uJywgJ25hY2htLicgXVxuICAgKiBAcmV0dXJuIHtbc3RyaW5nXX1cbiAgICovXG5cblxuICBJbmZvLm1lcmlkaWVtcyA9IGZ1bmN0aW9uIG1lcmlkaWVtcygpIHtcbiAgICB2YXIgX3JlZjUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9LFxuICAgICAgICBfcmVmNSRsb2NhbGUgPSBfcmVmNS5sb2NhbGUsXG4gICAgICAgIGxvY2FsZSA9IF9yZWY1JGxvY2FsZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IF9yZWY1JGxvY2FsZTtcblxuICAgIHJldHVybiBMb2NhbGUuY3JlYXRlKGxvY2FsZSkubWVyaWRpZW1zKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbiBhcnJheSBvZiBlcmFzLCBzdWNoIGFzIFsnQkMnLCAnQUQnXS4gVGhlIGxvY2FsZSBjYW4gYmUgc3BlY2lmaWVkLCBidXQgdGhlIGNhbGVuZGFyIHN5c3RlbSBpcyBhbHdheXMgR3JlZ29yaWFuLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2xlbmd0aD0nc2hvcnQnXSAtIHRoZSBsZW5ndGggb2YgdGhlIGVyYSByZXByZXNlbnRhdGlvbiwgc3VjaCBhcyBcInNob3J0XCIgb3IgXCJsb25nXCIuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRzIC0gb3B0aW9uc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMubG9jYWxlXSAtIHRoZSBsb2NhbGUgY29kZVxuICAgKiBAZXhhbXBsZSBJbmZvLmVyYXMoKSAvLz0+IFsgJ0JDJywgJ0FEJyBdXG4gICAqIEBleGFtcGxlIEluZm8uZXJhcygnbG9uZycpIC8vPT4gWyAnQmVmb3JlIENocmlzdCcsICdBbm5vIERvbWluaScgXVxuICAgKiBAZXhhbXBsZSBJbmZvLmVyYXMoJ2xvbmcnLCB7IGxvY2FsZTogJ2ZyJyB9KSAvLz0+IFsgJ2F2YW50IErDqXN1cy1DaHJpc3QnLCAnYXByw6hzIErDqXN1cy1DaHJpc3QnIF1cbiAgICogQHJldHVybiB7W3N0cmluZ119XG4gICAqL1xuXG5cbiAgSW5mby5lcmFzID0gZnVuY3Rpb24gZXJhcygpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnc2hvcnQnO1xuXG4gICAgdmFyIF9yZWY2ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fSxcbiAgICAgICAgX3JlZjYkbG9jYWxlID0gX3JlZjYubG9jYWxlLFxuICAgICAgICBsb2NhbGUgPSBfcmVmNiRsb2NhbGUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBfcmVmNiRsb2NhbGU7XG5cbiAgICByZXR1cm4gTG9jYWxlLmNyZWF0ZShsb2NhbGUsIG51bGwsICdncmVnb3J5JykuZXJhcyhsZW5ndGgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHNldCBvZiBhdmFpbGFibGUgZmVhdHVyZXMgaW4gdGhpcyBlbnZpcm9ubWVudC5cbiAgICogU29tZSBmZWF0dXJlcyBvZiBMdXhvbiBhcmUgbm90IGF2YWlsYWJsZSBpbiBhbGwgZW52aXJvbm1lbnRzLiBGb3IgZXhhbXBsZSwgb24gb2xkZXIgYnJvd3NlcnMsIHRpbWV6b25lIHN1cHBvcnQgaXMgbm90IGF2YWlsYWJsZS4gVXNlIHRoaXMgZnVuY3Rpb24gdG8gZmlndXJlIG91dCBpZiB0aGF0J3MgdGhlIGNhc2UuXG4gICAqIEtleXM6XG4gICAqICogYHpvbmVzYDogd2hldGhlciB0aGlzIGVudmlyb25tZW50IHN1cHBvcnRzIElBTkEgdGltZXpvbmVzXG4gICAqICogYGludGxUb2tlbnNgOiB3aGV0aGVyIHRoaXMgZW52aXJvbm1lbnQgc3VwcG9ydHMgaW50ZXJuYXRpb25hbGl6ZWQgdG9rZW4tYmFzZWQgZm9ybWF0dGluZy9wYXJzaW5nXG4gICAqICogYGludGxgOiB3aGV0aGVyIHRoaXMgZW52aXJvbm1lbnQgc3VwcG9ydHMgZ2VuZXJhbCBpbnRlcm5hdGlvbmFsaXphdGlvblxuICAgKiBAZXhhbXBsZSBJbmZvLmZlYXR1cmVzKCkgLy89PiB7IGludGw6IHRydWUsIGludGxUb2tlbnM6IGZhbHNlLCB6b25lczogdHJ1ZSB9XG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG5cblxuICBJbmZvLmZlYXR1cmVzID0gZnVuY3Rpb24gZmVhdHVyZXMoKSB7XG4gICAgdmFyIGludGwgPSBmYWxzZSxcbiAgICAgICAgaW50bFRva2VucyA9IGZhbHNlLFxuICAgICAgICB6b25lcyA9IGZhbHNlO1xuXG4gICAgaWYgKFV0aWwuaGFzSW50bCgpKSB7XG4gICAgICBpbnRsID0gdHJ1ZTtcbiAgICAgIGludGxUb2tlbnMgPSBVdGlsLmhhc0Zvcm1hdFRvUGFydHMoKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgem9uZXMgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdCgnZW4nLCB7IHRpbWVab25lOiAnQW1lcmljYS9OZXdfWW9yaycgfSkucmVzb2x2ZWRPcHRpb25zKCkudGltZVpvbmUgPT09ICdBbWVyaWNhL05ld19Zb3JrJztcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgem9uZXMgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyBpbnRsOiBpbnRsLCBpbnRsVG9rZW5zOiBpbnRsVG9rZW5zLCB6b25lczogem9uZXMgfTtcbiAgfTtcblxuICByZXR1cm4gSW5mbztcbn0oKTtcblxudmFyIE1JU1NJTkdfRlRQID0gJ21pc3NpbmcgSW50bC5EYXRlVGltZUZvcm1hdC5mb3JtYXRUb1BhcnRzIHN1cHBvcnQnO1xuXG5mdW5jdGlvbiBpbnRVbml0KHJlZ2V4KSB7XG4gIHZhciBwb3N0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmdW5jdGlvbiAoaSkge1xuICAgIHJldHVybiBpO1xuICB9O1xuXG4gIHJldHVybiB7IHJlZ2V4OiByZWdleCwgZGVzZXI6IGZ1bmN0aW9uIGRlc2VyKF9yZWYpIHtcbiAgICAgIHZhciBzID0gX3JlZlswXTtcbiAgICAgIHJldHVybiBwb3N0KHBhcnNlSW50KHMpKTtcbiAgICB9IH07XG59XG5cbmZ1bmN0aW9uIGZpeExpc3RSZWdleChzKSB7XG4gIC8vIG1ha2UgZG90cyBvcHRpb25hbCBhbmQgYWxzbyBtYWtlIHRoZW0gbGl0ZXJhbFxuICByZXR1cm4gcy5yZXBsYWNlKC9cXC4vLCAnXFxcXC4/Jyk7XG59XG5cbmZ1bmN0aW9uIHN0cmlwSW5zZW5zaXRpdml0aWVzKHMpIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvXFwuLywgJycpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmZ1bmN0aW9uIG9uZU9mKHN0cmluZ3MsIHN0YXJ0SW5kZXgpIHtcbiAgaWYgKHN0cmluZ3MgPT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVnZXg6IFJlZ0V4cChzdHJpbmdzLm1hcChmaXhMaXN0UmVnZXgpLmpvaW4oJ3wnKSksXG4gICAgICBkZXNlcjogZnVuY3Rpb24gZGVzZXIoX3JlZjIpIHtcbiAgICAgICAgdmFyIHMgPSBfcmVmMlswXTtcbiAgICAgICAgcmV0dXJuIHN0cmluZ3MuZmluZEluZGV4KGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgcmV0dXJuIHN0cmlwSW5zZW5zaXRpdml0aWVzKHMpID09PSBzdHJpcEluc2Vuc2l0aXZpdGllcyhpKTtcbiAgICAgICAgfSkgKyBzdGFydEluZGV4O1xuICAgICAgfVxuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gb2Zmc2V0KHJlZ2V4LCBncm91cHMpIHtcbiAgcmV0dXJuIHsgcmVnZXg6IHJlZ2V4LCBkZXNlcjogZnVuY3Rpb24gZGVzZXIoX3JlZjMpIHtcbiAgICAgIHZhciBoID0gX3JlZjNbMV0sXG4gICAgICAgICAgbSA9IF9yZWYzWzJdO1xuICAgICAgcmV0dXJuIFV0aWwuc2lnbmVkT2Zmc2V0KGgsIG0pO1xuICAgIH0sIGdyb3VwczogZ3JvdXBzIH07XG59XG5cbmZ1bmN0aW9uIHNpbXBsZShyZWdleCkge1xuICByZXR1cm4geyByZWdleDogcmVnZXgsIGRlc2VyOiBmdW5jdGlvbiBkZXNlcihfcmVmNCkge1xuICAgICAgdmFyIHMgPSBfcmVmNFswXTtcbiAgICAgIHJldHVybiBzO1xuICAgIH0gfTtcbn1cblxuZnVuY3Rpb24gdW5pdEZvclRva2VuKHRva2VuLCBsb2MpIHtcbiAgdmFyIG9uZSA9IC9cXGQvLFxuICAgICAgdHdvID0gL1xcZHsyfS8sXG4gICAgICB0aHJlZSA9IC9cXGR7M30vLFxuICAgICAgZm91ciA9IC9cXGR7NH0vLFxuICAgICAgb25lT3JUd28gPSAvXFxkezEsMn0vLFxuICAgICAgb25lVG9UaHJlZSA9IC9cXGR7MSwzfS8sXG4gICAgICB0d29Ub0ZvdXIgPSAvXFxkezIsNH0vLFxuICAgICAgbGl0ZXJhbCA9IGZ1bmN0aW9uIGxpdGVyYWwodCkge1xuICAgIHJldHVybiB7IHJlZ2V4OiBSZWdFeHAodC52YWwpLCBkZXNlcjogZnVuY3Rpb24gZGVzZXIoX3JlZjUpIHtcbiAgICAgICAgdmFyIHMgPSBfcmVmNVswXTtcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgICB9LCBsaXRlcmFsOiB0cnVlIH07XG4gIH0sXG4gICAgICB1bml0YXRlID0gZnVuY3Rpb24gdW5pdGF0ZSh0KSB7XG4gICAgaWYgKHRva2VuLmxpdGVyYWwpIHtcbiAgICAgIHJldHVybiBsaXRlcmFsKHQpO1xuICAgIH1cbiAgICBzd2l0Y2ggKHQudmFsKSB7XG4gICAgICAvLyBlcmFcbiAgICAgIGNhc2UgJ0cnOlxuICAgICAgICByZXR1cm4gb25lT2YobG9jLmVyYXMoJ3Nob3J0JywgZmFsc2UpLCAwKTtcbiAgICAgIGNhc2UgJ0dHJzpcbiAgICAgICAgcmV0dXJuIG9uZU9mKGxvYy5lcmFzKCdsb25nJywgZmFsc2UpLCAwKTtcbiAgICAgIC8vIHllYXJzXG4gICAgICBjYXNlICd5JzpcbiAgICAgICAgcmV0dXJuIGludFVuaXQoL1xcZHsxLDZ9Lyk7XG4gICAgICBjYXNlICd5eSc6XG4gICAgICAgIHJldHVybiBpbnRVbml0KHR3b1RvRm91ciwgVXRpbC51bnRydW5jYXRlWWVhcik7XG4gICAgICBjYXNlICd5eXl5JzpcbiAgICAgICAgcmV0dXJuIGludFVuaXQoZm91cik7XG4gICAgICBjYXNlICd5eXl5eSc6XG4gICAgICAgIHJldHVybiBpbnRVbml0KC9cXGR7NCw2fS8pO1xuICAgICAgY2FzZSAneXl5eXl5JzpcbiAgICAgICAgcmV0dXJuIGludFVuaXQoL1xcZHs2fS8pO1xuICAgICAgLy8gbW9udGhzXG4gICAgICBjYXNlICdNJzpcbiAgICAgICAgcmV0dXJuIGludFVuaXQob25lT3JUd28pO1xuICAgICAgY2FzZSAnTU0nOlxuICAgICAgICByZXR1cm4gaW50VW5pdCh0d28pO1xuICAgICAgY2FzZSAnTU1NJzpcbiAgICAgICAgcmV0dXJuIG9uZU9mKGxvYy5tb250aHMoJ3Nob3J0JywgZmFsc2UsIGZhbHNlKSwgMSk7XG4gICAgICBjYXNlICdNTU1NJzpcbiAgICAgICAgcmV0dXJuIG9uZU9mKGxvYy5tb250aHMoJ2xvbmcnLCBmYWxzZSwgZmFsc2UpLCAxKTtcbiAgICAgIGNhc2UgJ0wnOlxuICAgICAgICByZXR1cm4gaW50VW5pdChvbmVPclR3byk7XG4gICAgICBjYXNlICdMTCc6XG4gICAgICAgIHJldHVybiBpbnRVbml0KHR3byk7XG4gICAgICBjYXNlICdMTEwnOlxuICAgICAgICByZXR1cm4gb25lT2YobG9jLm1vbnRocygnc2hvcnQnLCB0cnVlLCBmYWxzZSksIDEpO1xuICAgICAgY2FzZSAnTExMTCc6XG4gICAgICAgIHJldHVybiBvbmVPZihsb2MubW9udGhzKCdsb25nJywgdHJ1ZSwgZmFsc2UpLCAxKTtcbiAgICAgIC8vIGRhdGVzXG4gICAgICBjYXNlICdkJzpcbiAgICAgICAgcmV0dXJuIGludFVuaXQob25lT3JUd28pO1xuICAgICAgY2FzZSAnZGQnOlxuICAgICAgICByZXR1cm4gaW50VW5pdCh0d28pO1xuICAgICAgLy8gb3JkaW5hbHNcbiAgICAgIGNhc2UgJ28nOlxuICAgICAgICByZXR1cm4gaW50VW5pdChvbmVUb1RocmVlKTtcbiAgICAgIGNhc2UgJ29vbyc6XG4gICAgICAgIHJldHVybiBpbnRVbml0KHRocmVlKTtcbiAgICAgIC8vIHRpbWVcbiAgICAgIGNhc2UgJ0hIJzpcbiAgICAgICAgcmV0dXJuIGludFVuaXQodHdvKTtcbiAgICAgIGNhc2UgJ0gnOlxuICAgICAgICByZXR1cm4gaW50VW5pdChvbmVPclR3byk7XG4gICAgICBjYXNlICdoaCc6XG4gICAgICAgIHJldHVybiBpbnRVbml0KHR3byk7XG4gICAgICBjYXNlICdoJzpcbiAgICAgICAgcmV0dXJuIGludFVuaXQob25lT3JUd28pO1xuICAgICAgY2FzZSAnbW0nOlxuICAgICAgICByZXR1cm4gaW50VW5pdCh0d28pO1xuICAgICAgY2FzZSAnbSc6XG4gICAgICAgIHJldHVybiBpbnRVbml0KG9uZU9yVHdvKTtcbiAgICAgIGNhc2UgJ3MnOlxuICAgICAgICByZXR1cm4gaW50VW5pdChvbmVPclR3byk7XG4gICAgICBjYXNlICdzcyc6XG4gICAgICAgIHJldHVybiBpbnRVbml0KHR3byk7XG4gICAgICBjYXNlICdTJzpcbiAgICAgICAgcmV0dXJuIGludFVuaXQob25lVG9UaHJlZSk7XG4gICAgICBjYXNlICdTU1MnOlxuICAgICAgICByZXR1cm4gaW50VW5pdCh0aHJlZSk7XG4gICAgICBjYXNlICd1JzpcbiAgICAgICAgcmV0dXJuIHNpbXBsZSgvXFxkezEsOX0vKTtcbiAgICAgIC8vIG1lcmlkaWVtXG4gICAgICBjYXNlICdhJzpcbiAgICAgICAgcmV0dXJuIG9uZU9mKGxvYy5tZXJpZGllbXMoKSwgMCk7XG4gICAgICAvLyB3ZWVrWWVhciAoaylcbiAgICAgIGNhc2UgJ2tra2snOlxuICAgICAgICByZXR1cm4gaW50VW5pdChmb3VyKTtcbiAgICAgIGNhc2UgJ2trJzpcbiAgICAgICAgcmV0dXJuIGludFVuaXQodHdvVG9Gb3VyLCBVdGlsLnVudHJ1bmNhdGVZZWFyKTtcbiAgICAgIC8vIHdlZWtOdW1iZXIgKFcpXG4gICAgICBjYXNlICdXJzpcbiAgICAgICAgcmV0dXJuIGludFVuaXQob25lT3JUd28pO1xuICAgICAgY2FzZSAnV1cnOlxuICAgICAgICByZXR1cm4gaW50VW5pdCh0d28pO1xuICAgICAgLy8gd2Vla2RheXNcbiAgICAgIGNhc2UgJ0UnOlxuICAgICAgY2FzZSAnYyc6XG4gICAgICAgIHJldHVybiBpbnRVbml0KG9uZSk7XG4gICAgICBjYXNlICdFRUUnOlxuICAgICAgICByZXR1cm4gb25lT2YobG9jLndlZWtkYXlzKCdzaG9ydCcsIGZhbHNlLCBmYWxzZSksIDEpO1xuICAgICAgY2FzZSAnRUVFRSc6XG4gICAgICAgIHJldHVybiBvbmVPZihsb2Mud2Vla2RheXMoJ2xvbmcnLCBmYWxzZSwgZmFsc2UpLCAxKTtcbiAgICAgIGNhc2UgJ2NjYyc6XG4gICAgICAgIHJldHVybiBvbmVPZihsb2Mud2Vla2RheXMoJ3Nob3J0JywgdHJ1ZSwgZmFsc2UpLCAxKTtcbiAgICAgIGNhc2UgJ2NjY2MnOlxuICAgICAgICByZXR1cm4gb25lT2YobG9jLndlZWtkYXlzKCdsb25nJywgdHJ1ZSwgZmFsc2UpLCAxKTtcbiAgICAgIC8vIG9mZnNldC96b25lXG4gICAgICBjYXNlICdaJzpcbiAgICAgIGNhc2UgJ1paJzpcbiAgICAgICAgcmV0dXJuIG9mZnNldCgvKFsrLV1cXGR7MSwyfSkoPzo6KFxcZHsyfSkpPy8sIDIpO1xuICAgICAgY2FzZSAnWlpaJzpcbiAgICAgICAgcmV0dXJuIG9mZnNldCgvKFsrLV1cXGR7MSwyfSkoXFxkezJ9KT8vLCAyKTtcbiAgICAgIC8vIHdlIGRvbid0IHN1cHBvcnQgWlpaWiAoUFNUKSBvciBaWlpaWiAoUGFjaWZpYyBTdGFuZGFyZCBUaW1lKSBpbiBwYXJzaW5nXG4gICAgICAvLyBiZWNhdXNlIHdlIGRvbid0IGhhdmUgYW55IHdheSB0byBmaWd1cmUgb3V0IHdoYXQgdGhleSBhcmVcbiAgICAgIGNhc2UgJ3onOlxuICAgICAgICByZXR1cm4gc2ltcGxlKC9bQS1aYS16X117MSwyNTZ9XFwvW0EtWmEtel9dezEsMjU2fS8pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGxpdGVyYWwodCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciB1bml0ID0gdW5pdGF0ZSh0b2tlbikgfHwge1xuICAgIGludmFsaWRSZWFzb246IE1JU1NJTkdfRlRQXG4gIH07XG5cbiAgdW5pdC50b2tlbiA9IHRva2VuO1xuXG4gIHJldHVybiB1bml0O1xufVxuXG5mdW5jdGlvbiBidWlsZFJlZ2V4KHVuaXRzKSB7XG4gIHZhciByZSA9IHVuaXRzLm1hcChmdW5jdGlvbiAodSkge1xuICAgIHJldHVybiB1LnJlZ2V4O1xuICB9KS5yZWR1Y2UoZnVuY3Rpb24gKGYsIHIpIHtcbiAgICByZXR1cm4gZiArICcoJyArIHIuc291cmNlICsgJyknO1xuICB9LCAnJyk7XG4gIHJldHVybiBbJ14nICsgcmUgKyAnJCcsIHVuaXRzXTtcbn1cblxuZnVuY3Rpb24gbWF0Y2goaW5wdXQsIHJlZ2V4LCBoYW5kbGVycykge1xuICB2YXIgbWF0Y2hlcyA9IGlucHV0Lm1hdGNoKHJlZ2V4KTtcblxuICBpZiAobWF0Y2hlcykge1xuICAgIHZhciBhbGwgPSB7fTtcbiAgICB2YXIgbWF0Y2hJbmRleCA9IDE7XG4gICAgZm9yICh2YXIgaSBpbiBoYW5kbGVycykge1xuICAgICAgaWYgKGhhbmRsZXJzLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgIHZhciBoID0gaGFuZGxlcnNbaV0sXG4gICAgICAgICAgICBncm91cHMgPSBoLmdyb3VwcyA/IGguZ3JvdXBzICsgMSA6IDE7XG4gICAgICAgIGlmICghaC5saXRlcmFsICYmIGgudG9rZW4pIHtcbiAgICAgICAgICBhbGxbaC50b2tlbi52YWxbMF1dID0gaC5kZXNlcihtYXRjaGVzLnNsaWNlKG1hdGNoSW5kZXgsIG1hdGNoSW5kZXggKyBncm91cHMpKTtcbiAgICAgICAgfVxuICAgICAgICBtYXRjaEluZGV4ICs9IGdyb3VwcztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFttYXRjaGVzLCBhbGxdO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBbbWF0Y2hlcywge31dO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRhdGVUaW1lRnJvbU1hdGNoZXMobWF0Y2hlcykge1xuICB2YXIgdG9GaWVsZCA9IGZ1bmN0aW9uIHRvRmllbGQodG9rZW4pIHtcbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICBjYXNlICdTJzpcbiAgICAgICAgcmV0dXJuICdtaWxsaXNlY29uZCc7XG4gICAgICBjYXNlICdzJzpcbiAgICAgICAgcmV0dXJuICdzZWNvbmQnO1xuICAgICAgY2FzZSAnbSc6XG4gICAgICAgIHJldHVybiAnbWludXRlJztcbiAgICAgIGNhc2UgJ2gnOlxuICAgICAgY2FzZSAnSCc6XG4gICAgICAgIHJldHVybiAnaG91cic7XG4gICAgICBjYXNlICdkJzpcbiAgICAgICAgcmV0dXJuICdkYXknO1xuICAgICAgY2FzZSAnbyc6XG4gICAgICAgIHJldHVybiAnb3JkaW5hbCc7XG4gICAgICBjYXNlICdMJzpcbiAgICAgIGNhc2UgJ00nOlxuICAgICAgICByZXR1cm4gJ21vbnRoJztcbiAgICAgIGNhc2UgJ3knOlxuICAgICAgICByZXR1cm4gJ3llYXInO1xuICAgICAgY2FzZSAnRSc6XG4gICAgICBjYXNlICdjJzpcbiAgICAgICAgcmV0dXJuICd3ZWVrZGF5JztcbiAgICAgIGNhc2UgJ1cnOlxuICAgICAgICByZXR1cm4gJ3dlZWtOdW1iZXInO1xuICAgICAgY2FzZSAnayc6XG4gICAgICAgIHJldHVybiAnd2Vla1llYXInO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xuXG4gIHZhciB6b25lID0gdm9pZCAwO1xuICBpZiAoIVV0aWwuaXNVbmRlZmluZWQobWF0Y2hlcy5aKSkge1xuICAgIHpvbmUgPSBuZXcgRml4ZWRPZmZzZXRab25lKG1hdGNoZXMuWik7XG4gIH0gZWxzZSBpZiAoIVV0aWwuaXNVbmRlZmluZWQobWF0Y2hlcy56KSkge1xuICAgIHpvbmUgPSBuZXcgSUFOQVpvbmUobWF0Y2hlcy56KTtcbiAgfSBlbHNlIHtcbiAgICB6b25lID0gbnVsbDtcbiAgfVxuXG4gIGlmICghVXRpbC5pc1VuZGVmaW5lZChtYXRjaGVzLmgpKSB7XG4gICAgaWYgKG1hdGNoZXMuaCA8IDEyICYmIG1hdGNoZXMuYSA9PT0gMSkge1xuICAgICAgbWF0Y2hlcy5oICs9IDEyO1xuICAgIH0gZWxzZSBpZiAobWF0Y2hlcy5oID09PSAxMiAmJiBtYXRjaGVzLmEgPT09IDApIHtcbiAgICAgIG1hdGNoZXMuaCA9IDA7XG4gICAgfVxuICB9XG5cbiAgaWYgKG1hdGNoZXMuRyA9PT0gMCAmJiBtYXRjaGVzLnkpIHtcbiAgICBtYXRjaGVzLnkgPSAtbWF0Y2hlcy55O1xuICB9XG5cbiAgaWYgKCFVdGlsLmlzVW5kZWZpbmVkKG1hdGNoZXMudSkpIHtcbiAgICBtYXRjaGVzLlMgPSBVdGlsLnBhcnNlTWlsbGlzKG1hdGNoZXMudSk7XG4gIH1cblxuICB2YXIgdmFscyA9IE9iamVjdC5rZXlzKG1hdGNoZXMpLnJlZHVjZShmdW5jdGlvbiAociwgaykge1xuICAgIHZhciBmID0gdG9GaWVsZChrKTtcbiAgICBpZiAoZikge1xuICAgICAgcltmXSA9IG1hdGNoZXNba107XG4gICAgfVxuXG4gICAgcmV0dXJuIHI7XG4gIH0sIHt9KTtcblxuICByZXR1cm4gW3ZhbHMsIHpvbmVdO1xufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cblxudmFyIFRva2VuUGFyc2VyID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBUb2tlblBhcnNlcihsb2MpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBUb2tlblBhcnNlcik7XG5cbiAgICB0aGlzLmxvYyA9IGxvYztcbiAgfVxuXG4gIFRva2VuUGFyc2VyLnByb3RvdHlwZS5leHBsYWluUGFyc2UgPSBmdW5jdGlvbiBleHBsYWluUGFyc2UoaW5wdXQsIGZvcm1hdCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgdG9rZW5zID0gRm9ybWF0dGVyLnBhcnNlRm9ybWF0KGZvcm1hdCksXG4gICAgICAgIHVuaXRzID0gdG9rZW5zLm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgcmV0dXJuIHVuaXRGb3JUb2tlbih0LCBfdGhpcy5sb2MpO1xuICAgIH0pLFxuICAgICAgICBkaXNxdWFsaWZ5aW5nVW5pdCA9IHVuaXRzLmZpbmQoZnVuY3Rpb24gKHQpIHtcbiAgICAgIHJldHVybiB0LmludmFsaWRSZWFzb247XG4gICAgfSk7XG5cbiAgICBpZiAoZGlzcXVhbGlmeWluZ1VuaXQpIHtcbiAgICAgIHJldHVybiB7IGlucHV0OiBpbnB1dCwgdG9rZW5zOiB0b2tlbnMsIGludmFsaWRSZWFzb246IGRpc3F1YWxpZnlpbmdVbml0LmludmFsaWRSZWFzb24gfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIF9idWlsZFJlZ2V4ID0gYnVpbGRSZWdleCh1bml0cyksXG4gICAgICAgICAgcmVnZXhTdHJpbmcgPSBfYnVpbGRSZWdleFswXSxcbiAgICAgICAgICBoYW5kbGVycyA9IF9idWlsZFJlZ2V4WzFdLFxuICAgICAgICAgIHJlZ2V4ID0gUmVnRXhwKHJlZ2V4U3RyaW5nLCAnaScpLFxuICAgICAgICAgIF9tYXRjaCA9IG1hdGNoKGlucHV0LCByZWdleCwgaGFuZGxlcnMpLFxuICAgICAgICAgIHJhd01hdGNoZXMgPSBfbWF0Y2hbMF0sXG4gICAgICAgICAgbWF0Y2hlcyA9IF9tYXRjaFsxXSxcbiAgICAgICAgICBfcmVmNiA9IG1hdGNoZXMgPyBkYXRlVGltZUZyb21NYXRjaGVzKG1hdGNoZXMpIDogW251bGwsIG51bGxdLFxuICAgICAgICAgIHJlc3VsdCA9IF9yZWY2WzBdLFxuICAgICAgICAgIHpvbmUgPSBfcmVmNlsxXTtcblxuICAgICAgcmV0dXJuIHsgaW5wdXQ6IGlucHV0LCB0b2tlbnM6IHRva2VucywgcmVnZXg6IHJlZ2V4LCByYXdNYXRjaGVzOiByYXdNYXRjaGVzLCBtYXRjaGVzOiBtYXRjaGVzLCByZXN1bHQ6IHJlc3VsdCwgem9uZTogem9uZSB9O1xuICAgIH1cbiAgfTtcblxuICBUb2tlblBhcnNlci5wcm90b3R5cGUucGFyc2VEYXRlVGltZSA9IGZ1bmN0aW9uIHBhcnNlRGF0ZVRpbWUoaW5wdXQsIGZvcm1hdCkge1xuICAgIHZhciBfZXhwbGFpblBhcnNlID0gdGhpcy5leHBsYWluUGFyc2UoaW5wdXQsIGZvcm1hdCksXG4gICAgICAgIHJlc3VsdCA9IF9leHBsYWluUGFyc2UucmVzdWx0LFxuICAgICAgICB6b25lID0gX2V4cGxhaW5QYXJzZS56b25lLFxuICAgICAgICBpbnZhbGlkUmVhc29uID0gX2V4cGxhaW5QYXJzZS5pbnZhbGlkUmVhc29uO1xuXG4gICAgcmV0dXJuIFtyZXN1bHQsIHpvbmUsIGludmFsaWRSZWFzb25dO1xuICB9O1xuXG4gIHJldHVybiBUb2tlblBhcnNlcjtcbn0oKTtcblxudmFyIG5vbkxlYXBMYWRkZXIgPSBbMCwgMzEsIDU5LCA5MCwgMTIwLCAxNTEsIDE4MSwgMjEyLCAyNDMsIDI3MywgMzA0LCAzMzRdO1xudmFyIGxlYXBMYWRkZXIgPSBbMCwgMzEsIDYwLCA5MSwgMTIxLCAxNTIsIDE4MiwgMjEzLCAyNDQsIDI3NCwgMzA1LCAzMzVdO1xuXG5mdW5jdGlvbiBkYXlPZldlZWsoeWVhciwgbW9udGgsIGRheSkge1xuICB2YXIganMgPSBuZXcgRGF0ZShEYXRlLlVUQyh5ZWFyLCBtb250aCAtIDEsIGRheSkpLmdldFVUQ0RheSgpO1xuICByZXR1cm4ganMgPT09IDAgPyA3IDoganM7XG59XG5cbmZ1bmN0aW9uIGxhc3RXZWVrTnVtYmVyKHdlZWtZZWFyKSB7XG4gIHZhciBwMSA9ICh3ZWVrWWVhciArIE1hdGguZmxvb3Iod2Vla1llYXIgLyA0KSAtIE1hdGguZmxvb3Iod2Vla1llYXIgLyAxMDApICsgTWF0aC5mbG9vcih3ZWVrWWVhciAvIDQwMCkpICUgNyxcbiAgICAgIGxhc3QgPSB3ZWVrWWVhciAtIDEsXG4gICAgICBwMiA9IChsYXN0ICsgTWF0aC5mbG9vcihsYXN0IC8gNCkgLSBNYXRoLmZsb29yKGxhc3QgLyAxMDApICsgTWF0aC5mbG9vcihsYXN0IC8gNDAwKSkgJSA3O1xuICByZXR1cm4gcDEgPT09IDQgfHwgcDIgPT09IDMgPyA1MyA6IDUyO1xufVxuXG5mdW5jdGlvbiBjb21wdXRlT3JkaW5hbCh5ZWFyLCBtb250aCwgZGF5KSB7XG4gIHJldHVybiBkYXkgKyAoVXRpbC5pc0xlYXBZZWFyKHllYXIpID8gbGVhcExhZGRlciA6IG5vbkxlYXBMYWRkZXIpW21vbnRoIC0gMV07XG59XG5cbmZ1bmN0aW9uIHVuY29tcHV0ZU9yZGluYWwoeWVhciwgb3JkaW5hbCkge1xuICB2YXIgdGFibGUgPSBVdGlsLmlzTGVhcFllYXIoeWVhcikgPyBsZWFwTGFkZGVyIDogbm9uTGVhcExhZGRlcixcbiAgICAgIG1vbnRoMCA9IHRhYmxlLmZpbmRJbmRleChmdW5jdGlvbiAoaSkge1xuICAgIHJldHVybiBpIDwgb3JkaW5hbDtcbiAgfSksXG4gICAgICBkYXkgPSBvcmRpbmFsIC0gdGFibGVbbW9udGgwXTtcbiAgcmV0dXJuIHsgbW9udGg6IG1vbnRoMCArIDEsIGRheTogZGF5IH07XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuXG52YXIgQ29udmVyc2lvbnMgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIENvbnZlcnNpb25zKCkge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIENvbnZlcnNpb25zKTtcbiAgfVxuXG4gIENvbnZlcnNpb25zLmdyZWdvcmlhblRvV2VlayA9IGZ1bmN0aW9uIGdyZWdvcmlhblRvV2VlayhncmVnT2JqKSB7XG4gICAgdmFyIHllYXIgPSBncmVnT2JqLnllYXIsXG4gICAgICAgIG1vbnRoID0gZ3JlZ09iai5tb250aCxcbiAgICAgICAgZGF5ID0gZ3JlZ09iai5kYXksXG4gICAgICAgIG9yZGluYWwgPSBjb21wdXRlT3JkaW5hbCh5ZWFyLCBtb250aCwgZGF5KSxcbiAgICAgICAgd2Vla2RheSA9IGRheU9mV2Vlayh5ZWFyLCBtb250aCwgZGF5KTtcblxuXG4gICAgdmFyIHdlZWtOdW1iZXIgPSBNYXRoLmZsb29yKChvcmRpbmFsIC0gd2Vla2RheSArIDEwKSAvIDcpLFxuICAgICAgICB3ZWVrWWVhciA9IHZvaWQgMDtcblxuICAgIGlmICh3ZWVrTnVtYmVyIDwgMSkge1xuICAgICAgd2Vla1llYXIgPSB5ZWFyIC0gMTtcbiAgICAgIHdlZWtOdW1iZXIgPSBsYXN0V2Vla051bWJlcih3ZWVrWWVhcik7XG4gICAgfSBlbHNlIGlmICh3ZWVrTnVtYmVyID4gbGFzdFdlZWtOdW1iZXIoeWVhcikpIHtcbiAgICAgIHdlZWtZZWFyID0geWVhciArIDE7XG4gICAgICB3ZWVrTnVtYmVyID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2Vla1llYXIgPSB5ZWFyO1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgd2Vla1llYXI6IHdlZWtZZWFyLCB3ZWVrTnVtYmVyOiB3ZWVrTnVtYmVyLCB3ZWVrZGF5OiB3ZWVrZGF5IH0sIFV0aWwudGltZU9iamVjdChncmVnT2JqKSk7XG4gIH07XG5cbiAgQ29udmVyc2lvbnMud2Vla1RvR3JlZ29yaWFuID0gZnVuY3Rpb24gd2Vla1RvR3JlZ29yaWFuKHdlZWtEYXRhKSB7XG4gICAgdmFyIHdlZWtZZWFyID0gd2Vla0RhdGEud2Vla1llYXIsXG4gICAgICAgIHdlZWtOdW1iZXIgPSB3ZWVrRGF0YS53ZWVrTnVtYmVyLFxuICAgICAgICB3ZWVrZGF5ID0gd2Vla0RhdGEud2Vla2RheSxcbiAgICAgICAgd2Vla2RheU9mSmFuNCA9IGRheU9mV2Vlayh3ZWVrWWVhciwgMSwgNCksXG4gICAgICAgIGRheXNJblllYXIgPSBVdGlsLmRheXNJblllYXIod2Vla1llYXIpO1xuXG4gICAgdmFyIG9yZGluYWwgPSB3ZWVrTnVtYmVyICogNyArIHdlZWtkYXkgLSB3ZWVrZGF5T2ZKYW40IC0gMyxcbiAgICAgICAgeWVhciA9IHZvaWQgMDtcblxuICAgIGlmIChvcmRpbmFsIDwgMSkge1xuICAgICAgeWVhciA9IHdlZWtZZWFyIC0gMTtcbiAgICAgIG9yZGluYWwgKz0gVXRpbC5kYXlzSW5ZZWFyKHllYXIpO1xuICAgIH0gZWxzZSBpZiAob3JkaW5hbCA+IGRheXNJblllYXIpIHtcbiAgICAgIHllYXIgPSB3ZWVrWWVhciArIDE7XG4gICAgICBvcmRpbmFsIC09IFV0aWwuZGF5c0luWWVhcih5ZWFyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgeWVhciA9IHdlZWtZZWFyO1xuICAgIH1cblxuICAgIHZhciBfdW5jb21wdXRlT3JkaW5hbCA9IHVuY29tcHV0ZU9yZGluYWwoeWVhciwgb3JkaW5hbCksXG4gICAgICAgIG1vbnRoID0gX3VuY29tcHV0ZU9yZGluYWwubW9udGgsXG4gICAgICAgIGRheSA9IF91bmNvbXB1dGVPcmRpbmFsLmRheTtcblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgeWVhcjogeWVhciwgbW9udGg6IG1vbnRoLCBkYXk6IGRheSB9LCBVdGlsLnRpbWVPYmplY3Qod2Vla0RhdGEpKTtcbiAgfTtcblxuICBDb252ZXJzaW9ucy5ncmVnb3JpYW5Ub09yZGluYWwgPSBmdW5jdGlvbiBncmVnb3JpYW5Ub09yZGluYWwoZ3JlZ0RhdGEpIHtcbiAgICB2YXIgeWVhciA9IGdyZWdEYXRhLnllYXIsXG4gICAgICAgIG1vbnRoID0gZ3JlZ0RhdGEubW9udGgsXG4gICAgICAgIGRheSA9IGdyZWdEYXRhLmRheSxcbiAgICAgICAgb3JkaW5hbCA9IGNvbXB1dGVPcmRpbmFsKHllYXIsIG1vbnRoLCBkYXkpO1xuXG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IHllYXI6IHllYXIsIG9yZGluYWw6IG9yZGluYWwgfSwgVXRpbC50aW1lT2JqZWN0KGdyZWdEYXRhKSk7XG4gIH07XG5cbiAgQ29udmVyc2lvbnMub3JkaW5hbFRvR3JlZ29yaWFuID0gZnVuY3Rpb24gb3JkaW5hbFRvR3JlZ29yaWFuKG9yZGluYWxEYXRhKSB7XG4gICAgdmFyIHllYXIgPSBvcmRpbmFsRGF0YS55ZWFyLFxuICAgICAgICBvcmRpbmFsID0gb3JkaW5hbERhdGEub3JkaW5hbCxcbiAgICAgICAgX3VuY29tcHV0ZU9yZGluYWwyID0gdW5jb21wdXRlT3JkaW5hbCh5ZWFyLCBvcmRpbmFsKSxcbiAgICAgICAgbW9udGggPSBfdW5jb21wdXRlT3JkaW5hbDIubW9udGgsXG4gICAgICAgIGRheSA9IF91bmNvbXB1dGVPcmRpbmFsMi5kYXk7XG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IHllYXI6IHllYXIsIG1vbnRoOiBtb250aCwgZGF5OiBkYXkgfSwgVXRpbC50aW1lT2JqZWN0KG9yZGluYWxEYXRhKSk7XG4gIH07XG5cbiAgQ29udmVyc2lvbnMuaGFzSW52YWxpZFdlZWtEYXRhID0gZnVuY3Rpb24gaGFzSW52YWxpZFdlZWtEYXRhKG9iaikge1xuICAgIHZhciB2YWxpZFllYXIgPSBVdGlsLmlzTnVtYmVyKG9iai53ZWVrWWVhciksXG4gICAgICAgIHZhbGlkV2VlayA9IFV0aWwubnVtYmVyQmV0d2VlbihvYmoud2Vla051bWJlciwgMSwgbGFzdFdlZWtOdW1iZXIob2JqLndlZWtZZWFyKSksXG4gICAgICAgIHZhbGlkV2Vla2RheSA9IFV0aWwubnVtYmVyQmV0d2VlbihvYmoud2Vla2RheSwgMSwgNyk7XG5cbiAgICBpZiAoIXZhbGlkWWVhcikge1xuICAgICAgcmV0dXJuICd3ZWVrWWVhciBvdXQgb2YgcmFuZ2UnO1xuICAgIH0gZWxzZSBpZiAoIXZhbGlkV2Vlaykge1xuICAgICAgcmV0dXJuICd3ZWVrIG91dCBvZiByYW5nZSc7XG4gICAgfSBlbHNlIGlmICghdmFsaWRXZWVrZGF5KSB7XG4gICAgICByZXR1cm4gJ3dlZWtkYXkgb3V0IG9mIHJhbmdlJztcbiAgICB9IGVsc2UgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIENvbnZlcnNpb25zLmhhc0ludmFsaWRPcmRpbmFsRGF0YSA9IGZ1bmN0aW9uIGhhc0ludmFsaWRPcmRpbmFsRGF0YShvYmopIHtcbiAgICB2YXIgdmFsaWRZZWFyID0gVXRpbC5pc051bWJlcihvYmoueWVhciksXG4gICAgICAgIHZhbGlkT3JkaW5hbCA9IFV0aWwubnVtYmVyQmV0d2VlbihvYmoub3JkaW5hbCwgMSwgVXRpbC5kYXlzSW5ZZWFyKG9iai55ZWFyKSk7XG5cbiAgICBpZiAoIXZhbGlkWWVhcikge1xuICAgICAgcmV0dXJuICd5ZWFyIG91dCBvZiByYW5nZSc7XG4gICAgfSBlbHNlIGlmICghdmFsaWRPcmRpbmFsKSB7XG4gICAgICByZXR1cm4gJ29yZGluYWwgb3V0IG9mIHJhbmdlJztcbiAgICB9IGVsc2UgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIENvbnZlcnNpb25zLmhhc0ludmFsaWRHcmVnb3JpYW5EYXRhID0gZnVuY3Rpb24gaGFzSW52YWxpZEdyZWdvcmlhbkRhdGEob2JqKSB7XG4gICAgdmFyIHZhbGlkWWVhciA9IFV0aWwuaXNOdW1iZXIob2JqLnllYXIpLFxuICAgICAgICB2YWxpZE1vbnRoID0gVXRpbC5udW1iZXJCZXR3ZWVuKG9iai5tb250aCwgMSwgMTIpLFxuICAgICAgICB2YWxpZERheSA9IFV0aWwubnVtYmVyQmV0d2VlbihvYmouZGF5LCAxLCBVdGlsLmRheXNJbk1vbnRoKG9iai55ZWFyLCBvYmoubW9udGgpKTtcblxuICAgIGlmICghdmFsaWRZZWFyKSB7XG4gICAgICByZXR1cm4gJ3llYXIgb3V0IG9mIHJhbmdlJztcbiAgICB9IGVsc2UgaWYgKCF2YWxpZE1vbnRoKSB7XG4gICAgICByZXR1cm4gJ21vbnRoIG91dCBvZiByYW5nZSc7XG4gICAgfSBlbHNlIGlmICghdmFsaWREYXkpIHtcbiAgICAgIHJldHVybiAnZGF5IG91dCBvZiByYW5nZSc7XG4gICAgfSBlbHNlIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBDb252ZXJzaW9ucy5oYXNJbnZhbGlkVGltZURhdGEgPSBmdW5jdGlvbiBoYXNJbnZhbGlkVGltZURhdGEob2JqKSB7XG4gICAgdmFyIHZhbGlkSG91ciA9IFV0aWwubnVtYmVyQmV0d2VlbihvYmouaG91ciwgMCwgMjMpLFxuICAgICAgICB2YWxpZE1pbnV0ZSA9IFV0aWwubnVtYmVyQmV0d2VlbihvYmoubWludXRlLCAwLCA1OSksXG4gICAgICAgIHZhbGlkU2Vjb25kID0gVXRpbC5udW1iZXJCZXR3ZWVuKG9iai5zZWNvbmQsIDAsIDU5KSxcbiAgICAgICAgdmFsaWRNaWxsaXNlY29uZCA9IFV0aWwubnVtYmVyQmV0d2VlbihvYmoubWlsbGlzZWNvbmQsIDAsIDk5OSk7XG5cbiAgICBpZiAoIXZhbGlkSG91cikge1xuICAgICAgcmV0dXJuICdob3VyIG91dCBvZiByYW5nZSc7XG4gICAgfSBlbHNlIGlmICghdmFsaWRNaW51dGUpIHtcbiAgICAgIHJldHVybiAnbWludXRlIG91dCBvZiByYW5nZSc7XG4gICAgfSBlbHNlIGlmICghdmFsaWRTZWNvbmQpIHtcbiAgICAgIHJldHVybiAnc2Vjb25kIG91dCBvZiByYW5nZSc7XG4gICAgfSBlbHNlIGlmICghdmFsaWRNaWxsaXNlY29uZCkge1xuICAgICAgcmV0dXJuICdtaWxsaXNlY29uZCBvdXQgb2YgcmFuZ2UnO1xuICAgIH0gZWxzZSByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgcmV0dXJuIENvbnZlcnNpb25zO1xufSgpO1xuXG52YXIgSU5WQUxJRCA9ICdJbnZhbGlkIERhdGVUaW1lJztcbnZhciBJTlZBTElEX0lOUFVUID0gJ2ludmFsaWQgaW5wdXQnO1xudmFyIFVOU1VQUE9SVEVEX1pPTkUgPSAndW5zdXBwb3J0ZWQgem9uZSc7XG52YXIgVU5QQVJTQUJMRSA9ICd1bnBhcnNhYmxlJztcblxuLy8gd2UgY2FjaGUgd2VlayBkYXRhIG9uIHRoZSBEVCBvYmplY3QgYW5kIHRoaXMgaW50ZXJtZWRpYXRlcyB0aGUgY2FjaGVcbmZ1bmN0aW9uIHBvc3NpYmx5Q2FjaGVkV2Vla0RhdGEoZHQpIHtcbiAgaWYgKGR0LndlZWtEYXRhID09PSBudWxsKSB7XG4gICAgZHQud2Vla0RhdGEgPSBDb252ZXJzaW9ucy5ncmVnb3JpYW5Ub1dlZWsoZHQuYyk7XG4gIH1cbiAgcmV0dXJuIGR0LndlZWtEYXRhO1xufVxuXG4vLyBjbG9uZSByZWFsbHkgbWVhbnMsIFwibWFrZSBhIG5ldyBvYmplY3Qgd2l0aCB0aGVzZSBtb2RpZmljYXRpb25zXCIuIGFsbCBcInNldHRlcnNcIiByZWFsbHkgdXNlIHRoaXNcbi8vIHRvIGNyZWF0ZSBhIG5ldyBvYmplY3Qgd2hpbGUgb25seSBjaGFuZ2luZyBzb21lIG9mIHRoZSBwcm9wZXJ0aWVzXG5mdW5jdGlvbiBjbG9uZShpbnN0LCBhbHRzKSB7XG4gIHZhciBjdXJyZW50ID0ge1xuICAgIHRzOiBpbnN0LnRzLFxuICAgIHpvbmU6IGluc3Quem9uZSxcbiAgICBjOiBpbnN0LmMsXG4gICAgbzogaW5zdC5vLFxuICAgIGxvYzogaW5zdC5sb2MsXG4gICAgaW52YWxpZFJlYXNvbjogaW5zdC5pbnZhbGlkUmVhc29uXG4gIH07XG4gIHJldHVybiBuZXcgRGF0ZVRpbWUoT2JqZWN0LmFzc2lnbih7fSwgY3VycmVudCwgYWx0cywgeyBvbGQ6IGN1cnJlbnQgfSkpO1xufVxuXG4vLyBmaW5kIHRoZSByaWdodCBvZmZzZXQgYSBnaXZlbiBsb2NhbCB0aW1lLiBUaGUgbyBpbnB1dCBpcyBvdXIgZ3Vlc3MsIHdoaWNoIGRldGVybWluZXMgd2hpY2hcbi8vIG9mZnNldCB3ZSdsbCBwaWNrIGluIGFtYmlndW91cyBjYXNlcyAoZS5nLiB0aGVyZSBhcmUgdHdvIDMgQU1zIGIvYyBGYWxsYmFjayBEU1QpXG5mdW5jdGlvbiBmaXhPZmZzZXQobG9jYWxUUywgbywgdHopIHtcbiAgLy8gT3VyIFVUQyB0aW1lIGlzIGp1c3QgYSBndWVzcyBiZWNhdXNlIG91ciBvZmZzZXQgaXMganVzdCBhIGd1ZXNzXG4gIHZhciB1dGNHdWVzcyA9IGxvY2FsVFMgLSBvICogNjAgKiAxMDAwO1xuXG4gIC8vIFRlc3Qgd2hldGhlciB0aGUgem9uZSBtYXRjaGVzIHRoZSBvZmZzZXQgZm9yIHRoaXMgdHNcbiAgdmFyIG8yID0gdHoub2Zmc2V0KHV0Y0d1ZXNzKTtcblxuICAvLyBJZiBzbywgb2Zmc2V0IGRpZG4ndCBjaGFuZ2UgYW5kIHdlJ3JlIGRvbmVcbiAgaWYgKG8gPT09IG8yKSB7XG4gICAgcmV0dXJuIFt1dGNHdWVzcywgb107XG4gIH1cblxuICAvLyBJZiBub3QsIGNoYW5nZSB0aGUgdHMgYnkgdGhlIGRpZmZlcmVuY2UgaW4gdGhlIG9mZnNldFxuICB1dGNHdWVzcyAtPSAobzIgLSBvKSAqIDYwICogMTAwMDtcblxuICAvLyBJZiB0aGF0IGdpdmVzIHVzIHRoZSBsb2NhbCB0aW1lIHdlIHdhbnQsIHdlJ3JlIGRvbmVcbiAgdmFyIG8zID0gdHoub2Zmc2V0KHV0Y0d1ZXNzKTtcbiAgaWYgKG8yID09PSBvMykge1xuICAgIHJldHVybiBbdXRjR3Vlc3MsIG8yXTtcbiAgfVxuXG4gIC8vIElmIGl0J3MgZGlmZmVyZW50LCB3ZSdyZSBpbiBhIGhvbGUgdGltZS4gVGhlIG9mZnNldCBoYXMgY2hhbmdlZCwgYnV0IHRoZSB3ZSBkb24ndCBhZGp1c3QgdGhlIHRpbWVcbiAgcmV0dXJuIFtsb2NhbFRTIC0gTWF0aC5taW4obzIsIG8zKSAqIDYwICogMTAwMCwgTWF0aC5tYXgobzIsIG8zKV07XG59XG5cbi8vIGNvbnZlcnQgYW4gZXBvY2ggdGltZXN0YW1wIGludG8gYSBjYWxlbmRhciBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gb2Zmc2V0XG5mdW5jdGlvbiB0c1RvT2JqKHRzLCBvZmZzZXQpIHtcbiAgdHMgKz0gb2Zmc2V0ICogNjAgKiAxMDAwO1xuXG4gIHZhciBkID0gbmV3IERhdGUodHMpO1xuXG4gIHJldHVybiB7XG4gICAgeWVhcjogZC5nZXRVVENGdWxsWWVhcigpLFxuICAgIG1vbnRoOiBkLmdldFVUQ01vbnRoKCkgKyAxLFxuICAgIGRheTogZC5nZXRVVENEYXRlKCksXG4gICAgaG91cjogZC5nZXRVVENIb3VycygpLFxuICAgIG1pbnV0ZTogZC5nZXRVVENNaW51dGVzKCksXG4gICAgc2Vjb25kOiBkLmdldFVUQ1NlY29uZHMoKSxcbiAgICBtaWxsaXNlY29uZDogZC5nZXRVVENNaWxsaXNlY29uZHMoKVxuICB9O1xufVxuXG4vLyBjb3ZlcnQgYSBjYWxlbmRhciBvYmplY3QgdG8gYSBsb2NhbCB0aW1lc3RhbXAgKGVwb2NoLCBidXQgd2l0aCB0aGUgb2Zmc2V0IGJha2VkIGluKVxuZnVuY3Rpb24gb2JqVG9Mb2NhbFRTKG9iaikge1xuICB2YXIgZCA9IERhdGUuVVRDKG9iai55ZWFyLCBvYmoubW9udGggLSAxLCBvYmouZGF5LCBvYmouaG91ciwgb2JqLm1pbnV0ZSwgb2JqLnNlY29uZCwgb2JqLm1pbGxpc2Vjb25kKTtcblxuICAvLyBqYXZhc2NyaXB0IGlzIHN0dXBpZCBhbmQgaSBoYXRlIGl0XG4gIGlmIChvYmoueWVhciA8IDEwMCAmJiBvYmoueWVhciA+PSAwKSB7XG4gICAgZCA9IG5ldyBEYXRlKGQpO1xuICAgIGQuc2V0VVRDRnVsbFllYXIob2JqLnllYXIpO1xuICB9XG4gIHJldHVybiArZDtcbn1cblxuLy8gY29udmVydCBhIGNhbGVuZGFyIG9iamVjdCB0byBhIGVwb2NoIHRpbWVzdGFtcFxuZnVuY3Rpb24gb2JqVG9UUyhvYmosIG9mZnNldCwgem9uZSkge1xuICByZXR1cm4gZml4T2Zmc2V0KG9ialRvTG9jYWxUUyhvYmopLCBvZmZzZXQsIHpvbmUpO1xufVxuXG4vLyBjcmVhdGUgYSBuZXcgRFQgaW5zdGFuY2UgYnkgYWRkaW5nIGEgZHVyYXRpb24sIGFkanVzdGluZyBmb3IgRFNUc1xuZnVuY3Rpb24gYWRqdXN0VGltZShpbnN0LCBkdXIpIHtcbiAgdmFyIG9QcmUgPSBpbnN0Lm8sXG4gICAgICBjID0gT2JqZWN0LmFzc2lnbih7fSwgaW5zdC5jLCB7XG4gICAgeWVhcjogaW5zdC5jLnllYXIgKyBkdXIueWVhcnMsXG4gICAgbW9udGg6IGluc3QuYy5tb250aCArIGR1ci5tb250aHMsXG4gICAgZGF5OiBpbnN0LmMuZGF5ICsgZHVyLmRheXMgKyBkdXIud2Vla3MgKiA3XG4gIH0pLFxuICAgICAgbWlsbGlzVG9BZGQgPSBEdXJhdGlvbi5mcm9tT2JqZWN0KHtcbiAgICBob3VyczogZHVyLmhvdXJzLFxuICAgIG1pbnV0ZXM6IGR1ci5taW51dGVzLFxuICAgIHNlY29uZHM6IGR1ci5zZWNvbmRzLFxuICAgIG1pbGxpc2Vjb25kczogZHVyLm1pbGxpc2Vjb25kc1xuICB9KS5hcygnbWlsbGlzZWNvbmRzJyksXG4gICAgICBsb2NhbFRTID0gb2JqVG9Mb2NhbFRTKGMpO1xuXG4gIHZhciBfZml4T2Zmc2V0ID0gZml4T2Zmc2V0KGxvY2FsVFMsIG9QcmUsIGluc3Quem9uZSksXG4gICAgICB0cyA9IF9maXhPZmZzZXRbMF0sXG4gICAgICBvID0gX2ZpeE9mZnNldFsxXTtcblxuICBpZiAobWlsbGlzVG9BZGQgIT09IDApIHtcbiAgICB0cyArPSBtaWxsaXNUb0FkZDtcbiAgICAvLyB0aGF0IGNvdWxkIGhhdmUgY2hhbmdlZCB0aGUgb2Zmc2V0IGJ5IGdvaW5nIG92ZXIgYSBEU1QsIGJ1dCB3ZSB3YW50IHRvIGtlZXAgdGhlIHRzIHRoZSBzYW1lXG4gICAgbyA9IGluc3Quem9uZS5vZmZzZXQodHMpO1xuICB9XG5cbiAgcmV0dXJuIHsgdHM6IHRzLCBvOiBvIH07XG59XG5cbi8vIGhlbHBlciB1c2VmdWwgaW4gdHVybmluZyB0aGUgcmVzdWx0cyBvZiBwYXJzaW5nIGludG8gcmVhbCBkYXRlc1xuLy8gYnkgaGFuZGxpbmcgdGhlIHpvbmUgb3B0aW9uc1xuZnVuY3Rpb24gcGFyc2VEYXRhVG9EYXRlVGltZShwYXJzZWQsIHBhcnNlZFpvbmUsIG9wdHMpIHtcbiAgdmFyIHNldFpvbmUgPSBvcHRzLnNldFpvbmUsXG4gICAgICB6b25lID0gb3B0cy56b25lO1xuXG4gIGlmIChwYXJzZWQgJiYgT2JqZWN0LmtleXMocGFyc2VkKS5sZW5ndGggIT09IDApIHtcbiAgICB2YXIgaW50ZXJwcmV0YXRpb25ab25lID0gcGFyc2VkWm9uZSB8fCB6b25lLFxuICAgICAgICBpbnN0ID0gRGF0ZVRpbWUuZnJvbU9iamVjdChPYmplY3QuYXNzaWduKHBhcnNlZCwgb3B0cywge1xuICAgICAgem9uZTogaW50ZXJwcmV0YXRpb25ab25lXG4gICAgfSkpO1xuICAgIHJldHVybiBzZXRab25lID8gaW5zdCA6IGluc3Quc2V0Wm9uZSh6b25lKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gRGF0ZVRpbWUuaW52YWxpZChVTlBBUlNBQkxFKTtcbiAgfVxufVxuXG4vLyBpZiB5b3Ugd2FudCB0byBvdXRwdXQgYSB0ZWNobmljYWwgZm9ybWF0IChlLmcuIFJGQyAyODIyKSwgdGhpcyBoZWxwZXJcbi8vIGhlbHBzIGhhbmRsZSB0aGUgZGV0YWlsc1xuZnVuY3Rpb24gdG9UZWNoRm9ybWF0KGR0LCBmb3JtYXQpIHtcbiAgcmV0dXJuIGR0LmlzVmFsaWQgPyBGb3JtYXR0ZXIuY3JlYXRlKExvY2FsZS5jcmVhdGUoJ2VuLVVTJykpLmZvcm1hdERhdGVUaW1lRnJvbVN0cmluZyhkdCwgZm9ybWF0KSA6IG51bGw7XG59XG5cbi8vIHRlY2huaWNhbCB0aW1lIGZvcm1hdHMgKGUuZy4gdGhlIHRpbWUgcGFydCBvZiBJU08gODYwMSksIHRha2Ugc29tZSBvcHRpb25zXG4vLyBhbmQgdGhpcyBjb21tb25pemVzIHRoZWlyIGhhbmRsaW5nXG5mdW5jdGlvbiB0b1RlY2hUaW1lRm9ybWF0KGR0LCBfcmVmKSB7XG4gIHZhciBfcmVmJHN1cHByZXNzU2Vjb25kcyA9IF9yZWYuc3VwcHJlc3NTZWNvbmRzLFxuICAgICAgc3VwcHJlc3NTZWNvbmRzID0gX3JlZiRzdXBwcmVzc1NlY29uZHMgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX3JlZiRzdXBwcmVzc1NlY29uZHMsXG4gICAgICBfcmVmJHN1cHByZXNzTWlsbGlzZWMgPSBfcmVmLnN1cHByZXNzTWlsbGlzZWNvbmRzLFxuICAgICAgc3VwcHJlc3NNaWxsaXNlY29uZHMgPSBfcmVmJHN1cHByZXNzTWlsbGlzZWMgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX3JlZiRzdXBwcmVzc01pbGxpc2VjLFxuICAgICAgX3JlZiRpbmNsdWRlT2Zmc2V0ID0gX3JlZi5pbmNsdWRlT2Zmc2V0LFxuICAgICAgaW5jbHVkZU9mZnNldCA9IF9yZWYkaW5jbHVkZU9mZnNldCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IF9yZWYkaW5jbHVkZU9mZnNldCxcbiAgICAgIF9yZWYkaW5jbHVkZVpvbmUgPSBfcmVmLmluY2x1ZGVab25lLFxuICAgICAgaW5jbHVkZVpvbmUgPSBfcmVmJGluY2x1ZGVab25lID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IF9yZWYkaW5jbHVkZVpvbmUsXG4gICAgICBfcmVmJHNwYWNlWm9uZSA9IF9yZWYuc3BhY2Vab25lLFxuICAgICAgc3BhY2Vab25lID0gX3JlZiRzcGFjZVpvbmUgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX3JlZiRzcGFjZVpvbmU7XG5cbiAgdmFyIGZtdCA9ICdISDptbSc7XG5cbiAgaWYgKCFzdXBwcmVzc1NlY29uZHMgfHwgZHQuc2Vjb25kICE9PSAwIHx8IGR0Lm1pbGxpc2Vjb25kICE9PSAwKSB7XG4gICAgZm10ICs9ICc6c3MnO1xuICAgIGlmICghc3VwcHJlc3NNaWxsaXNlY29uZHMgfHwgZHQubWlsbGlzZWNvbmQgIT09IDApIHtcbiAgICAgIGZtdCArPSAnLlNTUyc7XG4gICAgfVxuICB9XG5cbiAgaWYgKChpbmNsdWRlWm9uZSB8fCBpbmNsdWRlT2Zmc2V0KSAmJiBzcGFjZVpvbmUpIHtcbiAgICBmbXQgKz0gJyAnO1xuICB9XG5cbiAgaWYgKGluY2x1ZGVab25lKSB7XG4gICAgZm10ICs9ICd6JztcbiAgfSBlbHNlIGlmIChpbmNsdWRlT2Zmc2V0KSB7XG4gICAgZm10ICs9ICdaWic7XG4gIH1cblxuICByZXR1cm4gdG9UZWNoRm9ybWF0KGR0LCBmbXQpO1xufVxuXG4vLyBkZWZhdWx0cyBmb3IgdW5zcGVjaWZpZWQgdW5pdHMgaW4gdGhlIHN1cHBvcnRlZCBjYWxlbmRhcnNcbnZhciBkZWZhdWx0VW5pdFZhbHVlcyA9IHtcbiAgbW9udGg6IDEsXG4gIGRheTogMSxcbiAgaG91cjogMCxcbiAgbWludXRlOiAwLFxuICBzZWNvbmQ6IDAsXG4gIG1pbGxpc2Vjb25kOiAwXG59O1xudmFyIGRlZmF1bHRXZWVrVW5pdFZhbHVlcyA9IHtcbiAgd2Vla051bWJlcjogMSxcbiAgd2Vla2RheTogMSxcbiAgaG91cjogMCxcbiAgbWludXRlOiAwLFxuICBzZWNvbmQ6IDAsXG4gIG1pbGxpc2Vjb25kOiAwXG59O1xudmFyIGRlZmF1bHRPcmRpbmFsVW5pdFZhbHVlcyA9IHtcbiAgb3JkaW5hbDogMSxcbiAgaG91cjogMCxcbiAgbWludXRlOiAwLFxuICBzZWNvbmQ6IDAsXG4gIG1pbGxpc2Vjb25kOiAwXG59O1xuXG4vLyBVbml0cyBpbiB0aGUgc3VwcG9ydGVkIGNhbGVuZGFycywgc29ydGVkIGJ5IGJpZ25lc3NcbnZhciBvcmRlcmVkVW5pdHMgPSBbJ3llYXInLCAnbW9udGgnLCAnZGF5JywgJ2hvdXInLCAnbWludXRlJywgJ3NlY29uZCcsICdtaWxsaXNlY29uZCddO1xudmFyIG9yZGVyZWRXZWVrVW5pdHMgPSBbJ3dlZWtZZWFyJywgJ3dlZWtOdW1iZXInLCAnd2Vla2RheScsICdob3VyJywgJ21pbnV0ZScsICdzZWNvbmQnLCAnbWlsbGlzZWNvbmQnXTtcbnZhciBvcmRlcmVkT3JkaW5hbFVuaXRzID0gWyd5ZWFyJywgJ29yZGluYWwnLCAnaG91cicsICdtaW51dGUnLCAnc2Vjb25kJywgJ21pbGxpc2Vjb25kJ107XG5cbi8vIHN0YW5kYXJkaXplIGNhc2UgYW5kIHBsdXJhbGl0eSBpbiB1bml0c1xuZnVuY3Rpb24gbm9ybWFsaXplVW5pdCh1bml0KSB7XG4gIHZhciBpZ25vcmVVbmtub3duID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcblxuICB2YXIgbm9ybWFsaXplZCA9IHtcbiAgICB5ZWFyOiAneWVhcicsXG4gICAgeWVhcnM6ICd5ZWFyJyxcbiAgICBtb250aDogJ21vbnRoJyxcbiAgICBtb250aHM6ICdtb250aCcsXG4gICAgZGF5OiAnZGF5JyxcbiAgICBkYXlzOiAnZGF5JyxcbiAgICBob3VyOiAnaG91cicsXG4gICAgaG91cnM6ICdob3VyJyxcbiAgICBtaW51dGU6ICdtaW51dGUnLFxuICAgIG1pbnV0ZXM6ICdtaW51dGUnLFxuICAgIHNlY29uZDogJ3NlY29uZCcsXG4gICAgc2Vjb25kczogJ3NlY29uZCcsXG4gICAgbWlsbGlzZWNvbmQ6ICdtaWxsaXNlY29uZCcsXG4gICAgbWlsbGlzZWNvbmRzOiAnbWlsbGlzZWNvbmQnLFxuICAgIHdlZWtkYXk6ICd3ZWVrZGF5JyxcbiAgICB3ZWVrZGF5czogJ3dlZWtkYXknLFxuICAgIHdlZWtudW1iZXI6ICd3ZWVrTnVtYmVyJyxcbiAgICB3ZWVrc251bWJlcjogJ3dlZWtOdW1iZXInLFxuICAgIHdlZWtudW1iZXJzOiAnd2Vla051bWJlcicsXG4gICAgd2Vla3llYXI6ICd3ZWVrWWVhcicsXG4gICAgd2Vla3llYXJzOiAnd2Vla1llYXInLFxuICAgIG9yZGluYWw6ICdvcmRpbmFsJ1xuICB9W3VuaXQgPyB1bml0LnRvTG93ZXJDYXNlKCkgOiB1bml0XTtcblxuICBpZiAoIWlnbm9yZVVua25vd24gJiYgIW5vcm1hbGl6ZWQpIHRocm93IG5ldyBJbnZhbGlkVW5pdEVycm9yKHVuaXQpO1xuXG4gIHJldHVybiBub3JtYWxpemVkO1xufVxuXG4vLyB0aGlzIGlzIGEgZHVtYmVkIGRvd24gdmVyc2lvbiBvZiBmcm9tT2JqZWN0KCkgdGhhdCBydW5zIGFib3V0IDYwJSBmYXN0ZXJcbi8vIGJ1dCBkb2Vzbid0IGRvIGFueSB2YWxpZGF0aW9uLCBtYWtlcyBhIGJ1bmNoIG9mIGFzc3VtcHRpb25zIGFib3V0IHdoYXQgdW5pdHNcbi8vIGFyZSBwcmVzZW50LCBhbmQgc28gb24uXG5mdW5jdGlvbiBxdWlja0RUKG9iaiwgem9uZSkge1xuICAvLyBhc3N1bWUgd2UgaGF2ZSB0aGUgaGlnaGVyLW9yZGVyIHVuaXRzXG4gIGZvciAodmFyIF9pdGVyYXRvciA9IG9yZGVyZWRVbml0cywgX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5KF9pdGVyYXRvciksIF9pID0gMCwgX2l0ZXJhdG9yID0gX2lzQXJyYXkgPyBfaXRlcmF0b3IgOiBfaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICB2YXIgX3JlZjI7XG5cbiAgICBpZiAoX2lzQXJyYXkpIHtcbiAgICAgIGlmIChfaSA+PSBfaXRlcmF0b3IubGVuZ3RoKSBicmVhaztcbiAgICAgIF9yZWYyID0gX2l0ZXJhdG9yW19pKytdO1xuICAgIH0gZWxzZSB7XG4gICAgICBfaSA9IF9pdGVyYXRvci5uZXh0KCk7XG4gICAgICBpZiAoX2kuZG9uZSkgYnJlYWs7XG4gICAgICBfcmVmMiA9IF9pLnZhbHVlO1xuICAgIH1cblxuICAgIHZhciB1ID0gX3JlZjI7XG5cbiAgICBpZiAoVXRpbC5pc1VuZGVmaW5lZChvYmpbdV0pKSB7XG4gICAgICBvYmpbdV0gPSBkZWZhdWx0VW5pdFZhbHVlc1t1XTtcbiAgICB9XG4gIH1cblxuICB2YXIgaW52YWxpZFJlYXNvbiA9IENvbnZlcnNpb25zLmhhc0ludmFsaWRHcmVnb3JpYW5EYXRhKG9iaikgfHwgQ29udmVyc2lvbnMuaGFzSW52YWxpZFRpbWVEYXRhKG9iaik7XG4gIGlmIChpbnZhbGlkUmVhc29uKSB7XG4gICAgcmV0dXJuIERhdGVUaW1lLmludmFsaWQoaW52YWxpZFJlYXNvbik7XG4gIH1cblxuICB2YXIgdHNOb3cgPSBTZXR0aW5ncy5ub3coKSxcbiAgICAgIG9mZnNldFByb3ZpcyA9IHpvbmUub2Zmc2V0KHRzTm93KSxcbiAgICAgIF9vYmpUb1RTID0gb2JqVG9UUyhvYmosIG9mZnNldFByb3Zpcywgem9uZSksXG4gICAgICB0cyA9IF9vYmpUb1RTWzBdLFxuICAgICAgbyA9IF9vYmpUb1RTWzFdO1xuXG5cbiAgcmV0dXJuIG5ldyBEYXRlVGltZSh7XG4gICAgdHM6IHRzLFxuICAgIHpvbmU6IHpvbmUsXG4gICAgbzogb1xuICB9KTtcbn1cblxuLyoqXG4gKiBBIERhdGVUaW1lIGlzIGFuIGltbXV0YWJsZSBkYXRhIHN0cnVjdHVyZSByZXByZXNlbnRpbmcgYSBzcGVjaWZpYyBkYXRlIGFuZCB0aW1lIGFuZCBhY2NvbXBhbnlpbmcgbWV0aG9kcy4gSXQgY29udGFpbnMgY2xhc3MgYW5kIGluc3RhbmNlIG1ldGhvZHMgZm9yIGNyZWF0aW5nLCBwYXJzaW5nLCBpbnRlcnJvZ2F0aW5nLCB0cmFuc2Zvcm1pbmcsIGFuZCBmb3JtYXR0aW5nIHRoZW0uXG4gKlxuICogQSBEYXRlVGltZSBjb21wcmlzZXMgb2Y6XG4gKiAqIEEgdGltZXN0YW1wLiBFYWNoIERhdGVUaW1lIGluc3RhbmNlIHJlZmVycyB0byBhIHNwZWNpZmljIG1pbGxpc2Vjb25kIG9mIHRoZSBVbml4IGVwb2NoLlxuICogKiBBIHRpbWUgem9uZS4gRWFjaCBpbnN0YW5jZSBpcyBjb25zaWRlcmVkIGluIHRoZSBjb250ZXh0IG9mIGEgc3BlY2lmaWMgem9uZSAoYnkgZGVmYXVsdCB0aGUgbG9jYWwgc3lzdGVtJ3Mgem9uZSkuXG4gKiAqIENvbmZpZ3VyYXRpb24gcHJvcGVydGllcyB0aGF0IGVmZmVjdCBob3cgb3V0cHV0IHN0cmluZ3MgYXJlIGZvcm1hdHRlZCwgc3VjaCBhcyBgbG9jYWxlYCwgYG51bWJlcmluZ1N5c3RlbWAsIGFuZCBgb3V0cHV0Q2FsZW5kYXJgLlxuICpcbiAqIEhlcmUgaXMgYSBicmllZiBvdmVydmlldyBvZiB0aGUgbW9zdCBjb21tb25seSB1c2VkIGZ1bmN0aW9uYWxpdHkgaXQgcHJvdmlkZXM6XG4gKlxuICogKiAqKkNyZWF0aW9uKio6IFRvIGNyZWF0ZSBhIERhdGVUaW1lIGZyb20gaXRzIGNvbXBvbmVudHMsIHVzZSBvbmUgb2YgaXRzIGZhY3RvcnkgY2xhc3MgbWV0aG9kczoge0BsaW5rIGxvY2FsfSwge0BsaW5rIHV0Y30sIGFuZCAobW9zdCBmbGV4aWJseSkge0BsaW5rIGZyb21PYmplY3R9LiBUbyBjcmVhdGUgb25lIGZyb20gYSBzdGFuZGFyZCBzdHJpbmcgZm9ybWF0LCB1c2Uge0BsaW5rIGZyb21JU099LCB7QGxpbmsgZnJvbUhUVFB9LCBhbmQge0BsaW5rIGZyb21SRkMyODIyfS4gVG8gY3JlYXRlIG9uZSBmcm9tIGEgY3VzdG9tIHN0cmluZyBmb3JtYXQsIHVzZSB7QGxpbmsgZnJvbUZvcm1hdH0uIFRvIGNyZWF0ZSBvbmUgZnJvbSBhIG5hdGl2ZSBKUyBkYXRlLCB1c2Uge0BsaW5rIGZyb21KU0RhdGV9LlxuICogKiAqKkdyZWdvcmlhbiBjYWxlbmRhciBhbmQgdGltZSoqOiBUbyBleGFtaW5lIHRoZSBHcmVnb3JpYW4gcHJvcGVydGllcyBvZiBhIERhdGVUaW1lIGluZGl2aWR1YWxseSAoaS5lIGFzIG9wcG9zZWQgdG8gY29sbGVjdGl2ZWx5IHRocm91Z2gge0BsaW5rIHRvT2JqZWN0fSksIHVzZSB0aGUge0BsaW5rIHllYXJ9LCB7QGxpbmsgbW9udGh9LFxuICoge0BsaW5rIGRheX0sIHtAbGluayBob3VyfSwge0BsaW5rIG1pbnV0ZX0sIHtAbGluayBzZWNvbmR9LCB7QGxpbmsgbWlsbGlzZWNvbmR9IGFjY2Vzc29ycy5cbiAqICogKipXZWVrIGNhbGVuZGFyKio6IEZvciBJU08gd2VlayBjYWxlbmRhciBhdHRyaWJ1dGVzLCBzZWUgdGhlIHtAbGluayB3ZWVrWWVhcn0sIHtAbGluayB3ZWVrTnVtYmVyfSwgYW5kIHtAbGluayB3ZWVrZGF5fSBhY2Nlc3NvcnMuXG4gKiAqICoqQ29uZmlndXJhdGlvbioqIFNlZSB0aGUge0BsaW5rIGxvY2FsZX0gYW5kIHtAbGluayBudW1iZXJpbmdTeXN0ZW19IGFjY2Vzc29ycy5cbiAqICogKipUcmFuc2Zvcm1hdGlvbioqOiBUbyB0cmFuc2Zvcm0gdGhlIERhdGVUaW1lIGludG8gb3RoZXIgRGF0ZVRpbWVzLCB1c2Uge0BsaW5rIHNldH0sIHtAbGluayByZWNvbmZpZ3VyZX0sIHtAbGluayBzZXRab25lfSwge0BsaW5rIHNldExvY2FsZX0sIHtAbGluayBwbHVzfSwge0BsaW5rIG1pbnVzfSwge0BsaW5rIGVuZE9mfSwge0BsaW5rIHN0YXJ0T2Z9LCB7QGxpbmsgdG9VVEN9LCBhbmQge0BsaW5rIHRvTG9jYWx9LlxuICogKiAqKk91dHB1dCoqOiBUbyBjb252ZXJ0IHRoZSBEYXRlVGltZSB0byBvdGhlciByZXByZXNlbnRhdGlvbnMsIHVzZSB0aGUge0BsaW5rIHRvSlNPTn0sIHtAbGluayB0b0lTT30sIHtAbGluayB0b0hUVFB9LCB7QGxpbmsgdG9PYmplY3R9LCB7QGxpbmsgdG9SRkMyODIyfSwge0BsaW5rIHRvU3RyaW5nfSwge0BsaW5rIHRvTG9jYWxlU3RyaW5nfSwge0BsaW5rIHRvRm9ybWF0fSwge0BsaW5rIHZhbHVlT2Z9IGFuZCB7QGxpbmsgdG9KU0RhdGV9LlxuICpcbiAqIFRoZXJlJ3MgcGxlbnR5IG90aGVycyBkb2N1bWVudGVkIGJlbG93LiBJbiBhZGRpdGlvbiwgZm9yIG1vcmUgaW5mb3JtYXRpb24gb24gc3VidGxlciB0b3BpY3MgbGlrZSBpbnRlcm5hdGlvbmFsaXphdGlvbiwgdGltZSB6b25lcywgYWx0ZXJuYXRpdmUgY2FsZW5kYXJzLCB2YWxpZGl0eSwgYW5kIHNvIG9uLCBzZWUgdGhlIGV4dGVybmFsIGRvY3VtZW50YXRpb24uXG4gKi9cbnZhciBEYXRlVGltZSA9IGZ1bmN0aW9uICgpIHtcbiAgLyoqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gRGF0ZVRpbWUoY29uZmlnKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgRGF0ZVRpbWUpO1xuXG4gICAgdmFyIHpvbmUgPSBjb25maWcuem9uZSB8fCBTZXR0aW5ncy5kZWZhdWx0Wm9uZSxcbiAgICAgICAgaW52YWxpZFJlYXNvbiA9IGNvbmZpZy5pbnZhbGlkUmVhc29uIHx8IChOdW1iZXIuaXNOYU4oY29uZmlnLnRzKSA/IElOVkFMSURfSU5QVVQgOiBudWxsKSB8fCAoIXpvbmUuaXNWYWxpZCA/IFVOU1VQUE9SVEVEX1pPTkUgOiBudWxsKTtcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnRzID0gVXRpbC5pc1VuZGVmaW5lZChjb25maWcudHMpID8gU2V0dGluZ3Mubm93KCkgOiBjb25maWcudHM7XG5cbiAgICB2YXIgYyA9IG51bGwsXG4gICAgICAgIG8gPSBudWxsO1xuICAgIGlmICghaW52YWxpZFJlYXNvbikge1xuICAgICAgdmFyIHVuY2hhbmdlZCA9IGNvbmZpZy5vbGQgJiYgY29uZmlnLm9sZC50cyA9PT0gdGhpcy50cyAmJiBjb25maWcub2xkLnpvbmUuZXF1YWxzKHpvbmUpO1xuICAgICAgYyA9IHVuY2hhbmdlZCA/IGNvbmZpZy5vbGQuYyA6IHRzVG9PYmoodGhpcy50cywgem9uZS5vZmZzZXQodGhpcy50cykpO1xuICAgICAgbyA9IHVuY2hhbmdlZCA/IGNvbmZpZy5vbGQubyA6IHpvbmUub2Zmc2V0KHRoaXMudHMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuem9uZSA9IHpvbmU7XG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5sb2MgPSBjb25maWcubG9jIHx8IExvY2FsZS5jcmVhdGUoKTtcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmludmFsaWQgPSBpbnZhbGlkUmVhc29uO1xuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMud2Vla0RhdGEgPSBudWxsO1xuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuYyA9IGM7XG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5vID0gbztcbiAgfVxuXG4gIC8vIENPTlNUUlVDVFxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBsb2NhbCBEYXRlVGltZVxuICAgKiBAcGFyYW0ge251bWJlcn0geWVhciAtIFRoZSBjYWxlbmRhciB5ZWFyLiBJZiBvbWl0dGVkIChhcyBpbiwgY2FsbCBgbG9jYWwoKWAgd2l0aCBubyBhcmd1bWVudHMpLCB0aGUgY3VycmVudCB0aW1lIHdpbGwgYmUgdXNlZFxuICAgKiBAcGFyYW0ge251bWJlcn0gW21vbnRoPTFdIC0gVGhlIG1vbnRoLCAxLWluZGV4ZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IFtkYXk9MV0gLSBUaGUgZGF5IG9mIHRoZSBtb250aFxuICAgKiBAcGFyYW0ge251bWJlcn0gW2hvdXI9MF0gLSBUaGUgaG91ciBvZiB0aGUgZGF5LCBpbiAyNC1ob3VyIHRpbWVcbiAgICogQHBhcmFtIHtudW1iZXJ9IFttaW51dGU9MF0gLSBUaGUgbWludXRlIG9mIHRoZSBob3VyLCBpLmUuIGEgbnVtYmVyIGJldHdlZW4gMCBhbmQgNTlcbiAgICogQHBhcmFtIHtudW1iZXJ9IFtzZWNvbmQ9MF0gLSBUaGUgc2Vjb25kIG9mIHRoZSBtaW51dGUsIGkuZS4gYSBudW1iZXIgYmV0d2VlbiAwIGFuZCA1OVxuICAgKiBAcGFyYW0ge251bWJlcn0gW21pbGxpc2Vjb25kPTBdIC0gVGhlIG1pbGxpc2Vjb25kIG9mIHRoZSBzZWNvbmQsIGkuZS4gYSBudW1iZXIgYmV0d2VlbiAwIGFuZCA5OTlcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL34+IG5vd1xuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgyMDE3KSAgICAgICAgICAgICAgICAgICAgICAgIC8vfj4gMjAxNy0wMS0wMVQwMDowMDowMFxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgyMDE3LCAzKSAgICAgICAgICAgICAgICAgICAgIC8vfj4gMjAxNy0wMy0wMVQwMDowMDowMFxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgyMDE3LCAzLCAxMikgICAgICAgICAgICAgICAgIC8vfj4gMjAxNy0wMy0xMlQwMDowMDowMFxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgyMDE3LCAzLCAxMiwgNSkgICAgICAgICAgICAgIC8vfj4gMjAxNy0wMy0xMlQwNTowMDowMFxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgyMDE3LCAzLCAxMiwgNSwgNDUpICAgICAgICAgIC8vfj4gMjAxNy0wMy0xMlQwNTo0NTowMFxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgyMDE3LCAzLCAxMiwgNSwgNDUsIDEwKSAgICAgIC8vfj4gMjAxNy0wMy0xMlQwNTo0NToxMFxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgyMDE3LCAzLCAxMiwgNSwgNDUsIDEwLCA3NjUpIC8vfj4gMjAxNy0wMy0xMlQwNTo0NToxMC42NzVcbiAgICogQHJldHVybiB7RGF0ZVRpbWV9XG4gICAqL1xuXG5cbiAgRGF0ZVRpbWUubG9jYWwgPSBmdW5jdGlvbiBsb2NhbCh5ZWFyLCBtb250aCwgZGF5LCBob3VyLCBtaW51dGUsIHNlY29uZCwgbWlsbGlzZWNvbmQpIHtcbiAgICBpZiAoVXRpbC5pc1VuZGVmaW5lZCh5ZWFyKSkge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlVGltZSh7IHRzOiBTZXR0aW5ncy5ub3coKSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHF1aWNrRFQoe1xuICAgICAgICB5ZWFyOiB5ZWFyLFxuICAgICAgICBtb250aDogbW9udGgsXG4gICAgICAgIGRheTogZGF5LFxuICAgICAgICBob3VyOiBob3VyLFxuICAgICAgICBtaW51dGU6IG1pbnV0ZSxcbiAgICAgICAgc2Vjb25kOiBzZWNvbmQsXG4gICAgICAgIG1pbGxpc2Vjb25kOiBtaWxsaXNlY29uZFxuICAgICAgfSwgU2V0dGluZ3MuZGVmYXVsdFpvbmUpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgRGF0ZVRpbWUgaW4gVVRDXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIC0gVGhlIGNhbGVuZGFyIHllYXIuIElmIG9taXR0ZWQgKGFzIGluLCBjYWxsIGB1dGMoKWAgd2l0aCBubyBhcmd1bWVudHMpLCB0aGUgY3VycmVudCB0aW1lIHdpbGwgYmUgdXNlZFxuICAgKiBAcGFyYW0ge251bWJlcn0gW21vbnRoPTFdIC0gVGhlIG1vbnRoLCAxLWluZGV4ZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IFtkYXk9MV0gLSBUaGUgZGF5IG9mIHRoZSBtb250aFxuICAgKiBAcGFyYW0ge251bWJlcn0gW2hvdXI9MF0gLSBUaGUgaG91ciBvZiB0aGUgZGF5LCBpbiAyNC1ob3VyIHRpbWVcbiAgICogQHBhcmFtIHtudW1iZXJ9IFttaW51dGU9MF0gLSBUaGUgbWludXRlIG9mIHRoZSBob3VyLCBpLmUuIGEgbnVtYmVyIGJldHdlZW4gMCBhbmQgNTlcbiAgICogQHBhcmFtIHtudW1iZXJ9IFtzZWNvbmQ9MF0gLSBUaGUgc2Vjb25kIG9mIHRoZSBtaW51dGUsIGkuZS4gYSBudW1iZXIgYmV0d2VlbiAwIGFuZCA1OVxuICAgKiBAcGFyYW0ge251bWJlcn0gW21pbGxpc2Vjb25kPTBdIC0gVGhlIG1pbGxpc2Vjb25kIG9mIHRoZSBzZWNvbmQsIGkuZS4gYSBudW1iZXIgYmV0d2VlbiAwIGFuZCA5OTlcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUudXRjKCkgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9+PiBub3dcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUudXRjKDIwMTcpICAgICAgICAgICAgICAgICAgICAgICAgLy9+PiAyMDE3LTAxLTAxVDAwOjAwOjAwWlxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS51dGMoMjAxNywgMykgICAgICAgICAgICAgICAgICAgICAvL34+IDIwMTctMDMtMDFUMDA6MDA6MDBaXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLnV0YygyMDE3LCAzLCAxMikgICAgICAgICAgICAgICAgIC8vfj4gMjAxNy0wMy0xMlQwMDowMDowMFpcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUudXRjKDIwMTcsIDMsIDEyLCA1KSAgICAgICAgICAgICAgLy9+PiAyMDE3LTAzLTEyVDA1OjAwOjAwWlxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS51dGMoMjAxNywgMywgMTIsIDUsIDQ1KSAgICAgICAgICAvL34+IDIwMTctMDMtMTJUMDU6NDU6MDBaXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLnV0YygyMDE3LCAzLCAxMiwgNSwgNDUsIDEwKSAgICAgIC8vfj4gMjAxNy0wMy0xMlQwNTo0NToxMFpcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUudXRjKDIwMTcsIDMsIDEyLCA1LCA0NSwgMTAsIDc2NSkgLy9+PiAyMDE3LTAzLTEyVDA1OjQ1OjEwLjY3NVpcbiAgICogQHJldHVybiB7RGF0ZVRpbWV9XG4gICAqL1xuXG5cbiAgRGF0ZVRpbWUudXRjID0gZnVuY3Rpb24gdXRjKHllYXIsIG1vbnRoLCBkYXksIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCBtaWxsaXNlY29uZCkge1xuICAgIGlmIChVdGlsLmlzVW5kZWZpbmVkKHllYXIpKSB7XG4gICAgICByZXR1cm4gbmV3IERhdGVUaW1lKHtcbiAgICAgICAgdHM6IFNldHRpbmdzLm5vdygpLFxuICAgICAgICB6b25lOiBGaXhlZE9mZnNldFpvbmUudXRjSW5zdGFuY2VcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcXVpY2tEVCh7XG4gICAgICAgIHllYXI6IHllYXIsXG4gICAgICAgIG1vbnRoOiBtb250aCxcbiAgICAgICAgZGF5OiBkYXksXG4gICAgICAgIGhvdXI6IGhvdXIsXG4gICAgICAgIG1pbnV0ZTogbWludXRlLFxuICAgICAgICBzZWNvbmQ6IHNlY29uZCxcbiAgICAgICAgbWlsbGlzZWNvbmQ6IG1pbGxpc2Vjb25kXG4gICAgICB9LCBGaXhlZE9mZnNldFpvbmUudXRjSW5zdGFuY2UpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQ3JlYXRlIGFuIERhdGVUaW1lIGZyb20gYSBKYXZhc2NyaXB0IERhdGUgb2JqZWN0LiBVc2VzIHRoZSBkZWZhdWx0IHpvbmUuXG4gICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSAtIGEgSmF2YXNjcmlwdCBEYXRlIG9iamVjdFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgdGhlIERhdGVUaW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfFpvbmV9IFtvcHRpb25zLnpvbmU9J2xvY2FsJ10gLSB0aGUgem9uZSB0byBwbGFjZSB0aGUgRGF0ZVRpbWUgaW50b1xuICAgKiBAcmV0dXJuIHtEYXRlVGltZX1cbiAgICovXG5cblxuICBEYXRlVGltZS5mcm9tSlNEYXRlID0gZnVuY3Rpb24gZnJvbUpTRGF0ZShkYXRlKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgcmV0dXJuIG5ldyBEYXRlVGltZSh7XG4gICAgICB0czogVXRpbC5pc0RhdGUoZGF0ZSkgPyBkYXRlLnZhbHVlT2YoKSA6IE5hTixcbiAgICAgIHpvbmU6IFV0aWwubm9ybWFsaXplWm9uZShvcHRpb25zLnpvbmUpLFxuICAgICAgbG9jOiBMb2NhbGUuZnJvbU9iamVjdChvcHRpb25zKVxuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gRGF0ZVRpbWUgZnJvbSBhIGNvdW50IG9mIGVwb2NoIG1pbGxpc2Vjb25kcy4gVXNlcyB0aGUgZGVmYXVsdCB6b25lLlxuICAgKiBAcGFyYW0ge251bWJlcn0gbWlsbGlzZWNvbmRzIC0gYSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHNpbmNlIDE5NzAgVVRDXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gY29uZmlndXJhdGlvbiBvcHRpb25zIGZvciB0aGUgRGF0ZVRpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd8Wm9uZX0gW29wdGlvbnMuem9uZT0nbG9jYWwnXSAtIHRoZSB6b25lIHRvIHBsYWNlIHRoZSBEYXRlVGltZSBpbnRvXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5sb2NhbGVdIC0gYSBsb2NhbGUgdG8gc2V0IG9uIHRoZSByZXN1bHRpbmcgRGF0ZVRpbWUgaW5zdGFuY2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMub3V0cHV0Q2FsZW5kYXIgLSB0aGUgb3V0cHV0IGNhbGVuZGFyIHRvIHNldCBvbiB0aGUgcmVzdWx0aW5nIERhdGVUaW1lIGluc3RhbmNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLm51bWJlcmluZ1N5c3RlbSAtIHRoZSBudW1iZXJpbmcgc3lzdGVtIHRvIHNldCBvbiB0aGUgcmVzdWx0aW5nIERhdGVUaW1lIGluc3RhbmNlXG4gICAqIEByZXR1cm4ge0RhdGVUaW1lfVxuICAgKi9cblxuXG4gIERhdGVUaW1lLmZyb21NaWxsaXMgPSBmdW5jdGlvbiBmcm9tTWlsbGlzKG1pbGxpc2Vjb25kcykge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgIHJldHVybiBuZXcgRGF0ZVRpbWUoe1xuICAgICAgdHM6IG1pbGxpc2Vjb25kcyxcbiAgICAgIHpvbmU6IFV0aWwubm9ybWFsaXplWm9uZShvcHRpb25zLnpvbmUpLFxuICAgICAgbG9jOiBMb2NhbGUuZnJvbU9iamVjdChvcHRpb25zKVxuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gRGF0ZVRpbWUgZnJvbSBhIEphdmFzY3JpcHQgb2JqZWN0IHdpdGgga2V5cyBsaWtlICd5ZWFyJyBhbmQgJ2hvdXInIHdpdGggcmVhc29uYWJsZSBkZWZhdWx0cy5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9iaiAtIHRoZSBvYmplY3QgdG8gY3JlYXRlIHRoZSBEYXRlVGltZSBmcm9tXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBvYmoueWVhciAtIGEgeWVhciwgc3VjaCBhcyAxOTg3XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBvYmoubW9udGggLSBhIG1vbnRoLCAxLTEyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBvYmouZGF5IC0gYSBkYXkgb2YgdGhlIG1vbnRoLCAxLTMxLCBkZXBlbmRpbmcgb24gdGhlIG1vbnRoXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBvYmoub3JkaW5hbCAtIGRheSBvZiB0aGUgeWVhciwgMS0zNjUgb3IgMzY2XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBvYmoud2Vla1llYXIgLSBhbiBJU08gd2VlayB5ZWFyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBvYmoud2Vla051bWJlciAtIGFuIElTTyB3ZWVrIG51bWJlciwgYmV0d2VlbiAxIGFuZCA1MiBvciA1MywgZGVwZW5kaW5nIG9uIHRoZSB5ZWFyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBvYmoud2Vla2RheSAtIGFuIElTTyB3ZWVrZGF5LCAxLTcsIHdoZXJlIDEgaXMgTW9uZGF5IGFuZCA3IGlzIFN1bmRheVxuICAgKiBAcGFyYW0ge251bWJlcn0gb2JqLmhvdXIgLSBob3VyIG9mIHRoZSBkYXksIDAtMjNcbiAgICogQHBhcmFtIHtudW1iZXJ9IG9iai5taW51dGUgLSBtaW51dGUgb2YgdGhlIGhvdXIsIDAtNTlcbiAgICogQHBhcmFtIHtudW1iZXJ9IG9iai5zZWNvbmQgLSBzZWNvbmQgb2YgdGhlIG1pbnV0ZSwgMC01OVxuICAgKiBAcGFyYW0ge251bWJlcn0gb2JqLm1pbGxpc2Vjb25kIC0gbWlsbGlzZWNvbmQgb2YgdGhlIHNlY29uZCwgMC05OTlcbiAgICogQHBhcmFtIHtzdHJpbmd8Wm9uZX0gW29iai56b25lPSdsb2NhbCddIC0gaW50ZXJwcmV0IHRoZSBudW1iZXJzIGluIHRoZSBjb250ZXh0IG9mIGEgcGFydGljdWxhciB6b25lLiBDYW4gdGFrZSBhbnkgdmFsdWUgdGFrZW4gYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHNldFpvbmUoKVxuICAgKiBAcGFyYW0ge3N0cmluZ30gW29iai5sb2NhbGU9J2VuLVVTJ10gLSBhIGxvY2FsZSB0byBzZXQgb24gdGhlIHJlc3VsdGluZyBEYXRlVGltZSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gb2JqLm91dHB1dENhbGVuZGFyIC0gdGhlIG91dHB1dCBjYWxlbmRhciB0byBzZXQgb24gdGhlIHJlc3VsdGluZyBEYXRlVGltZSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gb2JqLm51bWJlcmluZ1N5c3RlbSAtIHRoZSBudW1iZXJpbmcgc3lzdGVtIHRvIHNldCBvbiB0aGUgcmVzdWx0aW5nIERhdGVUaW1lIGluc3RhbmNlXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLmZyb21PYmplY3QoeyB5ZWFyOiAxOTgyLCBtb250aDogNSwgZGF5OiAyNX0pLnRvSVNPRGF0ZSgpIC8vPT4gJzE5ODItMDUtMjUnXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLmZyb21PYmplY3QoeyB5ZWFyOiAxOTgyIH0pLnRvSVNPRGF0ZSgpIC8vPT4gJzE5ODItMDEtMDFUMDAnXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLmZyb21PYmplY3QoeyBob3VyOiAxMCwgbWludXRlOiAyNiwgc2Vjb25kOiA2IH0pIC8vfj4gdG9kYXkgYXQgMTA6MjY6MDZcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUuZnJvbU9iamVjdCh7IGhvdXI6IDEwLCBtaW51dGU6IDI2LCBzZWNvbmQ6IDYsIHpvbmU6ICd1dGMnIH0pLFxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5mcm9tT2JqZWN0KHsgaG91cjogMTAsIG1pbnV0ZTogMjYsIHNlY29uZDogNiwgem9uZTogJ2xvY2FsJyB9KVxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5mcm9tT2JqZWN0KHsgaG91cjogMTAsIG1pbnV0ZTogMjYsIHNlY29uZDogNiwgem9uZTogJ0FtZXJpY2EvTmV3X1lvcmsnIH0pXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLmZyb21PYmplY3QoeyB3ZWVrWWVhcjogMjAxNiwgd2Vla051bWJlcjogMiwgd2Vla2RheTogMyB9KS50b0lTT0RhdGUoKSAvLz0+ICcyMDE2LTAxLTEzJ1xuICAgKiBAcmV0dXJuIHtEYXRlVGltZX1cbiAgICovXG5cblxuICBEYXRlVGltZS5mcm9tT2JqZWN0ID0gZnVuY3Rpb24gZnJvbU9iamVjdChvYmopIHtcbiAgICB2YXIgem9uZVRvVXNlID0gVXRpbC5ub3JtYWxpemVab25lKG9iai56b25lKTtcbiAgICBpZiAoIXpvbmVUb1VzZS5pc1ZhbGlkKSB7XG4gICAgICByZXR1cm4gRGF0ZVRpbWUuaW52YWxpZChVTlNVUFBPUlRFRF9aT05FKTtcbiAgICB9XG5cbiAgICB2YXIgdHNOb3cgPSBTZXR0aW5ncy5ub3coKSxcbiAgICAgICAgb2Zmc2V0UHJvdmlzID0gem9uZVRvVXNlLm9mZnNldCh0c05vdyksXG4gICAgICAgIG5vcm1hbGl6ZWQgPSBVdGlsLm5vcm1hbGl6ZU9iamVjdChvYmosIG5vcm1hbGl6ZVVuaXQsIHRydWUpLFxuICAgICAgICBjb250YWluc09yZGluYWwgPSAhVXRpbC5pc1VuZGVmaW5lZChub3JtYWxpemVkLm9yZGluYWwpLFxuICAgICAgICBjb250YWluc0dyZWdvclllYXIgPSAhVXRpbC5pc1VuZGVmaW5lZChub3JtYWxpemVkLnllYXIpLFxuICAgICAgICBjb250YWluc0dyZWdvck1EID0gIVV0aWwuaXNVbmRlZmluZWQobm9ybWFsaXplZC5tb250aCkgfHwgIVV0aWwuaXNVbmRlZmluZWQobm9ybWFsaXplZC5kYXkpLFxuICAgICAgICBjb250YWluc0dyZWdvciA9IGNvbnRhaW5zR3JlZ29yWWVhciB8fCBjb250YWluc0dyZWdvck1ELFxuICAgICAgICBkZWZpbml0ZVdlZWtEZWYgPSBub3JtYWxpemVkLndlZWtZZWFyIHx8IG5vcm1hbGl6ZWQud2Vla051bWJlcixcbiAgICAgICAgbG9jID0gTG9jYWxlLmZyb21PYmplY3Qob2JqKTtcblxuICAgIC8vIGNhc2VzOlxuICAgIC8vIGp1c3QgYSB3ZWVrZGF5IC0+IHRoaXMgd2VlaydzIGluc3RhbmNlIG9mIHRoYXQgd2Vla2RheSwgbm8gd29ycmllc1xuICAgIC8vIChncmVnb3JpYW4gZGF0YSBvciBvcmRpbmFsKSArICh3ZWVrWWVhciBvciB3ZWVrTnVtYmVyKSAtPiBlcnJvclxuICAgIC8vIChncmVnb3JpYW4gbW9udGggb3IgZGF5KSArIG9yZGluYWwgLT4gZXJyb3JcbiAgICAvLyBvdGhlcndpc2UganVzdCB1c2Ugd2Vla3Mgb3Igb3JkaW5hbHMgb3IgZ3JlZ29yaWFuLCBkZXBlbmRpbmcgb24gd2hhdCdzIHNwZWNpZmllZFxuXG4gICAgaWYgKChjb250YWluc0dyZWdvciB8fCBjb250YWluc09yZGluYWwpICYmIGRlZmluaXRlV2Vla0RlZikge1xuICAgICAgdGhyb3cgbmV3IENvbmZsaWN0aW5nU3BlY2lmaWNhdGlvbkVycm9yKFwiQ2FuJ3QgbWl4IHdlZWtZZWFyL3dlZWtOdW1iZXIgdW5pdHMgd2l0aCB5ZWFyL21vbnRoL2RheSBvciBvcmRpbmFsc1wiKTtcbiAgICB9XG5cbiAgICBpZiAoY29udGFpbnNHcmVnb3JNRCAmJiBjb250YWluc09yZGluYWwpIHtcbiAgICAgIHRocm93IG5ldyBDb25mbGljdGluZ1NwZWNpZmljYXRpb25FcnJvcihcIkNhbid0IG1peCBvcmRpbmFsIGRhdGVzIHdpdGggbW9udGgvZGF5XCIpO1xuICAgIH1cblxuICAgIHZhciB1c2VXZWVrRGF0YSA9IGRlZmluaXRlV2Vla0RlZiB8fCBub3JtYWxpemVkLndlZWtkYXkgJiYgIWNvbnRhaW5zR3JlZ29yO1xuXG4gICAgLy8gY29uZmlndXJlIG91cnNlbHZlcyB0byBkZWFsIHdpdGggZ3JlZ29yaWFuIGRhdGVzIG9yIHdlZWsgc3R1ZmZcbiAgICB2YXIgdW5pdHMgPSB2b2lkIDAsXG4gICAgICAgIGRlZmF1bHRWYWx1ZXMgPSB2b2lkIDAsXG4gICAgICAgIG9iak5vdyA9IHRzVG9PYmoodHNOb3csIG9mZnNldFByb3Zpcyk7XG4gICAgaWYgKHVzZVdlZWtEYXRhKSB7XG4gICAgICB1bml0cyA9IG9yZGVyZWRXZWVrVW5pdHM7XG4gICAgICBkZWZhdWx0VmFsdWVzID0gZGVmYXVsdFdlZWtVbml0VmFsdWVzO1xuICAgICAgb2JqTm93ID0gQ29udmVyc2lvbnMuZ3JlZ29yaWFuVG9XZWVrKG9iak5vdyk7XG4gICAgfSBlbHNlIGlmIChjb250YWluc09yZGluYWwpIHtcbiAgICAgIHVuaXRzID0gb3JkZXJlZE9yZGluYWxVbml0cztcbiAgICAgIGRlZmF1bHRWYWx1ZXMgPSBkZWZhdWx0T3JkaW5hbFVuaXRWYWx1ZXM7XG4gICAgICBvYmpOb3cgPSBDb252ZXJzaW9ucy5ncmVnb3JpYW5Ub09yZGluYWwob2JqTm93KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdW5pdHMgPSBvcmRlcmVkVW5pdHM7XG4gICAgICBkZWZhdWx0VmFsdWVzID0gZGVmYXVsdFVuaXRWYWx1ZXM7XG4gICAgfVxuXG4gICAgLy8gc2V0IGRlZmF1bHQgdmFsdWVzIGZvciBtaXNzaW5nIHN0dWZmXG4gICAgdmFyIGZvdW5kRmlyc3QgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBfaXRlcmF0b3IyID0gdW5pdHMsIF9pc0FycmF5MiA9IEFycmF5LmlzQXJyYXkoX2l0ZXJhdG9yMiksIF9pMiA9IDAsIF9pdGVyYXRvcjIgPSBfaXNBcnJheTIgPyBfaXRlcmF0b3IyIDogX2l0ZXJhdG9yMltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgdmFyIF9yZWYzO1xuXG4gICAgICBpZiAoX2lzQXJyYXkyKSB7XG4gICAgICAgIGlmIChfaTIgPj0gX2l0ZXJhdG9yMi5sZW5ndGgpIGJyZWFrO1xuICAgICAgICBfcmVmMyA9IF9pdGVyYXRvcjJbX2kyKytdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2kyID0gX2l0ZXJhdG9yMi5uZXh0KCk7XG4gICAgICAgIGlmIChfaTIuZG9uZSkgYnJlYWs7XG4gICAgICAgIF9yZWYzID0gX2kyLnZhbHVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgdSA9IF9yZWYzO1xuXG4gICAgICB2YXIgdiA9IG5vcm1hbGl6ZWRbdV07XG4gICAgICBpZiAoIVV0aWwuaXNVbmRlZmluZWQodikpIHtcbiAgICAgICAgZm91bmRGaXJzdCA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKGZvdW5kRmlyc3QpIHtcbiAgICAgICAgbm9ybWFsaXplZFt1XSA9IGRlZmF1bHRWYWx1ZXNbdV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub3JtYWxpemVkW3VdID0gb2JqTm93W3VdO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIG1ha2Ugc3VyZSB0aGUgdmFsdWVzIHdlIGhhdmUgYXJlIGluIHJhbmdlXG4gICAgdmFyIGhpZ2hlck9yZGVySW52YWxpZCA9IHVzZVdlZWtEYXRhID8gQ29udmVyc2lvbnMuaGFzSW52YWxpZFdlZWtEYXRhKG5vcm1hbGl6ZWQpIDogY29udGFpbnNPcmRpbmFsID8gQ29udmVyc2lvbnMuaGFzSW52YWxpZE9yZGluYWxEYXRhKG5vcm1hbGl6ZWQpIDogQ29udmVyc2lvbnMuaGFzSW52YWxpZEdyZWdvcmlhbkRhdGEobm9ybWFsaXplZCksXG4gICAgICAgIGludmFsaWRSZWFzb24gPSBoaWdoZXJPcmRlckludmFsaWQgfHwgQ29udmVyc2lvbnMuaGFzSW52YWxpZFRpbWVEYXRhKG5vcm1hbGl6ZWQpO1xuXG4gICAgaWYgKGludmFsaWRSZWFzb24pIHtcbiAgICAgIHJldHVybiBEYXRlVGltZS5pbnZhbGlkKGludmFsaWRSZWFzb24pO1xuICAgIH1cblxuICAgIC8vIGNvbXB1dGUgdGhlIGFjdHVhbCB0aW1lXG4gICAgdmFyIGdyZWdvcmlhbiA9IHVzZVdlZWtEYXRhID8gQ29udmVyc2lvbnMud2Vla1RvR3JlZ29yaWFuKG5vcm1hbGl6ZWQpIDogY29udGFpbnNPcmRpbmFsID8gQ29udmVyc2lvbnMub3JkaW5hbFRvR3JlZ29yaWFuKG5vcm1hbGl6ZWQpIDogbm9ybWFsaXplZCxcbiAgICAgICAgX29ialRvVFMyID0gb2JqVG9UUyhncmVnb3JpYW4sIG9mZnNldFByb3Zpcywgem9uZVRvVXNlKSxcbiAgICAgICAgdHNGaW5hbCA9IF9vYmpUb1RTMlswXSxcbiAgICAgICAgb2Zmc2V0RmluYWwgPSBfb2JqVG9UUzJbMV0sXG4gICAgICAgIGluc3QgPSBuZXcgRGF0ZVRpbWUoe1xuICAgICAgdHM6IHRzRmluYWwsXG4gICAgICB6b25lOiB6b25lVG9Vc2UsXG4gICAgICBvOiBvZmZzZXRGaW5hbCxcbiAgICAgIGxvYzogbG9jXG4gICAgfSk7XG5cbiAgICAvLyBncmVnb3JpYW4gZGF0YSArIHdlZWtkYXkgc2VydmVzIG9ubHkgdG8gdmFsaWRhdGVcbiAgICBpZiAobm9ybWFsaXplZC53ZWVrZGF5ICYmIGNvbnRhaW5zR3JlZ29yICYmIG9iai53ZWVrZGF5ICE9PSBpbnN0LndlZWtkYXkpIHtcbiAgICAgIHJldHVybiBEYXRlVGltZS5pbnZhbGlkKCdtaXNtYXRjaGVkIHdlZWtkYXknKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5zdDtcbiAgfTtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgRGF0ZVRpbWUgZnJvbSBhbiBJU08gODYwMSBzdHJpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSB0aGUgSVNPIHN0cmluZ1xuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0cyAtIG9wdGlvbnMgdG8gYWZmZWN0IHRoZSBjcmVhdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ3xab25lfSBbb3B0cy56b25lPSdsb2NhbCddIC0gdXNlIHRoaXMgem9uZSBpZiBubyBvZmZzZXQgaXMgc3BlY2lmaWVkIGluIHRoZSBpbnB1dCBzdHJpbmcgaXRzZWxmLiBXaWxsIGFsc28gY29udmVydCB0aGUgdGltZSB0byB0aGlzIHpvbmVcbiAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5zZXRab25lPWZhbHNlXSAtIG92ZXJyaWRlIHRoZSB6b25lIHdpdGggYSBmaXhlZC1vZmZzZXQgem9uZSBzcGVjaWZpZWQgaW4gdGhlIHN0cmluZyBpdHNlbGYsIGlmIGl0IHNwZWNpZmllcyBvbmVcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLmxvY2FsZT0nZW4tVVMnXSAtIGEgbG9jYWxlIHRvIHNldCBvbiB0aGUgcmVzdWx0aW5nIERhdGVUaW1lIGluc3RhbmNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLm91dHB1dENhbGVuZGFyIC0gdGhlIG91dHB1dCBjYWxlbmRhciB0byBzZXQgb24gdGhlIHJlc3VsdGluZyBEYXRlVGltZSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0cy5udW1iZXJpbmdTeXN0ZW0gLSB0aGUgbnVtYmVyaW5nIHN5c3RlbSB0byBzZXQgb24gdGhlIHJlc3VsdGluZyBEYXRlVGltZSBpbnN0YW5jZVxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5mcm9tSVNPKCcyMDE2LTA1LTI1VDA5OjA4OjM0LjEyMycpXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLmZyb21JU08oJzIwMTYtMDUtMjVUMDk6MDg6MzQuMTIzKzA2OjAwJylcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUuZnJvbUlTTygnMjAxNi0wNS0yNVQwOTowODozNC4xMjMrMDY6MDAnLCB7c2V0Wm9uZTogdHJ1ZX0pXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLmZyb21JU08oJzIwMTYtMDUtMjVUMDk6MDg6MzQuMTIzJywge3pvbmU6ICd1dGMnfSlcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUuZnJvbUlTTygnMjAxNi1XMDUtNCcpXG4gICAqIEByZXR1cm4ge0RhdGVUaW1lfVxuICAgKi9cblxuXG4gIERhdGVUaW1lLmZyb21JU08gPSBmdW5jdGlvbiBmcm9tSVNPKHRleHQpIHtcbiAgICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICB2YXIgX1JlZ2V4UGFyc2VyJHBhcnNlSVNPID0gUmVnZXhQYXJzZXIucGFyc2VJU09EYXRlKHRleHQpLFxuICAgICAgICB2YWxzID0gX1JlZ2V4UGFyc2VyJHBhcnNlSVNPWzBdLFxuICAgICAgICBwYXJzZWRab25lID0gX1JlZ2V4UGFyc2VyJHBhcnNlSVNPWzFdO1xuXG4gICAgcmV0dXJuIHBhcnNlRGF0YVRvRGF0ZVRpbWUodmFscywgcGFyc2VkWm9uZSwgb3B0cyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIERhdGVUaW1lIGZyb20gYW4gUkZDIDI4MjIgc3RyaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gdGhlIFJGQyAyODIyIHN0cmluZ1xuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0cyAtIG9wdGlvbnMgdG8gYWZmZWN0IHRoZSBjcmVhdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ3xab25lfSBbb3B0cy56b25lPSdsb2NhbCddIC0gY29udmVydCB0aGUgdGltZSB0byB0aGlzIHpvbmUuIFNpbmNlIHRoZSBvZmZzZXQgaXMgYWx3YXlzIHNwZWNpZmllZCBpbiB0aGUgc3RyaW5nIGl0c2VsZiwgdGhpcyBoYXMgbm8gZWZmZWN0IG9uIHRoZSBpbnRlcnByZXRhdGlvbiBvZiBzdHJpbmcsIG1lcmVseSB0aGUgem9uZSB0aGUgcmVzdWx0aW5nIERhdGVUaW1lIGlzIGV4cHJlc3NlZCBpbi5cbiAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5zZXRab25lPWZhbHNlXSAtIG92ZXJyaWRlIHRoZSB6b25lIHdpdGggYSBmaXhlZC1vZmZzZXQgem9uZSBzcGVjaWZpZWQgaW4gdGhlIHN0cmluZyBpdHNlbGYsIGlmIGl0IHNwZWNpZmllcyBvbmVcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLmxvY2FsZT0nZW4tVVMnXSAtIGEgbG9jYWxlIHRvIHNldCBvbiB0aGUgcmVzdWx0aW5nIERhdGVUaW1lIGluc3RhbmNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLm91dHB1dENhbGVuZGFyIC0gdGhlIG91dHB1dCBjYWxlbmRhciB0byBzZXQgb24gdGhlIHJlc3VsdGluZyBEYXRlVGltZSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0cy5udW1iZXJpbmdTeXN0ZW0gLSB0aGUgbnVtYmVyaW5nIHN5c3RlbSB0byBzZXQgb24gdGhlIHJlc3VsdGluZyBEYXRlVGltZSBpbnN0YW5jZVxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5mcm9tUkZDMjgyMignMjUgTm92IDIwMTYgMTM6MjM6MTIgR01UJylcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUuZnJvbVJGQzI4MjIoJ1R1ZSwgMjUgTm92IDIwMTYgMTM6MjM6MTIgKzA2MDAnKVxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5mcm9tUkZDMjgyMignMjUgTm92IDIwMTYgMTM6MjMgWicpXG4gICAqIEByZXR1cm4ge0RhdGVUaW1lfVxuICAgKi9cblxuXG4gIERhdGVUaW1lLmZyb21SRkMyODIyID0gZnVuY3Rpb24gZnJvbVJGQzI4MjIodGV4dCkge1xuICAgIHZhciBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgIHZhciBfUmVnZXhQYXJzZXIkcGFyc2VSRkMgPSBSZWdleFBhcnNlci5wYXJzZVJGQzI4MjJEYXRlKHRleHQpLFxuICAgICAgICB2YWxzID0gX1JlZ2V4UGFyc2VyJHBhcnNlUkZDWzBdLFxuICAgICAgICBwYXJzZWRab25lID0gX1JlZ2V4UGFyc2VyJHBhcnNlUkZDWzFdO1xuXG4gICAgcmV0dXJuIHBhcnNlRGF0YVRvRGF0ZVRpbWUodmFscywgcGFyc2VkWm9uZSwgb3B0cyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIERhdGVUaW1lIGZyb20gYW4gSFRUUCBoZWFkZXIgZGF0ZVxuICAgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9Qcm90b2NvbHMvcmZjMjYxNi9yZmMyNjE2LXNlYzMuaHRtbCNzZWMzLjMuMVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIHRoZSBIVFRQIGhlYWRlciBkYXRlXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gb3B0aW9ucyB0byBhZmZlY3QgdGhlIGNyZWF0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfFpvbmV9IFtvcHRpb25zLnpvbmU9J2xvY2FsJ10gLSBjb252ZXJ0IHRoZSB0aW1lIHRvIHRoaXMgem9uZS4gU2luY2UgSFRUUCBkYXRlcyBhcmUgYWx3YXlzIGluIFVUQywgdGhpcyBoYXMgbm8gZWZmZWN0IG9uIHRoZSBpbnRlcnByZXRhdGlvbiBvZiBzdHJpbmcsIG1lcmVseSB0aGUgem9uZSB0aGUgcmVzdWx0aW5nIERhdGVUaW1lIGlzIGV4cHJlc3NlZCBpbi5cbiAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5zZXRab25lPWZhbHNlXSAtIG92ZXJyaWRlIHRoZSB6b25lIHdpdGggdGhlIGZpeGVkLW9mZnNldCB6b25lIHNwZWNpZmllZCBpbiB0aGUgc3RyaW5nLiBGb3IgSFRUUCBkYXRlcywgdGhpcyBpcyBhbHdheXMgVVRDLCBzbyB0aGlzIG9wdGlvbiBpcyBlcXVpdmFsZW50IHRvIHNldHRpbmcgdGhlIGB6b25lYCBvcHRpb24gdG8gJ3V0YycsIGJ1dCB0aGlzIG9wdGlvbiBpcyBpbmNsdWRlZCBmb3IgY29uc2lzdGVuY3kgd2l0aCBzaW1pbGFyIG1ldGhvZHMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5sb2NhbGU9J2VuLVVTJ10gLSBhIGxvY2FsZSB0byBzZXQgb24gdGhlIHJlc3VsdGluZyBEYXRlVGltZSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5vdXRwdXRDYWxlbmRhciAtIHRoZSBvdXRwdXQgY2FsZW5kYXIgdG8gc2V0IG9uIHRoZSByZXN1bHRpbmcgRGF0ZVRpbWUgaW5zdGFuY2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMubnVtYmVyaW5nU3lzdGVtIC0gdGhlIG51bWJlcmluZyBzeXN0ZW0gdG8gc2V0IG9uIHRoZSByZXN1bHRpbmcgRGF0ZVRpbWUgaW5zdGFuY2VcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUuZnJvbUhUVFAoJ1N1biwgMDYgTm92IDE5OTQgMDg6NDk6MzcgR01UJylcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUuZnJvbUhUVFAoJ1N1bmRheSwgMDYtTm92LTk0IDA4OjQ5OjM3IEdNVCcpXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLmZyb21IVFRQKCdTdW4gTm92ICA2IDA4OjQ5OjM3IDE5OTQnKVxuICAgKiBAcmV0dXJuIHtEYXRlVGltZX1cbiAgICovXG5cblxuICBEYXRlVGltZS5mcm9tSFRUUCA9IGZ1bmN0aW9uIGZyb21IVFRQKHRleHQpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICB2YXIgX1JlZ2V4UGFyc2VyJHBhcnNlSFRUID0gUmVnZXhQYXJzZXIucGFyc2VIVFRQRGF0ZSh0ZXh0KSxcbiAgICAgICAgdmFscyA9IF9SZWdleFBhcnNlciRwYXJzZUhUVFswXSxcbiAgICAgICAgcGFyc2VkWm9uZSA9IF9SZWdleFBhcnNlciRwYXJzZUhUVFsxXTtcblxuICAgIHJldHVybiBwYXJzZURhdGFUb0RhdGVUaW1lKHZhbHMsIHBhcnNlZFpvbmUsIG9wdGlvbnMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBEYXRlVGltZSBmcm9tIGFuIGlucHV0IHN0cmluZyBhbmQgZm9ybWF0IHN0cmluZ1xuICAgKiBEZWZhdWx0cyB0byBlbi1VUyBpZiBubyBsb2NhbGUgaGFzIGJlZW4gc3BlY2lmaWVkLCByZWdhcmRsZXNzIG9mIHRoZSBzeXN0ZW0ncyBsb2NhbGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSB0aGUgc3RyaW5nIHRvIHBhcnNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmbXQgLSB0aGUgZm9ybWF0IHRoZSBzdHJpbmcgaXMgZXhwZWN0ZWQgdG8gYmUgaW4gKHNlZSBkZXNjcmlwdGlvbilcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBvcHRpb25zIHRvIGFmZmVjdCB0aGUgY3JlYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd8Wm9uZX0gW29wdGlvbnMuem9uZT0nbG9jYWwnXSAtIHVzZSB0aGlzIHpvbmUgaWYgbm8gb2Zmc2V0IGlzIHNwZWNpZmllZCBpbiB0aGUgaW5wdXQgc3RyaW5nIGl0c2VsZi4gV2lsbCBhbHNvIGNvbnZlcnQgdGhlIERhdGVUaW1lIHRvIHRoaXMgem9uZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnNldFpvbmU9ZmFsc2VdIC0gb3ZlcnJpZGUgdGhlIHpvbmUgd2l0aCBhIHpvbmUgc3BlY2lmaWVkIGluIHRoZSBzdHJpbmcgaXRzZWxmLCBpZiBpdCBzcGVjaWZpZXMgb25lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5sb2NhbGU9J2VuLVVTJ10gLSBhIGxvY2FsZSBzdHJpbmcgdG8gdXNlIHdoZW4gcGFyc2luZy4gV2lsbCBhbHNvIHNldCB0aGUgRGF0ZVRpbWUgdG8gdGhpcyBsb2NhbGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMubnVtYmVyaW5nU3lzdGVtIC0gdGhlIG51bWJlcmluZyBzeXN0ZW0gdG8gdXNlIHdoZW4gcGFyc2luZy4gV2lsbCBhbHNvIHNldCB0aGUgcmVzdWx0aW5nIERhdGVUaW1lIHRvIHRoaXMgbnVtYmVyaW5nIHN5c3RlbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5vdXRwdXRDYWxlbmRhciAtIHRoZSBvdXRwdXQgY2FsZW5kYXIgdG8gc2V0IG9uIHRoZSByZXN1bHRpbmcgRGF0ZVRpbWUgaW5zdGFuY2VcbiAgICogQHJldHVybiB7RGF0ZVRpbWV9XG4gICAqL1xuXG5cbiAgRGF0ZVRpbWUuZnJvbUZvcm1hdCA9IGZ1bmN0aW9uIGZyb21Gb3JtYXQodGV4dCwgZm10KSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuXG4gICAgaWYgKFV0aWwuaXNVbmRlZmluZWQodGV4dCkgfHwgVXRpbC5pc1VuZGVmaW5lZChmbXQpKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZEFyZ3VtZW50RXJyb3IoJ2Zyb21Gb3JtYXQgcmVxdWlyZXMgYW4gaW5wdXQgc3RyaW5nIGFuZCBhIGZvcm1hdCcpO1xuICAgIH1cblxuICAgIHZhciBfb3B0aW9ucyRsb2NhbGUgPSBvcHRpb25zLmxvY2FsZSxcbiAgICAgICAgbG9jYWxlID0gX29wdGlvbnMkbG9jYWxlID09PSB1bmRlZmluZWQgPyBudWxsIDogX29wdGlvbnMkbG9jYWxlLFxuICAgICAgICBfb3B0aW9ucyRudW1iZXJpbmdTeXMgPSBvcHRpb25zLm51bWJlcmluZ1N5c3RlbSxcbiAgICAgICAgbnVtYmVyaW5nU3lzdGVtID0gX29wdGlvbnMkbnVtYmVyaW5nU3lzID09PSB1bmRlZmluZWQgPyBudWxsIDogX29wdGlvbnMkbnVtYmVyaW5nU3lzLFxuICAgICAgICBwYXJzZXIgPSBuZXcgVG9rZW5QYXJzZXIoTG9jYWxlLmZyb21PcHRzKHsgbG9jYWxlOiBsb2NhbGUsIG51bWJlcmluZ1N5c3RlbTogbnVtYmVyaW5nU3lzdGVtLCBkZWZhdWx0VG9FTjogdHJ1ZSB9KSksXG4gICAgICAgIF9wYXJzZXIkcGFyc2VEYXRlVGltZSA9IHBhcnNlci5wYXJzZURhdGVUaW1lKHRleHQsIGZtdCksXG4gICAgICAgIHZhbHMgPSBfcGFyc2VyJHBhcnNlRGF0ZVRpbWVbMF0sXG4gICAgICAgIHBhcnNlZFpvbmUgPSBfcGFyc2VyJHBhcnNlRGF0ZVRpbWVbMV0sXG4gICAgICAgIGludmFsaWRSZWFzb24gPSBfcGFyc2VyJHBhcnNlRGF0ZVRpbWVbMl07XG5cbiAgICBpZiAoaW52YWxpZFJlYXNvbikge1xuICAgICAgcmV0dXJuIERhdGVUaW1lLmludmFsaWQoaW52YWxpZFJlYXNvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXJzZURhdGFUb0RhdGVUaW1lKHZhbHMsIHBhcnNlZFpvbmUsIG9wdGlvbnMpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGZyb21Gb3JtYXQgaW5zdGVhZFxuICAgKi9cblxuXG4gIERhdGVUaW1lLmZyb21TdHJpbmcgPSBmdW5jdGlvbiBmcm9tU3RyaW5nKHRleHQsIGZtdCkge1xuICAgIHZhciBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcblxuICAgIHJldHVybiBEYXRlVGltZS5mcm9tRm9ybWF0KHRleHQsIGZtdCwgb3B0cyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIERhdGVUaW1lIGZyb20gYSBTUUwgZGF0ZSwgdGltZSwgb3IgZGF0ZXRpbWVcbiAgICogRGVmYXVsdHMgdG8gZW4tVVMgaWYgbm8gbG9jYWxlIGhhcyBiZWVuIHNwZWNpZmllZCwgcmVnYXJkbGVzcyBvZiB0aGUgc3lzdGVtJ3MgbG9jYWxlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gdGhlIHN0cmluZyB0byBwYXJzZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIG9wdGlvbnMgdG8gYWZmZWN0IHRoZSBjcmVhdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ3xab25lfSBbb3B0aW9ucy56b25lPSdsb2NhbCddIC0gdXNlIHRoaXMgem9uZSBpZiBubyBvZmZzZXQgaXMgc3BlY2lmaWVkIGluIHRoZSBpbnB1dCBzdHJpbmcgaXRzZWxmLiBXaWxsIGFsc28gY29udmVydCB0aGUgRGF0ZVRpbWUgdG8gdGhpcyB6b25lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuc2V0Wm9uZT1mYWxzZV0gLSBvdmVycmlkZSB0aGUgem9uZSB3aXRoIGEgem9uZSBzcGVjaWZpZWQgaW4gdGhlIHN0cmluZyBpdHNlbGYsIGlmIGl0IHNwZWNpZmllcyBvbmVcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmxvY2FsZT0nZW4tVVMnXSAtIGEgbG9jYWxlIHN0cmluZyB0byB1c2Ugd2hlbiBwYXJzaW5nLiBXaWxsIGFsc28gc2V0IHRoZSBEYXRlVGltZSB0byB0aGlzIGxvY2FsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5udW1iZXJpbmdTeXN0ZW0gLSB0aGUgbnVtYmVyaW5nIHN5c3RlbSB0byB1c2Ugd2hlbiBwYXJzaW5nLiBXaWxsIGFsc28gc2V0IHRoZSByZXN1bHRpbmcgRGF0ZVRpbWUgdG8gdGhpcyBudW1iZXJpbmcgc3lzdGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLm91dHB1dENhbGVuZGFyIC0gdGhlIG91dHB1dCBjYWxlbmRhciB0byBzZXQgb24gdGhlIHJlc3VsdGluZyBEYXRlVGltZSBpbnN0YW5jZVxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5mcm9tU1FMKCcyMDE3LTA1LTE1JylcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUuZnJvbVNRTCgnMjAxNy0wNS0xNSAwOToxMjozNCcpXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLmZyb21TUUwoJzIwMTctMDUtMTUgMDk6MTI6MzQuMzQyJylcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUuZnJvbVNRTCgnMjAxNy0wNS0xNSAwOToxMjozNC4zNDIrMDY6MDAnKVxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5mcm9tU1FMKCcyMDE3LTA1LTE1IDA5OjEyOjM0LjM0MiBBbWVyaWNhL0xvc19BbmdlbGVzJylcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUuZnJvbVNRTCgnMjAxNy0wNS0xNSAwOToxMjozNC4zNDIgQW1lcmljYS9Mb3NfQW5nZWxlcycsIHsgc2V0Wm9uZTogdHJ1ZSB9KVxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5mcm9tU1FMKCcyMDE3LTA1LTE1IDA5OjEyOjM0LjM0MicsIHsgem9uZTogJ0FtZXJpY2EvTG9zX0FuZ2VsZXMnIH0pXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLmZyb21TUUwoJzA5OjEyOjM0LjM0MicpXG4gICAqIEByZXR1cm4ge0RhdGVUaW1lfVxuICAgKi9cblxuXG4gIERhdGVUaW1lLmZyb21TUUwgPSBmdW5jdGlvbiBmcm9tU1FMKHRleHQpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICB2YXIgX1JlZ2V4UGFyc2VyJHBhcnNlU1FMID0gUmVnZXhQYXJzZXIucGFyc2VTUUwodGV4dCksXG4gICAgICAgIHZhbHMgPSBfUmVnZXhQYXJzZXIkcGFyc2VTUUxbMF0sXG4gICAgICAgIHBhcnNlZFpvbmUgPSBfUmVnZXhQYXJzZXIkcGFyc2VTUUxbMV07XG5cbiAgICByZXR1cm4gcGFyc2VEYXRhVG9EYXRlVGltZSh2YWxzLCBwYXJzZWRab25lLCBvcHRpb25zKTtcbiAgfTtcblxuICAvKipcbiAgICogQ3JlYXRlIGFuIGludmFsaWQgRGF0ZVRpbWUuXG4gICAqIEByZXR1cm4ge0RhdGVUaW1lfVxuICAgKi9cblxuXG4gIERhdGVUaW1lLmludmFsaWQgPSBmdW5jdGlvbiBpbnZhbGlkKHJlYXNvbikge1xuICAgIGlmICghcmVhc29uKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZEFyZ3VtZW50RXJyb3IoJ25lZWQgdG8gc3BlY2lmeSBhIHJlYXNvbiB0aGUgRGF0ZVRpbWUgaXMgaW52YWxpZCcpO1xuICAgIH1cbiAgICBpZiAoU2V0dGluZ3MudGhyb3dPbkludmFsaWQpIHtcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkRGF0ZVRpbWVFcnJvcihyZWFzb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IERhdGVUaW1lKHsgaW52YWxpZFJlYXNvbjogcmVhc29uIH0pO1xuICAgIH1cbiAgfTtcblxuICAvLyBJTkZPXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgdmFsdWUgb2YgdW5pdC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVuaXQgLSBhIHVuaXQgc3VjaCBhcyAnbWludXRlJyBvciAnZGF5J1xuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgyMDE3LCA3LCA0KS5nZXQoJ21vbnRoJyk7IC8vPT4gN1xuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgyMDE3LCA3LCA0KS5nZXQoJ2RheScpOyAvLz0+IDRcbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cblxuXG4gIERhdGVUaW1lLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQkJDEodW5pdCkge1xuICAgIHJldHVybiB0aGlzW3VuaXRdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgdGhlIERhdGVUaW1lIGlzIHZhbGlkLiBJbnZhbGlkIERhdGVUaW1lcyBvY2N1ciB3aGVuOlxuICAgKiAqIFRoZSBEYXRlVGltZSB3YXMgY3JlYXRlZCBmcm9tIGludmFsaWQgY2FsZW5kYXIgaW5mb3JtYXRpb24sIHN1Y2ggYXMgdGhlIDEzdGggbW9udGggb3IgRmVicnVhcnkgMzBcbiAgICogKiBUaGUgRGF0ZVRpbWUgd2FzIGNyZWF0ZWQgYnkgYW4gb3BlcmF0aW9uIG9uIGFub3RoZXIgaW52YWxpZCBkYXRlXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHJlc29sdmVkIEludGwgb3B0aW9ucyBmb3IgdGhpcyBEYXRlVGltZS5cbiAgICogVGhpcyBpcyB1c2VmdWwgaW4gdW5kZXJzdGFuZGluZyB0aGUgYmVoYXZpb3Igb2YgZm9ybWF0dGluZyBtZXRob2RzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRzIC0gdGhlIHNhbWUgb3B0aW9ucyBhcyB0b0xvY2FsZVN0cmluZ1xuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBEYXRlVGltZS5wcm90b3R5cGUucmVzb2x2ZWRMb2NhbGVPcHRzID0gZnVuY3Rpb24gcmVzb2x2ZWRMb2NhbGVPcHRzKCkge1xuICAgIHZhciBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICAgIHZhciBfRm9ybWF0dGVyJGNyZWF0ZSRyZXMgPSBGb3JtYXR0ZXIuY3JlYXRlKHRoaXMubG9jLmNsb25lKG9wdHMpLCBvcHRzKS5yZXNvbHZlZE9wdGlvbnModGhpcyksXG4gICAgICAgIGxvY2FsZSA9IF9Gb3JtYXR0ZXIkY3JlYXRlJHJlcy5sb2NhbGUsXG4gICAgICAgIG51bWJlcmluZ1N5c3RlbSA9IF9Gb3JtYXR0ZXIkY3JlYXRlJHJlcy5udW1iZXJpbmdTeXN0ZW0sXG4gICAgICAgIGNhbGVuZGFyID0gX0Zvcm1hdHRlciRjcmVhdGUkcmVzLmNhbGVuZGFyO1xuXG4gICAgcmV0dXJuIHsgbG9jYWxlOiBsb2NhbGUsIG51bWJlcmluZ1N5c3RlbTogbnVtYmVyaW5nU3lzdGVtLCBvdXRwdXRDYWxlbmRhcjogY2FsZW5kYXIgfTtcbiAgfTtcblxuICAvLyBUUkFOU0ZPUk1cblxuICAvKipcbiAgICogXCJTZXRcIiB0aGUgRGF0ZVRpbWUncyB6b25lIHRvIFVUQy4gUmV0dXJucyBhIG5ld2x5LWNvbnN0cnVjdGVkIERhdGVUaW1lLlxuICAgKlxuICAgKiBFcXVpdmFsZW50IHRvIHtAbGluayBzZXRab25lfSgndXRjJylcbiAgICogQHBhcmFtIHtudW1iZXJ9IFtvZmZzZXQ9MF0gLSBvcHRpb25hbGx5LCBhbiBvZmZzZXQgZnJvbSBVVEMgaW4gbWludXRlc1xuICAgKiBAcGFyYW0ge29iamVjdH0gW29wdHM9e31dIC0gb3B0aW9ucyB0byBwYXNzIHRvIGBzZXRab25lKClgXG4gICAqIEByZXR1cm4ge0RhdGVUaW1lfVxuICAgKi9cblxuXG4gIERhdGVUaW1lLnByb3RvdHlwZS50b1VUQyA9IGZ1bmN0aW9uIHRvVVRDKCkge1xuICAgIHZhciBvZmZzZXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgdmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgcmV0dXJuIHRoaXMuc2V0Wm9uZShGaXhlZE9mZnNldFpvbmUuaW5zdGFuY2Uob2Zmc2V0KSwgb3B0cyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFwiU2V0XCIgdGhlIERhdGVUaW1lJ3Mgem9uZSB0byB0aGUgaG9zdCdzIGxvY2FsIHpvbmUuIFJldHVybnMgYSBuZXdseS1jb25zdHJ1Y3RlZCBEYXRlVGltZS5cbiAgICpcbiAgICogRXF1aXZhbGVudCB0byBgc2V0Wm9uZSgnbG9jYWwnKWBcbiAgICogQHJldHVybiB7RGF0ZVRpbWV9XG4gICAqL1xuXG5cbiAgRGF0ZVRpbWUucHJvdG90eXBlLnRvTG9jYWwgPSBmdW5jdGlvbiB0b0xvY2FsKCkge1xuICAgIHJldHVybiB0aGlzLnNldFpvbmUobmV3IExvY2FsWm9uZSgpKTtcbiAgfTtcblxuICAvKipcbiAgICogXCJTZXRcIiB0aGUgRGF0ZVRpbWUncyB6b25lIHRvIHNwZWNpZmllZCB6b25lLiBSZXR1cm5zIGEgbmV3bHktY29uc3RydWN0ZWQgRGF0ZVRpbWUuXG4gICAqXG4gICAqIEJ5IGRlZmF1bHQsIHRoZSBzZXR0ZXIga2VlcHMgdGhlIHVuZGVybHlpbmcgdGltZSB0aGUgc2FtZSAoYXMgaW4sIHRoZSBzYW1lIFVUQyB0aW1lc3RhbXApLCBidXQgdGhlIG5ldyBpbnN0YW5jZSB3aWxsIHJlcG9ydCBkaWZmZXJlbnQgbG9jYWwgdGltZXMgYW5kIGNvbnNpZGVyIERTVHMgd2hlbiBtYWtpbmcgY29tcHV0YXRpb25zLCBhcyB3aXRoIHtAbGluayBwbHVzfS4gWW91IG1heSB3aXNoIHRvIHVzZSB7QGxpbmsgdG9Mb2NhbH0gYW5kIHtAbGluayB0b1VUQ30gd2hpY2ggcHJvdmlkZSBzaW1wbGUgY29udmVuaWVuY2Ugd3JhcHBlcnMgZm9yIGNvbW1vbmx5IHVzZWQgem9uZXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfFpvbmV9IFt6b25lPSdsb2NhbCddIC0gYSB6b25lIGlkZW50aWZpZXIuIEFzIGEgc3RyaW5nLCB0aGF0IGNhbiBiZSBhbnkgSUFOQSB6b25lIHN1cHBvcnRlZCBieSB0aGUgaG9zdCBlbnZpcm9ubWVudCwgb3IgYSBmaXhlZC1vZmZzZXQgbmFtZSBvZiB0aGUgZm9ybSAndXRjKzMnLCBvciB0aGUgc3RyaW5ncyAnbG9jYWwnIG9yICd1dGMnLiBZb3UgbWF5IGFsc28gc3VwcGx5IGFuIGluc3RhbmNlIG9mIGEge0BsaW5rIFpvbmV9IGNsYXNzLlxuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0cyAtIG9wdGlvbnNcbiAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5rZWVwTG9jYWxUaW1lPWZhbHNlXSAtIElmIHRydWUsIGFkanVzdCB0aGUgdW5kZXJseWluZyB0aW1lIHNvIHRoYXQgdGhlIGxvY2FsIHRpbWUgc3RheXMgdGhlIHNhbWUsIGJ1dCBpbiB0aGUgdGFyZ2V0IHpvbmUuIFlvdSBzaG91bGQgcmFyZWx5IG5lZWQgdGhpcy5cbiAgICogQHJldHVybiB7RGF0ZVRpbWV9XG4gICAqL1xuXG5cbiAgRGF0ZVRpbWUucHJvdG90eXBlLnNldFpvbmUgPSBmdW5jdGlvbiBzZXRab25lKHpvbmUpIHtcbiAgICB2YXIgX3JlZjQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9LFxuICAgICAgICBfcmVmNCRrZWVwTG9jYWxUaW1lID0gX3JlZjQua2VlcExvY2FsVGltZSxcbiAgICAgICAga2VlcExvY2FsVGltZSA9IF9yZWY0JGtlZXBMb2NhbFRpbWUgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX3JlZjQka2VlcExvY2FsVGltZSxcbiAgICAgICAgX3JlZjQka2VlcENhbGVuZGFyVGltID0gX3JlZjQua2VlcENhbGVuZGFyVGltZSxcbiAgICAgICAga2VlcENhbGVuZGFyVGltZSA9IF9yZWY0JGtlZXBDYWxlbmRhclRpbSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfcmVmNCRrZWVwQ2FsZW5kYXJUaW07XG5cbiAgICB6b25lID0gVXRpbC5ub3JtYWxpemVab25lKHpvbmUpO1xuICAgIGlmICh6b25lLmVxdWFscyh0aGlzLnpvbmUpKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2UgaWYgKCF6b25lLmlzVmFsaWQpIHtcbiAgICAgIHJldHVybiBEYXRlVGltZS5pbnZhbGlkKFVOU1VQUE9SVEVEX1pPTkUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbmV3VFMgPSBrZWVwTG9jYWxUaW1lIHx8IGtlZXBDYWxlbmRhclRpbWUgLy8ga2VlcENhbGVuZGFyVGltZSBpcyB0aGUgZGVwcmVjYXRlZCBuYW1lIGZvciBrZWVwTG9jYWxUaW1lXG4gICAgICA/IHRoaXMudHMgKyAodGhpcy5vIC0gem9uZS5vZmZzZXQodGhpcy50cykpICogNjAgKiAxMDAwIDogdGhpcy50cztcbiAgICAgIHJldHVybiBjbG9uZSh0aGlzLCB7IHRzOiBuZXdUUywgem9uZTogem9uZSB9KTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFwiU2V0XCIgdGhlIGxvY2FsZSwgbnVtYmVyaW5nU3lzdGVtLCBvciBvdXRwdXRDYWxlbmRhci4gUmV0dXJucyBhIG5ld2x5LWNvbnN0cnVjdGVkIERhdGVUaW1lLlxuICAgKiBAcGFyYW0ge29iamVjdH0gcHJvcGVydGllcyAtIHRoZSBwcm9wZXJ0aWVzIHRvIHNldFxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgyMDE3LCA1LCAyNSkucmVjb25maWd1cmUoeyBsb2NhbGU6ICdlbi1HQicgfSlcbiAgICogQHJldHVybiB7RGF0ZVRpbWV9XG4gICAqL1xuXG5cbiAgRGF0ZVRpbWUucHJvdG90eXBlLnJlY29uZmlndXJlID0gZnVuY3Rpb24gcmVjb25maWd1cmUoKSB7XG4gICAgdmFyIF9yZWY1ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fSxcbiAgICAgICAgbG9jYWxlID0gX3JlZjUubG9jYWxlLFxuICAgICAgICBudW1iZXJpbmdTeXN0ZW0gPSBfcmVmNS5udW1iZXJpbmdTeXN0ZW0sXG4gICAgICAgIG91dHB1dENhbGVuZGFyID0gX3JlZjUub3V0cHV0Q2FsZW5kYXI7XG5cbiAgICB2YXIgbG9jID0gdGhpcy5sb2MuY2xvbmUoeyBsb2NhbGU6IGxvY2FsZSwgbnVtYmVyaW5nU3lzdGVtOiBudW1iZXJpbmdTeXN0ZW0sIG91dHB1dENhbGVuZGFyOiBvdXRwdXRDYWxlbmRhciB9KTtcbiAgICByZXR1cm4gY2xvbmUodGhpcywgeyBsb2M6IGxvYyB9KTtcbiAgfTtcblxuICAvKipcbiAgICogXCJTZXRcIiB0aGUgbG9jYWxlLiBSZXR1cm5zIGEgbmV3bHktY29uc3RydWN0ZWQgRGF0ZVRpbWUuXG4gICAqIEp1c3QgYSBjb252ZW5pZW50IGFsaWFzIGZvciByZWNvbmZpZ3VyZSh7IGxvY2FsZSB9KVxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgyMDE3LCA1LCAyNSkuc2V0TG9jYWxlKCdlbi1HQicpXG4gICAqIEByZXR1cm4ge0RhdGVUaW1lfVxuICAgKi9cblxuXG4gIERhdGVUaW1lLnByb3RvdHlwZS5zZXRMb2NhbGUgPSBmdW5jdGlvbiBzZXRMb2NhbGUobG9jYWxlKSB7XG4gICAgcmV0dXJuIHRoaXMucmVjb25maWd1cmUoeyBsb2NhbGU6IGxvY2FsZSB9KTtcbiAgfTtcblxuICAvKipcbiAgICogXCJTZXRcIiB0aGUgdmFsdWVzIG9mIHNwZWNpZmllZCB1bml0cy4gUmV0dXJucyBhIG5ld2x5LWNvbnN0cnVjdGVkIERhdGVUaW1lLlxuICAgKiBZb3UgY2FuIG9ubHkgc2V0IHVuaXRzIHdpdGggdGhpcyBtZXRob2Q7IGZvciBcInNldHRpbmdcIiBtZXRhZGF0YSwgc2VlIHtAbGluayByZWNvbmZpZ3VyZX0gYW5kIHtAbGluayBzZXRab25lfS5cbiAgICogQHBhcmFtIHtvYmplY3R9IHZhbHVlcyAtIGEgbWFwcGluZyBvZiB1bml0cyB0byBudW1iZXJzXG4gICAqIEBleGFtcGxlIGR0LnNldCh7IHllYXI6IDIwMTcgfSlcbiAgICogQGV4YW1wbGUgZHQuc2V0KHsgaG91cjogOCwgbWludXRlOiAzMCB9KVxuICAgKiBAZXhhbXBsZSBkdC5zZXQoeyB3ZWVrZGF5OiA1IH0pXG4gICAqIEBleGFtcGxlIGR0LnNldCh7IHllYXI6IDIwMDUsIG9yZGluYWw6IDIzNCB9KVxuICAgKiBAcmV0dXJuIHtEYXRlVGltZX1cbiAgICovXG5cblxuICBEYXRlVGltZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0JCQxKHZhbHVlcykge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKSByZXR1cm4gdGhpcztcblxuICAgIHZhciBub3JtYWxpemVkID0gVXRpbC5ub3JtYWxpemVPYmplY3QodmFsdWVzLCBub3JtYWxpemVVbml0KSxcbiAgICAgICAgc2V0dGluZ1dlZWtTdHVmZiA9ICFVdGlsLmlzVW5kZWZpbmVkKG5vcm1hbGl6ZWQud2Vla1llYXIpIHx8ICFVdGlsLmlzVW5kZWZpbmVkKG5vcm1hbGl6ZWQud2Vla051bWJlcikgfHwgIVV0aWwuaXNVbmRlZmluZWQobm9ybWFsaXplZC53ZWVrZGF5KTtcblxuICAgIHZhciBtaXhlZCA9IHZvaWQgMDtcbiAgICBpZiAoc2V0dGluZ1dlZWtTdHVmZikge1xuICAgICAgbWl4ZWQgPSBDb252ZXJzaW9ucy53ZWVrVG9HcmVnb3JpYW4oT2JqZWN0LmFzc2lnbihDb252ZXJzaW9ucy5ncmVnb3JpYW5Ub1dlZWsodGhpcy5jKSwgbm9ybWFsaXplZCkpO1xuICAgIH0gZWxzZSBpZiAoIVV0aWwuaXNVbmRlZmluZWQobm9ybWFsaXplZC5vcmRpbmFsKSkge1xuICAgICAgbWl4ZWQgPSBDb252ZXJzaW9ucy5vcmRpbmFsVG9HcmVnb3JpYW4oT2JqZWN0LmFzc2lnbihDb252ZXJzaW9ucy5ncmVnb3JpYW5Ub09yZGluYWwodGhpcy5jKSwgbm9ybWFsaXplZCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtaXhlZCA9IE9iamVjdC5hc3NpZ24odGhpcy50b09iamVjdCgpLCBub3JtYWxpemVkKTtcblxuICAgICAgLy8gaWYgd2UgZGlkbid0IHNldCB0aGUgZGF5IGJ1dCB3ZSBlbmRlZCB1cCBvbiBhbiBvdmVyZmxvdyBkYXRlLFxuICAgICAgLy8gdXNlIHRoZSBsYXN0IGRheSBvZiB0aGUgcmlnaHQgbW9udGhcbiAgICAgIGlmIChVdGlsLmlzVW5kZWZpbmVkKG5vcm1hbGl6ZWQuZGF5KSkge1xuICAgICAgICBtaXhlZC5kYXkgPSBNYXRoLm1pbihVdGlsLmRheXNJbk1vbnRoKG1peGVkLnllYXIsIG1peGVkLm1vbnRoKSwgbWl4ZWQuZGF5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgX29ialRvVFMzID0gb2JqVG9UUyhtaXhlZCwgdGhpcy5vLCB0aGlzLnpvbmUpLFxuICAgICAgICB0cyA9IF9vYmpUb1RTM1swXSxcbiAgICAgICAgbyA9IF9vYmpUb1RTM1sxXTtcblxuICAgIHJldHVybiBjbG9uZSh0aGlzLCB7IHRzOiB0cywgbzogbyB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkIGEgcGVyaW9kIG9mIHRpbWUgdG8gdGhpcyBEYXRlVGltZSBhbmQgcmV0dXJuIHRoZSByZXN1bHRpbmcgRGF0ZVRpbWVcbiAgICpcbiAgICogQWRkaW5nIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCBvciBtaWxsaXNlY29uZHMgaW5jcmVhc2VzIHRoZSB0aW1lc3RhbXAgYnkgdGhlIHJpZ2h0IG51bWJlciBvZiBtaWxsaXNlY29uZHMuIEFkZGluZyBkYXlzLCBtb250aHMsIG9yIHllYXJzIHNoaWZ0cyB0aGUgY2FsZW5kYXIsIGFjY291bnRpbmcgZm9yIERTVHMgYW5kIGxlYXAgeWVhcnMgYWxvbmcgdGhlIHdheS4gVGh1cywgYGR0LnBsdXMoeyBob3VyczogMjQgfSlgIG1heSByZXN1bHQgaW4gYSBkaWZmZXJlbnQgdGltZSB0aGFuIGBkdC5wbHVzKHsgZGF5czogMSB9KWAgaWYgdGhlcmUncyBhIERTVCBzaGlmdCBpbiBiZXR3ZWVuLlxuICAgKiBAcGFyYW0ge0R1cmF0aW9ufG51bWJlcnxvYmplY3R9IGR1cmF0aW9uIC0gVGhlIGFtb3VudCB0byBhZGQuIEVpdGhlciBhIEx1eG9uIER1cmF0aW9uLCBhIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIHRoZSBvYmplY3QgYXJndW1lbnQgdG8gRHVyYXRpb24uZnJvbU9iamVjdCgpXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLmxvY2FsKCkucGx1cygxMjMpIC8vfj4gaW4gMTIzIG1pbGxpc2Vjb25kc1xuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgpLnBsdXMoeyBtaW51dGVzOiAxNSB9KSAvL34+IGluIDE1IG1pbnV0ZXNcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoKS5wbHVzKHsgZGF5czogMSB9KSAvL34+IHRoaXMgdGltZSB0b21vcnJvd1xuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgpLnBsdXMoeyBkYXlzOiAtMSB9KSAvL34+IHRoaXMgdGltZSB5ZXN0ZXJkYXlcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoKS5wbHVzKHsgaG91cnM6IDMsIG1pbnV0ZXM6IDEzIH0pIC8vfj4gaW4gMSBociwgMTMgbWluXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLmxvY2FsKCkucGx1cyhEdXJhdGlvbi5mcm9tT2JqZWN0KHsgaG91cnM6IDMsIG1pbnV0ZXM6IDEzIH0pKSAvL34+IGluIDEgaHIsIDEzIG1pblxuICAgKiBAcmV0dXJuIHtEYXRlVGltZX1cbiAgICovXG5cblxuICBEYXRlVGltZS5wcm90b3R5cGUucGx1cyA9IGZ1bmN0aW9uIHBsdXMoZHVyYXRpb24pIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCkgcmV0dXJuIHRoaXM7XG4gICAgdmFyIGR1ciA9IFV0aWwuZnJpZW5kbHlEdXJhdGlvbihkdXJhdGlvbik7XG4gICAgcmV0dXJuIGNsb25lKHRoaXMsIGFkanVzdFRpbWUodGhpcywgZHVyKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFN1YnRyYWN0IGEgcGVyaW9kIG9mIHRpbWUgdG8gdGhpcyBEYXRlVGltZSBhbmQgcmV0dXJuIHRoZSByZXN1bHRpbmcgRGF0ZVRpbWVcbiAgICogU2VlIHtAbGluayBwbHVzfVxuICAgKiBAcGFyYW0ge0R1cmF0aW9ufG51bWJlcnxvYmplY3R9IGR1cmF0aW9uIC0gVGhlIGFtb3VudCB0byBzdWJ0cmFjdC4gRWl0aGVyIGEgTHV4b24gRHVyYXRpb24sIGEgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcywgdGhlIG9iamVjdCBhcmd1bWVudCB0byBEdXJhdGlvbi5mcm9tT2JqZWN0KClcbiAgIEByZXR1cm4ge0RhdGVUaW1lfVxuICAqL1xuXG5cbiAgRGF0ZVRpbWUucHJvdG90eXBlLm1pbnVzID0gZnVuY3Rpb24gbWludXMoZHVyYXRpb24pIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCkgcmV0dXJuIHRoaXM7XG4gICAgdmFyIGR1ciA9IFV0aWwuZnJpZW5kbHlEdXJhdGlvbihkdXJhdGlvbikubmVnYXRlKCk7XG4gICAgcmV0dXJuIGNsb25lKHRoaXMsIGFkanVzdFRpbWUodGhpcywgZHVyKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFwiU2V0XCIgdGhpcyBEYXRlVGltZSB0byB0aGUgYmVnaW5uaW5nIG9mIGEgdW5pdCBvZiB0aW1lLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdW5pdCAtIFRoZSB1bml0IHRvIGdvIHRvIHRoZSBiZWdpbm5pbmcgb2YuIENhbiBiZSAneWVhcicsICdtb250aCcsICdkYXknLCAnaG91cicsICdtaW51dGUnLCAnc2Vjb25kJywgb3IgJ21pbGxpc2Vjb25kJy5cbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoMjAxNCwgMywgMykuc3RhcnRPZignbW9udGgnKS50b0lTT0RhdGUoKTsgLy89PiAnMjAxNC0wMy0wMSdcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoMjAxNCwgMywgMykuc3RhcnRPZigneWVhcicpLnRvSVNPRGF0ZSgpOyAvLz0+ICcyMDE0LTAxLTAxJ1xuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgyMDE0LCAzLCAzLCA1LCAzMCkuc3RhcnRPZignZGF5JykudG9JU09UaW1lKCk7IC8vPT4gJzAwOjAwLjAwMC0wNTowMCdcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoMjAxNCwgMywgMywgNSwgMzApLnN0YXJ0T2YoJ2hvdXInKS50b0lTT1RpbWUoKTsgLy89PiAnMDU6MDA6MDAuMDAwLTA1OjAwJ1xuICAgKiBAcmV0dXJuIHtEYXRlVGltZX1cbiAgICovXG5cblxuICBEYXRlVGltZS5wcm90b3R5cGUuc3RhcnRPZiA9IGZ1bmN0aW9uIHN0YXJ0T2YodW5pdCkge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKSByZXR1cm4gdGhpcztcbiAgICB2YXIgbyA9IHt9LFxuICAgICAgICBub3JtYWxpemVkVW5pdCA9IER1cmF0aW9uLm5vcm1hbGl6ZVVuaXQodW5pdCk7XG4gICAgc3dpdGNoIChub3JtYWxpemVkVW5pdCkge1xuICAgICAgY2FzZSAneWVhcnMnOlxuICAgICAgICBvLm1vbnRoID0gMTtcbiAgICAgIC8vIGZhbGxzIHRocm91Z2hcbiAgICAgIGNhc2UgJ21vbnRocyc6XG4gICAgICAgIG8uZGF5ID0gMTtcbiAgICAgIC8vIGZhbGxzIHRocm91Z2hcbiAgICAgIGNhc2UgJ3dlZWtzJzpcbiAgICAgIGNhc2UgJ2RheXMnOlxuICAgICAgICBvLmhvdXIgPSAwO1xuICAgICAgLy8gZmFsbHMgdGhyb3VnaFxuICAgICAgY2FzZSAnaG91cnMnOlxuICAgICAgICBvLm1pbnV0ZSA9IDA7XG4gICAgICAvLyBmYWxscyB0aHJvdWdoXG4gICAgICBjYXNlICdtaW51dGVzJzpcbiAgICAgICAgby5zZWNvbmQgPSAwO1xuICAgICAgLy8gZmFsbHMgdGhyb3VnaFxuICAgICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgICAgIG8ubWlsbGlzZWNvbmQgPSAwO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21pbGxpc2Vjb25kcyc6XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEludmFsaWRVbml0RXJyb3IodW5pdCk7XG4gICAgfVxuXG4gICAgaWYgKG5vcm1hbGl6ZWRVbml0ID09PSAnd2Vla3MnKSB7XG4gICAgICBvLndlZWtkYXkgPSAxO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNldChvKTtcbiAgfTtcblxuICAvKipcbiAgICogXCJTZXRcIiB0aGlzIERhdGVUaW1lIHRvIHRoZSBlbmQgKGkuZS4gdGhlIGxhc3QgbWlsbGlzZWNvbmQpIG9mIGEgdW5pdCBvZiB0aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1bml0IC0gVGhlIHVuaXQgdG8gZ28gdG8gdGhlIGVuZCBvZi4gQ2FuIGJlICd5ZWFyJywgJ21vbnRoJywgJ2RheScsICdob3VyJywgJ21pbnV0ZScsICdzZWNvbmQnLCBvciAnbWlsbGlzZWNvbmQnLlxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgyMDE0LCAzLCAzKS5lbmRPZignbW9udGgnKS50b0lTTygpOyAvLz0+ICcyMDE0LTAzLTAzVDAwOjAwOjAwLjAwMC0wNTowMCdcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoMjAxNCwgMywgMykuZW5kT2YoJ3llYXInKS50b0lTTygpOyAvLz0+ICcyMDE0LTEyLTMxVDIzOjU5OjU5Ljk5OS0wNTowMCdcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoMjAxNCwgMywgMywgNSwgMzApLmVuZE9mKCdkYXknKS50b0lTTygpOyAvLz0+ICcyMDE0LTAzLTAzVDIzOjU5OjU5Ljk5OS0wNTowMCdcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoMjAxNCwgMywgMywgNSwgMzApLmVuZE9mKCdob3VyJykudG9JU08oKTsgLy89PiAnMjAxNC0wMy0wM1QwNTo1OTo1OS45OTktMDU6MDAnXG4gICAqIEByZXR1cm4ge0RhdGVUaW1lfVxuICAgKi9cblxuXG4gIERhdGVUaW1lLnByb3RvdHlwZS5lbmRPZiA9IGZ1bmN0aW9uIGVuZE9mKHVuaXQpIHtcbiAgICB2YXIgX3N0YXJ0T2YkcGx1cztcblxuICAgIHJldHVybiB0aGlzLmlzVmFsaWQgPyB0aGlzLnN0YXJ0T2YodW5pdCkucGx1cygoX3N0YXJ0T2YkcGx1cyA9IHt9LCBfc3RhcnRPZiRwbHVzW3VuaXRdID0gMSwgX3N0YXJ0T2YkcGx1cykpLm1pbnVzKDEpIDogdGhpcztcbiAgfTtcblxuICAvLyBPVVRQVVRcblxuICAvKipcbiAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIERhdGVUaW1lIGZvcm1hdHRlZCBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmllZCBmb3JtYXQgc3RyaW5nLlxuICAgKiAqKllvdSBtYXkgbm90IHdhbnQgdGhpcy4qKiBTZWUge0BsaW5rIHRvTG9jYWxlU3RyaW5nfSBmb3IgYSBtb3JlIGZsZXhpYmxlIGZvcm1hdHRpbmcgdG9vbC4gU2VlIHRoZSBkb2N1bWVudGF0aW9uIGZvciB0aGUgc3BlY2lmaWMgZm9ybWF0IHRva2VucyBzdXBwb3J0ZWQuXG4gICAqIERlZmF1bHRzIHRvIGVuLVVTIGlmIG5vIGxvY2FsZSBoYXMgYmVlbiBzcGVjaWZpZWQsIHJlZ2FyZGxlc3Mgb2YgdGhlIHN5c3RlbSdzIGxvY2FsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZm10IC0gdGhlIGZvcm1hdCBzdHJpbmdcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdHMgLSBvcHRpb25zXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gb3B0cy5yb3VuZCAtIHJvdW5kIG51bWVyaWNhbCB2YWx1ZXNcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoKS50b0Zvcm1hdCgneXl5eSBMTEwgZGQnKSAvLz0+ICcyMDE3IEFwciAyMidcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoKS5zZXRMb2NhbGUoJ2ZyJykudG9Gb3JtYXQoJ3l5eXkgTExMIGRkJykgLy89PiAnMjAxNyBhdnIuIDIyJ1xuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgpLnRvRm9ybWF0KFwiSEggJ2hvdXJzIGFuZCcgbW0gJ21pbnV0ZXMnXCIpIC8vPT4gJzIwIGhvdXJzIGFuZCA1NSBtaW51dGVzJ1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuXG5cbiAgRGF0ZVRpbWUucHJvdG90eXBlLnRvRm9ybWF0ID0gZnVuY3Rpb24gdG9Gb3JtYXQoZm10KSB7XG4gICAgdmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgcmV0dXJuIHRoaXMuaXNWYWxpZCA/IEZvcm1hdHRlci5jcmVhdGUodGhpcy5sb2MucmVkZWZhdWx0VG9FTigpLCBvcHRzKS5mb3JtYXREYXRlVGltZUZyb21TdHJpbmcodGhpcywgZm10KSA6IElOVkFMSUQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBsb2NhbGl6ZWQgc3RyaW5nIHJlcHJlc2VudGluZyB0aGlzIGRhdGUuIEFjY2VwdHMgdGhlIHNhbWUgb3B0aW9ucyBhcyB0aGUgSW50bC5EYXRlVGltZUZvcm1hdCBjb25zdHJ1Y3RvciBhbmQgYW55IHByZXNldHMgZGVmaW5lZCBieSBMdXhvbiwgc3VjaCBhcyBgRGF0ZVRpbWUuREFURV9GVUxMYCBvciBgRGF0ZVRpbWUuVElNRV9TSU1QTEVgLlxuICAgKiBUaGUgZXhhY3QgYmVoYXZpb3Igb2YgdGhpcyBtZXRob2QgaXMgYnJvd3Nlci1zcGVjaWZpYywgYnV0IGluIGdlbmVyYWwgaXQgd2lsbCByZXR1cm4gYW4gYXBwcm9wcmlhdGUgcmVwcmVzZW50YXRpb24uXG4gICAqIG9mIHRoZSBEYXRlVGltZSBpbiB0aGUgYXNzaWduZWQgbG9jYWxlLlxuICAgKiBEZWZhdWx0cyB0byB0aGUgc3lzdGVtJ3MgbG9jYWxlIGlmIG5vIGxvY2FsZSBoYXMgYmVlbiBzcGVjaWZpZWRcbiAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9EYXRlVGltZUZvcm1hdFxuICAgKiBAcGFyYW0gb3B0cyB7b2JqZWN0fSAtIEludGwuRGF0ZVRpbWVGb3JtYXQgY29uc3RydWN0b3Igb3B0aW9uc1xuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgpLnRvTG9jYWxlU3RyaW5nKCk7IC8vPT4gNC8yMC8yMDE3XG4gICAqIEBleGFtcGxlIERhdGVUaW1lLmxvY2FsKCkuc2V0TG9jYWxlKCdlbi1nYicpLnRvTG9jYWxlU3RyaW5nKCk7IC8vPT4gJzIwLzA0LzIwMTcnXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLmxvY2FsKCkudG9Mb2NhbGVTdHJpbmcoRGF0ZVRpbWUuREFURV9GVUxMKTsgLy89PiAnQXByaWwgMjAsIDIwMTcnXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLmxvY2FsKCkudG9Mb2NhbGVTdHJpbmcoRGF0ZVRpbWUuVElNRV9TSU1QTEUpOyAvLz0+ICcxMTozMiBBTSdcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoKS50b0xvY2FsZVN0cmluZyhEYXRlVGltZS5EQVRFVElNRV9TSE9SVCk7IC8vPT4gJzQvMjAvMjAxNywgMTE6MzIgQU0nXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLmxvY2FsKCkudG9Mb2NhbGVTdHJpbmcoe3dlZWtkYXk6ICdsb25nJywgbW9udGg6ICdsb25nJywgZGF5OiAnMi1kaWdpdCd9KTsgLy89PiAnVGh1LCBBcHIgMjAnXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLmxvY2FsKCkudG9Mb2NhbGVTdHJpbmcoe3dlZWtkYXk6ICdsb25nJywgbW9udGg6ICdsb25nJywgZGF5OiAnMi1kaWdpdCcsIGhvdXI6ICcyLWRpZ2l0JywgbWludXRlOiAnMi1kaWdpdCd9KTsgLy89PiAnVGh1LCBBcHIgMjAsIDExOjI3J1xuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgpLnRvTG9jYWxlU3RyaW5nKHtob3VyOiAnMi1kaWdpdCcsIG1pbnV0ZTogJzItZGlnaXQnfSk7IC8vPT4gJzExOjMyJ1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuXG5cbiAgRGF0ZVRpbWUucHJvdG90eXBlLnRvTG9jYWxlU3RyaW5nID0gZnVuY3Rpb24gdG9Mb2NhbGVTdHJpbmcoKSB7XG4gICAgdmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IEZvcm1hdHMuREFURV9TSE9SVDtcblxuICAgIHJldHVybiB0aGlzLmlzVmFsaWQgPyBGb3JtYXR0ZXIuY3JlYXRlKHRoaXMubG9jLmNsb25lKG9wdHMpLCBvcHRzKS5mb3JtYXREYXRlVGltZSh0aGlzKSA6IElOVkFMSUQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgZm9ybWF0IFwicGFydHNcIiwgaS5lLiBpbmRpdmlkdWFsIHRva2VucyBhbG9uZyB3aXRoIG1ldGFkYXRhLiBUaGlzIGlzIGFsbG93cyBjYWxsZXJzIHRvIHBvc3QtcHJvY2VzcyBpbmRpdmlkdWFsIHNlY3Rpb25zIG9mIHRoZSBmb3JtYXR0ZWQgb3V0cHV0LlxuICAgKiBEZWZhdWx0cyB0byB0aGUgc3lzdGVtJ3MgbG9jYWxlIGlmIG5vIGxvY2FsZSBoYXMgYmVlbiBzcGVjaWZpZWRcbiAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9EYXRlVGltZUZvcm1hdC9mb3JtYXRUb1BhcnRzXG4gICAqIEBwYXJhbSBvcHRzIHtvYmplY3R9IC0gSW50bC5EYXRlVGltZUZvcm1hdCBjb25zdHJ1Y3RvciBvcHRpb25zLCBzYW1lIGFzIGB0b0xvY2FsZVN0cmluZ2AuXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLmxvY2FsKCkudG9Mb2NhbGVTdHJpbmcoKTsgLy89PiBbXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy89PiAgIHsgdHlwZTogJ2RheScsIHZhbHVlOiAnMjUnIH0sXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy89PiAgIHsgdHlwZTogJ2xpdGVyYWwnLCB2YWx1ZTogJy8nIH0sXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy89PiAgIHsgdHlwZTogJ21vbnRoJywgdmFsdWU6ICcwNScgfSxcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLz0+ICAgeyB0eXBlOiAnbGl0ZXJhbCcsIHZhbHVlOiAnLycgfSxcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLz0+ICAgeyB0eXBlOiAneWVhcicsIHZhbHVlOiAnMTk4MicgfVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vPT4gXVxuICAgKi9cblxuXG4gIERhdGVUaW1lLnByb3RvdHlwZS50b0xvY2FsZVBhcnRzID0gZnVuY3Rpb24gdG9Mb2NhbGVQYXJ0cygpIHtcbiAgICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgICByZXR1cm4gdGhpcy5pc1ZhbGlkID8gRm9ybWF0dGVyLmNyZWF0ZSh0aGlzLmxvYy5jbG9uZShvcHRzKSwgb3B0cykuZm9ybWF0RGF0ZVRpbWVQYXJ0cyh0aGlzKSA6IFtdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIElTTyA4NjAxLWNvbXBsaWFudCBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBEYXRlVGltZVxuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0cyAtIG9wdGlvbnNcbiAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5zdXBwcmVzc01pbGxpc2Vjb25kcz1mYWxzZV0gLSBleGNsdWRlIG1pbGxpc2Vjb25kcyBmcm9tIHRoZSBmb3JtYXQgaWYgdGhleSdyZSAwXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuc3VwcHJlc3NTZWNvbmRzPWZhbHNlXSAtIGV4Y2x1ZGUgc2Vjb25kcyBmcm9tIHRoZSBmb3JtYXQgaWYgdGhleSdyZSAwXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuaW5jbHVkZU9mZnNldD10cnVlXSAtIGluY2x1ZGUgdGhlIG9mZnNldCwgc3VjaCBhcyAnWicgb3IgJy0wNDowMCdcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUudXRjKDE5ODIsIDUsIDI1KS50b0lTTygpIC8vPT4gJzE5ODItMDUtMjVUMDA6MDA6MDAuMDAwWidcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoKS50b0lTTygpIC8vPT4gJzIwMTctMDQtMjJUMjA6NDc6MDUuMzM1LTA0OjAwJ1xuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgpLnRvSVNPKHsgaW5jbHVkZU9mZnNldDogZmFsc2UgfSkgLy89PiAnMjAxNy0wNC0yMlQyMDo0NzowNS4zMzUnXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG5cblxuICBEYXRlVGltZS5wcm90b3R5cGUudG9JU08gPSBmdW5jdGlvbiB0b0lTTygpIHtcbiAgICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgICBpZiAoIXRoaXMuaXNWYWxpZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudG9JU09EYXRlKCkgKyAnVCcgKyB0aGlzLnRvSVNPVGltZShvcHRzKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhbiBJU08gODYwMS1jb21wbGlhbnQgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgRGF0ZVRpbWUncyBkYXRlIGNvbXBvbmVudFxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS51dGMoMTk4MiwgNSwgMjUpLnRvSVNPRGF0ZSgpIC8vPT4gJzE5ODItMDUtMjUnXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG5cblxuICBEYXRlVGltZS5wcm90b3R5cGUudG9JU09EYXRlID0gZnVuY3Rpb24gdG9JU09EYXRlKCkge1xuICAgIHJldHVybiB0b1RlY2hGb3JtYXQodGhpcywgJ3l5eXktTU0tZGQnKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhbiBJU08gODYwMS1jb21wbGlhbnQgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgRGF0ZVRpbWUncyB3ZWVrIGRhdGVcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUudXRjKDE5ODIsIDUsIDI1KS50b0lTT1dlZWtEYXRlKCkgLy89PiAnMTk4Mi1XMjEtMidcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cblxuXG4gIERhdGVUaW1lLnByb3RvdHlwZS50b0lTT1dlZWtEYXRlID0gZnVuY3Rpb24gdG9JU09XZWVrRGF0ZSgpIHtcbiAgICByZXR1cm4gdG9UZWNoRm9ybWF0KHRoaXMsIFwia2tray0nVydXVy1jXCIpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIElTTyA4NjAxLWNvbXBsaWFudCBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBEYXRlVGltZSdzIHRpbWUgY29tcG9uZW50XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRzIC0gb3B0aW9uc1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRzLnN1cHByZXNzTWlsbGlzZWNvbmRzPWZhbHNlXSAtIGV4Y2x1ZGUgbWlsbGlzZWNvbmRzIGZyb20gdGhlIGZvcm1hdCBpZiB0aGV5J3JlIDBcbiAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5zdXBwcmVzc1NlY29uZHM9ZmFsc2VdIC0gZXhjbHVkZSBzZWNvbmRzIGZyb20gdGhlIGZvcm1hdCBpZiB0aGV5J3JlIDBcbiAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5pbmNsdWRlT2Zmc2V0PXRydWVdIC0gaW5jbHVkZSB0aGUgb2Zmc2V0LCBzdWNoIGFzICdaJyBvciAnLTA0OjAwJ1xuICAgKiBAZXhhbXBsZSBEYXRlVGltZS51dGMoKS5ob3VyKDcpLm1pbnV0ZSgzNCkudG9JU09UaW1lKCkgLy89PiAnMDc6MzQ6MTkuMzYxWidcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUudXRjKCkuaG91cig3KS5taW51dGUoMzQpLnRvSVNPVGltZSh7IHN1cHByZXNzU2Vjb25kczogdHJ1ZSB9KSAvLz0+ICcwNzozNFonXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG5cblxuICBEYXRlVGltZS5wcm90b3R5cGUudG9JU09UaW1lID0gZnVuY3Rpb24gdG9JU09UaW1lKCkge1xuICAgIHZhciBfcmVmNiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge30sXG4gICAgICAgIF9yZWY2JHN1cHByZXNzTWlsbGlzZSA9IF9yZWY2LnN1cHByZXNzTWlsbGlzZWNvbmRzLFxuICAgICAgICBzdXBwcmVzc01pbGxpc2Vjb25kcyA9IF9yZWY2JHN1cHByZXNzTWlsbGlzZSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfcmVmNiRzdXBwcmVzc01pbGxpc2UsXG4gICAgICAgIF9yZWY2JHN1cHByZXNzU2Vjb25kcyA9IF9yZWY2LnN1cHByZXNzU2Vjb25kcyxcbiAgICAgICAgc3VwcHJlc3NTZWNvbmRzID0gX3JlZjYkc3VwcHJlc3NTZWNvbmRzID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IF9yZWY2JHN1cHByZXNzU2Vjb25kcyxcbiAgICAgICAgX3JlZjYkaW5jbHVkZU9mZnNldCA9IF9yZWY2LmluY2x1ZGVPZmZzZXQsXG4gICAgICAgIGluY2x1ZGVPZmZzZXQgPSBfcmVmNiRpbmNsdWRlT2Zmc2V0ID09PSB1bmRlZmluZWQgPyB0cnVlIDogX3JlZjYkaW5jbHVkZU9mZnNldDtcblxuICAgIHJldHVybiB0b1RlY2hUaW1lRm9ybWF0KHRoaXMsIHsgc3VwcHJlc3NTZWNvbmRzOiBzdXBwcmVzc1NlY29uZHMsIHN1cHByZXNzTWlsbGlzZWNvbmRzOiBzdXBwcmVzc01pbGxpc2Vjb25kcywgaW5jbHVkZU9mZnNldDogaW5jbHVkZU9mZnNldCB9KTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhbiBSRkMgMjgyMi1jb21wYXRpYmxlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIERhdGVUaW1lLCBhbHdheXMgaW4gVVRDXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLnV0YygyMDE0LCA3LCAxMykudG9SRkMyODIyKCkgLy89PiAnU3VuLCAxMyBKdWwgMjAxNCAwMDowMDowMCArMDAwMCdcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoMjAxNCwgNywgMTMpLnRvUkZDMjgyMigpIC8vPT4gJ1N1biwgMTMgSnVsIDIwMTQgMDA6MDA6MDAgLTA0MDAnXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG5cblxuICBEYXRlVGltZS5wcm90b3R5cGUudG9SRkMyODIyID0gZnVuY3Rpb24gdG9SRkMyODIyKCkge1xuICAgIHJldHVybiB0b1RlY2hGb3JtYXQodGhpcywgJ0VFRSwgZGQgTExMIHl5eXkgaGg6bW06c3MgWlpaJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBEYXRlVGltZSBhcHByb3ByaWF0ZSBmb3IgdXNlIGluIEhUVFAgaGVhZGVycy5cbiAgICogU3BlY2lmaWNhbGx5LCB0aGUgc3RyaW5nIGNvbmZvcm1zIHRvIFJGQyAxMTIzLlxuICAgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9Qcm90b2NvbHMvcmZjMjYxNi9yZmMyNjE2LXNlYzMuaHRtbCNzZWMzLjMuMVxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS51dGMoMjAxNCwgNywgMTMpLnRvSFRUUCgpIC8vPT4gJ1N1biwgMTMgSnVsIDIwMTQgMDA6MDA6MDAgR01UJ1xuICAgKiBAZXhhbXBsZSBEYXRlVGltZS51dGMoMjAxNCwgNywgMTMsIDE5KS50b0hUVFAoKSAvLz0+ICdTdW4sIDEzIEp1bCAyMDE0IDE5OjAwOjAwIEdNVCdcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cblxuXG4gIERhdGVUaW1lLnByb3RvdHlwZS50b0hUVFAgPSBmdW5jdGlvbiB0b0hUVFAoKSB7XG4gICAgcmV0dXJuIHRvVGVjaEZvcm1hdCh0aGlzLnRvVVRDKCksIFwiRUVFLCBkZCBMTEwgeXl5eSBISDptbTpzcyAnR01UJ1wiKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIERhdGVUaW1lIGFwcHJvcHJpYXRlIGZvciB1c2UgaW4gU1FMIERhdGVcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUudXRjKDIwMTQsIDcsIDEzKS50b1NRTERhdGUoKSAvLz0+ICcyMDE0LTA3LTEzJ1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuXG5cbiAgRGF0ZVRpbWUucHJvdG90eXBlLnRvU1FMRGF0ZSA9IGZ1bmN0aW9uIHRvU1FMRGF0ZSgpIHtcbiAgICByZXR1cm4gdG9UZWNoRm9ybWF0KHRoaXMsICd5eXl5LU1NLWRkJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBEYXRlVGltZSBhcHByb3ByaWF0ZSBmb3IgdXNlIGluIFNRTCBUaW1lXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRzIC0gb3B0aW9uc1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRzLmluY2x1ZGVab25lPWZhbHNlXSAtIGluY2x1ZGUgdGhlIHpvbmUsIHN1Y2ggYXMgJ0FtZXJpY2EvTmV3X1lvcmsnLiBPdmVyaWRlcyBpbmNsdWRlT2Zmc2V0LlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRzLmluY2x1ZGVPZmZzZXQ9dHJ1ZV0gLSBpbmNsdWRlIHRoZSBvZmZzZXQsIHN1Y2ggYXMgJ1onIG9yICctMDQ6MDAnXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLnV0YygpLnRvU1FMKCkgLy89PiAnMDU6MTU6MTYuMzQ1J1xuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgpLnRvU1FMKCkgLy89PiAnMDU6MTU6MTYuMzQ1IC0wNDowMCdcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoKS50b1NRTCh7IGluY2x1ZGVPZmZzZXQ6IGZhbHNlIH0pIC8vPT4gJzA1OjE1OjE2LjM0NSdcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoKS50b1NRTCh7IGluY2x1ZGVab25lOiBmYWxzZSB9KSAvLz0+ICcwNToxNToxNi4zNDUgQW1lcmljYS9OZXdfWW9yaydcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cblxuXG4gIERhdGVUaW1lLnByb3RvdHlwZS50b1NRTFRpbWUgPSBmdW5jdGlvbiB0b1NRTFRpbWUoKSB7XG4gICAgdmFyIF9yZWY3ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fSxcbiAgICAgICAgX3JlZjckaW5jbHVkZU9mZnNldCA9IF9yZWY3LmluY2x1ZGVPZmZzZXQsXG4gICAgICAgIGluY2x1ZGVPZmZzZXQgPSBfcmVmNyRpbmNsdWRlT2Zmc2V0ID09PSB1bmRlZmluZWQgPyB0cnVlIDogX3JlZjckaW5jbHVkZU9mZnNldCxcbiAgICAgICAgX3JlZjckaW5jbHVkZVpvbmUgPSBfcmVmNy5pbmNsdWRlWm9uZSxcbiAgICAgICAgaW5jbHVkZVpvbmUgPSBfcmVmNyRpbmNsdWRlWm9uZSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfcmVmNyRpbmNsdWRlWm9uZTtcblxuICAgIHJldHVybiB0b1RlY2hUaW1lRm9ybWF0KHRoaXMsIHsgaW5jbHVkZU9mZnNldDogaW5jbHVkZU9mZnNldCwgaW5jbHVkZVpvbmU6IGluY2x1ZGVab25lLCBzcGFjZVpvbmU6IHRydWUgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBEYXRlVGltZSBhcHByb3ByaWF0ZSBmb3IgdXNlIGluIFNRTCBEYXRlVGltZVxuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0cyAtIG9wdGlvbnNcbiAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5pbmNsdWRlWm9uZT1mYWxzZV0gLSBpbmNsdWRlIHRoZSB6b25lLCBzdWNoIGFzICdBbWVyaWNhL05ld19Zb3JrJy4gT3ZlcnJpZGVzIGluY2x1ZGVPZmZzZXQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuaW5jbHVkZU9mZnNldD10cnVlXSAtIGluY2x1ZGUgdGhlIG9mZnNldCwgc3VjaCBhcyAnWicgb3IgJy0wNDowMCdcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUudXRjKDIwMTQsIDcsIDEzKS50b1NRTCgpIC8vPT4gJzIwMTQtMDctMTMgMDA6MDA6MDAuMDAwIFonXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLmxvY2FsKDIwMTQsIDcsIDEzKS50b1NRTCgpIC8vPT4gJzIwMTQtMDctMTMgMDA6MDA6MDAuMDAwIC0wNDowMCdcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoMjAxNCwgNywgMTMpLnRvU1FMKHsgaW5jbHVkZU9mZnNldDogZmFsc2UgfSkgLy89PiAnMjAxNC0wNy0xMyAwMDowMDowMC4wMDAnXG4gICAqIEBleGFtcGxlIERhdGVUaW1lLmxvY2FsKDIwMTQsIDcsIDEzKS50b1NRTCh7IGluY2x1ZGVab25lOiBmYWxzZSB9KSAvLz0+ICcyMDE0LTA3LTEzIDAwOjAwOjAwLjAwMCBBbWVyaWNhL05ld19Zb3JrJ1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuXG5cbiAgRGF0ZVRpbWUucHJvdG90eXBlLnRvU1FMID0gZnVuY3Rpb24gdG9TUUwoKSB7XG4gICAgdmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG4gICAgaWYgKCF0aGlzLmlzVmFsaWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnRvU1FMRGF0ZSgpICsgJyAnICsgdGhpcy50b1NRTFRpbWUob3B0cyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBEYXRlVGltZSBhcHByb3ByaWF0ZSBmb3IgZGVidWdnaW5nXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG5cblxuICBEYXRlVGltZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5pc1ZhbGlkID8gdGhpcy50b0lTTygpIDogSU5WQUxJRDtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIERhdGVUaW1lIGFwcHJvcHJpYXRlIGZvciB0aGUgUkVQTC5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cblxuXG4gIERhdGVUaW1lLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCgpIHtcbiAgICBpZiAodGhpcy5pc1ZhbGlkKSB7XG4gICAgICByZXR1cm4gJ0RhdGVUaW1lIHtcXG4gIHRzOiAnICsgdGhpcy50b0lTTygpICsgJyxcXG4gIHpvbmU6ICcgKyB0aGlzLnpvbmUubmFtZSArICcsXFxuICBsb2NhbGU6ICcgKyB0aGlzLmxvY2FsZSArICcgfSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnRGF0ZVRpbWUgeyBJbnZhbGlkLCByZWFzb246ICcgKyB0aGlzLmludmFsaWRSZWFzb24gKyAnIH0nO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZXBvY2ggbWlsbGlzZWNvbmRzIG9mIHRoaXMgRGF0ZVRpbWVcbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cblxuXG4gIERhdGVUaW1lLnByb3RvdHlwZS52YWx1ZU9mID0gZnVuY3Rpb24gdmFsdWVPZigpIHtcbiAgICByZXR1cm4gdGhpcy5pc1ZhbGlkID8gdGhpcy50cyA6IE5hTjtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhbiBJU08gODYwMSByZXByZXNlbnRhdGlvbiBvZiB0aGlzIERhdGVUaW1lIGFwcHJvcHJpYXRlIGZvciB1c2UgaW4gSlNPTi5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cblxuXG4gIERhdGVUaW1lLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHRoaXMudG9JU08oKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIEphdmFzY3JpcHQgb2JqZWN0IHdpdGggdGhpcyBEYXRlVGltZSdzIHllYXIsIG1vbnRoLCBkYXksIGFuZCBzbyBvbi5cbiAgICogQHBhcmFtIG9wdHMgLSBvcHRpb25zIGZvciBnZW5lcmF0aW5nIHRoZSBvYmplY3RcbiAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5pbmNsdWRlQ29uZmlnPWZhbHNlXSAtIGluY2x1ZGUgY29uZmlndXJhdGlvbiBhdHRyaWJ1dGVzIGluIHRoZSBvdXRwdXRcbiAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoKS50b09iamVjdCgpIC8vPT4geyB5ZWFyOiAyMDE3LCBtb250aDogNCwgZGF5OiAyMiwgaG91cjogMjAsIG1pbnV0ZTogNDksIHNlY29uZDogNDIsIG1pbGxpc2Vjb25kOiAyNjggfVxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuXG5cbiAgRGF0ZVRpbWUucHJvdG90eXBlLnRvT2JqZWN0ID0gZnVuY3Rpb24gdG9PYmplY3QoKSB7XG4gICAgdmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG4gICAgaWYgKCF0aGlzLmlzVmFsaWQpIHJldHVybiB7fTtcblxuICAgIHZhciBiYXNlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jKTtcblxuICAgIGlmIChvcHRzLmluY2x1ZGVDb25maWcpIHtcbiAgICAgIGJhc2Uub3V0cHV0Q2FsZW5kYXIgPSB0aGlzLm91dHB1dENhbGVuZGFyO1xuICAgICAgYmFzZS5udW1iZXJpbmdTeXN0ZW0gPSB0aGlzLmxvYy5udW1iZXJpbmdTeXN0ZW07XG4gICAgICBiYXNlLmxvY2FsZSA9IHRoaXMubG9jLmxvY2FsZTtcbiAgICB9XG4gICAgcmV0dXJuIGJhc2U7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBKYXZhc2NyaXB0IERhdGUgZXF1aXZhbGVudCB0byB0aGlzIERhdGVUaW1lLlxuICAgKiBAcmV0dXJuIHtEYXRlfVxuICAgKi9cblxuXG4gIERhdGVUaW1lLnByb3RvdHlwZS50b0pTRGF0ZSA9IGZ1bmN0aW9uIHRvSlNEYXRlKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSh0aGlzLmlzVmFsaWQgPyB0aGlzLnRzIDogTmFOKTtcbiAgfTtcblxuICAvLyBDT01QQVJFXG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHR3byBEYXRlVGltZXMgYXMgYSBEdXJhdGlvbi5cbiAgICogQHBhcmFtIHtEYXRlVGltZX0gb3RoZXJEYXRlVGltZSAtIHRoZSBEYXRlVGltZSB0byBjb21wYXJlIHRoaXMgb25lIHRvXG4gICAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBbdW5pdD1bJ21pbGxpc2Vjb25kcyddXSAtIHRoZSB1bml0IG9yIGFycmF5IG9mIHVuaXRzIChzdWNoIGFzICdob3Vycycgb3IgJ2RheXMnKSB0byBpbmNsdWRlIGluIHRoZSBkdXJhdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdHMgLSBvcHRpb25zIHRoYXQgYWZmZWN0IHRoZSBjcmVhdGlvbiBvZiB0aGUgRHVyYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLmNvbnZlcnNpb25BY2N1cmFjeT0nY2FzdWFsJ10gLSB0aGUgY29udmVyc2lvbiBzeXN0ZW0gdG8gdXNlXG4gICAqIEBleGFtcGxlXG4gICAqIHZhciBpMSA9IERhdGVUaW1lLmZyb21JU08oJzE5ODItMDUtMjVUMDk6NDUnKSxcbiAgICogICAgIGkyID0gRGF0ZVRpbWUuZnJvbUlTTygnMTk4My0xMC0xNFQxMDozMCcpO1xuICAgKiBpMi5kaWZmKGkxKS50b09iamVjdCgpIC8vPT4geyBtaWxsaXNlY29uZHM6IDQzODA3NTAwMDAwIH1cbiAgICogaTIuZGlmZihpMSwgJ2hvdXJzJykudG9PYmplY3QoKSAvLz0+IHsgaG91cnM6IDEyMTY4Ljc1IH1cbiAgICogaTIuZGlmZihpMSwgWydtb250aHMnLCAnZGF5cyddKS50b09iamVjdCgpIC8vPT4geyBtb250aHM6IDE2LCBkYXlzOiAxOS4wMzEyNSB9XG4gICAqIGkyLmRpZmYoaTEsIFsnbW9udGhzJywgJ2RheXMnLCAnaG91cnMnXSkudG9PYmplY3QoKSAvLz0+IHsgbW9udGhzOiAxNiwgZGF5czogMTksIGhvdXJzOiAwLjc1IH1cbiAgICogQHJldHVybiB7RHVyYXRpb259XG4gICAqL1xuXG5cbiAgRGF0ZVRpbWUucHJvdG90eXBlLmRpZmYgPSBmdW5jdGlvbiBkaWZmKG90aGVyRGF0ZVRpbWUpIHtcbiAgICB2YXIgdW5pdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogJ21pbGxpc2Vjb25kcyc7XG4gICAgdmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuXG4gICAgaWYgKCF0aGlzLmlzVmFsaWQgfHwgIW90aGVyRGF0ZVRpbWUuaXNWYWxpZCkgcmV0dXJuIER1cmF0aW9uLmludmFsaWQodGhpcy5pbnZhbGlkUmVhc29uIHx8IG90aGVyRGF0ZVRpbWUuaW52YWxpZFJlYXNvbik7XG5cbiAgICB2YXIgdW5pdHMgPSBVdGlsLm1heWJlQXJyYXkodW5pdCkubWFwKER1cmF0aW9uLm5vcm1hbGl6ZVVuaXQpO1xuXG4gICAgdmFyIGZsaXBwZWQgPSBvdGhlckRhdGVUaW1lLnZhbHVlT2YoKSA+IHRoaXMudmFsdWVPZigpLFxuICAgICAgICBwb3N0ID0gZmxpcHBlZCA/IG90aGVyRGF0ZVRpbWUgOiB0aGlzLFxuICAgICAgICBhY2N1bSA9IHt9O1xuXG4gICAgdmFyIGN1cnNvciA9IGZsaXBwZWQgPyB0aGlzIDogb3RoZXJEYXRlVGltZSxcbiAgICAgICAgbG93ZXN0T3JkZXIgPSBudWxsO1xuXG4gICAgaWYgKHVuaXRzLmluZGV4T2YoJ3llYXJzJykgPj0gMCkge1xuICAgICAgdmFyIGRZZWFyID0gcG9zdC55ZWFyIC0gY3Vyc29yLnllYXI7XG5cbiAgICAgIGN1cnNvciA9IGN1cnNvci5zZXQoeyB5ZWFyOiBwb3N0LnllYXIgfSk7XG5cbiAgICAgIGlmIChjdXJzb3IgPiBwb3N0KSB7XG4gICAgICAgIGN1cnNvciA9IGN1cnNvci5taW51cyh7IHllYXJzOiAxIH0pO1xuICAgICAgICBkWWVhciAtPSAxO1xuICAgICAgfVxuXG4gICAgICBhY2N1bS55ZWFycyA9IGRZZWFyO1xuICAgICAgbG93ZXN0T3JkZXIgPSAneWVhcnMnO1xuICAgIH1cblxuICAgIGlmICh1bml0cy5pbmRleE9mKCdtb250aHMnKSA+PSAwKSB7XG4gICAgICB2YXIgX2RZZWFyID0gcG9zdC55ZWFyIC0gY3Vyc29yLnllYXI7XG4gICAgICB2YXIgZE1vbnRoID0gcG9zdC5tb250aCAtIGN1cnNvci5tb250aCArIF9kWWVhciAqIDEyO1xuXG4gICAgICBjdXJzb3IgPSBjdXJzb3Iuc2V0KHsgeWVhcjogcG9zdC55ZWFyLCBtb250aDogcG9zdC5tb250aCB9KTtcblxuICAgICAgaWYgKGN1cnNvciA+IHBvc3QpIHtcbiAgICAgICAgY3Vyc29yID0gY3Vyc29yLm1pbnVzKHsgbW9udGhzOiAxIH0pO1xuICAgICAgICBkTW9udGggLT0gMTtcbiAgICAgIH1cblxuICAgICAgYWNjdW0ubW9udGhzID0gZE1vbnRoO1xuICAgICAgbG93ZXN0T3JkZXIgPSAnbW9udGhzJztcbiAgICB9XG5cbiAgICB2YXIgY29tcHV0ZURheURlbHRhID0gZnVuY3Rpb24gY29tcHV0ZURheURlbHRhKCkge1xuICAgICAgdmFyIHV0Y0RheVN0YXJ0ID0gZnVuY3Rpb24gdXRjRGF5U3RhcnQoZHQpIHtcbiAgICAgICAgcmV0dXJuIGR0LnRvVVRDKDAsIHsga2VlcExvY2FsVGltZTogdHJ1ZSB9KS5zdGFydE9mKCdkYXknKS52YWx1ZU9mKCk7XG4gICAgICB9LFxuICAgICAgICAgIG1zID0gdXRjRGF5U3RhcnQocG9zdCkgLSB1dGNEYXlTdGFydChjdXJzb3IpO1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoRHVyYXRpb24uZnJvbU1pbGxpcyhtcywgb3B0cykuc2hpZnRUbygnZGF5cycpLmRheXMpO1xuICAgIH07XG5cbiAgICBpZiAodW5pdHMuaW5kZXhPZignd2Vla3MnKSA+PSAwKSB7XG4gICAgICB2YXIgZGF5cyA9IGNvbXB1dGVEYXlEZWx0YSgpO1xuICAgICAgdmFyIHdlZWtzID0gKGRheXMgLSBkYXlzICUgNykgLyA3O1xuICAgICAgY3Vyc29yID0gY3Vyc29yLnBsdXMoeyB3ZWVrczogd2Vla3MgfSk7XG5cbiAgICAgIGlmIChjdXJzb3IgPiBwb3N0KSB7XG4gICAgICAgIGN1cnNvciA9IGN1cnNvci5taW51cyh7IHdlZWtzOiAxIH0pO1xuICAgICAgICB3ZWVrcyAtPSAxO1xuICAgICAgfVxuXG4gICAgICBhY2N1bS53ZWVrcyA9IHdlZWtzO1xuICAgICAgbG93ZXN0T3JkZXIgPSAnd2Vla3MnO1xuICAgIH1cblxuICAgIGlmICh1bml0cy5pbmRleE9mKCdkYXlzJykgPj0gMCkge1xuICAgICAgdmFyIF9kYXlzID0gY29tcHV0ZURheURlbHRhKCk7XG4gICAgICBjdXJzb3IgPSBjdXJzb3Iuc2V0KHtcbiAgICAgICAgeWVhcjogcG9zdC55ZWFyLFxuICAgICAgICBtb250aDogcG9zdC5tb250aCxcbiAgICAgICAgZGF5OiBwb3N0LmRheVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChjdXJzb3IgPiBwb3N0KSB7XG4gICAgICAgIGN1cnNvciA9IGN1cnNvci5taW51cyh7IGRheXM6IDEgfSk7XG4gICAgICAgIF9kYXlzIC09IDE7XG4gICAgICB9XG5cbiAgICAgIGFjY3VtLmRheXMgPSBfZGF5cztcbiAgICAgIGxvd2VzdE9yZGVyID0gJ2RheXMnO1xuICAgIH1cblxuICAgIHZhciByZW1haW5pbmcgPSBEdXJhdGlvbi5mcm9tTWlsbGlzKHBvc3QgLSBjdXJzb3IsIG9wdHMpLFxuICAgICAgICBtb3JlVW5pdHMgPSB1bml0cy5maWx0ZXIoZnVuY3Rpb24gKHUpIHtcbiAgICAgIHJldHVybiBbJ2hvdXJzJywgJ21pbnV0ZXMnLCAnc2Vjb25kcycsICdtaWxsaXNlY29uZHMnXS5pbmRleE9mKHUpID49IDA7XG4gICAgfSksXG4gICAgICAgIHNoaWZ0VG8gPSBtb3JlVW5pdHMubGVuZ3RoID4gMCA/IG1vcmVVbml0cyA6IFtsb3dlc3RPcmRlcl0sXG4gICAgICAgIHNoaWZ0ZWQgPSByZW1haW5pbmcuc2hpZnRUby5hcHBseShyZW1haW5pbmcsIHNoaWZ0VG8pLFxuICAgICAgICBtZXJnZWQgPSBzaGlmdGVkLnBsdXMoRHVyYXRpb24uZnJvbU9iamVjdChPYmplY3QuYXNzaWduKGFjY3VtLCBvcHRzKSkpO1xuXG4gICAgcmV0dXJuIGZsaXBwZWQgPyBtZXJnZWQubmVnYXRlKCkgOiBtZXJnZWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoaXMgRGF0ZVRpbWUgYW5kIHJpZ2h0IG5vdy5cbiAgICogU2VlIHtAbGluayBkaWZmfVxuICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gW3VuaXQ9WydtaWxsaXNlY29uZHMnXV0gLSB0aGUgdW5pdCBvciB1bml0cyB1bml0cyAoc3VjaCBhcyAnaG91cnMnIG9yICdkYXlzJykgdG8gaW5jbHVkZSBpbiB0aGUgZHVyYXRpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdHMgLSBvcHRpb25zIHRoYXQgYWZmZWN0IHRoZSBjcmVhdGlvbiBvZiB0aGUgRHVyYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLmNvbnZlcnNpb25BY2N1cmFjeT0nY2FzdWFsJ10gLSB0aGUgY29udmVyc2lvbiBzeXN0ZW0gdG8gdXNlXG4gICAqIEByZXR1cm4ge0R1cmF0aW9ufVxuICAgKi9cblxuXG4gIERhdGVUaW1lLnByb3RvdHlwZS5kaWZmTm93ID0gZnVuY3Rpb24gZGlmZk5vdygpIHtcbiAgICB2YXIgdW5pdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJ21pbGxpc2Vjb25kcyc7XG4gICAgdmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgcmV0dXJuIHRoaXMuZGlmZihEYXRlVGltZS5sb2NhbCgpLCB1bml0LCBvcHRzKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJuIGFuIEludGVydmFsIHNwYW5uaW5nIGJldHdlZW4gdGhpcyBEYXRlVGltZSBhbmQgYW5vdGhlciBEYXRlVGltZVxuICAgKiBAcGFyYW0ge0RhdGVUaW1lfSBvdGhlckRhdGVUaW1lIC0gdGhlIG90aGVyIGVuZCBwb2ludCBvZiB0aGUgSW50ZXJ2YWxcbiAgICogQHJldHVybiB7RHVyYXRpb259XG4gICAqL1xuXG5cbiAgRGF0ZVRpbWUucHJvdG90eXBlLnVudGlsID0gZnVuY3Rpb24gdW50aWwob3RoZXJEYXRlVGltZSkge1xuICAgIHJldHVybiB0aGlzLmlzVmFsaWQgPyBJbnRlcnZhbC5mcm9tRGF0ZVRpbWVzKHRoaXMsIG90aGVyRGF0ZVRpbWUpIDogdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJuIHdoZXRoZXIgdGhpcyBEYXRlVGltZSBpcyBpbiB0aGUgc2FtZSB1bml0IG9mIHRpbWUgYXMgYW5vdGhlciBEYXRlVGltZVxuICAgKiBAcGFyYW0ge0RhdGVUaW1lfSBvdGhlckRhdGVUaW1lIC0gdGhlIG90aGVyIERhdGVUaW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1bml0IC0gdGhlIHVuaXQgb2YgdGltZSB0byBjaGVjayBzYW1lbmVzcyBvblxuICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgpLmhhc1NhbWUob3RoZXJEVCwgJ2RheScpOyAvL34+IHRydWUgaWYgYm90aCB0aGUgc2FtZSBjYWxlbmRhciBkYXlcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG5cblxuICBEYXRlVGltZS5wcm90b3R5cGUuaGFzU2FtZSA9IGZ1bmN0aW9uIGhhc1NhbWUob3RoZXJEYXRlVGltZSwgdW5pdCkge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKHVuaXQgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlT2YoKSA9PT0gb3RoZXJEYXRlVGltZS52YWx1ZU9mKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBpbnB1dE1zID0gb3RoZXJEYXRlVGltZS52YWx1ZU9mKCk7XG4gICAgICByZXR1cm4gdGhpcy5zdGFydE9mKHVuaXQpIDw9IGlucHV0TXMgJiYgaW5wdXRNcyA8PSB0aGlzLmVuZE9mKHVuaXQpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogRXF1YWxpdHkgY2hlY2tcbiAgICogVHdvIERhdGVUaW1lcyBhcmUgZXF1YWwgaWZmIHRoZXkgcmVwcmVzZW50IHRoZSBzYW1lIG1pbGxpc2Vjb25kXG4gICAqIEBwYXJhbSB7RGF0ZVRpbWV9IG90aGVyIC0gdGhlIG90aGVyIERhdGVUaW1lXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuXG5cbiAgRGF0ZVRpbWUucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyhvdGhlcikge1xuICAgIHJldHVybiB0aGlzLmlzVmFsaWQgJiYgb3RoZXIuaXNWYWxpZCA/IHRoaXMudmFsdWVPZigpID09PSBvdGhlci52YWx1ZU9mKCkgJiYgdGhpcy56b25lLmVxdWFscyhvdGhlci56b25lKSAmJiB0aGlzLmxvYy5lcXVhbHMob3RoZXIubG9jKSA6IGZhbHNlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIG1pbiBvZiBzZXZlcmFsIGRhdGUgdGltZXNcbiAgICogQHBhcmFtIHsuLi5EYXRlVGltZX0gZGF0ZVRpbWVzIC0gdGhlIERhdGVUaW1lcyBmcm9tIHdoaWNoIHRvIGNob29zZSB0aGUgbWluaW11bVxuICAgKiBAcmV0dXJuIHtEYXRlVGltZX0gdGhlIG1pbiBEYXRlVGltZSwgb3IgdW5kZWZpbmVkIGlmIGNhbGxlZCB3aXRoIG5vIGFyZ3VtZW50XG4gICAqL1xuXG5cbiAgRGF0ZVRpbWUubWluID0gZnVuY3Rpb24gbWluKCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBkYXRlVGltZXMgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGRhdGVUaW1lc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gVXRpbC5iZXN0QnkoZGF0ZVRpbWVzLCBmdW5jdGlvbiAoaSkge1xuICAgICAgcmV0dXJuIGkudmFsdWVPZigpO1xuICAgIH0sIE1hdGgubWluKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBtYXggb2Ygc2V2ZXJhbCBkYXRlIHRpbWVzXG4gICAqIEBwYXJhbSB7Li4uRGF0ZVRpbWV9IGRhdGVUaW1lcyAtIHRoZSBEYXRlVGltZXMgZnJvbSB3aGljaCB0byBjaG9vc2UgdGhlIG1heGltdW1cbiAgICogQHJldHVybiB7RGF0ZVRpbWV9IHRoZSBtYXggRGF0ZVRpbWUsIG9yIHVuZGVmaW5lZCBpZiBjYWxsZWQgd2l0aCBubyBhcmd1bWVudFxuICAgKi9cblxuXG4gIERhdGVUaW1lLm1heCA9IGZ1bmN0aW9uIG1heCgpIHtcbiAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGRhdGVUaW1lcyA9IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICBkYXRlVGltZXNbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICB9XG5cbiAgICByZXR1cm4gVXRpbC5iZXN0QnkoZGF0ZVRpbWVzLCBmdW5jdGlvbiAoaSkge1xuICAgICAgcmV0dXJuIGkudmFsdWVPZigpO1xuICAgIH0sIE1hdGgubWF4KTtcbiAgfTtcblxuICAvLyBNSVNDXG5cbiAgLyoqXG4gICAqIEV4cGxhaW4gaG93IGEgc3RyaW5nIHdvdWxkIGJlIHBhcnNlZCBieSBmcm9tRm9ybWF0KClcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSB0aGUgc3RyaW5nIHRvIHBhcnNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmbXQgLSB0aGUgZm9ybWF0IHRoZSBzdHJpbmcgaXMgZXhwZWN0ZWQgdG8gYmUgaW4gKHNlZSBkZXNjcmlwdGlvbilcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSBvcHRpb25zIHRha2VuIGJ5IGZyb21Gb3JtYXQoKVxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuXG5cbiAgRGF0ZVRpbWUuZnJvbUZvcm1hdEV4cGxhaW4gPSBmdW5jdGlvbiBmcm9tRm9ybWF0RXhwbGFpbih0ZXh0LCBmbXQpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG5cbiAgICB2YXIgcGFyc2VyID0gbmV3IFRva2VuUGFyc2VyKExvY2FsZS5mcm9tT3B0cyhvcHRpb25zKSk7XG4gICAgcmV0dXJuIHBhcnNlci5leHBsYWluUGFyc2UodGV4dCwgZm10KTtcbiAgfTtcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGZyb21Gb3JtYXRFeHBsYWluIGluc3RlYWRcbiAgICovXG5cblxuICBEYXRlVGltZS5mcm9tU3RyaW5nRXhwbGFpbiA9IGZ1bmN0aW9uIGZyb21TdHJpbmdFeHBsYWluKHRleHQsIGZtdCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcblxuICAgIHJldHVybiBEYXRlVGltZS5mcm9tRm9ybWF0RXhwbGFpbih0ZXh0LCBmbXQsIG9wdGlvbnMpO1xuICB9O1xuXG4gIC8vIEZPUk1BVCBQUkVTRVRTXG5cbiAgLyoqXG4gICAqIHtAbGluayB0b0xvY2FsZVN0cmluZ30gZm9ybWF0IGxpa2UgMTAvMTQvMTk4M1xuICAgKi9cblxuXG4gIGNyZWF0ZUNsYXNzKERhdGVUaW1lLCBbe1xuICAgIGtleTogJ2lzVmFsaWQnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW52YWxpZFJlYXNvbiA9PT0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGV4cGxhbmF0aW9uIG9mIHdoeSB0aGlzIERhdGVUaW1lIGJlY2FtZSBpbnZhbGlkLCBvciBudWxsIGlmIHRoZSBEYXRlVGltZSBpcyB2YWxpZFxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnaW52YWxpZFJlYXNvbicsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnZhbGlkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgbG9jYWxlIG9mIGEgRGF0ZVRpbWUsIHN1Y2ggJ2VuLUdCJy4gVGhlIGxvY2FsZSBpcyB1c2VkIHdoZW4gZm9ybWF0dGluZyB0aGUgRGF0ZVRpbWVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnbG9jYWxlJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmxvYy5sb2NhbGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBudW1iZXJpbmcgc3lzdGVtIG9mIGEgRGF0ZVRpbWUsIHN1Y2ggJ2JlbmcnLiBUaGUgbnVtYmVyaW5nIHN5c3RlbSBpcyB1c2VkIHdoZW4gZm9ybWF0dGluZyB0aGUgRGF0ZVRpbWVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnbnVtYmVyaW5nU3lzdGVtJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmxvYy5udW1iZXJpbmdTeXN0ZW07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBvdXRwdXQgY2FsZW5kYXIgb2YgYSBEYXRlVGltZSwgc3VjaCAnaXNsYW1pYycuIFRoZSBvdXRwdXQgY2FsZW5kYXIgaXMgdXNlZCB3aGVuIGZvcm1hdHRpbmcgdGhlIERhdGVUaW1lXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ291dHB1dENhbGVuZGFyJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmxvYy5vdXRwdXRDYWxlbmRhcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIG5hbWUgb2YgdGhlIHRpbWUgem9uZS5cbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3pvbmVOYW1lJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnpvbmUubmFtZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHllYXJcbiAgICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgyMDE3LCA1LCAyNSkueWVhciAvLz0+IDIwMTdcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3llYXInLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCA/IHRoaXMuYy55ZWFyIDogTmFOO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgbW9udGggKDEtMTIpLlxuICAgICAqIEBleGFtcGxlIERhdGVUaW1lLmxvY2FsKDIwMTcsIDUsIDI1KS5tb250aCAvLz0+IDVcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ21vbnRoJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQgPyB0aGlzLmMubW9udGggOiBOYU47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBkYXkgb2YgdGhlIG1vbnRoICgxLTMwaXNoKS5cbiAgICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgyMDE3LCA1LCAyNSkuZGF5IC8vPT4gMjVcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2RheScsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkID8gdGhpcy5jLmRheSA6IE5hTjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGhvdXIgb2YgdGhlIGRheSAoMC0yMykuXG4gICAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoMjAxNywgNSwgMjUsIDkpLmhvdXIgLy89PiA5XG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdob3VyJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQgPyB0aGlzLmMuaG91ciA6IE5hTjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIG1pbnV0ZSBvZiB0aGUgaG91ciAoMC01OSkuXG4gICAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoMjAxNywgNSwgMjUsIDksIDMwKS5taW51dGUgLy89PiAzMFxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnbWludXRlJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQgPyB0aGlzLmMubWludXRlIDogTmFOO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgc2Vjb25kIG9mIHRoZSBtaW51dGUgKDAtNTkpLlxuICAgICAqIEBleGFtcGxlIERhdGVUaW1lLmxvY2FsKDIwMTcsIDUsIDI1LCA5LCAzMCwgNTIpLnNlY29uZCAvLz0+IDUyXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdzZWNvbmQnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCA/IHRoaXMuYy5zZWNvbmQgOiBOYU47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBtaWxsaXNlY29uZCBvZiB0aGUgc2Vjb25kICgwLTk5OSkuXG4gICAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoMjAxNywgNSwgMjUsIDksIDMwLCA1MiwgNjU0KS5taWxsaXNlY29uZCAvLz0+IDY1NFxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnbWlsbGlzZWNvbmQnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCA/IHRoaXMuYy5taWxsaXNlY29uZCA6IE5hTjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHdlZWsgeWVhclxuICAgICAqIEBzZWUgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSVNPX3dlZWtfZGF0ZVxuICAgICAqIEBleGFtcGxlIERhdGVUaW1lLmxvY2FsKDIwMTQsIDExLCAzMSkud2Vla1llYXIgLy89PiAyMDE1XG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICd3ZWVrWWVhcicsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkID8gcG9zc2libHlDYWNoZWRXZWVrRGF0YSh0aGlzKS53ZWVrWWVhciA6IE5hTjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHdlZWsgbnVtYmVyIG9mIHRoZSB3ZWVrIHllYXIgKDEtNTJpc2gpLlxuICAgICAqIEBzZWUgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSVNPX3dlZWtfZGF0ZVxuICAgICAqIEBleGFtcGxlIERhdGVUaW1lLmxvY2FsKDIwMTcsIDUsIDI1KS53ZWVrTnVtYmVyIC8vPT4gMjFcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3dlZWtOdW1iZXInLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCA/IHBvc3NpYmx5Q2FjaGVkV2Vla0RhdGEodGhpcykud2Vla051bWJlciA6IE5hTjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGRheSBvZiB0aGUgd2Vlay5cbiAgICAgKiAxIGlzIE1vbmRheSBhbmQgNyBpcyBTdW5kYXlcbiAgICAgKiBAc2VlIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0lTT193ZWVrX2RhdGVcbiAgICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgyMDE0LCAxMSwgMzEpLndlZWtkYXkgLy89PiA0XG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICd3ZWVrZGF5JyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQgPyBwb3NzaWJseUNhY2hlZFdlZWtEYXRhKHRoaXMpLndlZWtkYXkgOiBOYU47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBvcmRpbmFsIChpLmUuIHRoZSBkYXkgb2YgdGhlIHllYXIpXG4gICAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoMjAxNywgNSwgMjUpLm9yZGluYWwgLy89PiAxNDVcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ8RGF0ZVRpbWV9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ29yZGluYWwnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCA/IENvbnZlcnNpb25zLmdyZWdvcmlhblRvT3JkaW5hbCh0aGlzLmMpLm9yZGluYWwgOiBOYU47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBodW1hbiByZWFkYWJsZSBzaG9ydCBtb250aCBuYW1lLCBzdWNoIGFzICdPY3QnLlxuICAgICAqIERlZmF1bHRzIHRvIHRoZSBzeXN0ZW0ncyBsb2NhbGUgaWYgbm8gbG9jYWxlIGhhcyBiZWVuIHNwZWNpZmllZFxuICAgICAqIEBleGFtcGxlIERhdGVUaW1lLmxvY2FsKDIwMTcsIDEwLCAzMCkubW9udGhTaG9ydCAvLz0+IE9jdFxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnbW9udGhTaG9ydCcsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkID8gSW5mby5tb250aHMoJ3Nob3J0JywgeyBsb2NhbGU6IHRoaXMubG9jYWxlIH0pW3RoaXMubW9udGggLSAxXSA6IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBodW1hbiByZWFkYWJsZSBsb25nIG1vbnRoIG5hbWUsIHN1Y2ggYXMgJ09jdG9iZXInLlxuICAgICAqIERlZmF1bHRzIHRvIHRoZSBzeXN0ZW0ncyBsb2NhbGUgaWYgbm8gbG9jYWxlIGhhcyBiZWVuIHNwZWNpZmllZFxuICAgICAqIEBleGFtcGxlIERhdGVUaW1lLmxvY2FsKDIwMTcsIDEwLCAzMCkubW9udGhMb25nIC8vPT4gT2N0b2JlclxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnbW9udGhMb25nJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQgPyBJbmZvLm1vbnRocygnbG9uZycsIHsgbG9jYWxlOiB0aGlzLmxvY2FsZSB9KVt0aGlzLm1vbnRoIC0gMV0gOiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgaHVtYW4gcmVhZGFibGUgc2hvcnQgd2Vla2RheSwgc3VjaCBhcyAnTW9uJy5cbiAgICAgKiBEZWZhdWx0cyB0byB0aGUgc3lzdGVtJ3MgbG9jYWxlIGlmIG5vIGxvY2FsZSBoYXMgYmVlbiBzcGVjaWZpZWRcbiAgICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgyMDE3LCAxMCwgMzApLndlZWtkYXlTaG9ydCAvLz0+IE1vblxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnd2Vla2RheVNob3J0JyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQgPyBJbmZvLndlZWtkYXlzKCdzaG9ydCcsIHsgbG9jYWxlOiB0aGlzLmxvY2FsZSB9KVt0aGlzLndlZWtkYXkgLSAxXSA6IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBodW1hbiByZWFkYWJsZSBsb25nIHdlZWtkYXksIHN1Y2ggYXMgJ01vbmRheScuXG4gICAgICogRGVmYXVsdHMgdG8gdGhlIHN5c3RlbSdzIGxvY2FsZSBpZiBubyBsb2NhbGUgaGFzIGJlZW4gc3BlY2lmaWVkXG4gICAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoMjAxNywgMTAsIDMwKS53ZWVrZGF5TG9uZyAvLz0+IE1vbmRheVxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnd2Vla2RheUxvbmcnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCA/IEluZm8ud2Vla2RheXMoJ2xvbmcnLCB7IGxvY2FsZTogdGhpcy5sb2NhbGUgfSlbdGhpcy53ZWVrZGF5IC0gMV0gOiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgVVRDIG9mZnNldCBvZiB0aGlzIERhdGVUaW1lIGluIG1pbnV0ZXNcbiAgICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgpLm9mZnNldCAvLz0+IC0yNDBcbiAgICAgKiBAZXhhbXBsZSBEYXRlVGltZS51dGMoKS5vZmZzZXQgLy89PiAwXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdvZmZzZXQnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCA/IHRoaXMuem9uZS5vZmZzZXQodGhpcy50cykgOiBOYU47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBzaG9ydCBodW1hbiBuYW1lIGZvciB0aGUgem9uZSdzIGN1cnJlbnQgb2Zmc2V0LCBmb3IgZXhhbXBsZSBcIkVTVFwiIG9yIFwiRURUXCIuXG4gICAgICogRGVmYXVsdHMgdG8gdGhlIHN5c3RlbSdzIGxvY2FsZSBpZiBubyBsb2NhbGUgaGFzIGJlZW4gc3BlY2lmaWVkXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdvZmZzZXROYW1lU2hvcnQnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgaWYgKHRoaXMuaXNWYWxpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy56b25lLm9mZnNldE5hbWUodGhpcy50cywge1xuICAgICAgICAgIGZvcm1hdDogJ3Nob3J0JyxcbiAgICAgICAgICBsb2NhbGU6IHRoaXMubG9jYWxlXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBsb25nIGh1bWFuIG5hbWUgZm9yIHRoZSB6b25lJ3MgY3VycmVudCBvZmZzZXQsIGZvciBleGFtcGxlIFwiRWFzdGVybiBTdGFuZGFyZCBUaW1lXCIgb3IgXCJFYXN0ZXJuIERheWxpZ2h0IFRpbWVcIi5cbiAgICAgKiBEZWZhdWx0cyB0byB0aGUgc3lzdGVtJ3MgbG9jYWxlIGlmIG5vIGxvY2FsZSBoYXMgYmVlbiBzcGVjaWZpZWRcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ29mZnNldE5hbWVMb25nJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIGlmICh0aGlzLmlzVmFsaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuem9uZS5vZmZzZXROYW1lKHRoaXMudHMsIHtcbiAgICAgICAgICBmb3JtYXQ6ICdsb25nJyxcbiAgICAgICAgICBsb2NhbGU6IHRoaXMubG9jYWxlXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHdoZXRoZXIgdGhpcyB6b25lJ3Mgb2Zmc2V0IGV2ZXIgY2hhbmdlcywgYXMgaW4gYSBEU1QuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnaXNPZmZzZXRGaXhlZCcsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gdGhpcy56b25lLnVuaXZlcnNhbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgd2hldGhlciB0aGUgRGF0ZVRpbWUgaXMgaW4gYSBEU1QuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnaXNJbkRTVCcsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICBpZiAodGhpcy5pc09mZnNldEZpeGVkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9mZnNldCA+IHRoaXMuc2V0KHsgbW9udGg6IDEgfSkub2Zmc2V0IHx8IHRoaXMub2Zmc2V0ID4gdGhpcy5zZXQoeyBtb250aDogNSB9KS5vZmZzZXQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgRGF0ZVRpbWUgaXMgaW4gYSBsZWFwIHllYXIsIGZhbHNlIG90aGVyd2lzZVxuICAgICAqIEBleGFtcGxlIERhdGVUaW1lLmxvY2FsKDIwMTYpLmlzSW5MZWFwWWVhciAvLz0+IHRydWVcbiAgICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgyMDEzKS5pc0luTGVhcFllYXIgLy89PiBmYWxzZVxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2lzSW5MZWFwWWVhcicsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gVXRpbC5pc0xlYXBZZWFyKHRoaXMueWVhcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGRheXMgaW4gdGhpcyBEYXRlVGltZSdzIG1vbnRoXG4gICAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoMjAxNiwgMikuZGF5c0luTW9udGggLy89PiAyOVxuICAgICAqIEBleGFtcGxlIERhdGVUaW1lLmxvY2FsKDIwMTYsIDMpLmRheXNJbk1vbnRoIC8vPT4gMzFcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2RheXNJbk1vbnRoJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiBVdGlsLmRheXNJbk1vbnRoKHRoaXMueWVhciwgdGhpcy5tb250aCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGRheXMgaW4gdGhpcyBEYXRlVGltZSdzIHllYXJcbiAgICAgKiBAZXhhbXBsZSBEYXRlVGltZS5sb2NhbCgyMDE2KS5kYXlzSW5ZZWFyIC8vPT4gMzY2XG4gICAgICogQGV4YW1wbGUgRGF0ZVRpbWUubG9jYWwoMjAxMykuZGF5c0luWWVhciAvLz0+IDM2NVxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnZGF5c0luWWVhcicsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkID8gVXRpbC5kYXlzSW5ZZWFyKHRoaXMueWVhcikgOiBOYU47XG4gICAgfVxuICB9XSwgW3tcbiAgICBrZXk6ICdEQVRFX1NIT1JUJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiBGb3JtYXRzLkRBVEVfU0hPUlQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICoge0BsaW5rIHRvTG9jYWxlU3RyaW5nfSBmb3JtYXQgbGlrZSAnT2N0IDE0LCAxOTgzJ1xuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdEQVRFX01FRCcsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gRm9ybWF0cy5EQVRFX01FRDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB7QGxpbmsgdG9Mb2NhbGVTdHJpbmd9IGZvcm1hdCBsaWtlICdPY3RvYmVyIDE0LCAxOTgzJ1xuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdEQVRFX0ZVTEwnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIEZvcm1hdHMuREFURV9GVUxMO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHtAbGluayB0b0xvY2FsZVN0cmluZ30gZm9ybWF0IGxpa2UgJ1R1ZXNkYXksIE9jdG9iZXIgMTQsIDE5ODMnXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ0RBVEVfSFVHRScsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gRm9ybWF0cy5EQVRFX0hVR0U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICoge0BsaW5rIHRvTG9jYWxlU3RyaW5nfSBmb3JtYXQgbGlrZSAnMDk6MzAgQU0nLiBPbmx5IDEyLWhvdXIgaWYgdGhlIGxvY2FsZSBpcy5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnVElNRV9TSU1QTEUnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIEZvcm1hdHMuVElNRV9TSU1QTEU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICoge0BsaW5rIHRvTG9jYWxlU3RyaW5nfSBmb3JtYXQgbGlrZSAnMDk6MzA6MjMgQU0nLiBPbmx5IDEyLWhvdXIgaWYgdGhlIGxvY2FsZSBpcy5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnVElNRV9XSVRIX1NFQ09ORFMnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIEZvcm1hdHMuVElNRV9XSVRIX1NFQ09ORFM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICoge0BsaW5rIHRvTG9jYWxlU3RyaW5nfSBmb3JtYXQgbGlrZSAnMDk6MzA6MjMgQU0gRURUJy4gT25seSAxMi1ob3VyIGlmIHRoZSBsb2NhbGUgaXMuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ1RJTUVfV0lUSF9TSE9SVF9PRkZTRVQnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIEZvcm1hdHMuVElNRV9XSVRIX1NIT1JUX09GRlNFVDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB7QGxpbmsgdG9Mb2NhbGVTdHJpbmd9IGZvcm1hdCBsaWtlICcwOTozMDoyMyBBTSBFYXN0ZXJuIERheWxpZ2h0IFRpbWUnLiBPbmx5IDEyLWhvdXIgaWYgdGhlIGxvY2FsZSBpcy5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnVElNRV9XSVRIX0xPTkdfT0ZGU0VUJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiBGb3JtYXRzLlRJTUVfV0lUSF9MT05HX09GRlNFVDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB7QGxpbmsgdG9Mb2NhbGVTdHJpbmd9IGZvcm1hdCBsaWtlICcwOTozMCcsIGFsd2F5cyAyNC1ob3VyLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdUSU1FXzI0X1NJTVBMRScsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gRm9ybWF0cy5USU1FXzI0X1NJTVBMRTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB7QGxpbmsgdG9Mb2NhbGVTdHJpbmd9IGZvcm1hdCBsaWtlICcwOTozMDoyMycsIGFsd2F5cyAyNC1ob3VyLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdUSU1FXzI0X1dJVEhfU0VDT05EUycsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gRm9ybWF0cy5USU1FXzI0X1dJVEhfU0VDT05EUztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB7QGxpbmsgdG9Mb2NhbGVTdHJpbmd9IGZvcm1hdCBsaWtlICcwOTozMDoyMyBFRFQnLCBhbHdheXMgMjQtaG91ci5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnVElNRV8yNF9XSVRIX1NIT1JUX09GRlNFVCcsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gRm9ybWF0cy5USU1FXzI0X1dJVEhfU0hPUlRfT0ZGU0VUO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHtAbGluayB0b0xvY2FsZVN0cmluZ30gZm9ybWF0IGxpa2UgJzA5OjMwOjIzIEVhc3Rlcm4gRGF5bGlnaHQgVGltZScsIGFsd2F5cyAyNC1ob3VyLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdUSU1FXzI0X1dJVEhfTE9OR19PRkZTRVQnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIEZvcm1hdHMuVElNRV8yNF9XSVRIX0xPTkdfT0ZGU0VUO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHtAbGluayB0b0xvY2FsZVN0cmluZ30gZm9ybWF0IGxpa2UgJzEwLzE0LzE5ODMsIDk6MzAgQU0nLiBPbmx5IDEyLWhvdXIgaWYgdGhlIGxvY2FsZSBpcy5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnREFURVRJTUVfU0hPUlQnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIEZvcm1hdHMuREFURVRJTUVfU0hPUlQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICoge0BsaW5rIHRvTG9jYWxlU3RyaW5nfSBmb3JtYXQgbGlrZSAnMTAvMTQvMTk4MywgOTozMDozMyBBTScuIE9ubHkgMTItaG91ciBpZiB0aGUgbG9jYWxlIGlzLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdEQVRFVElNRV9TSE9SVF9XSVRIX1NFQ09ORFMnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIEZvcm1hdHMuREFURVRJTUVfU0hPUlRfV0lUSF9TRUNPTkRTO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHtAbGluayB0b0xvY2FsZVN0cmluZ30gZm9ybWF0IGxpa2UgJ09jdCAxNCwgMTk4MywgOTozMCBBTScuIE9ubHkgMTItaG91ciBpZiB0aGUgbG9jYWxlIGlzLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdEQVRFVElNRV9NRUQnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIEZvcm1hdHMuREFURVRJTUVfTUVEO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHtAbGluayB0b0xvY2FsZVN0cmluZ30gZm9ybWF0IGxpa2UgJ09jdCAxNCwgMTk4MywgOTozMDozMyBBTScuIE9ubHkgMTItaG91ciBpZiB0aGUgbG9jYWxlIGlzLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdEQVRFVElNRV9NRURfV0lUSF9TRUNPTkRTJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiBGb3JtYXRzLkRBVEVUSU1FX01FRF9XSVRIX1NFQ09ORFM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICoge0BsaW5rIHRvTG9jYWxlU3RyaW5nfSBmb3JtYXQgbGlrZSAnT2N0b2JlciAxNCwgMTk4MywgOTozMCBBTSBFRFQnLiBPbmx5IDEyLWhvdXIgaWYgdGhlIGxvY2FsZSBpcy5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnREFURVRJTUVfRlVMTCcsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gRm9ybWF0cy5EQVRFVElNRV9GVUxMO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHtAbGluayB0b0xvY2FsZVN0cmluZ30gZm9ybWF0IGxpa2UgJ09jdG9iZXIgMTQsIDE5ODMsIDk6MzAzIEFNIEVEVCcuIE9ubHkgMTItaG91ciBpZiB0aGUgbG9jYWxlIGlzLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdEQVRFVElNRV9GVUxMX1dJVEhfU0VDT05EUycsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gRm9ybWF0cy5EQVRFVElNRV9GVUxMX1dJVEhfU0VDT05EUztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB7QGxpbmsgdG9Mb2NhbGVTdHJpbmd9IGZvcm1hdCBsaWtlICdGcmlkYXksIE9jdG9iZXIgMTQsIDE5ODMsIDk6MzAgQU0gRWFzdGVybiBEYXlsaWdodCBUaW1lJy4gT25seSAxMi1ob3VyIGlmIHRoZSBsb2NhbGUgaXMuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ0RBVEVUSU1FX0hVR0UnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIEZvcm1hdHMuREFURVRJTUVfSFVHRTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB7QGxpbmsgdG9Mb2NhbGVTdHJpbmd9IGZvcm1hdCBsaWtlICdGcmlkYXksIE9jdG9iZXIgMTQsIDE5ODMsIDk6MzA6MzMgQU0gRWFzdGVybiBEYXlsaWdodCBUaW1lJy4gT25seSAxMi1ob3VyIGlmIHRoZSBsb2NhbGUgaXMuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ0RBVEVUSU1FX0hVR0VfV0lUSF9TRUNPTkRTJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIHJldHVybiBGb3JtYXRzLkRBVEVUSU1FX0hVR0VfV0lUSF9TRUNPTkRTO1xuICAgIH1cbiAgfV0pO1xuICByZXR1cm4gRGF0ZVRpbWU7XG59KCk7XG5cbmV4cG9ydHMuRGF0ZVRpbWUgPSBEYXRlVGltZTtcbmV4cG9ydHMuRHVyYXRpb24gPSBEdXJhdGlvbjtcbmV4cG9ydHMuSW50ZXJ2YWwgPSBJbnRlcnZhbDtcbmV4cG9ydHMuSW5mbyA9IEluZm87XG5leHBvcnRzLlpvbmUgPSBab25lO1xuZXhwb3J0cy5TZXR0aW5ncyA9IFNldHRpbmdzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bHV4b24uanMubWFwXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sdXhvbi9idWlsZC9janMtYnJvd3Nlci9sdXhvbi5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9