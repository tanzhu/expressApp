$(function(){
    var itemList = [];


    $('#fetch').click(function(e){
        var data = {};
        data.url = $("#url").val();
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: './reptile',	
            datetype: 'json',					
            success: function(data) {
                var btn = $("#subC");
                var btnList = $('#btnList');
                var htmlList = '';
                for(var item in data.itemList){
                    var newBtn = btn;
                    newBtn.removeClass("subC");
                    htmlList += newBtn.html(); 
                }
                btnList.html(btn);
            },
            error: function(error) {
                console.log('error');
            }
        });
    });
});	