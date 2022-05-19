var operator, sparent, gridrowid

// 单击确定对话框
function dailogEngin() {
    $("#submit").click();
    return false;
}

// body 初始化
function initDialog() {
    operator = J_u_decode(tlv8.RequestURLParam.getParam("operator"));
    sparent = J_u_decode(tlv8.RequestURLParam.getParam("parent"));
    gridrowid = J_u_decode(tlv8.RequestURLParam.getParam("gridrowid"));
    if (operator == "edit") {
        $("#ssex").val($("#ssex").attr('value'));
        layui.form.render("select");
    }
    layui.form.on('submit(mainform)', function (data) {
        //console.log(JSON.stringify(data.field));
        var nCode = $("#scode").val();
        $.ajax({
            url: "/system/OPM/organization/psm_edit?operator=" + operator + "&parent=" + sparent + "&gridrowid=" + gridrowid,
            type: "post",
            async: true,
            data: data.field,
            dataType: "json",
            success: function (re, textStatus) {
                if (re.state == true) {
                    layui.layer.alert("保存成功！", function () {
                        tlv8.portal.dailog.dailogEngin(nCode);
                    });
                } else {
                    layui.layer.alert("保存失败：" + re.msg);
                }
            }
        });
        return false;
    });
}