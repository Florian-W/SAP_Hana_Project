angular.module('litter', [
	'ngStorage'
]).controller('litterCtrl', function(
	$scope,
	$localStorage,
	$sessionStorage
){
	$scope.$storage = $localStorage;
	$scope.$state = {
		openKey: null
	};
	
	$scope.printAuthorTitle = function(bibDB){
		var authorEditor;
		
		if (bibDB.fields.author) {
			authorEditor = bibDB.fields.author;
		} else if (bibDB.fields.editor) {
			authorEditor = bibDB.fields.editor;
		} 
		
		if (authorEditor === undefined) {
			authorEditor = "N/A";
		} else {
			var etal = false;
			if (authorEditor instanceof Array) {
				if (authorEditor.length > 1) etal = true;
				authorEditor = authorEditor [0];
			} 
			
			if (typeof authorEditor == "object") {
				console.log(authorEditor);
				authorEditor = authorEditor.family[0].text + ", " + authorEditor.given[0].text;
			}
			
			if (etal) authorEditor += " et.al.";
		}
		
		var date = bibDB.fields.date;
		if (date.indexOf("/") !== -1)
			date =  date.split("/")[0];
		
		date = new Date(date);
		
		var title = bibDB.fields.title || "N/A";
		
		if (title instanceof Array) title = title[0];
		
		if (typeof title == "object")  title = title.text;
		
		return authorEditor + " (" + date.getFullYear() + ") - " + title;
	};
	
	$scope.printCitation = function(bibDB){
		return "dummy";
	};
	
	$scope.isActive = function(bibDB){
		if (bibDB.entry_key == $scope.$state.openKey) return "active";
		else return "";
	};
	
	$scope.$storage.bibDB = $scope.myObj = [
		{
			"bib_type": "inproceedings",
			"entry_key": "Huang:2016:MFE:2911996.2912039",
			"fields": {
				"date": "2016",
				"author": [{
						"family": [{
								"type": "text",
								"text": "Huang"
							}
						],
						"given": [{
								"type": "text",
								"text": "Yuchi"
							}
						]
					}, {
						"family": [{
								"type": "text",
								"text": "Khan"
							}
						],
						"given": [{
								"type": "text",
								"text": "Saad"
							}
						]
					}
				],
				"title": [{
						"type": "text",
						"text": "Mirroring Facial Expressions: Evidence from Visual Analysis of Dyadic Interactions"
					}
				],
				"booktitle": [{
						"type": "text",
						"text": "Proceedings of the 2016 ACM on International Conference on Multimedia Retrieval"
					}
				],
				"series": [{
						"type": "text",
						"text": "ICMR \'16"
					}
				],
				"isbn": [{
						"type": "text",
						"text": "978-1-4503-4359-6"
					}
				],
				"location": [[{
							"type": "text",
							"text": "New York, New York, USA"
						}
					]],
				"pages": [[[{
								"type": "text",
								"text": "225"
							}
						], [{
								"type": "text",
								"text": "228"
							}
						]]],
				"url": "http://doi.acm.org/10.1145/2911996.2912039",
				"doi": "10.1145/2911996.2912039",
				"publisher": [[{
							"type": "text",
							"text": "ACM"
						}
					]],
				"keywords": ["dyadic interactions", "facial expression analysis", "temporal pyramid matching kernel"],
				"abstract": [{
						"type": "text",
						"text": "We present results from a pilot study that explored evidence of non-conscious facial expression mirroring exhibited by human dyads in face-to-face interactions. We captured video data of study participants engaged in an online collaborative activity on science topics. The data was sub-sampled and organized into two sets: one consisting of time-synchronized video clips from dyad pairs and the other from unrelated nominal-dyads (or non-dyads). The videos were analyzed with an automated facial expression approach and distance between two video clips of each pair (from both two sets) was computed using a temporal pyramid matching strategy. By employing a two-sample t-test on these two populations, our results demonstrate a statisticallysignificant convergence or mirroring of facial expressions between dyad pairs, which holds over a wide range of model parameter settings and extensive experimentation."
					}
				]
			},
			"unknown_fields": {
				"year": [{
						"type": "text",
						"text": "2016"
					}
				],
				"numpages": [{
						"type": "text",
						"text": "4"
					}
				],
				"acmid": [{
						"type": "text",
						"text": "2912039"
					}
				]
			}
		},
		{
			"bib_type": "proceedings",
			"entry_key": "ICMR16",
			"fields": {
				"date": "2016-06-06/2016-06-09",
				"title": [{
						"type": "text",
						"text": "Proceedings of the 2016 ACM on International Conference on Multimedia Retrieval"
					}
				],
				"editor": [{
						"family": [{
								"type": "text",
								"text": "Kender"
							}
						],
						"given": [{
								"type": "text",
								"text": "John"
							}
						]
					}, {
						"family": [{
								"type": "text",
								"text": "Smith"
							}
						],
						"given": [{
								"type": "text",
								"text": "John R."
							}
						]
					}, {
						"family": [{
								"type": "text",
								"text": "Chang"
							}
						],
						"given": [{
								"type": "text",
								"text": "Shih-Fu"
							}
						]
					}
				]
			}
		}
	];
});


$(document).ready(function() {
    	$(".dropdown-menu").on('click', 'li a', function(){
			$(this).closest(".dropdown-menu").prev().html($(this).html() + ' <span class="caret"/>');
			$(this).closest(".input-group")
				.find(".form-control, .input-group-addon").remove();
			//TODO: remove other fields apart from the standard form-control input field without removing the dropdown menu -> make line above more flexible?
			$(this).closest(".dropdown-menu").prev().val($(this).text());
			
			var chosen = $(this).text();
			$inputField = $('<input class="form-control" aria-describedby="doiAddon" type="text">');
			$(this).closest(".input-group-btn")
				.after($inputField);
			$inputField.attr("placeholder", chosen)
				.attr('data-type', $(this).text())
				.data('type', $(this).text()); //re-adding input field here

			switch (chosen) {
				case 'URL':
					var newInputGroup = $(this).closest(".input-group")
						.append('<span class="input-group-addon">Date</span>')
						.append('<input class="form-control" aria-describedby="doiAddon" placeholder="Date" type="date"></div>'); //adding date label and field here
				break;
			}
				
			
			$(this).parents(".input-group-btn").next().attr('data-type', $(this).text()).data('type', $(this).text()).attr("value", "");
   });
   
   // ISBN Formatting 
   $("form").on('keyup', '[data-type=ISBN]', function (e) {
		if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
			return false;
		}
		var $this = $(this);
		var input = $this.val().split(/\D/).join('');
		var reg = /(?:(?=\d{11,13}$)(\d{0,3})|(?=\d{1,10}$))(\d?)(\d{0,5})(\d{0,3})(\d?)/;
		var maxParts = 5;
		var arr = reg.exec(input);
		if (arr === null || arr === undefined) return '';
		var res = [];
		for (var i = 1; i < arr.length && res.length <= maxParts; i++ ) {
			if (arr[i] == "") break;
			else if (arr[i] !== undefined) res.push(arr[i]);
		}
		$this.val(function() {
			return res.join("-").toUpperCase();
		});
	});
});

$(".input-group").on("click", "a", function(){
	var cloned = $(this).prev().clone(true, true);
	$(this).before(cloned);
	cloned.find("input").val("").attr("value", "");
});
