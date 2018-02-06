function Angle() {
    
};

Angle.Epsolon = 1.0E-5;
Angle.CONST_1 = 1;
Angle.PI      = 3.141592653589793;
Angle.HALF_PI = 1.5707963267948966;
Angle.CONST_2_PI = 6.283185307179586;
Angle.PI_QUATER  = 0.7853981633974483;
Angle.CONST_180_DEVIDE_PI = 57.29577951308232;
Angle.CONST_PI_DEVIDE_180 = 0.017453292519943295;

Angle.isHorizontal = function(param1, param2) {
    if (param2 == null || param2 ==undefined) {
        param2 = 1;
    }
    return Angle.toDegrees(Math.abs(param1)) < param2 || Angle.toDegrees(Math.abs(Math.abs(param1) - Math.PI)) < param2;
};

Angle.isVertical = function(param1, param2) {
    if (param2 == null || param2 ==undefined) {
        param2 = 1;
    }
    return Angle.toDegrees(Math.abs(Math.abs(param1) - Math.PI / 2)) < param2;
};

Angle.isEqual = function(param1, param2, param3) {
    if (param3 == null || param3 == undefined) {
        param3 = 1.0E-5;
    }
    
    return Math.abs(Angle.normalize(param1) - Angle.normalize(param2)) < param3;
};

Angle.add = function(param1, param2)
{
    return Angle.normalize(param1 + param2);
};

Angle.sub = function(param1, param2)
{
    return Angle.normalize(param1 - param2);
};

Angle.normalize = function(param1)
{
    while(param1 > Angle.CONST_2_PI) {
        param1 -= Angle.CONST_2_PI;
    }
    
    while(param1 < -Angle.CONST_2_PI) {
        param1 += Angle.CONST_2_PI;
    }
    if (Math.abs(param1) < 0.0001) {
        param1 = 0;
    }
    return param1 >= 0 ? param1 : param1 + Angle.CONST_2_PI;
}

Angle.reverse = function(param1)
{
    return Angle.normalize(param1 + Math.PI);
}

Angle.toRadians = function(param1)
{
    return param1 * Angle.CONST_PI_DEVIDE_180;
}

Angle.toDegrees = function(param1)
{
    return param1 * Angle.CONST_180_DEVIDE_PI;
}
