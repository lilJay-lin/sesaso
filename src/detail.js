/**
 * Created by linxiaojie on 2016/6/9.
 */
var common = require('./common'),
    config = require('./config')
    app = require('./app'),
    Slider = require('./slider'),
    RefreshProxy = require('./refresh_proxy');
//require('./assets/css/sesosa.css');

function renderDetail(href){
    var url = href,
        idx = url.indexOf('?'),
        qryObj = common.formatQuery(url.substr(idx + 1)),paramObj;
    paramObj = $.extend({}, config.getDefaultParam(), qryObj);
    common.req.get(common.resolve(common.api.detail, paramObj)).done(function(data){
        app.renderDetail('.js-content', 'detail-tpl', 'slider-tpl', paramObj, data.results);
        /*    setTimeout(function(){
         new Slider({
         el: '.sliders-wrapper',
         padding: Math.ceil(window.rem2px(0.15))
         })
         }, 100)*/
        /*简介文字溢出处理*/
        var $ellipse = $('.ellipse'),
            $ellipseBtn = $('.ellipse-btn'),
            clipH = $ellipse.find('.ellipse-clip').outerHeight(),
            orgH = $ellipse.find('.ellipse-original').outerHeight();
        if(clipH == orgH){
            $ellipseBtn.css('display', 'none')
        }
        $ellipseBtn.on('click', function(e){
            e.stopPropagation();
            $ellipse.toggleClass('active');
        })
    });
}
/*
$('.go-back').on('click', function(){
    common.goBack();
});
*/
module.exports = renderDetail;