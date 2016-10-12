/**
 * Created by linxiaojie on 2016/9/27.
 */
var common = require('./common'),
    app = require('./app');
var defStoreIds = ['125','126','127'];// all, game, soft
var defStoreNames = ['all', 'game', 'soft'];
/*
 * 请求推荐数据
 * */
function _renderRecommends(renderApp, params, tab, tabName, keyword){
    var index = defStoreNames.indexOf(tabName);
    if(~index){
        keyword = keyword || ''
        var deferred = $.Deferred();
        params.act = 1;
        params.storeId = defStoreIds[index];
        _reqRecommends(params, function(res, params){
            var results = res.results, list = results.list || [], html;
            html = app.render('recommend-tpl', {
                keyword: keyword,
                list: renderApp($.extend(params, results.header), results)
            });
            tab.render(html, tabName)
        }).always(function(){
            deferred.resolve();
        })
    }else{
        deferred.resolve()
    }
    return deferred
}

function _reqRecommends(params, render){
    return common.req.get(common.resolve(common.api.recommend, params)).done(function(res){
        if(!res || !res.results){
            res = {
                results: {
                    list: []
                }
            }
        }
        render(res, params)
    });
}

function _setStoreIds(){
    var url = location.href,
        idx = url.indexOf('?'),
        qryObj = common.formatQuery(url.substr(idx + 1)),
        ids = (qryObj.storeId || '').split(',');
    common.each(ids, function(val, idx){
        val && (defStoreIds[idx] = val )
    })
}

module.exports = {
    renderRecommends: _renderRecommends,
    reqRecommends: _reqRecommends,
    setStoreIds: _setStoreIds
}