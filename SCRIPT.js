let workers=[];

let washHistory=[];

let selectedWorker=null;

let currentAssetGender="Male";

let currentLockerGender="Male";

let currentAssetStatus="Active";

let currentLockerStatus="Active";

let currentLockerType="Given";

/* TIME */

function updateTime(){

const now=new Date();

document.getElementById("datetime")
.innerText=
now.toLocaleDateString("en-GB")
+" | "+
now.toLocaleTimeString();

}

setInterval(updateTime,1000);

updateTime();

/* DATE */

function formatDate(input){

let value=input.value.replace(/\D/g,'');

if(value.length > 2 && value.length <= 4){

value=
value.slice(0,2)+'/'+
value.slice(2);

}
else if(value.length > 4){

value=
value.slice(0,2)+'/'+
value.slice(2,4)+'/'+
value.slice(4,8);

}

if(value.length===10){

let parts=value.split('/');

let day=parseInt(parts[0]);

let month=parseInt(parts[1]);

let year=parseInt(parts[2]);

const today=new Date();

const currentYear=today.getFullYear();

if(day<1) day=1;
if(day>31) day=31;

if(month<1) month=1;
if(month>12) month=12;

if(year<2000) year=2000;

if(year>currentYear)
year=currentYear;

let maxDays=
new Date(year,month,0).getDate();

if(day>maxDays)
day=maxDays;

let enteredDate=
new Date(year,month-1,day);

if(enteredDate>today){

day=today.getDate();

month=today.getMonth()+1;

year=today.getFullYear();

}

value=
String(day).padStart(2,'0')
+"/"+
String(month).padStart(2,'0')
+"/"+
String(year);

}

input.value=value;

}

/* TAB */

function showTab(id,btn){

document.getElementById("dashboardTab").style.display="none";
document.getElementById("assetsTab").style.display="none";
document.getElementById("lockerTab").style.display="none";
document.getElementById("washTab").style.display="none";

document.getElementById(id).style.display="block";

document
.querySelectorAll(".bottomnav button")
.forEach(b=>b.classList.remove("active"));

btn.classList.add("active");

render();

if(id==="washTab"){
renderWashTable();
}

}

/* SETTINGS */

function openSettings(){

document.getElementById("settingsModal")
.style.display="block";

document.getElementById("totalWorkers")
.innerText=workers.length;

document.getElementById("maleWorkers")
.innerText=
workers.filter(
w=>w.gender==="Male"
).length;

document.getElementById("femaleWorkers")
.innerText=
workers.filter(
w=>w.gender==="Female"
).length;

}

function closeSettings(){

document.getElementById("settingsModal")
.style.display="none";

}

/* WORKER */

function openWorkerModal(){

document.getElementById("workerModal")
.style.display="block";

}

function saveWorker(){

let id=empId.value.trim();

let name=empName.value.trim();

let genderValue=gender.value;

let dojValue=doj.value.trim();

let dobValue=dob.value.trim();

if(id===""){
alert("Enter Employee ID");
return;
}

if(name===""){
alert("Enter Worker Name");
return;
}

if(genderValue===""){
alert("Select Gender");
return;
}

if(dojValue.length!==10){
alert("Invalid DOJ");
return;
}

if(dobValue.length!==10){
alert("Invalid DOB");
return;
}

workers.push({

id:id,
name:name,
gender:genderValue,
doj:dojValue,
dob:dobValue,

locker:"",
apronColor:"",
apronType:"",
apronSize:"",
apronNo:"",

crocs:false,
lockerKey:false,

assetIssued:false,

status:"Active",

resignDate:""

});

empId.value="";
empName.value="";
gender.selectedIndex=0;
doj.value="";
dob.value="";

document.getElementById("workerModal")
.style.display="none";

render();

}

/* SWITCH */

function switchAssetGender(gender){
currentAssetGender=gender;
render();
}

function switchLockerGender(gender){
currentLockerGender=gender;
render();
}

function switchAssetStatus(status){
currentAssetStatus=status;
render();
}

function switchLockerStatus(status){
currentLockerStatus=status;
render();
}

function switchLockerType(type){
currentLockerType=type;
render();
}

/* ASSET */

