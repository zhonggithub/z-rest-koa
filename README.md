##z-rest-koa是什么?
一个restful API的后端脚手架，orm采用waterline, 您可以使用[z-react-kao-cli](https://github.com/zhonggithub/z-react-koa-cli)工具初始化您的项目工程.

##有哪些功能？

* Controller类定义了CRUD等操作，如果您需要定制化自己的CRUD操作，您可以继承该类,然后重写它的方法;类的构造函数参数为Json格式的opts，参数说明见下表：
|参数名称|类型|是否必填|说明|
|---|---|---|---|
|resourceOperator|Object|是|Operator类对象，操作资源的CRUD代理类对象|
|isValidData|function|否|对资源的create操作时判断参数的有效性，它的形参是ctx.request.body,该函数的返回值为{'is': true, 'error': ''}|
|isValidUpateData|function|否|对资源的update操作时判断参数的有效性，它的形参是ctx.request.body,该函数的返回值为{'is': true, 'error': ''}|
|isExist|function|否|对资源的create操作时判断资源的唯一性，形参为ctx.request.body，该函数的返回值为{'is': false, description: '', infos: []}， infos为存在的资源|
|retData|function|否|对资源的CRU操作时封装返回客户端数据。形参为DB层数据格式，返回值为逻辑表现参的数据。|
|retListData|function|否|封装list操作时返回客户端的数据表现形式。形参为: ctx.request.query，满足条件的逻辑表现层数据items,满足条件在数据库的总条数total。|
|isValidQueryParams|function|否|对资源的list，Retrieve 操作判断ctx.request.query的有效性|
|isExpandValid|function|否|对资源的list，Retrieve 判断ctx.request.query中expand字段的有效性|

* Operator类定义了数据模型操作，Controller最终调用Operator的方法对数据库进行操作

##有问题反馈
在使用中有任何问题，欢迎反馈给我，可以用以下联系方式跟我交流

* 邮件: quitjie@gmail.com
* QQ: 1006817093