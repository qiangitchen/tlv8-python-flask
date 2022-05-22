
function ArrayList(){
 this.buffer=new Array();
 if(arguments.length>0) this.buffer=arguments[0];
 this.length=this.buffer.length;
}
ArrayList.prototype.hashCode=function(){
 var h=0;
 for(var i=0;i<this.length;i++)
  h+=this.buffer[i].hashCode();
 return h;
};
 
ArrayList.prototype.size=function(){
 return this.length;
};

ArrayList.prototype.clear=function(){
 for(var i=0;i<this.length;i++) this.buffer[i]=null;
 this.buffer.length=0;
 this.length=0;
};

ArrayList.prototype.isEmpty=function(){
 return this.length==0;
};
 
ArrayList.prototype.toArray=function(){
 var copy=new Array();
 for(var i=0;i<this.length;i++){
  copy[i]=this.buffer[i];
 }
 return copy;
};
ArrayList.prototype.get=function(index){
 if(index>=0 && index<this.length)
  return this.buffer[index];
 return null;
};

ArrayList.prototype.remove=function(param){
 var index=0;

 if(isNaN(param)){
  index=this.indexOf(param);
 }
 else index=param;

 if(index>=0 && index<this.length){
  for(var i=index;i<this.length-1;i++)
   this.buffer[i]=this.buffer[i+1];
   this.length-=1;
   return true;
 }
 else return false;
};
  
ArrayList.prototype.add=function(){
 var args=arguments;
 if(args.length==1){
  this.buffer[this.length++]=args[0];
  return true;
 }
 else if(args.length==2){
  var index=args[0];
  var obj=args[1];
  if(index>=0 && index<=this.length){
   for(var i=this.length;i>index;i--)
    this.buffer[i]=this.buffer[i-1];
   this.buffer[i]=obj;
   this.length+=1;
   return true;
  }
 }
 return false;
};

ArrayList.prototype.indexOf=function(obj){
 for(var i=0;i<this.length;i++){
  if(this.buffer[i] == obj) return i; //zmh
 }
 return -1;
};

ArrayList.prototype.lastIndexOf=function(obj){
 for(var i=this.length-1;i>=0;i--){
  if(this.buffer[i].equals(obj)) return i;
 }
 return -1;
};

ArrayList.prototype.contains=function(obj){
 return this.indexOf(obj)!=-1;
};

ArrayList.prototype.equals=function(obj){
 if(this.size()!=obj.size()) return false;
 for(var i=0;i<this.length;i++){
  if(!obj.get(i).equals(this.buffer[i])) return false;
 }
 return true;
};

ArrayList.prototype.addAll=function(list){
 var mod=false;
 for(var it=list.iterator();it.hasNext();){
  var v=it.next();
  if(this.add(v)) mod=true;
 }
 return mod;  
};
 
ArrayList.prototype.containsAll=function(list){
 for(var i=0;i<list.size();i++){
  if(!this.contains(list.get(i))) return false;
 }
 return true;
};

ArrayList.prototype.removeAll=function(list){
 for(var i=0;i<list.size();i++){
  this.remove(this.indexOf(list.get(i)));
 }
};

ArrayList.prototype.retainAll=function(list){
 for(var i=this.length-1;i>=0;i--){
  if(!list.contains(this.buffer[i])){
   this.remove(i);
  }
 }
};

ArrayList.prototype.subList=function(begin,end){
 if(begin<0) begin=0;
 if(end>this.length) end=this.length;
 var newsize=end-begin;
 var newbuffer=new Array();
 for(var i=0;i<newsize;i++){
  newbuffer[i]=this.buffer[begin+i];
 }
 return new ArrayList(newbuffer);
};
ArrayList.prototype.set=function(index,obj){
 if(index>=0 && index<this.length){
  temp=this.buffer[index];
  this.buffer[index]=obj;
  return temp;
 }
};

ArrayList.prototype.iterator=function iterator(){
 return new ListIterator(this.buffer,this.length);
};

function HashMap()
  {
     /** Map 大小 **/
     var size = 0;
      /** 对象 **/
      var entry = new Object();
      
      /** 存 **/
      this.put = function (key , value)
      {
          if(!this.containsKey(key))
          {
              size ++ ;
          }
          entry[key] = value;
      };
      
      /** 取 **/
      this.get = function (key)
      {
          return this.containsKey(key) ? entry[key] : null;
      };
      
      /** 删除 **/
      this.remove = function ( key )
      {
          if( this.containsKey(key) && ( delete entry[key] ) )
          {
              size --;
          }
      };
      
      /** 是否包含 Key **/
      this.containsKey = function ( key )
      {
          return (key in entry);
      };
      
      /** 是否包含 Value **/
      this.containsValue = function ( value )
      {
          for(var prop in entry)
          {
              if(entry[prop] == value)
              {
                  return true;
              }
          }
          return false;
      };
      
      /** 所有 Value **/
      this.values = function ()
      {
          var values = new Array();
          for(var prop in entry)
          {
              values.push(entry[prop]);
          }
          return values;
      };
      
      /** 所有 Key **/
      this.keys = function ()
      {
          var keys = new Array();
          for(var prop in entry)
          {
              keys.push(prop);
          }
          return keys;
      };
      
      /** Map Size **/
      this.size = function ()
      {
          return size;
      };
      
      /* 清空 */
      this.clear = function ()
      {
          size = 0;
          entry = new Object();
      };
  }