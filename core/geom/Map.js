function Map() {
    this._stringMap = {};
    this._keys = {};
    this._items = {};
    this._size = 0;   
}

Map.prototype.removeAll = function(param1)
{
    var _loc2_ = 0;
    
    for (var _loc3_ in this._stringMap) {
        if (this._stringMap[_loc3_]  == param1) {
            delete this._stringMap[_loc3_];
            this._size--;
            
            _loc2_++;
        }
    }
    
    for (var _loc4_ in this._items) {
        if(_items[_loc4_] === param1)
        {
            delete this._keys[_loc4_];
            delete this._items[_loc4_];
            this._size--;
            
            _loc2_++;
        }
    }
    
    return _loc2_;
}

Map.prototype.getSize = function()
{
    return this._size;
}

Map.prototype.keysToArray = function()
{
    var _loc1_ = [];
    for (var _loc2_ in this._stringMap)
    {
        _loc1_.push(_loc2_);
    }
    
    for (var _loc3_ in this._keys)
    {
        _loc1_.push(this._keys[_loc3_]);
    }
    return _loc1_;
}

Map.prototype.clear = function()
{
    if(!this._size)
    {
        return false;
    }
    this._keys = {};
    this._items = {};
    this._stringMap = {};
    this._size = 0;
    return true;
}

Map.prototype.count = function(param1)
{
    var _loc2_ = 0;
    for (var _loc3_ in this._stringMap)
    {
        if(this._stringMap[_loc3_] === param1)
        {
            _loc2_++;
        }
    }
    for (var _loc3_ in this._items)
    {
        if(this._items[_loc3_] === param1)
        {
            _loc2_++;
        }
    }
    return _loc2_;
}

Map.prototype.has = function(param1)
{
    for (var _loc2_ in this._stringMap)
    {
        if(this._stringMap[_loc2_] === param1)
        {
            return true;
        }
    }
    
    for (var _loc2_ in this._items)
    {
        if(this._items[_loc2_] === param1)
        {
            return true;
        }
    }
    return false;
}

Map.prototype.remove = function(param1)
{
    for(var _loc2_ in this._stringMap)
    {
        if(this._stringMap[_loc2_] === param1)
        {
            delete this._stringMap[_loc2_];
            this._size--;
            return true;
        }
    }
    for(var _loc3_ in this._items)
    {
        if(this._items[_loc3_] === param1)
        {
            delete this._keys[_loc3_];
            delete this._items[_loc3_];
            this._size--;
            return true;
        }
    }
    return false;
}

Map.prototype.add = function(param1, param2)
{
    if(param1 instanceof String)
    {
        if(this._stringMap[param1] !== undefined)
        {
            return false;
        }
        this._stringMap[param1] = param2;
    }
    else
    {
        if (this.hasKey(param1))
        {
            return false;
        }
        this._keys[this._size] = param1;
        this._items[this._size] = param2;
    }
    this._size++;
    return true;
}

Map.prototype.hasKey = function(param1)
{
    if (param1 instanceof String) {
        return this._stringMap[param1] !== undefined;
    } else {
        for(var _loc3_ in this._keys) {
            if (this._keys[_loc3_] == param1) {
                 return true;
            }
        }
    }
    return false;
}

Map.prototype.replaceFor = function(param1, param2)
{
    if(param1 instanceof String)
    {
        if(this._stringMap[param1] === undefined)
        {
            return false;
        }
        if(this._stringMap[param1] === param2)
        {
            return false;
        }
        this._stringMap[param1] = param2;
    }
    else
    {
        if (this.hasKey(param1)) {
            for(var _loc3_ in this._keys) {
                if (this._keys[_loc3_] == param1) {
                     if (this._items[_loc3_] == param2) {
                         return false;
                     }
                     else {
                         this._items[_loc3_] = param2;
                         return true;
                     }
                }
            }
        } else {
            return false;
        }
    }
    return true;
}

Map.prototype.removeKey = function(param1)
{
    var _loc2_ = undefined;
    if(param1 instanceof String)
    {
        if(this._stringMap[param1] === undefined)
        {
            return undefined;
        }
        _loc2_ = this._stringMap[param1];
        delete _stringMap[param1];
    }
    else
    {
        if (this.hasKey(param1)) {
            for(var _loc3_ in this._keys) {
                if (this._keys[_loc3_] == param1) {
                    _loc2_ = this._items[_loc3_];
                    delete this._keys[_loc3_];
                    delete this._items[_loc3_];
                    break;
                }
            }
        } else
        {
            return undefined;
        }
    }
    this._size--;
    return _loc2_;
}

Map.prototype.itemFor = function(param1)
{
    if(param1 instanceof String)
    {
        return this._stringMap[param1];
    }
    if (this.hasKey(param1)) {
        for(var _loc3_ in this._keys) {
            if (this._keys[_loc3_] == param1) {
                return this._items[_loc3_];
            }
        }
    } 
}