/**
 * Created by tangdi on 2016/7/4.
 * 通用工具函数
 */

//点击测试函数
//参数1：测试点击节点
//参数2：点击坐标（世界坐标）
//参数3：点击动作函数
function ClickTest(pNode, posTouch, funClickAction)
{
  var bRes=false;
  do{
    //节点为空或节点隐藏，返回false
    if(!pNode|| !pNode.isVisible())
      break;
    //将检测节点0,0坐标转换到世界坐标系
    var locWord=pNode.convertToWorldSpace(cc.p(0, 0));
    //提取检测节点尺寸
    var sizNode=pNode.getContentSize();
    //创建检测区域
    var retNode=new cc.Rect(locWord.x, locWord.y, sizNode.width, sizNode.height);
    //点击命中节点
    if(cc.rectContainsPoint(retNode, posTouch)){
      //传入点击动作函数，调用动作函数
      if("function"===typeof funClickAction)
        funClickAction(pNode, posTouch);
      //命中标志置位
      bRes=true;
    }
  }while(false);
  return bRes;
}

//默认点击动作函数
//参数1：被点中节点
//参数2：点击坐标（世界坐标）
function DefCA(pNode, posTouch)
{
  //被点中节点缩小放大
  var pAc1=cc.scaleTo(0.05, 0.85);
  var pAc2=cc.scaleTo(0.05, 1.0);
  var pAc3=cc.sequence(pAc1, pAc2);
  pNode.runAction(pAc3);
}

//点击粒子效果
//参数1：被点中节点
//参数2：点击坐标（世界坐标）
function ClickPT(pNode, posTouch)
{
  //点击坐标转节点坐标系
  var locNode=pNode.convertToNodeSpace(posTouch);
  //创建粒子
  var ptClick=new cc.ParticleSystem("res/pt/click_btn.plist");
  ptClick.x=locNode.x;
  ptClick.y=locNode.y;
  //播放完成之后销毁自己
  ptClick.setAutoRemoveOnFinish(true);
  pNode.addChild(ptClick, 30);
}
