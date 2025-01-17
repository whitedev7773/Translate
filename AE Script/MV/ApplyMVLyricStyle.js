// 에프터 이펙트 스크립트

// 3줄로 이루어진 내용을 사용자에게서 입력 받고 Input 변수에 저장한다.
// 3개의 텍스트 레이어가 선택되있으면
// 3개의 텍스트 레이어의 텍스트를 각각 Input.split("\n") 으로 변경한다.

function Input() {
  var userInput = "";
  var window = new Window("dialog", "가사 3줄 입력");

  window.add("statictext", undefined, "가사 3줄 입력");

  var inputText = window.add("edittext", undefined, "", {
    multiline: true,
    scrolling: true,
  });
  inputText.size = [400, 80]; // 텍스트 필드 크기 조정

  var okButton = window.add("button", undefined, "확인");

  okButton.onClick = function () {
    userInput = inputText.text;
    window.close();
  };

  window.show();
  return userInput;
}

// 3개의 텍스트 레이어가 선택되있으면
if (app.project.activeItem.selectedLayers.length == 3) {
  // 3줄로 이루어진 내용을 사용자에게서 입력 받는다.
  var userInput = Input();
  // 3개의 텍스트 레이어의 텍스트를 각각 userInput.split("\n") 으로 변경한다.
  for (var i = 0; i < 3; i++) {
    app.project.activeItem.selectedLayers[i]
      .property("Source Text")
      .setValue(userInput.split("\n")[i]);
  }
} else {
  alert("텍스트 레이어를 3개 선택해주세요.");
}
