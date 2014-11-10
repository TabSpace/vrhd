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
							"image": ""
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
							"color": "#fdd",
							"image": ""
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
							"image": ""
						},
						"light": {},
						"mask": {},
						"content": {},
						"animate": {}
					}
				},
				"behind": {
					"surface": {
						"background": {
							"color": "#ddd",
							"image": ""
						},
						"light": {},
						"mask": {},
						"content": {},
						"animate": {}
					}
				},
				"left": {
					"surface": {
						"background": {
							"color": "#ddd",
							"image": ""
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
							"image": ""
						},
						"light": {},
						"mask": {},
						"content": {},
						"animate": {}
					}
				}
			}
		}
	};

});
