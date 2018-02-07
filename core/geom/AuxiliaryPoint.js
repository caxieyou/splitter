function AuxiliaryPoint() {
    
}

AuxiliaryPoint.getCenter = function(param1)
{
    var _loc2_ = new Vec2(0,0);
    for(var i = 0; i < param1.length; i++)
    {
        _loc2_.add(param1[i]);
    }
    return _loc2_.mulBy(1 / param1.length);
}

AuxiliaryPoint.removeItemAt = function(param1, param2)
{
    if(isNotEmpty(param1) && param2 < param1.length)
    {
        param1.splice(param2,1);
    }
}

AuxiliaryPoint.removeDuplicate = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-5;
    }
    
    var _loc4_ = 0;
    var _loc3_ = 0;
    while(_loc3_ < param1.length - 1)
    {
        _loc4_ = _loc3_ + 1;
        while(_loc4_ < param1.length)
        {
            if(Vec2.isEqual(param1[_loc3_],param1[_loc4_],param2))
            {
                param1.splice(_loc4_,1);
            }
            else
            {
                _loc4_++;
            }
        }
        _loc3_++;
    }
}

AuxiliaryPoint.removeSameOneByOne = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6
    }
    var _loc4_ = 0;
    var _loc3_ = 0;
    while(_loc3_ < param1.length - 1)
    {
        _loc4_ = _loc3_ + 1;
        while(_loc4_ < param1.length)
        {
            if(Vec2.isEqual(param1[_loc3_],param1[_loc4_],param2))
            {
              param1.splice(_loc4_,1);
              continue;
            }
            break;
        }
        _loc3_++;
    }
}

AuxiliaryPoint.removeSameEndConnected = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6
    }
    AuxiliaryPoint.removeSameOneByOne(param1,param2);
    var _loc3_ = param1.length;
    if(_loc3_ > 1 && Vec2.isEqual(param1[0],param1[_loc3_ - 1],param2))
    {
        param1.splice(_loc3_ - 1,1);
    }
}