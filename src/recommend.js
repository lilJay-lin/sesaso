/**
 * Created by linxiaojie on 2016/10/12.
 */
require('./assets/css/recommend.css');
var common = require('./lib/common'),
    app = require('./lib/app'),
    config = require('./config'),
    Recommend = require('./lib/recommend')
    url = location.search.substr(1) || '',
    qryObj = common.formatQuery(url),
    params = $.extend({}, config.getDefaultParam(), qryObj),
    $constainer = $('.recommends');

function startReqRecommend(params){
    params.act = 1;
    Recommend.reqRecommends(params, function(res, params){
        var results = res.results, list = results.list || [], html;
        html = app.renderApp('recommend-tpl', params, list);
        $constainer.html(html);
    })
}

/*
* 开始请求加载数据
* */
startReqRecommend(params);