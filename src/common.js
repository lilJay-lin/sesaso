/**
 * Created by linxiaojie on 2016/6/7.
 */
/*
 * native object reference
 */
var objectProto = Object.prototype;
/*
 native method
 */
var hasOwnProperty = objectProto.hasOwnProperty,
    toString = objectProto.toString;
function property(key){
    return function(obj){
        return obj == null ? obj : obj[key];
    }
}
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
var getLength = property('length');
var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;
var host = '';//'http://localhost:8080';
function isArrayLike(obj){
    var length = getLength(obj);
    return typeof  length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}

/*
 * 渲染，
 * param{html string} template,
 * param{obj} context
 * 根据传入String做变量替换，返回替换之后的字符串
 */
function render(template, context) {
    return template.replace(tokenReg, function (word, slash1, token, slash2) {
        if (slash1 || slash2) {
            return word.replace('\\', '');
        }

        var variables = token.replace(/\s/g, '').split('.');
        var currentObject = context;
        var i, length, variable;

        for (i = 0, length = variables.length; i < length; ++i) {
            variable = variables[i];
            currentObject = currentObject[variable];
            if (currentObject === undefined || currentObject === null) return '';
        }
        return currentObject;
    })
}

/*不处理多重内嵌的数组，只处理一元数组*/
function renderArray(template, arr){
    if(arr == null || !$.isArray(arr)){
        return template;
    }
    var html = '', obj = {};
    $.each(arr, function(i){
        if(toString.call(arr[i]) == '[object Object]'){
            obj = arr[i];
            obj._order = i + 1;
        }else{
            obj.value = arr[i];
            obj._order = i + 1;
        }
        html += render(template, obj);
    })
    return html;
}
function each(obj, iteratee, context){
    var i , len;
    var cb = context == void 0 ? iteratee : proxy(iteratee, context);
    if(isArrayLike(obj)){
        for(i = 0, len = obj.length; i < len; i++){
            cb(obj[i], i, obj);
        }
    }else{
        var keys = Object.keys(obj),key;
        for(i = 0, len = keys.length; i < len; i++){
            key = keys[i];
            if(hasOwnProperty.call(obj, key)){
                cb(obj[key], key, obj);
            }
        }
    }
}
module.exports =  {
    property: property,
    each: each,
    queryParse: function(obj){
        var str = ''
        var u
        this.each(obj, function (value, key) {
            if(!!value){
                u = key + '=' + encodeURIComponent(value)
                str += str === '' ?  u : ('&' + u)
            }
        })
        return str
    },
    formatQuery: function(str){
        var obj = {}
        if(str.trim() === ''){
            return obj
        }
        var regex = /([^=]*)=(.*)$/i;
        var arr = str.split('&')
        this.each(arr, function(value, key){
            var m = regex.exec(value)
            if(m && m.length > 2){
                obj[m[1]] = m[2] || ''
            }
        })
        return obj
    },
    resolve: function(url, obj){
        var qryStr = this.queryParse(obj);
        return ~url.indexOf('?') ? (url  + '&' + qryStr) : (url + '?' + qryStr);
    },
    render: render,
    renderArray: renderArray,
    req: {
        get: function (url) {
            return $.ajax({
                url: url,
                method: 'GET',
                cache: false
            })
        },
        post: function (url, data) {
            return $.ajax({
                url: url,
                method: 'POST',
                data: data,
                cache: false,
                dataType: 'json'
            })
        }
    },
    type: {
        all:　'result',
        appGame: 'appGame',
        appSoftWare: 'appSoftWare'
    },
    api: {
        search: host + '/cpasearch/Search',
        detail:　host + '/cpasearch/appContent',
        download: host + '/cpasearch/download'
    },
    goBack: function(){
        history.go(-1);
    }
}