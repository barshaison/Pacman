window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);


var dic={}; //dictionary [user name -> password]
dic["a"]="a";
dic["test2017"]="test2017";

var canvas;
var context;
var shape=new Object();
var ghost = new Object();
var ghost2 = new Object();
var ghost3 = new Object();
var movingPoint = new Object();
var stopDrawMovingPoint;
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var lblScore;
var lblName;
var lblTime;
var lblLives;
var keysDown;
var direction="right";
var prevDirection = "right";
var prevChosenJ =30;
var prevChosenI = 30;
var prevChosenJ2 =30;
var prevChosenI2 = 30;
var prevChosenJ3 =30;
var prevChosenI3 = 30;
var prevChosenIp = 30;
var prevChosenJp = 30;
var ghostSlow = 1;
var freePointsMap = {points:[]}; //keeps available points in the maze
var img;
var ghostGarbage;
var bluGohst;
var gameTime;
var brik;
var numOfGhosts;
var fifty;
var hurt;
var song;
var watch;

$( document ).ready(function() {
    canvas=document.getElementById("canvas");
    context=canvas.getContext("2d");
    lblScore = document.getElementById("lblScore");
    lblTime = document.getElementById("lblTime");
    lblName = document.getElementById("lblName");
    lblLives = document.getElementById("lblLives");
    img = document.getElementById("ghost");
    brik = document.getElementById("brik");
    ghostGarbage = document.getElementById("ghost2");
    bluGohst = document.getElementById("ghost3");
    fifty = document.getElementById("50Point");
    hurt= document.getElementById("hurt");
    song = document.getElementById("song");
    watch= document.getElementById("watch");

});




//tab handler
function openTab(evt, optionName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
//var gameContent = document.getElementById("Game");
   //gameContent.style.display ="none";
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    window.clearInterval(interval); ///??????????????
    song.pause();
    song.currentTime=0;

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(optionName).style.display = "block";

    // evt.currentTarget.className += " active";

    var name =optionName+"_tab";
    document.getElementById(name).className+=" active";

}

function openAboutDialog(){
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Get the modal
    var modal = document.getElementById('About');

// Get the button that opens the modal
    var btn = document.getElementById("About_tab");

// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal

        modal.style.display = "block";

    var name ="About_tab";
    document.getElementById(name).className+=" active";

// When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        Welcome();
    }

// When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            Welcome();
        }
    }
}
//show welcome tab on load
function Welcome(){
    document.getElementById('Welcome').style.display = "block";
    var name ="Welcome_tab";
    document.getElementById(name).className+=" active";
}

if(window.addEventListener){
    window.addEventListener('load',Welcome,false); //W3C
}
else{
    window.attachEvent('onload',Welcome); //IE
}

//Registration submit validations

$(document).ready(function() {
    $( "form" ).submit(function( event ) {
        // check all fields not empty
        if ( $( "#username" ).val() == "" ||  $( "#password" ).val() == "" || $( "#firstName" ).val() == "" ||
            $( "#lastName" ).val() == "" || $( "#email" ).val() == "" ||  $( "#birthday" ).val() == "") {
            event.preventDefault();
            window.alert("All fields must be filled!");
        }
        //check password contains both nums and letters
        else if(!isContainsNumsAndLetters($( "#password" ).val())){
            event.preventDefault();
            window.alert("Password must contain both numbers and letters!");

        }
        //check password at least 8 chars
        else if($( "#password" ).val().length < 8){
            event.preventDefault();
            window.alert("Password must contain at least 8 characters !");
        }
        //validate that first and last name dont contain nums
        else if(/\d/.test($( "#firstName" ).val())  ){
            event.preventDefault();
            window.alert("First name mustn't contain numbers !");
        }
        else if(/\d/.test($( "#lastName" ).val())){
            event.preventDefault();
            window.alert("Last name mustn't contain numbers !");
        }
        else if(isUserNameExists( $( "#username" ).val())){
            window.alert("Username already exists!!")

        }
        //all fields are valid -> enter to dictionary
        else{
            dic[$( "#username" ).val()] = $( "#password" ).val();
            openTab(event, 'Login');
        }

    });
});

function isUserNameExists(userName){
    for(key in dic){
        if(key == userName){
            return true;
        }
    }
    return false;
}
function isContainsNumsAndLetters(st){
    if (st.match(/[a-z]/i) && /\d/.test(st)) {
        return true;
    }
    else{
        return false;
    }
}

