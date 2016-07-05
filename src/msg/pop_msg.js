/**
 * Created by tangdi on 2016/7/5.
 * 弹出框消息
 */

//弹出消息框
var CPopMsg=cc.Layer.extend({
  //获取屏幕尺寸
  m_sizWin:cc.winSize,

  //重载构造函数
  //参数1:按键数量
  //参数2:消息文字
  //参数3:自动关闭时间：小于等于0不自动关闭
  //参数4:确认按键回调
  //参数5:取消按键回调
  ctor:function(iBtnNum, strMsg, dtClose, funOk, funCancel){
    //调用父类构造
    this._super();

    //保存回调函数
    this.m_funOk=funOk;
    this.m_funCancel=funCancel;

    //保存自动关闭时间
    this.m_iAutoClose=dtClose;
    //保存按键数量
    this.m_iBtnNum=iBtnNum;

    //注册单击事件
    if('touches'in cc.sys.capabilities){
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

    //创建黑色背景层
    this.m_clBlackBg=new cc.LayerColor(cc.color(0, 0, 0, 0));
    this.m_clBlackBg.attr({
      x:0,
      y:0,
      anchorX:0,
      anchorY:0
    });
    this.m_clBlackBg.setContentSize(this.m_sizWin);
    this.addChild(this.m_clBlackBg, 1);

    //创建消息背景
    this.m_spBg=new cc.Sprite("res/msg/msg_bg.png");
    this.m_spBg.attr({
      x:this.m_sizWin.width/2,
      y:this.m_sizWin.height/2
    });
    this.m_spBg.setScale(0);
    this.addChild(this.m_spBg, 2);

    //创建按键
    this.m_spOkBtn=new cc.Sprite("res/msg/msg_ok.png");
    this.m_spBg.addChild(this.m_spOkBtn, 2);
    this.m_spCancel=new cc.Sprite("res/msg/msg_cancel.png");
    this.m_spBg.addChild(this.m_spCancel, 2);
    if(1===iBtnNum){        //一个按键
      //隐藏取消按键
      this.m_spCancel.setVisible(false);
      //设置确定按键位置
      this.m_spOkBtn.attr({
        x:284,
        y:65
      });
    }else if(1<iBtnNum){    //两个按键
      //设置确定按键位置
      this.m_spOkBtn.attr({
        x:150,
        y:65
      });
      //设置取消按键位置
      this.m_spCancel.attr({
        x:418,
        y:65
      });
    }//end if

    //创建消息文字
    this.m_lbMsg=new cc.LabelTTF(strMsg, 48, "ArialRoundedMTBold", cc.size(470, 460), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
    this.m_lbMsg.attr({
      x:284,
      y:342.5,
      anchorX:0.5,
      anchorY:0.5
    });
    this.m_lbMsg.setFontSize(48);
    this.m_spBg.addChild(this.m_lbMsg, 1);

    //点击事件锁定
    this.m_bLockTouch=false;

    //按键选择标志
    this.m_strBtnSelect="";

    //背景淡入
    this.BgFadeIn();
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

      if(ClickTest(this.m_spOkBtn, posTouch, DefCA)){           //点中确定按键
        bRes=true;
      }else if(ClickTest(this.m_spCancel, posTouch, DefCA)){    //点中取消按键
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

      if(ClickTest(this.m_spOkBtn, posTouch, ClickPT)){           //点中确定按键
        bRes=true;
        //锁定点击
        this.m_bLockTouch=true;
        //记录按键点击
        this.m_strBtnSelect="OK";
      }else if(ClickTest(this.m_spCancel, posTouch, ClickPT)){    //点中取消按键
        bRes=true;
        //锁定点击
        this.m_bLockTouch=true;
        //记录按键点击
        this.m_strBtnSelect="Cancel";
      }
    }while(false);
    //点中按键
    if(bRes){
      //关闭消息框
      this.Close();
    }
    return bRes;
  },

  onTouchCancelled:function(touch, event){
    return;
  },

  //背景淡入
  BgFadeIn:function(){
    var pAc1=cc.fadeTo(0.2, 150);
    var pAc2=cc.callFunc(this.ShowMgsEdg, this);  //显示消息框
    var pAc3=cc.sequence(pAc1, pAc2);
    this.m_clBlackBg.runAction(pAc3);
  },

  //显示消息框
  ShowMgsEdg:function(){
    var pAc1=cc.scaleTo(0.3, 1.0);
    pAc1.easing(cc.easeElasticOut(0.2));
    if(0<this.m_iAutoClose){
      var pAc2=cc.callFunc(this.EnAutoClose, this);   //开启自动关闭
      var pAc3=cc.sequence(pAc1, pAc2);
      this.m_spBg.runAction(pAc3);
    }else{
      this.m_spBg.runAction(pAc1);
    }
  },

  //开启自动关闭
  EnAutoClose:function(){
    this.scheduleOnce(this.Close, this.m_iAutoClose);
  },

  //关闭弹出窗
  Close:function(){
    //关闭自动关闭
    this.unscheduleAllCallbacks();
    //调用关闭动作
    this.HideMsg();
  },

  //消息框缩小
  HideMsg:function(){
    var pAc1=cc.scaleTo(0.2, 0);
    var pAc2=cc.callFunc(this.FadeOutBg, this);
    var pAc3=cc.sequence(pAc1, pAc2);
    this.m_spBg.runAction(pAc3);
  },

  //颜色背景淡出
  FadeOutBg:function(){
    var pAc1=cc.fadeTo(0.2, 0);
    var pAc2=cc.callFunc(this.ClearSelf, this);
    var pAc3=cc.sequence(pAc1, pAc2);
    this.m_clBlackBg.runAction(pAc3);
  },

  //清理资源
  ClearSelf:function(){
    //解析按键选择
    if(""===this.m_strBtnSelect){                 //未选择
      if(1<this.m_iBtnNum&& "function"===typeof this.m_funCancel){
        //有取消按键，执行取消回调
        this.m_funCancel();
      }else if(1===this.m_iBtnNum&& "function"===typeof this.m_funOk){
        //没有取消按键，执行确定回调
        this.m_funOk();
      }
    }else if("OK"===this.m_strBtnSelect){        //确定
      if("function"===typeof this.m_funOk){
        //有确定回调函数，执行确定回调
        this.m_funOk();
      }
    }else if("Cancel"===this.m_strBtnSelect){   //取消
      if("function"===typeof this.m_funCancel){
        //有取消回调函数，执行取消回调
        this.m_funCancel();
      }
    }
    //释放自己
    this.removeFromParent(true);
  }
});
