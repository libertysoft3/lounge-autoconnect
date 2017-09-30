"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const sidebar = $("#sidebar");
const storage = require("../localStorage");
const URI = require("urijs");

socket.on("init", function(data) {

	// Autoconnect
	var featureAutoconnect = false;
	var params = URI(document.location.search);
	params = params.search(true);
	if (params.hasOwnProperty('autoconnect') && params['autoconnect'] === 'true') {
		featureAutoconnect = true;
	}

	// Autoconnect - prevent flash
	if (!featureAutoconnect) {
		$("#loading-page-message").text("Rendering…");
	}

	if (data.networks.length === 0) {

		// Autoconnect - prevent Connect show
		if (!featureAutoconnect) {
			$("#footer").find(".connect").trigger("click", {
				pushState: false,
			});
		}
	} else {
		render.renderNetworks(data);
	}

	if (data.token && $("#sign-in-remember").is(":checked")) {
		storage.set("token", data.token);
	} else {
		storage.remove("token");
	}

	$("body").removeClass("signed-out");
	$("#loading").remove();
	$("#sign-in").remove();

	const id = data.active;
	const target = sidebar.find("[data-id='" + id + "']").trigger("click", {
		replaceHistory: true
	});
	if (target.length === 0) {
		const first = sidebar.find(".chan")
			.eq(0)
			.trigger("click");
		if (first.length === 0) {

			// Autoconnect - prevent connect show
			if (!featureAutoconnect) {
				$("#footer").find(".connect").trigger("click", {
					pushState: false,
				});
			} else if (featureAutoconnect && data.active === -1 && data.autoLoginSuccess === true && data.token && !$("body").hasClass("public")) {
				var connectParams = {};
			 	var whitelist = ['name', 'host', 'port', 'password', 'tls', 'nick', 'username', 'realname', 'join'];

				// Default config
				$.each($('#connect form').serializeArray(), function(i, obj) {
			 		if (obj.value !== '' && whitelist.indexOf(obj.name) !== -1) {
			 			connectParams[obj.name] = obj.value;
			 		}
			 	});

				// Override default config with url params
				for (var i = 0; i < whitelist.length; i++) {
					var key = whitelist[i];
		 			if (params.hasOwnProperty(key) && params[key] != '') {
						key = key.replace(/\W/g, ""); // \W searches for non-word characters
						connectParams[key] = params[key];
		 			}
		 		}
		 		socket.emit("conn", connectParams);
			}

		}
	}
});
