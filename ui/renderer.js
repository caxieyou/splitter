/**
 * Created by ????????? on 2017/8/25.
 * Integrated by Li
 */
 
Vector3 = function(x, y, z) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;

};

Vector3.prototype = {
	subVectors: function(a, b) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;

		return this;

	},
	applyQuaternion: function(q) {

		var x = this.x;
		var y = this.y;
		var z = this.z;

		var qx = q.x;
		var qy = q.y;
		var qz = q.z;
		var qw = q.w;

		// calculate quat * vector

		var ix = qw * x + qy * z - qz * y;
		var iy = qw * y + qz * x - qx * z;
		var iz = qw * z + qx * y - qy * x;
		var iw = -qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
		this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
		this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

		return this;

	},
	normalize: function() {
		var scalar = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		if(scalar !== 0) {

			var invScalar = 1 / scalar;

			this.x *= invScalar;
			this.y *= invScalar;
			this.z *= invScalar;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;

		}

		return this;
	},
	applyQuaternion: function(q) {

		var x = this.x;
		var y = this.y;
		var z = this.z;

		var qx = q.x;
		var qy = q.y;
		var qz = q.z;
		var qw = q.w;

		// calculate quat * vector

		var ix = qw * x + qy * z - qz * y;
		var iy = qw * y + qz * x - qx * z;
		var iz = qw * z + qx * y - qy * x;
		var iw = -qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
		this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
		this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

		return this;

	},
	multiplyScalar: function(scalar) {

		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;

		return this;

	},
	add: function(v, w) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;

	}
};

Quaternion = function(x, y, z, w) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = (w !== undefined) ? w : 1;

	this.setFromAxisAngle = function(axis, angle) {
		var halfAngle = angle / 2,
			s = Math.sin(halfAngle);

		this.x = axis.x * s;
		this.y = axis.y * s;
		this.z = axis.z * s;
		this.w = Math.cos(halfAngle);
		return this;
	}

};

var ScalePoint = function(p) {
    p.x = p.x * Globals.Scale + Globals.Offset.mX;
    p.y = p.y * Globals.Scale + Globals.Offset.mY;
}

var ScaleNumber = function(n) {
    return n * Globals.Scale;
}

