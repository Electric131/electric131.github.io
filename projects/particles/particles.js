var T=class extends Error{constructor(t){super(t),this.name="AssertionError"}};function O(i,t=""){if(!i)throw new T(t)}var o=class{x;y;width;height;constructor(t,e,s,n){this.x=t,this.y=e,this.width=s,this.height=n}includes(t){return t.x-t.width/2<=this.x+this.width/2&&t.x+t.width/2>=this.x-this.width/2&&t.y-t.height/2<=this.y+this.height/2&&t.y+t.height/2>=this.y-this.height/2}includesPoint(t,e){return t>=this.x-this.width/2&&t<=this.x+this.width/2&&e>=this.y-this.height/2&&e<=this.y+this.height/2}},v=class{quads=[];salvageQuad=null;constructor(){}get collider(){return new o(0,0,0,0)}updateTree(){this.quads[0]&&(this.salvageQuad=this.quads[0]);var t=[[this.collider.x-this.collider.width/2,this.collider.y-this.collider.height/2],[this.collider.x-this.collider.width/2,this.collider.y+this.collider.height/2],[this.collider.x+this.collider.width/2,this.collider.y-this.collider.height/2],[this.collider.x+this.collider.width/2,this.collider.y+this.collider.height/2]];for(let e of this.quads){if(!e.boundary.includes(this.collider)){e.remove(this);continue}t=t.filter(([s,n])=>!e.boundary.includesPoint(s,n))}if(t.length!=0){for(let s of this.quads)s.objects.includes(this)&&s.remove(this);let e=this.salvageQuad;for(O(e);e.depth!=0&&e.parent;)e=e.parent;e.insert(this)}}},w=class i{boundary;parent=null;depth;maxDepth;maxObjects;objects=[];divided=!1;northwest=null;northeast=null;southwest=null;southeast=null;constructor(t,e,s=0,n=4,u){this.boundary=t,this.depth=s,this.maxDepth=e,this.maxObjects=n,this.parent=u||null}insert(t){if(!this.boundary.includes(t.collider))return!1;if(this.divided)return this.northwest.insert(t),this.northeast.insert(t),this.southwest.insert(t),this.southeast.insert(t),!0;if(t.quads.push(this),this.objects.push(t),this.objects.length<=this.maxObjects||this.depth>=this.maxDepth)return!0;for(this.subdivide();this.objects.length>0;){let e=this.objects.pop();e.quads.splice(e.quads.indexOf(this),1),this.northwest.insert(e),this.northeast.insert(e),this.southwest.insert(e),this.southeast.insert(e)}return!0}remove(t){this.objects.splice(this.objects.indexOf(t),1),t.quads.splice(t.quads.indexOf(this),1),this.parent&&this.parent.trimSubdivisions()}trimSubdivisions(){let t=this.query(this.boundary);if(t.length<=this.maxObjects){this.divided=!1,this.northwest=null,this.northeast=null,this.southwest=null,this.southeast=null;for(let e of t)e.quads=e.quads.filter(s=>!s.boundary.includes(this.boundary)),this.insert(e);this.parent&&this.parent.trimSubdivisions()}}subdivide(){if(this.divided)return!1;let t=this.boundary,e=new o(t.x-t.width/4,t.y-t.height/4,t.width/2,t.height/2);this.northwest=new i(e,this.maxDepth,this.depth+1,this.maxObjects,this);let s=new o(t.x+t.width/4,t.y-t.height/4,t.width/2,t.height/2);this.northeast=new i(s,this.maxDepth,this.depth+1,this.maxObjects,this);let n=new o(t.x-t.width/4,t.y+t.height/4,t.width/2,t.height/2);this.southwest=new i(n,this.maxDepth,this.depth+1,this.maxObjects,this);let u=new o(t.x+t.width/4,t.y+t.height/4,t.width/2,t.height/2);this.southeast=new i(u,this.maxDepth,this.depth+1,this.maxObjects,this),this.divided=!0}query(t,e=[]){if(!this.boundary.includes(t))return e;if(!this.divided){for(let n of this.objects)e.includes(n)||e.push(n);return e}let s=this.northwest.query(t,e);return s=this.northeast.query(t,s),s=this.southwest.query(t,s),this.southeast.query(t,s)}};var Q=document.getElementById("particles"),h=document.createElement("canvas"),d=[],r=50,a,g=[],b=[],l=.7,R=!1,f=500*Math.pow(l,2),q=new o(globalThis.innerWidth/2,globalThis.innerHeight/2,globalThis.innerWidth+r*2,globalThis.innerHeight+r*2),m=new w(q,4,0,10);globalThis.QT=m;globalThis.particles=d;S();function S(){Q&&(Q.appendChild(h),a=h.getContext("2d"),a&&(C(),requestAnimationFrame(k)))}var P=0;function k(i){if(!a)return;let t=i-P;if(P=i,t<=500){let e=t/16.666666666666668;for(a.fillStyle="black",a.fillRect(0,0,h.width,h.height);d.length<f;)d.push(new D);d.splice(f,d.length-f);let s=performance.now(),n=performance.now();for(let c of d)c.update(e),c.lastDrawn=i,c.draw(a);b.push(performance.now()-n),b.splice(0,b.length-30);let u=b.reduce((c,M)=>c+M)/b.length;R&&p(m,a),g.push(t),g.splice(0,g.length-30);let y=g.reduce((c,M)=>c+M)/g.length;R&&(a.fillStyle="white",a.font="16px serif",a.fillText(`Frame Delay: ${Math.round(y*100)/100} ms`,10,20),a.fillText(`Particle Update + Draw Delay: ${Math.round(u*100)/100} ms`,10,40),a.fillText(`FPS: ${Math.round(1e3/y*10)/10}`,10,60),a.fillText(`Particles: ${d.length} / ${f}`,10,80))}requestAnimationFrame(k)}function C(){let i=globalThis.innerWidth*globalThis.devicePixelRatio,t=globalThis.innerHeight*globalThis.devicePixelRatio;for(let e of d)e.x*=i*l/h.width,e.y*=t*l/h.height;h.width=Math.ceil(i*l),h.height=Math.ceil(t*l),f=Math.round(500/(1920*l*1080*l)*h.width*h.height),q=new o(h.width/2,h.height/2,h.width+r*2,h.height+r*2),m=new w(q,4,0,10);for(let e of d)e.quads=[],m.insert(e);globalThis.QT=m}var x=class i{x;y;constructor(t,e){this.x=t,this.y=e}get magnitude(){return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))}setMagnitude(t){this.normalize(),this.x*=t,this.y*=t}normalize(){let t=this.magnitude;this.x/=t,this.y/=t}normalized(){let t=new i(this.x,this.y);return t.normalize(),t}subtract(t){return new i(this.x-t.x,this.y-t.y)}},D=class extends v{x;y;speed;dir;lastDrawn;constructor(){super(),this.x=Math.random()*(h.width+r*2)-r,this.y=Math.random()*(h.height+r*2)-r,this.speed=Math.random()*1.2+.2,this.dir=new x(Math.random()*2-1,Math.random()*2-1).normalized(),this.lastDrawn=0,m.insert(this)}get collider(){return new o(this.x,this.y,1,1)}draw(t){let e=160;t.strokeStyle="blue",t.fillStyle="white",t.fillRect(Math.round(this.x),Math.round(this.y),1,1);let s=new x(this.x,this.y).subtract(j).magnitude;e+=Math.max(0,100-s)/2;for(let n of m.query(new o(this.x,this.y,e*2,e*2))){if(n.lastDrawn>=this.lastDrawn)continue;let u=Math.sqrt(Math.pow(n.x-this.x,2)+Math.pow(n.y-this.y,2))/l;if(u>e)continue;t.beginPath();let y=.4-u/400+Math.max(0,(200-s)/500);t.strokeStyle=`rgba(255, 255, 255, ${y})`,t.moveTo(Math.round(this.x),Math.round(this.y)),t.lineTo(Math.round(n.x),Math.round(n.y)),t.stroke()}}update(t){this.dir.setMagnitude(this.speed),this.x+=this.dir.x*t,this.y+=this.dir.y*t,(this.x<-r||this.x>h.width+r)&&(this.x=Math.min(h.width+r,Math.max(-r,this.x)),this.dir.x*=-1),(this.y<-r||this.y>h.height+r)&&(this.y=Math.min(h.height+r,Math.max(-r,this.y)),this.dir.y*=-1),super.updateTree()}};function p(i,t){i.divided&&(p(i.northwest,t),p(i.northeast,t),p(i.southwest,t),p(i.southeast,t)),t.strokeStyle="green",z(i.boundary,t)}function z(i,t,e=0){t.lineWidth=1,t.strokeRect(i.x-(i.width-e)/2,i.y-(i.height-e)/2,i.width-e,i.height-e)}var j=new x(0,0);document.onmousemove=i=>{j.x=i.clientX*l,j.y=i.clientY*l};window.onresize=C;
//# sourceMappingURL=particles.js.map
