/**
 * Created by tangdi on 2016/7/24.
 * 登陆页面
 */

//登陆页面
var CLoginLayer=cc.Layer.extend({
  //获取屏幕尺寸
  m_sizWin:cc.winSize,

  //重载构造函数
  //传入场景根节点
  ctor:function(pSceneRoot){
    //调用父类构造
    this._super();

    //保存场景根节点
    this.m_pRoot=pSceneRoot;

    //输入id
    this.m_strID="";
    //输入密码
    this.m_strPW="";

    //点击事件锁定
    this.m_bLockTouch=false;

    //注册点击事件
    if('touches' in cc.sys.capabilities){
      cc.eventManager.addListener({
        event:cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan:this.onTouchBegan.bind(this),
        onTouchMoved:this.onTouchMoved.bind(this),
        onTouchEnded:this.onTouchEnded.bind(this),
        onTouchCancelled:this.onTouchCancelled.bind(this)
      }, this)
    }else{
      cc.eventManager.addListener({
        event:cc.EventListener.MOUSE,
        onMouseDown:this.onTouchBegan.bind(this),
        onMouseMove:this.onTouchMoved.bind(this),
        onMouseUp:this.onTouchEnded.bind(this)
      }, this)
    }//end if 注册touch

    //创建背景
    this.m_spBg=new cc.Sprite("res/welcome/log_bg.png");
    this.m_spBg.attr({
      x:this.m_sizWin.width/2,
      y:this.m_sizWin.height/2,
      //x:0,
      //y:0,
      anchorX:0.5,
      anchorY:0.5
    });
    this.addChild(this.m_spBg, 1);

    var sizInput=new cc.Size(340, 58);
    //创建用户名输入框
    this.m_ebID=new cc.EditBox(sizInput, new cc.Scale9Sprite());
    this.m_ebID.attr({
      x:142,
      y:436,
      anchorX:0,
      anchorY:0.5
    });
    this.m_ebID.setPlaceHolder("请输入注册账号：不超过20位的数字或英文字母！");
    this.m_ebID.setDelegate(this);
    this.m_ebID.setMaxLength(20);
    this.m_ebID.setFont("ArialRoundedMTBold", 30);
    this.m_ebID.setPlaceholderFont("ArialRoundedMTBold", 16);
    this.m_ebID.setName("ID");
    this.m_spBg.addChild(this.m_ebID, 1);

    //创建密码输入框
    this.m_ebPW=new cc.EditBox(sizInput, new cc.Scale9Sprite());
    this.m_ebPW.attr({
      x:142,
      y:356,
      anchorX:0,
      anchorY:0.5
    });
    this.m_ebPW.setPlaceHolder("请输入密码：不超过20位的数字或英文字母！");
    this.m_ebPW.setDelegate(this);
    this.m_ebPW.setMaxLength(20);
    this.m_ebPW.setFont("ArialRoundedMTBold", 30);
    this.m_ebPW.setPlaceholderFont("ArialRoundedMTBold", 16);
    this.m_ebPW.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);  //密文显示密码
    this.m_ebPW.setName("PW");
    this.m_spBg.addChild(this.m_ebPW, 1);

    //创建确定按键
    this.m_spOkBtn=new cc.Sprite("res/welcome/ok_btn.png");
    this.m_spOkBtn.attr({
      x:265,
      y:245
    });
    this.m_spBg.addChild(this.m_spOkBtn, 1);

    //创建取消按键
    this.m_spCancelBtn=new cc.Sprite("res/welcome/cancel_btn.png");
    this.m_spCancelBtn.attr({
      x:265,
      y:156
    });
    this.m_spBg.addChild(this.m_spCancelBtn, 1);


  },//end ctor

  //输入框开始输入
  editBoxEditingDidBegin:function(sender){
    var strName=sender.getName();
  },

  //输入框输入完成
  editBoxEditingDidEnd:function(sender){
    var strName=sender.getName();
    if("ID"===strName){
      //保存输入id
      this.m_strID=sender.getString();
    }else if("PW"===strName){
      //保存输入密码
      this.m_strPW=sender.getString();
    }
  },

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

      if(ClickTest(this.m_spOkBtn, posTouch, DefCA)){
        bRes=true;
      }else if(ClickTest(this.m_spCancelBtn, posTouch, DefCA)){
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

      if(ClickTest(this.m_spOkBtn, posTouch, ClickPT)){               //确认注册
        bRes=true;
        //锁定点击
        this.m_bLockTouch=true;
        //调用确认注册
        this.ConsentLog();
      }else if(ClickTest(this.m_spCancelBtn, posTouch, ClickPT)){    //取消注册
        bRes=true;
        //锁定点击
        this.m_bLockTouch=true;
        //调用取消注册函数
        this.CancelLog();
      }
    }while(false);
    return bRes;
  },

  onTouchCancelled:function(touch, event){
    return;
  },

  //确认登录
  ConsentLog:function(){
    var bRes=true;

    var strMsg="";
    do{
      this.m_strID=this.m_ebID.getString();
      this.m_strPW=this.m_ebPW.getString();

      //创建正则表达式
      var re=/^[a-zA-Z0-9]+$/g;
      if(!re.test(this.m_strID)|| ""===this.m_strID){
        strMsg="用户名输入错误，请重新输入！";
        this.m_strID="";
        this.m_ebID.setString("");
        this.m_ebID.setPlaceholderFontSize(16);
        bRes=false;
        break;
      }
      var re1=/^[a-zA-Z0-9]+$/g;
      if(!re1.test(this.m_strPW)|| ""===this.m_strPW){
        strMsg="密码输入错误，请重新输入！";
        this.m_strPW="";
        this.m_ebPW.setString("");
        this.m_ebPW.setPlaceholderFontSize(16);
        bRes=false;
        break;
      }
    }while(false);

    if(!bRes){  //验证失败
      //解锁点击
      this.m_bLockTouch=false;
      //隐藏输入框
      this.m_ebID.setVisible(false);
      this.m_ebPW.setVisible(false);
      //弹出提示框
      this.m_pRoot.PopMsg(1, strMsg, 5, this.PMCallBack.bind(this), null);
    }else{    //验证成功
      //开启等待光标
      this.m_pRoot.EnWaitCursor();

      //提交登录
    }
  },

  //弹出框回调
  PMCallBack:function(){
    //显示输入框
    this.m_ebID.setVisible(true);
    this.m_ebPW.setVisible(true);
  },

  //取消登录
  CancelLog:function(){
    //调用根节点返回欢迎函数
    this.m_pRoot.BackToWelcome("Login");
  },

  //清除所有输入信息
  ClearInput:function(){
    this.m_ebID.setString("");
    this.m_ebID.setPlaceholderFontSize(16);
    this.m_ebPW.setString("");
    this.m_ebPW.setPlaceholderFontSize(16);

    this.m_strID="";
    this.m_strPW="";

    //解锁点击
    this.m_bLockTouch=false;
  }
})