function openAssetModal(id){

selectedWorker=id;

lockerNo.innerHTML='';

lockerNo.innerHTML +=
`<option value="NOT GIVEN">
NOT GIVEN
</option>`;

for(let i=1;i<=20;i++){

lockerNo.innerHTML+=
`<option>G-${i}.1</option>`;

lockerNo.innerHTML+=
`<option>G-${i}.2</option>`;

}

for(let i=1;i<=18;i++){

lockerNo.innerHTML+=
`<option>L-${i}.1</option>`;

lockerNo.innerHTML+=
`<option>L-${i}.2</option>`;

}

document.getElementById("assetModal")
.style.display='block';

}

function saveAssets(){

let worker=
workers.find(
w=>w.id===selectedWorker
);

worker.locker=lockerNo.value;

worker.apronColor=apronColor.value;

worker.apronType=apronType.value;

worker.apronSize=apronSize.value;

worker.apronNo=apronNo.value;

worker.crocs=crocs.checked;

worker.lockerKey=lockerKey.checked;

worker.assetIssued=true;

document.getElementById("assetModal")
.style.display='none';

render();

}

/* RESIGN */

function resignWorker(id){

let worker=
workers.find(w=>w.id===id);

let resignDate=
prompt("Enter Resign Date DD/MM/YYYY");

if(!resignDate){
return;
}

worker.status="Resigned";

worker.resignDate=resignDate;

worker.assetIssued=false;

render();

}

/* WASH */

function renderWashTable(){

let selectedDate=
document.getElementById("washDate").value;

if(!selectedDate){

let today=new Date();

selectedDate=
today.toISOString().split('T')[0];

document.getElementById("washDate").value=
selectedDate;

}

let washHTML='';

let activeWorkers=
workers.filter(
w=>
w.status==="Active"
&&
w.apronNo!==""
);

activeWorkers.forEach((w)=>{

let existing=
washHistory.find(
x=>
x.date===selectedDate
&&
x.workerId===w.id
);

washHTML+=`

<tr>

<td>

<input
type="checkbox"

${
existing?.sentWash
?
'checked'
:
''
}

onchange="toggleWash(
'${selectedDate}',
'${w.id}',
this.checked,
'wash'
)">

</td>

<td>

<input
type="checkbox"

${
existing?.returned
?
'checked'
:
''
}

onchange="toggleWash(
'${selectedDate}',
'${w.id}',
this.checked,
'return'
)">

</td>

<td>${w.name}</td>

<td>${w.apronNo}</td>

<td>${w.locker}</td>

</tr>

`;

});

washTable.innerHTML=washHTML;

}

function toggleWash(date,workerId,checked,type){

let worker=
workers.find(
w=>w.id===workerId
);

let existing=
washHistory.find(
x=>
x.date===date
&&
x.workerId===workerId
);

if(!existing){

existing={

date:date,
workerId:worker.id,
workerName:worker.name,
apronNo:worker.apronNo,
locker:worker.locker,
sentWash:false,
returned:false

};

washHistory.push(existing);

}

if(type==="wash"){
existing.sentWash=checked;
}

if(type==="return"){
existing.returned=checked;
}

}

function submitWashReport(){

let selectedDate=
document.getElementById("washDate").value;

let data=
washHistory.filter(
x=>x.date===selectedDate
);

let total=data.length;

let washCount=
data.filter(
x=>x.sentWash
).length;

let returnCount=
data.filter(
x=>x.returned
).length;

let pending=
washCount-returnCount;

let report=`

<div class="card">

<h3>Wash Report</h3>

<p><b>Date:</b> ${selectedDate}</p>

<p><b>Total Aprons:</b> ${total}</p>

<p><b>Sent To Wash:</b> ${washCount}</p>

<p><b>Returned:</b> ${returnCount}</p>

<p><b>Pending:</b> ${pending}</p>

</div>

`;

document.getElementById("washReport")
.innerHTML=report;

}

/* RENDER */

function render(){

/* WORKER TABLE */

let workerHTML='';

workers.forEach(w=>{

workerHTML+=`

<tr>

<td>${w.id}</td>
<td>${w.name}</td>
<td>${w.gender}</td>
<td>${w.doj}</td>
<td>${w.dob}</td>

</tr>

`;

});

workerTable.innerHTML=workerHTML;

/* ASSET TABLE */

let assetHTML='';

let filteredAssets=
workers.filter(
w=>
w.gender===currentAssetGender
&&
w.status===currentAssetStatus
);

filteredAssets.forEach((w,index)=>{

assetHTML+=`

<tr>

<td>${index+1}</td>

<td>${w.name}</td>

<td>${w.status}</td>

<td>

${
!w.assetIssued
?
`
<button
class="icon-btn add-btn"
onclick="openAssetModal('${w.id}')">

➕

</button>
`
:
`
<button
class="icon-btn change-btn"
onclick="openAssetModal('${w.id}')">

🔄

</button>
`
}

<button
class="icon-btn resign-btn"
onclick="resignWorker('${w.id}')">

🚪

</button>

</td>

</tr>

`;

});

assetTable.innerHTML=assetHTML;

}
render();
/* LOCKER TABLE */

