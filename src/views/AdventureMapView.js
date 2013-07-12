import ui.View as View;

import .ViewPool;
import .TileView;

exports = Class(View, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		this._tileSize = null;

		this._viewPool = new ViewPool({
			initCount: 100,
			ctor: TileView,
			initOpts: {
				superview: this
			}
		});
	};

	this.populateView = function (data) {
		var grid = data.grid;
		var width = this.style.width;
		var height = this.style.height;
		var tileSize = this._tileSize;
		var sizeX = Math.ceil(width / tileSize) + 1;
		var sizeY = Math.ceil(height / tileSize) + 1;
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
				view.update(grid, x, y, tileSize);
				index++;
			}
		}
		this._needsPopulate = false;
	};

	this.onUpdate = function (data) {
		if (this._tileSize !== data.tileSize) {
			this._tileSize = data.tileSize;
			this.populateView(data);
		}
	};
});