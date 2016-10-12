/**
 * Created by linxiaojie on 2016/6/13.
 */
//var setOptions = ['configMap'];
var idCounter = 0;

function uniqueId(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
};

var View = function(options){
    var me = this;
    /*$.each(setOptions, function(option){
     me[option] = options[option];
     });*/
    this.cid = uniqueId('c');
    this.el = options['el'];
    this.options = $.extend({}, this.options, options);
    this.model = $.extend({}, this.model, options.model || {});
    this._ensureElement();
    this.init.apply(this, arguments);
};
var delegateEventSplitter = /^(\S+)\s*(.*)$/;

$.extend(View.prototype, {
    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    delegateEvents: function(events) {
        if (!(events || (events = this.events))) return this;
        //console.count('delegateEvents');
        this.undelegateEvents();
        for (var key in events) {
            var method = events[key];
            if (!$.isFunction(method)) method = this[events[key]];
            if (!method) continue;
            var match = key.match(delegateEventSplitter);
            this.delegate(match[1], match[2], $.proxy(method, this));
        }
        return this;
    },
    delegate: function(eventName, selector, listener) {
        this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
    },
    _ensureElement: function() {
        if (!this.el) {
            this.setElement($('<div/>'));
        } else {
            this.setElement(this.el);
        }
    },
    setElement: function(element) {
        this.undelegateEvents();
        this._setElement(element);
        this.delegateEvents();
        return this;
    },
    _setElement: function(el) {
        this.$el = el instanceof $ ? el : $(el);
        this.el = this.$el[0];
    },
    undelegateEvents: function() {
        if (this.$el) this.$el.off('.delegateEvents' + this.cid);
        return this;
    },
    remove: function(){
        this.undelegateEvents();
        this.$el && this.$el.remove();
        return this;
    },
    $: function(el){
        return this.$el.find(el);
    },
    init: function(){}
});

/*
 暂不做继承
 */
View.extends = function(protoProps, staticProps){
    var parent = this;
    var child = function(){
        return parent.apply(this, arguments);
    };

    $.extend(child, parent, staticProps);

    var Surrogate = function(){this.constructor = child};
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    if(protoProps){
        $.extend(child.prototype, protoProps);
    }

    child.__super__ = parent.prototype;

    return child;
};
module.exports = View;