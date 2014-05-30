window.onload=init;
function init(){
    var button= document.getElementById("addButton");
    button.onclick=handleButtonClick;
}
function assignNumbersToPitches(pitches,baseArray){
    var pitchArray=pitches.split(",");
    var numberArray=new Array;
   
    for(i=0;i<pitchArray.length;i++){
	if(i==0){
	    var offset=baseArray.indexOf(pitchArray[i]);
	    var firstPitch=baseArray[offset];
	}
	if(baseArray.indexOf(pitchArray[i])<offset){
	    numberArray[i]=baseArray.indexOf(pitchArray[i])+12-offset;
	}
	else{
	    numberArray[i]=baseArray.indexOf(pitchArray[i])-offset;
	}
    }
return numberArray;
}
function appearsNumber(pitch,pitchArray){
var j=0;
for(var i=0;i<pitchArray.length;i++){
    if(pitchArray[i]==pitch){
	j++;
    }
}
return j;
}
function handleButtonClick()
{
    var baseArray=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    var x=document.getElementById("pitches");
    var y=assignNumbersToPitches(x.value,baseArray);
    var bufferP=new Array;
    bufferP=x.value.split(",");
    initialRow=new Array;
   initialColumn=new Array;
    if(bufferP.length !=12 || y.length !=12){
	for(i=0;i<12;i++){
	    if(bufferP.indexOf(baseArray[i])==-1){
	    alert("Your initial row is not the right length. Your're missing "+baseArray[i]);
	    }
	   var repeat= appearsNumber(bufferP[i],bufferP);
	    if(repeat>1){
		alert("You have a repeated pitch.");
	    }
	}
	return;
    }
    for(var i=0;i<12;i++){
	initialRow.push([bufferP[i],y[i]]);	
    }
    for(i=0;i<12;i++){
	if(initialRow[i][1]==0){
	    w=0
	    initialColumn.push(w);
	}
	else{
	    w=12-initialRow[i][1];
	    initialColumn.push(w);
	}
    }
    var table=document.getElementById("prime");
    var header=table.createTHead();
    var row=header.insertRow(0);
    row.style.backgroundColor="CadetBlue";
    var cell=row.insertCell(0);
    cell.style.width="40px"
    cell.innerHTML="<b>Prime Rows</b>";
    for(i=0;i<12;i++){
	var dataRow=table.insertRow(i+1);
	for(j=0;j<=12;j++){
	    if(j==12){
                var name="box" + i;
                var checkBox=document.createElement("input");
                checkBox.type="checkbox";
                checkBox.value="Play row";
                checkBox.id=name;
		var dataCell=dataRow.insertCell(j);
		dataCell.style.backgroundColor="grey";
		dataCell.style.width="40px";
		dataCell.appendChild(checkBox);
		continue;
            }
	    if(i==0){
		var dataCell=dataRow.insertCell(j);
		dataCell.style.backgroundColor="grey";
		dataCell.style.width="40px";
		dataCell.innerHTML=bufferP[j];
            }
	    else if(j==0){
		var dataCell=dataRow.insertCell(j);
		w=initialColumn[i];
		dataCell.style.backgroundColor="grey";
		dataCell.style.width="40px"
		for(P=0;P<12;P++){
		    if(initialRow[P][1]==w){
                        break;
                    }
		}
		dataCell.innerHTML=initialRow[P][0];
		
	    }
	    else if (parseInt(initialColumn[i],10)+parseInt(y[j],10)>11){
		var dataCell=dataRow.insertCell(j);
		w=(parseInt(initialColumn[i],10)+parseInt(y[j],10))-12;
		dataCell.style.backgroundColor="LightGray";
		dataCell.style.width="40px";
		for(P=0;P<12;P++){
		    if(initialRow[P][1]==w){
			break;
		    }
		}
		 dataCell.innerHTML=initialRow[P][0];
	
	    }
	    else{
                var dataCell=dataRow.insertCell(j);
                w=parseInt(initialColumn[i],10)+parseInt(y[j],10);
                dataCell.style.backgroundColor="LightGray";
                dataCell.style.width="40px";
                for(P=0;P<12;P++){
                    if(initialRow[P][1]==w){
                        break;
                    }
                }
                 dataCell.innerHTML=initialRow[P][0];
            }
	}
    }
    var newSlider=document.createElement("input");
    newSlider.type="range";
    newSlider.id="Tempo";
    newSlider.min="20";
    newSlider.max="200";
    newSlider.value="110";
var newLable=document.createElement("lable");
newLable.for="newSlider";
newLable.innerHTML="<b>Tempo</b>";
	    var newButton=document.createElement("input");
	    newButton.type="button";
	    newButton.id="playCheckedRows";
	    newButton.value="Play checked rows";
            newButton.onclick=function(){
		var rowPitches=new Array;
		var checkName;
		var buffer=new Array;
		for(i=0;i<12;i++){
		    checkName="box"+i;
		    if(document.getElementById(checkName).checked){
			for(var j=0;j<12;j++){
			rowPitches.push(document.getElementById("prime").rows[i+1].cells[j]);
			}
		  }
		}
		for(var i=0;i<rowPitches.length;i++){
			buffer[i]=rowPitches[i].innerHTML;
		}
		playPitches(buffer,initialRow);  
	    };
	    var text=document.getElementById("matrixForm")
		text.appendChild(newButton);
                text.appendChild(newSlider);
    text.appendChild(newLable);
}
function playPitches(rowPitches,initialRow){
    var pitchHalfStepDistance=new Array;
    var rowPitchesDecoded=new Array;
    var BaseNote="";
    var otherNoteDistance;
    var baseScale=[["A",0],["A#",1],["B",2],["C",3],["C#",4],["D",5],["D#",6],["E",7],["F",8],["F#",9],["G",10],["G#",11]];
    var BaseNoteDistance;
    for(i=0;i<12;i++){
	if(initialRow[i][1]==0){
	    BaseNote=initialRow[i][0];
	}
	if(BaseNote==baseScale[i][0]){
	    BaseNoteDistance=baseScale[i][1];
	}
	for(var k=0;k<rowPitches.length;k++){
	    for(var j=0;j<12;j++){
		if(rowPitches[k]==baseScale[j][0]){
		    if(baseScale[j][1]<BaseNoteDistance){
			otherNoteDistance=parseInt(baseScale[j][1])+12;
		    }
		    else{
			otherNoteDistance=baseScale[j][1];
		    }
	
		}
	    }
	    pitchHalfStepDistance[k]=[rowPitches[k],otherNoteDistance];    
	}
}
	var j=0;
	 tempo=getTempo();
   mySecondLoop(j,pitchHalfStepDistance,tempo);}
