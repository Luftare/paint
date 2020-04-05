export interface Point {
  x: number;
  y: number;
};

export interface Transform {
  angle: number;
  offset: Point;
  scale: number;
}

export interface ImageMap {
  [name: string]: HTMLImageElement;
}

export interface BaseRenderProperties {
  alpha?: number;
  position?: Point;
  angle?: number;
  anchor?: Point;
  scale?: number;
  fill?: string;
  stroke?: string;
  scaleLineWidth?: boolean;
  lineWidth?: number;
  lineCap?: CanvasLineCap;
  lineJoin?: CanvasLineJoin;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Image {
  image?: string | HTMLImageElement;
}

export interface Circle {
  radius: number;
}

export interface Path {
  points: Point[];
  closePath?: boolean;
}

export type RectangleProperties = BaseRenderProperties & Dimensions;
export type ImageProperties = BaseRenderProperties & Image;
export type CircleProperties = BaseRenderProperties & Circle;
export type PathProperties = BaseRenderProperties & Path;

export class Paint {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  viewTransform: Transform;
  images: ImageMap;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.viewTransform = {
      angle: 0,
      offset: { x: 0, y: 0 },
      scale: 1,
    };
    this.images = {};
  }

  static origin: Point = { x: 0, y: 0 };

  fullScreen() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  }

  loadImages(sources: string[]) {
    return Promise.all(sources.map(source => new Promise(resolve => {
      this.images[source] = new Image();
      this.images[source].onload = resolve;
      this.images[source].src = source;
    })));
  }

  setViewAngle(angle: number) {
    this.viewTransform.angle = angle;
  }

  setViewScale(scale: number) {
    this.viewTransform.scale = scale;
  }

  setViewOffset(x: number, y: number) {
    this.viewTransform.offset = { x, y };
  }

  clear() {
    this.canvas.width = this.canvas.width;
  }

  rect(props: RectangleProperties) {
    const { ctx } = this;

    const dimensions = this.getRectFinalDimensions(props);

    ctx?.save();
    this.applyViewTransform();
    this.applyTransform(props, dimensions);
    ctx?.beginPath();
    ctx?.rect(0, 0, dimensions.width, dimensions.height);
    ctx?.closePath();
    this.paintShape(props);
    ctx?.restore();
  }

  image(props: ImageProperties) {
    const { ctx } = this;
    const { image } = props;

    const imageElement: HTMLImageElement | undefined = typeof image === 'string' ? this.images[image] : image;
    if (!imageElement) return;

    const dimensions = this.getImageFinalDimensions(props);

    ctx?.save();
    this.applyViewTransform();
    this.applyTransform(props, dimensions);
    this.applyAlpha(props);
    ctx?.drawImage(imageElement, 0, 0, dimensions.width, dimensions.height);
    ctx?.restore();
  }

  circle(props: CircleProperties) {
    const { ctx } = this;
    const { position = Paint.origin, radius, scale = 1 } = props;

    ctx?.save();
    this.applyViewTransform();
    ctx?.beginPath();
    ctx?.arc(position.x, position.y, radius * scale, 0, Math.PI * 2);
    ctx?.closePath();
    this.paintShape(props);
    ctx?.restore();
  }

  path(props: PathProperties) {
    const { ctx } = this;
    const {
      points,
      closePath,
      scale = 1,
    } = props;

    const dimensions = this.getPathFinalDimensions(props);

    ctx?.save();
    this.applyViewTransform();
    this.applyTransform(props, dimensions);
    this.connectPoints(points, scale);

    if (closePath) {
      ctx?.closePath();
    }

    this.paintShape(props);
    ctx?.restore();
  }

  applyViewTransform() {
    const { ctx, canvas, viewTransform } = this;
    const { width, height } = canvas;
    const { angle, offset, scale } = viewTransform;

    ctx?.translate(width * 0.5, height * 0.5);
    ctx?.rotate(-angle);
    ctx?.translate(-offset.x, -offset.y);
    ctx?.scale(scale, scale);
    ctx?.translate(-width * 0.5, -height * 0.5);
  }

  applyTransform(props: BaseRenderProperties, dimensions: Dimensions) {
    this.applyRotation(props);
    this.applyAnchor(props, dimensions);
    this.applyPosition(props);
  }

  getImageFinalDimensions({ image, scale = 1 }: ImageProperties): Dimensions {
    const imageElement = image as HTMLImageElement;
    return { width: imageElement.width * scale, height: imageElement.height * scale };
  }

  getRectFinalDimensions({ width, height, scale = 1 }: RectangleProperties): Dimensions {
    return { width: width * scale, height: height * scale };
  }

  getPathFinalDimensions({ points, scale = 1 }: PathProperties): Dimensions {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    points.forEach(({ x, y }) => {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    });

    const width = maxX - minX;

    const height = maxY - minY;

    return {
      width: width * scale,
      height: height * scale,
    };
  }

  connectPoints(points: Point[], scale: number = 1) {
    const { ctx } = this;

    points.forEach(({ x, y }, index) => {
      if (index === 0) {
        ctx?.beginPath();
        ctx?.moveTo(x * scale, y * scale);
      } else {
        ctx?.lineTo(x * scale, y * scale);
      }
    });
  }

  applyRotation({ position = Paint.origin, angle = 0 }: BaseRenderProperties) {
    const { ctx } = this;

    ctx?.translate(position.x, position.y);
    ctx?.rotate(angle);
    ctx?.translate(-position.x, -position.y);
  }

  applyPosition({ position = Paint.origin }) {
    this.ctx?.translate(position.x, position.y);
  }

  applyAnchor({ anchor = Paint.origin }: BaseRenderProperties, dimensions: Dimensions) {
    this.ctx?.translate(-dimensions.width * anchor.x, -dimensions.height * anchor.y);
  }

  applyAlpha({ alpha = 1 }: BaseRenderProperties) {
    if (!this.ctx) return;
    this.ctx.globalAlpha = alpha;
  }

  paintShape(props: BaseRenderProperties) {
    const { ctx } = this;
    if (!ctx) return;
    const {
      fill,
      stroke,
      scaleLineWidth,
      lineWidth = 1,
      lineCap,
      lineJoin,
      scale = 1,
    } = props;

    this.applyAlpha(props);

    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }

    if (stroke) {
      if (lineCap) ctx.lineCap = lineCap;
      if (lineJoin) ctx.lineJoin = lineJoin;
      ctx.lineWidth = scaleLineWidth ? lineWidth * scale : lineWidth;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
  }
}
