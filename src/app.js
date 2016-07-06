/**
 * Created by linxiaojie on 2016/6/7.
 */
var common = require('./common');
var cfg = require('./config');
var detailParam = ["t", "contentid", "f", "D", "sessionId", "phone", "imei", "channelid", "q"], downloadParam = ["t", "contentid", "f", "D", "sessionId", "phone", "imei", "channelid", "q"];
var APP_SIZE_SPLIT = /(\d+(\.\d+)?)KB/;
module.exports = {
    renderApp: function (id, header, data) {
        var me = this, tpl = me.getTplById(id);
        if($.isArray(data) && data.length > 0){
            var arr = data;
            if(arr == null || !$.isArray(arr)){
                return template;
            }
            var html = '', obj = {}, _header = $.extend({}, header);
            $.each(arr, function(i){
                obj = this;
                _header.t = obj.category || header.t;
                _header.contentid = obj.id;
                obj.detail_url = common.resolve(cfg.detailHtml, me.clone(detailParam, _header));
                obj.download_url = common.resolve(common.api.download, me.clone(downloadParam, _header));
                obj.download = me.computeDownload(obj.download);
                obj.appsize = me.computeAppSize(obj.appsize);
                obj._order = i + 1;
                html += common.render(tpl, obj);
            })
            return html;
        }else {
            return common.render(tpl, data)
        }
    },
    renderDetail: function (el, detailId, sliderId, header, data){
        var me = this,
            $el = $(el),
            detailTpl = me.getTplById(detailId),
            sliderTpl = me.getTplById(sliderId),
            detailHtml, sliderHtml;
        header.contentid = data.id;
        data.download_url = common.resolve(common.api.download, me.clone(downloadParam, header));
        data.download_num = me.computeDownload(data.download_num);
        detailHtml = common.render(detailTpl, data);
        sliderHtml = common.renderArray(sliderTpl, data.screenurl || []);
        $el.html(detailHtml).find('.sliders').html(sliderHtml);
    },
    computeDownload: function(d){
        d = d ?  parseInt(d, 10) : 1000;
        d = d < 1000 ? 1000 + d : d;
        var t = d / 10000, ft = Math.floor(t);
        t = d < 10000 ? d : (ft !== t ?  ft + '万+' : ft + '万');
        return t;
    },
    computeAppSize: function (d){
        var size = d || 0;
        var match = d.match(APP_SIZE_SPLIT);
        if(match){
            size =  parseFloat(match[1], 10)
        }
        size = size > 1000 ? new Number(size / 1024).toFixed(1)  + 'MB' :  new Number(size).toFixed(1) + 'KB';
        return size;
    },
    getTplById: function (id){
        return  $('#' + id).html()
    },
    clone: function(param, target){
        var obj = {}, len = param.length, i = 0, key, value;
        for(; i < len; i++){
            key = param[i];
            value = target[key];
            if(target.hasOwnProperty(key) && !!value){
                obj[key] = value;
            }
        }
        return obj;
    }
}