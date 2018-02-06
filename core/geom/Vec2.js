function Vec2(param1, param2, param3) {
    if (param1 == null || param1 == undefined) {
        param1 = 0;
    }
    if (param2 == null || param2 == undefined) {
        param2 = 0;
    }
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    this.mX = param1;
    this.mY = param2;
    this.mW = param3;//点 OR 向量
};

Vec2.THRESHOLD = 1.0E-6;
Vec2.CONST1 = 1;
Vec2.HASHCODEMULTI = 100;
Vec2.mXCONST = 0;
Vec2.mYCONST = 1;
Vec2.ONE = function (){
    return new Vec2(1, 1);
};

Vec2.ZERO = function (){
    return new Vec2(0, 0);
};

Vec2.MAXVALUE = function (){
    return new Vec2(Number.MAX_VALUE, Number.MAX_VALUE);
};

Vec2.MINVALUE = function() {
    return new Vec2(-Number.MAX_VALUE, -Number.MAX_VALUE);
};

Vec2.mXAXIS = function() {
    return new Vec2(1, 0, true);
};

Vec2.mYAXIS = function() {
    return new Vec2(0, 1, true);
};

Vec2.splitByAngle = function(param1, param2)
{
    return new Vec2(param1 * Math.cos(param2),param1 * Math.sin(param2));
};
      
Vec2.offset = function(param1, param2, param3)
{
    return param1.addBySplitAngle(param2,param3);
};
      
Vec2.distance = function(param1, param2)
{
    return Math.sqrt(Math.pow(param1.mX - param2.mX,2) + Math.pow(param1.mY - param2.mY,2));
};

Vec2.distanceSquare = function(param1, param2)
{
    return Math.pow(param1.mX - param2.mX,2) + Math.pow(param1.mY - param2.mY,2);
};


Vec2.getAngle = function(param1)
{
    return Math.atan2(param1.mY,param1.mX);
};
      
Vec2.getAngleByTan = function(param1, param2)
{
    return Math.atan2(param2.mY - param1.mY,param2.mX - param1.mX);
};

Vec2.IncludedAngleValue = function(param1, param2)
{
    return Math.acos(Vec2.projectCosValue(param1,param2));
};

Vec2.projectCosValue = function(param1, param2)
{
    var loc3 = Vec2.dot(param1,param2) / (param1.getLength() * param2.getLength());
    return MyMath.clamp(loc3,-1,1);
};
      
Vec2.min = function(param1, param2)
{
    return new Vec2(Math.min(param1.mX,param2.mX),Math.min(param1.mY,param2.mY));
};

Vec2.max = function(param1, param2)
{
    return new Vec2(Math.max(param1.mX,param2.mX),Math.max(param1.mY,param2.mY));
};

Vec2.add = function(param1, param2)
{
    var res = new Vec2(param1.mX + param2.mX, param1.mY + param2.mY);
    return res;
};

Vec2.sub = function(param1, param2)
{
    return new Vec2(param1.mX - param2.mX,param1.mY - param2.mY);
};

Vec2.dot = function(param1, param2)
{
    return param1.mX * param2.mX + param1.mY * param2.mY;
};

Vec2.prototype.sub = function(param1)
{
    return new Vec2(this.mX - param1.mX,this.mY - param1.mY);
};

Vec2.prototype.mul = function(param1)
{
    return new Vec2(this.mX * param1,this.mY * param1);
};

Vec2.prototype.dot = function(param1)
{
    return this.mX * param1.mX + this.mY * param1.mY;
};

Vec2.prototype.cross = function(param1)
{
    return this.mX * param1.mY - this.mY * param1.mX;
};

Vec2.prototype.scale = function(param1)
{
    return new Vec2(this.mX * param1.mX,this.mY * param1.mY);
};

Vec2.prototype.divide = function(param1)
{
    return new Vec2(this.mX / param1.mX,this.mY / param1.mY);
};

