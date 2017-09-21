$(function(){
    var itemList = [];


    $('#fetch').click(function(e){
        $('#btnList').html();
        var data = {};
        data.url = $("#url").val();
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: './reptile',	
            datetype: 'json',					
            success: function(data) {
                showButtonList(data.itemList);
            },
            error: function(error) {
                console.log('error');
            }
        });
    });

    $("#btnList").delegate(".subD", "click", function() { 
        var name = $(this).html();
        var url  = $(this).attr("data-url");
        window.location.href = "./detail?name=" + encodeURI(name) + "&url=" + encodeURI(url);
        
    });
});	

function showButtonList(itemList){
    var btn = $(".subC").clone();
    var htmlList = '';
    for(var i = 0; i < itemList.length; i++){
        var item = itemList[i];
        var newBtn = btn;
        newBtn.removeClass("subC");
        newBtn.removeAttr("display");
        newBtn.html(item.name);
        newBtn.attr("data-url", item.url)
        newBtn.addClass("subD")
        htmlList += newBtn.prop("outerHTML");
    }
    $('#btnList').html(htmlList);
}