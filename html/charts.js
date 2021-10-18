function make_chart(id, data) {
    const canvas = document.createElement("canvas")
    canvas.width = 300
    canvas.height = 300
    let ctx = canvas.getContext('2d')
    const labels = [];
    const myChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            labels: labels,
            datasets: [{
                label: id + ' temp',
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                data: []
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: `${id} temp`
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            console.log(context)
                            var label = context.dataset.label || '';
                            if (label) {
                                label += ': hi! ';
                            }
                            return label;
                        }
                    }
                }
            },
            legend: {
                displayed: true
            },
            responsive: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }

    })
    document.querySelector("#charts").appendChild(canvas)
    function CtoF(t) {
        return t * 1.8 + 32
    }
    data.forEach((d, i) => {
        console.log("item is", d)
        let label = i + "what is it"
        let temp = d.temperature
        myChart.data.labels.push(label)
        myChart.data.datasets[0].data.push(CtoF(temp))
    })
    console.log("new data is", myChart.data)
    myChart.update()
}

function fetch_data() {
    return fetch("https://weather.josh.earth/latest")
        .then((r) => r.json())
        .then((data) => {
            return data
        })
}

// make_chart('hude')
// make_chart('hatton')

function rescale(val, min, max, MIN, MAX) {
    let t = (val - min) / (max - min)
    return t * (MAX - MIN) + MIN
}

function make_chart2(key, value) {
    console.log("key", key, "value", value)
    let canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 400
    document.body.appendChild(canvas)
    let ctx = canvas.getContext('2d')
    ctx.font = '11pt sans-serif'
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, 400, 400)
    // plot the elements
    // legend: y is temp in Celsius
    // legend: x is timestamp
    // y axis is O -> 30
    // print the name of the station
    // mouse handler to render tooltip on top
    ctx.save()
    ctx.translate(70, 90)
    draw_bg(ctx)
    draw_yaxis(ctx)
    draw_points(ctx, value)
    ctx.restore()

    ctx.save()
    ctx.translate(20, 20)
    draw_label(ctx, key)
    draw_latest(ctx, value)
    ctx.restore()
    // 5 golden emps => fuse() => pog pet
}

function draw_latest(ctx, data) {
    let last = data[data.length - 1]
    console.log("last is", last)
    let date = new Date(last.timestamp)
    console.log(date)
    ctx.fillStyle = 'black'
    //    let str = `latest ${date.getFullYear()} ${date.getMonth()} ${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    let str = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date);
    ctx.fillText('latest ' + str, 20, 30)
}

function draw_label(ctx, txt) {
    ctx.fillStyle = 'black'
    ctx.fillText(txt, 0, 0)
}

function draw_bg(ctx) {
    ctx.fillStyle = '#eee'
    ctx.fillRect(0, 0, 300, 300)
}

function draw_yaxis(ctx) {
    //draw 0 to 30 scaled as 300 to 0
    for (let i = 0; i < 30; i += 3) {
        let x = -25
        ctx.fillStyle = '#ccc'
        let y = rescale(i, 0, 30, 300, 0)
        ctx.fillRect(0, y, 300, 1)
        ctx.fillStyle = 'black'
        ctx.fillText(i + "", x, y + 5)
    }
}

function draw_points(ctx, data) {
    data.forEach((dat, i) => {
        console.log("dat", dat, new Date(dat.timestamp))
        let y = rescale(dat.temperature, 0, 30, 300, 0)
        let x = i * 20 + 20
        ctx.fillStyle = 'black'
        ctx.fillRect(x, y, 5, 5)
    })
}
async function doit() {
    let data = await fetch_data()
    Object.entries(data).forEach(([key, value]) => {
        //make_chart(key, value)
        make_chart2(key, value)
    })
}

doit().then(() => console.log("done with setup")).catch(e => console.log(e))
