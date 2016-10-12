/**
 * Created by linxiaojie on 2016/10/12.
 */
/*
 * setupIFrame设置iframe高度
 * @param {string|element} frame ： iframe节点或者选中器
 * @param {string} origin: 请求的域名地址，就是src的域名地址，主要是为了信息安全，
 * 不写的话，直接传'*',表示解释所有域名传过来的数据
 * */
function setupIFrame(frame, origin){
    window.addEventListener('message', function(evt){
        if((origin === '*' || evt.origin === origin) && evt.source === frame.contentWindow){
            if (typeof frame === 'string') {
                frame = document.querySelector(frame);
            }
            if (frame && frame.name === 'iframe'){
                frame.height = parseInt(evt.data, 10); //可预期的数据只能是数字，防止xss攻击
            }
        }
    })
}