chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if (request.hitMissed) {
        hitMissed(request.hitMissed);
    }
});

const storage = new Object;

(async () => {
    const items = await new Promise((resolve) => chrome.storage.local.get([`earnings`, `exports`, `reviews`, `scripts`], resolve));
    Object.keys(items).forEach((currentValue) => storage[currentValue] = items[currentValue]);
})();

function ready(object) {
    return new Promise(async (resolve) => {
        try {
            if (object instanceof Object) {
                const promises = [];

                if (typeof object.enabled === `string`) {
                    const promiseEnabled = new Promise(async (resolve, reject) => {
                        await new Promise((resolve) => {
                            (function checkStorageScripts() {
                                if (storage.scripts instanceof Object) {
                                    return resolve();
                                } else {
                                    setTimeout(checkStorageScripts, 1);
                                }
                            })();
                        });

                        if (storage.scripts[object.enabled] === true) {
                            return resolve();
                        } else {
                            return reject(`Not enabled: ${object.enabled}`);
                        }
                    });

                    promises.push(promiseEnabled);
                }

                if (typeof object.document === `string`) {                    
                    const promiseReady = new Promise((resolve) => {
                        if (document.readyState === object.document || document.readyState === `complete`) {
                            return resolve();
                        } else {
                            document.addEventListener(`readystatechange`, (event) => {
                                if (event.target.readyState === object.document) {
                                    return resolve();
                                }
                            });
                        }
                    });

                    promises.push(promiseReady);
                }

                if (object.matches instanceof Array) {
                    const promiseMatches = new Promise((resolve, reject) => {
                        for (const item of object.matches) {
                            const regex = new RegExp(`https:\/\/worker\.mturk\.com${item.replace(/\*/g, `[^ ]*`)}`);

                            if (window.location.href.match(regex)) {
                                return resolve();
                            }
                        }
                        return reject(`Not matched: ${object.enabled ? object.enabled : object.matches.join(` `)}`);
                    });

                    promises.push(promiseMatches);
                }

                await Promise.all(promises);

                return resolve();
            }
        } catch (error) {}
    });
}

function require() {
    return new Promise(async (resolve) => {
        try {
            await ready({
                document: `interactive`
            });

            for (const value of arguments) {
                const element = document.querySelector(`[data-react-class="require('${value}')['default']"]`) || document.querySelector(`[data-react-class="require('${value}')['PureAlert']"]`);

                if (element !== null) {
                    return resolve({
                        element: element,
                        reactProps: JSON.parse(element.dataset.reactProps)
                    });
                }
            }

            throw `Could not resolve require('${arguments}') `;
        } catch (error) {}
    });
}

function sendMessage(object) {
    return new Promise((resolve) => chrome.runtime.sendMessage(object, resolve));
}

(async (fnName) => {
    await ready({ enabled: fnName , matches: [`/projects/*/tasks/*`] });

    const react = await require(`reactComponents/workPipeline/AutoAcceptCheckbox`);

    await ready({ document: `complete` });

    const checkbox = react.element.getElementsByTagName(`input`)[0];

    if (checkbox.checked === false) {
        checkbox.click();
    }
})(`autoAcceptChecker`);

(async (fnName) => {
    await ready({ enabled: fnName, matches: [`/tasks*`, `/projects/*/tasks/*`] });

    document.addEventListener(`submit`, (event) => {
        const returning = event.target.querySelector(`[value="delete"]`);

        if (returning) {
            event.preventDefault();

            if (confirm(`Are you sure you want to return this HIT?`)) {
                event.target.submit();
            }
        }
    });
})(`confirmReturnHIT`);

