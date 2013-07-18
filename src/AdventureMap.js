import event.Emitter as Emitter;

import .models.AdventureMapModel as AdventureMapModel;

import .views.AdventureMapLayer as AdventureMapLayer;

import .views.tiles.TileView as TileView;
import .views.tiles.PathView as PathView;
import .views.tiles.NodeView as NodeView;
import .views.tiles.LabelView as LabelView;

exports = Class(Emitter, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		this._model = new AdventureMapModel({
			tileSize: 256,
			width: 16,
			height: 16,
			defaultTile: 3
		});

		this._scrollData = {
			x: 0,
			y: 0
		};

		this._adventureMapLayer1 = new AdventureMapLayer({
			superview: opts.superview,
			x: opts.x,
			y: opts.y,
			width: opts.width,
			height: opts.height,
			tileSize: this._model.getTileSize(),
			tileCtor: TileView,
			data: this._scrollData,
			map: this._model.getMap(),
			tiles: opts.tiles,
			canDrag: true
		});
		this._adventureMapLayer2 = new AdventureMapLayer({
			superview: opts.superview,
			x: opts.x,
			y: opts.y,
			width: opts.width,
			height: opts.height,
			tileSize: this._model.getTileSize(),
			tileCtor: PathView,
			data: this._scrollData,
			paths: opts.paths,
			canDrag: false,
			blockEvents: true,
			dotDistance: opts.dotDistance,
			dashDistance: opts.dashDistance
		});
		this._adventureMapLayer3 = new AdventureMapLayer({
			superview: opts.superview,
			x: opts.x,
			y: opts.y,
			width: opts.width,
			height: opts.height,
			tileSize: this._model.getTileSize(),
			tileCtor: NodeView,
			data: this._scrollData,
			nodes: opts.nodes,
			canDrag: false,
			blockEvents: true,
			labelWidth: opts.labelWidth,
			labelHeight: opts.labelHeight,
			labelCtor: opts.labelCtor || LabelView
		});

		this._adventureMapLayer1.on('Size', bind(this._model, 'onSize'));
		this._adventureMapLayer1.on('ScrollLeft', bind(this._model, 'onScrollLeft'));
		this._adventureMapLayer1.on('ScrollRight', bind(this._model, 'onScrollRight'));
		this._adventureMapLayer1.on('ScrollUp', bind(this._model, 'onScrollUp'));
		this._adventureMapLayer1.on('ScrollDown', bind(this._model, 'onScrollDown'));

		this._model.on('NeedsPopulate', bind(this._adventureMapLayer1, 'needsPopulate'));
		this._model.on('NeedsPopulate', bind(this._adventureMapLayer2, 'needsPopulate'));
		this._model.on('NeedsPopulate', bind(this._adventureMapLayer3, 'needsPopulate'));

		this._model.on('Update', bind(this._adventureMapLayer1, 'onUpdate'));
		this._model.on('Update', bind(this._adventureMapLayer2, 'onUpdate'));
		this._model.on('Update', bind(this._adventureMapLayer3, 'onUpdate'));
	};

	this.getModel = function () {
		return this._model;
	};

	this.getAdventureMapLayer1 = function () {
		return this._adventureMapLayer1;
	};

	this.getAdventureMapLayer2 = function () {
		return this._adventureMapLayer2;
	};

	this.getAdventureMapLayer3 = function () {
		return this._adventureMapLayer3;
	};

	this.getScrollData = function () {
		return this._scrollData;
	};

	this.tick = function (dt) {
		this._model.tick(dt);
	};
});