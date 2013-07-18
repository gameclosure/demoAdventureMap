import animate;

import ui.View as View;
import ui.ImageView as ImageView;
import ui.ImageScaleView as ImageScaleView;
import ui.TextView as TextView;

import ui.resource.Image as Image;

import menus.constants.menuConstants as menuConstants;

import ..components.BottomBar as BottomBar;
import ..components.EditButton as EditButton;

exports = Class(BottomBar, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		console.log(opts.tags);
/*
			new EditButton({
				superview: this,
				x: 4,
				y: 4,
				width: size - 8,
				height: size - 8,
				icon: {
					image: 'resources/images/editor/buttonBack.png',
					x: (size - 8) * 0.2,
					y: (size - 8) * 0.18,
					width: (size - 8) * 0.6,
					height: (size - 8) * 0.6
				},
				style: 'BLUE'
			}).on('Up', bind(this, 'onLeft'));
*/
	};

	this.show = function () {
		supr(this, 'show');
		this.updateTags();
	};

	this.updateTags = function () {
	};
});