(async (fnName) => {
    const open = await sendMessage({ hitCatcher: `open` });

    if (open === true) {
        const react = await require(`reactComponents/hitSetTable/HitSetTable`);

        const hits = react.reactProps.bodyData.reduce((accumulator, currentValue) => {
            accumulator[currentValue.hit_set_id] = currentValue;
            return accumulator;
        }, new Object());

        await ready({ document: `complete` });

        for (const element of document.querySelectorAll(`.work-btn.hidden-sm-down`)) {
            const hit_set_id = element.href.match(/projects\/([A-Z0-9]+)\/tasks/)[1];

            const group = document.createElement(`div`);
            group.className = `btn-group`;

            const accept = document.createElement(`a`);
            accept.href = element.href;
            accept.className = `btn work-btn`;
            accept.textContent = `Accept`;
            group.appendChild(accept);

            const dropdown = document.createElement(`button`);
            dropdown.className = `btn btn-primary dropdown-toggle`;
            dropdown.dataset.toggle = `dropdown`;
            dropdown.addEventListener(`click`, (event) => {
                event.target.closest(`.desktop-row`).click();
            });
            group.appendChild(dropdown);

            const dropdownMenu = document.createElement(`ul`);
            dropdownMenu.className = `dropdown-menu dropdown-menu-right`;
            group.appendChild(dropdownMenu);

            const once = document.createElement(`div`);
            once.className = `col-xs-6`;
            dropdownMenu.appendChild(once);

            const onceAction = document.createElement(`button`);
            onceAction.className = `btn btn-primary`;
            onceAction.style.width = `100%`;
            onceAction.textContent = `Once`;
            onceAction.addEventListener(`click`, (event) => {
                event.target.closest(`.desktop-row`).click();

                chrome.runtime.sendMessage({
                    hitCatcher: {
                        id: hit_set_id, 
                        name: ``,
                        once: true,
                        sound: true,
                        project: hits[hit_set_id]
                    }
                });
            });
            once.appendChild(onceAction);

            const panda = document.createElement(`div`);
            panda.className = `col-xs-6`;
            dropdownMenu.appendChild(panda);

            const pandaAction = document.createElement(`button`);
            pandaAction.className = `btn btn-primary`;
            pandaAction.style.width = `100%`;
            pandaAction.textContent = `Panda`;
            pandaAction.addEventListener(`click`, (event) => {
                event.target.closest(`.desktop-row`).click();

                chrome.runtime.sendMessage({
                    hitCatcher: {
                        id: hit_set_id, 
                        name: ``,
                        once: false,
                        sound: false,
                        project: hits[hit_set_id]
                    }
                });
            });
            panda.appendChild(pandaAction);

            element.replaceWith(group);
        }
    }
})(`hitCatcher`);

