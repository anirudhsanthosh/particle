import './style.css'

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;

const ctx = canvas?.getContext('2d',{ alpha: true })! as CanvasRenderingContext2D;

canvas.width = window.innerWidth;

canvas.height = window.innerHeight;


const image = document.querySelector<HTMLImageElement>('img')!;



class Particle {

  x: number;

  y: number;

  size: number;

  effect: Effect;

  vx: number;

  vy: number;

  originX: number;

  originY: number;

  color: string;

  ease: number;
  
  angle: number;
  
  force: number;

  dx:number;

  dy : number

  distance : number;

  friction : number;

  constructor(effect: Effect, x: number, y: number, color: string) {
    this.effect = effect;

    this.x = Math.random() * this.effect.width;

    this.y = Math.random() * this.effect.height;

    this.size = this.effect.gap //- 1;

    this.vx = 0; //Math.random() * 2 - 1;

    this.vy = 0; // Math.random() * 2 -1 ;

    this.originX = Math.floor(x);

    this.originY = Math.floor(y);

    this.color = color;

    this.ease = 0.2;

    this.dx = 0;
    
    this.dy = 0;
    
    this.distance = 0;

    this.angle = 0

    this.force = 0;

    this.friction = 0.90;




  }

  draw(ctx: CanvasRenderingContext2D) {

    ctx.fillStyle = this.color

    ctx.fillRect(this.x, this.y, this.size, this.size)
  }

  update() {


    this.dx = this.effect.mouse.x - this.x ;
    this.dy = this.effect.mouse.y - this.y ;

    this.distance = this.dx * this.dx + this.dy * this.dy;

    this.force = - this.effect.mouse.radius / this.distance;

    if(this.distance < this.effect.mouse.radius) {

      this.angle = Math.atan2(this.dy,this.dx);

      this.vx = this.force * Math.cos(this.angle)


      this.vy = this.force * Math.sin(this.angle)
    }

    // this.x = this.originX

    // this.y = this.originY;


   this.x += ((this.vx *= this.friction) + (this.originX - this.x) * this.ease);

   this.y += ((this.vy *= this.friction )+(this.originY - this.y) * this.ease);

  }
}



class Effect {

  width: number;

  height: number;

  centerX: number;

  centerY: number;

  particleArray: Particle[];

  ctx: CanvasRenderingContext2D;

  image: HTMLImageElement;

  x: number;

  y: number;

  gap: number;

  mouse: {
    radius: number,
    x: number | undefined
    y: number | undefined
  }

  constructor(width: number, height: number, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {

    this.width = width;

    this.height = height;

    this.particleArray = [];

    this.ctx = ctx

    this.image = image;

    this.centerX = this.width * 0.5

    this.centerY = this.height * 0.5;

    this.x = this.centerX - this.image.width * 0.5;

    this.y = this.centerY - this.image.height * 0.5;

    this.gap = 3;

    this.mouse = {
      radius: 10000,
      x: undefined,
      y: undefined,
    }

    window.addEventListener('mousemove',(e:MouseEvent)=>{
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    })

    this.init()
  }

  init() {

    this.ctx.drawImage(image, this.x, this.y)

    const { data: pixels } = this.ctx.getImageData(0, 0, this.width, this.height)

    for (let height = 0; height < this.height; height += this.gap) {


      for (let width = 0; width < this.width; width += this.gap) {

        const index = (height * this.width + width) * 4;

        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        const alpha = pixels[index + 3];

        const color = `rgba(${red},${green},${blue})`;//,${alpha}

        if (alpha > 200) this.particleArray.push(new Particle(this, width, height, color))
      }
    }

  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  draw() {

    this.particleArray.forEach((particle: Particle) => particle.draw(this.ctx));

  }

  update() {

    this.particleArray.forEach((particle: Particle) => particle.update());

  }

}



const effect = new Effect(canvas.width, canvas.height, ctx, image);


function animate() {

  effect.clear();

  effect.draw();

  effect.update();

  window.requestAnimationFrame(animate);
}

// ctx?.drawImage(image,0,0)


function load() {

  // requestAnimationFrame(animate)
  animate();

}








window.addEventListener('load', () => {
  load()
})

