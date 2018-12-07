class Ctx {
  constructor(ctx) {
    this.ctx = ctx;
    this.defaultAnchor = { x: 0, y: 0 };
  }

  draw(props) {
    const { ctx } = this;
    const { x, y, anchor = this.defaultAnchor, image, angle = 0 } = props;

    const center = [x, y];

    ctx.save();
    ctx.translate(...center);
    ctx.rotate(angle);
    ctx.translate(...center.map(val => -val));
    ctx.drawImage(
      image,
      x - image.width * anchor.x,
      y - image.height * anchor.y,
      image.width,
      image.height
    );
    ctx.restore();
  }
}
