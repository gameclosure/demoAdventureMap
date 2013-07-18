import event.Emitter as Emitter;

import .models.AdventureMapModel as AdventureMapModel;

import .views.AdventureMapView as AdventureMapView;

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

		opts.tileSize = 256;
		opts.map = this._model.getMap();
		opts.scrollData = this._scrollData;
		this._adventureMapView = new AdventureMapView(opts);

		this._adventureMapView.getAdventureMapLayers()[0].on('Size', bind(this._model, 'onSize'));

		this._adventureMapView.on('ScrollLeft', bind(this._model, 'onScrollLeft'));
		this._adventureMapView.on('ScrollRight', bind(this._model, 'onScrollRight'));
		this._adventureMapView.on('ScrollUp', bind(this._model, 'onScrollUp'));
		this._adventureMapView.on('ScrollDown', bind(this._model, 'onScrollDown'));

		this._model.on('NeedsPopulate', bind(this._adventureMapView, 'needsPopulate'));
		this._model.on('Update', bind(this._adventureMapView, 'onUpdate'));
	};

	this.getModel = function () {
		return this._model;
	};

	this.getAdventureMapView = function () {
		return this._adventureMapView;
	};

	this.getAdventureMapLayers = function () {
		return this._adventureMapView.getAdventureMapLayers();
	};

	this.getScrollData = function () {
		return this._scrollData;
	};

	this.tick = function (dt) {
		this._model.tick(dt);
	};
});