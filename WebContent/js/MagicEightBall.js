/**
 *
 */
var answers = ["It is certain",
   "It is decidedly so",
   "Without a doubt",
   "Yes definitely",
   "You may rely on it",
   "As I see it, yes",
   "Most likely",
   "Outlook good",
   "Yes", "Signs point to yes",
   "Don't count on it",
   "My reply is no",
   "My sources say no",
   "Outlook not so good",
   "Very doubtful", "Reply hazy, try again",
   "Ask again later",
   "Better not tell you now",
   "Cannot predict now",
   "Concentrate and ask again"];

window.onload = function() {
   var eightBallNumber = document.getElementById("eightBallNumber");
   var eightBallAnswer = document.getElementById("eightBallAnswer");
   var eightBallInner = document.getElementById("eightBallInner");
   var eightBall = document.getElementById("eightBall");
   var askQuestion = document.getElementById("askQuestion");
   var questionButton = document.getElementById("questionButton");
   var resetButton = document.getElementById("resetButton");
   var info = document.getElementById("info");


   questionButton.addEventListener("click", function() {
      if (askQuestion.value.length < 1) {
         console.log('Question not entered');
         //alert('Please Enter a Question');
         createDialog();
      } else if (eightBallNumber.innerText != 8 || eightBallAnswer.innerText != "") {
         eightBallAnswer.innerText = "";
         console.log("Reset 8 Ball");
         $('html, body').animate({
            scrollTop: $(askQuestion).offset().top
         }, 1000);
         $(eightBall).effect("shake", { times: 4 }, 1000);
         setTimeout(() => {
            eightBallNumber.innerText = "";
           $(eightBallInner).removeClass("innerInitial");
           $(eightBallInner).addClass("innerFinish");
            eightBallNumber
            var num = Math.floor(Math.random() * Math.floor(answers.length));
            eightBallAnswer.innerText = answers[num];
            console.log("Answer: " + eightBallAnswer.innerText);
         }, 1000)
      } else {
         $('html, body').animate({
            scrollTop: $(askQuestion).offset().top
         }, 1000);
         $(eightBall).effect("shake", { times: 4 }, 1000);
         setTimeout(() => {
            eightBallNumber.innerText = "";
            eightBallNumber
            $(triangle).removeClass("hidden");
            $(eightBallInner).removeClass("innerInitial");
           $(eightBallInner).addClass("innerFinish");
            var num = Math.floor(Math.random() * Math.floor(answers.length));
            eightBallAnswer.innerText = answers[num];
            console.log("Answer: " + eightBallAnswer.innerText);
         }, 1000)

      }
   });

   resetButton.addEventListener("click", function() {
      if (eightBallNumber.innerText != 8 || eightBallAnswer.innerText != "") {
         eightBallAnswer.innerText = "";
         eightBallNumber.innerText = "8";
         askQuestion.value = "";
         $(eightBallInner).removeClass("innerFinish");
           $(eightBallInner).addClass("innerInitial");
         $(triangle).addClass("hidden");
         console.log("Reset 8 Ball");

      } else {
         askQuestion.value = "";
         console.log("Cleared Question");
      }

   })

   askQuestion.addEventListener("click", function() {
      if (eightBallNumber.innerText != 8 || eightBallAnswer.innerText != "") {
         eightBallAnswer.innerText = "";
         eightBallNumber.innerText = "8";
         askQuestion.value = "";
         $(eightBallInner).removeClass("innerFinish");
           $(eightBallInner).addClass("innerInitial");
         $(triangle).addClass("hidden");
         console.log("Reset 8 Ball");
      }

   })

   function createDialog() {
      let self = this;
      let message = 'Please Enter a Question and Try Again';
      $('<div id = dialog> ' + message + ' </div>').dialog({
         title: 'No Question Entered',
         autoOpen: true,
         modal: true,
         width: 400,
         resizable: false,
         draggable: false,
         buttons: {
            'Ok': {
               text: 'Ok',
               'class': 'dialogButton',
               'id': 'confim',
               click: function() {
                  $(this).dialog('destroy');
               }
            }
         }
      });
   }
   
};