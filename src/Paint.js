class Paint {
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.defaultAnchor = { x: 0, y: 0 };
    this.defaultPosition = { x: 0, y: 0 };
  }

  rect(props) {
    const { ctx } = this;
    const { width, height, position = this.defaultPosition } = props;

    ctx.save();
    this.applyAlpha(props);
    this.applyRotation(props);

    ctx.rect(
      ...this.getRectComputedPosition(props),
      ...this.getRectComputedDimensions(props)
    );

    this.paintShape(props);

    ctx.restore();
  }

  circle(props) {
    const { ctx } = this;
    const { position, radius, scale = 1 } = props;

    ctx.save();
    this.applyAlpha(props);

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

    ctx.save();

    this.applyRotation(props);
    this.applyPosition(position);
    this.applyPathAnchor(props);
    this.connectPoints(points, scale);

    if (closePath) {
      ctx.closePath();
    }

    this.applyAlpha(props);
    this.paintShape(props);

    ctx.restore();
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

  applyPosition({ x, y }) {
    this.ctx.translate(x, y);
  }

  applyPathAnchor({ anchor = this.defaultAnchor, points, scale = 1 }) {
    const { minX, minY, maxX, maxY } = this.getPathBoundaries(points);
    const { ctx } = this;
    const width = maxX - minX;
    const height = maxY - minY;

    ctx.translate(-width * anchor.x * scale, -height * anchor.y * scale);
  }

  getPathBoundaries(points) {
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

    return {
      minX,
      minY,
      maxX,
      maxY,
    };
  }

  paintShape(props) {
    const { ctx } = this;
    const { fill, stroke, scaleLineWidth, lineWidth = 1, scale = 1 } = props;

    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }

    if (stroke) {
      ctx.lineWidth = scaleLineWidth ? lineWidth * scale : lineWidth;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
  }

  image(props) {
    const { ctx } = this;
    const { image } = props;

    ctx.save();
    this.applyAlpha(props);
    this.applyRotation(props);

    ctx.drawImage(
      image,
      ...this.getImageComputedPosition(props),
      ...this.getImageComputedDimensions(props)
    );
    ctx.restore();
  }

  applyAlpha({ alpha }) {
    this.ctx.globalAlpha = alpha;
  }

  getRectComputedPosition({
    position,
    width,
    height,
    anchor = this.defaultAnchor,
    scale = 1,
  }) {
    return [
      position.x - width * anchor.x * scale,
      position.y - height * anchor.y * scale,
    ];
  }

  getImageComputedPosition({
    position,
    image,
    anchor = this.defaultAnchor,
    scale = 1,
  }) {
    return [
      position.x - scale * image.width * anchor.x,
      position.y - scale * image.height * anchor.y,
    ];
  }

  getImageComputedDimensions({ image, scale = 1 }) {
    return [image.width * scale, image.height * scale];
  }

  getRectComputedDimensions({ width, height, scale = 1 }) {
    return [width * scale, height * scale];
  }

  applyRotation({ position = this.defaultPosition, angle = 0 }) {
    const { ctx } = this;

    ctx.translate(position.x, position.y);
    ctx.rotate(angle);
    ctx.translate(-position.x, -position.y);
  }
}

try {
  module.exports = Ctx;
} catch (e) {}
