import ui.View as View;
import ui.ImageView as ImageView;

import .ViewPool;

exports = Class(ImageView, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', arguments);

		this._index = 0;

		this._viewPool = new ViewPool({
			initCount: 100,
			ctor: ImageView,
			initOpts: {
				superview: opts.superview,
				image: 'resources/images/path/dot.png',
				zIndex: 1000000
			}
		});

		this._itemView = null;
	};

	this.calcSpline = function (points) {
		var p0x = points[0].x;
		var p0y = points[0].y;
		var p1x = points[1].x;
		var p1y = points[1].y;
		var p2x = points[2].x;
		var p2y = points[2].y;
		var p3x = points[3].x;
		var p3y = points[3].y;
		var splinePoints = [];
		var i;

		var dx = p2x - p1x;
		var dy = p2y - p1y;
		var distance = Math.sqrt(dx * dx + dy * dy);
		var d = distance / 5;
		var skip = 0;//((70 / (distance / d)) | 0) + 1;
		console.log('========>', skip);

		if (d > 1) {
			for (i = skip + 1; i < d - skip; i++) {
				var t1 = i / d;
				var t2 = t1 * t1;
				var t3 = t2 * t1;

				splinePoints.push({
					x: 0.5 * (
						(2 * p1x) +
							(-p0x + p2x) * t1 +
							(2 * p0x - 5 * p1x + 4 * p2x - p3x) * t2 +
							(-p0x + 3 * p1x - 3 * p2x + p3x) * t3
						),
					y: 0.5 * (
						(2 * p1y) +
							(-p0y + p2y) * t1 +
							(2 * p0y - 5 * p1y + 4 * p2y - p3y) * t2 +
							(-p0y + 3 * p1y - 3 * p2y + p3y) * t3
						)
				});
			}
		}

		return splinePoints;
	};

	this.addPoint = function (point) {
		var viewPool = this._viewPool;
		var views = viewPool.getViews();

		if (this._index >= viewPool.getLength()) {
			viewPool.obtainView();
		}
		view = views[this._index];
		view.style.x = point.x - 15;
		view.style.y = point.y - 15;
		view.style.width = 30;
		view.style.height = 30;
		view.style.visible = true;

		this._index++;
	};

	this.getPoint = function (grid, x, y, tileSize) {
		var node = grid[Math.max(y, 0)][Math.max(x, 0)];
		return {x: x * tileSize + node.x, y: y * tileSize + node.y};
	};

	this.update = function (grid, x, y, tileSize) {
		this.style.x = x * tileSize;
		this.style.y = y * tileSize;
		this.style.width = tileSize;
		this.style.height = tileSize;
		this.style.backgroundColor = ['rgb(110, 206, 61)', 'rgb(100, 186, 55)'][(x + y) & 1];
		this.style.visible = true;

		this._index = 0;

		var node = grid[y][x];

		if (node.right) {
			var points = [];
			if ((x > 0) && grid[y][x - 1].right) {
				points.push(this.getPoint(grid, x - 1, y, tileSize));
			} else if ((y > 0) && grid[y - 1].bottom) {
				points.push(this.getPoint(grid, x, y - 1, tileSize));
			} else {
				points.push(this.getPoint(grid, x, y, tileSize));
			}
			points.push(this.getPoint(grid, x, y, tileSize));
			points.push(this.getPoint(grid, x + 1, y, tileSize));
			if (grid[y][x + 1].right) {
				points.push(this.getPoint(grid, x + 2, y, tileSize));
			} else if (grid[y][x + 1].bottom) {
				points.push(this.getPoint(grid, x + 1, y + 1, tileSize));
			} else {
				points.push(this.getPoint(grid, x + 1, y, tileSize));
			}

			var splinePoints = this.calcSpline(points);
			var i = splinePoints.length;
			while (i) {
				this.addPoint(splinePoints[--i]);
			}
		}

		if (node.bottom) {
			var points = [];
			if ((y > 0) && grid[y - 1].bottom) {
				points.push(this.getPoint(grid, x, y - 1, tileSize));
			} else if ((x > 0) && grid[y][x - 1].right) {
				points.push(this.getPoint(grid, x - 1, y, tileSize));
			} else {
				points.push(this.getPoint(grid, x, y, tileSize));
			}
			points.push(this.getPoint(grid, x, y, tileSize));
			points.push(this.getPoint(grid, x, y + 1, tileSize));
			if (grid[y + 1][x].bottom) {
				points.push(this.getPoint(grid, x, y + 2, tileSize));
			} else if (grid[y + 1][x].right) {
				points.push(this.getPoint(grid, x + 1, y + 1, tileSize));
			} else {
				points.push(this.getPoint(grid, x, y + 1, tileSize));
			}

			var splinePoints = this.calcSpline(points);
			var i = splinePoints.length;
			while (i) {
				this.addPoint(splinePoints[--i]);
			}
		}
		if ((node.bottom || node.right) && !this._itemView) {
			this._itemView = new ImageView({
				superview: this,
				x: node.x - 50,
				y: node.y - 50,
				width: 100,
				height: 100,
				backgroundColor: 'red',
				image: 'resources/images/node/blue.png'
			});
		}
	};
});