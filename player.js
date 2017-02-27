(function () {

    var that = {};

    // css动画方法
    var CSS3 = {
        transitionCss3: function(t){
            var text = 'left '+ t +'s ease, top '+ t +'s ease';
            return text;
       },
       fadeOutCss3: function(t){
            var text = 'fadeOut '+ t +'s';
            return text;
       }
    };

    // 事件绑定函数
    var Core = {
        _style: document.documentElement.style || document.createElement('div').style,
        addEvent: function (node, arr) {
            if (!node[0] || !arr) {
                return;
            }
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[0] === undefined) {
                    break;
                }
                var a = arr[i][0],
                    b = arr[i][1],
                    c = arr[i][2];
                node.off(a, b, c);
                node.on(a, b, c);
            }
        },
        // 判断是否支持css3属性；
        supportsCss3: function(prop){
            // return false;
            if(that.prop){
                return true;
            }
            var vendors = 'Khtml|Ms|O|Moz|Webkit'.split('|'),
            len = vendors.length;

            if(prop in Core._style){
                that.prop = true;
                return true;
            }
            prop = prop.replace(/^[a-z]/, function (val) {
                return val.toUpperCase();
            });
            while (len--){
                if(vendors[len] + prop in Core._style){
                    that.prop = true;
                    return true;
                }
            }
            return false;
        },
        // 将css3属性转化成对应的Js名称；
        getJsCssName: function (name){
        var prefixes = ['', '-ms-','-moz-', '-webkit-', '-khtml-', '-o-'];

        var newName = (function (name, target, test){
              target = target || Core._style;

              for (var i=0, l=prefixes.length; i < l; i++) {
                test = (prefixes[i] + name).replace(/-([a-z])/g, function($0,$1){
                    return $1.toUpperCase();
                });

                if(test in target){
                  return test;
                }
              }

              return null;
            })(name);

        return newName;
      }
    };

    var css3transition = Core.getJsCssName('transition'),
        css3animation =  Core.getJsCssName('animation');

    //动画算法
    jQuery.extend(jQuery.easing, {
        easeInOutQuad: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t + b;
            }
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    });

    var Player = {
        screenNum: 0, // 滚动的屏数
        cut: false,
        _auto: true,
        num: 3,
        tabCurNum: 0,
        _time: 3,
        _speed: '',
        type: 'rollLeft',
        auto: function () {
            if(!Player._auto){
                return;
            }
            Player.st && clearTimeout(Player.st);
            Player.st = setTimeout(function () {
                Player.playFuns('next');
            }, Player._time*1000);
        },
        next: function () {
            Player.playFuns('next');
        },
        prev: function () {
            Player.playFuns('prev');
        },
        // 单击切换,会根据不同的type，来执行对应的效果；
        clickTab: function () {
            var num = parseInt($(this).attr('num'), 0);
            if (num == Player.screenNum) { // 单击当前tab，阻止执行
                return;
            }
            if (Player.cut) {
                return;
            }
            Player.cut = true; // 一次滚动结束，点击方可生效
            //tab当前高亮，切换
            Player._tabFirst.removeClass('cur');
            $(this).addClass('cur');
            Player._tabFirst = $(this);
            // 执行动画切换
            Player.screenNum = -num;

            if(Player.type == 'rollLeft'){
                Player.rollLeftFuns(Player._stepWidth * Player.screenNum, 'left');
                return;
            }
            if(Player.type == 'rollUp'){
                Player.rollLeftFuns(Player._stepHeight * Player.screenNum, 'top');
                return;
            }
            if(Player.type == 'tab'){
                Player.tabFuns(num);
                Player.screenNum = num;
                return;
            }
            if(Player.type == 'fadeOutIn'){
                Player.fadeOutFuns(num);
                Player.screenNum = num;
                return;
            }
        },
        // 自动播放,会根据不同的type，来执行对应的效果；
        playFuns: function (s) {
            var _self = Player;
            if (_self.cut) {
                return;
            }
            _self.cut = true;

            if(_self.type == 'rollLeft'){
                _self.scrollFuns(s, 'left', _self._stepWidth);
            }
            if(_self.type == 'rollUp'){
                _self.scrollFuns(s, 'top', _self._stepHeight);
            }
            if(_self.type == 'tab' || _self.type == 'fadeOutIn'){
                if(s == 'next'){
                    ++_self.screenNum;
                    if(_self.screenNum >= _self.num ){
                    _self.screenNum = 0;
                }
                }else{
                    --_self.screenNum;
                    if(_self.screenNum < 0){
                        _self.screenNum = _self.num + _self.screenNum;
                    }
                }

                if(_self.type == 'fadeOutIn'){
                    _self.fadeOutFuns(_self.screenNum);
                }else{
                    _self.tabFuns(_self.screenNum);
                }
                return;
            }
        },
        // 针对左滚、上滚进行轮播判断
        scrollFuns: function(s, dir, setp){
            var _self = this;

            if (s == 'next') {
                _self.l = (--_self.screenNum) * setp;
            } else {
                _self.l = (++_self.screenNum) * setp;
                if (_self.screenNum == 1) {
                    _self.l = -_self.num * setp;
                    _self.imgPlayWrap.attr("style", '');
                    //想要在第一屏情况下，右滚，需要先变更left值，直接展示最后一屏（这一屏是复制第1屏而来）；
                    if(dir == 'left'){
                        _self.imgPlayWrap.css({
                            left: _self.l + 'px'
                        });
                    }

                    if(dir == 'top'){
                        _self.imgPlayWrap.css({
                            top: _self.l + 'px'
                        });
                    }
                    _self.screenNum = -_self.num + 1;
                    _self.l = _self.screenNum * setp;
                }
            }

            setTimeout(function(){
                if(Core.supportsCss3('transition')){
                    _self.imgPlayWrap[0].style[css3transition] = CSS3.transitionCss3(Player._speed);
                }
                _self.rollLeftFuns(_self.l, dir);
            }, 5);
        },
        _rollSid: '',
        // 左滚、上滚 动画函数
        rollLeftFuns: function (lt, dir) {
            var _self = Player;

            _self.switchTab(_self.screenNum);

            var dirJson = {
                left: lt + 'px'
            };
            var cycle = {
                left: '0px'
            };

            if(dir == 'top'){
                dirJson = {
                    top: lt + 'px'
                };
                cycle = {
                    top: '0px'
                };
            }

            // css3
            if(Core.supportsCss3('animation')){
                _self.imgPlayWrap[0].style[css3transition] = CSS3.transitionCss3(Player._speed);
                if(dir == 'left'){
                    _self.imgPlayWrap.css('left', lt + 'px');
                }else{
                    _self.imgPlayWrap.css('top', lt + 'px');
                }

                _self._rollSid && clearTimeout(_self._rollSid);
                _self._rollSid = setTimeout(function(){
                    _self.cut = false;
                    if (Math.abs(_self.screenNum) == _self.num) {
                        _self.imgPlayWrap.attr("style", '');
                        _self.imgPlayWrap.css(cycle);
                        _self.screenNum = 0;
                    };
                    _self.auto();
                },700);
                return;
            }
            // js
            _self.imgPlayWrap.animate(dirJson,
            {
                duration: Player._speed*1000,
                easing: 'easeInOutQuad',//easeInOutQuad() | easeInOutCubic | easeInOutElastic
                complete: function () {
                    _self.cut = false;
                    // 滚动到最后一屏(即由第1屏复制来的最后1屏)时，left值归0px,开始下一周期的滚动。
                    if (Math.abs(_self.screenNum) == _self.num) {
                        $(this).css(cycle);
                        _self.screenNum = 0;
                    }
                    _self.auto();
                }
            });
        },
        //切换
        tabFuns: function(num){
            this.switchTab(num);
            this.WrapListFirst.style.display = 'none';
            this.imgPlayWrapList[num].style.display = 'block';
            this.WrapListFirst = this.imgPlayWrapList[num];
            this.screenNum = num;
            this.cut = false;
            this.auto();
        },
        // 淡入淡出
        fadeOutFuns: function(num){
            var me = this;
            me.switchTab(num);
            me.imgPlayWrapList[num].style.zIndex = 1;

            if(Core.supportsCss3('animation')){
                me.WrapListFirst.style[css3animation] = CSS3.fadeOutCss3(Player._speed);
                return;
            }

            $(me.WrapListFirst).fadeOut(me._speed*1000, function(){
                $(this).css('z-index', 0).css('display', '');
                me.imgPlayWrapList[num].style.zIndex = 2;
                me.WrapListFirst = me.imgPlayWrapList[num];
                me.cut = false;
                me.auto();
            });
        },
        css3fadeOut: function(e){
            var num = Player.screenNum;
            $(this).attr('style','').css('z-index', 0).css('display', '');
            Player.imgPlayWrapList[num].style.zIndex = 2;
            Player.WrapListFirst = Player.imgPlayWrapList[num];
            Player.cut = false;
            Player.auto();
        },
        // tab高亮自动切换
        switchTab: function (n) {
            n = Math.abs(n);
            if (n == Player.num) {
                n = 0;
            }
            var curTab = $(Player.imgPlayTab[n]);
            Player._tabFirst.removeClass('cur');
            curTab.addClass('cur');
            Player._tabFirst = curTab;
        },
        stop: function () {
            Player.st && clearTimeout(Player.st);
        },
        bindFuns: function () {

            var arr = [
                ['mouseenter', '.imgPlay_wrap, .imgPlay_tab', Player.stop],
                ['mouseleave', '.imgPlay_wrap, .imgPlay_tab', Player.auto],
                ['click', '.next', Player.next],
                ['click', '.prev', Player.prev],
                ['click', '.go', Player.clickTab],
                ['webkitAnimationEnd', 'ul', Player.css3fadeOut] //animationstart | animationiteration
            ];

            Core.addEvent(this.imgPlay, arr);
        },
        init: function (param) {
            this.type = param.type;
            this._time = param.time;
            this._speed = parseInt(param.speed, 10) || 0.7;
            this.imgPlay = $('#imgPlay');
            this.imgPlayWrap = this.imgPlay.find('.imgPlay_wrap');
            this.imgPlayTab  = this.imgPlay.find('.imgPlay_tab').find('li'); // 获取tab列表
            this._tabFirst = this.imgPlayTab.first();
            this.imgPlayWrapList = this.imgPlayWrap.find('ul');
            this.WrapListFirst = this.imgPlayWrapList.get(0);
            this.imgPlayWrap.addClass(this.type);

            if(this.type == 'rollLeft' || this.type == 'rollUp'){
                var firstDate = $.clone(this.WrapListFirst);
                this.imgPlayWrap.append(firstDate);
                this.imgPlayScroll = this.imgPlay.find('.imgPlay_scroll');
                this._stepWidth  = this.imgPlayScroll.outerWidth() + 10;
                this._stepHeight = this.imgPlayScroll.outerHeight();
                if(Core.supportsCss3('transition')){
                  this.imgPlayWrap[0].style[css3transition] = CSS3.transitionCss3(Player._speed);
                }
            }
            if(this.type == 'fadeOutIn'){
                this.WrapListFirst.style.zIndex = 2;
            }
            if(this.type == 'tab'){
                this.WrapListFirst.style.display = 'block';
            }
            this.bindFuns();

            if(parseInt(param.autoPlay, 10)){
                Player.auto();
            }else{
                Player._auto = false;
            }
        }
    };

    window.Player = Player;
    // Player.init({
    //  type: 'rollLeft', //rollUp | rollLeft | tab | fadeOutIn
    //  time: 3, //秒
    //  speed: 800, //毫秒
    //  autoPlay: 1
    // });
})();