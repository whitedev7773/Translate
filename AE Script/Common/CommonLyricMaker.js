var setting = {
  targetComp: "Lyric",
  initLayerName: "LyricLayer",
};

function InputTime() {
  var userInput = "";
  var window = new Window("dialog", "생성한 Beat 데이터 입력");

  window.add("statictext", undefined, "생성한 Beat 데이터를 입력해주세요.");
  window.add(
    "statictext",
    undefined,
    "Beat 데이터의 예시는 아래와 같아요. (시간 코드)"
  );
  window.add("statictext", undefined, "00:00:00:00");
  window.add("statictext", undefined, "00:00:01:00");
  window.add("statictext", undefined, "00:00:01:30");

  var inputText = window.add("edittext", undefined, "", {
    multiline: true,
    scrolling: true,
  });
  inputText.size = [230, 150]; // 텍스트 필드 크기 조정

  var okButton = window.add("button", undefined, "확인");

  okButton.onClick = function () {
    userInput = inputText.text;
    window.close();
  };

  window.show();
  return userInput;
}

function InputLyric() {
  var userInput = "";
  var window = new Window("dialog", "가사 입력");

  window.add("statictext", undefined, "가사를 입력해주세요.");
  window.add("statictext", undefined, "가사의 예시는 아래와 같아요.");
  window.add("statictext", undefined, "せーので黙って何もしないでいてみない?");
  window.add("statictext", undefined, "세-노데 다맛테 난모 시나이데이테미나이");
  window.add(
    "statictext",
    undefined,
    "하나 둘하면 조용히 아무것도 하지않을래?"
  );

  var inputText = window.add("edittext", undefined, "", {
    multiline: true,
    scrolling: true,
  });
  inputText.size = [230, 150]; // 텍스트 필드 크기 조정

  var okButton = window.add("button", undefined, "확인");

  okButton.onClick = function () {
    userInput = inputText.text;
    window.close();
  };

  window.show();
  return userInput;
}

function TimecodeToSeconds(timecode) {
  var timeArray = timecode.split(":");
  var hours = parseInt(timeArray[0], 10);
  var minutes = parseInt(timeArray[1], 10);
  var seconds = parseInt(timeArray[2], 10);
  var frames = parseInt(timeArray[3], 10);

  return hours * 3600 + minutes * 60 + seconds + frames / 60;
}

function GetComposition(name) {
  var targetComp;

  for (var i = 1; i <= app.project.numItems; i++) {
    if (
      app.project.item(i) instanceof CompItem &&
      app.project.item(i).name === name
    ) {
      targetComp = app.project.item(i);
    }
  }

  // 컴포지션이 존재하는지 확인
  if (targetComp !== null && targetComp instanceof CompItem) {
    return targetComp;
  } else {
    return null;
  }
}

function main() {
  // 1. 프로젝트 파일 열기
  //   var file = File.openDialog("에프터 이펙트 프로젝트 열기", "*.aep");
  //   if (file == null) {
  //     alert("프로젝트 파일을 선택해주세요.");
  //     return;
  //   }
  //   app.open(file);

  // 2. 키프레임 등장 시간 배열 얻기
  var lyric_times = InputTime().split("\n");
  if (lyric_times.length == 0) {
    alert("시간 데이터를 입력해주세요.");
    return;
  }

  // 3. 가사 입력 받기
  var lyric = InputLyric().split("\n\n");
  if (lyric.length == 0) {
    alert("가사를 입력해주세요.");
    return;
  }

  // 3. 컴포지션 열기
  var comp = GetComposition(setting.targetComp);
  if (comp == null) {
    alert("컴포지션을 찾지 못했습니다: " + setting.targetComp);
    return;
  }

  // 4. 처리 시작
  alert("처리를 시작합니다.");

  // 복제할 레이어 선택
  var previousLayer1 = comp.layer(setting.initLayerName);
  var previousLayer2 = comp.layer(setting.initLayerName);
  for (var i = 0; i < lyric_times.length; i++) {
    // 레이어 복제
    var newLayer = previousLayer1.duplicate();

    // 레이어 순서를 최상단으로 이동
    newLayer.moveToBeginning();

    // . 대응
    var split = lyric[i].split("\n");
    var jp = split[0];
    var pr = split[1];
    var kr = split[2];
    jp = jp == "." ? "\n" : jp;
    pr = pr == "." ? "\n" : pr;
    kr = kr == "." ? "\n" : kr;

    // 레이어 이름 변경
    newLayer.name = kr;

    // 텍스트 변경
    newLayer
      .property("ADBE Text Properties")
      .property("ADBE Text Document")
      .setValue(jp + "\r" + pr + "\r" + kr);

    // 레이어 시작 시간 설정
    newLayer.startTime = TimecodeToSeconds(lyric_times[i]);

    // previousLayer1에서 마커 생성 후 마커의 위치 설정
    var focus_marker = previousLayer1.property("Marker");
    focus_marker.setValueAtTime(newLayer.startTime, new MarkerValue("Focus"));

    // previousLayer2에서 마커 생성 후 마커의 위치 설정
    var hide_marker = previousLayer2.property("Marker");
    hide_marker.setValueAtTime(newLayer.startTime, new MarkerValue("Hide"));

    // 이전 레이어의 끝 시간을 lyric_times[i]로 설정
    previousLayer1.outPoint = TimecodeToSeconds(lyric_times[i]) + 3;

    // 다음 복제 타겟으로 수정
    previousLayer2 = previousLayer1;
    previousLayer1 = newLayer;
  }
}

main();
