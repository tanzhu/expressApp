exports.getSuffix = function(url){
    var stringList = url.substring(0, url.indexOf("?")==-1?url.length:url.indexOf("?") ).split("/");
    for(var i = stringList.length - 1; i > 0 ; i--){
        if(stringList[i] == "") continue;
        return suffix = stringList[i];
    }
}