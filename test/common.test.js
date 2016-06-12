/**
 * Created by linxiaojie on 2016/6/3.
 */
let expect = require('chai').expect
let common = require('../src/common')
describe('common测试', function(){
    describe('queryParse(object)测试', function(){
        it('参数obj所有key值不为空', function(){
            let str = common.queryParse({
                name: 'liljay',
                age: '20'
            })
            expect(str).to.equal('name=liljay&age=20')
        })
        it('参数obj存在key值为空', function(){
            let str = common.queryParse({
                name: 'liljay',
                age: '18',
                class: ''
            })
            expect(str).to.equal('name=liljay&age=18')
        })
        it('参数obj为空', function(){
            let str = common.queryParse({})
            expect(str).to.equal('')
        })
    })

    describe('formatQuery(string)测试', function(){
        it('参数name=liljay&age=18', function(){
            let obj = common.formatQuery('name=liljay&age=18')
            expect(obj).to.be.an('object')
            expect(obj).to.have.property('name')
            expect(obj).to.have.property('age')
            expect(obj.name).to.equal('liljay')
            expect(obj.age).to.equal('18')
        })
    })
})