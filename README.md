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
* Private mode guest accounts: http://localhost:9000/?tls=true&autologin&user=guest&autoconnect&nick=lounger&username=lounger&realname=lounger


Url params
----------------
* autologin: sign into or create a The Lounge private mode user account. Requires params user and al-password. (private mode only)
	* al-password: yes, it's a cleartext password
* autoconnect: automatically join the channels specified. Requires params nick, username, and realname (public or private modes)
	* join: connect to one or more channels. The last channel specified will be shown to the user. e.g. `&join=#channelA,#channelB`
	* quit: quit any connected channels aside from the last channel specified in 'join'
	* All of the "Connect" form fields can be passed via url parameters: name, host, port, password, tls, nick, username, realname, and join.

More on [public vs. private mode](https://thelounge.github.io/docs/server/users.html)

Multiple tabs with different channels - it all falls apart
------------------------
* Joining a new channel in a new window: selects the second channel in first window, client thinks it's a new join
* Refreshing new channel in second window: ???
