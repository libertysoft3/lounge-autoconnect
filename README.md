Fork of [The Lounge](https://github.com/thelounge/lounge) web IRC client, adding an auto connect feature with an auto login feature for private mode. Lounge version [v2.4.0](https://github.com/thelounge/lounge/releases/tag/v2.4.0) is supported.

    git clone https://github.com/libertysoft3/lounge-autoconnect.git
    cd lounge-autoconnect
    git checkout v2.4.0-autoconnect
    npm install
    NODE_ENV=production npm run build

    # Optional, creates config file, change default IRC server, etc:
    node index config

    npm start

* Public mode: http://localhost:9000/?tls=true&autoconnect&nick=lounger&username=lounger&realname=lounger&join=%23thelounge-spam
* Private mode: http://localhost:9000/?tls=true&autologin&user=lounger&al-password=lounger&autoconnect&nick=lounger&username=lounger&realname=lounger&join=%23thelounge-spam
* Private mode guest accounts: http://localhost:9000/?tls=true&autologin&user=guest&autoconnect&nick=lounger&username=lounger&realname=lounger&join=%23thelounge-spam


Url params
----------------
* autologin: sign into or create a The Lounge private mode user account. Requires params user and al-password. (private mode only)
	* al-password: yes, it's a cleartext password
* autoconnect: automatically join the channels specified. Requires params nick, username, and realname (public or private modes)
	* join: connect to one or more channels. (as per core, the last channel specified will have it's chat shown to the user). e.g. `&join=#channelA,#channelB`
	* quit: quit any connected channels aside from the last channel specified in 'join'
	* NOTE: All of the "Connect" form fields can be passed via url parameters: name, host, port, password, tls, nick, username, realname, and join.
* focuslock:
	* designed for multiple tabs/embeds with different `join` channels specified, so that channel focus isn't stolen for subsequent joins
	* core: on any join, show that channel's chat
	* with `focuslock` present your active room is locked down to the room specified in your url
	* when any client joins a channel, refuse to show the channel's room (unless it is the last channel specified in 'join', so that autoconnect still works)

More on [public vs. private mode](https://thelounge.github.io/docs/server/users.html)
