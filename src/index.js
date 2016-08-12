/**
 * Created by linxiaojie on 2016/6/9.
 */
var common = require('./common'),
    app = require('./app'),
    Tab = require('./tab'),
    RefreshProxy = require('./refresh_proxy'),
    config = require('./config'),
    Toast = require('./toast'),
    renderDetail = require('./detail'),
    Press = require('./press');
require('./assets/css/sesosa.css');
Press.add(['search-btn', 'detail-btn', 'item-btn']);

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
    //tplId ='item-tpl',
    idx = url.indexOf('?'),
    qryObj = common.formatQuery(url.substr(idx + 1)),
    tab, defaultParam, refreshProxy, toast, searchUrl, type, $searchInput = $('.search-input'),
    $pages = $('.page'),
    recommends = {}, //推荐数据
    recommendTpl = 'recommend-tpl',
    initType = 'index' //初始显示的页面;
/*实例化RefreshProxy代理*/
refreshProxy = new RefreshProxy();

function renderApp(paramObj, data){
    var tplId ='item-tpl',
    _header = (function(obj){
        return $.extend({}, obj, {
            'f': paramObj.f,
            'sessionId': paramObj.sessionId,
            'D': paramObj.D,
            'q': paramObj.q,
            't': paramObj.t
        });
    })(data.header || {});
    return app.renderApp(tplId, _header, data.list);
}
function search(paramObj){
    paramObj = $.extend({}, defaultParam, paramObj);
    /*refreshProxy.clear();
    tab && tab.clear();*/
    clearSearch();
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
            var _data = data.results && data.results[tabName] || {},
                _header,
                html = '<div class="none">您搜索的关键词没有相关搜索结果，谢谢！</div>',
                d = $.extend({total: parseInt(_data.total || 0, 10)}, paramObj);
            if(d.total === 0){
                recommends.keyword = paramObj.q
                tab.render(app.render(recommendTpl, recommends), name);
                $('.recommend-tip').show();
                return;
            }
/*            _header = (function(obj){
                return $.extend({}, obj, {
                    'f': paramObj.f,
                    'sessionId': paramObj.sessionId,
                    'D': paramObj.D,
                    'q': paramObj.q,
                    't': paramObj.t
                });
            })(data.results.header || {});
            html = app.renderApp(tplId, _header, _data.list);*/
            tab.render(renderApp(paramObj, {
                header: data.results.header,
                list: _data.list
            }), name);
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
                    //var html = app.renderApp(tplId, _header, data.list);
                    tab.render(renderApp(paramObj, _data), name);
                }
            });
        };

        /*
         *搜索结果是游戏
         *在游戏选项卡内容上添加下拉刷新
         */
        if(isAppGame){
            activeTab = tabNames.game;
            paramObj.t = appGame;
            paramObj.mixed = 1;
            addScroll(searchUrl, data, activeTab, appGame);
        }
        /*
         *搜索结果是应用
         *在应用选项卡内容上添加下拉刷新
         */
        if(isAppSoftWare){
            activeTab = tabNames.soft;
            paramObj.t = appSoftWare;
            paramObj.mixed = 1;
            addScroll(searchUrl, data, activeTab, appSoftWare);
        }
        /*
         *搜索结果是混排json
         *在全部选项卡内容上添加下拉刷新
         */
        if(isAppGame && isAppSoftWare){
            activeTab = tabNames.all;
            paramObj.t = allApps;
            paramObj.mixed = 0;
            addScroll(searchUrl, data, activeTab, result);
        }
        tab.switchTab(tab.active);
        refreshProxy.forceStart(activeTab);
    })
}
function clearSearch(all){
    all && $searchInput.val('');
    refreshProxy.clear();
    tab && tab.clear();
}

/*
* 跳转到具体页面
* */
function switchPage(page){
    $pages.hide();
    $('.' + page).show();
}

function getSearchType(name){
    return name === tabNames.game ? appGame : name === tabNames.soft ? appSoftWare : allApps
}

/*
* 请求推举数据
* */
function reqRecommends(obj){
    var params = {
            t: allApps,
            f: 'C',
            imei: '',
            channelid: '',
            phone: '',
            storeId: ''
        };
    $.each(params, function(key){
        params[key] = obj[key] || params[key]
    });
    return common.req.get(common.resolve(common.api.recommend, params))
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
/*    qryObj.t = qryObj.t || allApps;
    if(qryObj.q){
        $searchInput.val(decodeURIComponent(qryObj.q));
        search(qryObj);
    }*/

    /*点击开始查询*/
    $('.page-index .search-btn').on('touchend', function(e){
        e.preventDefault();
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
        qryObj.t = allApps;/*默认搜索全部*/
        refreshProxy.clear();
        tab.clear();
        search(qryObj);
    });

    /*
    * 点击返回按钮显示搜索主界面
    * */
    $(document).delegate('.go-back', 'touchend', function(e){
        e.preventDefault();
        switchPage('page-index');
    });
    $(document).delegate('.js-show-search', 'touchend', function(e){
        e.preventDefault();
        clearSearch(1);
        switchPage('page-index');
    });

    $(document).delegate('.item', 'click', function(e){
        if($(e.target).hasClass('item-btn')){
            return ;
        }
        e.preventDefault();
        //e.preventDefault();
        switchPage('page-detail');
        renderDetail($(this).data('href'));
        //location.href = $(this).data('href');
    });

    /*初始加载*/
    qryObj.t = qryObj.t || allApps;
    initType = (qryObj.type || '').trim();
    if(initType){
        delete qryObj.type
    }
    if(initType === 'detail'){
        renderDetail(location.href);
        switchPage('page-detail');
    }else if(qryObj.q){
        $searchInput.val(decodeURIComponent(qryObj.q));
        search(qryObj);
        switchPage('page-index');
    }else{
        reqRecommends(qryObj).done(function(res){
            if(!res || !res.results){
                return
            }
            var list = res.results.list, html;
            if(list && list.length > 0){
                recommends = {
                    list: renderApp(qryObj, res.results)
                };
                html = app.render(recommendTpl, recommends);
                $.each(tabNames, function(key, name){
                    tab.render(html, name)
                })
            }
        })
        switchPage('page-index');
    }

    $('#container').show();
});
