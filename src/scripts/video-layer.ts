import { Utility } from './utility';

export class VideoLayer {
  private video: HTMLVideoElement = null;

  constructor(video: HTMLVideoElement) {
    this.video = video;
  }

  getVideoWitdh = () => {
    return this.video.videoWidth;
  };

  getVideoHeight = () => {
    return this.video.videoHeight;
  };

  videoToCanvas = (canvas: HTMLCanvasElement) => {
    const [canvasContentWidth, canvasContentHeight] = [
      parseInt(canvas.getAttribute('width'), 10),
      parseInt(canvas.getAttribute('height'), 10),
    ];

    const [croppedPhotoWidth, croppedPhotoHeight] = Utility.aspectFill(
      this.getVideoWitdh(),
      this.getVideoHeight(),
      canvasContentWidth,
      canvasContentHeight
    );

    const vX = Math.floor((croppedPhotoWidth - canvasContentWidth) * 0.5);
    const vY = Math.floor((croppedPhotoHeight - canvasContentHeight) * 0.5);
    const vWidth = canvasContentWidth;
    const vHeight = canvasContentHeight;

    // Videoの内容をセンタリングしたAspectFillでCanvasへ書き込み
    const ctx = canvas.getContext('2d');
    if (ctx != null) {
      ctx.drawImage(
        this.video,
        vX,
        vY,
        vWidth,
        vHeight,
        0,
        0,
        canvasContentWidth,
        canvasContentHeight
      );
    }
  };

  requestUserMedia = (width: number, height: number) => {
    const medias = {
      locate: false,
      audio: false,
      video: {
        width: { ideal: width },
        height: { ideal: height },
        facingMode: 'environment',
      },
    };

    return navigator.mediaDevices.getUserMedia(medias).then((stream) => {
      return new Promise((resolve, reject) => {
        this.video.srcObject = stream;
        this.video.onloadedmetadata = () => {
          resolve();
        };
        this.video.onerror = (error) => {
          reject(error);
        };
      });
    });
  };
}
