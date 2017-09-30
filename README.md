[The Lounge](https://github.com/thelounge/lounge) web IRC client, adding an auto connect feature which includes an optional auto login feature for private mode. This cloned codebase is at lounge version [v2.4.0](https://github.com/thelounge/lounge/releases/tag/v2.4.0) released 7/30/17.

    git clone https://github.com/libertysoft3/lounge-autoconnect.git
    cd lounge-autoconnect
    git checkout v2.4.0-autoconnect
    npm install
    NODE_ENV=production npm run build
    npm start

Auto connect in public and private modes: `http://localhost:9000/?autoconnect=true&nick=autoconnect&username=autoconnect&join=%23channelA%2c%23channelB&tls=true`

Auto login and auto connect in private mode: `http://localhost:9000/?autologin=true&user=client-username&al-password=client-password&autoconnect=true&nick=autoconnect&username=autoconnect&join=%23channelA%2c%23channelB&tls=true`

http://localhost:9000/?autologin=true&user=user&al-password=password&autoconnect=true&nick=ac-guest&username=ac-guest&realname=ac-guest&tls=on

All of the "Connect" form fields can be passed via url parameters to autoconnect: (server) name, host, port, password, tls, nick, username, realname, and join.

TODO:
* password collision, rename the autologin one
