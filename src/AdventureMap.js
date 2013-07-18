import event.Emitter as Emitter;

import .models.AdventureMapModel as AdventureMapModel;

import .views.AdventureMapView as AdventureMapView;

exports = Class(Emitter, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		this._model = new AdventureMapModel({
			tileSize: 256,
			width: 20,
			height: 20,
			defaultTile: 3
		});

		this._scrollData = {
			x: 0,
			y: 0,
			scale: 1
		};

		opts.tileSize = 256;
		opts.map = this._model.getMap();
		opts.scrollData = this._scrollData;
		this._adventureMapView = new AdventureMapView(opts);

		this._adventureMapView.on('Size', bind(this._model, 'onSize'));
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

	this.setScale = function (scale) {
		if (scale < 0.5) {
			scale = 0.5;
		} else if (scale > 2) {
			scale = 2;
		}
		this._adventureMapView.setScale(scale);

		return scale;
	};

	this.tick = function (dt) {
		this._model.tick(dt);
	};
});