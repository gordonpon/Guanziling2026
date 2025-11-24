function calc() {
    //同工
    const employees = Number(document.getElementById("employees").value);
    //家眷
    const familyMembers = Number(document.getElementById("familyMembers").value);
    //小孩110-150
    const children110to150 = Number(document.getElementById("children110to150").value);
    //小孩110
    const childrenUnder110 = Number(document.getElementById("childrenUnder110").value);
    //房型
    const roomType = document.getElementById("roomType").value;

    // ===== 規則 1：同工人數不可為 0 =====
    if (employees === 0) {
        alert("同工人數不可為 0，請至少輸入 1 位同工");
        return;
    }

    // ===== 規則 2：同工 + 家眷 + 小孩人數總和必須等於參加人數 =====
    // if ((employees + familyMembers + children110to150 + childrenUnder110) !== totalPeople) {
    //     alert("同工 + 家眷 + 小孩人數總和必須等於參加人數");
    //     return;
    // }

    // ===== 規則 3：參加人數只有 1 人的提示 =====
    // if (totalPeople === 1) {
    //     const confirmCalculate = confirm("參加人數只有 1 人\n\n此金額為參考金額，需再補齊人數。\n\n是否繼續計算？");
    //     if (!confirmCalculate) {
    //         return;
    //     }
    // }

    // ===== 規則 4：人數與房型限制 =====
    const totalAdults = employees + familyMembers + children110to150 + childrenUnder110;
    
    // 少於 4 人不可選擇 4人房、6人房
    if (totalAdults < 4 && (roomType === "r4" || roomType === "r4spa" || roomType === "r6")) {
        let roomTypeName = "";
        if (roomType === "r4") roomTypeName = "4人標準房";
        else if (roomType === "r4spa") roomTypeName = "4人湯屋房、親子房、和室";
        else if (roomType === "r6") roomTypeName = "6人湯屋房";
        
        alert(`同工、家眷及小孩人數加總為 ${totalAdults} 人，少於 4 人\n\n不可選擇「${roomTypeName}」\n\n請重新選擇房型`);
        return;
    }
    
    // 超過 3 人不可選擇 2-3人房
    if (totalAdults > 3 && (roomType === "r2" || roomType === "r2spa")) {
        const roomTypeName = roomType === "r2" ? "2-3人標準房" : "2-3人湯屋房";
        alert(`同工、家眷及小孩人數加總為 ${totalAdults} 人，已超過 3 人\n\n不可選擇「${roomTypeName}」\n\n請重新選擇房型`);
        return;
    }

    // if (totalPeople <= 0) {
    //     alert("人數不可為 0");
    //     return;
    // }


    // --- 基本費 ---
    //const feeEmployeesBasic = 1000;
    const depositEmployee = 1000; // 保證金（同工）
    const feeChild110to150Basic = 1500;
    const feeChildUnder110Basic = 500;
    const feeFamilyBasic = 0;

    // --- 房型加價（同工） ---
    let employeeRoomAdd = 0;
    switch (roomType) {
        case "r2": employeeRoomAdd = 300; break;
        case "r4": employeeRoomAdd = 0; break;
        case "r2spa": employeeRoomAdd = 800; break;
        case "r4spa": employeeRoomAdd = 300; break;
        case "r6": employeeRoomAdd = 300; break;
    }

    // --- 房價（家眷） ---
    let familyRoomPrice = 0;
    switch (roomType) {
        case "r2": familyRoomPrice = 2500; break;
        case "r4": familyRoomPrice = 2200; break;
        case "r2spa": familyRoomPrice = 3000; break;
        case "r4spa": familyRoomPrice = 2500; break;
        case "r6": familyRoomPrice = 2500; break;
    }

    // ===== 合計 =====
    const feeEmpTotal = employees * (employeeRoomAdd + depositEmployee);
    const feeFamTotal = familyMembers * familyRoomPrice;
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

    function addDetailRow(label, room, deposit, totalRow) {
        return `
        <table class="detail-table">
            <tr>
                <th colspan="6">${label}</th>
            </tr>
            <tr>
                <th>房型/加價</th>
                <th>保證金</th>
                <th>小計</th>
            </tr>
            <tr>
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
            employeeRoomAdd.toLocaleString(), 
            depositEmployee.toLocaleString(),
            subtotal.toLocaleString()
        );
    }

    // === 家眷 ===
    for (let i = 1; i <= familyMembers; i++) {
        const subtotal = familyRoomPrice;
        detailList.innerHTML += addDetailRow(
            `家眷${i}`,
            familyRoomPrice.toLocaleString(), 
            "-",
            subtotal.toLocaleString()
        );
    }

    // === 小孩 110~150 ===
    for (let i = 1; i <= children110to150; i++) {
        detailList.innerHTML += addDetailRow(
            `小孩(110cm~150cm)${i}`,
            "-", 
            "-",
            feeChild110to150Basic.toLocaleString()
        );
    }

    // === 小孩 110 以下 ===
    for (let i = 1; i <= childrenUnder110; i++) {
        detailList.innerHTML += addDetailRow(
            `小孩(110cm↓)${i}`,
            "-", 
            "-",
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
