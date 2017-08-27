(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['angular'], factory);
  } else if (root.hasOwnProperty('angular')) {
    // Browser globals (root is window), we don't register it.
    factory(root.angular);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('angular'));
  }
}(this , function (angular) {
    'use strict';

    // In cases where Angular does not get passed or angular is a truthy value
    // but misses .module we can fall back to using window.
    angular = (angular && angular.module ) ? angular : window.angular;

    return angular.module('bibDB', ['ngStorage']).provider('$bibDB', _bibDB());

    function _bibDB(){
        
		var bibDB = [];
		return function(){
			this.functionsname = function (prefix) {};

			this.get = function (key) {
				let i = bibDB.length;
				while(i-- > 0){
					if (bibDB[i].entry_key == key) {
						return bibDB[i];
					}
				}
				return undefined;
			};

			this.set = function (key, value) {
				let i = bibDB.length;
				while(i-- > 0){
					if (bibDB[i].entry_key == key) {
						bibDB[i] = value;
						return;
					} 
				}
				bibDB.push(value);
			};

			this.remove = function (key) {
				let i = bibDB.length;
				while(i-- > 0){
					if (bibDB[i].entry_key == key) {
						bibDB.splice(i,1)
						return;
					} 
				}
			}

			this.$get = [
				'$rootScope',
				'$timeout',
				'$window',
				'$localStorage',
				function (
					$rootScope,
					$timeout,
					$window,
					$localStorage
				){
					let $bibDB = {
						$default: function(items) {
							for (let k in items) {
								angular.isDefined($bibDB[k]) || ($bibDB[k] = angular.copy(items[k]) );
							}
							$bibDB.$sync();
							return $bibDB;
						},
						$reset: function(items) {
							for (let k in $bibDB) {
								'$' === k[0] || (delete $bibDB[k] && bibDB.remove(k));
							}
							return $bibDB.$default(items);
						},
						$sync: function(){
							angular.forEach($localStorage, (v,k) => {
								if (angular.isDefined(v) && '$' != k[0])
									$bibDB[k] = v;
							});
						},
						$apply: function(){
							var temp$db;

							_debounce = null;

							if (!angular.equals($bibDB, _last$db)) {
								temp$db = angular.copy(_last$db);
								angular.forEach($bibDB, function(v, k) {
									if (angular.isDefined(v) && '$' !== k[0]) {
										$localStorage[k] = v;
										!!temp$db && delete temp$db[k];
									}
								});

								for (var k in temp$db) {
									$localStorage[k] = undefined;
								}

								_last$db = angular.copy($bibDB);
							}
						},
						$supported: function() {
							return true;
						}
					},
					_debounce,
					_last$db;
						
					$bibDB.$sync();
					
					$rootScope.$watch(function() {
						_debounce || (_debounce = $timeout($bibDB.$apply, 100, false));
					});
					
					$window.addEventListener && $window.addEventListener('beforeunload', function() {
						$bibDB.$apply();
					});
					
					return $bibDB;
				}
			];
		}
	}
}));
