//表personal_schedule//SA_PSNSCHEDULE
var pageAffairsdata;// 事务数据
var loaddate;// 页面载入日期毫秒
var loadMondaydate;// 页面载入星期一日期毫秒
// 展开隐藏表格
function hidetable(id) {
    $(id).toggle(700);
}

// 单击
function tdonclick(id) {
    message_add(id);
}

// 页面载入执行
function onload_getdate() {
    LastNextweek("now");/* 日程 */
    cycleAffairs();/* 周期性事务 */
    myTaskLoad();/* 我的任务 */
    importExport();/* 导入导出 */
}

// ↓得到div外左边距**********************************************************************************
function getLeftmargin(daynum) {
    var num;
    switch (daynum) {
        case 1:
            num = 0;
            break;
        case 2:
            num = 15;
            break;
        case 3:
            num = 29;
            break;
        case 4:
            num = 44;
            break;
        case 5:
            num = 59;
            break;
        case 6:
            num = 73;
            break;
        case 0:
            num = 88;
            break;
    }
    return num;
}

// ↓得到div宽度
function getDIVwidth(startnum, endnum) {
    if (startnum === 0) {
        startnum = 7;
    }
    if (endnum === 0) {
        endnum = 7;
    }
    var widthNum;
    var gap = endnum - startnum;
    var scale = startnum.toString() + endnum.toString();
    switch (gap) {
        case 0:
            widthNum = 14;
            break;
        case 1:
            widthNum = 29;
            break;
        case 2:
            widthNum = 43;
            break;
        case 3:
            widthNum = 58;
            break;
        case 4:
            widthNum = 72;
            break;
        case 5:
            widthNum = 87;
            break;
        case 6:
            widthNum = 100;
            break;
    }
    return widthNum;
}

