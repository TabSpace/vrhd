/**
 * @fileoverview 范例数据
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 范例数据
 */
define('mods/data/demo',function(require,exports,module){

	module.exports = {
		"person": {
			"alpha": 0,
			"beta": 0,
			"gamma": 0,
			"posture": "standing",
			"padHeight": 1.1,
			"eyeHeight": 1.6,
			"groundX": 0,
			"groundY": 0
		},
		"coordinateSystem": {
			"transform": "",
			"showAxis": true
		},
		"house": {
			"room": {
				"room": {
					"ratio": 200,
					"extent": 4,
					"width": 3,
					"height": 2.8,
					"extentPx": 800,
					"widthPx": 600,
					"heightPx": 560
				},
				"floor": {
					"surface": {
						"background": {
							"color": "#ddd",
							"image": "images/floor/floor1.jpg"
						},
						"light": {},
						"mask": {},
						"content": {},
						"animate": {}
					}
				},
				"ceiling": {
					"surface": {
						"background": {
							"color": "#eee"
						},
						"light": {},
						"mask": {},
						"content": {},
						"animate": {}
					}
				},
				"front": {
					"surface": {
						"background": {
							"color": "#ddd",
							"image": "images/wall/wall4.jpg"
						},
						"light": {},
						"mask": {
							"door" : {
								"style" : "images/door/door2.jpg",
								"left" : 2,
								"width" : 0.85,
								"height" : 2
							}
						},
						"content": {},
						"animate": {}
					}
				},
				"behind": {
					"surface": {
						"background": {
							"color": "#ddd",
							"image": "images/wall/wall4.jpg"
						},
						"light": {},
						"mask": {
							"window" : {
								"style" : "images/window/win1.png",
								"outer" : "images/outer/outer1.gif",
								"top" : 0.175,
								"left" : 0.175,
								"width" : 2.645,
								"height" : 1.55
							}
						},
						"content": {},
						"animate": {}
					}
				},
				"left": {
					"surface": {
						"background": {
							"color": "#ddd",
							"image": "images/wall/wall4.jpg"
						},
						"light": {},
						"mask": {},
						"content": {},
						"animate": {}
					}
				},
				"right": {
					"surface": {
						"background": {
							"color": "#ddd",
							"image": "images/wall/wall4.jpg"
						},
						"light": {},
						"mask": {
							"tv" : {
								"style" : "images/tv/tv1.png",
								"top" : 1,
								"left" : 0,
								"width" : 1.092,
								"height" : 0.64,
								"screenHeight" : 0.62
							}
						},
						"content": {},
						"animate": {}
					}
				}
			}
		}
	};

});
