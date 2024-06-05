let mic;
let vol = 0;
let dailyArr = []; // 30분 간의 평균 볼륨을 받음
let monthlyArr = []; // 한 달 간 매일의 감자 데이터를 날짜와 함께 저장
let tempArr = []; // 30분 간의 볼륨을 담을 임시 배열
let index = 0;

// test
let testDailyArr = [];
let testMonthlyArr = [];
let testDates = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  mic.start();

  // test
  for (let i = 20240601; i <= 20240630; i++) {
    testDates.push(i)
  }
  // 내가 원하는 형태는
  // dailyArr === [[0, v], [1, v], ... [47, v]]
  // monthlyArr === [[날짜, dailyArr], [날짜, dailyArr] ...]
  for (let j = 0; j < testDates.length; j++) {
    for (let i = 0; i < 48; i ++) {
      testDailyArr.push([i, random(80, 100)]);
    }
    testMonthlyArr.push([testDates[j], testDailyArr])
    testDailyArr = []
  }
}

function draw() {
  background(220);

  let d = new Date();

  volDetect();
  if (minute() == 0 || minute() == 30) {
    // 정각이나 30분이 되면 이전 반 시간 동안의 평균 볼륨을 구해 index와 함께 dailyArr에 넣음
    if (tempArr.length > 0) {
      // 지난 30분 간 수집한 tempArr 값의 평균 구하기
      let sum = 0;
      for (let i = 0; i < tempArr.length; i++) sum += tempArr[i];
      let mean = sum / tempArr.length;

      // 하루 중 몇 번째 값인지를 index 변수에 저장
      index = d.getHours() * 2 + d.getMinutes() / 30;

      dailyArr.push([index, mean]);
      tempArr = [];
    }
  }

  if (hour() == 19) {
    //감자 보고는 19시쯤으로 (퇴근시간)
    // wait(60);
    // arrFillSort(dailyArr);
    // storedailyArr(dailyArr);
    // console.log(dailyArr);
    // console.log(monthlyArr);
    // dailyArr = [];
  }

  drawCalendar(2024, 6, width / 2, height / 2);

  // console.log(testMonthlyArr);

  // // test
  // let c = 1;
  // let cd = 20240601;
  // for (let i = 0; i < 6; i++) {
  //   for (let j = 0; j < 5; j++) {
  //     drawPotato(testMonthlyArr, cd, width * (i + 0.5) / 6, height * (j + 0.5) / 5, 1);
  //     cd++;
  //   }
  // }
}

function wait(sec) {
  let start = Date.now(),
    now = start;
  while (now - start < sec * 1000) {
    now = Date.now();
    console.log("waiting...");
  }
  // 출처: https://inpa.tistory.com/entry/JS-📚-자바스크립트에-sleep-wait-대기-함수-쓰기 [Inpa Dev 👨‍💻:티스토리]
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key === "1") {
    console.log("1");
    let d = new Date();
    let y = d.getFullYear();
    let m = d.getMonth();
    let D = d.getDate();
    let date =
      y.toString() +
      (m < 9 ? "0" : "") +
      (m + 1).toString() +
      (D < 10 ? "0" : "") +
      D.toString(); // 수정된 코드 (GPT4)

    drawPotato(dailyArr, date, width / 2, height / 2, 1);
  } else if (key === "2") {
    console.log("2");
  }
}

function volDetect() {
  micLevel = mic.getLevel() * 150;
  tempArr.push(micLevel);
}

function arrFillSort(arr) {
  let indexArr = [];
  for (let i = 0; i < arr.length; i++) indexArr.push(arr[i][0]); // dailyArr의 index만
  for (let i = 0; i < 48; i++) {
    if (indexArr.includes(i) != true) arr.push([i, 60]); // 채워지지 않은 부분은 임의의 값(60)으로 채움
  }
  arr.sort((a, b) => a[0] - b[0]); // dailyArr을 index를 기준으로 정렬하는 ES6 문법 (GPT4)
}