// ***********************************页面加载、上一周、下一周、确定执行添加数据**********************************************
function LastNextweek(parameter) {
    if (parameter !== "cycle") {
        hidetable("#divndays");
        hidetable("#div0_6");
        hidetable("#div7_12");
        hidetable("#div13_18");
        hidetable("#div19_23");
    }
    if (parameter === "cycle") {
        $("#divndays").show("fast");
        $("#div0_6").show("fast");
        $("#div7_12").show("fast");
        $("#div13_18").show("fast");
        $("#div19_23").show("fast");
    }

    var neednum;
    var myDate = new Date();
    if (parameter === "last") {
        loaddate = loaddate - 604800000;
        myDate.setTime(loaddate);
    }
    if (parameter === "next") {
        loaddate = loaddate + 604800000;
        myDate.setTime(loaddate);
    }
    if (parameter === "ok") {
        neednum = (document.getElementById("specified").value).split("-");
        myDate.setFullYear(neednum[0], neednum[1] - 1, neednum[2]);
    }
    if (parameter === "add") {
        myDate.setTime(loaddate);
    }
    if (parameter === "cycle") {
        myDate.setTime(loaddate);
    }
    let specifiedMonths = myDate.getMonth() + 1;// 日期控件月份
    if (specifiedMonths < 10) {
        specifiedMonths = "0" + specifiedMonths.toString();
    }
    let specifiedDates = myDate.getDate();// 日期控件日
    if (specifiedDates < 10) {
        specifiedDates = "0" + specifiedDates.toString();
    }
    document.getElementById("specified").value = myDate.getFullYear() + "-"
        + specifiedMonths + "-" + specifiedDates;// 日期控件载入日期为当天
    let week = myDate.getDay(); // 获取当前星期X(0-6,0代表星期天)
    let milliseconds = myDate.getTime(); // 获取当前时间(从1970.1.1开始的毫秒数)
    loaddate = myDate.getTime();
    if (week === 0) {
        week = 7;
    }
    let gap = week - 1;// 与周一相差天数
    if (gap !== 0) {
        milliseconds = milliseconds - (86400000 * gap);
    }
    let mondaydate = new Date(milliseconds);// 星期一日期
    loadMondaydate = mondaydate.getTime();
    let sundaydate = new Date((milliseconds + 86400000 * 6));// 星期天日期

    for (let i = 0; i < 7; i++) {
        let weeks = document.getElementById("tdweek" + (i + 1));
        let days = new Date();
        days.setTime(milliseconds);
        let dayweek = conversionweek(days.getDay());
        weeks.innerHTML = (days.getMonth() + 1) + "月" + days.getDate() + "日"
            + "<br>" + dayweek;
        milliseconds = milliseconds + 86400000;
    }
    // ↓计算周一时间轴
    let mFirstnum = mondaydate.getFullYear();// 得到周一年份
    let mSecondnum = mondaydate.getMonth() + 1;// 得到周一月份
    if (mSecondnum < 10) {
        mSecondnum = "0" + mSecondnum.toString();
    }
    let mThirdnum = mondaydate.getDate();// 得到周一日期
    if (mThirdnum < 10) {
        mThirdnum = "0" + mThirdnum.toString();
    }
    let mNum = mFirstnum.toString() + mSecondnum.toString()
        + mThirdnum.toString();// 周一时间轴数字
    // ↓计算周日时间轴
    let sFirstnum = sundaydate.getFullYear();// 得到周日年份
    let sSecondnum = sundaydate.getMonth() + 1;// 得到周日月份
    if (sSecondnum < 10) {
        sSecondnum = "0" + sSecondnum.toString();
    }
    let sThirdnum = sundaydate.getDate();// 得到周日日期
    if (sThirdnum < 10) {
        sThirdnum = "0" + sThirdnum.toString();
    }
    let sNum = sFirstnum.toString() + sSecondnum.toString()
        + sThirdnum.toString();// 周日时间轴数字
    let fontColor;// 字体颜色
    let affairsTitle;// 提示状态

    // ↓跨天事务*********************跨天事务***************************跨天事务********************
    document.getElementById("tdndays").innerText = "";
    let ndaysAffairs = [];
    ndaysAffairs = selectData(mNum, sNum);
    try {
        for (let i = 0; i < ndaysAffairs.length; i++) {
            let status = ndaysAffairs[i].SSTATUS;// 状态
            let startdate = ndaysAffairs[i].SSTARTDATE;// 开始时间
            let enddate = ndaysAffairs[i].SENDDATE;// 结束时间
            if (status === "已完成") {
                fontColor = "#3CB371";
                affairsTitle = "已完成";
            }
            if (status === "" || status == null || status === "null") {// 状态
                let stime, stime_a, stime_b, stime_c, stime_d;
                let etime, etime_a, etime_b, etime_c, etime_d;
                let nowDate = new Date();
                let nowYears = nowDate.getFullYear().toString();// 当前年份
                let nowMonths = nowDate.getMonth() + 1;// 当前月份
                if (nowMonths < 10) {
                    nowMonths = "0" + nowMonths.toString();
                }
                var nowDates = nowDate.getDate();// 当前日
                if (nowDates < 10) {
                    nowDates = "0" + nowDates.toString();
                }
                var nowTime = nowDate.toLocaleTimeString().split(":");// 获取当前时间,时分秒
                var mydate = nowYears + nowMonths + nowDates
                    + nowTime[0].toString() + nowTime[1].toString()
                    + nowTime[2].toString();
                stime_a = startdate.toString().substring(0, 10);
                stime_b = startdate.toString().substring(11, 19);
                stime_c = stime_a.split("-");
                stime_a = stime_c[0].toString() + stime_c[1].toString()
                    + stime_c[2].toString();
                stime_d = stime_b.split(":");
                stime_b = stime_d[0].toString() + stime_d[1].toString()
                    + stime_d[2].toString();

                etime_a = enddate.toString().substring(0, 10);
                etime_b = enddate.toString().substring(11, 19);
                etime_c = etime_a.split("-");
                etime_a = etime_c[0].toString() + etime_c[1].toString()
                    + etime_c[2].toString();
                etime_d = etime_b.split(":");
                etime_b = etime_d[0].toString() + etime_d[1].toString()
                    + etime_d[2].toString();
                stime = stime_a + stime_b;
                etime = etime_a + etime_b;
                if (mydate < stime) {// 未开始
                    fontColor = "#B5005A";
                    affairsTitle = "未开始";
                }
                if (mydate > stime && mydate < etime) {// 进行中
                    fontColor = "#0000FF";
                    affairsTitle = "进行中";
                }
                if (mydate > etime) {// 已过期
                    fontColor = "#FF3300";
                    affairsTitle = "已过期";
                }
            }

            let txt = "<div title="
                + affairsTitle
                + " style='position:relative;line-height:1.5;margin-top:1px; border:1px solid #CDCDCD;background-color:#F7F7F7;' id='div"
                + ndaysAffairs[i].SID + "'>&nbsp"
                + "<a href='javascript:void(0);' " + "sstartdate='"
                + ndaysAffairs[i].SSTARTDATE + "' senddate='"
                + ndaysAffairs[i].SENDDATE + "' scaption='"
                + ndaysAffairs[i].SCAPTION
                // "' scoordinate_id='"+ndaysAffairs[i][3]+
                + "' sid='" + ndaysAffairs[i].SID + "' sstatus='"
                + ndaysAffairs[i].SSTATUS + "' scontent='"
                + ndaysAffairs[i].SCONTENT + "' spriority='"
                + ndaysAffairs[i].SPRIORITY
                + "' onclick='message_looks(this)'><font color='black'>"
                + ndaysAffairs[i].SSTARTDATE.substring(0, 16) + " - "
                + ndaysAffairs[i].SENDDATE.substring(0, 16) + " "
                + "</font><font color=" + fontColor + ">"
                + ndaysAffairs[i].SCAPTION + "</font></a></div>";

            let ndaysAffairstxt = document.getElementById("tdndays");
            if (ndaysAffairstxt.innerText === ""
                || ndaysAffairstxt.innerText == null
                || ndaysAffairstxt.innerText === "null") {
                ndaysAffairstxt.innerHTML = txt;
            } else {
                txt = ndaysAffairstxt.innerHTML + txt;
                ndaysAffairstxt.innerHTML = txt;
            }
        }

        // 定位跨天DIV
        for (let i = 0; i < ndaysAffairs.length; i++) {
            let startdate = ndaysAffairs[i].SSTARTDATE.substring(0, 10);
            let startdateArray = startdate.split("-");
            let enddate = ndaysAffairs[i].SENDDATE.substring(0, 10);
            let enddateArray = enddate.split("-");

            if (ndaysAffairs[i].SSTARTDATE_AXIS >= mNum) {// 开始日期大于等于星期一
                let affairstartdate = new Date(startdateArray[0],
                    startdateArray[1] - 1, startdateArray[2]);// 开始日期
                let affairenddate = new Date(enddateArray[0],
                    enddateArray[1] - 1, enddateArray[2]);// 结束日期
                let leftmargin = getLeftmargin(affairstartdate.getDay());// 得到左边距参数
                $("#div" + ndaysAffairs[i].SID).animate({
                    left: leftmargin + "%"
                }, "slow");// 定位DIV外左边距
                if (ndaysAffairs[i].SSENDDATE_AXIS <= sNum) {// 结束时间小于等于星期天
                    let divwidth = getDIVwidth(affairstartdate.getDay(),
                        affairenddate.getDay());// 得到宽度参数
                    $("#div" + ndaysAffairs[i].SID).animate({
                        width: (divwidth) + "%"
                    }, "slow");// DIV宽度
                    if (ndaysAffairs[i].SSENDDATE_AXIS = sNum) {
                        $("#div" + ndaysAffairs[i].SID).animate({
                            right: "0"
                        }, "slow");
                    }
                }
                if (ndaysAffairs[i].SSENDDATE_AXIS > sNum) {// 结束时间大于星期天
                    let divwidth = getDIVwidth(affairstartdate.getDay(), 0);
                    $("#div" + ndaysAffairs[i].SID).animate({
                        width: (divwidth) + "%"
                    }, "slow");// DIV宽度
                    $("#div" + ndaysAffairs[i].SID).animate({
                        right: "0"
                    }, "slow");
                }
            }
            if (ndaysAffairs[i].SSTARTDATE_AXIS < mNum) {// 开始日期小于星期一
                let affairstartdate = new Date(startdateArray[0],
                    startdateArray[1] - 1, startdateArray[2]);// 开始日期
                let affairenddate = new Date(enddateArray[0],
                    enddateArray[1] - 1, enddateArray[2]);// 结束日期
                $("#div" + ndaysAffairs[i].SID).animate({
                    left: "0%"
                }, "slow");// 定位DIV外左边距
                if (ndaysAffairs[i].SSENDDATE_AXIS <= sNum) {// 结束时间小于等于星期天
                    var divwidth = getDIVwidth(1, affairenddate.getDay());
                    $("#div" + ndaysAffairs[i].SID).animate({
                        width: divwidth + "%"
                    }, "slow");// DIV宽度
                    if (ndaysAffairs[i].SSENDDATE_AXIS = sNum) {
                        $("#div" + ndaysAffairs[i].SID).animate({
                            right: "0"
                        }, "slow");
                    }
                }
                if (ndaysAffairs[i].SSENDDATE_AXIS > sNum) {// 结束时间大于星期天
                    $("#div" + ndaysAffairs[i].SID).animate({
                        width: "100%"
                    }, "slow");// DIV宽度
                    $("#div" + ndaysAffairs[i].SID).animate({
                        right: "0"
                    }, "slow");
                }
            }
        }
    } catch (e) {
    }
    // 清空页面表格
    for (let i = 1; i <= 7; i++) {
        for (let j = 0; j < 24; j++) {
            let newaffairstxt = document.getElementById("w" + i + "t" + j);
            newaffairstxt.innerText = "";
        }
    }
    // ↓周期性事务===========================********周期性事务**********************周期性事务*****************************
    let cycleAffairsData = selectData(mNum, sNum, 3);
    if (cycleAffairsData.length > 0) {// cycleAffairsData != null ||
        // cycleAffairsData != undefined
        for (let i = 0; i < cycleAffairsData.length; i++) {
            let startdate = cycleAffairsData[i].SSTARTDATE.substring(0, 10);
            let startdateArray = startdate.split("-");
            let enddate = cycleAffairsData[i].SENDDATE.substring(0, 10);
            let enddateArray = enddate.split("-");
            let cycletxt = "<div style=\"line-height:1.5;margin-top:1px; border:1px solid #CDCDCD;background-color:#F7F7F7;\" title='"
                + "周期事务：每天 "
                + cycleAffairsData[i].SSTARTDATE.substring(11, 16)
                + "'>&nbsp"
                + " "
                + "<a href='javascript:void(0);' "
                + "sstartdate='"
                + cycleAffairsData[i].SSTARTDATE
                + "' senddate='"
                + cycleAffairsData[i].SENDDATE
                + "' sid='"
                + cycleAffairsData[i].SID
                + "' scaption='"
                + cycleAffairsData[i].SCAPTION
                + "' spriority='"
                + cycleAffairsData[i].SPRIORITY
                + "' scontent='"
                + cycleAffairsData[i].SCONTENT
                + "' onclick='message_cycleAffairsLooks(this)'><font color='black'>"
                + cycleAffairsData[i].SSTARTDATE.substring(11, 16)
                + "</font> <font color='#AE00AE'>"
                + cycleAffairsData[i].SCAPTION + "</font></a></div>";
            if ((cycleAffairsData[i].SSTARTDATE_AXIS >= mNum)
                && (cycleAffairsData[i].SSENDDATE_AXIS <= sNum)) {// 开始结束在本周内
                let sDate = new Date(startdateArray[0], startdateArray[1] - 1,
                    startdateArray[2]);
                let eDate = new Date(enddateArray[0], enddateArray[1] - 1,
                    enddateArray[2]);
                let sDay = sDate.getDay();
                if (sDay == 0) {
                    sDay = 7;
                }
                let eDay = eDate.getDay();
                if (eDay == 0) {
                    eDay = 7;
                }
                let xAxis = sDay;
                let yAxis = Number(cycleAffairsData[i].SSTARTDATE.substring(11,
                    13));
                for (var j = 0; j <= (eDay - sDay); j++) {
                    let coordinate = "w" + xAxis + "t" + yAxis;
                    let affairstxt = document.getElementById(coordinate);
                    if (affairstxt.innerText == ""
                        || affairstxt.innerText == null
                        || affairstxt.innerText == "null") {
                        affairstxt.innerHTML = cycletxt;
                    } else {
                        let txt = cycletxt + affairstxt.innerHTML;
                        affairstxt.innerHTML = txt;
                    }
                    xAxis += 1;
                }
            }
            if ((cycleAffairsData[i].SSTARTDATE_AXIS < mNum)
                && (cycleAffairsData[i].SSENDDATE_AXIS <= sNum)) {// 开始在本周前，结束在本周内
                let sDate = new Date(startdateArray[0], startdateArray[1] - 1,
                    startdateArray[2]);
                let eDate = new Date(enddateArray[0], enddateArray[1] - 1,
                    enddateArray[2]);
                let sDay = 1;
                let eDay = eDate.getDay();
                if (eDay == 0) {
                    eDay = 7;
                }
                let xAxis = sDay;
                let yAxis = Number(cycleAffairsData[i].SSTARTDATE.substring(11,
                    13));
                for (var j = 0; j <= (eDay - sDay); j++) {
                    var coordinate = "w" + xAxis + "t" + yAxis;
                    var affairstxt = document.getElementById(coordinate);
                    if (affairstxt.innerText == ""
                        || affairstxt.innerText == null
                        || affairstxt.innerText == "null") {
                        affairstxt.innerHTML = cycletxt;
                    } else {
                        var txt = cycletxt + affairstxt.innerHTML;
                        affairstxt.innerHTML = txt;
                    }
                    xAxis += 1;
                }
            }
            if ((cycleAffairsData[i].SSTARTDATE_AXIS >= mNum)
                && (cycleAffairsData[i].SSENDDATE_AXIS > sNum)) {// 开始在本周内，结束在本周后
                let sDate = new Date(startdateArray[0], startdateArray[1] - 1,
                    startdateArray[2]);
                let eDate = new Date(enddateArray[0], enddateArray[1] - 1,
                    enddateArray[2]);
                let sDay = sDate.getDay();
                if (sDay === 0) {
                    sDay = 7;
                }
                let eDay = 7;
                let xAxis = sDay;
                let yAxis = Number(cycleAffairsData[i].SSTARTDATE.substring(11,
                    13));
                for (let j = 0; j <= (eDay - sDay); j++) {
                    let coordinate = "w" + xAxis + "t" + yAxis;
                    let affairstxt = document.getElementById(coordinate);
                    if (affairstxt.innerText === ""
                        || affairstxt.innerText == null
                        || affairstxt.innerText === "null") {
                        affairstxt.innerHTML = cycletxt;
                    } else {
                        let txt = cycletxt + affairstxt.innerHTML;
                        affairstxt.innerHTML = txt;
                    }
                    xAxis += 1;
                }
            }
            if ((cycleAffairsData[i].SSTARTDATE_AXIS < mNum)
                && (cycleAffairsData[i].SSENDDATE_AXIS > sNum)) {// 开始在本周前，结束在本周后
                let sDay = 1;
                let eDay = 7;
                let xAxis = sDay;
                let yAxis = Number(cycleAffairsData[i].SSTARTDATE.substring(11,
                    13));
                for (let j = 0; j <= (eDay - sDay); j++) {
                    let coordinate = "w" + xAxis + "t" + yAxis;
                    let affairstxt = document.getElementById(coordinate);
                    if (affairstxt.innerText === ""
                        || affairstxt.innerText == null
                        || affairstxt.innerText === "null") {
                        affairstxt.innerHTML = cycletxt;
                    } else {
                        let txt = cycletxt + affairstxt.innerHTML;
                        affairstxt.innerHTML = txt;
                    }
                    xAxis += 1;
                }
            }
        }
    }
    // ↓单天事务===============================================*************************************************
    // try{
    let affairsdata = selectData(mNum, sNum, 0, true);
    if (affairsdata != null || affairsdata !== undefined) {
        for (let i = 0; i < affairsdata.length; i++) {
            try {
                let status = affairsdata[i].SSTATUS;
                let startdate = affairsdata[i].SSTARTDATE;
                let enddate = affairsdata[i].SENDDATE;
                if (status === "已完成") {
                    fontColor = "#3CB371";
                    affairsTitle = "已完成";
                }
                if (status === "" || status == null || status === "null") {// 状态
                    let stime, stime_a, stime_b, stime_c, stime_d;
                    let etime, etime_a, etime_b, etime_c, etime_d;
                    let nowDate = new Date();
                    let nowYears = nowDate.getFullYear().toString();// 当前年份
                    let nowMonths = nowDate.getMonth() + 1;// 当前月份
                    if (nowMonths < 10) {
                        nowMonths = "0" + nowMonths.toString();
                    }
                    let nowDates = nowDate.getDate();// 当前日
                    if (nowDates < 10) {
                        nowDates = "0" + nowDates.toString();
                    }
                    let nowTime = nowDate.toLocaleTimeString().split(":");// 获取当前时间,时分秒
                    let mydate = nowYears + nowMonths + nowDates
                        + nowTime[0].toString() + nowTime[1].toString()
                        + nowTime[2].toString();
                    stime_a = startdate.toString().substring(0, 10);
                    stime_b = startdate.toString().substring(11, 19);
                    stime_c = stime_a.split("-");
                    stime_a = stime_c[0].toString() + stime_c[1].toString()
                        + stime_c[2].toString();
                    stime_d = stime_b.split(":");
                    stime_b = stime_d[0].toString() + stime_d[1].toString()
                        + stime_d[2].toString();

                    etime_a = enddate.toString().substring(0, 10);
                    etime_b = enddate.toString().substring(11, 19);
                    etime_c = etime_a.split("-");
                    etime_a = etime_c[0].toString() + etime_c[1].toString()
                        + etime_c[2].toString();
                    etime_d = etime_b.split(":");
                    etime_b = etime_d[0].toString() + etime_d[1].toString()
                        + etime_d[2].toString();
                    stime = stime_a + stime_b;
                    etime = etime_a + etime_b;
                    if (mydate < stime) {// 未开始
                        fontColor = "#B5005A";
                        affairsTitle = "未开始";
                    }
                    if (mydate > stime && mydate < etime) {// 进行中
                        fontColor = "#0000FF";
                        affairsTitle = "进行中";
                    }
                    if (mydate > etime) {// 已过期
                        fontColor = "#FF3300";
                        affairsTitle = "已过期";
                    }
                }

                let txt = "<div style=\"line-height:1.5;margin-top:1px; border:1px solid #CDCDCD;background-color:#F7F7F7;\" title='"
                    + affairsTitle
                    + "'>&nbsp"
                    + "<a href='javascript:void(0);' "
                    + "sstartdate='"
                    + affairsdata[i].SSTARTDATE
                    + "' senddate='"
                    + affairsdata[i].SENDDATE
                    + "' scaption='"
                    + affairsdata[i].SCAPTION
                    + "' sid='"
                    + affairsdata[i].SID
                    + "' sstatus='"
                    + affairsdata[i].SSTATUS
                    + "' scontent='"
                    + affairsdata[i].SCONTENT
                    + "' spriority='"
                    + affairsdata[i].SPRIORITY
                    + "' onclick='message_looks(this)'><font color='black'>"
                    + affairsdata[i].SSTARTDATE.substring(11, 16)
                    + " - "
                    + affairsdata[i].SENDDATE.substring(11, 16)
                    + "</font> <font color="
                    + fontColor
                    + ">"
                    + affairsdata[i].SCAPTION + "</font></a></div>";
                // ↓定位坐标
                let coordinateNumA = affairsdata[i].SSTARTDATE.substring(0, 10)
                    .split("-");
                let coordinateDate = new Date(coordinateNumA[0],
                    coordinateNumA[1] - 1, coordinateNumA[2]);
                let coordinateDay = coordinateDate.getDay();
                if (coordinateDay == 0) {
                    coordinateDay = 7;
                }
                let coordinate = "w" + coordinateDay + "t"
                    + Number(affairsdata[i].SSTARTDATE.substring(11, 13));
                // 为坐标单元格填入数据
                let affairstxt = document.getElementById(coordinate);
                if (affairstxt.innerText == "" || affairstxt.innerText == null
                    || affairstxt.innerText == "null") {
                    affairstxt.innerHTML = txt;
                } else {
                    txt = txt + affairstxt.innerHTML;
                    affairstxt.innerHTML = txt;
                }
            } catch (e) {
                continue;
            }
        }

    }
    // }catch(e){}
    if (parameter !== "cycle") {
        hidetable("#divndays");
        hidetable("#div0_6");
        hidetable("#div7_12");
        hidetable("#div13_18");
        hidetable("#div19_23");
    }
}

