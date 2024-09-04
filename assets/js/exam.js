const checkIfCheckboxChecked=() => {
    let prevChecked=JSON.parse(localStorage.getItem("selectedAnswers")||"[]");
    isExists=false;
    prevChecked.forEach(function (checkbox) {
        if (checkbox.id===localStorage.getItem('currentQuesId')) {
            $("input[value='"+checkbox.choice+"']").prop('checked', true);
            checkbox.opened=1;
            isExists=true;
            if (checkbox.review===1) {
                $('#reviewBtn').prop('disabled', true);
                $(`button[value="${checkbox.id}"]`).prop('class', 'btn btn-circle m-1 reviewques');
            } else if (checkbox.skip===1) {
                $('#reviewBtn').prop('disabled', true);
                $(`button[value="${checkbox.id}"]`).prop('class', 'btn btn-circle m-1 skipques');
            } else if (checkbox.opened===1&&checkbox.choice==="") {
                $('#reviewBtn').prop('disabled', false);
                $(`button[value="${checkbox.id}"]`).prop('class', 'btn btn-circle m-1 unanswered');
            } else {
                $('#reviewBtn').prop('disabled', false);
                $('#reviewBtn').attr('onClick', 'reviewLater()');
                $('#reviewBtn').text('Review');
                $(`button[value="${checkbox.id}"]`).prop('class', 'btn btn-circle m-1 answered');
            }
        } else {
            $('#reviewBtn').prop('disabled', false);
        }
    });
    if (!isExists) {
        let answer={
            id: localStorage.getItem('currentQuesId'),
            choice: "",
            review: 0,
            skip: 0,
            opened: 1
        };
        prevChecked.push(answer)
        $(`button[value="${answer.id}"]`).prop('class', 'btn btn-circle m-1 unanswered');
        localStorage.setItem("selectedAnswers", JSON.stringify(prevChecked));
    }
    $(`button[value="${localStorage.getItem('currentQuesId')}"]`).addClass("activeques");
}
//button
function buttonclick(e) {
    window.speechSynthesis.cancel();
    $('#reviewBtn').attr('onClick', 'skip()');
    $('#reviewBtn').text('Skip');
    $("button").removeClass("activeques")
    $(e).addClass("activeques");
    // check for last question
    if ($(e).next().length>0) {
        $('#nextBtn').attr('onClick', 'saveandnext()');
        $('#nextBtn').text('Save & next');
    } else {
        $('#nextBtn').attr('onClick', 'submittest()');
        $('#nextBtn').text('Submit');
    }
    fetch(`/question?s=${e.value}`, {
        method: "GET"
    })
        .then((response) => response.json())
        .then((data) => {
            $('input[type="checkbox"]').prop('checked', false);
            // console.log(data) 
            localStorage.setItem('currentQuesId', data.questions.questionId);

            document.getElementById('option1').value=data.questions.options[0]
            document.getElementById('option2').value=data.questions.options[1]
            document.getElementById('option3').value=data.questions.options[2]
            document.getElementById('option4').value=data.questions.options[3]
            $('#optionEditor1').html(data.questions.options[0])
            $('#optionEditor2').html(data.questions.options[1])
            $('#optionEditor3').html(data.questions.options[2])
            $('#optionEditor4').html(data.questions.options[3])
            //question
            $('#editorDisplay').html(data.questions.question)
            //
            checkIfCheckboxChecked();

        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

//
function onlyOne(e) {
    $('input[type="checkbox"]').not(e).prop('checked', false);
    $('#reviewBtn').prop('disabled', false);
    $('#reviewBtn').attr('onClick', 'reviewLater()');
    $('#reviewBtn').text('Review');
    let selectedAnswers=JSON.parse(localStorage.getItem("selectedAnswers")||"[]");
    const currentQuesId=localStorage.getItem('currentQuesId')

    const removeObj=() => {
        const findIndex=selectedAnswers.findIndex(a => a.id===currentQuesId)
        findIndex!==-1&&selectedAnswers.splice(findIndex, 1)
    }
    if (e.checked) {
        var answer={
            id: localStorage.getItem('currentQuesId'),
            choice: e.value||"",
            review: 0,
            skip: 0,
            opened: 1
        };
        $(`button[value="${currentQuesId}"]`).prop('class', 'btn btn-circle m-1 answered activeques');
        removeObj();
        selectedAnswers.push(answer);
    } else {
        var answer={
            id: localStorage.getItem('currentQuesId'),
            choice: "",
            review: 0,
            skip: 0,
            opened: 1
        };
        $('#reviewBtn').prop('disabled', false);
        $('#reviewBtn').attr('onClick', 'skip()');
        $('#reviewBtn').text('Skip');
        removeObj();
        selectedAnswers.push(answer);
        $(`button[value="${localStorage.getItem('currentQuesId')}"]`).prop('class', 'btn btn-circle m-1 unanswered activeques');
        // $(`button[value="${localStorage.getItem('currentQuesId')}"]`).addClass("unanswered");
        // document.querySelector(`button[value="${localStorage.getItem('currentQuesId')}"]`).style.backgroundColor = '#F7B2B2';
    }
    localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));
}