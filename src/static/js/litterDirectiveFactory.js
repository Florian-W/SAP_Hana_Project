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
	var litterDirectives = {};
	var litterGroups = {};
	
	function makeDirectiveTitle(arr){
		if (arr.length == 0) throw new Error();
		var result = arr.shift();
		var _text;
		while (!!(_text = arr.shift()) || !!_text){
			result += _text[0].toUpperCase() + _text.slice(1);
		}
		return result;
	};
	
	angular.forEach(conf, (groupValue, groupKey) => {
		
	litterGroups[makeDirectiveTitle(['ng', 'group', groupKey])] = [function(){
		var result = {
			restrict: "C",
			template: 	"<label class=\"form-control-label\" for=\"Identifier\">" + (!!groupValue.$name ? groupValue.$name : "") + "</label><div class=\"form-group\">"
		};
		angular.forEach(groupValue, (elementValue, elementKey) => {
			if (elementKey[0] == "$") return;
			result.template += 	"<div class=\"input-group ng-element-" + elementKey + "\" ";
			if (!!elementValue.multi) {
				result.template += 	"data-ng-init=\"DB[current].fields." + elementKey + " = DB[current].fields." + elementKey + " || []\" data-ng-repeat=\"(key, value) in DB[current].fields." + elementKey + "\"";
			}
			result.template += 	"></div>";
		});
		
		result.template += "</div>";
		
		return result;
	}];
		
		angular.forEach(groupValue, (elementValue, elementKey) => {
			if (elementKey[0] == '$') return;
			let _conf = {
					type: "text",
					timespan: false,
					options: [],
					multi: false
				};
			Object.assign(_conf, elementValue);
			
			litterDirectives[makeDirectiveTitle(['ng', 'element', elementKey])] = ['$rootScope',
				function($rootScope) {
					var path;
					if (_conf.multi) path = "value.text";
					else path = "DB[current].fields." + elementKey;
					var result = {
						restrict: "C"
					};
					switch (_conf.type){
						case "date":
							result.template = "<span class=\"col col-sm-2 input-group-addon\">";
							result.template += _conf.title + "</span><input type=\"date\" class=\"form-control\" aria-describedby=\"dateHelp\"/>";
							_conf.timespan && (result.template += "<span class=\"input-group-addon\">To</span><input type=\"date\" class=\"form-control\" aria-describedby=\"dateHelp\" id=\"toDate\" />");
						break;
						case "option":
							let _option = makeDirectiveTitle(['option', elementKey]);
							let _select = makeDirectiveTitle(['select', elementKey])
							let _path = "conf." + groupKey + "." + elementKey + ".options";
							result.template = "<span class=\"col col-sm-2 input-group-addon\">";
							result.template += _conf.title + "</span><select class=\"form-control\"  ng-options=\"" + _option + ".key as " + _option + ".name for " + _option + " in " + _path + " track by " + _option + ".key\" ng-model=\"" + _select + "\"></select>";
						break;
						case "integer":
							result.template = "<span class=\"col col-sm-2 input-group-addon\">";
							result.template+= _conf.title + "</span><input type=\"number\" class=\"form-control\" aria-describedby=\"doiAddon\" />";
						break;
						case "range":
							result.template = "<span class=\"col col-sm-2 input-group-addon\">";
							result.template+= _conf.title + "</span><input type=\"number\" class=\"form-control\" aria-describedby=\"dateHelp\"/><span class=\"input-group-addon\">To</span><input type=\"number\" class=\"form-control\" aria-describedby=\"dateHelp\" id=\"toDate\" />";
						break;
						case "name": 
							result.template = "<span class=\"col col-sm-2 input-group-addon\">";
							result.template += _conf.title + "</span><input type=\"text\" class=\"form-control\" placeholder=\"Nachname\" aria-describedby=\"dateHelp\"/><span class=\"form-liner input-group-addon\"></span><input type=\"text\" class=\"form-control\" placeholder=\"Vorname\" aria-describedby=\"dateHelp\"/>";
							break;
						default:
							result.template = "<span class=\"col col-sm-2 input-group-addon\">" + _conf.title +"</span><input type=\"text\" data-ng-model=\"" + path + "\" class=\"form-control\" aria-describedby=\"doiAddon\" />";
					}
					if (_conf.multi) result.template += " <span class=\"input-group-btn\"><button class=\"btn btn-default\" data-ng-click=\"addItem('" + elementKey + "')\" type=\"button\"><span class=\"fa fa-plus\"></span>&nbsp;</button></span>";
					return result;
				}
			];
		});
	});
	
	return angular.module('litterDirectives', []).directive(litterDirectives).directive(litterGroups).directive('ngLitterInput', function(){
		var result = {
			restrict: "C",
			template: ""
		};
		angular.forEach(conf, (groupValue, groupKey) => {
			result.template += "<div class=\"form-control row ng-group-" + groupKey + "\"></div>";
		});
		return result;
	});
	
}));