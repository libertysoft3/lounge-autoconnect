"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const sidebar = $("#sidebar");
const storage = require("../localStorage");
const URI = require("urijs");

socket.on("init", function(data) {
	$("#loading-page-message").text("Rendering…");

	if (data.networks.length === 0) {

		// Autoconnect
		var params = URI(document.location.search);
		params = params.search(true);
		if (!(params.hasOwnProperty('autoconnect') && params['autoconnect'] === 'true')) {
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

			// Autoconnect
			var params = URI(document.location.search);
			params = params.search(true);
			if (!(params.hasOwnProperty('autoconnect') && params['autoconnect'] === 'true')) {
				$("#footer").find(".connect").trigger("click", {
					pushState: false,
				});
			}
		}
	}
});