// 添加事务对话框
function message_add(coordinate_id) {
    tlv8.portal.dailog.openDailog('添加事务',
        '/system/personal/schedule/dialog/cycleAffairs?coordinate_id='
        + coordinate_id + '&loadMondaydate=' + loadMondaydate, 700,
        400, addcallback, null);
}

function addcallback(datas) {// 对话框回调函数
    LastNextweek("add");
}

// 查看事务对话框
function message_looks(obj) {
    obj$ = $(obj);
    var cid = encodeURIComponent(obj$.attr("sid"));
    var cstartdate = encodeURIComponent(obj$.attr("sstartdate"));
    var cenddate = encodeURIComponent(obj$.attr("senddate"));
    var ccaption = encodeURIComponent(obj$.attr("scaption"));
    var cstatus = encodeURIComponent(obj$.attr("sstatus"));
    var ccontent = encodeURIComponent(obj$.attr("scontent"));
    var cpriority = encodeURIComponent(obj$.attr("spriority"));
    var itemSetInit = {
        refreshItem: false,
        enginItem: true,
        CanclItem: true
    };
    tlv8.portal.dailog.openDailog("查看事务",
        "/SA/personal/schedule/dialog/messgge_looks.html?sid=" + cid
        + "&sstartdate=" + cstartdate + "&senddate=" + cenddate
        + "&scaption=" + ccaption + "&sstatus=" + cstatus
        + "&scontent=" + ccontent + "&spriority=" + cpriority, 600,
        450, lookscallback, itemSetInit);
    event.cancelBubble = true;// 阻止触发事件
}