(async (fnName) => {
    await ready({ enabled: fnName });

    const react = await require(`reactComponents/hitSetTable/HitSetTable`, `reactComponents/taskQueueTable/TaskQueueTable`);

    function createExportButton(stringText, stringFunction) {
        const div = document.createElement(`div`);
        div.className = `col-xs-6`;

        const button = document.createElement(`button`);
        button.className = `btn btn-primary btn-hit-export`;
        button.textContent = stringText;
        button.style.width = `100%`;
        button.addEventListener(`click`, (event) => {
            sendMessage({
                function: stringFunction,
                arguments: {
                    hit: JSON.parse(event.target.dataset.hit)
                }
            });
        });
        div.appendChild(button);

        return div;
    }

    const modal = document.createElement(`div`);
    modal.className = `modal`;
    modal.id = `hitExportModal`;
    document.body.appendChild(modal);

    const modalDialog = document.createElement(`div`);
    modalDialog.className = `modal-dialog`;
    modal.appendChild(modalDialog);

    const modalContent = document.createElement(`div`);
    modalContent.className = `modal-content`;
    modalDialog.appendChild(modalContent);

    const modalHeader = document.createElement(`div`);
    modalHeader.className = `modal-header`;
    modalContent.appendChild(modalHeader);

    const modalTitle = document.createElement(`h2`);
    modalTitle.className = `modal-title`;
    modalTitle.textContent = `HIT Export`;
    modalHeader.appendChild(modalTitle);

    const modalBody = document.createElement(`div`);
    modalBody.className = `modal-body`;
    modalContent.appendChild(modalBody);

    const modalBodyRow1 = document.createElement(`div`);
    modalBodyRow1.className = `row`;
    modalBody.appendChild(modalBodyRow1);
    modalBodyRow1.appendChild(createExportButton(`Short`, `hitExportShort`));
    modalBodyRow1.appendChild(createExportButton(`Plain`, `hitExportPlain`));

    const modalBodyRow2 = document.createElement(`div`);
    modalBodyRow2.className = `row`;
    modalBody.appendChild(modalBodyRow2);
    modalBodyRow2.appendChild(createExportButton(`BBCode`, `hitExportBBCode`));
    modalBodyRow2.appendChild(createExportButton(`Markdown`, `hitExportMarkdown`));

    const modalBodyRow3 = document.createElement(`div`);
    modalBodyRow3.className = `row`;
    modalBody.appendChild(modalBodyRow3);

    const turkerHub = document.createElement(`div`);
    turkerHub.className = `col-xs-6`;
    modalBodyRow3.appendChild(turkerHub);

    const turkerHubExport = document.createElement(`button`);
    turkerHubExport.className = `btn btn-primary btn-hit-export`;
    turkerHubExport.textContent = `Turker Hub`;
    turkerHubExport.style.width = `100%`;
    turkerHubExport.addEventListener(`click`, async (event) => {
        if (confirm(`Are you sure you want to export this HIT to TurkerHub.com?`)) {
            sendMessage({
                function: `hitExportTurkerHub`,
                arguments: {
                    hit: JSON.parse(event.target.dataset.hit)
                }
            });
        }
    });
    turkerHub.appendChild(turkerHubExport);

    const mturkCrowd = document.createElement(`div`);
    mturkCrowd.className = `col-xs-6`;
    modalBodyRow3.appendChild(mturkCrowd);

    const mturkCrowdExport = document.createElement(`button`);
    mturkCrowdExport.className = `btn btn-primary btn-hit-export`;
    mturkCrowdExport.textContent = `Mturk Crowd`;
    mturkCrowdExport.style.width = `100%`;
    mturkCrowdExport.addEventListener(`click`, async (event) => {
        if (confirm(`Are you sure you want to export this HIT to MturkCrowd.com?`)) {
            sendMessage({
                function: `hitExportMTurkCrowd`,
                arguments: {
                    hit: JSON.parse(event.target.dataset.hit)
                }
            });
        }
    });
    mturkCrowd.appendChild(mturkCrowdExport);

    const style = document.createElement(`style`);
    style.innerHTML = `.modal-backdrop.in { z-index: 1049; }`;
    document.head.appendChild(style);

    const json = react.reactProps.bodyData;

    await ready ({ document: `complete` });

    const hitRows = react.element.getElementsByClassName(`table-row`);

    for (let i = 0; i < hitRows.length; i ++) {
        const hit = json[i].project ? json[i].project : json[i];
        const project = hitRows[i].getElementsByClassName(`project-name-column`)[0];

        const button = document.createElement(`button`);
        button.className = `btn btn-primary btn-sm fa fa-share`;
        button.style.marginRight = `5px`;
        project.prepend(button);

        if (storage.exports === `all`) {
            button.dataset.toggle = `modal`;
            button.dataset.target = `#hitExportModal`;
            button.addEventListener(`click`,  (event) => {
                event.target.closest(`.desktop-row`).click();

                for (const element of document.getElementsByClassName(`btn-hit-export`)) {
                    element.dataset.hit = JSON.stringify(hit);
                }
            });
        }
        else {
            button.addEventListener(`click`, (event) => {
                event.target.closest(`.desktop-row`).click();

                const pairs = {
                    short: `hitExportShort`, plain: `hitExportPlain`, bbcode: `hitExportBBCode`,
                    markdown: `hitExportMarkdown`, turkerhub: `hitExportTurkerHub`, mturkcrowd: `hitExportMTurkCrowd`
                };

                if ((storage.exports === `hitExportTurkerHub` || storage.exports === `hitExportMturkCrowd`)) {
                    if (confirm(`Are you sure you want to export this HIT to ${storage.exports === `hitExportTurkerHub` ? `TurkerHub` : `MTurkCrowd`}.com?`) === false) {
                        return;
                    }
                }

                sendMessage({
                    function: pairs[storage.exports],
                    arguments: {
                        hit: hit
                    }
                });
            });
        }
    }
})(`hitExporter`);

(async (fnName) => {
    await ready({ enabled: fnName });

    const span = document.createElement(`span`);
    span.textContent = `Earnings: `;

    const link = document.createElement(`a`);
    link.href = `#`;
    link.textContent = storage.earnings.toMoneyString();
    link.addEventListener(`click`, (e) => {
        e.preventDefault();

        chrome.runtime.sendMessage({
            function: `openTracker`
        });
    });

    const spacer = document.createElement(`span`);
    spacer.textContent = ` | `;

    chrome.storage.onChanged.addListener((changes) => {
        if (changes.earnings instanceof Object) {
            link.textContent = changes.earnings.newValue.toMoneyString();
        }
    });

    await ready({ document: `interactive` });

    const element = document.getElementsByClassName(`col-xs-7`)[0];
    element.appendChild(spacer);
    element.appendChild(span);
    element.appendChild(link);
})(`hitTracker`);