var ScaleOutput = function(output) {
    var res = {
        mOutline : {},
        mHoles : []
    };
    
    res.mOutline.edges = [];
    
    for (var i = 0, length = output.mOutline.edges.length; i < length; i++) {
        var edge = output.mOutline.edges[i];
        res.mOutline.edges.push(edge.scale(Globals.Scale, Globals.Offset.mX , Globals.Offset.mY));
    }
    
    for (var i = 0; i < output.mHoles.length; i++) {
        var hole = output.mHoles[i];
        var newHole = {
            edges : []
        };
        
        for (var j = 0; j < hole.edges.length; j++) {
            newHole.edges.push(hole.edges[j].scale(Globals.Scale, Globals.Offset.mX , Globals.Offset.mY));
        }
        res.mHoles.push(newHole);
    }
    return res;
}
Renderer = function () {
    this.textBlank = [];
    this.init = function (canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
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
        this.ctx.stroke();
    }
    
    this.drawLine = function (edge, isDash, color, isFocus) {
        var p0 = {x: edge.mStart.mX, y: edge.mStart.mY};
        var p1 = {x: edge.mEnd.mX, y: edge.mEnd.mY};
        ScalePoint(p0);
        ScalePoint(p1);
        this.ctx.beginPath();
        if (isDash) {
            this._drawDash(p0, p1);
        } else {
            this.ctx.moveTo(p0.x, p0.y);
            this.ctx.lineTo(p1.x, p1.y);
        }
        
        if (isFocus) {
            this.ctx.strokeStyle = Style.FocusLine.color;
        } else if(color){
            this.ctx.strokeStyle = color;
        } else {
            this.ctx.strokeStyle = Style.DefaultLine.color;
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
        ScalePoint(leftUp);
        ScalePoint(rightBottom);
        this.ctx.beginPath();
        this.ctx.moveTo(leftUp.x, leftUp.y);
        this.ctx.lineTo(rightBottom.x, leftUp.y);
        this.ctx.lineTo(rightBottom.x, rightBottom.y);
        this.ctx.lineTo(leftUp.x, rightBottom.y);
        this.ctx.lineTo(leftUp.x, leftUp.y);
        this.ctx.strokeStyle = Style.DefaultLine.color;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    this.drawCircle = function (edge) {
        var center = {x : edge.mStart.mX,
                      y : edge.mStart.mY};
                      
        var radius = edge.getLength();
        ScalePoint(center);
        
        radius = ScaleNumber(radius);
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = Style.DefaultLine.color;
        this.ctx.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    this.drawArc = function (edge, isFocus) {
        var center = {x : edge.mCenter.mX,
                      y : edge.mCenter.mY}
        var radius = edge.mRadius;
        
        ScalePoint(center);
        radius = ScaleNumber(radius);
        
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
        this.ctx.strokeStyle = !!isFocus ? Style.FocusLine.color : Style.DefaultLine.color;
        this.ctx.arc(center.x, center.y, radius, start, end, clock < 0 ? true : false);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    
    this.clear = function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i = 0; i < this.textBlank.length; i++) {
            $(this.textBlank[i]).remove();
        }
        this.textBlank =[];
    }
    
    this.drawArea = function(outputOrigin, shadow) {
        var ctx = this.ctx;
        ctx.beginPath();
        var output = ScaleOutput(outputOrigin);
        var prevPoint;
        var counterclockwise;
        for (var i = 0, length = output.mOutline.edges.length; i < length; i++) {
            var edge = output.mOutline.edges[i],
                next = output.mOutline.edges[(i + 1) % length],
                prev = output.mOutline.edges[i - 1 < 0 ? length - 1 : i- 1 ],
                nextSP = next.mStart,
                nextEP = next.mEnd,
                prevSP = prev.mStart,
                prevEP = prev.mEnd,                
                p = undefined;

            if (next.constructor == Curve) {
                nextSP = this._rotatePoint({
                    x: next.mCenter.mX + next.mRadius,
                    y: next.mCenter.mY
                }, next.mCenter, next.mStartAngle);
                nextEP = this._rotatePoint({
                    x: next.mCenter.mX + next.mRadius,
                    y: next.mCenter.mY
                }, next.mCenter, next.mStartAngle + next.mArcAngle);
            }

            if (prev.constructor == Curve) {
                prevSP = this._rotatePoint({
                    x: prev.mCenter.mX + prev.mRadius,
                    y: prev.mCenter.mY
                }, prev.mCenter, prev.mStartAngle);
                prevEP = this._rotatePoint({
                    x: prev.mCenter.mX + prev.mRadius,
                    y: prev.mCenter.mY
                }, prev.mCenter, prev.mStartAngle + prev.mArcAngle);
            }
            
            //过滤不相连的线段
            if (edge.constructor == Edge) {
//				if((!this._isClose(edge.mStart,nextSP) && !this._isClose(edge.mEnd,nextSP) && !this._isClose(edge.mStart,nextEP) && !this._isClose(edge.mEnd,nextEP)) && (!this._isClose(edge.mStart,prevSP) && !this._isClose(edge.mEnd,prevSP) && !this._isClose(edge.mStart,prevEP) && !this._isClose(edge.mEnd,prevEP)))
//           		continue;              	
//				if((!this._isClose(edge.mStart,nextSP) && !this._isClose(edge.mStart,nextEP) && !this._isClose(edge.mStart,prevSP) && !this._isClose(edge.mStart,prevEP)) || (!this._isClose(edge.mEnd,nextSP) && !this._isClose(edge.mEnd,nextEP) && !this._isClose(edge.mEnd,prevSP) && !this._isClose(edge.mEnd,prevEP)))
				if(this._checkCorrelated(edge.mStart, edge.mEnd, nextSP, nextEP, prevSP, prevEP))
             		continue;
                
                if (prevPoint) {
                    if (this._isClose(edge.mStart, prevPoint))
                        p = edge.mEnd;
                    else
                        p = edge.mStart;
                } else {
                    if (this._isClose(edge.mStart, nextSP) || this._isClose(edge.mStart, nextEP))
                        p = edge.mStart;
                    else if (this._isClose(edge.mEnd, nextEP) || this._isClose(edge.mEnd, nextSP))
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
            else if (edge.constructor == Curve) {
                
                var sp = this._rotatePoint({
                        x: edge.mCenter.mX + edge.mRadius,
                        y: edge.mCenter.mY
                    }, edge.mCenter, edge.mStartAngle),
                    ep = this._rotatePoint({
                        x: edge.mCenter.mX + edge.mRadius,
                        y: edge.mCenter.mY
                    }, edge.mCenter, edge.mStartAngle + edge.mArcAngle);
                    
				//过滤不相连的线段
//				if((!this._isClose(sp,nextSP) && !this._isClose(ep,nextSP) && !this._isClose(sp,nextEP) && !this._isClose(ep,nextEP)) && (!this._isClose(sp,prevSP) && !this._isClose(ep,prevSP) && !this._isClose(sp,prevEP) && !this._isClose(ep,prevEP)))
//           		continue;   
//           		if((!this._isClose(sp,nextSP) && !this._isClose(sp,nextEP) && !this._isClose(sp,prevSP) && !this._isClose(sp,prevEP))|| (!this._isClose(ep,nextSP) && !this._isClose(ep,nextEP) && !this._isClose(ep,prevSP) && !this._isClose(ep,prevEP)))            
//           		continue;
             		
				if(this._checkCorrelated(sp, ep, nextSP, nextEP, prevSP, prevEP))
             		continue;             	
             		
                var endAngle = edge.mArcAngle + edge.mStartAngle;
                if (prevPoint) {
                    if (this._isClose(prevPoint, sp)) {
                        ctx.arc(edge.mCenter.mX, edge.mCenter.mY, edge.mRadius, edge.mStartAngle, endAngle, endAngle > edge.mStartAngle ? false : true);//false,endAngle < 0 ? true:false
                        prevPoint = ep;
                    }
                    else {
                        ctx.arc(edge.mCenter.mX, edge.mCenter.mY, edge.mRadius, endAngle, edge.mStartAngle, endAngle > edge.mStartAngle ? true : false);//true,endAngle < 0 ? false:true
                        prevPoint = sp;
                    }
                } else {
                    if (!this._isClose(ep, nextSP) && !this._isClose(ep, nextEP)) {
                        ctx.arc(edge.mCenter.mX, edge.mCenter.mY, edge.mRadius, endAngle, edge.mStartAngle, endAngle > edge.mStartAngle ? true : false);//true,endAngle < 0 ? false:true
                        prevPoint = sp;
                    } else {
                        ctx.arc(edge.mCenter.mX, edge.mCenter.mY, edge.mRadius, edge.mStartAngle, endAngle, endAngle > edge.mStartAngle ? false : true);//false,endAngle < 0 ? true:false
                        prevPoint = ep;
                    }
                }
            }
        }
        ctx.fillStyle = Style.Fill.color;
        ctx.fill();
        ctx.closePath();

        if (output.mHoles.length > 0) {

            ctx.globalCompositeOperation = "destination-out";
            for (var i = 0; i < output.mHoles.length; i++) {
                var prevPos = undefined, next, nextSP, nextEP;
                var hole = output.mHoles[i];
                ctx.beginPath();
                for (var j = 0; j < hole.edges.length; j++) {
                    var hedge = hole.edges[j],
	                    next = hole.edges[(j + 1) % hole.edges.length],
	                    prev = hole.edges[j - 1 < 0 ? hole.edges.length - 1 : j - 1 ],
	                    nextSP = next.mStart,
	                    nextEP = next.mEnd,
	                    prevSP = prev.mStart,
	                    prevEP = prev.mEnd;

                    if (next.constructor == Curve) {
                        nextSP = this._rotatePoint({
                            x: next.mCenter.mX + next.mRadius,
                            y: next.mCenter.mY
                        }, next.mCenter, next.mStartAngle);
                        nextEP = this._rotatePoint({
                            x: next.mCenter.mX + next.mRadius,
                            y: next.mCenter.mY
                        }, next.mCenter, next.mStartAngle + next.mArcAngle);
                    }
                    
                    if (prev.constructor == Curve) {
                        prevSP = this._rotatePoint({
                            x: prev.mCenter.mX + prev.mRadius,
                            y: prev.mCenter.mY
                        }, prev.mCenter, prev.mStartAngle);
                        prevEP = this._rotatePoint({
                            x: prev.mCenter.mX + prev.mRadius,
                            y: prev.mCenter.mY
                        }, prev.mCenter, prev.mStartAngle + prev.mArcAngle);
                    }

                    if (hedge.constructor == Edge) {
                    	//过滤不相连的线段
//						if((!this._isClose(hedge.mStart,nextSP) && !this._isClose(hedge.mEnd,nextSP) && !this._isClose(hedge.mStart,nextEP) && !this._isClose(hedge.mEnd,nextEP)) && (!this._isClose(hedge.mStart,prevSP) && !this._isClose(hedge.mEnd,prevSP) && !this._isClose(hedge.mStart,prevEP) && !this._isClose(hedge.mEnd,prevEP)))
//                   		continue;

//						if((!this._isClose(hedge.mStart,nextSP) && !this._isClose(hedge.mStart,nextEP) && !this._isClose(hedge.mStart,prevSP) && !this._isClose(hedge.mStart,prevEP)) || (!this._isClose(hedge.mEnd,nextSP) && !this._isClose(hedge.mEnd,nextEP) && !this._isClose(hedge.mEnd,prevSP) && !this._isClose(hedge.mEnd,prevEP)))
//                   		continue;
					if(this._checkCorrelated(hedge.mStart, hedge.mEnd, nextSP, nextEP, prevSP, prevEP))
	             		continue;

		                if (prevPos) {
		                    if (this._isClose(hedge.mStart, prevPos))
		                        p = hedge.mEnd;
		                    else
		                        p = hedge.mStart;
		                } else {
		                    if (this._isClose(hedge.mStart, nextSP) || this._isClose(hedge.mStart, nextEP))
		                        p = hedge.mStart;
		                    else if (this._isClose(hedge.mEnd, nextEP) || this._isClose(hedge.mEnd, nextSP))
		                        p = hedge.mEnd;
		                }
		
		                if (p) {
		                    prevPos = p;
		                    if (j == 0)
		                        ctx.moveTo(p.mX, p.mY);
		                    else
		                        ctx.lineTo(p.mX, p.mY);
		                }                        
                        
                    } else if (hedge.constructor == Curve) {
                        var sp = this._rotatePoint({
                                x: hedge.mCenter.mX + hedge.mRadius,
                                y: hedge.mCenter.mY
                            }, hedge.mCenter, hedge.mStartAngle),
                            ep = this._rotatePoint({
                                x: hedge.mCenter.mX + hedge.mRadius,
                                y: hedge.mCenter.mY
                            }, hedge.mCenter, hedge.mStartAngle + hedge.mArcAngle);
                            
						//过滤不相连的线段
//						if((!this._isClose(sp,nextSP) && !this._isClose(ep,nextSP) && !this._isClose(sp,nextEP) && !this._isClose(ep,nextEP)) && (!this._isClose(sp,prevSP) && !this._isClose(ep,prevSP) && !this._isClose(sp,prevEP) && !this._isClose(ep,prevEP)))
//                   		continue;             
//                   		if((!this._isClose(sp,nextSP) && !this._isClose(sp,nextEP) && !this._isClose(sp,prevSP) && !this._isClose(sp,prevEP))|| (!this._isClose(ep,nextSP) && !this._isClose(ep,nextEP) && !this._isClose(ep,prevSP) && !this._isClose(ep,prevEP)))            
//                   		continue;
	 					if(this._checkCorrelated(sp, ep, nextSP, nextEP, prevSP, prevEP))
		             		continue;
	             		
                        var endAngle = hedge.mArcAngle + hedge.mStartAngle;

                        if ((prevPos != undefined && !this._isClose(prevPos, sp)) || (!this._isClose(ep, nextEP) &&  !this._isClose(ep, nextSP) )){
                            ctx.arc(hedge.mCenter.mX, hedge.mCenter.mY, hedge.mRadius, endAngle, hedge.mStartAngle, endAngle > hedge.mStartAngle ? true : false);
                            prevPos = sp;
                        }	
                        else {
                            ctx.arc(hedge.mCenter.mX, hedge.mCenter.mY, hedge.mRadius, hedge.mStartAngle, endAngle, endAngle > hedge.mStartAngle ? false:true);
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
    
    this.drawAreaDots = function(output) {
        for (var i = 0; i < output.length; i++) {
            var corners = output[i].toCorners();

            if (!corners[0].isBoundryCorner()) {
                this.drawCorner(corners[0].mPosition, Style.PickeDot.radius, Style.PickeDot.color);
            }

            if (!corners[1].isBoundryCorner()) {
                this.drawCorner(corners[1].mPosition, Style.PickeDot.radius, Style.PickeDot.color);
            }
        }
    }
    
    this._checkCorrelated = function(sp, ep, nextSP, nextEP, prevSP, prevEP){
    	if((!this._isClose(sp,nextSP) && !this._isClose(sp,nextEP) && !this._isClose(sp,prevSP) && !this._isClose(sp,prevEP))|| (!this._isClose(ep,nextSP) && !this._isClose(ep,nextEP) && !this._isClose(ep,prevSP) && !this._isClose(ep,prevEP)))
    	return true;
    }

    
	/**
	 * 绘制圆点
	 * @param {Object} point 坐标
	 * @param {Object} radius 半径
	 * @param {Object} color 填充颜色
	 * @param {Object} isHollow 是否为空心，默认为实心
	 */
    this.drawCorner = function(point, radius, color, isHollow) {
        color = color || "#000";
        if(radius == undefined) radius = 3;

        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        
        var p;
        if (point instanceof Vec2) {
            p = {x : point.mX, y : point.mY};
        } else {
            p = point;
        }
        
        ScalePoint(p);
        
        this.ctx.arc(p.x, p.y, radius, 0, Math.PI * 2, true);

        if(!isHollow) {
            this.ctx.closePath();
            this.ctx.fillStyle = color;
            this.ctx.fill();
        } else
            this.ctx.stroke();
    }
    
    this.drawIntersectCorner = function(point, radius) {
        radius = radius || 6;
        this.drawCorner(point, radius, Style.IntersectCorner.outColor, true);
        this.drawCorner(point, radius - 1, Style.IntersectCorner.innerColor);
    }
    
    this._getIntersectionForBorder = function(sp, ep, borderPoints) {
		for(var i = 0, length = borderPoints.length; i < length; i++) {
			var next = borderPoints[(i + 1) % length];
			var p = this._segmentsIntr(borderPoints[i], next, sp, ep);
			if(p && this._equals(sp, ep, sp, p)) return p;
		}
	}
	
    this._equals = function(a, b, c, d) {
		var v1 = this._normalize(a, b),
			v2 = this._normalize(c, d);
		return(Math.abs(v1.x - v2.x) < 0.00001 && Math.abs(v1.y - v2.y) < 0.00001);
	}

	this._getPointsDistance = function(p0, p1) {
		var dx = p0.x - p1.x,
			dy = p0.y - p1.y;
		return Math.sqrt(dx * dx + dy * dy);
	}
	
	this._rotatePoint = function(a, o, angle) {
		return {
			mX: (a.x - o.mX) * Math.cos(angle) - (a.y - o.mY) * Math.sin(angle) + o.mX,
			mY: (a.x - o.mX) * Math.sin(angle) + (a.y - o.mY) * Math.cos(angle) + o.mY
		}
	}
	
	this._isClose = function(a, b) {
		return Math.abs(a.mX - b.mX) <= 1 && Math.abs(a.mY - b.mY) <= 1;
	}
	
	this._rotateVector = function(sp, vec, radian) {
		var q = new Quaternion();
		q.setFromAxisAngle(new Vector3(0, 0, 1), radian);
		var midVec = new Vector3(vec.x, vec.y, 0);
		midVec.applyQuaternion(q);
		midVec.normalize();
		return midVec;
	}
	
	this._segmentsIntr = function(a, b, c, d) {

		var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
	
		var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);
	
		// 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理); 
		//		if(area_abc * area_abd >= 0) {
		//			return false;
		//		}
	
		var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
		var area_cdb = area_cda + area_abc - area_abd;
		if(area_cda * area_cdb >= 0) {
			return false;
		}
	
		var t = area_cda / (area_abd - area_abc);
		var dx = t * (b.x - a.x),
			dy = t * (b.y - a.y);
		return {
			x: a.x + dx,
			y: a.y + dy
		};
	
	}

	this._normalize = function(a, b) {
		var vec = {
			x: a.x - b.x,
			y: a.y - b.y
		};
		var scalar = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
		if(scalar !== 0) {
	
			var invScalar = 1 / scalar;
			vec.x *= invScalar;
			vec.y *= invScalar;
	
		} else {
	
			vec.x = 0;
			vec.y = 0;
		}
	
		return vec;
	};

	 this._isInPolygon = function(p, poly) {
		var px = p.x,
			py = p.y,
			flag = false;
	
		for(var i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
			var sx = poly[i].x,
				sy = poly[i].y,
				tx = poly[j].x,
				ty = poly[j].y
	
			// 点与多边形顶点重合
			if((sx === px && sy === py) || (tx === px && ty === py)) {
				return true
			}
	
			// 判断线段两端点是否在射线两侧
			if((sy < py && ty >= py) || (sy >= py && ty < py)) {
				// 线段上与射线 Y 坐标相同的点的 X 坐标
				var x = sx + (py - sy) * (tx - sx) / (ty - sy)
	
				// 点在多边形的边上
				if(x === px) {
					return true
				}
	
				// 射线穿过多边形的边界
				if(x > px) {
					flag = !flag
				}
			}
		}
	
		// 射线穿过多边形边界的次数为奇数时点在多边形内
		return flag;
	};
	 
	this._computeAngle = function(p1, p2) {
		var x = Math.abs(p1.x - p2.x);
		var y = Math.abs(p1.y - p2.y);
		var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		var cos = y / z;
		var radina = Math.acos(cos);
		var angle = Math.floor(180 / (Math.PI / radina));
	
		if(p2.x > p1.x && p2.y > p1.y) {
			angle = 180 - angle;
		}
	
		if(p2.x == p1.x && p2.y > p1.y) {
			angle = 180;
		}
	
		if(p2.x > p1.x && p2.y == p1.y) {
			angle = 90;
		}
	
		if(p2.x < p1.x && p2.y > p1.y) {
			angle = 180 + angle;
		}
	
		if(p2.x < p1.x && p2.y == p1.y) {
			angle = 270;
		}
	
		if(p2.x < p1.x && p2.y < p1.y) {
			angle = 360 - angle;
		}
	
		return angle - 90;
	}
	
	this._makeTextInput = function(pos, value, callbackFun, canvas, edge, edge2, distance, direction){
		var offset = $(this.canvas).position();
		var tt = document.createElement("input");
		tt.className = "editText";
		this.canvas.parentElement.appendChild(tt);
		tt.style.left = pos.x + offset.left  - 20 + "px";
		tt.style.top = pos.y + offset.top - 10 + "px";
		if(value)
			tt.value = value;
		if(callbackFun) {
			tt.addEventListener("keyup", function(e) {
				if(e.keyCode == 13 && !isNaN(tt.value) && tt.value > 0.9999999)
					callbackFun(parseInt(tt.value), canvas, edge, edge2, distance, direction);
                    Globals.INPUT_FOUCS = false;
			});
            tt.addEventListener("mousedown", function(e) {
				Globals.INPUT_FOUCS = true;
			});
		}
		this.textInputs.push(tt);
		return tt;
	}
    
    /*
    //
	// 绘制制定点的十字线并标记与区域的边界的距离
	// @param {Object} point
	// @param {Array} borderPoints 边界点集合
	//
    this.drawCrosshairs = function(point, borderPoints) {
        if(!this._isInPolygon(point, borderPoints))
            return;
        var hsp = this._getIntersectionForBorder(point, {
                x: point.x - 1000,
                y: point.y
            }, borderPoints),
            hep = this._getIntersectionForBorder(point, {
                x: point.x + 1000,
                y: point.y
            }, borderPoints),
            vsp = this._getIntersectionForBorder(point, {
                x: point.x,
                y: point.y - 1000
            }, borderPoints),
            vep = this._getIntersectionForBorder(point, {
                x: point.x,
                y: point.y + 1000
            }, borderPoints);

		this.ctx.beginPath();
        this.ctx.strokeStyle = '#717070'
        this.ctx.moveTo(hsp.x, hsp.y + 0.5);
        this.ctx.lineTo(hep.x, hep.y + 0.5);
        this.ctx.stroke();
        this.ctx.closePath();

		this.ctx.beginPath();
        this.ctx.moveTo(vsp.x + 0.5, vsp.y);
        this.ctx.lineTo(vep.x + 0.5, vep.y);
        this.ctx.stroke();
        this.ctx.closePath();
        

        var ll = point.x - hsp.x,
            rl = hep.x - point.x,
            tl = point.y - vsp.y,
            bl = vep.y - point.y;
        //this.ctx.fillStyle = '#FFF';
        this.ctx.strokeStyle = '#000'; 
        this.ctx.font = "bold 14px 微软雅黑"; 
        this.ctx.textBaseline = 'middle'; 
        this.ctx.textAlign = 'center';
        this.ctx.fillText(ll, hsp.x + ll / 2, point.y); 
        this.ctx.fillText(rl, point.x + rl / 2, point.y); 
        this.ctx.fillText(tl, point.x, vsp.y + tl / 2); 
        this.ctx.fillText(bl, point.x, point.y + bl / 2);

    }
    */
	/**
	 * 绘制距离标记线
	 * @param {Object} p0 起始点
	 * @param {Object} p1 结束点
	 * @param {Object} color 线条颜色，默认为灰色
	 * @param {Object} editable 是否可编辑，默认为不可编辑
	 * @param {Object} callbackFun 编辑回调函数
	 */
    this.drawDimensions = function(point0, point1,color, editable, callbackFun, canvas, edge, edge2, distance, direction) {
        color = color || '#a2a2a2';
        
        var p0 = {x: point0.x, y : point0.y};
        var p1 = {x: point1.x, y : point1.y};
        
        ScalePoint(p0);
        ScalePoint(p1);
        
        var lines = [
            [p0, p1]
        ];
        var length = 10;
        	sp = new Vector3(p0.x, p0.y, 0),
            ep = new Vector3(p1.x, p1.y, 0),
            vec0 = new Vector3().subVectors(sp, ep).normalize(),
            vec1 = new Vector3().subVectors(ep, sp).normalize();

        //端点垂直线
        lines.push([this._rotateVector(sp, vec0, Math.PI / 2).multiplyScalar(length).add(sp), this._rotateVector(sp, vec0, -Math.PI / 2).multiplyScalar(length).add(sp)]);
        lines.push([this._rotateVector(sp, vec1, Math.PI / 2).multiplyScalar(length).add(ep), this._rotateVector(sp, vec1, -Math.PI / 2).multiplyScalar(length).add(ep)]);
        
        length = 6;
        //端点斜线
        lines.push([this._rotateVector(sp, vec0, -Math.PI / 4).multiplyScalar(length).add(sp), this._rotateVector(sp, vec0, -Math.PI / 4).multiplyScalar(-length).add(sp)]);
        lines.push([this._rotateVector(sp, vec0, -Math.PI / 4).multiplyScalar(length).add(ep), this._rotateVector(sp, vec0, -Math.PI / 4).multiplyScalar(-length).add(ep)]);

        this.ctx.strokeStyle = color;
        this.ctx.beginPath();https://item.jd.com/3820581.html
        for(var i = 0; i < lines.length; i++) {
            lines[i][0].x = Math.round(lines[i][0].x);
            lines[i][0].y = Math.round(lines[i][0].y);
            lines[i][1].x = Math.round(lines[i][1].x);
            lines[i][1].y = Math.round(lines[i][1].y);
            if(lines[i][0].x % 2 == 0)
                lines[i][0].x += 0.5;
            if(lines[i][0].y % 2 == 0)
                lines[i][0].y += 0.5;
            if(lines[i][1].x % 2 == 0)
                lines[i][1].x += 0.5;
            if(lines[i][1].y % 2 == 0)
                lines[i][1].y += 0.5;
            this.ctx.moveTo(lines[i][0].x, lines[i][0].y);
            this.ctx.lineTo(lines[i][1].x, lines[i][1].y);

        }

        this.ctx.stroke();
        this.ctx.closePath();
        var center = {
                x: (p0.x + p1.x) / 2,
                y: (p0.y + p1.y) / 2
            },
            length = Math.round(this._getPointsDistance(point0, point1));
        if(!editable) {
            var ctx = this.ctx;

            ctx.save();
            ctx.translate(center.x, center.y);
             var angle = this._computeAngle(p0, p1);
            if(angle <= 245 && angle >= 105) angle += 180;
            ctx.rotate(angle * Math.PI / 180);
            //长度
            ctx.fillStyle = "#FFF";
            ctx.fillRect(-ctx.measureText(length).width / 2, -6, ctx.measureText(length).width, 12);
            this.drawText(length, 0, 0, 12);
            ctx.restore();
            ctx.translate(0, 0);

        } else {
            var tt = this._makeTextInput(center, length, callbackFun, canvas, edge, edge2, distance, direction);
            this.textBlank.push(tt);
            return tt;
        }
    }
    
    
    this._drawDashLine = function (p0, p1) {
    	ScalePoint(p0);
    	ScalePoint(p1);
        var dashLen = 5,
            xpos = p1.x - p0.x,
            ypos = p1.y - p0.y,
            numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen);
            
        this.ctx.beginPath();
        for (var i = 0; i < numDashes; i++) {
            if (i % 2 === 0) {
                this.ctx.moveTo(p0.x + (xpos / numDashes) * i, p0.y + (ypos / numDashes) * i);
            } else {
                this.ctx.lineTo(p0.x + (xpos / numDashes) * i, p0.y + (ypos / numDashes) * i);
            }
        }
        //this.ctx.strokeStyle = '#888';
        this.ctx.stroke();
        this.ctx.closePath();
    }
    
	/**
	 * 绘制带端点的线段
	 * @param {Object} edge 边
	 * @param {Object} callbackFun 编辑回调函数
	 */
    this.drawSegment = function(edge, isOffset, callbackFun, canvas, targetEdge, isDirection, nextInput) {
        if (isOffset) {
            var edge2 = new Edge(edge.mStart.clone(), edge.mEnd.clone());
            var angle = edge.getAngle();
            angle = angle + Math.PI / 2;
            var offset = 10 / Globals.Scale;
            var offvec = new Vec2(-offset * Math.cos(angle), -offset * Math.sin(angle));
            edge2.mStart.addBy(offvec);
            edge2.mEnd.addBy(offvec);
            edge = edge2;
        }

        var p0 = {x: edge.mStart.mX, y: edge.mStart.mY};
        var p1 = {x: edge.mEnd.mX, y: edge.mEnd.mY};

        var color = '#a2a2a2';
        

        ScalePoint(p0);
        ScalePoint(p1);
        
        var lines = [
            [p0, p1]
        ];
        var length = 10;
        	sp = new Vector3(p0.x, p0.y, 0),
            ep = new Vector3(p1.x, p1.y, 0),
            vec0 = new Vector3().subVectors(sp, ep).normalize(),
            vec1 = new Vector3().subVectors(ep, sp).normalize();

        //端点垂直线
        lines.push([this._rotateVector(sp, vec0, Math.PI / 2).multiplyScalar(length).add(sp), this._rotateVector(sp, vec0, -Math.PI / 2).multiplyScalar(length).add(sp)]);
        lines.push([this._rotateVector(sp, vec1, Math.PI / 2).multiplyScalar(length).add(ep), this._rotateVector(sp, vec1, -Math.PI / 2).multiplyScalar(length).add(ep)]);
        
        length = 6;
        //端点斜线
        lines.push([this._rotateVector(sp, vec0, -Math.PI / 4).multiplyScalar(length).add(sp), this._rotateVector(sp, vec0, -Math.PI / 4).multiplyScalar(-length).add(sp)]);
        lines.push([this._rotateVector(sp, vec0, -Math.PI / 4).multiplyScalar(length).add(ep), this._rotateVector(sp, vec0, -Math.PI / 4).multiplyScalar(-length).add(ep)]);

        this.ctx.strokeStyle = color;
        this.ctx.beginPath();https://item.jd.com/3820581.html
        for(var i = 0; i < lines.length; i++) {
            lines[i][0].x = Math.round(lines[i][0].x);
            lines[i][0].y = Math.round(lines[i][0].y);
            lines[i][1].x = Math.round(lines[i][1].x);
            lines[i][1].y = Math.round(lines[i][1].y);
            if(lines[i][0].x % 2 == 0)
                lines[i][0].x += 0.5;
            if(lines[i][0].y % 2 == 0)
                lines[i][0].y += 0.5;
            if(lines[i][1].x % 2 == 0)
                lines[i][1].x += 0.5;
            if(lines[i][1].y % 2 == 0)
                lines[i][1].y += 0.5;
            this.ctx.moveTo(lines[i][0].x, lines[i][0].y);
            this.ctx.lineTo(lines[i][1].x, lines[i][1].y);

        }

        this.ctx.stroke();
        this.ctx.closePath();

        var center = new Vector3((p0.x+p1.x)/2, (p0.y+p1.y)/2, 0);
        var pos = this._rotateVector(center,new Vector3().subVectors(new Vector3(p0.x,p0.y,0),center).normalize(),Math.PI / 2).multiplyScalar(5).add(center);
        
        var tt = this._makeTextInput(pos, Math.round(edge.getLength()), callbackFun, canvas, targetEdge,nextInput);
        tt.value = Math.round(edge.getLength());
        tt.select();
        this.textBlank.push(tt);
        return tt;
    }
    
	/***
	 * 绘制文本
	 * @param {Object} txt 文本内容
	 * @param {Object} x 位置
	 * @param {Object} y 位置
	 * @param {Object} fontSize 字体大小
	 * @param {Object} color 文本颜色
	 */
    this.drawText = function(txt, x, y, fontSize, color){
    	if(fontSize === undefined) fontSize = 18;
    	if(color === undefined) color = "#000";
    	this.ctx.fillStyle = color;
		this.ctx.font = fontSize + "px 微软雅黑";
	    this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(txt, x, y);
    }
    
    this.textInputs = [];
	
	this.updateTextInputs = function(offsetx, offsety){
		for(var i = 0 ;i < this.textInputs.length;i++){
			var tt = this.textInputs[i];
			if(tt && tt.parentElement){
				var pos = $(tt).position();
				$(tt).css({left:pos.left+offsetx,top:pos.top+offsety});
			}
		}
	}
	
	this.removeAllTextInputs = function(){
		for(var i = 0 ;i < this.textInputs.length;i++){
			$(this.textInputs[i]).remove();
		}
		this.textInputs = [];
	}
    
    this.enterShadow = function (height) {
        var ctx = this.ctx;
        ctx.save();
        ctx.shadowOffsetX = 0; // 阴影Y轴偏移
        ctx.shadowOffsetY = 0; // 阴影X轴偏移
		ctx.shadowBlur = height; // 模糊尺寸
		ctx.shadowColor = Style.Shadow.color; // 颜色
    }
    
    this.exitShadow = function () {
        this.ctx.restore();
    }
    
    this.drawOutput = function(output, isFocus) {
        if (!output) {
            return;
        }
        
        for (var i = 0; i < output.length; i++) {
            var seg = output[i];
            if (seg instanceof Segment) {
                var edge = seg.getTheStartEndEdge();
                if (seg.isBoundry) {
                    this.drawLine(edge, null, isFocus ? Style.FocusLine.color : Style.BoundryLine.color );
                } else {
                    this.drawLine(edge, null, isFocus ? Style.FocusLine.color: null);
                }
            }
            
            if (seg instanceof Arc) {
                var edge = seg.getCurve();
                this.drawArc(edge, isFocus);
            }
        }
    }
    
    this.drawCornerDimentions = function(corner) {
        if (corner && corner instanceof Corner) {
            for (var i = 0; i < corner.mElements.length; i++) {
                if (corner.mElements[i] instanceof Segment) {
                    var curve = corner.mElements[i];
                    var edge = curve.getTheStartEndEdge();
                    var start = edge.mStart.clone();
                    var end = edge.mEnd.clone();
                    var center = edge.getCenter();
                    var area = curve.mAreas[curve.mAreas.length - 1];
                    //var area = areas[0];
                    var angle = edge.getAngle();
                    angle = angle + Math.PI / 2;
                    
                    var offset = 10 / Globals.Scale;
                    center.mY += offset * Math.sin(angle);
                    center.mX += offset * Math.cos(angle);
                    
                    if (area.containsPoint(center)) {
                        
                        start.mY -= offset * Math.sin(angle);
                        start.mX -= offset * Math.cos(angle);
                        
                        end.mY -= offset * Math.sin(angle);
                        end.mX -= offset * Math.cos(angle);
                        
                        
                    } else {
                        start.mY += offset * Math.sin(angle);
                        start.mX += offset * Math.cos(angle);
                        
                        end.mY += offset * Math.sin(angle);
                        end.mX += offset * Math.cos(angle);
                    }
                    
                    this.drawDimensions({x: start.mX,y: start.mY}, {x: end.mX,y: end.mY});
                }
            }
        }
    }
}