function storedailyArr(arr) {
  let d = new Date();
  let y = d.getFullYear();
  let m = d.getMonth();
  let D = d.getDate();
  let date =
    y.toString() +
    (m < 9 ? "0" : "") +
    (m + 1).toString() +
    (D < 10 ? "0" : "") +
    D.toString(); // 수정된 코드 (GPT4)

  monthlyArr.push([date, arr]);
}

function drawPotato(arr, date, x, y, s) {
  // arr=monthlyarr, int, int, int
  let drawArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][0] == date) {
      drawArr = arr[i][1];
    } else {
      continue;
    }
  }
  push();
  translate(x, y);
  scale(s);
  strokeWeight(5);
  beginShape();
  curveVertex(
    sin((2 * PI * 0) / 48) * drawArr[0][1],
    cos((2 * PI * 0) / 48) * drawArr[0][1]
  );
  for (let i = 0; i < 24 * (60 / 30); i++) {
    // 24시간을 30분마다 표시 (48회)
    //point(sin(2 * PI * i / 48) * drawArr[i][1], cos(2 * PI * i / 48) * drawArr[i][1]);
    curveVertex(
      sin((2 * PI * i) / 48) * drawArr[i][1],
      cos((2 * PI * i) / 48) * drawArr[i][1]
    );
  }
  curveVertex(
    sin((2 * PI * 0) / 48) * drawArr[0][1],
    cos((2 * PI * 0) / 48) * drawArr[0][1]
  );
  curveVertex(
    sin((2 * PI * 0) / 48) * drawArr[0][1],
    cos((2 * PI * 0) / 48) * drawArr[0][1]
  );
  endShape();
  pop();
}

function drawCalendar(year, month, x, y) { // GPT4의 도움을 받았습니다 // 감자도 그려짐
  push();
  // 달력 그리기 설정
  const size = 1.7;
  month--; // js에서는 '월'이 0부터 시작함(whyㅜㅜ)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const cellSize = 50 * size;
  const padding = 10 * size;
  
  translate(
    x - (padding * 2 + cellSize * 7) / 2,
    y - (padding * 4 + cellSize * 7) / 2
  );

  // 가로선
  let firstY = cellSize * 2 - padding / 2 - 6.5 * size;
  line(padding, firstY, cellSize * 7 + padding, firstY);
  for (let y = cellSize * 2 + padding / 2; y < cellSize * 8; y += cellSize) {
    line(padding, y, cellSize * 7 + padding, y);
  }
  // 세로선
  for (let x = padding; x < cellSize * 8; x += cellSize) {
    line(x, cellSize * 2 + padding / 2, x, cellSize * 7 + padding / 2);
  }

  // 월 이름 표시
  textAlign(LEFT);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  textSize(20 * size);
  text(monthNames[month] + " " + year, padding, cellSize);

  // 요일 이름 표시
  textAlign(CENTER);
  textSize(9 * size);
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
  for (let i = 0; i < 7; i++) {
    text(dayNames[i], padding * 3.5 + i * cellSize, 2 * cellSize);
  }

  // 날짜 표시
  textAlign(LEFT);
  textSize(9 * size);
  let day = 1;
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      const x = padding * 1.2 + col * cellSize;
      const y = 3 * cellSize + row * cellSize - cellSize * 0.7;
      if (row === 0 && col < firstDay) {
        // 이전 달의 날짜는 표시하지 않음
      } else if (day > daysInMonth) {
        // 다음 달의 날짜는 표시하지 않음
        break;
      } else {
        // 현재 달의 날짜 표시
        let pd = 20240600 + day;
        text(day, x + 2, y);
        drawPotato(testMonthlyArr, pd, padding + (col + 0.5) * cellSize, (row + 2.5) * cellSize + padding / 2, 0.3);
        day++;
      }
    }
  }
  pop();
}

// drawPotato(testMonthlyArr, cd, width * (i + 0.5) / 6, height * (j + 0.5) / 5, 1);