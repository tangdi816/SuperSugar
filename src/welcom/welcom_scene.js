/**
 * Created by tangdi on 2016/7/4.
 * 游戏欢迎场景
*/

// 登录欢迎页面
var CWelcomeLayer=cc.Layer.extend({
  //获取屏幕尺寸
  sizWin:cc.winSize,

  //重载构造函数
  ctor:function(){
    //调用父类构造
    this._super();

    //创建背景
    this.spBg=new cc.Sprite("res/bg.jpg");
    this.spBg.attr({
      x:this.sizWin.width/2,
      y:this.sizWin.height/2,
      anchorX:0.5,
      anchorY:0.5
    });
    this.addChild(this.spBg, 1);

    //创建登陆页面糖果
    this.spSugars=new cc.Sprite("res/login/sugars.png");
    this.spSugars.attr({
      anchorX:0.5,
      anchorY:0,
      x:this.sizWin.width/2,
      y:0
    });
    this.addChild(this.spSugars, 4);

    //创建log文字sugar
    this.spWordSugar=new cc.Sprite("res/login/sugar.png");
    this.spWordSugar.attr({
      x:this.sizWin.width+235,
      y:this.sizWin.height/2+300
    });
    this.addChild(this.spWordSugar, 5);

    //创建log文字super
    this.spWordSuper=new cc.Sprite("res/login/super.png");
    this.spWordSuper.attr({
      x:this.sizWin.width/4,
      y:this.sizWin.height/2+365
    });
    this.spWordSuper.setScale(2.0);
    this.spWordSuper.setOpacity(0);
    this.addChild(this.spWordSuper, 6);

    //创建log文字super虚影
    this.spShaSuper=new cc.Sprite("res/login/super.png");
    this.spShaSuper.attr({
      x:117.5,
      y:51.5
    });
    this.spShaSuper.setOpacity(0);
    this.spWordSuper.addChild(this.spShaSuper, 1);

    //创建背景粒子
    this.ptBg=new cc.ParticleSystem("res/pt/wlcbg.plist");
    this.ptBg.x=this.sizWin.width/2;
    this.ptBg.y=0;
    this.addChild(this.ptBg, 2);

    //创建天空粒子
    this.ptSky=new cc.ParticleSystem("res/pt/wlc_sky.plist");
    this.ptSky.x=this.sizWin.width/2;
    this.ptSky.y=this.sizWin.height-200;
    this.addChild(this.ptSky, 3);

    //创建欢迎按键
    this.pWlcBtns=new CWelcomBtns(this);
    this.pWlcBtns.attr({
      anchorX:0,
      anchorY:0,
      x:this.sizWin.width,
      y:0
    });
    this.addChild(this.pWlcBtns, 7);

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
    var pAc1=cc.moveTo(0.3, this.sizWin.width/2, this.sizWin.height/2+300);
    pAc1.easing(cc.easeElasticOut(0.2));
    var pAc2=cc.callFunc(this.ShowSuper, this);   //显示super文字
    var pAc3=cc.sequence(pAc1, pAc2);
    this.spWordSugar.runAction(pAc3);
  },

  //显示super文字
  ShowSuper:function(pSender, pData){
    //显示super文字
    var pAc1=cc.fadeTo(0.2, 255);
    var pAc2=cc.scaleTo(0.2, 1.0);
    var pAc3=cc.spawn(pAc1, pAc2);
    var pAc4=cc.callFunc(this.ShowSuperSha, this);  //显示文字虚影
    var pAc5=cc.sequence(pAc3, pAc4);
    this.spWordSuper.runAction(pAc5);
  },

  //显示Super虚影
  ShowSuperSha:function(pSender, pData){
    this.spShaSuper.setOpacity(150);
    var pAc1=cc.fadeTo(0.15, 0);
    var pAc2=cc.scaleTo(0.15, 1.5);
    var pAc3=cc.spawn(pAc1, pAc2);
    var pAc4=cc.callFunc(this.ShowWlcBtns, this);  //显示欢迎页按键
    var pAc5=cc.sequence(pAc3, pAc4);
    this.spShaSuper.runAction(pAc5);
  },

  //显示欢迎页按键
  ShowWlcBtns:function(pSender, pData){
    //欢迎页按键飞入
    var pAc1=cc.moveTo(0.3, 0, 0);
    pAc1.easing(cc.easeElasticOut(0.2));
    this.pWlcBtns.runAction(pAc1);
  }

  //显示注册页面
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
