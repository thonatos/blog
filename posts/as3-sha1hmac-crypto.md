


As3使用sha1hmac加密字符串算法，使用方法如下。

#### #Code
```
import com.hurlant.crypto.hash.HMAC;
import com.hurlant.util.Base64;
import com.hurlant.util.Hex;
import com.hurlant.crypto.Crypto;
import com.hurlant.crypto.hash.IHash;

private function computeHMAC():void {
    
    // 1: get a IHash.
    var hmac:HMAC = Crypto.getHMAC("sha1");

    // 2: secket
    var k:String = "secret";
    var kdata:ByteArray;    
    kdata = Hex.toArray(Hex.fromString(k));

    // 3: stringToSign
    var txt:String = "stringToSign";
    var data:ByteArray;	
    data = Hex.toArray(Hex.fromString(txt));

    // 4: currentResult
    var currentResult:ByteArray;
    currentResult = hmac.compute(kdata, data);
    
    // 5: result(hex)
    var result:String;
    result = Hex.fromArray(currentResult);
}
```


#### #More


- [http://crypto.hurlant.com/demo/](http://crypto.hurlant.com/demo/)
- [http://crypto.hurlant.com/demo/srcview/](http://crypto.hurlant.com/demo/srcview/)

