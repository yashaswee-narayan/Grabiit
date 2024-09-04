function showHideColour(id)
{
    var subjects = document.querySelectorAll('.size:not(.'+id+')');
    var subject = document.querySelector('.'+id+'.size');
    [].forEach.call(subjects, function(el) {
        el.classList.remove("round-corner") ;
        el.classList.remove("colour-changer") ;
    });
    
    subject.classList.toggle("round-corner");
    subject.classList.toggle("colour-changer");
}
function showHideSubTopics(params)
{
    
    var topics = document.querySelectorAll('.view-topic-1:not(.'+params+')');
    var itemDrop = document.querySelector('.'+params+'.view-topic-1');
    
    [].forEach.call(topics, function(el) {
        el.classList.remove("show") ;
    });
    itemDrop.classList.toggle("show");

    
}

