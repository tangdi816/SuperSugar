/**
 * Created by tangdi on 2016/7/5.
 * 等待光标页面
 */

//等待光标
var CWaitCursor=cc.Layer.extend({
  //获取屏幕尺寸
  m_sizWin:cc.winSize,

  //重载构造函数
  ctor:function(){
    //调用父类构造
    this._super();

    //创建时候隐藏
    this.setVisible(false);

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

    //创建背景黑色层
    this.m_lyBg=new cc.LayerColor(cc.color(0, 0, 0, 0), this.m_sizWin.width, this.m_sizWin.height);
    this.addChild(this.m_lyBg, 1);

    //创建等待光标背景
    this.m_spCurBg=new cc.Sprite("res/common/wait_cursor_bg.png");
    this.m_spCurBg.attr({
      x:this.m_sizWin.width/2,
      y:this.m_sizWin.height/2
    });
    this.m_spCurBg.setVisible(false);
    this.addChild(this.m_spCurBg, 2);

    //创建粒子
    this.m_ptCur=new cc.ParticleSystem("res/pt/wait_cursor_pt.plist");
    this.m_ptCur.setAnchorPoint(cc.p(0.5, 0.5));
    this.m_ptCur.setPosition(cc.p(96, 159));
    this.m_ptCur.setEmissionRate(80);
    this.m_spCurBg.addChild(this.m_ptCur, 1);

    //开启转动
    this.StartTurn();
  },

  //开始转动
  StartTurn:function(){
    var pAc1=cc.rotateBy(0.1, 15);
    var pAc2=cc.repeatForever(pAc1);
    this.m_spCurBg.runAction(pAc2);

    var pAc3=cc.rotateBy(0.1, -15);
    var pAc4=cc.repeatForever(pAc3);
    this.m_ptCur.runAction(pAc4);
  },

  onTouchBegan:function(touch, event){
    var bRes=false;
    //等待光标页面吃掉所有touch
    if(this.isVisible())
      bRes=true;
    return bRes;
  },

  onTouchMoved:function(touch, event){
    return;
  },

  onTouchEnded:function(touch, event){
    var bRes=false;
    if(this.isVisible())
      bRes=true;
    return bRes;
  },

  onTouchCancelled:function(touch, event){
    return;
  },

  //显示等待光标
  ShowWaitCursor:function(){
    this.m_lyBg.setOpacity(0);
    this.m_spCurBg.setVisible(false);
    this.setVisible(true);

    //显示背景黑色
    var pAc1=cc.fadeTo(0.2, 150);
    var pAc2=cc.callFunc(this.ShowCur, this);   //显示圆圈
    var pAc3=cc.sequence(pAc1, pAc2);
    this.m_lyBg.runAction(pAc3);
  },

  //显示元圈
  ShowCur:function(){
    this.m_spCurBg.setVisible(true);
  },

  //隐藏等待光标
  HideWaitCursor:function(){
    this.setVisible(false);
    this.m_lyBg.setOpacity(0);
    this.m_spCurBg.setVisible(false);
  }
});
