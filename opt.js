(function () {
    var that = {};
    function getUrlJson(){
        var aQuery = window.location.href.split("?")[1],
              json = {};
        if(aQuery){
            var aQueryArr = aQuery.split("&"),
                keyValue, key, val,
                len = aQueryArr.length;

            for(var i=0; i<len; i++){
                keyValue = aQueryArr[i].split("=");
                key = keyValue[0];
                val = keyValue[1];
                if(!key) continue;
                json[key] = val;
            }
        }
        return json;
    }

    var query = getUrlJson();
    window.Q = query;

    Player.init({
        type: query["type"], //rollUp | rollLeft | tab | fadeOutIn
        time: query['time'], //秒
        speed: query['speed'], //毫秒
        autoPlay: query['autoPlay']
    });

    var funsInit = function(query){
        var autohtml = [
        '<script type="text/javascript">\r\n',
            'Player.init({\r\n',
                'type: "'+ query.type +'",\r\n', //rollUp | rollLeft | tab | fadeOutIn
                'time: '+ query.time +',\r\n', //秒
                'speed: '+ query.speed +',\r\n', //毫秒
                'autoPlay: '+ query.autoPlay +'\r\n',
            '});',
        '</script>'
        ].join('');

        return autohtml;
    };

    //
    var temp = [
        '<!doctype html>\r\n',
            '<html>\r\n',
               '<head>\r\n',
                    '<title>图片</title>\r\n',
                    '<meta charset="utf-8">\r\n',
                    '<link href="http://static.qhimg.com/!c957e3af/reset.css" rel="stylesheet">\r\n',
                    '<link rel="stylesheet" type="text/css" href="player.css">\r\n',
                    '<script src="http://s0.qhimg.com/lib/jquery/183.js"></script>\r\n',
                '</head>\r\n',
                '<body>\r\n',
                    '<section>',
                        '<div id="imgPlay" class="imgPlay">\r\n',
                           '<div class="imgPlay_tab">\r\n',
                                '<ul>\r\n',
                                    '<li class="cur go" num="0"></li>\r\n',
                                    '<li class="go" num="1"></li>\r\n',
                                    '<li class="go" num="2"></li>\r\n',
                                '</ul>\r\n',
                                '<a href="javascript:void(0);" class="prev">prev</a>\r\n',
                                '<a href="javascript:void(0);" class="next">next</a>\r\n',
                            '</div>\r\n',
                            '<div class="imgPlay_scroll">\r\n',
                                '<div class="imgPlay_wrap">\r\n',
                                    '<ul>\r\n',
                                       '<li><a href=""><img src="image/pic1.jpg"><p>1</p></a></li>\r\n',
                                       '<li><a href=""><img src="image/pic2.jpg"><p>2</p></a></li>\r\n',
                                       '<li><a href=""><img src="image/pic3.jpg"><p>3</p></a></li>\r\n',
                                       '<li><a href=""><img src="image/pic4.jpg"><p>4</p></a></li>\r\n',
                                       '<li><a href=""><img src="image/pic5.jpg"><p>5</p></a></li>\r\n',
                                    '</ul>\r\n',
                                    '<ul>\r\n',
                                        '<li><a href=""><img src="image/pic6.jpg"><p>6</p></a></li>\r\n',
                                        '<li><a href=""><img src="image/pic7.jpg"><p>7</p></a></li>\r\n',
                                        '<li><a href=""><img src="image/pic8.jpg"><p>8</p></a></li>\r\n',
                                        '<li><a href=""><img src="image/pic9.jpg"><p>9</p></a></li>\r\n',
                                        '<li><a href=""><img src="image/pic10.jpg"><p>10</p></a></li>\r\n',
                                    '</ul>\r\n',
                                    '<ul>\r\n',
                                       '<li><a href=""><img src="image/pic11.jpg"><p>11</p></a></li>\r\n',
                                       '<li><a href=""><img src="image/pic12.jpg"><p>12</p></a></li>\r\n',
                                       '<li><a href=""><img src="image/pic13.jpg"><p>13</p></a></li>\r\n',
                                       '<li><a href=""><img src="image/pic14.jpg"><p>14</p></a></li>\r\n',
                                       '<li><a href=""><img src="image/pic15.jpg"><p>15</p></a></li>\r\n',
                                   '</ul>\r\n',
                                '</div>\r\n',
                            '</div>\r\n',
                        '</div>\r\n',
                    '</section>\r\n',
                    '<script type="text/javascript" src="player.js"></script>\r\n',
                    ''+ funsInit(query) +'\r\n',
                '</body>\r\n',
           ' </html>\r\n'
    ].join('');
    $('#source').val(temp);
})();