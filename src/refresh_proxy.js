/**
 * Created by liljay on 2016/6/7.
 */
var Refresh = require('./refresh');
var common = require('./common');
function RefreshProxy(){
    this.name = ''
}

RefreshProxy.prototype = {
    constructor: RefreshProxy,
    refreshes: {},
    /*实例化refresh*/
    addScroll: function(obj){
        var me = this,
            name = obj.name,
            refresh = me.refreshes[name];
        if(!refresh){
            refresh = new Refresh(obj);
            me.refreshes[name] = refresh;
        }
        return refresh;
    },
    /*设置应用某个refresh到window.scroll上*/
    start: function (name) {
        var me = this,
            oldName = me.name;
        if(oldName !== name){
            me.destroy();
            var rf = me.refreshes[oldName];
            /*记住滚动位置*/
            //rf.latestScrollTop = window.scrollTop;
            rf && rf.destroy();
            var newRf = me.refreshes[name] || me.addScroll({name: name});
            newRf.start();
            this.name = name;
        }
    },
    /*清除所有refresh*/
    clear: function (){
        this.destroy();
        this.refreshes = {};
    },
    /*清除已绑定在window.scroll上的*/
    destroy: function () {
        common.each(this.refreshes, function (refresh) {
            refresh.destroy();
        })
    }
}
module.exports = RefreshProxy;