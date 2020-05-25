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

        previous[current.requester_id].rejections += current.state.match(/Rejected/) ? 1 : 0
    }
    else {
        previous[current.requester_id] = {
                    'requester_id': `${current.requester_id}`,
                    'requester_name':`${current.requester_name}`,
                    'rewards' : [current.reward.amount_in_dollars],
                    'work_dates' : [current.date],
                    'rejections': current.state.match(/Rejected/) ? 1 : 0
                }
    }

    return previous
}

function sum(previous, current) {
    return previous + current
}

function minimumHitsRequired(data, requirement) {
    return data.rewards.length >= requirement
}

function hideZeroOrOne(data) {
    var rejected=  rejectionRatio(data)
    return ( rejected > 0 && rejected < 1 && data.rewards.length > 10 )
}

function rejectionRatio(data) {
    return (data.rejections/data.rewards.length)
}

function avgRewards(data) {
    return (data.rewards.reduce(sum,0))/data.rewards.length
}

function drawChart(data) {

    var top = 10

    var meetsRequirements = Object.values(data).filter(requester => minimumHitsRequired(requester,5))

    var topReward = meetsRequirements.sort(function(a,b){ return b.rewards.reduce(sum) - a.rewards.reduce(sum)}).slice(0,top)
    var bottomAvgReward = meetsRequirements.sort(function(a,b){ return avgRewards(a) - avgRewards(b)}).slice(0,top)
    var topavgReward = meetsRequirements.sort(function(a,b){ return avgRewards(b) - avgRewards(a)}).slice(0,top)
    var topHITS = meetsRequirements.sort(function(a,b){ return b.rewards.length - a.rewards.length}).slice(0,top)

    var toprejectionRatio = meetsRequirements
        .sort(function(a,b){ return rejectionRatio(b) - rejectionRatio(a)})
        .filter(req => hideZeroOrOne(req))
        .slice(0,top)

    new Chart($('#TopAvgReward'), {
      type: 'bar',
      data: {
          labels: topavgReward.map(req=>req.requester_name),
          datasets: [{
              label: `Top ${top} By Avg. Reward`,
              data: topavgReward.map(req=> avgRewards(req)),
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true,
                      callback: function (value) {return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  }
              }]
          }
      }
  });
    new Chart($('#TopReward'), {
        type: 'bar',
        data: {
            labels: topReward.map(req=>req.requester_name),
            datasets: [{
                label: `Top ${top} By Total Reward`,
                data: topReward.map(req=> req.rewards.reduce(sum)),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: function (value) {return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    }
                }]
            }
        }
    });
    new Chart($('#TopHIT'), {
            type: 'bar',
            data: {
                labels: topHITS.map(req=>req.requester_name),
                datasets: [{
                    label: `Top ${top} By # Hits`,
                    data: topHITS.map(req=> req.rewards.length),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
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

    new Chart($('#BottomAvgReward'), {
          type: 'bar',
          data: {
              labels: bottomAvgReward.map(req=>req.requester_name),
              datasets: [{
                  label: `Bottom ${top} By Avg. Reward`,
                  data: bottomAvgReward.map(req=> avgRewards(req)),
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero: true,
                          callback: function (value) {return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      }
                  }]
              }
          }
      });
    new Chart($('#TopRejection'), {
               type: 'bar',
               data: {
                   labels: toprejectionRatio.map(req=>req.requester_name),
                   datasets: [{
                       label: `Top ${top} By Rejection Ratio`,
                       data: toprejectionRatio.map(req=> rejectionRatio(req)),
                       backgroundColor: [
                           'rgba(255, 99, 132, 0.2)',
                           'rgba(54, 162, 235, 0.2)',
                           'rgba(255, 206, 86, 0.2)',
                           'rgba(75, 192, 192, 0.2)',
                           'rgba(153, 102, 255, 0.2)'
                       ],
                       borderColor: [
                           'rgba(255, 99, 132, 1)',
                           'rgba(54, 162, 235, 1)',
                           'rgba(255, 206, 86, 1)',
                           'rgba(75, 192, 192, 1)',
                           'rgba(153, 102, 255, 1)'
                       ],
                       borderWidth: 1
                   }]
               },
               options: {
                   scales: {
                       yAxes: [{
                           ticks: {
                               beginAtZero: true,
                               callback: function (value) {return value.toLocaleString('en-GB', {style:'percent'})}
                           }
                       }]
                   }
               }
           });

}

