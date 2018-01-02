
function MyNumber() {

};
MyNumber.toFixed = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 6;
    }
    var loc3 = Math.pow(10,param2);
    return Math.round(param1 * loc3) / loc3;
}
MyNumber.isEqual = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 1.0E-6;
    }
    return Math.abs(param1 - param2) < param3;
}
MyNumber.isZeroOrOrigin = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6;
    }
    
    return Math.abs(param1) < param2;
}

MyNumber.getYourSelf = function(param1)
{
    if(MyNumber.isEqual(param1,1))
    {
        return 1;
    }
    if(MyNumber.isEqual(param1,0))
    {
        return 0;
    }
    return param1;
}