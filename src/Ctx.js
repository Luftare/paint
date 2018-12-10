class Ctx {
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.defaultAnchor = { x: 0, y: 0 };
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
