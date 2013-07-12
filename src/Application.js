import device;

import .models.AdventureMapModel as AdventureMapModel;
import .views.AdventureMapView as AdventureMapView;

exports = Class(GC.Application, function () {

	this.initUI = function () {
		this.scaleUI();

		this._adventureMapModel = new AdventureMapModel({
		});

		this._adventureMapView = new AdventureMapView({
			superview: this,
			x: 0,
			y: 0,
			width: this.baseWidth,
			height: this.baseHeight
		});
		this._adventureMapModel.on('Update', bind(this._adventureMapView, 'onUpdate'));
	};

	this.scaleUI = function () {
		if (device.height > device.width) {
			this.baseWidth = 576;
			this.baseHeight = device.height * (576 / device.width);
			this.scale = device.width / this.baseWidth;
		} else {
			this.baseWidth = 1024;
			this.baseHeight = device.height * (1024 / device.width);
			this.scale = device.height / this.baseHeight;
		}
		this.view.style.scale = this.scale;
	};

	this.tick = function (dt) {
		this._adventureMapModel.tick(dt);
	};
});
