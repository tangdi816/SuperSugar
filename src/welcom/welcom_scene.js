/**
 * Created by tangdi on 2016/7/4.
 * 游戏欢迎场景
*/

// 登录欢迎页面
var CWelcomeLayer=cc.Layer.extend({
  //获取屏幕尺寸
  m_sizWin:cc.winSize,

  //重载构造函数
  ctor:function(){
    //调用父类构造
    this._super();

    //创建全局变量
    g_strRootKey="sdo,f+9321?nf$38*";  //源解密key用来解密UUID数据包 和 连接服务器地址数据包
    g_strMyUUID=""; //UUID
    g_oLinker=new CWBLinker();

    //创建背景
    this.m_spBg=new cc.Sprite("res/bg.jpg");
    this.m_spBg.attr({
      x:this.m_sizWin.width/2,
      y:this.m_sizWin.height/2,
      anchorX:0.5,
      anchorY:0.5
    });
    this.addChild(this.m_spBg, 1);

    //创建登陆页面糖果
    this.m_spSugars=new cc.Sprite("res/welcome/sugars.png");
    this.m_spSugars.attr({
      anchorX:0.5,
      anchorY:0,
      x:this.m_sizWin.width/2,
      y:0
    });
    this.addChild(this.m_spSugars, 10);

    //创建log文字sugar
    this.m_spWordSugar=new cc.Sprite("res/welcome/sugar.png");
    this.m_spWordSugar.attr({
      x:this.m_sizWin.width+235,
      y:this.m_sizWin.height/2+300
    });
    this.addChild(this.m_spWordSugar, 8);

    //创建log文字super
    this.m_spWordSuper=new cc.Sprite("res/welcome/super.png");
    this.m_spWordSuper.attr({
      x:this.m_sizWin.width/4,
      y:this.m_sizWin.height/2+365
    });
    this.m_spWordSuper.setScale(2.0);
    this.m_spWordSuper.setOpacity(0);
    this.addChild(this.m_spWordSuper, 9);

    //创建log文字super虚影
    this.m_spShaSuper=new cc.Sprite("res/welcome/super.png");
    this.m_spShaSuper.attr({
      x:117.5,
      y:51.5
    });
    this.m_spShaSuper.setOpacity(0);
    this.m_spWordSuper.addChild(this.m_spShaSuper, 1);

    //创建背景粒子
    this.m_ptBg=new cc.ParticleSystem("res/pt/wlcbg.plist");
    this.m_ptBg.x=this.m_sizWin.width/2;
    this.m_ptBg.y=0;
    this.addChild(this.m_ptBg, 2);

    //创建天空粒子
    this.m_ptSky=new cc.ParticleSystem("res/pt/wlc_sky.plist");
    this.m_ptSky.x=this.m_sizWin.width/2;
    this.m_ptSky.y=this.m_sizWin.height-200;
    this.addChild(this.m_ptSky, 3);

    //创建欢迎按键
    this.m_pWlcBtns=new CWelcomBtns(this);
    this.m_pWlcBtns.attr({
      anchorX:0,
      anchorY:0,
      x:this.m_sizWin.width,
      y:0
    });
    this.addChild(this.m_pWlcBtns, 7);

    //创建注册页面
    this.m_pRegLayer=new CRegLayer(this);
    this.m_pRegLayer.attr({
      anchorX:0,
      anchorY:0,
      x:this.m_sizWin.width,
      y:0
    });
    this.addChild(this.m_pRegLayer, 7);

    //创建登录页面
    this.m_pLogLayer=new CLoginLayer(this);
    this.m_pLogLayer.attr({
      anchorX:0,
      anchorY:0,
      x:this.m_sizWin.width,
      y:0
    });
    this.addChild(this.m_pLogLayer, 7);

    //创建等待光标
    this.m_pWaitCursor=new CWaitCursor();
    this.m_pWaitCursor.attr({
      anchorX:0,
      anchorY:0,
      x:0,
      y:0
    });
    this.addChild(this.m_pWaitCursor, 60);

    return true;
  },

  //重载onEnter函数
  onEnter:function(){
    //调用父类onEnter
    this._super();

    //log文字显示
    this.scheduleOnce(this.LogEnter, 0.5);
  },

  //Sugar文字飞入
  LogEnter:function(){
    //sugar飞入
    var pAc1=cc.moveTo(0.3, this.m_sizWin.width/2, this.m_sizWin.height/2+300);
    pAc1.easing(cc.easeElasticOut(0.2));
    var pAc2=cc.callFunc(this.ShowSuper, this);   //显示super文字
    var pAc3=cc.sequence(pAc1, pAc2);
    this.m_spWordSugar.runAction(pAc3);
  },

  //显示super文字
  ShowSuper:function(pSender, pData){
    //显示super文字
    var pAc1=cc.fadeTo(0.2, 255);
    var pAc2=cc.scaleTo(0.2, 1.0);
    var pAc3=cc.spawn(pAc1, pAc2);
    var pAc4=cc.callFunc(this.ShowSuperSha, this);  //显示文字虚影
    var pAc5=cc.sequence(pAc3, pAc4);
    this.m_spWordSuper.runAction(pAc5);
  },

  //显示Super虚影
  ShowSuperSha:function(pSender, pData){
    this.m_spShaSuper.setOpacity(150);
    var pAc1=cc.fadeTo(0.15, 0);
    var pAc2=cc.scaleTo(0.15, 1.5);
    var pAc3=cc.spawn(pAc1, pAc2);
    var pAc4=cc.callFunc(this.ShowWlcBtns, this);  //显示欢迎页按键
    var pAc5=cc.sequence(pAc3, pAc4);
    this.m_spShaSuper.runAction(pAc5);
  },

  //显示欢迎页按键
  ShowWlcBtns:function(pSender, pData){
    //欢迎页按键飞入
    var pAc1=cc.moveTo(0.3, 0, 0);
    pAc1.easing(cc.easeElasticOut(0.2));
    this.m_pWlcBtns.runAction(pAc1);
  },

  //返回欢迎页面
  //参数：当前显示页面
  BackToWelcome:function(strCurLayer){
    //当前页面飞出
    var pAc1=cc.moveTo(0.1, cc.p(this.m_sizWin.width, 0));
    if("Register"===strCurLayer){
      this.m_pRegLayer.runAction(pAc1);
    }else if("Login"===strCurLayer){

    }

    //重置欢迎页面
    this.m_pWlcBtns.ReSet();
    //欢迎页面飞入
    this.m_pWlcBtns.setPosition(cc.p(-this.m_sizWin.width, 0));
    var pAc2=cc.moveTo(0.3, cc.p(0, 0));
    pAc2.easing(cc.easeElasticOut(0.2));
    this.m_pWlcBtns.runAction(pAc2);
  },

  //显示注册页面
  ShowRegLayer:function(){
    //欢迎页面飞出
    var Ac1=cc.moveTo(0.1, cc.p(-this.m_sizWin.width, 0));
    this.m_pWlcBtns.runAction(Ac1);

    //清除输入框
    this.m_pRegLayer.ClearInput();
    //注册页面飞入
    this.m_pRegLayer.setPosition(cc.p(this.m_sizWin.width, 0));
    var pAc2=cc.moveTo(0.3, cc.p(0, 0));
    pAc2.easing(cc.easeElasticOut(0.2));
    this.m_pRegLayer.runAction(pAc2);
  },

  //显示登录页面
  ShowLogLayer:function(){
    //欢迎页面飞出
    var Ac1=cc.moveTo(0.1, cc.p(-this.m_sizWin.width, 0));
    this.m_pWlcBtns.runAction(Ac1);

    //清除输入框
    this.m_pLogLayer.ClearInput();
    //注册页面飞入
    this.m_pLogLayer.setPosition(cc.p(this.m_sizWin.width, 0));
    var pAc2=cc.moveTo(0.3, cc.p(0, 0));
    pAc2.easing(cc.easeElasticOut(0.2));
    this.m_pLogLayer.runAction(pAc2);
  },

  //弹出消息框
  //参数1:按键数量
  //参数2:消息文字
  //参数3:自动关闭时间：小于等于0不自动关闭
  //参数4:确认按键回调
  //参数5:取消按键回调
  PopMsg:function(iBtnNum, strMsg, dtClose, funOk, funCancel){
    var Msg=new CPopMsg(iBtnNum, strMsg, dtClose, funOk, funCancel);
    Msg.setGlobalZOrder(20);
    this.addChild(Msg, 50);
  },

  //开启等待光标
  EnWaitCursor:function(){
    this.m_pWaitCursor.ShowWaitCursor();
  },

  //关闭等待光标
  DisWaitCursor:function(){
    this.m_pWaitCursor.HideWaitCursor();
  }
});

//游戏登陆场景
var CWelcomScene=cc.Scene.extend({
  //重载onEnter函数
  onEnter:function(){
    //调用父类onEnter
    this._super();

    //创建登录欢迎页面
    var lyWelcome=new CWelcomeLayer();
    this.addChild(lyWelcome);
  }
});
