function MyCorner(param1) {
    if (param1 == null || param1 == undefined) {
        param1 = null;
    }
    this.mWall = param1;
    this.mPosition = new Vec2();
    this.mCurves = [];
    this.initialize();
    this.mId = ID.assignUniqueId();
    
}

MyCorner.prototype.initialize = function()
{
    this.mPosition = new Vec2();
    this.mCurves = [];
    mPosition = new Vec2();
}

MyCorner.prototype.dispose = function()
{
    for(var i = 0; i < this.mCurves.length; i++)
    {
        this.mCurves[i].setCornerStartAndEndButHasToBeSame(this,null);
    }
    if(this.mWall != null)
    {
        this.mWall.removeCorner(this);
    }
}

MyCorner.prototype.clone = function()
{
    var _loc1_ = new MyCorner(this.mWall);
    _loc1_.mCurves = this.mCurves.concat();
    _loc1_.mPosition = this.mPosition;
    return _loc1_;
}
MyCorner.prototype.addONE_PART = function(param1)
{
    return ArrayHelperClass.ifHasAndSave(this.mCurves,param1);
}

MyCorner.prototype.removeSpecificCurve_AH = function(param1)
{
    return ArrayHelperClass.removeItem(this.mCurves,param1);
}