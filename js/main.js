navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    navigator.webkitGetUserMedia);


var recordingTime = 0;
var recordInterval = null;
var myStream  = null;
var mediaRecorder = null;
function startRecording() {
    document.getElementById('pause').style.display = 'inline-block';
    document.getElementById('play').style.display = 'none';
    document.getElementById('recording').style.display  = 'block';
    navigator.getUserMedia({ audio: true }, onSuccess, onError);
    recordInterval = setInterval(function () {
        recordingTime++;
        document.getElementById('recording_time').innerHTML = recordingTime.toString().toHHMMSS();
    },1000);
}

function pauseRecording(rec) {
    document.getElementById('pause').style.display = 'none';
    document.getElementById('play').style.display = 'inline-block';
    document.getElementById('recording').style.display  = 'none';
    clearInterval(recordInterval);
    rec.pause();
    console.log(mediaRecorder.state);
}

function mediaRecorderRezume(rec) {
    document.getElementById('recording').style.display  = 'block';
    document.getElementById('pause').style.display = 'inline-block';
    document.getElementById('play').style.display = 'none';
    recordInterval = setInterval(function () {
        recordingTime++;
        document.getElementById('recording_time').innerHTML = recordingTime.toString().toHHMMSS();
    },1000);
    rec.resume();
}

function stopRecording(rec) {
    document.getElementById('recording').style.display  = 'none';
    var track = myStream.getTracks()[0];
    track.stop();
    clearInterval(recordInterval);
    document.getElementById('play_img').src = 'images/play-button.svg';
    recordingTime = 0;
    document.getElementById('recording_time').innerHTML = recordingTime.toString().toHHMMSS();
    rec.stop();
}



String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
};

if (navigator.getUserMedia) {
    var chunks = [];
    var onSuccess = function(stream) {
        myStream = stream;
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        document.getElementById('stop').onclick = function() {
            stopRecording(mediaRecorder);
        };

        document.getElementById('pause').onclick = function (ev) {
            pauseRecording(mediaRecorder);
        };

        mediaRecorder.onstop = function() {
            document.getElementById('my_popup').style.display = 'block';
            var audio = document.getElementById('listen_record');
            var blob = new Blob(chunks, { 'type' : 'audio/webm; codecs=opus' });
            chunks = [];
            var audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;

            var a = document.getElementById('download_link');
            a.download = "ino_rain_record.webm";
            a.href = audioURL;
        };

        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
        }
    }
}else {
    alert("Your Browser not Supported User Media Javascript Api");
}

document.getElementById('record').onclick = function (ev) {
    startRecording();
};


document.getElementById('record_new').onclick = function (ev) {
    document.getElementById('my_popup').style.display = 'none';
    startRecording();
}

document.getElementById('close').onclick = function (ev) {
    document.getElementById('my_popup').style.display = 'none';
};

function onError(err) {
    alert("Error Cant Record" + err);
};


document.getElementById('play').onclick = function (ev) {
    mediaRecorderRezume(mediaRecorder);
};


