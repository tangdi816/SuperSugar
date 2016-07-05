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
    this.m_lbMsg=new cc.LabelTTF(strMsg, 22, "", cc.size(470, 460), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
    this.m_lbMsg.attr({
      x:284,
      y:342.5,
      anchorX:0.5,
      anchorY:0.5
    });
    this.m_spBg.addChild(this.m_lbMsg, 1);

    //点击事件锁定
    this.m_bLockTouch=false;

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


    }while(false);
    return bRes;
  },

  onTouchCancelled:function(touch, event){
    return;
  },

  //背景淡入
  BgFadeIn:function(){
    var pAc1=cc.fadeTo(0.2, 100);
    var pAc2=cc.callFunc(this.ShowMgsEdg, this);  //显示消息框
    var pAc3=cc.sequence(pAc1, pAc2);
    this.m_clBlackBg.runAction(pAc3);
  },

  //显示消息框
  ShowMgsEdg:function(){
    var pAc1=cc.scaleTo(0.3, 1.0);
    pAc1.easing(cc.easeElasticOut(0.2));
    if(0<this.m_iAutoClose){
      var pAc2=cc.callFunc();
      var pAc3=cc.sequence(pAc1, pAc2);
      this.m_spBg.runAction(pAc3);
    }else{
      this.m_spBg.runAction(pAc1);
    }
  },

  //开启自动关闭
  OpenAutoClose:function(){

  }
});
