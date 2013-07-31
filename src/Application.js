import device;

import adventuremap.AdventureMap as AdventureMap;
import adventuremap.views.editor.Editor as Editor;
import adventuremap.views.tiles.status.LabelView as LabelView;
import adventuremap.views.tiles.status.PlayerView as PlayerView;

import .data;
//localStorage.clear();

exports = Class(GC.Application, function () {

	this.initUI = function () {
		var editMode = true;
		var inputLayerIndex = editMode ? 0 : 2;

		this.engine.updateOpts({
			alwaysRepaint: true,
			clearEachFrame: editMode,
			keyListenerEnabled: false,
			logsEnabled: true,
			noTimestep: false,
			noReflow: true,
			showFPS: true,
			resizeRootView: false,
			preload: ['resources/images', 'resources/audio']
		});

		this.scaleUI();

		var gridSettings = {
				width: 10,
				height: 18,
				tags: [
					'zone1A',
					'zone1B',
					'zone2A',
					'zone2B'
				]
			};

		var tileSettings = {
				tiles: [],
				doodads: [
					{image: 'resources/images/bushNormal.png', width: 120, height: 144},
					{image: 'resources/images/bushNormal.png', width: 120, height: 144}
				],
				tileWidth: 256,
				tileHeight: 256,
				defaultTile: 3
			};

		for (var y = 0; y < gridSettings.height; y++) {
			for (var x = 0; x < gridSettings.width; x++) {
				var filename = 'resources/images/tiles/' + String.fromCharCode(97 + y) + (x + 1) + '.png';
				tileSettings.tiles.push(filename);
			}
		}

		var nodeSettings = {
				nodes: [
					{image: 'resources/images/node/grayButton.png', width: 170, height: 170},
					{image: 'resources/images/node/topButton.png', width: 170, height: 170},
					{image: 'resources/images/node/midButton.png', width: 170, height: 170},
					{image: 'resources/images/node/lowButton.png', width: 170, height: 170}
				],
				itemCtors: {
					Label: LabelView,
					Player: PlayerView
				}
			};

		var pathSettings = {
				// Display properties:
				dotDistance: 50,
				dashDistance: 70,
				paths: [
					{type: 'dash', image: 'resources/images/path/grayDash.png', width: 200, height: 200},
					{type: 'dash', image: 'resources/images/path/topDash.png', width: 200, height: 200},
					{type: 'dash', image: 'resources/images/path/midDash.png', width: 200, height: 200},
					{type: 'dash', image: 'resources/images/path/lowDash.png', width: 200, height: 200},
					{type: 'dot', image: 'resources/images/path/grayDot.png', width: 150, height: 150},
					{type: 'dot', image: 'resources/images/path/topDot.png', width: 150, height: 150},
					{type: 'dot', image: 'resources/images/path/midDot.png', width: 150, height: 150},
					{type: 'dot', image: 'resources/images/path/lowDot.png', width: 150, height: 150},
					{type: 'line', image: 'resources/images/path/grayLine.png', height: 360},
					{type: 'line', image: 'resources/images/path/topLine.png', height: 360},
					{type: 'line', image: 'resources/images/path/midLine.png', height: 360},
					{type: 'line', image: 'resources/images/path/lowLine.png', height: 360}
				]
			};

		this._adventureMap = new AdventureMap({
			superview: this,
			x: 0,
			y: 0,
			width: this.baseWidth,
			height: this.baseHeight,
			editMode: (inputLayerIndex === 0),
			gridSettings: gridSettings,
			tileSettings: tileSettings,
			pathSettings: pathSettings,
			nodeSettings: nodeSettings,
			inputLayerIndex: inputLayerIndex
		});
		this._adventureMap.refresh();


		this._adventureMap.load(data);

		//var model = this._adventureMap.getModel();
		//setTimeout(bind(this, function () {
		//	console.log('set tag!');
		//	model.addTagById('3', 'Player');
		//}), 3000);

		this._adventureMap.setScale(0.5);

		if (inputLayerIndex === 0) {
			new Editor({
				superview: this,
				x: 0,
				y: 0,
				width: this.baseWidth,
				height: this.baseHeight,
				adventureMap: this._adventureMap,
				gridSettings: gridSettings,
				tileSettings: tileSettings,
				pathSettings: pathSettings,
				nodeSettings: nodeSettings
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