function lookscallback() {
    LastNextweek("add");
    cycleAffairsgrid.refreshData();
}

// 新建周期性事务对话框
function message_cycleAffairs() {
    tlv8.portal.dailog.openDailog('新建周期性事务',
        '/system/personal/schedule/dialog/cycleAffairs', 700, 400,
        cycleAffairscallback, null);
}

function cycleAffairscallback() {// 回调函数
    cycleAffairsgrid.refreshData();
    LastNextweek('cycle');
}

// 查看周期事务对话框
function message_cycleAffairsLooks(obj) {
    obj$ = $(obj);
    var cid = encodeURIComponent(obj$.attr("sid"));
    var cstartdate = encodeURIComponent(obj$.attr("sstartdate"));
    var cenddate = encodeURIComponent(obj$.attr("senddate"));
    var ccaption = encodeURIComponent(obj$.attr("scaption"));
    var ccontent = encodeURIComponent(obj$.attr("scontent"));
    var cpriority = encodeURIComponent(obj$.attr("spriority"));
    var itemSetInit = {
        refreshItem: true,
        enginItem: true,
        CanclItem: true
    };
    tlv8.portal.dailog.openDailog("查看周期事务",
        "/SA/personal/schedule/dialog/message_cycleLooks.html?sid=" + cid
        + "&sstartdate=" + cstartdate + "&senddate=" + cenddate
        + "&scaption=" + ccaption + "&scontent=" + ccontent
        + "&spriority=" + cpriority, 520, 290, cyclelookscallback,
        itemSetInit);
    event.cancelBubble = true;// 阻止触发事件
}

