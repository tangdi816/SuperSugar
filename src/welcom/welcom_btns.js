/**
 * Created by tangdi on 2016/7/4.
 * 欢迎场景按键
 */

//欢迎按键页面
var CWelcomBtns=cc.Layer.extend({
  //获取屏幕尺寸
  sizWin:cc.winSize,

  //重载构造函数
  //参数传入场景根节点
  ctor:function(pSceneRoot){
    //调用父类构造
    this._super();

    //保存场景根节点
    this.pRoot=pSceneRoot;

    //创建登录按键
    this.spLoginBtn=new cc.Sprite("res/login/btn_bg.png");
    this.spLoginBtn.attr({
      x:this.sizWin.width/2,
      y:this.sizWin.height/2+80
    });
    this.addChild(this.spLoginBtn, 1);
    var spWordLogin=new cc.Sprite("res/login/login.png");
    spWordLogin.attr({
      x:254,
      y:71.5
    });
    this.spLoginBtn.addChild(spWordLogin, 1);

    //创建注册按键
    this.spRegtBtn=new cc.Sprite("res/login/btn_bg.png");
    this.spRegtBtn.attr({
      x:this.sizWin.width/2,
      y:this.sizWin.height/2-80
    });
    this.addChild(this.spRegtBtn, 1);
    var spWordReg=new cc.Sprite("res/login/register.png");
    spWordReg.attr({
      x:254,
      y:71.5
    });
    this.spRegtBtn.addChild(spWordReg, 1);

    //注册单击事件
    if('touches' in cc.sys.capabilities){
      cc.eventManager.addListener({
        event:cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan:this.onTouchBegan.bind(this),
        onTouchMoved:this.onTouchMoved.bind(this),
        onTouchEnded:this.onTouchEnded.bind(this),
        onTouchCancelled:this.onTouchCancelled.bind(this)
      }, this);
    }else{
      cc.eventManager.addListener({
        event:cc.EventListener.MOUSE,
        onMouseDown:this.onTouchBegan.bind(this),
        onMouseMove:this.onTouchMoved.bind(this),
        onMouseUp:this.onTouchEnded.bind(this)
      }, this);
    }
  },//end ctor function

  onTouchBegan:function(touch, event){
    var bRes=false;
    do{
      //提取点击坐标
      var posTouch=touch.getLocation();
      //忽略鼠标右键点击
      if('mouse' in cc.sys.capabilities){
        if(cc.EventMouse.BUTTON_RIGHT===touch.getButton())
          break;
      }

      //检查注册和登录按键点击
      if(ClickTest(this.spLoginBtn, posTouch, DefCA)){
        //登录按键点击
        bRes=true;
      }else if(ClickTest(this.spRegtBtn, posTouch, DefCA)){
        //注册按键点击
        bRes=true;
      }
    }while(false);
    return bRes;
  },

  onTouchMoved:function(touch, event){
    return;
  },

  onTouchEnded:function(touch, event){
    var bRes=false;
    do{
      //提取点击坐标
      var posTouch=touch.getLocation();
      //忽略鼠标右键点击
      if('mouse' in cc.sys.capabilities){
        if(cc.EventMouse.BUTTON_RIGHT===touch.getButton())
          break;
      }

      //检查注册和登录按键点击
      if(ClickTest(this.spLoginBtn, posTouch, ClickPT)){
        //登录按键点击
        bRes=true;
      }else if(ClickTest(this.spRegtBtn, posTouch, ClickPT)){
        //注册按键点击
        bRes=true;
      }
    }while(false);
    return bRes;
  },

  onTouchCancelled:function(touch, event){
    return;
  }
});
