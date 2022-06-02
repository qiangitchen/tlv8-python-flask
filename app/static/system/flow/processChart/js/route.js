function Point(x,y){
	this.x = x;
	this.y = y;
}

function ConnectionRouter(){
}
ConnectionRouter.prototype.type="ConnectionRouter";

ConnectionRouter.prototype.getEndDirection=function(/*:Connection*/ conn)
{
  // var sPoint = conn.points[0];
  // var tPoint = conn.points[conn.points.length-1];
  // var rect = conn.outPort.owner.bound;;
   
   var tDirect = conn.inPort.direction;//this.getDirect(rect,sPoint,tPoint);
 
//   var direction = this.getDirection(rect, p);
   //alert("end:"+tDirect);
   return tDirect;//this.getDirection(rect, p);
};

ConnectionRouter.prototype.getStartDirection=function(/*:Connection*/ conn)
{
//   var p = conn.getStartPoint();
  // var rect = conn.inPort.owner.bound;//.getBound();
 //  var sPoint =conn.points[0];
 //  var tPoint = conn.points[conn.points.length-1];
   
   var sDirect = conn.outPort.direction;//this.getDirect(rect,tPoint,sPoint);
  // alert("start:"+sDirect);
  // var direction = this.getDirection(rect, p);
   return sDirect;//this.getDirection(rect, p);
};


/**
 * Routes the Connection.
 * @param connection The Connection to route
 */
ConnectionRouter.prototype.route=function(/*:Connection*/ connection)
{
};


/**
 * @class Routes a {@link Connection}, possibly using a constraint.
 *
 * @version 0.9.15
 * @author Andreas Herz
 * @constructor
 */
ManhattanConnectionRouter=function()
{
   this.MINDIST = 30;
   this.points = [];
};

ManhattanConnectionRouter.prototype = new ConnectionRouter;
ManhattanConnectionRouter.prototype.type="ManhattanConnectionRouter";



/**
 * @see ConnectionRouter#route(Connection)
 */
ManhattanConnectionRouter.prototype.route=function( conn,fromPt,fromDir, toPt,toDir)
{   
   fromPt  = fromPt || conn.points[0];//linePoits[0];
   fromDir = fromDir || this.getStartDirection(conn);

   toPt    = toPt || conn.points[conn.points.length-1];//linePoits[linePoits.length-1];
   toDir   = toDir || this.getEndDirection(conn);
   this.points = [];
   this._route(conn,toPt, toDir, fromPt, fromDir);
   return this.points;
};

ManhattanConnectionRouter.prototype.isManhattanRouter = function(linePoits){
	for(var i = 0;i<linePoits.length-1;i++){
		if(!this.isInAline(linePoits[i],linePoits[i+1])){
			return false;
		}
	}
	return true;
};

