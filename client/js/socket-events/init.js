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
	if (params.hasOwnProperty('autoconnect')) {
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
	$("body").removeClass("loading");

	// Autoconnect - init
	// NOTE: Single network compatible only. Sees Network of the last active channel only.
	var id = data.active;
	var target = sidebar.find("[data-id='" + id + "']");
	// console.log('dbg: active channel(' + id + '): ', $(target).data("title"));
	var joinChannels = featureAutoconnect && params.hasOwnProperty('join') ? params['join'].split(',') : [];
	var channels = [];
	if (featureAutoconnect && id > 0) {
		$(target).parent(".network").find(".channel").each(function(){
			channels.push({id: $(this).data("id"), title: $(this).data("title"), target: $(this).data("target")});
		});
	}
	
	// Autoconnect - switch to a different (already joined) channel
	if (featureAutoconnect && id > 0 && joinChannels.length > 0 && joinChannels[joinChannels.length-1] != $(target).data("title")) { // do nothing if desired channel already active, core will click it below
		for (var i = channels.length - 1; i >= 0; i--) {
			if (channels[i].title == joinChannels[joinChannels.length-1]) {
				id = channels[i].id;
				target = sidebar.find("[data-id='" + id + "']");
				// console.log('dbg: new active channel: ', $(target).data("title"));
			}
		}
	}
	
	// Autoconnect - join any new channels, will be shown once server responds
	if (featureAutoconnect && id > 0 && joinChannels.length > 0) {
		var toJoin = [];
		for (var i = joinChannels.length - 1; i >= 0; i--) {
			var areJoined = false;
			for (var j = channels.length - 1; j >= 0; j--) {
				if (joinChannels[i] == channels[j].title) {
					areJoined = true;
				}
			}
			if (!areJoined) {
				toJoin.push(joinChannels[i]);
			}
		}
		if (toJoin.length > 0) {
			// console.log('dbg: join channels', toJoin.join());
			socket.emit("input", {
				target: id, // our current channel id
				text: "/join " + toJoin.join()
			});
		}
	}

	// Autoconnect - quit handling - quit all channels aside from the last specified one in 'join' (active channel will be quit if joining new channel)
	// TODO - For smoother quit, could refuse to insert channels in renderNetworks()
	if (featureAutoconnect && id > 0 && params.hasOwnProperty('quit')) {
		var didQuit = false;
		$(target).parent(".network").find(".channel").each(function () {
			if ($(this).data('title') != joinChannels[joinChannels.length-1]) {
				// console.log('dbg: quit ', $(this).data('title'));
				$(this).find('button.close').trigger("click");
				didQuit = true;
			}
		});
		if (didQuit) {
			// console.log('dbg: returning');
			return; // prevent core from clicking a channel we just closed below or connecting
		}
	}

	// console.log('dbg: core: clicking active channel: ', sidebar.find("[data-id='" + id + "']").data('title'));
	// CORE: 

	target.trigger("click", {
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
