import { Component, ViewChild, ElementRef, NgZone, HostListener } from '@angular/core';
import { HandPose } from '@tensorflow-models/handpose';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-sign-prediction',
  templateUrl: './sign-prediction.component.html',
  styleUrls: ['./sign-prediction.component.scss']
})
export class SignPredictionComponent {

  @ViewChild('video') video: ElementRef;
  @ViewChild('overlay') overlay: ElementRef;
  isLoading = false;
  boundingBox$: Observable<BoundingBox>;

  get isPredictionActive() {
    return !!this.video?.nativeElement?.srcObject;
  }

  private boundingBoxSubject: BehaviorSubject<TfBoundingBox>;
  private renderingContext: CanvasRenderingContext2D;
  private VIDEO_WIDTH = 640;
  private VIDEO_HEIGHT = 500;
  private mobile = false;

  constructor(private ngZone: NgZone) {
    this.mobile = this.isMobile();
    this.boundingBoxSubject = new BehaviorSubject({ topLeft: ['0', '0'], bottomRight: ['0', '0'] });
    this.boundingBox$ = this.boundingBoxSubject
      .asObservable()
      .pipe(
        map((box) => new BoundingBox(
          Math.round(parseFloat(box.topLeft[0])),
          Math.round(parseFloat(box.topLeft[1])),
          Math.round(parseFloat(box.bottomRight[0])),
          Math.round(parseFloat(box.bottomRight[1]))
        )),
        distinctUntilChanged(),
        tap((box) => {
          if (this.renderingContext) {
            this.renderingContext.beginPath();
            this.renderingContext.rect(box.topLeftX, box.topLeftY, box.bottomRightX - box.topLeftX, box.bottomRightY - box.topLeftY);
            this.renderingContext.stroke();
          }
        })
      );
  }

  async startWebcam() {
    this.isLoading = true;
    await this.setupCamera();
    this.video.nativeElement.play();
    await this.ngZone.runOutsideAngular(() => this.predictHands());
    this.isLoading = false;
  }

  stopWebcam() {
    const stream = this.video.nativeElement.srcObject;
    this.video.nativeElement.srcObject = null;
    stream.getTracks().forEach(track => track.stop());
    this.video.nativeElement.load();
    this.resetCanvas();
  }

  @HostListener('document:keydown.space', ['$event'])
  async togglePrediction(event) {
    event.preventDefault();
    if (!this.isLoading) {
      if (this.isPredictionActive) {
        this.stopWebcam();
      } else {
        await this.startWebcam();
      }
    }
  }

  private async predictHands() {

    const videoWidth = this.video.nativeElement.videoWidth;
    const videoHeight = this.video.nativeElement.videoHeight;
    const canvasWidth = this.overlay.nativeElement.width;
    const canvasHeight = this.overlay.nativeElement.height;

    this.renderingContext.drawImage(
      this.video.nativeElement, 0, 0, videoWidth, videoHeight, 0, 0, canvasWidth,
      canvasHeight);

    if (this.isPredictionActive) {
      const model: HandPose = (window as any).tensorflowModel;
      const hands: Array<any> = await model.estimateHands(this.video.nativeElement);
      const boundingBox = hands.length > 0 ?
        { topLeft: hands[0].boundingBox.topLeft, bottomRight: hands[0].boundingBox.bottomRight } :
        { topLeft: ['0', '0'], bottomRight: ['0', '0'] };

      this.ngZone.run(() =>
        this.boundingBoxSubject.next(boundingBox)
      );
    }

    if (this.isPredictionActive) {
      requestAnimationFrame(this.predictHands.bind(this));
    }
  }

  private async setupCamera(): Promise<void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available');
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        // Only setting the video to a specified size in order to accommodate a
        // point cloud, so on mobile devices accept the default size.
        width: this.mobile ? undefined : this.VIDEO_WIDTH,
        height: this.mobile ? undefined : this.VIDEO_HEIGHT
      },
    });

    this.video.nativeElement.srcObject = stream;

    return new Promise((resolve) => {
      this.video.nativeElement.onloadedmetadata = () => {
        this.resetCanvas();
        resolve();
      };
    });
  }

  private resetCanvas() {
    const canvas: HTMLCanvasElement = this.overlay.nativeElement;
    const videoWidth = this.video.nativeElement.videoWidth;
    const videoHeight = this.video.nativeElement.videoHeight;

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    this.renderingContext = canvas.getContext('2d');
    this.renderingContext.clearRect(0, 0, videoWidth, videoHeight);
    this.renderingContext.strokeStyle = 'red';
    this.renderingContext.fillStyle = 'red';

    this.renderingContext.translate(canvas.width, 0);
    this.renderingContext.scale(-1, 1);

  }

  private isMobile() {
    return /Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
}

class BoundingBox {
  constructor(public topLeftX = 0, public topLeftY = 0, public bottomRightX = 0, public bottomRightY = 0) { }
}

interface TfBoundingBox {
  topLeft: Array<string>;
  bottomRight: Array<string>;
}
