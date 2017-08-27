const conf = {
	"core": {
		"author": {
			"type": "name",
			"title": "Autor",
			"multi": true
			},
		"editor": {
			"title": "Editor",
			"type": "name"
			},
		"date": {
			"type": "date",
			"timespan": true,
			"title": "Datum"
			},
		"title": {
			"type": "name",
			"title": "Titel"
			},
		"type": {
			"type": "option",
			"options": [
				{"key": "manual", "name": "Anleitung"}, 
				{"key": "patent", "name": "Patent"}, 
				{"key": "report", "name": "Report"}, 
				{"key": "thesis", "name": "Bachelorarbeit"}, 
				{"key": "mathesis", "name": "Masterarbeit"}, 
				{"key": "phdthesis", "name": "Doktorarbeit"}, 
				{"key": "candthesis", "name": "Cand.-Arbeit"}, 
				{"key": "techreport", "name": "technischer Report"}, 
				{"key": "resreport", "name": "Untersuchungsreport"}, 
				{"key": "software", "name": "Software"}, 
				{"key": "datacd", "name": "Daten-CD"}, 
				{"key": "audiocd", "name": "Audio-CD"} 
				],
			"title": "Typ"
			},
		"indextitle": {
			"title": "Sortierungstitel",
			"type": "text"
			},
		},
	"title": {
		"subtitle": {
			"title": "Untertitel",
			"type": "text"
			},
		"titleaddon": {
			"title": "Titelanhang",
			"type": "text"
			},
		},
	"person": {
		"afterword": {
			"title": "Nachwortautor",
			"type": "name"
			},
		"annotator": {
			"title": "Anmerkungsautor",
			"type": "name"
			},
		"commentator": {
			"title": "Kommentator",
			"type": "name"
			},
		"editora": {
			"title": "Zweiteditor",
			"type": "name"
			},
		"editorb": {
			"title": "Dritteditor",
			"type": "name"
			},
		"editorc": {
			"title": "Vierteditor",
			"type": "name"
			},
		"foreword": {
			"title": "Vorwortautor",
			"type": "name"
			},
		"holder": {
			"title": "Patentinhaber",
			"type": "name"
			},
		"translator": {
			"title": "Übersetzer",
			"type": "name"
			}
		},
	"superordinate": {
		"bookauthor": {
			"title": "Autor",
			"type": "name"
			},
		"booksubtitle": {
			"title": "Untertitel",
			"type": "text"
			},
		"booktitle": {
			"title": "Titel",
			"type": "text"
			},
		"booktitleaddon": {
			"title": "Titelanhang",
			"type": "text"
			},
		"bookpagination": {
			"title": "Nummerierung",
			"type": "option",
			"options": [
				{ "key": "page", "name": "Seiten"}, 
				{"key": "column", "name": "Spalten"}, {"key": "line", "name": "Zeilen"}, 
				{"key": "verse", "name": "Verse"}, {"key": "section", "name": "Abschnitte"}, 
				{"key": "paragraph", "name": "Paragrafen"}
				]
			},
		"eventdate": {
			"title": "Veranstaltungsdatum",
			"type": "date",
			"timespan": true
			},
		"eventtitle": {
			"title": "Veranstaltungsname",
			"type": "text"
			},
		"journalsubtitle": {
			"title": "Untertitel",
			"type": "text"
			},
		"journaltitle": {
			"title": "Titel",
			"type": "text"
			},
		"mainsubtitle": {
			"title": "Untertitel",
			"type": "text"
			},
		"maintitle": {
			"title": "Titel",
			"type": "text"
			},
		"maintitleaddon": {
			"title": "Titelanhang",
			"type": "text"
			},
		"venue": {
			"title": "Veranstaltungsort",
			"type": "text"
			}
		},
	"periodical": {
		"$name": "Reihe",
		"edition": {
			"title": "Edition",
			"type": "integer"
			},
		"issue": {
			"title": "Ausgabe",
			"type": "text"
			},
		"issuesubtitle": {
			"title": "Untertitel",
			"type": "text"
			},
		"issuetitle": {
			"title": "titel",
			"type": "text"
			},
		"number": {
			"title": "Nummer",
			"type": "text"
			},
		"series": {
			"title": "Reihe",
			"type": "text"
			},
		"volume": {
			"title": "Ausgabe",
			"type": "text"
			},
		"volumes": {
			"title": "Ausgaben insg.",
			"type": "text"
			},
		},
	"publication": {
		"$name": "Publikation",
		"organization": {
			"title": "Organisation",
			"type": "text"
			},
		"location": {
			"title": "Ort",
			"type": "text"
			},
		"language": {
			"title": "Sprache",
			"type": "text"
			},
		"langid": {
			"title": "SprachID",
			"type": "option",
			"options": [
				{"key": "catalan","name": "Catalan"}, 
				{"key": "croatian","name": "Croatian"}, 
				{"key": "czech","name": "Czech"}, 
				{"key": "danish","name": "Danish"}, 
				{"key": "dutch","name": "Dutch"}, 
				{"key": "american","name": "English - USA"}, 
				{"key": "english","name": "English"}, 
				{"key": "british","name": "English - UK"}, 
				{"key": "canadian","name": "English - Canada"}, 
				{"key": "australian","name": "English - Australia"}, 
				{"key": "newzealand","name": "English - New Zealand"}, 
				{"key": "estonian","name": "Estonian"}, 
				{"key": "finnish","name": "Finnish"}, 
				{"key": "french","name": "French"}, 
				{"key": "german","name": "German"}, 
				{"key": "german","name": "German - Germany"}, 
				{"key": "swissgerman","name": "German - Switzerland"}, 
				{"key": "austrian","name": "German - Austria"}, 
				{"key": "ngerman","name": "German - Germany (new)"}, 
				{"key": "nswissgerman","name": "German - Switzerland"}, 
				{"key": "greek","name": "Greek"}, 
				{"key": "italian","name": "Italian"}, 
				{"key": "norwegian","name": "Norwegian"}, 
				{"key": "polish","name": "Polish"}, 
				{"key": "brazil","name": "Portuguese - Brazil"}, 
				{"key": "portuges","name": "Portuguese - Portugal"}, 
				{"key": "russian","name": "Russian"}, 
				{"key": "slovak","name": "Slovak"}, 
				{"key": "slovene","name": "Slovene"}, 
				{"key": "spanish","name": "Spanish"}, 
				{"key": "swedish","name": "Swedish"}
				]
			},
		"url": {
			"title": "URL",
			"type": "uri"
			},
		"urldate": {
			"title": "Abrufdatum",
			"type": "date",
			"timespan": false
			},
		"publisher": {
			"title": "Verlag",
			"type": "text"
			},
		"pubstate": {
			"title": "Publikationsstatus",
			"type": "option",
			"options": [ 
				{"key": "inpreparation", "name": "invorbereitung"}, 
				{"key": "submitted", "name": "eingereicht"}, 
				{"key": "forthcoming", "name": "bevorstehend"}, 
				{"key": "inpress","name": "im Druck"}, 
				{"key": "prepublished", "name": "vorveröffentlicht"}
				]
			},
		"institution": {
			"title": "Institution",
			"type": "text"
			}
		},
	"identifier": {
		"$name": "Kennung",
		"isan": {
			"title": "ISAN",
			"type": "text"
			},
		"isbn": {
			"title": "ISBN",
			"type": "text"
			},
		"ismn": {
			"title": "ISMN",
			"type": "text"
			},
		"isrn": {
			"title": "ISRN",
			"type": "text"
			},
		"issn": {
			"title": "ISSN",
			"type": "text"
			},
		"eid": {
			"title": "E-ID",
			"type": "text"
			},
		"eprint": {
			"title": "Eprint",
			"type": "text"
			},
		"wprintclass": {
			"title": "Eprint Klasse",
			"type": "text"
			},
		"eprinttype": {
			"title": "Eprint Typ",
			"type": "text"
			},
		"DOI": {
			"title": "DOI",
			"type": "text"
			}
		},
	"other": {
		"addendum": {
			"title": "Anmerkung",
			"type": "text"
			},
		"howpublished": {
			"title": "Publikationsmethode",
			"type": "text"
			},
		"pages": {
			"title": "Seiten",
			"type": "range"
			},
		"pagetotal": {
			"title": "Seiten insg.",
			"type": "text"
			},
		"pagination": {
			"title": "Nummerierung",
			"type": "option",
			"options": [
				{ "key": "page", "name": "Seiten"}, 
				{"key": "column", "name": "Spalten"}, {"key": "line", "name": "Zeilen"}, 
				{"key": "verse", "name": "Verse"}, {"key": "section", "name": "Abschnitte"}, 
				{"key": "paragraph", "name": "Paragrafen"}
				]
			},
		"keywords": {
			"title": "Schlagwörter",
			"type": "text"
			},
		"label": {
			"title": "Kurzzitation",
			"type": "text"
			},
		"part": {
			"title": "Nummer",
			"type": "text"
			}
		},
	"notes": {
		"$name": "Textinformationen",
		"abstract": {
			"order": 1,
			"type": "longtext",
			"title": "Zusammenfassung"
			},
		"annotation": {
			"order": 2,
			"title": "Anmerkungen",
			"type": "longtext"
			},
		"note": {
			"order": 3,
			"title": "Notiz",
			"type": "longtext"
			}
		}
	};

