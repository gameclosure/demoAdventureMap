import math.geom.Vec2D as Vec2D;

import ui.View as View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;

import ..ViewPool;

exports = Class(ImageView, function (supr) {
	this.init = function (opts) {
		opts.blockEvents = true;

		supr(this, 'init', [opts]);

		this._tileSize = opts.tileSize;

		this._index = 0;
		this._pointSize = 24;
		this._pointDistance = 20;

		this._itemView = null;
		this._itemRightView = null;
		this._itemBottomView = null;

		this._tileX = 0;
		this._tileY = 0;

		this._itemView = new ImageView({
			superview: this,
			width: 100,
			height: 100,
			image: 'resources/images/path/dot.png'
		});
	};

	this.update = function (grid, tileX, tileY) {
		this._tileX = tileX;
		this._tileY = tileY;

		var tile = grid[tileY][tileX];
		if (tile.level) {
			this._itemView.style.x = this.style.width * tile.x - 50;
			this._itemView.style.y = this.style.height * tile.y - 50;
		}
		this.style.visible = tile.level;
	};
});