(async (fnName) => {
    await ready({ enabled: fnName, document: `interactive`, matches: [`/projects/*/tasks/*`] });

    const react = await require(`reactComponents/common/ShowModal`);
    const hitId = await require(`reactComponents/workPipeline/TaskSubmitter`);
    const timer = await require(`reactComponents/common/CountdownTimer`);

    const assignment_id = new URLSearchParams(window.location.search).get(`assignment_id`);

    if (typeof assignment_id === `string`) {
        const parameters2 = new URLSearchParams(react.reactProps.modalOptions.contactRequesterUrl);

        const mturkDate = ((number) => {    
            function dst () {
                const today = new Date();
                const year = today.getFullYear();
                let start = new Date(`March 14, ${year} 02:00:00`);
                let end = new Date(`November 07, ${year} 02:00:00`);
                let day = start.getDay();
                start.setDate(14 - day);
                day = end.getDay();
                end.setDate(7 - day);
                return (today >= start && today < end) ? true : false;
            }

            const accepted = new Date(Date.now() - (number * 1000));
            const utc = accepted.getTime() + (accepted.getTimezoneOffset() * 60000);
            const offset = dst() === true ? `-7` : `-8`;
            const amz = new Date(utc + (3600000 * offset));
            const day = (amz.getDate()) < 10 ? `0` + (amz.getDate()).toString() : (amz.getDate()).toString();
            const month = (amz.getMonth() + 1) < 10 ? `0` + (amz.getMonth() + 1).toString() : (amz.getMonth() + 1).toString();
            const year = (amz.getFullYear()).toString();
            const date = year + month + day;

            return date;
        })(timer.reactProps.originalTimeToCompleteInSeconds - timer.reactProps.timeRemainingInSeconds);

        const message = {
            function: `hitTrackerUpdate`,
            arguments: {
                hit: {
                    hit_id: hitId.reactProps.hiddenFormParams.task_id,
                    requester_id: new URLSearchParams(react.reactProps.modalOptions.contactRequesterUrl).get(`hit_type_message[requester_id]`),
                    requester_name: react.reactProps.modalOptions.requesterName,
                    reward: {
                        amount_in_dollars: react.reactProps.modalOptions.monetaryReward.amountInDollars,
                        currency_code: react.reactProps.modalOptions.monetaryReward.currencyCode
                    },
                    state: `Assigned`,
                    title: react.reactProps.modalOptions.projectTitle,

                    date: mturkDate,
                    source: document.querySelector(`iframe.embed-responsive-item`).src
                },
                assignment_id: assignment_id
            }
        };

        chrome.runtime.sendMessage(message);

        document.addEventListener(`submit`, (event) => {
            const returning = event.target.querySelector(`[value="delete"]`);

            if (returning) {
                message.arguments.hit.state = `Returned`;

                chrome.runtime.sendMessage(message);
            }
        });

        window.addEventListener(`message`, (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.answer !== undefined && data.assignmentId !== undefined) {
                    chrome.runtime.sendMessage({
                        function: `hitTrackerSubmitted`,
                        arguments: {
                            data: data
                        }
                    });
                }
            } catch (error) {}
        });
    }
})(`hitTracker`);

(async (fnName) => {
    await ready({ enabled: fnName, matches: [`/tasks*`] });

    const react = await require(`reactComponents/taskQueueTable/TaskQueueTable`);
    console.log(react);

    const hits = react.reactProps.bodyData.reduce((accumulator, currentValue) => {
        const hit = currentValue;
        const project = hit.project;
        const question = hit.question;
        const assignment_id = hit.assignment_id;

        const mturkDate = ((number) => {
            function dst () {
                const today = new Date();
                const year = today.getFullYear();
                let start = new Date(`March 14, ${year} 02:00:00`);
                let end = new Date(`November 07, ${year} 02:00:00`);
                let day = start.getDay();
                start.setDate(14 - day);
                day = end.getDay();
                end.setDate(7 - day);
                return (today >= start && today < end) ? true : false;
            }

            const accepted = new Date(Date.now() - (number * 1000));
            const utc = accepted.getTime() + (accepted.getTimezoneOffset() * 60000);
            const offset = dst() === true ? `-7` : `-8`;
            const amz = new Date(utc + (3600000 * offset));
            const day = (amz.getDate()) < 10 ? `0` + (amz.getDate()).toString() : (amz.getDate()).toString();
            const month = (amz.getMonth() + 1) < 10 ? `0` + (amz.getMonth() + 1).toString() : (amz.getMonth() + 1).toString();
            const year = (amz.getFullYear()).toString();
            const date = year + month + day;

            return date;
        })(project.assignment_duration_in_seconds - hit.time_to_deadline_in_seconds);

        accumulator[assignment_id] = {
            hit_id: hit.task_id,
            requester_id: project.requester_id,
            requester_name: project.requester_name,
            reward: {
                amount_in_dollars: project.monetary_reward.amount_in_dollars,
                currency_code: project.monetary_reward.currency_code
            },
            state: hit.state,
            title: project.title,

            date: mturkDate,
            source: question && question.value ? question.value.replace(/amp;/g, ``) : null
        };

        chrome.runtime.sendMessage({
            function: `hitTrackerUpdate`,
            arguments: {
                hit: accumulator[assignment_id],
                assignment_id: assignment_id
            }
        });

        return accumulator;
    }, {});


    document.addEventListener(`submit`, (event) => {
        const returning = event.target.querySelector(`[value="delete"]`);

        if (returning) {
            const assignment_id = new URL(event.target.action).searchParams.get(`assignment_id`);

            if (assignment_id && hits[assignment_id]) {
                hits[assignment_id].state = `Returned`;

                chrome.runtime.sendMessage({
                    function: `hitTrackerUpdate`,
                    arguments: {
                        hit: hits[assignment_id],
                        assignment_id: assignment_id
                    }
                });
            }
            console.log(assignment_id)

        }
    });
})(`hitTracker`);