//login handler
var userName;
function handle_submit(){

     userName = document.getElementById("usr_name").value;
    var password = document.getElementById("pass").value;
    var tablinks;

    if(dic[userName]== password){
        document.getElementById("Login").style.display="none";
        //document.getElementById("Game").style.display = "block";
        document.getElementById("GameDetails").style.display = "block";
        //remove link background color
        tablinks = document.getElementsByClassName("tablinks");
        for (var i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        //Start();
    }else{
        window.alert("Wrong credentials");
    }

}

function gameStartHandler(){
    document.getElementById("GameDetails").style.display = "none";
    document.getElementById("Game").style.display = "block";
    scrollWin();
    Start();
}

//chacks if a certain ponit is available
function isInFreePointsMap(y,x){
    for(var i =0; i <freePointsMap.points.length; i+=2){
        if(freePointsMap.points[i] == y && freePointsMap.points[i+1] == x){
            return true;
        }
    }
    return false;
}
//construct the free points map
function createFreePointsMap(){
    var index=0;
    for (var i = 0; i < 20; i++){
        for (var j = 0; j < 20; j++){
            /*if((j==0 && i == 1) || (j==0 && i == 18) || (j==1 && i >=1 && i <= 8) || (j==1 && i == 11) || (j==1 && i == 14) || (j==1 && i == 18) || (j>=2 && j<=3 && i == 1) || (j>=2 && j<=3 && i == 11) || (j==3 && i>=9 && i<=10) || (j==5 && i==0) ||
                (i==1 && j>=5 && j<=7) || (j==3 && i>=9 && i<=10) || (j==4 && i>=3 && i<=6)|| (j==5 && i>=10 && i<=14)||
                (j==5 && i>=16 && i<=18) || (j==7 && i>=3 && i<=9)|| (j==7 && i>=10 && i<=18) || (j==9 && i>=5 && i<=9) ||
                (j==9 && i>=11 && i<=12) || (j==11 && i>=11 && i<=18) || (j==14 && i>=1 && i<=3) || (j==13 && i>=11 && i<=14) ||
                (j==15 && i>=11 && i<=14) || (j==3 && i>=9 && i<=10) || (j==16 && i>=1 && i<=5) || (j==16 && i>=7 && i<=9) ||
                (j==18 && i>=1 && i<=10) || (j==18 && i>=12 && i<=18) || (i==14 && j>=2 && j<=4) || (i==16 && j>=2 && j<=4) ||
                (i==5 && j>=5 && j<=6) || (i==8 && j>=5 && j<=6) || (i==3 && j>=8 && j<=10) || (i==15 && j>=8 && j<=10) ||
                (i==18 && j>=8 && j<=9) || (i==18 && j>=12 && j<=17) || (i==1 && j>=11 && j<=13) || (i==5 && j>=10 && j<=15) || (i==7 && j>=11 && j<=15) || (i==9 && j>=10 && j<=15) || (i==3 && j>=12 && j<=13) || (i==12 && j>=16 && j<=17) ||
                (i==16 && j>=14 && j<=15) || (i==1 && j==17) || (i==14 && j==14))*/
            if((j>=1 && j<=2 && i>=1 && i<=3) || (j>=1 && j<=2 && i>=5 && i<=7) || (j>=1 && j<=2 && i>=11 && i<=13) || (j>=1 && j<=2 && i>=15 && i<=18) ||
                (j>=0 && j<=2 && i==9) || (j==4 && i>=1 && i<=3) || (j==4 && i>=15 && i<=18) ||(j>=6 && j<=8 && i>=1 && i<=3) || (j>=6 && j<=8 && i>=15 && i<=18) ||
                (j>=10 && j<=12 && i>=1 && i<=3) || (j>=10 && j<=12 && i>=15 && i<=18) || (j>=8 && j<=10 && i>=7 && i<=11) || (j==18 && i>=1 && i<=7) ||
                (j==18 && i>=11 && i<=13) || (j==18 && i>=15 && i<=18) || (j==16 && i>=0 && i<=1) || (j==16 && i>=7 && i<=11) || (j==16 && i>=17 && i<=18) ||
                (j==14 && i>=1 && i<=3) || (j==14 && i>=5 && i<=7) || (j==14 && i>=11 && i<=13) || (j==14 && i>=15 && i<=18) || (j==12 && i>=7 && i<=11) ||
                (j==4 && i>=7 && i<=11) || (j==6 && i>=6 && i<=7) || (j==6 && i>=11 && i<=12) || (i==3 && j>=15 && j<=16) || (i==15 && j>=15 && j<=16) ||
                (i==5 && j>=16 && j<=17) || (i==5 && j>=10 && j<=12) || (i==5 && j>=4 && j<=8) || (i==9 && j>=5 && j<=6) || (i==9 && j>=13 && j<=14) ||
                (i==9 && j>=17 && j<=18) || (i==13 && j>=4 && j<=8) || (i==13 && j>=10 && j<=12) || (i==13 && j>=16 && j<=17) )
            {
                if(i==9 && j==8){

                }
                else if(i==9 && j==10){

                }
                else{
                    continue;
                }

            }
            else{
                freePointsMap.points[index] = j;
                freePointsMap.points[index + 1] = i;
                index+=2;
            }
        }
    }
}
/* //not in use right know but may be useful later
function tryGoUp(){
    if(ghost.j>0 && board[ghost.i][ghost.j-1]!=4){
        ghost.j--;
    }
}
function tryGoDown(){
    if(ghost.j<19 && board[ghost.i][ghost.j+1]!=4){
        ghost.j++;
    }
}
function tryGoLeft(){
    if(ghost.i>0 && board[ghost.i-1][ghost.j]!=4) {
        ghost.i--;
    }
}
function tryGoRight(){
    if(ghost.i<19 && board[ghost.i+1][ghost.j]!=4){
        ghost.i++;
    }
}*/
function sleep(miliseconds) {
    var currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime()) {
    }
}

//main function of the game
var remainningLives;

var img = document.getElementById("ghost");
var foodAmount;

