import device;

import .models.AdventureMapModel as AdventureMapModel;

import .views.AdventureMapLayer as AdventureMapLayer;

import .views.tiles.BackgroundTileView as BackgroundTileView;
import .views.tiles.PathTileView as PathTileView;
import .views.tiles.ItemTileView as ItemTileView;

import .views.CursorView as CursorView;

exports = Class(GC.Application, function () {

	this.initUI = function () {
		this.scaleUI();

		var tiles = [
				'resources/images/water-01.png',
				'resources/images/water-02.png',
				'resources/images/water-03.png',
				'resources/images/water-04.png',
				'resources/images/water-05.png',
				'resources/images/water-06.png',
				'resources/images/water-07.png',
				'resources/images/water-08.png',
				'resources/images/water-09.png',
				'resources/images/water-10.png',
				'resources/images/water-11.png',
				'resources/images/water-12.png',
				'resources/images/water-13.png',
				'resources/images/water-14.png'
			];

		var map = [
				[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
				[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
				[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
				[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
				[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
				[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
				[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
				[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
				[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
				[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
				[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
				[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
				[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
				[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
				[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
				[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
			];

		this._adventureMapModel = new AdventureMapModel({
			tileSize: 256,
			width: 16,
			height: 16
		});

		this._scrollData = {
			x: 0,
			y: 0
		};

		this._adventureMapLayer1 = new AdventureMapLayer({
			superview: this,
			x: 0,
			y: 0,
			width: this.baseWidth,
			height: this.baseHeight,
			tileSize: this._adventureMapModel.getTileSize(),
			tileCtor: BackgroundTileView,
			data: this._scrollData,
			map: map,
			tiles: tiles,
			canDrag: true
		});
		this._adventureMapLayer2 = new AdventureMapLayer({
			superview: this,
			x: 0,
			y: 0,
			width: this.baseWidth,
			height: this.baseHeight,
			tileSize: this._adventureMapModel.getTileSize(),
			tileCtor: PathTileView,
			data: this._scrollData,
			canDrag: false,
			blockEvents: true
		});
		this._adventureMapLayer3 = new AdventureMapLayer({
			superview: this,
			x: 0,
			y: 0,
			width: this.baseWidth,
			height: this.baseHeight,
			tileSize: this._adventureMapModel.getTileSize(),
			tileCtor: ItemTileView,
			data: this._scrollData,
			canDrag: false,
			blockEvents: true
		});

		this._cursorView = new CursorView({
			superview: this,
			x: 0,
			y: 0,
			width: this._adventureMapModel.getTileSize(),
			height: this._adventureMapModel.getTileSize(),
			adventureMapModel: this._adventureMapModel,
			scrollData: this._scrollData
		});

		this._adventureMapLayer1.on('Size', bind(this._adventureMapModel, 'onSize'));
		this._adventureMapLayer1.on('ScrollLeft', bind(this._adventureMapModel, 'onScrollLeft'));
		this._adventureMapLayer1.on('ScrollRight', bind(this._adventureMapModel, 'onScrollRight'));
		this._adventureMapLayer1.on('ScrollUp', bind(this._adventureMapModel, 'onScrollUp'));
		this._adventureMapLayer1.on('ScrollDown', bind(this._adventureMapModel, 'onScrollDown'));
		this._adventureMapLayer1.on('Select', bind(this, 'onSelectTile'));
		this._adventureMapLayer1.on('Scroll', bind(this, 'onScroll'));

		this._adventureMapModel.on('NeedsPopulate', bind(this._adventureMapLayer1, 'needsPopulate'));
		this._adventureMapModel.on('NeedsPopulate', bind(this._adventureMapLayer2, 'needsPopulate'));
		this._adventureMapModel.on('NeedsPopulate', bind(this._adventureMapLayer3, 'needsPopulate'));

		this._cursorView.on('NeedsPopulate', bind(this._adventureMapLayer1, 'needsPopulate'));
		this._cursorView.on('NeedsPopulate', bind(this._adventureMapLayer2, 'needsPopulate'));
		this._cursorView.on('NeedsPopulate', bind(this._adventureMapLayer3, 'needsPopulate'));

		this._adventureMapModel.on('Update', bind(this._adventureMapLayer1, 'onUpdate'));
		this._adventureMapModel.on('Update', bind(this._adventureMapLayer2, 'onUpdate'));
		this._adventureMapModel.on('Update', bind(this._adventureMapLayer3, 'onUpdate'));
	};

	this.onSelectTile = function (tileX, tileY) {
		this._cursorView.showAt(tileX, tileY);
	};

	this.onScroll = function () {
		this._cursorView.hide();
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
		this._adventureMapModel.tick(dt);
	};
});