(async (fnName) => {
    await ready({ enabled: fnName, matches: [`/projects/*/tasks*`] });

    const react = await require(`reactComponents/common/ShowModal`);
    const react2 = await require(`reactComponents/modal/MTurkWorkerModal`);

    const details = react.element.closest(`.project-detail-bar`).firstElementChild.lastElementChild.firstElementChild;
    details.firstElementChild.className = `col-xs-4 text-xs-center col-md-4 text-md-center`;
    details.lastElementChild.className = `col-xs-4 text-xs-center col-md-4 text-md-right`;

    const available = document.createElement(`div`);
    available.className = `col-xs-4 text-xs-center col-md-4 text-md-center`;

    const availableLabel = document.createElement(`span`);
    availableLabel.className = `detail-bar-label`;
    availableLabel.textContent = `HITs: `;
    available.appendChild(availableLabel);

    const availableValue = document.createElement(`span`);
    availableValue.className = `detail-bar-value`;
    availableValue.textContent = react.reactProps.modalOptions.assignableHitsCount;
    available.appendChild(availableValue);

    details.insertBefore(available, details.lastElementChild);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const addedNode = mutation.addedNodes[0];

            if (addedNode.matches(`#modalProjectDetailsModal`) === true) {
                const requester = addedNode.querySelector(`[data-reactid=".8.0.0.1.0.0.1"]`);

                const link = document.createElement(`a`);
                link.href = `https://worker.mturk.com/requesters/${react.reactProps.modalOptions.contactRequesterUrl.match(/requesterId=(\w+)/)[1]}/projects`;
                link.target = `_blank`;
                link.textContent = react.reactProps.modalOptions.requesterName;

                requester.replaceWith(link);
            }
        });
    });

    observer.observe(react2.element, { childList: true });

    await ready({ document: `complete` });

    react.element.firstChild.textContent = react.reactProps.modalOptions.requesterName;
})(`hitDetailsEnhancer`);

(async (fnName) => {
    await ready({ enabled: fnName, matches: [`/tasks`] });

    const react = await require(`reactComponents/taskQueueTable/TaskQueueTable`);

    const bodyData = react.reactProps.bodyData;

    const count = bodyData.length;
    const total = bodyData.map(hit => hit.project.monetary_reward.amount_in_dollars).reduce((a, b) => a + b, 0);

    const info = document.createElement(`span`);
    info.className = `h2 text-muted result-count-info`;
    info.textContent = `(${count} HIT${count.length === 1 ? `` : `s`} worth $${total.toFixed(2)})`;

    document.getElementsByClassName(`task-queue-header`)[0].getElementsByClassName(`m-b-0`)[0].appendChild(info);
})(`queueInfoEnhancer`);

(async (fnName) => {
    await ready({ enabled: fnName, document: `interactive` });

    const error = document.getElementsByClassName(`error-page`);

    if (error.length && error[0].textContent.indexOf(`You have exceeded`) !== -1) {
        setTimeout(window.location.reload.bind(window.location), 1000);
    }
})(`rateLimitReloader`);

