var qvalues = new Array(); // used as dictionary
var qtriggers = new Array();

function dep_check(expr) {
    var exprs = expr.split(",",2);
    var qnum = exprs[0];
    var value = exprs[1];
    var qvalue = qvalues[qnum];
    if(value.substring(0,1) == "!") {
      var multiple_option = qvalues[qnum+'_'+value.substring(1)];
      if(multiple_option != undefined)
        return !multiple_option;
      value = value.substring(1);
      return qvalue != value;
    }
    if(value.substring(0,1) == "<") {
      qvalue = parseInt(qvalue);
      if(value.substring(1,2) == "=") {
        value = parseInt(value.substring(2));
        return qvalue <= value;
      }
      value = parseInt(value.substring(1));
      return qvalue < value;
    }
    if(value.substring(0,1) == ">") {
      qvalue = parseInt(qvalue);
      if(value.substring(1,2) == "=") {
        value = parseInt(value.substring(2));
        return qvalue >= value;
      }
      value = parseInt(value.substring(1));
      return qvalue > value;
    }
    var multiple_option = qvalues[qnum+'_'+value];
    if(multiple_option != undefined) {
      return multiple_option;
    }
    if(qvalues[qnum] == value) {
      return true;
    }
    return false;
}

function getChecksAttr(obj) {
    /* while most browser consider getAttributes a function, IE 9< considers it a object
     * So its actually better to use jquery for this
    return obj.getAttribute('checks'); */
    var $obj = $(obj);
    return $obj.attr('checks');
}

function statusChanged(obj, res) {
    if(obj.tagName == 'DIV') {
        obj.style.display = !res ? 'none' : 'block';
        return;
    }
    //obj.style.backgroundColor = !res ? "#eee" : "#fff";
    obj.disabled = !res;
}

function valchanged(qnum, value) {
    if (!(typeof bool_container === 'undefined')) {
        var clean = qnum.replace('question_','').replace(/(\\)/g, '');
        // We have to get the question
        var the_question = $('#question_'+clean.split('_')[0].replace(/(\.)/g,'')).text().trim(); 
        if(value==true){

            bool_container.push(clean.replace('_','. ')+' ('+the_question+')');
        } else if(value==false){
            bool_container.splice(clean.replace('_','. ')+' ('+the_question+')');
        } else {
            bool_container.push(clean.replace('_','')+'. '+the_question+'');        }
    }    

    qvalues[qnum] = value;
    // qnum may be 'X_Y' for option Y of multiple choice question X
    qnum = qnum.split('_')[0];
    for (var t in qtriggers) {
        t = qtriggers[t];
        checks = getChecksAttr(t);
        var res = eval(checks);
        statusChanged(t, res)
    }
}

function addtrigger(elemid) {
    var elem = document.getElementById(elemid);
    //console.log(elemid + " : " + elem + " : "+document.getElementById(elemid));
    if(!elem) {
      console.error("addtrigger: Element with id "+elemid+" not found.");
      return;
    }
    qtriggers[qtriggers.length] = elem;
}

function clear_selection(question_name, response){
    $(":radio[name='" + question_name + "']").prop('checked', false);
    if (!(typeof bool_container === 'undefined')) {
            console.log(response);
            bool_container.splice(response);
    
    }        
    
}

/* 
 - disable the submit button once it's been clicked 
 - do it for a total of 5 seconds by which time the page should've been sent
 - oscillate the sending class which does some fancy css transition trickery
*/
(function($){
    $(document).ready(function() {
        $('#qform').submit(function() {

            var input = $('.questionset-submit input');
            var interval = 400; // ms
            var duration = 10000; // 10s

            var disable = function(){
                input.attr('disabled', 'disabled');
                input.toggleClass('sending', false);
            };

            var enable = function(){
                $('body').css({'cursor':'auto'});
                input.removeAttr('disabled');  
            };

            var step = 0; 
            var animate = function() {
                // re-enable the button after the duration
                if (interval * step > duration) {
                    clearInterval(id);
                    enable();
                }
                    
                step += 1;
                input.toggleClass('sending');
            };
            
            // start animating before disabling as it looks nicer
            animate();
            disable();

            // id is availabe in the animate method. js closures ftw!
            var id = setInterval(animate, interval);
        });
    });
})(jQuery);