Vec2.prototype.rotate = function(param1, param2)
{
    if(param2 == null || param2 == undefined)
    {
        param2 = new Vec2(0,0);
    }
    var loc3 = Math.cos(param1);
    var loc4 = Math.sin(param1);
    var loc5 = Vec2.sub(this,param2);
    var loc6 = loc5.mX * loc3 - loc5.mY * loc4 + param2.mX;
    var loc7 = loc5.mX * loc4 + loc5.mY * loc3 + param2.mY;
    return new Vec2(loc6,loc7);
};

Vec2.cross = function(param1, param2)
{
    return param1.mX * param2.mY - param1.mY * param2.mX;
};

Vec2.clone = function(param1)
{
    return !!param1 ? new Vec2(param1.mX,param1.mY) : null;
};

Vec2.mul = function(param1, param2)
{
    return new Vec2(param1.mX * param2,param1.mY * param2);
};

Vec2.scale = function(param1, param2)
{
    return new Vec2(param1.mX * param2.mX,param1.mY * param2.mY);
};

Vec2.divide = function(param1, param2)
{
    return new Vec2(param1.mX / param2.mX,param1.mY / param2.mY);
};

Vec2.middle = function(param1, param2)
{
    return Vec2.interpolate(param1,param2,0.5);
};

Vec2.crossByPoint  = function(param1, param2, param3)
{
    return (param2.mX - param1.mX) * (param3.mY - param1.mY) - (param3.mX - param1.mX) * (param2.mY - param1.mY);
};

Vec2.interpolate = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 0.5;
    }
    return new Vec2(param1.mX + (param2.mX - param1.mX) * param3,param1.mY + (param2.mY - param1.mY) * param3);
}

Vec2.isEqual = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 1.0E-6;
    }
    
    var loc4 = param1.mX - param2.mX;
    var loc5 = param1.mY - param2.mY;
    return loc4 * loc4 + loc5 * loc5 <= param3 * param3;
};

Vec2.isHorizontal = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 1;
    }

    return Angle.isHorizontal(Vec2.getAngleByTan(param1,param2),param3);
};

Vec2.prototype.set = function(param1, param2)
{
    if (param1 == null || param1 == undefined) {
        param1 = 0;
    }
    if (param2 == null || param2 == undefined) {
        param2 = 0;
    }

    this.mX = param1;
    this.mY = param2;
    return this;
};

Vec2.prototype.setValue = function(param1)
{
    this.mX = this.mY = param1;
    return this;
};

Vec2.prototype.setZero = function()
{
    this.mX = this.mY = 0;
    return this;
};

Vec2.prototype.copy = function(param1)
{
    this.mX = param1.mX;
    this.mY = param1.mY;
    return this;
};

Vec2.prototype.addBy = function(param1)
{
    this.mX = this.mX + param1.mX;
    this.mY = this.mY + param1.mY;
    return this;
};

Vec2.prototype.add = function(param1)
{
    return new Vec2(this.mX + param1.mX,this.mY + param1.mY);
};

Vec2.prototype.sub = function(param1)
{
    this.mX = this.mX - param1.mX;
    this.mY = this.mY - param1.mY;
    return this;
};

Vec2.prototype.scaleBy = function(param1)
{
    this.mX = this.mX * param1.mX;
    this.mY = this.mY * param1.mY;
    return this;
};

Vec2.prototype.mulBy = function(param1)
{
    this.mX = this.mX * param1;
    this.mY = this.mY * param1;
    return this;
}

Vec2.prototype.rotateBy = function(param1, param2)
{
    if(param2 == null || param2 == undefined){
        param2 = new Vec2(0,0);
    }
    var loc3 = Math.cos(param1);
    var loc4 = Math.sin(param1);
    var loc5 = Vec2.sub(this,param2);
    this.mX = loc5.mX * loc3 - loc5.mY * loc4 + param2.mX;
    this.mY = loc5.mX * loc4 + loc5.mY * loc3 + param2.mY;
    return this;
};