(async (fnName) => {
    await ready({ enabled: fnName });

    const react = await require(
        `reactComponents/hitSetTable/HitSetTable`,
        `reactComponents/taskQueueTable/TaskQueueTable`,
        `reactComponents/hitStatusDetailsTable/HitStatusDetailsTable`);

    const objectReviews = await sendMessage({
        function: `requesterReviewsGet`,
        arguments: {
            requesters: [...new Set(react.reactProps.bodyData.map((currentValue) => currentValue.project ? currentValue.project.requester_id : currentValue.requester_id))]
        }
    });

    const hitRows = react.element.getElementsByClassName(`table-row`);

    for (let i = 0; i < hitRows.length; i++) {
        const hit = react.reactProps.bodyData[i].project ? react.reactProps.bodyData[i].project : react.reactProps.bodyData[i];

        const review = objectReviews[hit.requester_id];
        const tv = review.turkerview;
        const to = review.turkopticon;
        const to2 = review.turkopticon2;

        function column(array) {
            let templateLabels = ``;
            let templateValues = ``;

            for (const value of array) {
                templateLabels += `<div>${value[0]}</div>`;
                templateValues += `<div>${value[1]}</div>`;
            }

            return `<div class="col-xs-6">${templateLabels}</div><div class="col-xs-6">${templateValues}</div>`;
        }


        function requesterReviewGetClass(review) {
            const tv = storage.reviews.turkerview ? review.turkerview : null;
            const to = storage.reviews.turkopticon ? review.turkopticon : null;
            const to2 = storage.reviews.turkopticon2 ? review.turkopticon2 : null;

            const tvPay = tv ? (tv.ratings.hourly / 3) : null;
            const tvHourly = tv ? tv.ratings.pay : null;
            const toPay = to ? to.attrs.pay : null;
            const to2Hourly = to2 ? to2.recent.reward[1] > 0 ? ((to2.recent.reward[0] / to2.recent.reward[1] * 3600) / 3) : to2.all.reward[1] > 0 ? ((to2.all.reward[0] / to2.all.reward[1] * 3600) / 3) : null : null;

            if (tvPay || tvHourly || toPay || to2Hourly) {
                const average = [tvPay, tvHourly, toPay, to2Hourly].filter(Boolean).map((currentValue, index, array) => Number(currentValue) / array.length).reduce((a, b) => a + b);
                return (average > 3.75 ? `btn-success` : average > 2 ? `btn-warning` : average > 0 ? `btn-danger` : `btn-default`);
            }

            return `btn-default`;
        }


        const reviewClass = ((review) => {
            const tv = review.turkerview;
            const to = review.turkopticon;
            const to2 = review.turkopticon2;

            const tvPay = tv ? (tv.ratings.hourly / 3) : null;
            const tvHourly = tv ? tv.ratings.pay : null;
            const toPay = to ? to.attrs.pay : null;
            const to2Hourly = to2 ? to2.recent.reward[1] > 0 ? ((to2.recent.reward[0] / to2.recent.reward[1] * 3600) / 3) : to2.all.reward[1] > 0 ? ((to2.all.reward[0] / to2.all.reward[1] * 3600) / 3) : null : null;

            if (tvPay || tvHourly || toPay || to2Hourly) {
                const average = [tvPay, tvHourly, toPay, to2Hourly].filter(Boolean).map((currentValue, index, array) => Number(currentValue) / array.length).reduce((a, b) => a + b);
                return (average > 3.75 ? `btn-success` : average > 2 ? `btn-warning` : average > 0 ? `btn-danger` : `btn-default`);
            }

            return false;
        })(review);

        const turkerview = ((object) => {
            let template = ``;

            if (storage.reviews.turkerview === true) {
                if (object instanceof Object) {
                    const ratings = object.ratings;

                    template = column([
                        [`Hourly`, object.ratings.hourly],
                        [`Pay`, object.ratings.pay],
                        [`Fast`, object.ratings.fast],
                        [`Comm`, object.ratings.comm],
                        [`Rej`, object.rejections],
                        [`ToS`, object.tos],
                        [`Blocks`, object.blocks],
                    ]);
                } else {
                    template = `No Reviews`;
                }
                return `<div class="col-xs-4" style="width: 150px;"><h2><a class="text-primary" href="https://turkerview.com/requesters/${hit.requester_id}" target="_blank">TurkerView</a></h2>${template}<div><a href="https://turkerview.com/review.php?rname=${encodeURIComponent(hit.requester_name)}&rid=${hit.requester_id}&title=${hit.title}" target="_blank">Review on TV</a></div></div>`;
            }
            return ``;
        })(review.turkerview);

        const turkopticon = ((object) => {
            let template = ``;

            if (storage.reviews.turkopticon === true) {
                if (object instanceof Object) {
                    template = column([
                        [`Pay`, `${object.attrs.pay} / 5`],
                        [`Fast`, `${object.attrs.fast} / 5`],
                        [`Comm`, `${object.attrs.comm} / 5`],
                        [`Fair`, `${object.attrs.fair} / 5`],
                        [`Reviews`, object.reviews],
                        [`ToS`, object.tos_flags],
                    ]);
                } else {
                    template = `No Reviews`;
                }
                return `<div class="col-xs-4" style="width: 150px;"><h2><a class="text-primary" href="https://turkopticon.ucsd.edu/${hit.requester_id}" target="_blank">Turkopticon</a></h2>${template}<div class="col-xs-12">&nbsp;</div><div><a href="https://turkopticon.ucsd.edu/report?requester[amzn_id]=${hit.requester_id}&requester[amzn_name]=${encodeURIComponent(hit.requester_name)}" target="_blank">Review on TO</a></div></div>`;
            }
            return ``;
        })(review.turkopticon);

        const turkopticon2 = ((object) => {
            let template = ``;

            if (storage.reviews.turkopticon2 === true) {
                if (object instanceof Object) {
                    const all = object.all;
                    const recent = object.recent;
                    template = column([
                        [
                            `Hourly`,
                            recent.reward[1] > 0 ? `$${(recent.reward[0] / recent.reward[1] * 3600).toFixed(2)}` : `---`,
                            all.reward[1] > 0 ? `$${(all.reward[0] / all.reward[1] * 3600).toFixed(2)}` : `---`,
                        ],
                        [`Pending`, object.recent.pending > 0 ? `${(object.recent.pending / 86400).toFixed(2)} days` : `---`],
                        [`Response`, object.recent.comm[1] > 0 ? `${Math.round(object.recent.comm[0] / object.recent.comm[1] * 100)}% of ${object.recent.comm[1]}` : `---`],
                        [`Recommend`, object.recent.recommend[1] > 0 ? `${Math.round(object.recent.recommend[0] / object.recent.recommend[1] * 100)}% of ${to2.recent.recommend[1]}` : `---`],
                        [`Rejected`, object.recent.rejected[0]],
                        [`ToS`, object.recent.tos[0]],
                        [`Broken`, object.recent.broken[0]],
                    ]);
                } else {
                    template = `No Reviews`;
                }
                return `<div class="col-xs-4" style="width: 225px;"><h2><a class="text-primary" href="https://turkopticon.info/requesters/${hit.requester_id}" target="_blank">Turkopticon 2</a></h2>${template}<div><a href="https://turkopticon.info/reviews/new?name=${encodeURIComponent(hit.requester_name)}&rid=${hit.requester_id}" target="_blank">Review on TO2</a></div></div>`;
            }
            return ``;
        })(review.turkopticon2);

        for (const el of hitRows[i].getElementsByClassName(`expand-button`)) {
            const button = document.createElement(`button`);
            button.className = `btn btn-default btn-sm fa fa-user ${reviewClass ? reviewClass : ``}`;
            button.dataset.toggle = `popover`;
            button.style.marginRight = `5px`;
            button.addEventListener(`click`, (event) => {
                event.target.closest(`.desktop-row`).click();
            });

            const script = document.createElement(`script`);
            script.textContent = `$(document.currentScript).parent().popover({ html: true, trigger: 'hover focus', title: '${hit.requester_name} [${hit.requester_id}]', content: '<div class="container">${turkerview + turkopticon + turkopticon2}</div>' });`;
            button.appendChild(script);

            el.parentElement.insertBefore(button, el);
            el.style.display = `none`;
        }
    }

    const style = document.createElement(`style`);
    style.innerHTML = `.popover { max-width: 1000px; }`;
    document.head.appendChild(style);
})(`requesterReviews`);

