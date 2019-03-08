class Paint {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.defaultAnchor = { x: 0, y: 0 };
    this.defaultPosition = { x: 0, y: 0 };
    this.viewTransform = {
      angle: 0,
      offset: { x: 0, y: 0 },
      scale: 1,
    };
  }

  fullScreen() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  }

  setViewAngle(angle) {
    this.viewTransform.angle = angle;
  }

  setViewScale(scale) {
    this.viewTransform.scale = scale;
  }

  setViewOffset(x, y) {
    this.viewTransform.offset = { x, y };
  }

  clear() {
    this.canvas.width = this.canvas.width;
  }

  rect(props) {
    const { ctx } = this;

    const { width, height, position = this.defaultPosition } = props;

    const dimensions = this.getRectFinalDimensions(props);

    ctx.save();
    this.applyViewTransform();
    this.applyTransform(props, dimensions);
    ctx.rect(0, 0, dimensions.x, dimensions.y);
    this.paintShape(props);
    ctx.restore();
  }

  image(props) {
    const { ctx } = this;
    const { image, position } = props;

    const dimensions = this.getImageFinalDimensions(props);

    ctx.save();
    this.applyViewTransform();
    this.applyTransform(props, dimensions);
    this.applyAlpha(props);
    ctx.drawImage(image, 0, 0, dimensions.x, dimensions.y);
    ctx.restore();
  }

  circle(props) {
    const { ctx } = this;
    const { position, radius, scale = 1 } = props;

    ctx.save();
    this.applyViewTransform();
    ctx.arc(position.x, position.y, radius * scale, 0, Math.PI * 2);
    this.paintShape(props);
    ctx.restore();
  }

  path(props) {
    const { ctx } = this;
    const {
      points,
      closePath,
      position = this.defaultPosition,
      scale = 1,
    } = props;

    const dimensions = this.getPathFinalDimensions(props);

    ctx.save();
    this.applyViewTransform();
    this.applyTransform(props, dimensions);
    this.connectPoints(points, scale);

    if (closePath) {
      ctx.closePath();
    }

    this.paintShape(props);
    ctx.restore();
  }

  applyViewTransform() {
    const { ctx, canvas, viewTransform } = this;
    const { width, height } = canvas;
    const { angle, offset, scale } = viewTransform;

    ctx.translate(width * 0.5, height * 0.5);
    ctx.rotate(-angle);
    ctx.translate(-offset.x, -offset.y);
    ctx.scale(scale, scale);
    ctx.translate(-width * 0.5, -height * 0.5);
  }

  applyTransform(props, dimensions) {
    this.applyRotation(props);
    this.applyAnchor(props, dimensions);
    this.applyPosition(props);
  }

  getImageFinalDimensions({ image, scale = 1 }) {
    return { x: image.width * scale, y: image.height * scale };
  }

  getRectFinalDimensions({ width, height, scale = 1 }) {
    return { x: width * scale, y: height * scale };
  }

  getPathFinalDimensions({ points, scale = 1 }) {
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
      x: width * scale,

      y: height * scale,
    };
  }

  connectPoints(points, scale) {
    const { ctx } = this;

    points.forEach(({ x, y }, index) => {
      if (index === 0) {
        ctx.beginPath();
        ctx.moveTo(x * scale, y * scale);
      } else {
        ctx.lineTo(x * scale, y * scale);
      }
    });
  }

  applyRotation({ position = this.defaultPosition, angle = 0 }) {
    const { ctx } = this;

    ctx.translate(position.x, position.y);
    ctx.rotate(angle);
    ctx.translate(-position.x, -position.y);
  }

  applyPosition({ position = this.defaultPosition }) {
    this.ctx.translate(position.x, position.y);
  }

  applyAnchor({ anchor = this.defaultAnchor }, dimensions) {
    this.ctx.translate(-dimensions.x * anchor.x, -dimensions.y * anchor.y);
  }

  applyAlpha({ alpha }) {
    this.ctx.globalAlpha = alpha;
  }

  paintShape(props) {
    const { ctx } = this;
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

try {
  module.exports = Paint;
} catch (e) {}
