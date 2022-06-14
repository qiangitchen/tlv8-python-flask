let saffairstype = 0;

//页面载入执行
function onloadset() {
    document.getElementById("swhouser").value = tlv8.Context.getCurrentPersonID();
    let coordinate_id = tlv8.RequestURLParam.getParam("coordinate_id");//单元格ID
    if (!coordinate_id || coordinate_id === "") {
        saffairstype = 3;
        return;
    }
    let loadMondaydate = tlv8.RequestURLParam.getParam("loadMondaydate");//周一日期毫秒数
    let weekday = coordinate_id.toString().substring(1, 2);
    let needHours = coordinate_id.toString().substring(3);
    if (needHours < 10) {
        needHours = "0" + needHours.toString();
    }
    let gap = weekday - 1;//与周一相差天数
    let needDate = new Date(loadMondaydate * 1 + 86400000 * gap);
    let needYears = needDate.getFullYear().toString();//年份
    let needMonths = needDate.getMonth() + 1;//月份
    if (needMonths < 10) {
        needMonths = "0" + needMonths.toString();
    }
    let needDates = needDate.getDate();//日
    if (needDates < 10) {
        needDates = "0" + needDates.toString();
    }
    let startDatetime = needYears + "-" + needMonths + "-" + needDates + " " + needHours + ":00:00";
    let endDatetime = needYears + "-" + needMonths + "-" + needDates + " " + needHours + ":59:00";
    document.getElementById("sstartdate").value = startDatetime;
    document.getElementById("senddate").value = endDatetime;
    document.getElementById("scaption").focus();
}

$(document).ready(function () {
    let affairsID = tlv8.RequestURLParam.getParam("sid");
    if (!affairsID || affairsID === "") {
        onloadset();
        setTextdata();
    }
});

//日期框失去焦点时执行
function setTextdata() {
    if (saffairstype === 3) {
        return;
    }
    let statertime = J$("sstartdate").value;//开始时间
    let endtime = J$("senddate").value;//结束时间
    let stime_a, stime_b, stime_c, stime_d;
    let etime_a, etime_b, etime_c, etime_d;
    try {
        if (statertime !== "" || statertime != null || statertime !== "null") {
            stime_a = statertime.toString().substring(0, 10);
            stime_b = statertime.toString().substring(11, 19);
            stime_c = stime_a.split("-");
            stime_a = stime_c[0].toString() + stime_c[1].toString() + stime_c[2].toString();
            stime_d = stime_b.split(":");
            stime_b = stime_d[0].toString() + stime_d[1].toString() + stime_d[2].toString();
            J$("sstartdate_axis").value = stime_a;
        }
    } catch (e) {
    }

    try {
        if (endtime !== "" || endtime != null || endtime !== "null") {
            etime_a = endtime.toString().substring(0, 10);
            etime_b = endtime.toString().substring(11, 19);
            etime_c = etime_a.split("-");
            etime_a = etime_c[0].toString() + etime_c[1].toString() + etime_c[2].toString();
            etime_d = etime_b.split(":");
            etime_b = etime_d[0].toString() + etime_d[1].toString() + etime_d[2].toString();
            J$("ssenddate_axis").value = etime_a;
        }
    } catch (e) {
    }
    J$("saffairstype").value = 2;
    try {
        if ((stime_a) === (etime_a)) {
            let coorStime = statertime.toString().substring(0, 10);
            let coortime = Number(stime_a = statertime.toString().substring(11, 13));
            let coorStime_a = coorStime.split("-");
            let coordate = new Date(coorStime_a[0], coorStime_a[1] - 1, coorStime_a[2]);
            let coorday = coordate.getDay();
            if (coorday === 0) {
                coorday = 7;
            }
            J$("saffairstype").value = 1;
        } else if (stime_a !== etime_a) {
            J$("saffairstype").value = 2;
        }
    } catch (e) {
    }
}