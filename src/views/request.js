

const server="http://localhost:8081"
// 封装get请求
export function httpGet(url){
    var result = fetch(server+url)
    return result
}
// 封装post请求
export function httpPost(url,data){
    var result = fetch(server+url,{
        method:'post',
        headers:{
            'Accept':'application/json,text/plain,*/*',/* 格式限制：json、文本、其他格式 */
            'Content-Type':'application/x-www-form-urlencoded'/* 请求内容类型 */
        },
        body:paramsPostBody(data)
    })
    return result
}
//格式化data
function paramsPostBody(obj){
    var result = '';
    var item;
    for(item in obj){
        result += '&'+item+'='+encodeURIComponent(obj[item])
    }
    if(result){
        result = result.slice(1)//去掉第一个&
    }
    return result
}