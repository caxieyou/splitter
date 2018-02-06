function ArrayHelperClass() {
    
}

ArrayHelperClass.isEmpty = function(param1)
{
    return param1 == null || param1.length == 0;
}

ArrayHelperClass.isNotEmpty = function(param1)
{
    return !ArrayHelperClass.isEmpty(param1);
}

ArrayHelperClass.ifHasAndSave = function(param1, param2)
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
      
ArrayHelperClass.ifHaveSameTheLaterOne = function(param1, param2)
{
    var _loc3_ = null;
    if(param1 != null && param2 != null)
    {
        for (var i = 0; i < param2.length; i++)
        {
            ArrayHelperClass.ifHasAndSave(param1,param2[i]);
        }
    }
}

ArrayHelperClass.addItem = function(param1, param2)
{
    if(!(param1 == null || param1 == undefined))
    {
        param1.push(param2);
    }
}

ArrayHelperClass.addItems = function(param1, param2)
{
    if(param1 != null && param2 != null)
    {
        for(var i = 0; i < param2.length; i++)
        {
            param1.push(param2[i]);
        }
    }
}

ArrayHelperClass.removeItemAt = function(param1, param2)
{
    if(ArrayHelperClass.isNotEmpty(param1) && param2 < param1.length)
    {
        param1.splice(param2,1);
    }
}

ArrayHelperClass.deleteSameValues = function(param1, param2)
{
    var _loc3_ = null;
    var _loc4_ = 0;
    if(ArrayHelperClass.isNotEmpty(param1) && ArrayHelperClass.isNotEmpty(param2))
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
      
ArrayHelperClass.removeItem = function(param1, param2)
{
    var _loc3_ = param1.indexOf(param2);
    if(_loc3_ != -1)
    {
        param1.splice(_loc3_,1);
        return true;
    }
    return false;
}