function Start() {
    window.clearInterval(interval);
    song.pause();
    song.currentTime = 0;
    stopDrawMovingPoint = 0;
    remainningLives = 3;
    lblName.value = userName;
    board = new Array();
    score = 0;
    pac_color="yellow";
    //var cnt = 400;
    gameTime = document.getElementById("timeChoice").value;
    var food_remain = document.getElementById("foodChoice").value;
    numOfGhosts = document.getElementById("ghostChoise").value;
    var fiveFood = Math.floor(0.6 * food_remain);
    var fifteenFood = Math.floor(0.3 * food_remain);
    var twentyFiveFood = Math.floor(0.1 * food_remain);
    foodAmount = fiveFood + fifteenFood + twentyFiveFood;
    var pacman_remain = 1;
    start_time= new Date();
    song.play();

    createFreePointsMap();

    for (var i = 0; i < 20; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < 20; j++) {
            //if((i==3 && j==3)||(i==3 && j==4)||(i==3 && j==5)||(i==6 && j==1)||(i==6 && j==2))
            /*if((j==0 && i == 1) || (j==0 && i == 18) || (j==1 && i >=1 && i <= 8) || (j==1 && i == 11) || (j==1 && i == 14) || (j==1 && i == 18) || (j>=2 && j<=3 && i == 1) || (j>=2 && j<=3 && i == 11) || (j==3 && i>=9 && i<=10) || (j==5 && i==0) ||
                (i==1 && j>=5 && j<=7) || (j==3 && i>=9 && i<=10) || (j==4 && i>=3 && i<=6)|| (j==5 && i>=10 && i<=14)||
                (j==5 && i>=16 && i<=18) || (j==7 && i>=3 && i<=9)|| (j==7 && i>=10 && i<=18) || (j==9 && i>=5 && i<=9) ||
                (j==9 && i>=11 && i<=12) || (j==11 && i>=11 && i<=18) || (j==14 && i>=1 && i<=3) || (j==13 && i>=11 && i<=14) ||
                (j==15 && i>=11 && i<=14) || (j==3 && i>=9 && i<=10) || (j==16 && i>=1 && i<=5) || (j==16 && i>=7 && i<=9) ||
                (j==18 && i>=1 && i<=10) || (j==18 && i>=12 && i<=18) || (i==14 && j>=2 && j<=4) || (i==16 && j>=2 && j<=4) ||
                (i==5 && j>=5 && j<=6) || (i==8 && j>=5 && j<=6) || (i==3 && j>=8 && j<=10) || (i==15 && j>=8 && j<=10) ||
                (i==18 && j>=8 && j<=9) || (i==18 && j>=12 && j<=17) || (i==1 && j>=11 && j<=13) || (i==5 && j>=10 && j<=15) || (i==7 && j>=11 && j<=15) || (i==9 && j>=10 && j<=15) || (i==3 && j>=12 && j<=13) || (i==12 && j>=16 && j<=17) ||
                (i==16 && j>=14 && j<=15) || (i==1 && j==17) || (i==14 && j==14))*/
            if((j>=1 && j<=2 && i>=1 && i<=3) || (j>=1 && j<=2 && i>=5 && i<=7) || (j>=1 && j<=2 && i>=11 && i<=13) || (j>=1 && j<=2 && i>=15 && i<=18) ||
                (j>=0 && j<=2 && i==9) || (j==4 && i>=1 && i<=3) || (j==4 && i>=15 && i<=18) ||(j>=6 && j<=8 && i>=1 && i<=3) || (j>=6 && j<=8 && i>=15 && i<=18) ||
                (j>=10 && j<=12 && i>=1 && i<=3) || (j>=10 && j<=12 && i>=15 && i<=18) || (j>=8 && j<=10 && i>=7 && i<=11) || (j==18 && i>=1 && i<=7) ||
                (j==18 && i>=11 && i<=13) || (j==18 && i>=15 && i<=18) || (j==16 && i>=0 && i<=1) || (j==16 && i>=7 && i<=11) || (j==16 && i>=17 && i<=18) ||
                (j==14 && i>=1 && i<=3) || (j==14 && i>=5 && i<=7) || (j==14 && i>=11 && i<=13) || (j==14 && i>=15 && i<=18) || (j==12 && i>=7 && i<=11) ||
                (j==4 && i>=7 && i<=11) || (j==6 && i>=6 && i<=7) || (j==6 && i>=11 && i<=12) || (i==3 && j>=15 && j<=16) || (i==15 && j>=15 && j<=16) ||
                (i==5 && j>=16 && j<=17) || (i==5 && j>=10 && j<=12) || (i==5 && j>=4 && j<=8) || (i==9 && j>=5 && j<=6) || (i==9 && j>=13 && j<=14) ||
                (i==9 && j>=17 && j<=18) || (i==13 && j>=4 && j<=8) || (i==13 && j>=10 && j<=12) || (i==13 && j>=16 && j<=17) )
            {
                if(i==9 && j==8){

                    board[i][j] = 69;
                }
                else if(i==9 && j==10){
                    board[i][j] = 88;
                }
                else{
                    board[i][j] = 4;
                }

            }
            else if(j==0 &&i== 19){
                ghost.i = i;
                ghost.j = j;
                board[i][j] = 7;

            }
            else if(numOfGhosts >=2 && j==19 && i==0){
                ghost2.i = i;
                ghost2.j = j;
                board[i][j] = 72;
            }
            else if(numOfGhosts ==3 && j==0 && i==0){
                ghost3.i = i;
                ghost3.j = j;
                board[i][j] = 73;
            }

            else if(j==19 && i==19){
                 movingPoint.i = i;
                 movingPoint.j =j;
                board[i][j] = 50;
            }
            else{
               /* var randomNum = Math.random();
                if (randomNum <= 1.0 * food_remain / cnt) {
                    food_remain--;
                    board[i][j] = 1;
                } else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
                    shape.i=i;
                    shape.j=j;
                    pacman_remain--;
                    board[i][j] = 2;
                } else {*/
                    board[i][j] = 0;
               // }
                //cnt--;
            }
        }

    }
    //place pacman
    var emptyCell = findRandomEmptyCell(board);
    //not to place pacman where ghosts
    while(((emptyCell[0] == 0) && (emptyCell[1] == 0)) || ((emptyCell[0] == 19) && (emptyCell[1] == 0)) || ((emptyCell[0] == 0) && (emptyCell[1] == 19)) ||((emptyCell[0] == 19) && (emptyCell[1] == 19))){
        emptyCell = findRandomEmptyCell(board);
    }
    board[emptyCell[0]][emptyCell[1]] = 2;
    shape.i=emptyCell[0];
    shape.j=emptyCell[1];

    while(food_remain>0){ // place food
        var emptyCell = findRandomEmptyCell(board);
        if(fiveFood > 0){
            board[emptyCell[0]][emptyCell[1]] = 5;
            fiveFood--;
            food_remain--;
            continue;
        }
        if(fifteenFood > 0){
            board[emptyCell[0]][emptyCell[1]] = 15;
            fifteenFood--;
            food_remain--;
            continue;
        }
        if(twentyFiveFood > 0){
            board[emptyCell[0]][emptyCell[1]] = 25;
            twentyFiveFood--;
            food_remain--;
            continue;
        }
    }
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);
    interval=setInterval(UpdatePosition, 100);
}


