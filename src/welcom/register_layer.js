/**
 * Created by tangdi on 2016/7/4.
 * 注册账号页面
 */

//注册账号页面
var CRegLayer=cc.Layer.extend({
  //获取屏幕尺寸
  sizWin:cc.winSize,

  //重载构造函数
  //参数传入场景根节点
  ctor:function(pSceneRoot){
    //调用父类构造
    this._super();

    //保存场景根节点
    this.pRoot=pSceneRoot;

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


  },

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


    }while(false);
    return bRes;
  },

  onTouchCancelled:function(touch, event){
    return;
  }
});