function cyclelookscallback() {// 回调函数
    cycleAffairsgrid.refreshData();
    LastNextweek("add");
}

// 将星期几数字转为中文
function conversionweek(day) {
    var dayweek;
    switch (day) {
        case 0:
            dayweek = "星期日";
            break;
        case 1:
            dayweek = "星期一";
            break;
        case 2:
            dayweek = "星期二";
            break;
        case 3:
            dayweek = "星期三";
            break;
        case 4:
            dayweek = "星期四";
            break;
        case 5:
            dayweek = "星期五";
            break;
        case 6:
            dayweek = "星期六";
            break;
    }
    return dayweek;
}

// *****************周期性事务grid
var cycleAffairsgrid = null;

function cycleAffairs() {

}

/*
 * `SCAPTION` varchar(100) default NULL COMMENT '标题', `SSTARTDATE` datetime
 * default NULL COMMENT '开始时间', `SENDDATE` datetime default NULL COMMENT '结束时间',
 * `SPRIORITY` int(11) default NULL COMMENT '优先级', `SCONTENT` text COMMENT '内容',
 * `SSTATUS` varchar(50) default NULL COMMENT '状态', `SAFFAIRSTYPE` int(11)
 * default NULL COMMENT '事务类型', `SCOMPLETERATE` int(11) unsigned default NULL
 * COMMENT '完成率', `SSTARTDATE_AXIS` int(11) default NULL COMMENT '开始时间轴',
 * `SSENDDATE_AXIS` int(11) default NULL COMMENT '结束时间轴', `SWHOUSER`
 * varchar(100) default NULL COMMENT '所属用户',
 */

