let students = [];  // 存儲學生名單，包括姓名和學號
let seatElements = []; // 存儲座位元素
let studentSeatMapping = []; // 存儲學生與座位的對應關係

// 匯入名單
function loadNames(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const content = e.target.result;
    const lines = content.split(/\r?\n/);
    
    // 跳過標題行
    students = lines.slice(1).map(line => {
      const [name, id] = line.split(",");
      return { name: name.trim(), id: id.trim() };
    }).filter(student => student.name && student.id); // 去除空白行
    
    // 顯示名單
    displayNames();
    // 重新創建座位
    createSeats();
  };

  reader.readAsText(file);
}

// 顯示名單（條列形式）
function displayNames() {
  const nameListContainer = document.getElementById("name-list");
  nameListContainer.innerHTML = "";

  students.forEach((student, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${student.name} (${student.id})`;  // 顯示姓名和學號
    listItem.dataset.index = index;
    listItem.onmouseover = () => highlightSeat(index); // 高亮對應座位
    listItem.onmouseout = () => unhighlightSeat(index); // 取消高亮
    nameListContainer.appendChild(listItem);
  });
}

// 創建座位圖
function createSeats() {
  const seatChart = document.getElementById("seat-chart");
  seatChart.innerHTML = ""; // 清空座位區域
  seatElements = []; // 清空座位元素
  studentSeatMapping = []; // 清空學生與座位的映射

  // 將學生名單打亂，方便隨機分配
  const shuffledStudents = shuffleArray(students.slice());  // 創建學生名單的隨機副本

  // 創建座位格子
  let studentIndex = 0;  // 用來追蹤目前分配到第幾個學生
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const seat = document.createElement("div");
      seat.classList.add("seat");
      seat.dataset.row = row;
      seat.dataset.col = col;

      // 隨機分配名單到座位
      if (studentIndex < shuffledStudents.length) {
        const student = shuffledStudents[studentIndex];
        seat.textContent = `${student.name} (${student.id})`;  // 顯示姓名和學號

        // 更新座位與學生的映射（記錄學生和座位對應的關係）
        studentSeatMapping.push({ studentIndex, seatElement: seat, student: student });
        studentIndex++;
      } else {
        seat.textContent = "";  // 沒有學生的空座位
      }

      seatChart.appendChild(seat);
      seatElements.push(seat);
    }
  }
}

// 隨機打亂數組
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // 交換元素
  }
  return array;
}

// 高亮顯示座位
function highlightSeat(index) {
  const student = students[index];  // 從名單中找到對應學生
  const matchingSeat = studentSeatMapping.find(mapping => mapping.student === student);  // 找到學生對應的座位
  if (matchingSeat) {
    matchingSeat.seatElement.classList.add("highlight");
  }
}

// 取消高亮顯示座位
function unhighlightSeat(index) {
  const student = students[index];
  const matchingSeat = studentSeatMapping.find(mapping => mapping.student === student);  // 找到學生對應的座位
  if (matchingSeat) {
    matchingSeat.seatElement.classList.remove("highlight");
  }
}

// 頁面加載後初始化
window.onload = () => {
  createSeats();
};
