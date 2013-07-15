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

		this._doAddPath = true;

		this._tileX = 0;
		this._tileY = 0;

		this._vec = new Vec2D({x: 1, y: 1});
	};

	this._addPath = function (grid, x1, y1, x2, y2) {
		var result = new ImageView({
			superview: this,
			x: 0,
			y: 0,
			offsetX: -20,
			offsetY: -20,
			anchorX: 20,
			anchorY: 20,
			width: 40,
			height: 40,
			zIndex: 100000,
			image: 'resources/images/path/line.png',
			visible: false
		});

		return result;
	};

	this._updatePath = function (grid, x1, y1, x2, y2, view) {
		var node1 = grid[y1][x1];
		var node2 = grid[y2][x2];

		if (!node1 || !node2) {
			return;
		}

		var style = view.style;
		var tileSize = this._tileSize;
		var vec = this._vec;
		var a1 = node1.x * tileSize;
		var b1 = node1.y * tileSize;
		var a2 = (x2 - x1 + node2.x) * tileSize;
		var b2 = (y2 - y1 + node2.y) * tileSize;

		vec.x = a2 - a1;
		vec.y = b2 - b1;

		style.x = a1;
		style.y = b1;
		style.width = vec.getMagnitude();
		style.r = vec.getAngle();
	};

	this.update = function (grid, tileX, tileY) {
		this._tileX = tileX;
		this._tileY = tileY;

		if (this._doAddPath) {
			this._itemRightView = this._addPath(grid, tileX, tileY, tileX + 1, tileY);
			this._itemBottomView = this._addPath(grid, tileX, tileY, tileX, tileY + 1);

			this._doAddPath = false;
		}
		this._updatePath(grid, tileX, tileY, tileX + 1, tileY, this._itemRightView);
		this._updatePath(grid, tileX, tileY, tileX, tileY + 1, this._itemBottomView);

		var tile = grid[tileY][tileX];
		this._itemRightView.style.visible = tile.right;
		this._itemBottomView.style.visible = tile.bottom;

		this.style.visible = tile.right || tile.bottom;
	};
});