function mySecondLoop (j,pitchHalfStepDistance,tempo) {
    var Hertz=220*(Math.pow(2,((1/12)*(pitchHalfStepDistance[j][1]))));
   setTimeout(function () {   
      j++;
       tempo=getTempo();
       handleOscillator(Hertz,tempo);
      if (j<(pitchHalfStepDistance.length)) mySecondLoop(j,pitchHalfStepDistance,tempo);      
   }, tempo);
}


function handleOscillator(Hertz,tempo){
                tempo=tempo/1000;
                window.AudioContext=window.AudioContext || window.webkitAudioContext;
                var context=new AudioContext();
                var Osc=context.createOscillator();
                Osc.type=(0);
                Osc.connect(context.destination);
                var gainNode=context.createGain();
                gainNode.connect(context.destination);
                var currTime=context.currentTime;
                Osc.frequency.value=Hertz;
                gainNode.gain.value=10;
                Osc.connect(gainNode);
                Osc.start(0);
                Osc.stop(tempo);
             }
function getTempo(){
        newValue=document.getElementById("Tempo").value;
	lable=document.getElementById("tempoLable");
    lable.for="Tempo";
    if(newValue==20){	
	lable.innerHTML="Larghissimo";
    }
    if(newValue>20 && newValue<=40){
	lable.innerHTML="Grave";
    }
    if(newValue>40 && newValue<=55){
        lable.innerHTML="Largo";
    }
if(newValue>55 && newValue<=70){
        lable.innerHTML="Adagio";
    }
if(newValue>70 && newValue<=90){
        lable.innerHTML="Andante";
    }
if(newValue>90 && newValue<=100){
        lable.innerHTML="Andante Moderato";
    }
if(newValue>100 && newValue<=120){
        lable.innerHTML="Moderato";
    }
if(newValue>120 && newValue<=140){
        lable.innerHTML="Allegro";
    }
if(newValue>140 && newValue<=160){
        lable.innerHTML="Vivace";
    }
if(newValue>160 && newValue<=180){
        lable.innerHTML="Presto";
    }
if(newValue>180 && newValue<=200){
        lable.innerHTML="Prestissimo";
    }
    
    tempo=(60/newValue)*1000;
    return tempo;
    }
