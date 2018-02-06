function Interval(param1, param2) {
    this.mMin = param1;
    this.mMax = param2;
}

Interval.prototype.getLength = function() {
    return Math.abs(this.mMax - this.mMin);
}

Interval.prototype.getCenter = function() {
    return (this.mMax + this.mMin) / 2;
}