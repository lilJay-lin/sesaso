/**
 * Created by linxiaojie on 2016/6/9.
 */
/*搜索默认值*/
var _defaultParam = {
    q: '',/*用户输入的搜索关键字，该字段为空时则搜索全部 */
    t: 'appGame:appSoftWare',/*业务数据分类*/
    ps: 10,/*每页显示数量*/
    pid: 1,/*查询的当前页码数*/
    f: 'C',/*搜索发起者的来源*/
    D: '',/*终端的UA信息*/
    mixed: 0,
    sessionId: '',/*用户会话ID*/
    sortGoodsNum: this.ps,/*MO混排结果中各分类返回的结果数*/
    act: 0
};
module.exports = {
    pageSize: 4,
    detailHtml: 'detail.html',
    /*设置defaultParam*/
    set: function(name, value){
        _defaultParam[name] = value
    },
    /*获取defaultParam具体参数*/
    get: function(name){
        return _defaultParam[name]
    },
    getDefaultParam: function(){
        return $.extend({}, _defaultParam);
    }
};