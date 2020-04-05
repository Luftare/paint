export interface Point {
    x: number;
    y: number;
}
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
export declare type RectangleProperties = BaseRenderProperties & Dimensions;
export declare type ImageProperties = BaseRenderProperties & Image;
export declare type CircleProperties = BaseRenderProperties & Circle;
export declare type PathProperties = BaseRenderProperties & Path;
export declare class Paint {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    viewTransform: Transform;
    images: ImageMap;
    constructor(canvas: HTMLCanvasElement);
    static origin: Point;
    fullScreen(): void;
    loadImages(sources: string[]): Promise<unknown[]>;
    setViewAngle(angle: number): void;
    setViewScale(scale: number): void;
    setViewOffset(x: number, y: number): void;
    clear(): void;
    rect(props: RectangleProperties): void;
    image(props: ImageProperties): void;
    circle(props: CircleProperties): void;
    path(props: PathProperties): void;
    applyViewTransform(): void;
    applyTransform(props: BaseRenderProperties, dimensions: Dimensions): void;
    getImageFinalDimensions({ image, scale }: ImageProperties): Dimensions;
    getRectFinalDimensions({ width, height, scale }: RectangleProperties): Dimensions;
    getPathFinalDimensions({ points, scale }: PathProperties): Dimensions;
    connectPoints(points: Point[], scale?: number): void;
    applyRotation({ position, angle }: BaseRenderProperties): void;
    applyPosition({ position }: {
        position?: Point | undefined;
    }): void;
    applyAnchor({ anchor }: BaseRenderProperties, dimensions: Dimensions): void;
    applyAlpha({ alpha }: BaseRenderProperties): void;
    paintShape(props: BaseRenderProperties): void;
}
