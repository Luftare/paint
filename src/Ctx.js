class Ctx {
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.defaultAnchor = { x: 0, y: 0 };
  }

  draw(props) {
    const { ctx } = this;
    const {
      x,
      y,
      anchor = this.defaultAnchor,
      image,
      angle = 0,
      scale = 1,
      alpha = 1,
    } = props;

    const center = [x, y];

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(...center.map(val => val));
    ctx.rotate(angle);
    ctx.translate(...center.map(val => -val));
    ctx.drawImage(
      image,
      x - scale * image.width * anchor.x,
      y - scale * image.height * anchor.y,
      image.width * scale,
      image.height * scale
    );
    ctx.restore();
  }
}