// *************我的任务*********************我的任务***********************我的任务**/
function myTaskLoad() {
    var myTaskLoadData = selectData(
        "SID,SCAPTION,SSTARTDATE,SENDDATE,SPRIORITY,SCONTENT,SSTATUS,SAFFAIRSTYPE,"
        + "SCOMPLETERATE,SSTARTDATE_AXIS,SSENDDATE_AXIS,SWHOUSER",
        "sa_psnmytask", " where SWHOUSER='"
        + tlv8.Context.getCurrentPersonID() + "'");

    var nowDate = new Date();
    var nowYears = nowDate.getFullYear().toString();// 当前年份
    var nowMonths = nowDate.getMonth() + 1;// 当前月份
    if (nowMonths < 10) {
        nowMonths = "0" + nowMonths.toString();
    }
    var nowDates = nowDate.getDate();// 当前日
    if (nowDates < 10) {
        nowDates = "0" + nowDates.toString();
    }
    var nowTime = nowDate.toLocaleTimeString().split(":");// 获取当前时间,时分秒
    var nowDatetimeNum = nowYears + nowMonths + nowDates
        + nowTime[0].toString() + nowTime[1].toString()
        + nowTime[2].toString();
    var nowDateNum = nowYears + nowMonths + nowDates;

    var tomorrowDate = new Date(nowDate.getTime() + 86400000);
    var tomorrowYears = tomorrowDate.getFullYear().toString();// 当前年份
    var tomorrowMonths = tomorrowDate.getMonth() + 1;// 当前月份
    if (tomorrowMonths < 10) {
        tomorrowMonths = "0" + tomorrowMonths.toString();
    }
    var tomorrowDates = tomorrowDate.getDate();// 当前日
    if (tomorrowDates < 10) {
        tomorrowDates = "0" + tomorrowDates.toString();
    }
    var tomorrowTime = tomorrowDate.toLocaleTimeString().split(":");// 获取当前时间,时分秒
    var tomorrowDatetimeNum = tomorrowYears + tomorrowMonths + tomorrowDates
        + tomorrowTime[0].toString() + tomorrowTime[1].toString()
        + tomorrowTime[2].toString();
    var tomorrowDateNum = tomorrowYears + tomorrowMonths + tomorrowDates;

    /* 为标题框加入日期显示 */
    document.getElementById("tdTodayTask").innerHTML = "";// tdTodayTask
    var tdTodayHtml = "&nbsp;&nbsp;今天的任务" + "（" + nowDate.toLocaleDateString()
        + "）";
    document.getElementById("tdTodayTask").innerHTML = tdTodayHtml;

    document.getElementById("tdTomorrowTask").innerHTML = "";// tdTomorrowTask
    var tdTomorrowHtml = "&nbsp;&nbsp;明天的任务" + "（"
        + tomorrowDate.toLocaleDateString() + "）";
    document.getElementById("tdTomorrowTask").innerHTML = tdTomorrowHtml;
    /* 构建显示表格的表头 */
    var tableHeader = "<table width='100%' cellpadding='0' cellspacing='0' class='weekdatalistdata'>"
        + "<tr align='center'  valign='middle' style=\"font-family: '宋体';font-size:12; color:'#0000CC'\">"
        + "<td width='65' >单天/跨天</td>"
        + "<td width='40' >类型</td>"
        + "<td width='123' >标题</td>"
        + "<td width='125' >开始时间</td>"
        + "<td width='125' >结束时间</td>"
        + "<td width='84' >优先级别</td>"
        + "<td width='54' >状态</td>"
        + "<td width='49' >完成率</td>"
        + "<td width='450' >内容</td>"
        + "<td width='30' >修改</td>"
        + "<td width='30' >删除</td></tr>";
    var todayTasktxt = "", tomorrowTasktxt = "", beforeTasktxt = "", afterTasktxt = "";
    if (myTaskLoadData != null && myTaskLoadData != undefined) {
        for (var i = 0; i < myTaskLoadData.length; i++) {
            try {
                var sid = myTaskLoadData[i].SID, caption = myTaskLoadData[i].SCAPTION,
                    startdate = myTaskLoadData[i].SSTARTDATE
                        .substring(0, 19), enddate = myTaskLoadData[i].SENDDATE
                        .substring(0, 19), priority = myTaskLoadData[i].SPRIORITY, content = myTaskLoadData[i].SCONTENT,
                    status = myTaskLoadData[i].SSTATUS, affairstype = myTaskLoadData[i].SAFFAIRSTYPE,
                    completerate = myTaskLoadData[i].SCOMPLETERATE, startdate_axis = myTaskLoadData[i].SSTARTDATE_AXIS,
                    senddate_axis = myTaskLoadData[i].SSENDDATE_AXIS, swhouser = myTaskLoadData[i].SWHOUSER;

                var stime, stime_a, stime_b, stime_c, stime_d, etime, etime_a, etime_b, etime_c, etime_d;
                stime_a = startdate.toString().substring(0, 10);
                stime_b = startdate.toString().substring(11, 19);
                stime_c = stime_a.split("-");
                stime_a = stime_c[0].toString() + stime_c[1].toString()
                    + stime_c[2].toString();
                stime_d = stime_b.split(":");
                stime_b = stime_d[0].toString() + stime_d[1].toString()
                    + stime_d[2].toString();

                etime_a = enddate.toString().substring(0, 10);
                etime_b = enddate.toString().substring(11, 19);
                etime_c = etime_a.split("-");
                etime_a = etime_c[0].toString() + etime_c[1].toString()
                    + etime_c[2].toString();
                etime_d = etime_b.split(":");
                etime_b = etime_d[0].toString() + etime_d[1].toString()
                    + etime_d[2].toString();
                stime = stime_a + stime_b;
                etime = etime_a + etime_b;
                var statusColor;
                if (status == "已完成") {
                    statusColor = "#3CB371";
                    status = "已完成";
                }
                if (!status || status == null || status == "null") {
                    if (nowDatetimeNum > etime) {
                        status = "已过期";
                        statusColor = "red";
                    }
                    if (nowDatetimeNum > stime && nowDatetimeNum < etime) {
                        status = "进行中";
                        statusColor = "#0000FF";
                    }
                    if (nowDatetimeNum < stime) {
                        status = "未开始";
                        statusColor = "#B5005A";
                    }
                }
                var Priority = convertPriority(priority);
                var priorityColor;
                if (priority == 0) {
                    priorityColor = "#000000";
                } else if (priority == 1) {
                    priorityColor = "#6F7274";
                } else if (priority == 2) {
                    priorityColor = "#00AA00";
                } else if (priority == 3) {
                    priorityColor = "#FF9933";
                } else if (priority == 4) {
                    priorityColor = "#FF0000";
                }
                var nDays = "单天";
                if (startdate_axis != senddate_axis) {
                    nDays = "跨天";
                }
                var Affairstype;
                if (affairstype == 4) {
                    Affairstype = "工作";
                } else {
                    Affairstype = "个人";
                }
                var title = Priority + "(" + status + ")";
                /* 将数据构建为HTML格式 */
                var tableHtml = "<tr align='center' style=\"font-family: '宋体';font-size:12\"><td>"
                    + nDays
                    + "</td>"
                    + "<td>"
                    + Affairstype
                    + "</td>"
                    + "<td><a title='"
                    + title
                    + "' href='javascript:void(0);' onclick='message_myTaskLooks(this)' sid='"
                    + sid
                    + "' saffairstype='"
                    + affairstype
                    + "' scaption='"
                    + caption
                    + "' sstartdate='"
                    + startdate
                    + "' senddate='"
                    + enddate
                    + "' spriority='"
                    + priority
                    + "' sstatus='"
                    + status
                    + "' scompleterate='"
                    + completerate
                    + "' scontent='"
                    + content
                    + "'>"
                    + caption
                    + "</a></td>"
                    + "<td>"
                    + startdate
                    + "</td>"
                    + "<td>"
                    + enddate
                    + "</td>"
                    + "<td><font color="
                    + priorityColor
                    + ">"
                    + Priority
                    + "</font></td>"
                    + "<td><font color="
                    + statusColor
                    + ">"
                    + status
                    + "</font></td>"
                    + "<td>"
                    + completerate
                    + "%</td>"
                    + "<td>"
                    + content
                    + "</td>"
                    + "<td><a href='javascript:void(0);' onclick='message_myTaskLooks(this)' sid='"
                    + sid
                    + "' saffairstype='"
                    + affairstype
                    + "' scaption='"
                    + caption
                    + "' sstartdate='"
                    + startdate
                    + "' senddate='"
                    + enddate
                    + "' spriority='"
                    + priority
                    + "' sstatus='"
                    + status
                    + "' scompleterate='"
                    + completerate
                    + "' scontent='"
                    + content
                    + "'><img src=img/up.png /></a></td>"
                    + "<td><a href='javascript:void(0);' onclick='myTaskDelete(this)' sid='"
                    + sid + "'><img src=img/del.png /></a></td></tr>";

                if (nowDateNum > etime_a && status != "已完成") {
                    todayTasktxt = todayTasktxt + tableHtml;
                } else if (nowDateNum >= stime_a && nowDateNum <= etime_a) {
                    todayTasktxt = todayTasktxt + tableHtml;
                }
                if (tomorrowDateNum >= stime_a && tomorrowDateNum <= etime_a) {
                    tomorrowTasktxt = tomorrowTasktxt + tableHtml;
                }
                if (tomorrowDateNum < stime_a) {
                    afterTasktxt = afterTasktxt + tableHtml;
                }
                if (nowDateNum > etime_a) {
                    beforeTasktxt = beforeTasktxt + tableHtml;
                }
            } catch (e) {
                continue;
            }
        }
    }
    document.getElementById("divTodayTask").innerHTML = tableHeader
        + todayTasktxt + "</table>";
    document.getElementById("divTomorrowTask").innerHTML = tableHeader
        + tomorrowTasktxt + "</table>";
    document.getElementById("divAfterTask").innerHTML = tableHeader
        + afterTasktxt + "</table>";
    document.getElementById("divBeforeTask").innerHTML = tableHeader
        + beforeTasktxt + "</table>";
}

