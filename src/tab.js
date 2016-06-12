/**
 * Created by linxiaojie on 2016/6/7.
 */
var slice = [].slice,
    TAB_CLICK = 'tab.click',
    TAB_CONTENT_CLICK = 'tab.content.click';
function Tab(opts){
    if(!(this instanceof Tab)){
        return new Tab(opts)
    }
    var me = this;
    me.$event = $({});
    me.$el = $(opts.el);
    me.$tabContent = me.$el.find('.tab-content');
    me.$tab = me.$el.find('.tab');
    me.active = opts.active || 'all';
    me.init(opts);
}

Tab.prototype = {
    constructor: Tab,
    init: function () {
        var me = this;
        me.on(TAB_CLICK, function (e, name) {
            me.showTab(name)
        });
        me.on(TAB_CONTENT_CLICK, function (e, name) {
            me.showTabContent(name)
        });
        me.activeClass = 'active';
        me.initTab();
        me.switchTab(me.active)
    },
    _eventCall: function (method, args){
        var event = this.$event, m = event[method];
        m.apply(event, args)
    },
    on: function (){
        this._eventCall('on', slice.call(arguments))
    },
    off: function (){
        this._eventCall('off', slice.call(arguments))
    },
    trigger: function (){
        this._eventCall('trigger', slice.call(arguments))
    },
    initTab: function () {
        var me = this;
        me.$tab.delegate('li', 'touchstart', function () {
            var name = $(this).data('name')
            me.$event.trigger(TAB_CLICK, [name])
        })
    },
    switchTab: function (name){
        var me = this;
        me.showTab(name);
        me.showTabContent(name);
        me.active = name;
    },
    showTab: function (name) {
        var me = this;
        me.$tab.children().removeClass(me.activeClass);
        me.$tab.find('li[data-name="' + name + '"]').addClass(me.activeClass)
    },
    showTabContent: function (name) {
        var me = this;
        me.$tabContent.children().removeClass(me.activeClass).hide();
        me.$tabContent.find('li[data-name="' + name + '"]').addClass(me.activeClass).show()
    },
    render: function (html, name){
        if(name === void 0){
            throw Error('渲染的tab名称不能为空')
        }
        this.$tabContent.find('li[data-name="' + name + '"]').find('.items').append(html)
    },
    clear: function () {
        this.$tabContent.find('.items').html('')
    }
}
module.exports = Tab;