ManhattanConnectionRouter.prototype.isInAline = function(pt1,pt2){
	if(Math.abs(pt1.x -pt2.x)<0.5 || Math.abs(pt1.y - pt2.y)<0.5){
		return true;
	}
	return false;
};
ManhattanConnectionRouter.prototype._route=function(/*:Connection*/ conn,/*:Point*/ fromPt, /*:int*/fromDir, /*:Point*/toPt, /*:int*/toDir)
{
   var TOL     = 0.1;
   var TOLxTOL = 0.01;

   // fromPt is an x,y to start from.  
   // fromDir is an angle that the first link must 
   //
   var UP   = 0;
   var RIGHT= 1;
   var DOWN = 2;
   var LEFT = 3;

   var xDiff = fromPt.x - toPt.x;
   var yDiff = fromPt.y - toPt.y;
   var point;
   var dir;
   // print((xDiff )+"============"+(yDiff ));
   if (((xDiff * xDiff) < (TOLxTOL)) && ((yDiff * yDiff) < (TOLxTOL))) 
   {
      //conn.addPoint(new Point(toPt.x, toPt.y));
   	  this.points.push(new Point(toPt.x, toPt.y));
      return;
   }
//alert(fromDir+"==="+toDir);
   if (fromDir == LEFT) 
   {
      if ((xDiff > 0) && ((yDiff * yDiff) < TOL) && (toDir == RIGHT))
      {
         point = toPt;
         dir = toDir;
      } 
      else 
      {
         if (xDiff < 0) 
         {
            point = new Point(fromPt.x - this.MINDIST, fromPt.y);
         }
         else if (((yDiff > 0) && (toDir == DOWN)) || ((yDiff < 0) && (toDir == UP))) 
         {
            point = new Point(toPt.x, fromPt.y);
         }
         else if (fromDir == toDir)
         {
            var pos = Math.min(fromPt.x, toPt.x) - this.MINDIST;
            point = new Point(pos, fromPt.y);
         }
         else
         {
            point = new Point(fromPt.x - (xDiff / 2), fromPt.y);
         }

         if (yDiff > 0) 
         {
            dir = UP;
         }
         else
         {
            dir = DOWN;
         }
      }
   }
   else if (fromDir == RIGHT) 
   {
      if ((xDiff < 0) && ((yDiff * yDiff) < TOL)&& (toDir == LEFT)) 
      {
         point = toPt;
         dir = toDir;
      } 
      else 
      {
         if (xDiff > 0) 
         {
           point = new Point(fromPt.x + this.MINDIST, fromPt.y);
         } 
         else if (((yDiff > 0) && (toDir == DOWN)) || ((yDiff < 0) && (toDir == UP))) 
         {
            point = new Point(toPt.x, fromPt.y);
         } 
         else if (fromDir == toDir) 
         {
            var pos = Math.max(fromPt.x, toPt.x) + this.MINDIST;
            point = new Point(pos, fromPt.y);
         } 
         else 
         {
               point = new Point(fromPt.x - (xDiff / 2), fromPt.y);
         }

         if (yDiff > 0) 
            dir = UP;
         else
            dir = DOWN;
      }
   } 
   else if (fromDir == DOWN) 
   {
      if (((xDiff * xDiff) < TOL) && (yDiff < 0)&& (toDir == UP)) 
      {
         point = toPt;
         dir = toDir;
      } 
      else 
      {
         if (yDiff > 0) 
         {
            point = new Point(fromPt.x, fromPt.y + this.MINDIST);
         } 
         else if (((xDiff > 0) && (toDir == RIGHT)) || ((xDiff < 0) && (toDir == LEFT))) 
         {
           point = new Point(fromPt.x, toPt.y);
         } 
         else if (fromDir == toDir) 
         {
            var pos = Math.max(fromPt.y, toPt.y) + this.MINDIST;
            point = new Point(fromPt.x, pos);
         } 
         else 
         {
            point = new Point(fromPt.x, fromPt.y - (yDiff / 2));
         }

         if (xDiff > 0) 
            dir = LEFT;
         else 
            dir = RIGHT;
      }
   } 
   else if (fromDir == UP) 
   {
      if (((xDiff * xDiff) < TOL) && (yDiff > 0) && (toDir == DOWN)) 
      {
         point = toPt;
         dir = toDir;
      } 
      else 
      {
         if (yDiff < 0) 
         {
            point = new Point(fromPt.x, fromPt.y - this.MINDIST);
         } 
         else if (((xDiff > 0) && (toDir == RIGHT)) || ((xDiff < 0) && (toDir == LEFT))) 
         {
            point = new Point(fromPt.x, toPt.y);
         } 
         else if (fromDir == toDir) 
         {
            var pos = Math.min(fromPt.y, toPt.y) - this.MINDIST;
            point = new Point(fromPt.x, pos);
         } 
         else 
         {
            point = new Point(fromPt.x, fromPt.y - (yDiff / 2));
         }

         if (xDiff > 0)
            dir = LEFT;
         else
            dir = RIGHT;
      }
   }
   this._route(conn,point, dir, toPt, toDir);
//   conn.addPoint(fromPt);
   this.points.push(fromPt);
};