(async (fnName) => {
    await ready({ enabled: fnName, document: `interactive`, matches: [`/projects/*/tasks/*`] });

    const workspace = document.getElementsByClassName(`task-question-iframe-container`)[0];
    workspace.style.height = `100vh`;
    workspace.children[0].focus();
    workspace.scrollIntoView();
})(`workspaceExpander`);

(async (fnName) => {
    const react = await require(`reactComponents/common/CopyText`);

    chrome.storage.local.set({
        workerID: react.reactProps.textToCopy
    });
})(`workerID`);

async function hitMissed(hit_set_id) {
    console.log(`go`)
    await ready({ document: `complete` });
    const react = await require(`reactComponents/alert/Alert`);

    const once = document.createElement(`button`);
    once.className = `btn btn-primary`;
    once.textContent = `Once`;
    once.style.marginLeft = `5px`;
    once.addEventListener(`click`, (event) => {
        chrome.runtime.sendMessage({
            hitCatcher: {
                id: hit_set_id, 
                name: ``,
                once: true,
                sound: true
            }
        });
    });
    react.element.getElementsByTagName(`h3`)[0].appendChild(once);

    const panda = document.createElement(`button`);
    panda.className = `btn btn-primary`;
    panda.textContent = `Panda`;
    panda.style.marginLeft = `5px`;
    panda.addEventListener(`click`, (event) => {
        chrome.runtime.sendMessage({
            hitCatcher: {
                id: hit_set_id, 
                name: ``,
                once: false,
                sound: false
            }
        });
    });
    react.element.getElementsByTagName(`h3`)[0].appendChild(panda);
}

