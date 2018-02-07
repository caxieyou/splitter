function MyArray() {
    
}

MyArray.isEmpty = function(param1)
{
    return param1 == null || param1.length == 0;
}

MyArray.isNotEmpty = function(param1)
{
    return !MyArray.isEmpty(param1);
}

MyArray.ifHasAndSave = function(param1, param2)
{
    if(param1 != null)
    {
        if(param1.indexOf(param2) == -1)
        {
            param1.push(param2);
            return true;
        }
        return false;
    }
    return false;
}
      
MyArray.ifHaveSameTheLaterOne = function(param1, param2)
{
    var _loc3_ = null;
    if(param1 != null && param2 != null)
    {
        for (var i = 0; i < param2.length; i++)
        {
            MyArray.ifHasAndSave(param1,param2[i]);
        }
    }
}

MyArray.addItem = function(param1, param2)
{
    if(!(param1 == null || param1 == undefined))
    {
        param1.push(param2);
    }
}

MyArray.addItems = function(param1, param2)
{
    if(param1 != null && param2 != null)
    {
        for(var i = 0; i < param2.length; i++)
        {
            param1.push(param2[i]);
        }
    }
}

MyArray.removeItemAt = function(param1, param2)
{
    if(MyArray.isNotEmpty(param1) && param2 < param1.length)
    {
        param1.splice(param2,1);
    }
}

MyArray.deleteSameValues = function(param1, param2)
{
    var _loc3_ = null;
    var _loc4_ = 0;
    if(MyArray.isNotEmpty(param1) && MyArray.isNotEmpty(param2))
    {
        for (var i = 0; i < param2.length; i++)
        {
            var _loc3_ = param2[i];
            _loc4_ = param1.indexOf(_loc3_);
            if(_loc4_ != -1)
            {
                param1.splice(_loc4_,1);
            }
        }
    }
}
      
MyArray.removeItem = function(param1, param2)
{
    var _loc3_ = param1.indexOf(param2);
    if(_loc3_ != -1)
    {
        param1.splice(_loc3_,1);
        return true;
    }
    return false;
}

