import device;

import .AdventureMap;
import .views.editor.Editor as Editor;

localStorage.clear();

exports = Class(GC.Application, function () {

	this.initUI = function () {
		this.scaleUI();

		var tiles = [
				'resources/images/water01.png',
				'resources/images/water02.png',
				'resources/images/water03.png',
				'resources/images/water04.png',
				'resources/images/water05.png',
				'resources/images/water06.png',
				'resources/images/water07.png',
				'resources/images/water08.png',
				'resources/images/water09.png',
				'resources/images/water10.png',
				'resources/images/water11.png',
				'resources/images/water12.png',
				'resources/images/water13.png',
				'resources/images/water14.png'
			];

		var nodes = [
				{type: 'active', image: 'resources/images/node/activeRing.png', width: 168, height: 145},
				{type: 'blue', image: 'resources/images/node/blue.png', width: 94, height: 89},
				{type: 'dark', image: 'resources/images/node/dark.png', width: 94, height: 89}
			];

		var paths = [
				{type: 'dash', image: 'resources/images/path/dash.png', width: 51, height: 31},
				{type: 'dot', image: 'resources/images/path/dot.png', width: 31, height: 31},
				{type: 'line', image: 'resources/images/path/line.png', height: 31}
			];

		var tags = [
				'Stars', 'Warp', 'Bonus'
			];

		this._adventureMap = new AdventureMap({
			superview: this,
			x: 0,
			y: 0,
			width: this.baseWidth,
			height: this.baseHeight,
			dotDistance: 60,
			dashDistance: 60,
			tiles: tiles,
			nodes: nodes,
			paths: paths,
			labelWidth: 200,
			labelHeight: 200
		});

		new Editor({
			superview: this,
			x: 0,
			y: 0,
			width: this.baseWidth,
			height: this.baseHeight,
			adventureMap: this._adventureMap,
			tiles: tiles,
			nodes: nodes,
			paths: paths,
			tags: tags
		});
	};

	this.scaleUI = function () {
		if (device.height > device.width) {
			this.baseWidth = 576;
			this.baseHeight = device.height * (576 / device.width);
			this.scale = device.width / this.baseWidth;
		} else {
			this.baseWidth = 1024;
			this.baseHeight = device.height * (1024 / device.width);
			this.scale = device.height / this.baseHeight;
		}
		this.view.style.scale = this.scale;
	};

	this.tick = function (dt) {
		this._adventureMap.tick(dt);
	};
});
