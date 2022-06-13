var operator, type;

// 单击确定对话框
function dailogEngin() {
    $("#submit").click();
    return false;
}

// body 初始化
function initDialog() {
    type = J_u_decode(tlv8.RequestURLParam.getParam("type"));
    operator = J_u_decode(tlv8.RequestURLParam.getParam("operator"));
    if (operator !== "edit") {
        $("#sorgkindid").val(type);
        $("#sorgkindid").attr("disabled", "disabled");
        layui.form.render("select");
    }

    layui.form.on('submit(mainform)', function (data) {
        //console.log(JSON.stringify(data.field));
        var nCode = $("#scode").val();
        $.ajax({
            url: "/system/OPM/organization/org_edit?operator=" + operator,
            type: "post",
            async: true,
            data: data.field,
            dataType: "json",
            success: function (re, textStatus) {
                if (re.state === true) {
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