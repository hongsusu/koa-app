const Router = require("koa-router")
const router =new Router();
var bcrypt = require('bcryptjs');
//处理头像
const gravatar = require('gravatar');

//引入User
const User =require("../../models/User")

//test
//路由
/**
 * router GET api/users/test
 * @desc 测试接口地址
 * @access 接口公开
 */

router.get('/test',async ctx=>{
    ctx.status = 200
    ctx.body={msg:'users works....'}
})


/**
 * router POST api/users/test1
 * @desc 测试post
 * @access 接口公开
 */
router.post('/test1', ctx=>{
    ctx.body = {
        code:1,
        postParams:ctx.request.body
    }
})

/**
 * router POST apis/users/register
 * @desc 注冊接口
 * @access 接口公开
 */
router.post('/register',async ctx=>{
    //存储数据库
    const findResult=await User.find({email:ctx.request.body.email})
    console.log(findResult)
    console.log(11111111)
    if(findResult.length>0){
        ctx.status=200;
        ctx.body={code:500,message:"邮箱已被占用"}
    }else{
        const avatar =gravatar.url(ctx.request.body.email,{s:'200',r:'pg',d:'mm'})
        //没查到
        const newUser=new User ({
            name:ctx.request.body.name,
            email:ctx.request.body.email,
            pwd:ctx.request.body.pwd,
            avatar
        });
        //加密
    await bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.pwd, salt, (err, hash)=> {
                // Store hash in your password DB.
                if(err) throw err
                newUser.pwd=hash
            });
        });
      await newUser
          .save()
          .then(user=>{
          ctx.body={
              code:200,
              msg:'成功'
          }
      }).catch((err=>{
          console.log(err)
              //返回json数据
         ctx.body=newUser
      }))

    }
})

module.exports = router.routes();