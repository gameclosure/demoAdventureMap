import ui.ImageView as ImageView;

import adventuremap.views.tiles.status.NodeItemView as NodeItemView;

exports = Class(NodeItemView, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		this.style.width = 200;
		this.style.height = 200;

		this.offsetY = -120;
		new ImageView({
			superview: this,
			x: 0,
			y: 0,
			width: 200,
			height: 200,
			image: 'resources/images/roundEdged.png'
		})
	};

	this.update = function (tile) {
		this.style.visible = true;
	};
});