Vec2.prototype.translate = function(param1, param2)
{
    this.mX = this.mX + param1;
    this.mY = this.mY + param2;
    return this;
};

Vec2.prototype.invert = function()
{
    this.mX = 1 / this.mX;
    this.mY = 1 / this.mY;
    return this;
};

Vec2.prototype.negtive = function()
{
    this.mX = this.mX * -1;
    this.mY = this.mY * -1;
    return this;
};

Vec2.prototype.negateYAxis = function()
{
    this.mY = this.mY * -1;
    return this;
};

Vec2.prototype.normalize = function()
{
    var loc1 = this.mX * this.mX + this.mY * this.mY;
    if(loc1 == 1)
    {
        return this;
    }
    loc1 = Math.sqrt(loc1);
    if(loc1 < Vec2.THRESHOLD)
    {
        return this;
    }
    loc1 = 1 / loc1;
    this.mX = this.mX * loc1;
    this.mY = this.mY * loc1;
    return this;
};

Vec2.prototype.addBySplitAngle = function(param1, param2)
{
    return this.add(Vec2.splitByAngle(param1,param2));
};

Vec2.prototype.transform = function(param1, param2, param3)
{
    return this.scale(param1).rotateBy(param2).add(param3);
};

Vec2.prototype.distance = function(param1)
{
    return Math.sqrt(Math.pow(this.mX - param1.mX,2) + Math.pow(this.mY - param1.mY,2));
};

Vec2.prototype.distanceSquare = function(param1)
{
    return Math.pow(this.mX - param1.mX,2) + Math.pow(this.mY - param1.mY,2);
};

Vec2.prototype.rotate_90_degree = function()
{
    return new Vec2(-this.mY,this.mX);
}

Vec2.prototype.rotate_minus_90_degree = function()
{
    return new Vec2(this.mY,-this.mX);
};
      
Vec2.prototype.clone = function()
{
    return new Vec2(this.mX,this.mY);
};

Vec2.prototype.equals = function(param1)
{
    return MyNumber.isEqual(this.mX,param1.mX,Vec2.THRESHOLD) && MyNumber.isEqual(this.mY,param1.mY,Vec2.THRESHOLD);
};
      
Vec2.prototype.isClose = function(param1, param2)
{
    if(param2 == null || param2 == undefined){
        param2 = 1.0E-6;
    }
    
    var loc3 = this.mX - param1.mX;
    var loc4 = this.mY - param1.mY;
    return loc3 * loc3 + loc4 * loc4 <= param2 * param2;
};

Vec2.prototype.mirrorByminus1minus1 = function()
{
    return new Vec2(-this.mY,this.mX);
};

Vec2.toArray = function()
{
    return [this.mX,this.mY];
};

Vec2.toJSON = function(param1)
{
    return {
        "x":this.mX,
        "y":this.mY
    };
};

Vec2.toString = function()
{
    return "Vec2(" + this.mX + "," + this.mY + ")";
};

Vec2.prototype.getAngle = function()
{
    return Math.atan2(this.mY,this.mX);
};

Vec2.prototype.setAngle = function(param1)
{
    param1 = !!isNaN(param1)? 0 : param1;
    var loc2 = Math.sqrt(Math.pow(this.mX,2) + Math.pow(this.mY,2));
    this.mX = loc2 * Math.cos(param1);
    this.mY = loc2 * Math.sin(param1);
};

Vec2.prototype.getLength = function()
{
    return Math.sqrt(Math.pow(this.mX,2) + Math.pow(this.mY,2));
};

Vec2.prototype.setLength = function(param1)
{
    var loc3;
    param1 = !!isNaN(param1)? 0 : param1;
    var loc2 = Math.sqrt(Math.pow(this.mX,2) + Math.pow(this.mY,2));
    if(loc2 < Vec2.THRESHOLD)
    {
        this.mX = param1;
        this.mY = 0;
    }
    else
    {
        loc3 = param1 / loc2;
        this.mX = this.mX * loc3;
        this.mY = this.mY * loc3;
    }
};
