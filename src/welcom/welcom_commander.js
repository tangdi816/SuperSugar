/**
 * Created by tangdi on 2016/7/25.
 * welcom场景通信消息收发类
 * 1、解析服务器消息，调用对应消息的处理接口
 * 2、提供welcom场景中所有种类消息Json字符串的拼装发送接口
 */

var CWlcCommander=cc.Layer.extend({
  //重载构造函数
  //传入场景根节点指针
  ctor:function(pSceneRoot){
    //调用父类构造
    this._super();
  },

  //服务器消息回调函数
  //参数：传入消息对象
  OnServerMsg:function(oMsg){
    //提取命令号
    var iComm=oMsg.comm;
    if(g_iCommWelReg===iComm){          //注册回复消息

    }else if(g_iCommWelLog===iComm){    //登录回复消息

    }
  },

  //发送注册
  //参数1：注册用户名
  //参数2：注册密码
  SendRegMsg:function(strUN, strPW){
    //拼装消息json串
    var oJson={
      "comm":g_iCommWelReg,   //命令号3300001
      "sc":g_iSCAccount,       //接受命令服务器编号0：账号服务器
      "un":strUN,               //用户名
      "pw":strPW                //密码
    };
    var strJson=JSON.stringify(oJson);

    //发送消息
    g_oLinker.SendMsg(strJson);
    return;
  },

  //发送登录
  //参数1：登录用户名
  //参数2：登录密码
  SendLogMsg:function(strUN, strPW){
    //拼装消息json串
    var oJson={
      "comm":g_iCommWelLog,    //命令号3300002
      "sc":g_iSCAccount,       //接收命令服务器编号0：账号服务器
      "un":strUN,               //用户名
      "pw":strPW                //密码
    };
    var strJson=JSON.stringify(oJson);

    //发送消息
    g_oLinker.SendMsg(strJson);
    return;
  }
});