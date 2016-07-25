/**
 * Created by tangdi on 2016/7/4.
 * 欢迎场景按键
 */

//欢迎按键页面
var CWelcomBtns=cc.Layer.extend({
  //获取屏幕尺寸
  m_sizWin:cc.winSize,

  //重载构造函数
  //参数传入场景根节点
  ctor:function(pSceneRoot){
    //调用父类构造
    this._super();

    //保存场景根节点
    this.m_pRoot=pSceneRoot;

    //创建登录按键
    this.m_spLoginBtn=new cc.Sprite("res/welcome/btn_bg.png");
    this.m_spLoginBtn.attr({
      x:this.m_sizWin.width/2,
      y:this.m_sizWin.height/2+80
    });
    this.addChild(this.m_spLoginBtn, 1);
    var spWordLogin=new cc.Sprite("res/welcome/login.png");
    spWordLogin.attr({
      x:254,
      y:71.5
    });
    this.m_spLoginBtn.addChild(spWordLogin, 1);

    //创建注册按键
    this.m_spRegtBtn=new cc.Sprite("res/welcome/btn_bg.png");
    this.m_spRegtBtn.attr({
      x:this.m_sizWin.width/2,
      y:this.m_sizWin.height/2-80
    });
    this.addChild(this.m_spRegtBtn, 1);
    var spWordReg=new cc.Sprite("res/welcome/register.png");
    spWordReg.attr({
      x:254,
      y:71.5
    });
    this.m_spRegtBtn.addChild(spWordReg, 1);

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

    //点击锁
    this.m_bLockTouch=false;
  },//end ctor function

  onTouchBegan:function(touch, event){
    var bRes=false;
    do{
      //点击被锁定
      if(this.m_bLockTouch)
        break;

      //提取点击坐标
      var posTouch=touch.getLocation();
      //忽略鼠标右键点击
      if('mouse' in cc.sys.capabilities){
        if(cc.EventMouse.BUTTON_RIGHT===touch.getButton())
          break;
      }

      //检查注册和登录按键点击
      if(ClickTest(this.m_spLoginBtn, posTouch, DefCA)){
        //登录按键点击
        bRes=true;
      }else if(ClickTest(this.m_spRegtBtn, posTouch, DefCA)){
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
      //点击被锁定
      if(this.m_bLockTouch)
        break;

      //提取点击坐标
      var posTouch=touch.getLocation();
      //忽略鼠标右键点击
      if('mouse' in cc.sys.capabilities){
        if(cc.EventMouse.BUTTON_RIGHT===touch.getButton())
          break;
      }

      //检查注册和登录按键点击
      if(ClickTest(this.m_spLoginBtn, posTouch, ClickPT)){
        //登录按键点击
        bRes=true;
        //锁定点击
        this.m_bLockTouch=true;
        //调用根节点显示登录页面接口
        this.m_pRoot.ShowLogLayer();
      }else if(ClickTest(this.m_spRegtBtn, posTouch, ClickPT)){
        //注册按键点击
        bRes=true;
        //锁定点击
        this.m_bLockTouch=true;
        //调用根节点显示注册页面接口
        this.m_pRoot.ShowRegLayer();
      }
    }while(false);
    return bRes;
  },

  onTouchCancelled:function(touch, event){
    return;
  },

  //重置页面
  ReSet:function(){
    //解锁点击
    this.m_bLockTouch=false;
  }
});
