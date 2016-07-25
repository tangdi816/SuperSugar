/**
 * Created by tangdi on 2016/7/23.
 * websocket 连接类  建立全局对象，游戏生命周期一直存在
 * 1、连接接入服务器
 * 2、加解密服务器数据
 * 3、接入服务器无法连接时，切换其他接入服务器
 * 4、所有接入服务器无法连接时，从指定服务器拉取新的接入服务器地址
 * 5、收到服务器消息，将消息推送到注册的上层消息解析模块
 */

//构造参数：
// 1、通信消息回调函数
// 2、消息回调对象
// 3、连接出错回调
// 4、连接出错回调对象
function CWBLinker(fpMsgCallFun, pMsgTarget, fpLinkError, pLETarget)
{
  //保存通信消息回调函数
  this.m_fpOnMsg=fpMsgCallFun;
  //保存消息回调对象
  this.m_pMsgTarget=pMsgTarget;
  //保存连接出错回调
  this.m_fpLinkError=fpLinkError;
  //保存连接出错回调对象
  this.m_pLETarget=pLETarget;

  //通信地址数组
  this.m_arAddres=null;
  //通信地址最大数量
  this.m_iMaxAN=0;
  //当前使用通信地址下标
  this.m_iCurAN=0;
  //初始化连接信息
  this.InitLinkInfo();
  //失效连接数量
  this.m_iFailAddNum=0;

  //推送消息开关，默认开true
  this.m_bSendMsg=true;

  //websocket对象
  this.m_oWS=null;

  //接收链接地址状态, 默认关闭false
  this.m_bRecvAddr=false;
  //地址服务器
  this.m_strAddrServer="ws://192.168.1.222:30001";
}

CWBLinker.prototype={
  constructor:CWBLinker,

  //初始化连接信息
  InitLinkInfo:function(){
    //读取连接配置文件
    cc.loader.loadJson("res/jf/netconf.json", this.LoadedJsonFile.bind(this));
  },

  //读入Json文件
  LoadedJsonFile:function(){
    if(2==arguments.length){
      var objJson=arguments[1];
      this.m_arAddres=objJson.addres;
      //最大地址数量
      this.m_iMaxAN=this.m_arAddres.length;
      //随机当前链接地址
      this.m_iCurAN=Math.floor(Math.random()*this.m_iMaxAN);

      //建立连接
      this.CreateLink();
    }
  },

  //建立通信连接
  CreateLink:function(){
    //清除UUID
    g_strMyUUID="";
    //建立websocket连接
    if(this.m_bRecvAddr){ //获取服务器地址
      this.m_oWS=new WebSocket(this.m_strAddrServer);
    }else{  //连接接入服务器
      this.m_oWS=new WebSocket(this.m_arAddres[this.m_iCurAN]);
    }
    //绑定错误回调
    this.m_oWS.onerror=this.OnLinkError.bind(this);
    //绑定消息回调
    this.m_oWS.onmessage=this.OnMessage.bind(this);
  },

  //通信故障回调函数
  OnLinkError:function(evt){
    //获取链接地址出错
    if(this.m_bRecvAddr){
      //调用连接错误回调
      if("function"==typeof this.m_fpLinkError)
        this.m_fpLinkError.call(this.m_pLETarget);
      return;
    }
    //检查当前连接状态，连接断开状态
    if(3!=this.m_oWS.readyState){
      //断开连接
      this.m_oWS.close();
    }
    //释放之前websocket对象
    this.m_oWS=null;

    //失效连接数+1
    this.m_iFailAddNum+=1;
    if(this.m_iMaxAN===this.m_iFailAddNum){   //所有连接地址已经失效
      //重新获取服务器地址
      this.ReGetAddr();
    }else{  //还有连接地址未失效
      //更换下一个链接地址
      this.m_iCurAN=(this.m_iCurAN+1)%this.m_iMaxAN;
      //重新建立服务器连接
      this.CreateLink();
    }
  },

  //重新获取服务器地址
  ReGetAddr:function(){
    //开启接收链接地址状态
    this.m_bRecvAddr=true;
    //建立通信连接
    this.CreateLink();
  },

  //通信消息回调
  OnMessage:function(evt){
    //提取加密消息
    var strCodedMsg=evt.data;
    //解密消息
    var strMsg="";
    if(0==g_strMyUUID.length){
      //使用源key串解码
      strMsg=EncodeAndDecode(strCodedMsg, g_strRootKey);
    }else{
      //使用UUID串解码
      strMsg=EncodeAndDecode(strCodedMsg, g_strMyUUID);
    }
    //解析json
    var oMsg=JSON.parse(strMsg);

    //解析命令号
    if(230000===oMsg.comm){          //服务器地址数据包
      this.m_arAddres=oMsg.addres;
      //最大地址数量
      this.m_iMaxAN=this.m_arAddres.length;
      //随机当前链接地址
      this.m_iCurAN=Math.floor(Math.random()*this.m_iMaxAN);
      //等待通信地址标志复位
      this.m_bRecvAddr=false;
      //建立连接
      this.CreateLink();
    }else if(230001===oMsg.comm){    //UUID数据包
      g_strMyUUID=oMsg.uid;
    }else{  //其它数据包
      //消息推送开启
      if(this.m_bSendMsg){
        //调用消息回调
        if("function"===typeof this.m_fpOnMsg)
          this.m_fpOnMsg.call(this.m_pMsgTarget, oMsg);
      }
    }//end if 解析命令号
  },//end OnMessage()

  //注册回调函数
  // 1、通信消息回调函数
  // 2、消息回调对象
  // 3、连接出错回调
  // 4、连接出错回调对象
  RegisterCallBack:function(fpMsgCallFun, pMsgTarget, fpLinkError, pLETarget){
    //保存通信消息回调函数
    this.m_fpOnMsg=fpMsgCallFun;
    //保存消息回调对象
    this.m_pMsgTarget=pMsgTarget;
    //保存连接出错回调
    this.m_fpLinkError=fpLinkError;
    //保存连接出错回调对象
    this.m_pLETarget=pLETarget;
  },

  //设置推送消息开关
  //参数：true推送  false不推送
  SetSendMsg:function(bIsSend){
    this.m_bSendMsg=bIsSend;
  },

  //发送消息
  SendMsg:function(strMsg){
    //查看UUID是否存在
    if(0<g_strMyUUID.length){
      //使用UUID加密消息
      var strCodedMsg=EncodeAndDecode(strMsg, g_strMyUUID);
      //发送消息
      this.m_oWS.send(strCodedMsg);
    }
  },

  //断开连接
  CloseLink:function(){
    //关闭连接
    this.m_oWS.close();
  }
}//end CWBLinker.prototype