function findRandomEmptyCell(board){
    var i = Math.floor((Math.random() * 19) + 1);
    var j = Math.floor((Math.random() * 19) + 1);
    while(board[i][j]!=0)
    {
        i = Math.floor((Math.random() * 19) + 1);
        j = Math.floor((Math.random() * 19) + 1);
    }
    return [i,j];
}

function GetKeyPressed() {
    if (keysDown[38]) {
        direction = "up";
        return 1;
    }
    if (keysDown[40]) {
        direction = "down";
        return 2;
    }
    if (keysDown[37]) {
        prevDirection = "left";
        direction = "left";
        return 3;
    }
    if (keysDown[39]) {
        direction = "right";
        prevDirection = "right";
        return 4;
    }
}

function Draw() {
    canvas.width=canvas.width; //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    lblLives.value = remainningLives;
    for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 20; j++) {
            var center = new Object();
            center.x = i * 30 + 15;
            center.y = j * 30 + 15;
            if (board[i][j] == 2) {
                if(direction=="right"){
                    // An arc which goes from 36 degrees to 324 degrees to draw Pacman's head
                    context.beginPath();
                    context.arc(center.x, center.y, 15, 0.2 * Math.PI, 1.8 * Math.PI);

                    // The line leading back to the center and then closing the path to finish the
                    // open mouth
                    context.lineTo(center.x, center.y);
                    context.closePath();

                    // Fill pacman's head yellow
                    context.fillStyle = pac_color;
                    context.fill();

                    // Outline the head
                    context.strokeStyle = '#000';
                    context.stroke();

                    // A circle for the eye
                    context.beginPath();
                    context.arc(center.x + 2.5, center.y - 7.5, 2.5, 0, 2 * Math.PI);
                    context.fillStyle = "#000";
                    context.fill();

                    // Outline the eye
                    context.strokeStyle = '#000';
                    context.stroke();
                }
                if(direction=="left"){
                    // An arc which goes from 36 degrees to 324 degrees to draw Pacman's head
                    context.beginPath();
                    context.arc(center.x, center.y, 15, 0.8 * Math.PI, 1.2 * Math.PI,true);

                    // The line leading back to the center and then closing the path to finish the
                    // open mouth
                    context.lineTo(center.x, center.y);
                    context.closePath();

                    // Fill pacman's head yellow
                    context.fillStyle = pac_color;
                    context.fill();

                    // Outline the head
                    context.strokeStyle = '#000';
                    context.stroke();

                    // A circle for the eye
                    context.beginPath();
                    context.arc(center.x , center.y - 7.5, 2.5, 0, 2 * Math.PI);
                    context.fillStyle = "#000";
                    context.fill();

                    /* // Outline the eye
                     context.strokeStyle = '#000';*/
                    context.stroke();
                }
                if(prevDirection == "right" && direction == "up"){
                    // An arc which goes from 36 degrees to 324 degrees to draw Pacman's head
                    context.beginPath();
                    context.arc(center.x, center.y, 15, 1.8 * Math.PI, 1.2 * Math.PI);

                    // The line leading back to the center and then closing the path to finish the
                    // open mouth
                    context.lineTo(center.x, center.y);
                    context.closePath();

                    // Fill pacman's head yellow
                    context.fillStyle = pac_color;
                    context.fill();

                    // Outline the head
                    context.strokeStyle = '#000';
                    context.stroke();

                    // A circle for the eye
                    context.beginPath();
                    context.arc(center.x -6, center.y + 1.5, 2.5, 0, 2 * Math.PI);
                    context.fillStyle = "#000";
                    context.fill();

                    /* // Outline the eye
                     context.strokeStyle = '#000';*/
                    context.stroke();
                }
                if(prevDirection == "left" && direction == "up"){
                    // An arc which goes from 36 degrees to 324 degrees to draw Pacman's head
                    context.beginPath();
                    context.arc(center.x, center.y, 15, 1.8 * Math.PI, 1.2 * Math.PI);

                    // The line leading back to the center and then closing the path to finish the
                    // open mouth
                    context.lineTo(center.x, center.y);
                    context.closePath();

                    // Fill pacman's head yellow
                    context.fillStyle = pac_color;
                    context.fill();

                    // Outline the head
                    context.strokeStyle = '#000';
                    context.stroke();

                    // A circle for the eye
                    context.beginPath();
                    context.arc(center.x + 10, center.y - 2.5, 2.5, 0, 2 * Math.PI);
                    context.fillStyle = "#000";
                    context.fill();

                    /* // Outline the eye
                     context.strokeStyle = '#000';*/
                    context.stroke();
                }
                if(prevDirection == "right" && direction == "down"){
                    // An arc which goes from 36 degrees to 324 degrees to draw Pacman's head
                    context.beginPath();
                    context.arc(center.x, center.y, 15, 0.2 * Math.PI, 0.8 * Math.PI,true);

                    // The line leading back to the center and then closing the path to finish the
                    // open mouth
                    context.lineTo(center.x, center.y);
                    context.closePath();

                    // Fill pacman's head yellow
                    context.fillStyle = pac_color;
                    context.fill();

                    // Outline the head
                    context.strokeStyle = '#000';
                    context.stroke();

                    // A circle for the eye
                    context.beginPath();
                    context.arc(center.x + 7.5, center.y-2.5, 2.5, 0, 2 * Math.PI);
                    context.fillStyle = "#000";
                    context.fill();

                    /* // Outline the eye
                     context.strokeStyle = '#000';*/
                    context.stroke();

                }
                if(prevDirection == "left" && direction == "down"){
                    // An arc which goes from 36 degrees to 324 degrees to draw Pacman's head
                    context.beginPath();
                    context.arc(center.x, center.y, 15, 0.2 * Math.PI, 0.8 * Math.PI,true);

                    // The line leading back to the center and then closing the path to finish the
                    // open mouth
                    context.lineTo(center.x, center.y);
                    context.closePath();

                    // Fill pacman's head yellow
                    context.fillStyle = pac_color;
                    context.fill();

                    // Outline the head
                    context.strokeStyle = '#000';
                    context.stroke();

                    // A circle for the eye
                    context.beginPath();
                    context.arc(center.x -6.5, center.y - 2.5, 2.5, 0, 2 * Math.PI);
                    context.fillStyle = "#000";
                    context.fill();

                    /* // Outline the eye
                     context.strokeStyle = '#000';*/
                    context.stroke();
                }
            } else if (board[i][j] == 5) { //food
                context.beginPath();
                context.arc(center.x, center.y, 7.5, 0, 2 * Math.PI); // circle
                context.fillStyle = "darkorange"; //color
                context.fill();
                context.beginPath();
                context.fillStyle = "white";
                context.fillText("5", center.x-2.5, center.y + 2.5);
                context.fill();
            }
            else if(board[i][j] == 15){ //food
                context.beginPath();
                context.arc(center.x, center.y, 7.5, 0, 2 * Math.PI); // circle
                context.fillStyle = "blue"; //color
                context.fill();
                context.beginPath();
                context.fillStyle = "white";
                context.fillText("15", center.x-6, center.y + 2.5);
                context.fill();
            }
            else if(board[i][j] == 25){ //food
                context.beginPath();
                context.arc(center.x, center.y, 7.5, 0, 2 * Math.PI); // circle
                context.fillStyle = "green"; //color
                context.fill();
                context.beginPath();
                context.fillStyle = "white";
                context.fillText("25", center.x-6, center.y + 2.5);
                context.fill();
            }
            else if (board[i][j] == 4) {
                /*context.beginPath();
                context.rect(center.x-15, center.y-15, 30, 30);

                context.fillStyle = "black"; //color
                context.fill();*/
                context.drawImage(brik,center.x-15, center.y-15, 30,30);

            }
            else if(board[i][j] == 7){ //ghost
                /*context.beginPath();
                context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
                context.fillStyle = "orange"; //color
                context.fill();*/
                context.drawImage(img,center.x-12, center.y-12, 30,30);


            }
            else if(board[i][j] == 72){ // ghost 2
                context.drawImage(ghostGarbage,center.x-14, center.y-15, 30,30);
            }
            else if(board[i][j] == 73){ // ghost 3
                context.drawImage(bluGohst,center.x-18, center.y-18, 42,42);
            }
            else if(board[i][j] == 50 /*&& stopDrawMovingPoint == 0*/){ // movingPoint
                context.drawImage(fifty,center.x-14, center.y-16, 28,28);
            }
            else if(board[i][j] == 69){ // hurt
                context.drawImage(hurt,center.x-10, center.y-10, 20,20);
            }
            else if(board[i][j] == 88){
                context.drawImage(watch,center.x-12, center.y-10, 27,27);
            }
        }
    }


}


