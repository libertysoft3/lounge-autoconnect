[The Lounge](https://github.com/thelounge/lounge) web IRC client, adding an autoconnect feature. this closed codebase is lounge [v2.4.0](https://github.com/thelounge/lounge/releases/tag/v2.4.0)

    git clone https://github.com/thelounge/lounge.git
		cd lounge
		npm install
		NODE_ENV=production npm run build
		npm start


then visit https://ip:9000/?autoconnect=true&nick=autoconnect&username=autoconnect&join=%23channelA%2c%23channelB

All of the Connect form fields can be passed via url parameters. 
