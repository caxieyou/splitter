/**
 * Created by ÇÃ´úÂëµÄºº×Ó on 2017/8/25.
 */
Renderer = function () {

    this.init = function (canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    this._drawDash = function(p0, p1) {
        var dashLen = 5,
            xpos = p1.x - p0.x,
            ypos = p1.y - p0.y,
            numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen);
        for (var i = 0; i < numDashes; i++) {
            if (i % 2 === 0) {
                this.ctx.moveTo(p0.x + (xpos / numDashes) * i, p0.y + (ypos / numDashes) * i);
            } else {
                this.ctx.lineTo(p0.x + (xpos / numDashes) * i, p0.y + (ypos / numDashes) * i);
            }
        }
    }
    
    this.drawLine = function (edge, isDash, color, isFocus) {
        var p0 = {x: edge.mStart.mX, y: edge.mStart.mY};
        var p1 = {x: edge.mEnd.mX, y: edge.mEnd.mY};
        
        this.ctx.beginPath();
        if (isDash) {
            this._drawDash(p0, p1);
        } else {
            this.ctx.moveTo(p0.x, p0.y);
            this.ctx.lineTo(p1.x, p1.y);
        }
        
        if (isFocus) {
            this.ctx.strokeStyle = "blue";
        } else if(color){
            this.ctx.strokeStyle = color;
        } else {
            this.ctx.strokeStyle = "black";
        }
        //this.ctx.strokeStyle = isFocus != undefined ? "blue" : color;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    this.drawRect = function (edge/*, isDash*/) {
        var leftUp = { x : edge.mStart.mX,
                       y : edge.mStart.mY};
        
        var rightBottom = {x : edge.mEnd.mX,
                           y : edge.mEnd.mY
                           };
        
        this.ctx.beginPath();
        //if (isDash) {
            this._drawDash(leftUp, {x: rightBottom.x, y: leftUp.y});
            this._drawDash({x: rightBottom.x, y: leftUp.y}, rightBottom);
            this._drawDash(rightBottom, {x: leftUp.x, y: rightBottom.y});
            this._drawDash({x: leftUp.x, y: rightBottom.y}, leftUp);
        //} else {
        //    this.ctx.moveTo(leftUp.x, leftUp.y);
        //    this.ctx.lineTo(rightBottom.x, leftUp.y);
        //    this.ctx.lineTo(rightBottom.x, rightBottom.y);
        //    this.ctx.lineTo(leftUp.x, rightBottom.y);
        //    this.ctx.lineTo(leftUp.x, leftUp.y);
        //}
        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
        this.ctx.closePath();
    }

    this.drawCircle = function (edge) {
        var center = {x : edge.mStart.mX,
                      y : edge.mStart.mY};
                      
        var radius = edge.getLength()
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'black';
        this.ctx.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    this.drawArc = function (edge, isFocus) {
        var center = {x : edge.mCenter.mX,
                      y : edge.mCenter.mY}
        var radius = edge.mRadius;
        var start  = edge.mStartAngle;
        var end    = edge.mStartAngle + edge.mArcAngle;
        
        var clock = Math.sign(edge.mArcAngle);
        
        var start_normal = start;
        var end_normal = end;
        while (start_normal > Math.PI * 2) {
            start_normal -= Math.PI * 2;
        }
        
        while (start_normal < 0) {
            start_normal += Math.PI * 2;
        }
        
        while (end_normal > Math.PI * 2) {
            end_normal -= Math.PI * 2;
        }
        
        while (end_normal < 0) {
            end_normal += Math.PI * 2;
        }
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = !!isFocus ? "blue" : 'black';
        this.ctx.arc(center.x, center.y, radius, start, end, clock < 0 ? true : false);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    this.drawDashLine = function (p0, p1) {
        this.ctx.beginPath();
        var dashLen = 5,
            xpos = p1.x - p0.x,
            ypos = p1.y - p0.y,
            numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen);
        for (var i = 0; i < numDashes; i++) {
            if (i % 2 === 0) {
                this.ctx.moveTo(p0.x + (xpos / numDashes) * i, p0.y + (ypos / numDashes) * i);
            } else {
                this.ctx.lineTo(p0.x + (xpos / numDashes) * i, p0.y + (ypos / numDashes) * i);
            }
        }
        this.ctx.strokeStyle = 'black';
        this.ctx.closePath();
    }
    
    this.clear = function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    this.drawArea = function(output) {

        var ctx = canvas._renderer.ctx;
    //console.log(output);

    ctx.beginPath();
    var prevPoint;
    var counterclockwise;
    for (var i = 0, length = output.mOutline.edges.length; i < length; i++) {
        var edge = output.mOutline.edges[i],
            next = output.mOutline.edges[(i + 1) % length],
            nextSP = next.mStart,
            nextEP = next.mEnd,
            p = undefined;

        if (next.constructor == MyCurve) {
            nextSP = this.rotatePoint({
                x: next.mCenter.mX + next.mRadius,
                y: next.mCenter.mY
            }, next.mCenter, next.mStartAngle);
            nextEP = this.rotatePoint({
                x: next.mCenter.mX + next.mRadius,
                y: next.mCenter.mY
            }, next.mCenter, next.mStartAngle + next.mArcAngle);
        }

        if (edge.constructor == MyEdge) {
//			if(!isClose(edge.mStart,nextSP) && !isClose(edge.mEnd,nextSP) && !isClose(edge.mStart,nextEP) && !isClose(edge.mEnd,nextEP))
//              continue;

            if (prevPoint) {
                if (this.isClose(edge.mStart, prevPoint))
                    p = edge.mEnd;
                else
                    p = edge.mStart;
            } else {
                if (this.isClose(edge.mStart, nextSP) || this.isClose(edge.mStart, nextEP))
                    p = edge.mStart;
                else if (this.isClose(edge.mEnd, nextEP) || this.isClose(edge.mEnd, nextSP))
                    p = edge.mEnd;
            }

            if (p) {
                prevPoint = p;
                if (i == 0)
                    ctx.moveTo(p.mX, p.mY);
                else
                    ctx.lineTo(p.mX, p.mY);
            }
        } 
        else if (edge.constructor == MyCurve) {
            var sp = this.rotatePoint({
                    x: edge.mCenter.mX + edge.mRadius,
                    y: edge.mCenter.mY
                }, edge.mCenter, edge.mStartAngle),
                ep = this.rotatePoint({
                    x: edge.mCenter.mX + edge.mRadius,
                    y: edge.mCenter.mY
                }, edge.mCenter, edge.mStartAngle + edge.mArcAngle);
                
            if(!this.isClose(sp,nextSP) && !this.isClose(ep,nextSP) && !this.isClose(sp,nextEP) && !this.isClose(ep,nextEP))
                continue;
            var endAngle = edge.mArcAngle + edge.mStartAngle;
            if (prevPoint) {
                if (this.isClose(prevPoint, sp)) {
                    ctx.arc(edge.mCenter.mX, edge.mCenter.mY, edge.mRadius, edge.mStartAngle, endAngle, endAngle > edge.mStartAngle ? false : true);//false,endAngle < 0 ? true:false
                    prevPoint = ep;
                }
                else {
                    ctx.arc(edge.mCenter.mX, edge.mCenter.mY, edge.mRadius, endAngle, edge.mStartAngle, endAngle > edge.mStartAngle ? true : false);//true,endAngle < 0 ? false:true
                    prevPoint = sp;
                }
            } else {
                if (!this.isClose(ep, nextSP) && !this.isClose(ep, nextEP)) {
                    ctx.arc(edge.mCenter.mX, edge.mCenter.mY, edge.mRadius, endAngle, edge.mStartAngle, endAngle > edge.mStartAngle ? true : false);//true,endAngle < 0 ? false:true
                    prevPoint = sp;
                } else {
                    ctx.arc(edge.mCenter.mX, edge.mCenter.mY, edge.mRadius, edge.mStartAngle, endAngle, endAngle > edge.mStartAngle ? false : true);//false,endAngle < 0 ? true:false
                    prevPoint = ep;
                }
            }
        }
    }
    ctx.fillStyle = 'rgba(2,100,30,0.5)';
    ctx.fill();
    ctx.closePath();

    if (output.mHoles.length > 0) {

        ctx.globalCompositeOperation = "destination-out";
        for (var i = 0; i < output.mHoles.length; i++) {
            var prevPos=undefined, next, nextSP, nextEP;
            var hole = output.mHoles[i];
            ctx.beginPath();
            for (var j = 0; j < hole.edges.length; j++) {
                var hedge = hole.edges[j];
                next = hole.edges[(j + 1) % hole.edges.length];
                nextSP = next.mStart;
                nextEP = next.mEnd;

                if (next.constructor == MyCurve) {
                    nextSP = this.rotatePoint({
                        x: next.mCenter.mX + next.mRadius,
                        y: next.mCenter.mY
                    }, next.mCenter, next.mStartAngle);
                    nextEP = this.rotatePoint({
                        x: next.mCenter.mX + next.mRadius,
                        y: next.mCenter.mY
                    }, next.mCenter, next.mStartAngle + next.mArcAngle);
                }

                if (hedge.constructor == MyEdge) {
                    if (j == 0) ctx.moveTo(hedge.mStart.mX, hedge.mStart.mY);
                    else ctx.lineTo(hedge.mStart.mX, hedge.mStart.mY);
                    ctx.lineTo(hedge.mEnd.mX, hedge.mEnd.mY);
                    prevPos = hedge.mEnd;
                    //if (j == hole.edges.length - 1) ctx.lineTo(hedge.mEnd.mX, hedge.mEnd.mY);
                } else if (hedge.constructor == MyCurve) {
                    var sp = this.rotatePoint({
                            x: hedge.mCenter.mX + hedge.mRadius,
                            y: hedge.mCenter.mY
                        }, hedge.mCenter, hedge.mStartAngle),
                        ep = this.rotatePoint({
                            x: hedge.mCenter.mX + hedge.mRadius,
                            y: hedge.mCenter.mY
                        }, hedge.mCenter, hedge.mStartAngle + hedge.mArcAngle);
                    if(!this.isClose(sp,nextSP) && !this.isClose(ep,nextSP) && !this.isClose(sp,nextEP) && !this.isClose(ep,nextEP))
                    	continue;
                    var endAngle = hedge.mArcAngle + hedge.mStartAngle;

                    if ((prevPos != undefined && !this.isClose(prevPos, sp)) ){//|| (prevPos == undefined && !isClose(ep, nextSP) && !isClose(ep, nextEP))
                        ctx.arc(hedge.mCenter.mX, hedge.mCenter.mY, hedge.mRadius, endAngle, hedge.mStartAngle, endAngle > hedge.mStartAngle ? true : false);
                        prevPos = sp;
                    }
                    else {
                        ctx.arc(hedge.mCenter.mX, hedge.mCenter.mY, hedge.mRadius, hedge.mStartAngle, endAngle, false);//endAngle > edge.mStartAngle ? true:false
                        prevPos = ep;
                    }
                }
            }

            ctx.fillStyle = '#FFF';
            ctx.fill();
            ctx.closePath();

        }
        ctx.globalCompositeOperation = "source-over";
    }

    }

    this.rotatePoint = function(a, o, angle) {
        return {
            mX: (a.x - o.mX) * Math.cos(angle) - (a.y - o.mY) * Math.sin(angle) + o.mX,
            mY: (a.x - o.mX) * Math.sin(angle) + (a.y - o.mY) * Math.cos(angle) + o.mY
        }
    }
    
    this.isClose = function(a, b) {
        return Math.abs(a.mX - b.mX) <= 1 && Math.abs(a.mY - b.mY) <= 1;
    }
    
    this.isAllCurves = function(edges) {
        for (var j = 0; j < edges.length; j++) {
            if (edges[j].constructor == MyEdge)return false;
        }
        return true;
    }
    
    this.drawCorner = function(point, radius) {
        if (radius == undefined)radius = 10;
        var ctx = canvas._renderer.ctx;
        ctx.beginPath();
        ctx.arc(point.mX, point.mY, 604, 1.3714590218125728, 1.7701336317772205, true);
        ctx.closePath();
        ctx.fillStyle = "#000";
        ctx.fill();
    }
}