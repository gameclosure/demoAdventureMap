import ui.View as View;
import ui.resource.Image as Image;
import ui.GestureView as GestureView;

import .ViewPool;

exports = Class(GestureView, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		var width = this.style.width;
		var height = this.style.height;
		var tileSize = opts.tileSize;

		this.style.x = -tileSize;
		this.style.y = -tileSize;

		this._tileSize = tileSize;
		this._tiles = opts.tiles ? this._loadTiles(opts.tiles) : [];
		this._map = opts.map;

		this._needsPopulate = true;
		this._scrollData = opts.scrollData;
		this._sizeX = Math.ceil(width / tileSize) + 4;
		this._sizeY = Math.ceil(height / tileSize) + 4;

		this._viewPool = new ViewPool({
			initCount: this._sizeX * this._sizeY,
			ctor: opts.tileCtor,
			initOpts: {
				superview: this,
				tileSize: opts.tileSize,
				width: opts.tileSize,
				height: opts.tileSize,
				tiles: opts.tiles,
				nodes: opts.nodes,
				paths: opts.paths,
				dotDistance: opts.dotDistance,
				dashDistance: opts.dashDistance,
				labelWidth: opts.labelWidth,
				labelHeight: opts.labelHeight,
				labelCtor: opts.labelCtor
			}
		});
	};

	this._loadTiles = function (tiles) {
		var i = tiles.length;
		while (i) {
			if (typeof tiles[--i] === 'string') {
				tiles[i] = new Image({url: tiles[i]});
			}
		}

		return tiles;
	};

	this.populateView = function (data) {
		var grid = data.grid;
		var tileSize = this._tileSize;
		var sizeX = this._sizeX;
		var sizeY = this._sizeY;
		var viewPool = this._viewPool;
		var views = viewPool.getViews();
		var index = 0;

		for (var y = 0; y < sizeY; y++) {
			for (var x = 0; x < sizeX; x++) {
				var view;
				if (index < viewPool.getLength()) {
					view = views[index];
				} else {
					view = viewPool.obtainView();
				}
				view.style.zIndex = sizeX * sizeY - index;
				view.style.x = x * tileSize;
				view.style.y = y * tileSize;
				view.style.width = tileSize;
				view.style.height = tileSize;
				view.update(grid, data.tileX + x, data.tileY + y);
				index++;
			}
		}

		this.style.width = sizeX * tileSize;
		this.style.height = sizeY * tileSize;

		this._gridWidth = data.width;
		this._gridHeight = data.height;
		this._needsPopulate = false;

		this.emit('Size', sizeX, sizeY);
	};

	this.onUpdate = function (data) {
		if (this._needsPopulate) {
			this.populateView(data);
		}

		this.style.x = this._scrollData.x - this._tileSize * 2;
		this.style.y = this._scrollData.y - this._tileSize * 2;
	};

	this.needsPopulate = function () {
		this._needsPopulate = true;
	};

	this.getMap = function () {
		return this._map;
	};
});