/**
 * Created by linxiaojie on 2016/6/14.
 */
let expect = require('chai').expect;
let app = require('../src/app');

describe("app测试", function (){
    it('#app测试computeDownload', function(){
        expect(app.computeDownload('180') + '').to.equal('180');
        expect(app.computeDownload('10000') + '').to.equal('1万');
        expect(app.computeDownload('10002') + '').to.equal('1万+');
    })
    it('#app测试computeAppSize', function(){
        expect(app.computeAppSize('180KB')).to.equal('180.0KB');
        expect(app.computeAppSize('180.222KB')).to.equal('180.2KB');
        expect(app.computeAppSize('1800KB')).to.equal(new Number(1800/1024).toFixed(1) + 'MB');
    })
})