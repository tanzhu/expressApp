$(function(){



    $('#fetch').click(function(e){
        var data = {};
        data.url = $("#url").val();
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'http://localhost:3000/reptile',						
            success: function(data) {
                console.log('success');
                console.log(JSON.stringify(data));
            }
        });
    });
});	