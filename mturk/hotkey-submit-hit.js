function submitHIT() {
  window.addEventListener(`keydown`, event => {
    event.preventDefault();
    if(event.ctrlKey && event.key == `Enter`) {
        console.log("caught")

        var mturk_form = document.querySelector("#mturk_form")

        if(mturk_form)
        {
            mturk_form.submit()
            //$("#iFrame").contents().find("#someDiv")
        }
        else(console.log("-nothing-"))
    }
    else {
        console.log("eek")
    }

   });
}

submitHIT();