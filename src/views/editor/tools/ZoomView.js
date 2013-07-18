import ..components.BottomBar as BottomBar;
import ..components.EditButton as EditButton;

exports = Class(BottomBar, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		var size = this.style.height;

		new EditButton({
			superview: this,
			x: 4,
			y: 4,
			width: 180,
			height: size - 8,
			style: 'BLUE',
			title: 'Zoom in'
		}).on('Up', bind(this, 'emit', 'ZoomIn'));

		new EditButton({
			superview: this,
			x: 180,
			y: 4,
			width: 180,
			height: size - 8,
			style: 'BLUE',
			title: 'Zoom out'
		}).on('Up', bind(this, 'emit', 'ZoomOut'));
	};
});