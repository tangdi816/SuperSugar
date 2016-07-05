/**
 * Created by tangdi on 2016/7/4.
 * 注册账号页面
 */

//注册账号页面
var CRegLayer=cc.Layer.extend({
  //获取屏幕尺寸
  m_sizWin:cc.winSize,

  //重载构造函数
  //参数传入场景根节点
  ctor:function(pSceneRoot){
    //调用父类构造
    this._super();

    //保存场景根节点
    this.m_pRoot=pSceneRoot;

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

    //创建注册背景
    this.m_spRegBg=new cc.Sprite("res/welcome/reg_bg.png");
    this.m_spRegBg.attr({
      x:this.m_sizWin.width/2,
      y:this.m_sizWin.height/2
    });
    this.addChild(this.m_spRegBg, 1);

    //创建确定按键
    this.m_spOkBtn=new cc.Sprite("res/welcome/ok_btn.png");
    this.m_spOkBtn.attr({
      x:265,
      y:185
    });
    this.m_spRegBg.addChild(this.m_spOkBtn, 1);

    //创建取消按键
    this.m_spCancelBtn=new cc.Sprite("res/welcome/cancel_btn.png");
    this.m_spCancelBtn.attr({
      x:265,
      y:96
    });
    this.m_spRegBg.addChild(this.m_spCancelBtn, 1);

    var sizInput=new cc.Size(340, 58);
    //创建ID输入框
    this.m_ebId=new cc.EditBox(sizInput, new cc.Scale9Sprite());
    this.m_ebId.attr({
      x:142,
      y:447,
      anchorX:0,
      anchorY:0.5
    });
    this.m_ebId.setPlaceHolder("请输入注册账号：不超过20位的数字或英文字母！");
    this.m_ebId.setDelegate(this);
    this.m_ebId.setMaxLength(20);
    this.m_ebId.setFont("ArialRoundedMTBold", 30);
    this.m_ebId.setPlaceholderFont("ArialRoundedMTBold", 16);
    this.m_ebId.setName("ID");
    this.m_spRegBg.addChild(this.m_ebId, 1);

    //创建密码输入框
    this.m_ebPW=new cc.EditBox(sizInput, new cc.Scale9Sprite());
    this.m_ebPW.attr({
      x:142,
      y:370,
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
    this.m_spRegBg.addChild(this.m_ebPW, 1);

    //创建密码确认输入框
    this.m_ebPWConf=new cc.EditBox(sizInput, new cc.Scale9Sprite());
    this.m_ebPWConf.attr({
      x:142,
      y:292,
      anchorX:0,
      anchorY:0.5
    });
    this.m_ebPWConf.setPlaceHolder("请确认密码：不超过20位的数字或英文字母！");
    this.m_ebPWConf.setDelegate(this);
    this.m_ebPWConf.setMaxLength(20);
    this.m_ebPWConf.setFont("ArialRoundedMTBold", 30);
    this.m_ebPWConf.setPlaceholderFont("ArialRoundedMTBold", 16);
    this.m_ebPWConf.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD); //密文显示密码
    this.m_ebPWConf.setName("PWConf");
    this.m_spRegBg.addChild(this.m_ebPWConf, 1);

    this.m_strID="";        //用户名
    this.m_strPW="";        //密码
    this.m_strPWConf="";    //密码确认

    //点击事件锁定
    this.m_bLockTouch=false;
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
        this.ConsentReg();
      }else if(ClickTest(this.m_spCancelBtn, posTouch, ClickPT)){    //取消注册
        bRes=true;
        //锁定点击
        this.m_bLockTouch=true;
        //调用取消注册函数
        this.CancelReg();
      }
    }while(false);
    return bRes;
  },

  //取消注册
  CancelReg:function(){
    //调用根节点返回欢迎函数
    this.m_pRoot.BackToWelcome("Register");
  },

  //确认注册
  ConsentReg:function(){
    var bRes=true;

    var strMsg="";
    do{
      this.m_strID=this.m_ebId.getString();
      this.m_strPW=this.m_ebPW.getString();
      this.m_strPWConf=this.m_ebPWConf.getString();

      //创建正则表达式
      var re=/^[a-zA-Z0-9]+$/g;
      if(!re.test(this.m_strID)|| ""===this.m_strID){
        strMsg="用户名输入错误，请重新输入！";
        this.m_strID="";
        this.m_ebId.setString("");
        this.m_ebId.setPlaceholderFontSize(16);
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
      var re2=/^[a-zA-Z0-9]+$/g;
      if(!re2.test(this.m_strPWConf)|| ""===this.m_strPWConf){
        strMsg="确认密码输入错误，请重新输入！";
        this.m_strPWConf="";
        this.m_ebPWConf.setString("");
        this.m_ebPWConf.setPlaceholderFontSize(16);
        bRes=false;
        break;
      }
      if(this.m_strPWConf!=this.m_strPW){
        strMsg="两次密码输入不同，请重新输入！";
        this.m_strPWConf="";
        this.m_ebPWConf.setString("");
        this.m_ebPWConf.setPlaceholderFontSize(16);
        bRes=false;
        break;
      }

    }while(false);

    if(!bRes){  //验证失败
      //解锁点击
      this.m_bLockTouch=false;
      //隐藏输入框
      this.m_ebId.setVisible(false);
      this.m_ebPW.setVisible(false);
      this.m_ebPWConf.setVisible(false);
      //弹出提示框
      this.m_pRoot.PopMsg(1, strMsg, 5, this.PMCallBack.bind(this), null);
    }else{    //验证成功
      //开启等待光标
      this.m_pRoot.EnWaitCursor();
      //提交注册

    }
  },

  //弹出框回调
  PMCallBack:function(){
    //显示输入框
    this.m_ebId.setVisible(true);
    this.m_ebPW.setVisible(true);
    this.m_ebPWConf.setVisible(true);
  },

  onTouchCancelled:function(touch, event){
    return;
  },


  editBoxEditingDidBegin:function(sender){
    var strName=sender.getName();
  },

  //输入框输入完成
  editBoxEditingDidEnd:function(sender){
    var strName=sender.getName();
    if("ID"===strName){
      this.m_strID=sender.getString();
    }else if("PW"===strName){
      this.m_strPW=sender.getString();
    }else if("PWConf"===strName){
      this.m_strPWConf=sender.getString();
    }
  },


  editBoxTextChanged:function(sender, text){
  },


  editBoxReturn:function(sender){
  },

  //清除所有输入信息
  ClearInput:function(){
    this.m_ebId.setString("");
    this.m_ebId.setPlaceholderFontSize(16);
    this.m_ebPW.setString("");
    this.m_ebPW.setPlaceholderFontSize(16);
    this.m_ebPWConf.setString("");
    this.m_ebPWConf.setPlaceholderFontSize(16);

    this.m_strID="";
    this.m_strPW="";
    this.m_strPWConf="";

    //解锁点击
    this.m_bLockTouch=false;
  }
});
