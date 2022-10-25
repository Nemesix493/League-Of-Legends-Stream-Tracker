let lpByRank = 100
let tiers = {
    'IRON': 0,
    'BRONZE': 4*lpByRank,
    'SILVER': 8*lpByRank,
    'GOLD': 12*lpByRank,
    'PLATINUM': 16*lpByRank,
    'DIAMOND': 20*lpByRank
}

let ranks = {
    'I': 3*lpByRank,
    'II': 2*lpByRank,
    'III': lpByRank,
    'IV': 0
}

function get_summoner_rank_at_start(summoner_name){
    let query = 'https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + data['accounts'][summoner_name]['id'] + '?api_key=' + data['api_key']
    fetch(query).then(function(res) {
        if (res.ok) {
            return res.json()
        }
    })
    .then(function(value) {
        data['accounts'][summoner_name]['rank_stats'] = {}
        data['accounts'][summoner_name]['rank_now'] = {}
        data['accounts'][summoner_name]['rank_at_start'] = {}
        for (let list in value){
            data['accounts'][summoner_name]['rank_at_start'][value[list]['queueType']]=value[list];
        }
    })
    .catch(function(err) {
        alert('Oups O_o !\nSomthing went wrong !\nRefresh the page or check your data in \'data.js\'')
    });
}

function get_user_info(summoner_name){
    let result
    let query = 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summoner_name + '?api_key=' + data['api_key']
    fetch(query).then(function(res) {
        if (res.ok) {
            return res.json()
        }
    })
    .then(function(value) {
        for (const key in value){
            data['accounts'][summoner_name][key]=value[key];
        }
        get_summoner_rank_at_start(summoner_name)
    })
    .catch(function(err) {
        alert('Oups O_o !\nSomthing went wrong !\nRefresh the page or check your data in \'data.js\'')
    });
}

function calc_rank_stats(summoner_name){
    for (const key in data['accounts'][summoner_name]['rank_at_start']){
        let atStart = data['accounts'][summoner_name]['rank_at_start'][key]
        let now = data['accounts'][summoner_name]['rank_now'][key]
        data['accounts'][summoner_name]['rank_stats'][key] = {}
        data['accounts'][summoner_name]['rank_stats'][key]={
            'deltaLeaguePoints': tiers[now['tier']]+ranks[now['rank']] + now['leaguePoints'] - (tiers[atStart['tier']] + ranks[atStart['rank']] + atStart['leaguePoints']),
            'losses': now['losses'] - atStart['losses'],
            'wins': now['wins'] - atStart['wins'],
            'played':(now['losses'] - atStart['losses']) + (now['wins'] - atStart['wins']),
        }
    }
}

function replaceText(summoner_name){
    let result = data['accounts'][summoner_name]['text']
    result = result.replace('%summonerName%', summoner_name)
    result = result.replace('%deltaLeaguePoints%', data['accounts'][summoner_name]['rank_stats'][data['accounts'][summoner_name]['queueType']]['deltaLeaguePoints'])
    result = result.replace('%losses%', data['accounts'][summoner_name]['rank_stats'][data['accounts'][summoner_name]['queueType']]['losses'])
    result = result.replace('%wins%', data['accounts'][summoner_name]['rank_stats'][data['accounts'][summoner_name]['queueType']]['wins'])
    result = result.replace('%played%', data['accounts'][summoner_name]['rank_stats'][data['accounts'][summoner_name]['queueType']]['played'])
    result = result.replace('%tier%', data['accounts'][summoner_name]['rank_now'][data['accounts'][summoner_name]['queueType']]['tier'])
    result = result.replace('%rank%', data['accounts'][summoner_name]['rank_now'][data['accounts'][summoner_name]['queueType']]['rank'])
    result = result.replace('%leaguePoints%', data['accounts'][summoner_name]['rank_now'][data['accounts'][summoner_name]['queueType']]['leaguePoints'])
    result = result.replace('\n', '<br/>')
    return result
}

function refresh_display(summoner_name){
    let text = document.getElementById(data['accounts'][summoner_name]['textId'])
    text.innerHTML = replaceText(summoner_name)
}

function get_summoner_rank_now(summoner_name){
    let query = 'https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + data['accounts'][summoner_name]['id'] + '?api_key=' + data['api_key']
    fetch(query).then(function(res) {
        if (res.ok) {
            return res.json()
        }
    })
    .then(function(value) {
        data['accounts'][summoner_name]['rank_now'] = {}
        for (let list in value){
            data['accounts'][summoner_name]['rank_now'][value[list]['queueType']]=value[list];
        }
        calc_rank_stats(summoner_name)
        refresh_display(summoner_name)
    })
    .catch(function(err) {
        alert('Oups O_o !\nSomthing went wrong !\nRefresh the page or check your data in \'data.js\'')
    });
}

function init(){
    data['session_start'] = Math.floor(Date.now()/1000)
    for (const key in data['accounts']){
        get_user_info(key)
    }
    let body = document.getElementsByTagName('body')[0];
    for (const key in data['accounts']){
        let text = document.createElement('p');
        text.setAttribute('id', data['accounts'][key]['textId'])
        body.appendChild(text)
    }
}

function refreshAll(){
    for (const key in data['accounts']){
        get_summoner_rank_now(key)
    }
}

init()
setTimeout(refreshAll, 2000)
setInterval(refreshAll, 20000)




