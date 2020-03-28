// export default JsonRpc
/*
Xenocider 2018
depend on axios.js
 **sample
const server = JsonRpc('/api')
server.test(args).then(callback).catch(failcallback)
 */

//var axios = require('axios')

function jsonrpcAxios(url, jsonData) {
    return new Promise((resolve, reject) => {
      axios.post(url, jsonData).then(response => {
        if (response.data.hasOwnProperty('result')) {
          resolve(response.data.result)
        } else {
          reject(response.data.error)
        }
      }).catch(error => reject(error.response.statusText))
    })
}

function jsonrpcJquery(url, jsonData) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: url,
            data: JSON.stringify(jsonData),
            dataType: 'json',
            type: 'post',
            success: function (data) {
                if (data.hasOwnProperty('result'))
                    resolve(data.result);
                else
                    reject(data.error)
            },
            error: function (data) {
                reject(data.statusText)
            },
        });
    });
}

function JsonRpc(url, middlewareFunction) {
  return new Proxy(() => { }, {
    get: function (target, method, receiver) {
      return function () {
        var jsonData = {
          jsonrpc: '2.0',
          method: method,
          params: Array.prototype.slice.call(arguments),
          id: Math.floor(Math.random() * 9999)
        }
        return middlewareFunction(url, jsonData)
      }
    }
  })
}