var ghostPrev =0; // keeps what was on ghost's prev position --> for ghost not to eat food
var ghost2Prev =0;
var ghost3Prev =0;
var movingPointPrev = 0;
function UpdatePosition() {

    board[shape.i][shape.j]=0; //pacman's position before update
    board[ghost.i][ghost.j]=ghostPrev;
    if(stopDrawMovingPoint == 0){
        board[movingPoint.i][movingPoint.j] = movingPointPrev;
    }


    if(numOfGhosts == 3){
       // if(((ghost2.i != ghost3.i) || (ghost2.j != ghost3.j)) && ((ghost.i != ghost3.i) || (ghost.j != ghost3.j))){
            board[ghost3.i][ghost3.j]=ghost3Prev;
       // }

    }
    if(numOfGhosts >= 2){
       // if(((ghost2.i != ghost.i) || (ghost2.j != ghost.j))) {
            board[ghost2.i][ghost2.j] = ghost2Prev;
       // }
    }

    var x = GetKeyPressed()
    if(x==1)
    {
        if(shape.j>0 && board[shape.i][shape.j-1]!=4)
        {
            shape.j--;
        }
    }
    if(x==2)
    {
        if(shape.j<19 && board[shape.i][shape.j+1]!=4)
        {
            shape.j++;
        }
    }
    if(x==3)
    {
        if(shape.i>0 && board[shape.i-1][shape.j]!=4)
        {
            shape.i--;
        }
    }
    if(x==4)
    {
        if(shape.i<19 && board[shape.i+1][shape.j]!=4)
        {
            shape.i++;
        }
    }

    if(ghostSlow == 1){

//moving point logic
        var chance = Math.random();
        if(chance <= 0.25){
            if(isInFreePointsMap(movingPoint.j-1,movingPoint.i)){
                // prevChosenIp = movingPoint.i;
                // prevChosenJp = movingPoint.j;

                movingPoint.j--;

            }
        }
        if(chance > 0.25 && chance <= 0.5){
            if(isInFreePointsMap(movingPoint.j+1,movingPoint.i)){
                //prevChosenIp = movingPoint.i;
                // prevChosenJp = movingPoint.j;

                movingPoint.j++;

            }
        }
        if(chance > 0.5 && chance <= 0.75){
            if(isInFreePointsMap(movingPoint.j,movingPoint.i+1)){
                //prevChosenIp = movingPoint.i;
                //prevChosenJp = movingPoint.j;


                movingPoint.i++;

            }
        }
        if(chance>0.75){
            if(isInFreePointsMap(movingPoint.j,movingPoint.i-1)){
                //prevChosenIp = movingPoint.i;
                // prevChosenJp = movingPoint.j;
                movingPoint.i--;


            }
        }
        //end moving point logic
        //ghost logic-start

        //collect all ghost's near points that available
        var ghostArea = {"points":[]};
        var ind = 0;
        var isEnteredToifs = 0;
        if(((ghost.j+1) != prevChosenJ || ghost.i != prevChosenI) && isInFreePointsMap(ghost.j+1,ghost.i)){
            ghostArea.points[ind] = ghost.j+1;
            ind++;
            ghostArea.points[ind] =ghost.i;
            ind++;

            isEnteredToifs++;
        }
        if(((ghost.j-1) != prevChosenJ || ghost.i != prevChosenI) && isInFreePointsMap(ghost.j-1,ghost.i)){
            ghostArea.points[ind] = ghost.j-1;
            ind++;
            ghostArea.points[ind] =ghost.i;
            ind++;

            isEnteredToifs++
        }
        if(((ghost.j) != prevChosenJ || (ghost.i + 1) != prevChosenI) && isInFreePointsMap(ghost.j,ghost.i+1)){
            ghostArea.points[ind] = ghost.j;
            ind++;
            ghostArea.points[ind] =ghost.i+1;
            ind++;

            isEnteredToifs++
        }
        if(((ghost.j) != prevChosenJ || (ghost.i - 1)!= prevChosenI) && isInFreePointsMap(ghost.j,ghost.i-1)){
            ghostArea.points[ind] = ghost.j;
            ind++;
            ghostArea.points[ind] =ghost.i-1;

            isEnteredToifs++
        }
        if(isEnteredToifs == 0){
            ghostArea.points[ind] = prevChosenJ;
            ghostArea.points[ind+1] =prevChosenI;
        }

        var min = 100;
        var chosenJ;
        var chosenI;
        //choose the closest point to pacman
        for (var a=0; a<ghostArea.points.length; a+=2) {
            var jToCheck = ghostArea.points[a];
            var iToCheck = ghostArea.points[a+1];
            var deltaJ = Math.abs(jToCheck - shape.j);
            var deltaI = Math.abs(iToCheck - shape.i);
            var deltaJpow = Math.pow(deltaJ,2);
            var deltaIpow = Math.pow(deltaI,2);
            var dist = Math.sqrt(deltaJpow+deltaIpow);
            if(min >= dist){
                min = dist;
                chosenJ = jToCheck;
                chosenI = iToCheck;
            }
        }

        prevChosenI = ghost.i;
        prevChosenJ = ghost.j;
//if(numOfGhosts == 1){
    ghost.j = chosenJ;
    ghost.i = chosenI;

//}



        if(numOfGhosts >= 2){ // logic for ghost2
            //collect all ghost's near points that available
            var ghostArea2 = {"points":[]};
            var ind2 = 0;
            var isEnteredToifs2 = 0;
            if(((ghost2.j+1) != prevChosenJ2 || ghost2.i != prevChosenI2) && isInFreePointsMap(ghost2.j+1,ghost2.i) && !isGohst1WhereGost2(ghost2.i,chosenI,ghost2.j+1,chosenJ)){
                ghostArea2.points[ind2] = ghost2.j+1;
                ind2++;
                ghostArea2.points[ind2] =ghost2.i;
                ind2++;

                isEnteredToifs2++;
            }
            if(((ghost2.j-1) != prevChosenJ2 || ghost2.i != prevChosenI2) && isInFreePointsMap(ghost2.j-1,ghost2.i) && !isGohst1WhereGost2(ghost2.i,chosenI,ghost2.j-1,chosenJ)){
                ghostArea2.points[ind2] = ghost2.j-1;
                ind2++;
                ghostArea2.points[ind2] =ghost2.i;
                ind2++;

                isEnteredToifs2++
            }
            if(((ghost2.j) != prevChosenJ2 || (ghost2.i + 1) != prevChosenI2) && isInFreePointsMap(ghost2.j,ghost2.i+1) && !isGohst1WhereGost2(ghost2.i+1,chosenI,ghost2.j,chosenJ)){
                ghostArea2.points[ind2] = ghost2.j;
                ind2++;
                ghostArea2.points[ind2] =ghost2.i+1;
                ind2++;

                isEnteredToifs2++
            }
            if(((ghost2.j) != prevChosenJ2 || (ghost2.i - 1)!= prevChosenI2) && isInFreePointsMap(ghost2.j,ghost2.i-1) && !isGohst1WhereGost2(ghost2.i-1,chosenI,ghost2.j,chosenJ)){
                ghostArea2.points[ind2] = ghost2.j;
                ind2++;
                ghostArea2.points[ind2] =ghost2.i-1;

                isEnteredToifs2++
            }
            if(isEnteredToifs2 == 0){
                ghostArea2.points[ind2] = prevChosenJ2;
                ghostArea2.points[ind2+1] =prevChosenI2;
            }

            var min2 = 100;
            var chosenJ2;
            var chosenI2;
            //choose the closest point to pacman
            for (var a2=0; a2<ghostArea2.points.length; a2+=2) {
                var jToCheck2 = ghostArea2.points[a2];
                var iToCheck2 = ghostArea2.points[a2+1];
                var deltaJ2 = Math.abs(jToCheck2 - shape.j);
                var deltaI2 = Math.abs(iToCheck2 - shape.i);
                var deltaJpow2 = Math.pow(deltaJ2,2);
                var deltaIpow2 = Math.pow(deltaI2,2);
                var dist2 = Math.sqrt(deltaJpow2+deltaIpow2);
                if(min2 >= dist2){
                    min2 = dist2;
                    chosenJ2 = jToCheck2;
                    chosenI2 = iToCheck2;
                }
            }

            prevChosenI2 = ghost2.i;
            prevChosenJ2= ghost2.j;
            //if(numOfGhosts == 2){
              //  if(((ghost2.i != ghost.i) || (ghost2.j != ghost.j))) {
                    ghost2.j = chosenJ2;
                    ghost2.i = chosenI2;
               // }
          //  }
           // if(numOfGhosts == 3){
            //    if(((ghost2.i != ghost.i) || (ghost2.j != ghost.j)) && ((ghost2.i != ghost3.i) || (ghost2.j != ghost3.j))) {
                    ghost2.j = chosenJ2;
                    ghost2.i = chosenI2;
               // }
          //  }
        }
        if(numOfGhosts == 3){ //logic for ghost3
            //collect all ghost's near points that available
            var ghostArea3 = {"points":[]};
            var ind3 = 0;
            var isEnteredToifs3 = 0;
            if(((ghost3.j+1) != prevChosenJ3 || ghost3.i != prevChosenI3) && isInFreePointsMap(ghost3.j+1,ghost3.i)){
                ghostArea3.points[ind3] = ghost3.j+1;
                ind3++;
                ghostArea3.points[ind3] =ghost3.i;
                ind3++;

                isEnteredToifs3++;
            }
            if(((ghost3.j-1) != prevChosenJ3 || ghost3.i != prevChosenI3) && isInFreePointsMap(ghost3.j-1,ghost3.i)){
                ghostArea3.points[ind3] = ghost3.j-1;
                ind3++;
                ghostArea3.points[ind3] =ghost3.i;
                ind3++;

                isEnteredToifs3++
            }
            if(((ghost3.j) != prevChosenJ3 || (ghost3.i + 1) != prevChosenI3) && isInFreePointsMap(ghost3.j,ghost3.i+1)){
                ghostArea3.points[ind3] = ghost3.j;
                ind3++;
                ghostArea3.points[ind3] =ghost3.i+1;
                ind3++;

                isEnteredToifs3++
            }
            if(((ghost3.j) != prevChosenJ3 || (ghost3.i - 1)!= prevChosenI3) && isInFreePointsMap(ghost3.j,ghost3.i-1)){
                ghostArea3.points[ind3] = ghost3.j;
                ind3++;
                ghostArea3.points[ind3] =ghost3.i-1;

                isEnteredToifs3++
            }
            if(isEnteredToifs3 == 0){
                ghostArea3.points[ind3] = prevChosenJ3;
                ghostArea3.points[ind3+1] =prevChosenI3;
            }

            var min3 = 100;
            var chosenJ3;
            var chosenI3;
            //choose the closest point to pacman
            for (var a3=0; a3<ghostArea3.points.length; a3+=2) {
                var jToCheck3 = ghostArea3.points[a3];
                var iToCheck3 = ghostArea3.points[a3+1];
                var deltaJ3 = Math.abs(jToCheck3 - shape.j);
                var deltaI3 = Math.abs(iToCheck3 - shape.i);
                var deltaJpow3 = Math.pow(deltaJ3,2);
                var deltaIpow3 = Math.pow(deltaI3,2);
                var dist3 = Math.sqrt(deltaJpow3+deltaIpow3);
                if(min3 >= dist3){
                    min3 = dist3;
                    chosenJ3 = jToCheck3;
                    chosenI3 = iToCheck3;
                }
            }

            prevChosenI3 = ghost3.i;
            prevChosenJ3 = ghost3.j;
            //if(((ghost3.i != ghost2.i) || (ghost3.j != ghost2.j)) && ((ghost3.i != ghost2.i) || (ghost3.j != ghost2.j))) {
                ghost3.j = chosenJ3;
                ghost3.i = chosenI3;
           // }
        }

        //end ghost logic
    }
    if(board[shape.i][shape.j]==5)
    {
        score+=5;
        foodAmount--;
    }
    if(board[shape.i][shape.j]==15)
    {
        score+=15;
        foodAmount--;
    }
    if(board[shape.i][shape.j]==25)
    {
        score+=25;
        foodAmount--;
    }
    /*if(board[shape.i][shape.j]==50)
    {
        score+=50;
        stopDrawMovingPoint = 1;

    }*/
    if(board[shape.i][shape.j]==69)
    {
        remainningLives++;

    }
    if(board[shape.i][shape.j]==88){
        start_time = new Date();
    }
    if(remainningLives == 0){
        song.pause();
        window.clearInterval(interval);
        window.alert("Game Over!");

    }
    if(shape.i == ghost.i && shape.j == ghost.j){ //ghost hit pacman
        remainningLives--;
        sleep(600); // wait a sec, let the user understand he got eaten
        //replocate pacman after ghost hit it
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 2;
        shape.i=emptyCell[0];
        shape.j=emptyCell[1];
    }
    if(numOfGhosts >= 2){//ghost2 hit pacman
        if(shape.i == ghost2.i && shape.j == ghost2.j){ //ghost hit pacman
            remainningLives--;
            sleep(600); // wait a sec, let the user understand he got eaten
            //replocate pacman after ghost hit it
            var emptyCell = findRandomEmptyCell(board);
            board[emptyCell[0]][emptyCell[1]] = 2;
            shape.i=emptyCell[0];
            shape.j=emptyCell[1];
        }
    }
    if(numOfGhosts == 3){//ghost3 hit pacman
        if(shape.i == ghost3.i && shape.j == ghost3.j){ //ghost hit pacman
            remainningLives--;
            sleep(600); // wait a sec, let the user understand he got eaten
            //replocate pacman after ghost hit it
            var emptyCell = findRandomEmptyCell(board);
            board[emptyCell[0]][emptyCell[1]] = 2;
            shape.i=emptyCell[0];
            shape.j=emptyCell[1];
        }
    }
//logic - for movingPoint not to eat food
   if(board[movingPoint.i][movingPoint.j]==5){
        movingPointPrev = 5;
    }
    if(board[movingPoint.i][movingPoint.j]==15){
        movingPointPrev = 15;
    }
    if(board[movingPoint.i][movingPoint.j]==25){
        movingPointPrev = 25;
    }
    if(board[movingPoint.i][movingPoint.j]==0){
        movingPointPrev = 0;
    }
    if(board[movingPoint.i][movingPoint.j]==72){
        movingPointPrev = 72;
    }
    if(board[movingPoint.i][movingPoint.j]==73){
        movingPointPrev = 73;
    }
    if(board[movingPoint.i][movingPoint.j]==7){
        movingPointPrev = 7;
    }

    //logic - for ghost not to eat food
    if(board[ghost.i][ghost.j]==5){
        ghostPrev = 5;
    }
    if(board[ghost.i][ghost.j]==15){
        ghostPrev = 15;
    }
    if(board[ghost.i][ghost.j]==25){
        ghostPrev = 25;
    }
    if(board[ghost.i][ghost.j]==0){
        ghostPrev = 0;
    }
    if(board[ghost.i][ghost.j]==72){
        ghostPrev = 72;
    }
    if(board[ghost.i][ghost.j]==73){
        ghostPrev = 73;
    }
    if(board[ghost.i][ghost.j]==50){
        ghostPrev = 50;
    }
    if(numOfGhosts >=2){
        //logic - for ghost2 not to eat food
        if(board[ghost2.i][ghost2.j]==5){
            ghost2Prev = 5;
        }
        if(board[ghost2.i][ghost2.j]==15){
            ghost2Prev = 15;
        }
        if(board[ghost2.i][ghost2.j]==25){
            ghost2Prev = 25;
        }
        if(board[ghost2.i][ghost2.j]==0){
            ghost2Prev = 0;
        }
        if(board[ghost2.i][ghost2.j]==7){
            ghost2Prev = 7;
        }
        if(board[ghost2.i][ghost2.j]==73){
            ghost2Prev = 73;
        }
        if(board[ghost2.i][ghost2.j]==50){
            ghostPrev = 50;
        }
    }
    if(numOfGhosts == 3){
        //logic - for ghost3 not to eat food
        if(board[ghost3.i][ghost3.j]==5){
            ghost3Prev = 5;
        }
        if(board[ghost3.i][ghost3.j]==15){
            ghost3Prev = 15;
        }
        if(board[ghost3.i][ghost3.j]==25){
            ghost3Prev = 25;
        }
        if(board[ghost3.i][ghost3.j]==0){
            ghost3Prev = 0;
        }
        if(board[ghost3.i][ghost3.j]==72){
            ghost3Prev = 72;
        }
        if(board[ghost3.i][ghost3.j]==7){
            ghost3Prev = 7;
        }
        if(board[ghost3.i][ghost3.j]==50){
            ghostPrev = 50;
        }
    }
if(stopDrawMovingPoint == 0){
    board[movingPoint.i][movingPoint.j] = 50; //update moving point position
}
    if(board[shape.i][shape.j]==50)
    {
        score+=50;
        stopDrawMovingPoint = 1;

    }

    board[shape.i][shape.j]=2; //update pacman position


    if(numOfGhosts ==3){
        //if(((ghost3.i != ghost.i) || (ghost3.j != ghost.j)) && ((ghost2.i != ghost3.i) || (ghost2.j != ghost3.j))) {
            board[ghost3.i][ghost3.j] = 73; //update ghost3 position
        //}
    }
    if(numOfGhosts >=2){
        //if(((ghost2.i != ghost.i) || (ghost2.j != ghost.j))){
            board[ghost2.i][ghost2.j]=72; //update ghost2 position
       // }

    }
   // if((ghost.i == ghost2.i) && (ghost.j == ghost2.j)){


    //}else{
        board[ghost.i][ghost.j]=7; //update ghost position
  //  }


    ghostSlow = (ghostSlow + 1) % 2; //to slow down the ghost
    var currentTime=new Date();
    time_elapsed=(currentTime-start_time)/1000;
    if(score>=20&&time_elapsed<=10)
    {
        //pac_color="green";
    }
    if(score < 150 && time_elapsed >= gameTime)
    {
        song.pause();
        window.clearInterval(interval);
        window.alert("Time's Up \n\nYou Scored "+ score + " points\n\n"+" You can do better");
    }
    if((time_elapsed >= gameTime && score >= 150) || foodAmount == 0 ){
        song.pause();
        window.clearInterval(interval);
        window.alert("We Got A Winner!!!");
    }
    else
    {
        Draw();
    }
}

function scrollWin() {
    window.scrollBy(0, 175);
}
function isGohst1WhereGost2(i1,i2,j1,j2){
    if((i1 == i2) && (j1 == j2)){
        return true;
    }
    return false;
}
