/**
 * Created by linxiaojie on 2016/6/7.
 */
var common = require('./common');
var cfg = require('./config');
var detailParam = ["t", "contentid", "f", "D", "sessionId", "phone", "imei", "channelid"], downloadParam = ["t", "contentid", "f", "D", "sessionId", "phone", "imei", "channelid", "q"];
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
                _header.t = obj.category;
                _header.contentid = obj.id;
                obj.detail_url = common.resolve(cfg.detailHtml, me.clone(detailParam, _header));
                obj.download_url = common.resolve(common.api.download, me.clone(downloadParam, _header));
                obj.download = me.computeDownload(obj.download);
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
        detailHtml = common.render(detailTpl, data);
        sliderHtml = common.renderArray(sliderTpl, data.screenurl || []);
        $el.html(detailHtml).find('.sliders').html(sliderHtml);
    },
    computeDownload: function(d){
        return d;
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