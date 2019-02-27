
var chatSection=document.querySelector("#chatset");//채팅창 node 준비

var getFromLocalStorage=function(){
    return (localStorage.getItem('tweetObjs')!==null) ? JSON.parse(localStorage.getItem('tweetObjs')) : [];
}

var makeTweetNode=function(own, date, text){//새로운 tweet node를 만드는 함수
    var tweetbox=document.createElement("div");
    tweetbox.setAttribute("class", "tweetbox container");
    var owner=document.createElement("h4");
    owner.setAttribute("class","owner");
    owner.setAttribute("onclick","findOwnTweets(this);");
    owner.innerHTML=own
    var writtenTime=document.createElement("time");
    writtenTime.setAttribute("class", "time cf");
    writtenTime.innerHTML=makeDateUserFriendly(date);
    var tweet=document.createElement("p");
    tweet.setAttribute("class", "tweet");
    tweet.innerHTML=text
    tweetbox.appendChild(owner);
    tweetbox.appendChild(writtenTime);
    tweetbox.appendChild(tweet);
    chatSection.prepend(tweetbox);
}

var saveNode=function(own, date, text){//localSave에 저장하는 함수
    var oneTweetForm={};
    oneTweetForm['own']=own;
    oneTweetForm['time']=date;
    oneTweetForm['msg']=text;
    localSave.push(oneTweetForm); 
}

var updateStorage=function(){//localStorage로 update
    localStorage.setItem('tweetObjs', JSON.stringify(localSave));
}

var getHowlongDate1GoneFromDate2UnitMINUTE = function(date1, date2) {//얼마나 지났는지 분단위
    var timeArr1=date1.split(/ {1}|-{1}|:{1}/).map(Number);
    var timeArr2=date2.split(/ {1}|-{1}|:{1}/).map(Number);
    var totalTimeInSec=[];
    for(var i=0; i<5;i++){
        totalTimeInSec.push(timeArr1[i]-timeArr2[i]);
    }
    var timeGone=totalTimeInSec[4]+totalTimeInSec[3]*60+totalTimeInSec[2]*60*24+totalTimeInSec[1]*60*24*30+totalTimeInSec[0]*60*24*30*12;
    return timeGone;
}
var makeDateUserFriendly = function(dateIn) {//가까운시간을 ~ ago 방식으로 표시
    var now = new Date().format();
    var timeGone=getHowlongDate1GoneFromDate2UnitMINUTE(now, dateIn);
    if(timeGone>60*48){
        return dateIn;
    }
    else if(timeGone>60*24){
        return 'a day ago';
    }
    else if(timeGone>120){
        return (timeGone/60)+'hours ago';
    }
    else if(timeGone>60){
        return 'an hour ago';
    }
    else if(timeGone>20){
        return (timeGone/10)+'0 minutes ago';
    }
    else if(timeGone>2) {
        return (timeGone) + 'minutes ago';
    }
    else{
        return 'now';
    }
}

var loadSavedAll=function(){//전체 tweet표시
    for(var i=1; i<localSave.length;i++){
        makeTweetNode(localSave[i].own, localSave[i].time, localSave[i].msg);
    }
}
/************************************페이지 로딩**********************************************************************************************/

document.getElementById("returncase").style.display = 'none';//뒤로가기버튼 switch off

var localSave= getFromLocalStorage();

// DATA에 있는 이미 작성된 트윗을 표시하고 local storage로 옮깁니다  --INITIALIZING-- 최초만 실행 === < 인덱스0자리에 initialized 여부 string으로 저장!!! >
if(localSave[0]!=="initialized"){
    localSave[0]="initialized";
    for(var i=0; i<DATA.length;i++){
        makeTweetNode(DATA[i].user, DATA[i].created_at, DATA[i].message);
        saveNode(DATA[i].user, DATA[i].created_at, DATA[i].message);
    }
}
// 두번째 실행부터는 이미 저장된 트윗만 불러옵니다.
else{
    loadSavedAll();
}
updateStorage();
/************************************페이지 로딩완료********************************************************************************************/

// generateNewTweet을 호출할 때마다 새로운 트윗을 생성합니다.
document.getElementById("refresh-btn")
.addEventListener("click", function(){
    var newData=generateNewTweet();
    makeTweetNode(newData.user,newData.created_at,newData.message);
    saveNode(newData.user,newData.created_at,newData.message);
    updateStorage();
});
//사용자가 메세지와 id를 적고 submit을 넣으면 새로운 트윗을 생성합니다.
document.getElementById("send").addEventListener("click", function(){
    if(document.getElementById("user-name").value!==""&&document.getElementById("user-input").value!=="")
    var tweet = {};
    tweet.user = document.getElementById("user-name").value;
    tweet.message = document.getElementById("user-input").value;
    tweet.created_at = new Date().format(); 
    makeTweetNode(tweet.user, tweet.created_at, tweet.message );
    saveNode(tweet.user, tweet.created_at, tweet.message );
    updateStorage();
    document.getElementById("user-name").value="";
    document.getElementById("user-input").value="";
});
//사용자가 clear-button을 누르면 모든 저장된 메세지를 삭제합니다.
document.getElementById("clear-btn").addEventListener("click", function(){
    localSave=["initialized"];//initialized는 남겨야함
    updateStorage();
    cleanTweets();
});
var cleanTweets=function(){
    while (chatSection.firstChild) {
        chatSection.removeChild(chatSection.firstChild);
    }
}
//사용자가 owner이름을 누르면 이름에 맞는 트윗들이 모두 표시된다.
findOwnTweets=function(ownerElement){
    var ownerName=ownerElement.innerHTML;
    document.getElementById("refreshcase").style.display = 'none' ;//버튼 스위칭
    document.getElementById("clearcase").style.display = 'none' ;
    document.getElementById("returncase").style.display = 'block';
    cleanTweets();
    for(var i=1; i<localSave.length;i++){
        if(localSave[i].own===ownerName){
            makeTweetNode(localSave[i].own, localSave[i].time, localSave[i].msg);
        }
    }
}
//사용자가 뒤로가기 버튼을 누르면 다시 원래대로 돌아간다.
document.getElementById("return-btn").addEventListener("click", function(){
    document.getElementById("refreshcase").style.display = 'block' ;//버튼 스위칭
    document.getElementById("clearcase").style.display = 'block' ;
    document.getElementById("returncase").style.display = 'none' ;
    cleanTweets();
    loadSavedAll();
});