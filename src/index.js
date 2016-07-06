/**
 * Created by linxiaojie on 2016/6/9.
 */
var common = require('./common'),
    app = require('./app'),
    Tab = require('./tab'),
    RefreshProxy = require('./refresh_proxy'),
    config = require('./config'),
    Toast = require('./toast');

require('./assets/css/sesosa.css');

var url = location.href,
    appGame = common.type.appGame,
    appSoftWare = common.type.appSoftWare,
    allApps = [appSoftWare, appGame].join(':'),
    result = common.type.all,
    tabNames = {
        all: 'all',
        game: 'game',
        soft: 'soft'
    },
    tplId ='item-tpl',
    idx = url.indexOf('?'),
    qryObj = common.formatQuery(url.substr(idx + 1)),
    tab, defaultParam, refreshProxy, toast, searchUrl, type, $searchInput = $('.search-input');
/*实例化RefreshProxy代理*/
refreshProxy = new RefreshProxy();

function search(paramObj){
    paramObj = $.extend({}, defaultParam, paramObj);
    tab && tab.clear()
    refreshProxy.clear();
    common.req.get(common.resolve(searchUrl, paramObj)).done(function(data){
        type = paramObj.t;
        if(type === void 0 || type === '' || type === null){
            throw Error('请求url分类参数不能为空')
        }
        /*
         * TabContent首屏数据初始化，添加refresh
         */
        var isAppGame = type.indexOf(common.type.appGame) > -1,
            isAppSoftWare = type.indexOf(common.type.appSoftWare) > -1,
            activeTab = 'all';

        /*
         * 首屏渲染并添加refresh,通过代理添加不同TAB上的scroll下拉刷新事件
         * param{String}url: 请求数据地址
         * param{Object}data: 请求参数
         * param{String}name: 分类标志名称
         * param{String}tabName: tab对应的名称
         * */
        function addScroll(url, data, name, tabName){
            var _data = data.results[tabName],
                _header,
                html, d = $.extend({total: parseInt(_data.total, 10)}, paramObj);
            if(d.total === 0){
                return;
            }
            _header = (function(obj){
                return $.extend({}, obj, {
                    'f': paramObj.f,
                    'sessionId': paramObj.sessionId,
                    'D': paramObj.D,
                    'q': paramObj.q,
                    't': paramObj.t
                });
            })(data.results.header || {});
            html = app.renderApp(tplId, _header, _data.list);
            tab.render(html, name);
            /*
             * render: 滚动的刷新函数
             * */
            refreshProxy.addScroll({
                url: url,
                data: d,
                name: name,
                container: '.tab-content li[data-name="' + name + '"]',
                content: '.items',
                render: function(res, name){
                    var data = name === tabNames.all ? res[result] : name === tabNames.game ? res[appGame] : res[appSoftWare];
                    //console.log(_header);
                    var html = app.renderApp(tplId, _header, data.list);
                    tab.render(html, name);
                }
            });
        };

        /*
         *搜索结果是游戏
         *在游戏选项卡内容上天下下拉刷新
         */
        if(isAppGame){
            activeTab = tabNames.game;
            paramObj.t = appGame;
            paramObj.mixed = 1;
            addScroll(searchUrl, data, activeTab, appGame);
        }
        /*
         *搜索结果是应用
         *在应用选项卡内容上天下下拉刷新
         */
        if(isAppSoftWare){
            activeTab = tabNames.soft;
            paramObj.t = appSoftWare;
            paramObj.mixed = 1;
            addScroll(searchUrl, data, activeTab, appSoftWare);
        }
        /*
         *搜索结果是混排json
         *在全部选项卡内容上天下下拉刷新
         */
        if(isAppGame && isAppSoftWare){
            activeTab = tabNames.all;
            paramObj.t = allApps;
            paramObj.mixed = 0;
            addScroll(searchUrl, data, activeTab, result);
        }
        tab.switchTab(activeTab);
        refreshProxy.forceStart(activeTab);
    })
}

$(function(){
    /*toast实例化*/
    toast = new Toast({
        el: document.body
    });

    /*选项卡实例化*/
    tab = new Tab({
        el: '.tab-wrapper',
        active: 'all'
    });
    tab.on('tab.switch', function (e, name) {
        refreshProxy.start(tab.active)
    });

    /*数据加载*/
    searchUrl = common.api.search;
    defaultParam = config.getDefaultParam();


    /*初始加载*/
    qryObj.t = qryObj.t || allApps;
    if(qryObj.q){
        $searchInput.val(decodeURIComponent(qryObj.q));
        search(qryObj);
    }

    /*点击开始查询*/
    $('.search-btn').on('click', function(){
        var $el = $(this);
        if($el.data('lock')){
            return;
        }
        $el.data('lock', 1);
        setTimeout(function(){
            $el.data('lock', 0)
        }, 1000);
        var val = $searchInput.val().trim();
        if(val === ''){
            toast.show('请输入名称搜索');
            return;
        }
        qryObj.q = val;
        qryObj.pid = 1;
        tab.clear();
        refreshProxy.clear();
        search(qryObj);
    });

    $(document).delegate('.item-btn', 'click', function(e){
        e.preventDefault();
        location.href = $(this).data('href');
    });

    $('#container').show();
});