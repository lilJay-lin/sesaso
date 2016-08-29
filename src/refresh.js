/**
 * Created by linxiaojie on 2016/6/7.
 * @param{Object}
 */
var common = require('./common');
var cfg = require('./config');
function Refresh(opts){
    if(!(this instanceof Refresh)){
        new Refresh(opts)
    }
    var me = this;
    me.$container = $(opts.container || window);
    me.$content = opts.content && me.$container.find(opts.content) || $(document.body);
    me.url = opts.url || '';
    me.render = opts.render || function(){};
    var data = me.data = opts.data || {total: 0, ps: 10, pid: 1};
    data.ps = data.ps || cfg.get('ps');
    data.pid = data.pid || cfg.get('pid');
    var c = data.total / data.ps;
    me.pageCount = c == 0 ? 1 : Math.ceil(c);
    me.name = opts.name;
    me.disabled = false;
    me.eventName = 'scroll';
}

Refresh.prototype = {
    constructor: Refresh,
    start: function () {
        var me = this,
            fn = me.getMore.bind(me),
            $container = me.$container;
        if(me.disabled){
            return;
        }
        $container.on(me.eventName, fn);
    },
    getMore: function () {
        var me = this,
            data = me.data,
            $container = me.$container,
            $content = me.$content;
        //console.log(200 + $container.scrollTop() + $container.height() > $content.height())
        if(200 + $container.scrollTop() + $container.height() > $content.height()){
            me.destroy();
            data.pid++ ;
            if(data.pid <= me.pageCount){
                var pid = data.pid;
                common.req.get(common.resolve(me.url, data)).done(function(data){
                    var name = me.name;
                    me.render(data.results, name, {
                        pid: pid
                    });
                    me.start();
                })
            }else{
                me.disabled = true;
            }
        }
    },
    destroy: function () {
        this.$container.off(this.eventName)
    }
}

module.exports = Refresh;