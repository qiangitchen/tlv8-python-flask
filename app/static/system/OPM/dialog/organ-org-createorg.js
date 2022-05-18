var operator;

// 单击确定对话框
function dailogEngin() {
    if (operator != "edit") {
        $("#sfname").val(sfname + "/" + $("#SNAME").val());
        $("#sfcode").val(sfcode + "/" + $("#SCODE").val());
        $("#SFID").val(sfid + "/" + rowid + "." + type);
    }
    $("#submit").click();
    return false;
}

// body 初始化
var name, rowid, scode, sfid, sfname, sfcode, sparent, type, gridrowid;

function initDialog() {
    name = J_u_decode(tlv8.RequestURLParam.getParam("name"));
    rowid = J_u_decode(tlv8.RequestURLParam.getParam("rowid"));
    scode = J_u_decode(tlv8.RequestURLParam.getParam("scode"));
    sfname = J_u_decode(tlv8.RequestURLParam.getParam("sfname"));
    sfcode = J_u_decode(tlv8.RequestURLParam.getParam("sfcode"));
    sparent = J_u_decode(tlv8.RequestURLParam.getParam("sparent"));
    sfid = J_u_decode(tlv8.RequestURLParam.getParam("sfid"));
    type = J_u_decode(tlv8.RequestURLParam.getParam("type"));
    operator = J_u_decode(tlv8.RequestURLParam.getParam("operator"));
    if (!scode || scode == undefined || scode == "null")
        scode = "";
    if (!sfname || sfname == undefined || sfname == "null")
        sfname = "";
    if (!sfcode || sfcode == undefined || sfcode == "null")
        sfcode = "";
    if (!sfid || sfid == undefined || sfid == "null")
        sfid = "";
    if (operator != "edit") {
        $("#sorgkindid").val(type);
        $("#svalidstate").val("1");
        $("#sorgkindid").attr("disabled", "disabled");
        layui.form.render("select");
    }
    if (rowid && rowid != "" && rowid != "undefined") {
        $("#sparent").val(rowid);
    }
    gridrowid = tlv8.RequestURLParam.getParam("gridrowid");
    if (gridrowid && gridrowid != "") {
        J$("org_create_form").rowid = gridrowid;
        J$("org_create_form").setAttribute("rowid", gridrowid);
        $("#org_create_form").attr("rowid", gridrowid);
    }

    layui.form.on('submit(mainform)', function (data) {
        console.log(JSON.stringify(data.field));
        var nCode = $("#scode").val();
        $.ajax({
            url: "/system/OPM/organization/org_edit?operator=" + operator,
            type: "post",
            async: true,
            data: data.field,
            dataType: "json",
            success: function (re, textStatus) {
                if (re.state == true) {
                    layui.layer.alert("保存成功！", function () {
                        tlv8.portal.dailog.dailogEngin(nCode);
                    })
                } else {
                    layui.layer.alert("保存失败：" + re.msg);
                }
            }
        });
        return false;
    });
}

function afRefresh(event) {

}

function validateboxdacg(obj) {

}