Object.assign(Number.prototype, {
    toMoneyString() {
        return `$${this.toFixed(2).toLocaleString(`en-US`, { minimumFractionDigits: 2 })}`;
    }
});

chrome.runtime.sendMessage({ hitCatcher: `loggedIn` });

(async (fnName) => {
    const react = await require(`reactComponents/common/CopyText`);

    chrome.storage.local.set({
        workerID: react.reactProps.textToCopy
    });
})(`workerID`);


(async (fnName) => {
    await ready({ enabled: fnName });
    
    const react = await require(`reactComponents/hitSetTable/HitSetTable`, `reactComponents/taskQueueTable/TaskQueueTable`);
    const reactProps = react.reactProps;

    const trackerCompareValues = reactProps.bodyData ? reactProps.bodyData.reduce((accumulator, currentValue) => {
        const project = currentValue.project || currentValue;

        for (const prop of [`requester_id`, `title`]) {
            if (!accumulator[prop]) {
                accumulator[prop] = [project[prop]];
            }
            else if (!accumulator[prop].includes(project[prop])) {
                accumulator[prop].push(project[prop]);
            }
        }

        return accumulator;
    }, {}) : [reactProps.modalOptions.contactRequesterUrl, reactProps.modalOptions.projectTitle];

    const counts = await sendMessage({
        function: `hitTrackerGetCounts`,
        arguments: trackerCompareValues
    });

    console.log(counts);
    
    function countPopover(counts) {
        let template = ``;
        
        for (const key in counts) {
            template += `<div class="row">${key}: ${counts[key]}</div>`
        }
            
        return template === `` ? `No Work Found` : template;
    }

    await ready ({ document: `complete` });

    const hitRows = react.element.getElementsByClassName(`table-row`);

    for (let i = 0; i < hitRows.length; i ++) {
        const hit = reactProps.bodyData[i].project || reactProps.bodyData[i];
        const trackerR = counts[hit.requester_id]; console.log(trackerR, hit.requester_id)
        const trackerT = counts[hit.title];

        const appR = trackerR.Paid || trackerR.Approved;
        const rejR = trackerR.Rejected;
        const lenR = Object.keys(trackerR).length;

        const requester = document.createElement(`span`);
        requester.className = `btn btn-sm fa ${appR ? `fa-check btn-success` : rejR ? `fa-exclamation btn-info` : `fa-${lenR ? `question` : `minus`} btn-secondary`}`;
        requester.style.marginRight = `5px`;

        const requesterScript = document.createElement(`script`);
        requesterScript.textContent = `$(document.currentScript).parent().popover({ html: true, trigger: 'hover', title: '${hit.requester_name} [${hit.requester_id}]', content: '<div class="container">${countPopover(trackerR)}</div>' });`;
        requester.appendChild(requesterScript);

        const requesterEl = hitRows[i].querySelector(`a[href^="/requesters/"]`);
        requesterEl.parentElement.insertBefore(requester, requesterEl);

        const appT = trackerT.Paid  || trackerT.Approved;
        const rejT = trackerT.Rejected;
        const lenT = Object.keys(trackerT).length;
        
        const title = document.createElement(`span`);
        title.className = `btn btn-sm fa ${appT ? `fa-check btn-success` : rejT ? `fa-exclamation btn-info` : `fa-${lenT ? `question` : `minus`} btn-secondary`}`;
        title.style.marginRight = `5px`;
        
        const titleScript = document.createElement(`script`);
        titleScript.textContent = `$(document.currentScript).parent().popover({ html: true, trigger: 'hover', title: '${hit.title}', content: '<div class="container">${countPopover(trackerT)}</div>' });`;
        title.appendChild(titleScript);

        const titleEl = hitRows[i].getElementsByClassName(`project-name-column`)[0].lastChild;
        titleEl.parentElement.insertBefore(title, titleEl)
    }
    
    const style = document.createElement(`style`);
    style.innerHTML = `.popover { max-width: 1000px; }`;
    document.head.appendChild(style);
})(`hitTracker`);