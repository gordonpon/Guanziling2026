function calc() {
    let totalPeople = Number(document.getElementById("totalPeople").value);
    const employees = Number(document.getElementById("employees").value);
    const familyMembers = Number(document.getElementById("familyMembers").value);
    const children110to150 = Number(document.getElementById("children110to150").value);
    const childrenUnder110 = Number(document.getElementById("childrenUnder110").value);

    const roomType = document.getElementById("roomType").value;

    const feeBus = Number(document.getElementById("feeBus").value);
    const feeIns = Number(document.getElementById("feeIns").value);
    const feeFood = Number(document.getElementById("feeFood").value);

    // ===== 規則 1：同工人數不可為 0 =====
    if (employees === 0) {
        alert("同工人數不可為 0，請至少輸入 1 位同工");
        return;
    }

    // ===== 規則 2：同工 + 家眷 + 小孩人數總和必須等於參加人數 =====
    if ((employees + familyMembers + children110to150 + childrenUnder110) !== totalPeople) {
        alert("同工 + 家眷 + 小孩人數總和必須等於參加人數");
        return;
    }

    // ===== 規則 3：參加人數只有 1 人的提示 =====
    if (totalPeople === 1) {
        const confirmCalculate = confirm("參加人數只有 1 人\n\n此金額為參考金額，需再補齊人數。\n\n是否繼續計算？");
        if (!confirmCalculate) {
            return;
        }
    }

    // ===== 規則 4：同工+家眷超過 3 人不可選二人房 =====
    if ((employees + familyMembers) > 3 && (roomType === "r2" || roomType === "r2spa")) {
        const roomTypeName = roomType === "r2" ? "二人房" : "二人房(含湯屋)";
        alert(`同工及家眷人數加總為 ${employees + familyMembers} 人，已超過 3 人\n\n不可選擇「${roomTypeName}」\n\n請重新選擇房型`);
        return;
    }

    if (totalPeople <= 0) {
        alert("人數不可為 0");
        return;
    }


    // --- 基本費 ---
    //const feeEmployeesBasic = 1000;
    const depositEmployee = 1000; // 保證金（同工）
    const feeChild110to150Basic = 800;
    const feeChildUnder110Basic = 0;
    const feeFamilyBasic = feeBus + feeIns + feeFood;

    // --- 房型加價（同工） ---
    let employeeRoomAdd = 0;
    switch (roomType) {
        case "r4": employeeRoomAdd = 0; break;
        case "r2": employeeRoomAdd = 300; break;
        case "r2spa": employeeRoomAdd = 800; break;
        case "r4spa": employeeRoomAdd = 300; break;
        case "r6": employeeRoomAdd = 300; break;
    }

    // --- 房價（家眷） ---
    let familyRoomPrice = 0;
    switch (roomType) {
        case "r4": familyRoomPrice = 2200; break;
        case "r2": familyRoomPrice = 2500; break;
        case "r2spa": familyRoomPrice = 3000; break;
        case "r4spa": familyRoomPrice = 25000; break;
        case "r6": familyRoomPrice = 2500; break;
    }

    // ===== 合計 =====
    const feeEmpTotal = employees * (employeeRoomAdd + depositEmployee);
    const feeFamTotal = familyMembers * (feeFamilyBasic + familyRoomPrice);
    const feeChild110to150Total = children110to150 * feeChild110to150Basic;
    const feeChildUnder110Total = childrenUnder110 * feeChildUnder110Basic;

    const total =
        feeEmpTotal +
        feeFamTotal +
        feeChild110to150Total +
        feeChildUnder110Total;

    // ===== 右側明細（改用表格方式） =====
    const detailList = document.getElementById("detailList");
    detailList.innerHTML = "";

    function addDetailRow(label, bus, ins, food, room, deposit, totalRow) {
        return `
        <table class="detail-table">
            <tr>
                <th colspan="6">${label}</th>
            </tr>
            <tr>
                <th>車資</th>
                <th>保險</th>
                <th>餐費</th>
                <th>房型/加價</th>
                <th>保證金</th>
                <th>小計</th>
            </tr>
            <tr>
                <td>${bus}</td>
                <td>${ins}</td>
                <td>${food}</td>
                <td>${room}</td>
                <td>${deposit}</td>
                <td>${totalRow}</td>
            </tr>
        </table>
        `;
    }

    // === 同工 ===
    for (let i = 1; i <= employees; i++) {
        const subtotal = employeeRoomAdd + depositEmployee;
        detailList.innerHTML += addDetailRow(
            `同工${i}`,
            "-", "-", "-", employeeRoomAdd.toLocaleString(), depositEmployee.toLocaleString(),
            subtotal.toLocaleString()
        );
    }

    // === 家眷 ===
    for (let i = 1; i <= familyMembers; i++) {
        const subtotal = feeFamilyBasic + familyRoomPrice;
        detailList.innerHTML += addDetailRow(
            `家眷${i}`,
            feeBus.toLocaleString(),
            feeIns.toLocaleString(),
            feeFood.toLocaleString(),
            familyRoomPrice.toLocaleString(), "-",
            subtotal.toLocaleString()
        );
    }

    // === 小孩 110~150 ===
    for (let i = 1; i <= children110to150; i++) {
        detailList.innerHTML += addDetailRow(
            `小孩(110cm~150cm)${i}`,
            "-", "-", "-",
            "-", "-",
            feeChild110to150Basic.toLocaleString()
        );
    }

    // === 小孩 110 以下 ===
    for (let i = 1; i <= childrenUnder110; i++) {
        detailList.innerHTML += addDetailRow(
            `小孩(110cm↓)${i}`,
            "-", "-", "-",
            "-", "-",
            feeChildUnder110Basic.toLocaleString()
        );
    }

    // ===== 動態插入總計表格：移出 detail-section，置於獨立 summary-section =====
    const summarySection = document.getElementById("summarySection");
    summarySection.innerHTML = `
        <div class="summary-wrapper">
            <table class="detail-table summary-table">
                <tr>
                    <th colspan="5">總計</th>
                </tr>
                <tr>
                    <th>同工</th>
                    <th>家眷</th>
                    <th>小孩(110~150)</th>
                    <th>小孩(110↓)</th>
                    <th>總金額</th>
                </tr>
                <tr>
                    <td>${employees}</td>
                    <td>${familyMembers}</td>
                    <td>${children110to150}</td>
                    <td>${childrenUnder110}</td>
                    <td style="font-weight:bold;color:#007bff;">${total.toLocaleString()} 元</td>
                </tr>
            </table>
        </div>
    `;
}