function convertPriority(num) {
    var character;
    num = Number(num);
    switch (num) {
        case 0:
            character = "普通";
            break;
        case 1:
            character = "不重要/不紧急";
            break;
        case 2:
            character = "不重要/紧急";
            break;
        case 3:
            character = "重要/不紧急";
            break;
        case 4:
            character = "重要/紧急";
            break;
    }
    return character;
}

// 新建我的任务对话框
function message_addmyTask() {
    tlv8.portal.dailog.openDailog('新建我的任务',
        '/SA/personal/schedule/dialog/message_addMyTask.html', 800, 400,
        addmyTask, null);
}

function addmyTask() {// 回调函数
    myTaskLoad();
}

// 查看我的任务对话框
function message_myTaskLooks(obj) {
    obj$ = $(obj);
    var cid = encodeURIComponent(obj$.attr("sid"));
    var caffairstype = encodeURIComponent(obj$.attr("saffairstype"));
    var cstartdate = encodeURIComponent(obj$.attr("sstartdate"));
    var cenddate = encodeURIComponent(obj$.attr("senddate"));
    var ccaption = encodeURIComponent(obj$.attr("scaption"));
    var cstatus = encodeURIComponent(obj$.attr("sstatus"));
    var ccontent = encodeURIComponent(obj$.attr("scontent"));
    var cpriority = encodeURIComponent(obj$.attr("spriority"));
    var ccompleterate = encodeURIComponent(obj$.attr("scompleterate"));
    var itemSetInit = {
        refreshItem: false,
        enginItem: true,
        CanclItem: true
    };
    tlv8.portal.dailog.openDailog("查看我的任务",
        "/SA/personal/schedule/dialog/message_MyTaskLooks.html?sid=" + cid
        + "&saffairstype=" + caffairstype + "&scaption=" + ccaption
        + "&sstartdate=" + cstartdate + "&senddate=" + cenddate
        + "&spriority=" + cpriority + "&sstatus=" + cstatus
        + "&scompleterate=" + ccompleterate + "&scontent="
        + ccontent, 520, 320, myTaskLooks, itemSetInit);
    event.cancelBubble = true;// 阻止触发事件
}

function myTaskLooks() {// 回调函数
    myTaskLoad();
}

// 删除我的任务
function myTaskDelete(obj) {
    document.getElementById("textDelete").value = obj.sid;
    var dataDelete = new tlv8.Data();
    dataDelete.setDbkey("system");
    dataDelete.setTable("sa_psnmytask");
    dataDelete.setFormId("dataDelete");
    dataDelete.rowid = obj.sid;
    var result = dataDelete.deleteData();
    document.getElementById("textDelete").value = "";
    myTaskLoad();
}

// ****************导入导出页面grid
var currentgrid = null;

function importExport() {

}

// 查询数据-需传入3个值，字段名（列名）、表名和where条件，无where条件为""
function selectData(m, s, a, t) {
    let param = new tlv8.RequestParam();
    if (m) {
        param.set("m_num", m);
    }
    if (s) {
        param.set("s_num", s);
    }
    param.set("af", a || 0);
    if (t) {
        param.set("td", t);
    }
    let r = tlv8.XMLHttpRequest("/system/personal/schedule/loadData", param, "post", false);
    console.log(r);
    return r.data;
}

function openHelp() {

}

// tab选择事件
function tabselected(param) {
    if (param === "周期性事务") {

    }
}
