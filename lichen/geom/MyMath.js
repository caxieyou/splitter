//DONE

function MyMath() {
    
};

MyMath.TOLERANCE = 1.0E-6;


MyMath.sign = function(param1) {
    return param1 > 0?1:param1 < 0?-1:0;
};

MyMath.clamp = function(param1, param2, param3) {
    var loc4;
    if(param2 > param3)
    {
        loc4 = param2;
        param2 = param3;
        param3 = loc4;
    }
    
    return param1 < param2?Number(param2):param1 > param3?Number(param3):Number(param1);
    
};

MyMath.min = function(param1) {
    var loc2 = Number.MAX_VALUE
    
    for(var i = 0; i < param1.length; i++) {
        loc2 = Math.min(loc2, param1[i]);
    }
    return loc2;
};

MyMath.max = function(param1) {
    var loc2 = -Number.MAX_VALUE
    
    for(var i = 0; i < param1.length; i++) {
        loc2 = Math.max(loc2, param1[i]);
    }
    return loc2;
};

MyMath.nextIndex = function(param1, param2) {
    return (param1 + 1) % param2;
};

MyMath.acos = function (param1)
{
    param1 = Math.round(param1 * 1000000) * 1.0e-6;
    if(param1 > 1 || -1 > param1)
    {
        console.warn("acos paramater must be in [-1,1]!");
    }
    return Math.acos(param1);
};
MyMath.clamp_0_1 = function(param1)
{
    return param1 < 0 ? 0 : param1 > 1 ? 1 : param1;
}
