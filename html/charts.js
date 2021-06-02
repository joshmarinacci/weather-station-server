function make_chart(id,data) {
    const canvas = document.createElement("canvas")
    canvas.width = 400
    canvas.height = 400
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
                    text: `${id} temp stuff`
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
        return t*1.8+32
    }
    data.forEach((d,i) => {
        let label = i
        let temp = d.temperature
        myChart.data.labels.push(label)
        myChart.data.datasets[0].data.push(CtoF(temp))
    })
    console.log("new data is",myChart.data)
    myChart.update()
}

function fetch_data() {
    return fetch("http://vr.josh.earth:3000/latest")
        .then((r)=>r.json())
        .then((data)=> {
            return data
        })
}

// make_chart('hude')
// make_chart('hatton')

async function doit() {
    let data = await fetch_data()
    Object.entries(data).forEach(([key,value])=>{
        make_chart(key,value)
    })
}

doit().then(()=>console.log("done with setup")).catch(e => console.log(e))
