Fork of [The Lounge](https://github.com/thelounge/lounge) web IRC client, adding an auto connect feature with an auto login feature for private mode. Lounge version [v2.4.0](https://github.com/thelounge/lounge/releases/tag/v2.4.0) is supported.

    git clone https://github.com/libertysoft3/lounge-autoconnect.git
    cd lounge-autoconnect
    git checkout v2.4.0-autoconnect
    npm install
    NODE_ENV=production npm run build
    npm start

Private mode: auto login and auto connect http://localhost:9000/?autologin=true&user=lounger&al-password=lounger&autoconnect=true&nick=lounger&username=lounger&join=%23thelounge-spam%2c%23thelounge-spamier&tls=true

Private mode guest accounts: user "guest" creates a new randomized user account http://localhost:9000/?autologin=true&user=guest&autoconnect=true&nick=guest&username=guest&realname=guest&tls=true

Public mode: auto connect http://localhost:9000/?autoconnect=true&nick=lounger&username=lounger&join=%23thelounge-spam&tls=true

All of the "Connect" form fields can be passed via url parameters to autoconnect: (server) name, host, port, password, tls, nick, username, realname, and join.