let lockerHTML='';

lockerHTML+=`

<tr>

<th>Locker</th>
<th>Worker</th>
<th>Color</th>
<th>Type</th>
<th>Size</th>
<th>Apron No</th>
<th>Crocs</th>
<th>Locker Key</th>

${
currentLockerStatus==="Resigned"
?
`<th>Resign Date</th>`
:
''
}

</tr>

`;

/* GENTS */

if(currentLockerGender==="Male"){

for(let i=1;i<=20;i++){

let users=[];

if(currentLockerType==="Given"){

users=
workers.filter(w=>

w.locker.startsWith('G-'+i)

&&

w.status===currentLockerStatus

&&

w.locker!=="NOT GIVEN"

);

}
else{

users=
workers.filter(w=>

w.gender==="Male"

&&

w.status===currentLockerStatus

&&

w.locker==="NOT GIVEN"

);

}

if(currentLockerType==="NotGiven"
&& users.length===0){

continue;

}

let color='#dcfce7';

if(users.length==1)
color='#fef9c3';

if(users.length>=2)
color='#fee2e2';

if(users.length===0){

lockerHTML+=`

<tr>

<td style="background:${color}">
G-${i}
</td>

<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>

${
currentLockerStatus==="Resigned"
?
`<td>-</td>`
:
''
}

</tr>

`;

}

else{

users.forEach((u,index)=>{

lockerHTML+=`

<tr>

${
index===0
?
`
<td
rowspan="${users.length}"
style="
background:${color};
font-weight:bold;
vertical-align:middle;
">

${
currentLockerType==="Given"
?
`G-${i}`
:
`NOT GIVEN`
}

</td>
`
:
''
}

<td>${u.name}</td>

<td>${u.apronColor || '-'}</td>

<td>${u.apronType || '-'}</td>

<td>${u.apronSize || '-'}</td>

<td>${u.apronNo || '-'}</td>

<td>
${u.crocs ? '✔' : '✖'}
</td>

<td>
${u.lockerKey ? '✔' : '✖'}
</td>

${
currentLockerStatus==="Resigned"
?
`
<td>
${u.resignDate || '-'}
</td>
`
:
''
}

</tr>

`;

});

}

}

}

/* LADIES */

else{

for(let i=1;i<=18;i++){

let users=[];

if(currentLockerType==="Given"){

users=
workers.filter(w=>

w.locker.startsWith('L-'+i)

&&

w.status===currentLockerStatus

&&

w.locker!=="NOT GIVEN"

);

}
else{

users=
workers.filter(w=>

w.gender==="Female"

&&

w.status===currentLockerStatus

&&

w.locker==="NOT GIVEN"

);

}

if(currentLockerType==="NotGiven"
&& users.length===0){

continue;

}

let color='#dcfce7';

if(users.length==1)
color='#fef9c3';

if(users.length>=2)
color='#fee2e2';

if(users.length===0){

lockerHTML+=`

<tr>

<td style="background:${color}">
L-${i}
</td>

<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>

${
currentLockerStatus==="Resigned"
?
`<td>-</td>`
:
''
}

</tr>

`;

}

else{

users.forEach((u,index)=>{

lockerHTML+=`

<tr>

${
index===0
?
`
<td
rowspan="${users.length}"
style="
background:${color};
font-weight:bold;
vertical-align:middle;
">

${
currentLockerType==="Given"
?
`L-${i}`
:
`NOT GIVEN`
}

</td>
`
:
''
}

<td>${u.name}</td>

<td>${u.apronColor || '-'}</td>

<td>${u.apronType || '-'}</td>

<td>${u.apronSize || '-'}</td>

<td>${u.apronNo || '-'}</td>

<td>
${u.crocs ? '✔' : '✖'}
</td>

<td>
${u.lockerKey ? '✔' : '✖'}
</td>

${
currentLockerStatus==="Resigned"
?
`
<td>
${u.resignDate || '-'}
</td>
`
:
''
}

</tr>

`;

});

}

}

}


lockerTable.innerHTML=lockerHTML;



/* INITIAL */

render();