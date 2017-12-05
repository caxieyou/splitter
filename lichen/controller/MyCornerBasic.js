function MyCornerBasic () {
    this.mPosition = new Vec2();
    this.mCurves = [];

}

MyCornerBasic.CONST_15_DEGREE_ARC = 0.2617993877991494;

MyCornerBasic.prototype.initialize = function()
{
    this.mPosition = new Vec2();
    this.mCurves = [];//new Vector.<curveBasicClass>();
}

MyCornerBasic.prototype.dispose = function()
{
    for(var i = 0; i < this.mCurves.length; i++)
    {
        this.mCurves[i].setCornerStartAndEndButHasToBeSame(this,null);
    }
}

MyCornerBasic.prototype.addONE_PART = function(param1)
{
    return ArrayHelperClass.ifHasAndSave(this.mCurves,param1);
}

MyCornerBasic.prototype.removeSpecificCurve_AH = function(param1)
{
    return ArrayHelperClass.removeItem(this.mCurves,param1);
}

MyCornerBasic.prototype.invalidate = function()
{
    //var _loc1_:curveBasicClass = null;
    //this.invalidateDisplay();
    //for each(_loc1_ in this.mCurves)
    //{
    //    _loc1_.invalidate();
    //}
}
