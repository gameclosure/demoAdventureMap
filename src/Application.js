import device;

import adventuremap.AdventureMap as AdventureMap;
import adventuremap.views.editor.Editor as Editor;
import adventuremap.views.tiles.status.LabelView as LabelView;
import adventuremap.views.tiles.status.PlayerView as PlayerView;

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

		var doodads = [
				{image: 'resources/images/bushNormal.png', width: 120, height: 144},
				{image: 'resources/images/bushNormal.png', width: 120, height: 144}
			];

		var tags = [
				'Player',
				'Label'
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

		var inputLayerIndex = 0;

		this._adventureMap = new AdventureMap({
			// View properties:
			superview: this,
			x: 0,
			y: 0,
			width: this.baseWidth,
			height: this.baseHeight,
			editMode: (inputLayerIndex === 0),
			// Grid properties:
			gridSettings: {
				width: 20,
				height: 20
			},
			tileSettings: {
				tiles: tiles,
				doodads: doodads,
				tileWidth: 256,
				tileHeight: 256,
				defaultTile: 3
			},
			pathSettings: {
				// Display properties:
				dotDistance: 60,
				dashDistance: 60,
				paths: paths
			},
			nodeSettings: {
				nodes: nodes,
				itemCtors: {
					Label: LabelView,
					Player: PlayerView
				}
			},
			inputLayerIndex: inputLayerIndex
		});

		this._adventureMap.load(
			{"tileWidth":256,"tileHeight":256,"width":20,"height":20,"grid":[[3],[3],[3],[3,3,{"node":2,"right":3,"bottom":3,"x":0.67578125,"y":0.7406249999999996,"tags":{"Bonus":true},"id":"3","map":3},{"node":3,"bottom":3,"tags":{"Stars":true,"Player":true},"text":"world","title":"hello","x":0.09375,"y":0.2703125000000002,"id":"4","map":3},3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],[3,3,{"node":2,"bottom":3,"x":0.1781250000000001,"y":0.4976562499999999,"tags":{"Warp":true},"id":"2","map":3},{"node":3,"x":0.7601562499999996,"y":0.6179687499999997,"tags":{"Warp":true},"id":"5","map":3},3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],[3,3,{"node":2,"tags":{"Stars":true},"id":"1","map":3},3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],[3],[3],[3],[3],[3],[3],[3],[3],[3],[3],[3],[3],[3],[3]]}
		);

		var model = this._adventureMap.getModel();
		setTimeout(bind(this, function () {
			console.log('set tag!');
			model.addTagById('3', 'Player');
		}), 3000);

		if (inputLayerIndex === 0) {
			new Editor({
				superview: this,
				x: 0,
				y: 0,
				width: this.baseWidth,
				height: this.baseHeight,
				adventureMap: this._adventureMap,
				tiles: tiles,
				doodads: doodads,
				nodes: nodes,
				paths: paths,
				tags: tags
			});
		}
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
});
