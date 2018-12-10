class Ctx {
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.defaultAnchor = { x: 0, y: 0 };
  }

  rect(props) {
    const { ctx } = this;
    const { width, height } = props;

    ctx.save();
    this.applyAlpha(props);

    this.applyRotation(props);

    ctx.rect(...this.getRectComputedPosition(props), width, height);

    this.paintShape(props);

    ctx.restore();
  }

  paintShape(props) {
    const { ctx } = this;
    const { fill, stroke, lineWidth = 1 } = props;

    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }

    if (stroke) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
  }

  draw(props) {
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
    x,
    y,
    width,
    height,
    anchor = this.defaultAnchor,
  }) {
    return [x - width * anchor.x, y - height * anchor.y];
  }

  getImageComputedPosition({
    x,
    y,
    image,
    anchor = this.defaultAnchor,
    scale = 1,
  }) {
    return [
      x - scale * image.width * anchor.x,
      y - scale * image.height * anchor.y,
    ];
  }

  getImageComputedDimensions({ image, scale = 1 }) {
    return [image.width * scale, image.height * scale];
  }

  applyRotation({ x, y, angle = 0 }) {
    const { ctx } = this;

    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.translate(-x, -y);
  }
}
