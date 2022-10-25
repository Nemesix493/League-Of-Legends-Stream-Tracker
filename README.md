# League Of Legends Stream Tracker
## Setup
### 1. First step download the files !
### 2. Fill your information in the data.js file

![the data file](/img/data_file.PNG)

Enter your api key

Replace 'yourSummonerName'

Enter a textId to change text style in OBS

In the text your text to display and use:
- %summonerName% to your summoner name
- %deltaLeaguePoints% to your League Points variation
- %losses% to your number of losses games
- %wins% to your number of wins games
- %played% to your number of played games
- %tier% to your tier
- %rank% to your rank
- %leaguePoints% to your number of League Points
- \n for line break

Finally the 'queueType' field:
- RANKED_FLEX_SR for flex
- RANKED_SOLO_5x5 for solo_q

Add all the accounts you want they will be stacked vertically from top to bot

### 3. Add it in OBS
Add a browser source

![the OBS setting](/img/OBS_settings.PNG)

Add the index.html file

Do not check those:
- Shutdown source when not visible
- Refresh browser when scene becomes active

Then you can use the custom CSS by using the 'textId'
