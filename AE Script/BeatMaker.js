var _userInput = "";
function GetBeatData() {
    var window = new Window('dialog', '생성한 Beat 데이터 입력');

    window.add('statictext', undefined, '생성한 Beat 데이터를 입력해주세요.');
    window.add('statictext', undefined, 'Beat 데이터의 예시는 아래와 같아요. (타입, 시간 코드)');
    window.add('statictext', undefined, 'kick,00:00:00:00');
    window.add('statictext', undefined, 'snare,00:00:01:00');
    window.add('statictext', undefined, 'kick,00:00:01:30');

    var inputText = window.add('edittext', undefined, '', { multiline: true, scrolling: true });
    inputText.size = [230, 150]; // 텍스트 필드 크기 조정

    var okButton = window.add('button', undefined, '확인');

    okButton.onClick = function () {
        _userInput = inputText.text;
        window.close();
    };

    window.show();
}

function GetComposition(proj, name) {
    // BeatResult라는 이름의 컴포지션 가져오기
    var targetComp;

    for (var i = 1; i <= proj.numItems; i ++) {
        if ((proj.item(i) instanceof CompItem) && (proj.item(i).name === name)) {
            targetComp = proj.item(i);
        }
    }

    // 컴포지션이 존재하는지 확인
    if (targetComp !== null && targetComp instanceof CompItem) {
        return targetComp;
    } else {
        return null;
    }
}

// 타임코드를 초로 변환하는 함수
function TimecodeToSeconds(timecode) {
    var timeArray = timecode.split(':');
    var hours = parseInt(timeArray[0], 10);
    var minutes = parseInt(timeArray[1], 10);
    var seconds = parseInt(timeArray[2], 10);
    var frames = parseInt(timeArray[3], 10);
    
    return hours * 3600 + minutes * 60 + seconds + frames / 60;
}

var _ResultComp_Name = "BeatResult";


var beat_data;
function App() {
    var file = File.openDialog('에프터 이펙트 프로젝트 열기', '*.aep');
    if (file == null) {
        alert("프로젝트 파일을 선택해주세요.")
        return;
    }

    GetBeatData();
    if (_userInput == null) {
        alert("Beat 데이터를 입력해주세요.")
        return;
    }
    else {
        beat_data = _userInput.split("\n");
    }
    
    app.open(file);
    var proj = app.project;  // Open된 file의 프로젝트
    
    var beatResult = GetComposition(proj, _ResultComp_Name);
    if (beatResult == null) {
        // 컴포지션을 찾았을 때의 동작
        alert('컴포지션을 찾지 못했습니다: ' + _ResultComp_Name);
        return;
    }
    
    alert("처리를 시작합니다.");

    for (var i = 0; i < beat_data.length; i++) {
        var beat = beat_data[i];
        var _split = beat.split(',');

        var type = _split[0];
        var time_sec = TimecodeToSeconds(_split[1]);

        var target = GetComposition(proj, type);
        if (target == null) {
            alert('컴포지션을 찾지 못했습니다: ' + type);
            return;
        }
    
        var new_layer = beatResult.layers.add(target);
        new_layer.startTime = time_sec;
    }
    
    alert("완료했습니다;");
}

App();