<template>
    <div id="apps">
        <!--登录框-->
        <div @keyup.enter="login" style="width: 300px" class="center">
            <el-form :rules="rules" :model="store.user" label-width="80px" :label-position="labelPosition">
                <el-form-item prop="username" label="用户名">
                    <el-input style="width: 200px" placeholder="登录" autofocus v-model="store.user.username"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input style="width: 200px" autofocus type="password" v-model="store.user.password"></el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
//利用原生Js获取操作系统版本
function getOS () {
    var sUserAgent = navigator.userAgent
    var isWin = (navigator.platform == 'Win32') || (navigator.platform == 'Windows')
    var isMac = (navigator.platform == 'Mac68K') || (navigator.platform == 'MacPPC') || (navigator.platform == 'Macintosh') || (navigator.platform == 'MacIntel')
    if (isMac) return 'Mac'
    var isUnix = (navigator.platform == 'X11') && !isWin && !isMac
    if (isUnix) return 'Unix'
    var isLinux = (String(navigator.platform).indexOf('Linux') > -1)
    if (isLinux) return 'Linux'
    if (isWin) {
        var isWin2K = sUserAgent.indexOf('Windows NT 5.0') > -1 || sUserAgent.indexOf('Windows 2000') > -1
        if (isWin2K) return 'Win2000'
        var isWinXP = sUserAgent.indexOf('Windows NT 5.1') > -1 || sUserAgent.indexOf('Windows XP') > -1
        if (isWinXP) return 'WinXP'
        var isWin2003 = sUserAgent.indexOf('Windows NT 5.2') > -1 || sUserAgent.indexOf('Windows 2003') > -1
        if (isWin2003) return 'Win2003'
        var isWinVista = sUserAgent.indexOf('Windows NT 6.0') > -1 || sUserAgent.indexOf('Windows Vista') > -1
        if (isWinVista) return 'WinVista'
        var isWin7 = sUserAgent.indexOf('Windows NT 6.1') > -1 || sUserAgent.indexOf('Windows 7') > -1
        if (isWin7) return 'Win7'
        var isWin10 = sUserAgent.indexOf('Windows NT 10') > -1 || sUserAgent.indexOf('Windows 10') > -1
        if (isWin10) return 'Win10'
    }
    return 'other'
}

function getBrowserInfo () {
    var agent = navigator.userAgent.toLowerCase()
    console.log(agent)
    var arr = []
    var system = getOS()
    arr.push(system)
    var regStr_edge = /edge\/[\d.]+/gi
    var regStr_ie = /trident\/[\d.]+/gi
    var regStr_ff = /firefox\/[\d.]+/gi
    var regStr_chrome = /chrome\/[\d.]+/gi
    var regStr_saf = /safari\/[\d.]+/gi
    var regStr_opera = /opr\/[\d.]+/gi
    //IE
    if (agent.indexOf('trident') > 0) {
        arr.push(agent.match(regStr_ie)[0].split('/')[0])
        arr.push(agent.match(regStr_ie)[0].split('/')[1])
        return arr
    }
    //Edge
    if (agent.indexOf('edge') > 0) {
        arr.push(agent.match(regStr_edge)[0].split('/')[0])
        arr.push(agent.match(regStr_edge)[0].split('/')[1])
        return arr
    }
    //firefox
    if (agent.indexOf('firefox') > 0) {
        arr.push(agent.match(regStr_ff)[0].split('/')[0])
        arr.push(agent.match(regStr_ff)[0].split('/')[1])
        return arr
    }
    //Opera
    if (agent.indexOf('opr') > 0) {
        arr.push(agent.match(regStr_opera)[0].split('/')[0])
        arr.push(agent.match(regStr_opera)[0].split('/')[1])
        return arr
    }
    //Safari
    if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
        arr.push(agent.match(regStr_saf)[0].split('/')[0])
        arr.push(agent.match(regStr_saf)[0].split('/')[1])
        return arr
    }
    //Chrome
    if (agent.indexOf('chrome') > 0) {
        arr.push(agent.match(regStr_chrome)[0].split('/')[0])
        arr.push(agent.match(regStr_chrome)[0].split('/')[1])
        return arr
    } else {
        arr.push('请更换主流浏览器，例如chrome,firefox,opera,safari,IE,Edge!')
        return arr
    }
}

