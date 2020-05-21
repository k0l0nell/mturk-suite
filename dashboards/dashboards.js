let hitTrackerDB

(async function initialize () {
  hitTrackerDB = await openDatabase(`hitTrackerDB`, 1)
  overviewByRequester()
})()

// Opens the specified IndexedDB
function openDatabase (name, version) {
  return new Promise((resolve) => {
    const request = window.indexedDB.open(name, version)
    request.onsuccess = (event) => resolve(event.target.result)
  })
}

async function overviewByRequester() {
  const data = await requesterData()
  console.log(data)

  drawChart(data)
}

function requesterData() {

    return new Promise((resolve) => {
        let promiseData

        const transaction = hitTrackerDB.transaction([`hit`], `readonly`)
        const objectStore = transaction.objectStore(`hit`)

        objectStore.getAll().onsuccess = (event) => {
            promiseData = event.target.result.reduce(reduceByRequester,{})
        }
/*
        objectStore.index(`date`).openCursor().onsuccess = (event) => {
          const cursor = event.target.result

          if (cursor) {
            console.log(cursor.value)
            cursor.continue()
          }
        }
*/
        transaction.oncomplete = (event) => {
            resolve(promiseData)
        }

    })
}

function reduceByRequester(previous, current) {

    if(Object.keys(previous).includes(current.requester_id)) {
        previous[current.requester_id].rewards.push(current.reward.amount_in_dollars)
        previous[current.requester_id].work_dates.push(current.date)
    }
    else {
        previous[current.requester_id] = {
                    'requester_id': `${current.requester_id}`,
                    'requester_name':`${current.requester_name}`,
                    'rewards' : [current.reward.amount_in_dollars],
                    'work_dates' : [current.date]
                }
    }

    return previous
}

function sum(previous, current) {
    return previous + current
}

function avgRewards(data) {
    return (data.rewards.reduce(sum,0))/data.rewards.length
}

function drawChart(data) {
    var data_labels = Object.keys(data).map((id,index) => data[id].requester_name)
    var data_values = Object.keys(data).map((id,index) => avgRewards(data[id]) )

    var myChart = new Chart($('#productivity'), {
      type: 'bar',
      data: {
          labels: data_labels,
          datasets: [{
              label: 'Avg. Reward',
              data: data_values,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });
}

