export function QrcodePage(params: {
  checkType: 'QRCODE' | 'MESSAGE'
  qrcode: string
  endpoint: string
  code: string
  redirectUri: string
}) {
  const { qrcode, checkType, endpoint, code, redirectUri } = params
  const isLink = checkType == 'MESSAGE'
  return `
        <html>
          <head>
            <title>微信公众号登录</title>
            <script src="https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/qrcodejs/1.0.0/qrcode.min.js"></script>
          </head>
          <body style="display:flex;justify-content:center;align-items:center;height:100vh;width:100vw;margin:0;background:#525252;">
           <div style="padding:20px;border-radius:10px;text-align:center;background-color:white;">
            <p>请使用微信扫描二维码登录</p>
            ${isLink ? `<p>输入验证码：<span style='color:red'>${code}</span></p>` : ''}
            ${
              isLink
                ? `<img  src=${qrcode} alt='scan qrcode'/>`
                : `<div id="qrcode"></div>`
            }
            <p>验证时间:
            <span id="time">60</span>
            秒</p>
            </div>
           
    <script>
           ${
             isLink
               ? ''
               : ` new QRCode("qrcode", {
                text: "${qrcode}",
                width: 258,
                height: 258,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
              });`
           }
            
        // 模拟的API URL，用于检查登录状态
        const checkLoginUrl = '${endpoint}?action=check';
        // 登录成功后的跳转URL
        const successRedirectUrl = '${redirectUri}?code=${code}';

        function checkLoginStatus() {
            fetch(checkLoginUrl, {
                method: 'POST',  
                body: JSON.stringify({
                    code: '${code}'
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())  
            .then(data => {
                if (data.type=='success') {  
                    alert("登录成功");
                    window.location.href = successRedirectUrl; 
                } else if(data.type=="fail") {
                    console.log('登录失败');
                    clearInterval(checkLoginStatus);
                }   
            })
            .catch(error => {
                console.error('请求过程中出现错误:', error);
            });
        }
        setInterval(checkLoginStatus, 5000);
            // 倒计时60秒
        let time = 60;
        const timer = setInterval(() => {
            time--;
            if (time === 0) {
                clearInterval(timer);
                clearInterval(checkLoginStatus);
                alert("登录超时，请重新登录");
                // 返回上一页
                window.history.go(-1);
            } else {
                document.getElementById('time').innerHTML = time;
            // 如果低于10秒 ，红色加粗
            if (time < 10) {
                document.getElementById('time').style.color = "red";
                document.getElementById('time').style.fontWeight = "bold";
                }
            }
        }, 1000);
    </script>
          </body>
        </html>
        `
}