function getLocation (cb) {
    var data = { key: '4MIBZ-LJMCF-6RKJA-NGKN4-JJZFF-2JBMJ' }//ip缺省时会自动获取请求端的公网IP,
    var url = 'https://apis.map.qq.com/ws/location/v1/ip'
    data.output = 'jsonp'
    $.ajax({
        type: 'get',
        dataType: 'jsonp',
        data: data,
        jsonp: 'callback',
        url: url,
        success: function (json) {
            array = new Array
            array.push(json.result.ip)//公网IP
            array.push(json.result.ad_info.province + json.result.ad_info.city + json.result.ad_info.district)//省市区
            array.push(json.result.location.lat)//经度
            array.push(json.result.location.lng)//纬度
            cb(array)//回调函数
        },
        error: function (err) {

        }
    })
}

function getUserIP (onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
    var pc = new myPeerConnection({
            iceServers: []
        }),
        noop = function () {
        },
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key

    function iterateIP (ip) {
        if (!localIPs[ip]) onNewIP(ip)
        localIPs[ip] = true
    }

    //create a bogus data channel
    pc.createDataChannel('')

    // create offer and set local description
    pc.createOffer().then(function (sdp) {
        sdp.sdp.split('\n').forEach(function (line) {
            if (line.indexOf('candidate') < 0) return
            line.match(ipRegex).forEach(iterateIP)
        })

        pc.setLocalDescription(sdp, noop, noop)
    }).catch(function (reason) {
        // An error occurred, so handle the failure to connect
    })

    //sten for candidate events
    pc.onicecandidate = function (ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP)
    }
}

function pcOrPhone () {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        return '移动端'
    } else {
        return 'pc端'
    }
}

function cb (result) {
    getUserIP(function (localIp) {
        app.tologin(store.user, result, localIp)
    })
}

var store = {
    labelPosition: 'right',
    user: { username: '', password: '' },
    rules: {
        username: { required: true, message: '用户名不能为空', trigger: 'blur' },
        password: { required: true, message: '密码不能为空', trigger: 'blur' }
    }
}
export default {
    name: 'login',
    data () {
        return {
            store: {
                labelPosition: 'right',
                user: { username: '', password: '' },
                rules: {
                    username: { required: true, message: '用户名不能为空', trigger: 'blur' },
                    password: { required: true, message: '密码不能为空', trigger: 'blur' }
                }
            },
            labelPosition: 'right',
            user: { username: '', password: '' },
            rules: {
                username: { required: true, message: '用户名不能为空', trigger: 'blur' },
                password: { required: true, message: '密码不能为空', trigger: 'blur' }
            }
        }
    },
    created: function () {
        /*$("#app").show();*/
    },
    methods: {
        /*用户名或者密码任意一个点击enter都会触发*/
        login: function () {
            //my-login.js通过回调获取ip,系统信息,位置信息等
            getLocation(cb)
        },
        /*my-login.js中的app.tologin(store.user, result, localIp)
        * result:包含经度X,纬度Y,省市区,和公网IP
        * getBrowserInfo():获取浏览器类型,版本,操作系统类型
        * pcOrPhone:获取设备类型,pc或者手机
        * */
        tologin: function (user, location, localIp) {
            if (user.username != '' && user.password != '') {
                var vueThis = this
                $.ajax({
                    type: 'post',
                    contentType: 'application/json',
                    url: '/tologin',
                    data: JSON.stringify({
                        'user': user,
                        'location': location,
                        'browserInfo': getBrowserInfo(),
                        'pcOrPhone': pcOrPhone(),
                        'localIp': localIp
                    }),
                    success: function (data) {
                        if (data.status == 0) {
                            window.location.href = data.url
                        } else {
                            vueThis.$message(data.msg)
                        }
                    }
                })
            }
        }
    }
}
</script>

<style>
/*登录框水平居中*/
.center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
