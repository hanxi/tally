function getLocalTime(nS) {
    return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/,' ');
}

function toindex() {
    $("#index").show();
    $("#detail").hide();
    $("#add").hide();
    $.getJSON("/billlist", function(billlist){
        g_billlist = billlist;
        var addbutton = '<button class="button-primary" id="toaddview" >添加</button>';
        var data = [['物品','价格(元)','购买者', addbutton]];
        for (var i=0; i<billlist.length; i++){
            var item = billlist[i];
            if (item.hasOwnProperty("deletetime")) {
                var itemname = '<s>'+item.itemname+'</s>';
                var price = '<s>'+item.price+'</s>';
                var payman = '<s>'+item.payman+'</s>';
                data.push([itemname,price,payman,'<button class="button-primary" onclick="todetailview('+i+')" >详情</button>']);
            } else {
                data.push([item.itemname,item.price,item.payman,'<button class="button-primary" onclick="todetailview('+i+')" >详情</button>']);
            }
        }
        $("#billlist").empty();
        $.jsontotable(data, { id: '#billlist', className: 'ten columns' });
        $("#toaddview").click(toaddview);
    });
}

function todetailview(id) {
    $("#index").hide();
    $("#add").hide();
    $("#detail").show();
    detail = g_billlist[id];
    console.log(detail);
    $("#detaillist").html('<label for="itemname">物品</label>'
        + '<p class="u-full-width" id="itemname">'+detail.itemname+'</p>'
        + '<label for="price">价格(元)</label>'
        + '<p class="u-full-width" id="price">'+detail.price+'</p>'
        + '<label for="payman">购买者</label>'
        + '<p class="u-full-width" id="payman">'+detail.payman+'</p>'
        + '<label for="createtime">创建时间</label>'
        + '<p class="u-full-width" id="createtime">'+getLocalTime(detail.createtime)+'</p>');
    $("#delete").show();
    if (detail.hasOwnProperty("deletetime")) {
        $("#detaillist").append('<label for="deletetime">删除时间</label>'
            + '<p class="u-full-width" id="deletetime">'+getLocalTime(detail.deletetime)+'</p>');
        $("#delete").hide();
    }
    $("#delete").click(function () {
        var data = {
            "id": id
        }
        $.post("/deleteitem",data,function (response) {
            alert(response);
            toindex();
        });
    });
}

function toaddview() {
    $("#index").hide();
    $("#detail").hide();
    $("#add").show();
}

$(function() {
    toindex();
    $("[name=back]").click(toindex);
    $("#submitnewitem").click(function additem() {
        var itemname = $("#addlist > input[name='itemname']").val();
        var price = $("#addlist > input[name='price']").val();
        var selectvalue = $("#addlist > select[name='payman']").val();
        var payman = $("#addlist > select[name='payman'] option:selected").text();
        if (itemname.length<=0) {
            alert("请输入物品名称");
            return;
        }
        if (price=="") {
            alert("请输入价格");
            return;
        }
        if (!selectvalue) {
            alert("请选择购买者");
            return;
        }
        var data = {
            "itemname": itemname,
            "price": price,
            "payman": payman
        }
        $.post("/additem",data,function (response) {
            alert(response);
            toindex();
        });

        console.log(selectvalue,payman,itemname,price);
    });
});
