const emote = function (roomHash, reaction, message) {
    if (reaction == NaN || reaction > 7 || reaction < 1) reaction = Math.floor(Math.random() * 7 + 1);;
    fetch('https://analytics.quizizz.com/events', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: '[{"eventName":"ft_student_live_reaction_hold","params":{"screen":"inGame.waiting","country":"US","userId":"0","roomHash":"0","gameState":"waiting","playerId":"","gameExperiment":"seaFil_exp","sessionId":"0","reactionId":"${reaction}"},"platform":"web","slot":"5","experiment":"seaFil_exp","time":0,"timezoneOffset":0}]',
        cache: 'default'
    })

    fetch('https://quizizz.com/play-api/reactionUpdate', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: `{"playerId":"${message}","roomHash":"${roomHash}","hostId":"${user.id}","questionId":"","triggerType":"live-reaction","reactionDetail":{"id":${reaction},"intensity":1.000000000000000}}`,
        cache: 'default'
    })
}

fetch("https://game.quizizz.com/play-api/v5/checkRoom", {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: `{"roomCode":"${prompt("Enter Room Code:")}","mongoId":"${user.id}"}`
}).then((response) => response.json()).then((data) => {
    if (data && data.room && data.room.hash) {
        const reactionNumber = Number(prompt("Reaction Number:"))
        const message = prompt("Message/Sent User:")
        const speed = Number(prompt("Reactions/second:"))
        if (speed == NaN) {
            alert("Invalid Speed")
        } else {
            setInterval(function () { emote(data.room.hash, reactionNumber, message) }, 1000 / speed)
        }
    } else { alert("Invalid Room Code") }
})