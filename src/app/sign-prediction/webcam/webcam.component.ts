import { Component, OnInit, ViewChild, ElementRef, HostListener, NgZone, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { HandPose } from '@tensorflow-models/handpose';
import { BehaviorSubject, Subject, zip } from 'rxjs';
import { map, distinctUntilChanged, tap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss']
})
export class WebcamComponent implements AfterViewInit {

  @ViewChild('video') video: ElementRef;
  @ViewChild('overlay') overlay: ElementRef;
  @ViewChild('cropped') croppedCanvas: ElementRef;

  @Output() handDetected: EventEmitter<string>;
  @Input() isMobile = false;

  countDown: Subject<void>;
  isLoading = false;

  get isPredictionActive() {
    return !!this.video?.nativeElement?.srcObject;
  }

  private boundingBoxSubject: BehaviorSubject<TfBoundingBox>;
  private renderingContext: CanvasRenderingContext2D;
  private croppedRenderingContext: CanvasRenderingContext2D;
  private VIDEO_WIDTH = 640;
  private VIDEO_HEIGHT = 500;

  constructor(private ngZone: NgZone) {
    this.handDetected = new EventEmitter();
    this.countDown = new Subject();

    this.boundingBoxSubject = new BehaviorSubject({ topLeft: ['0', '0'], bottomRight: ['0', '0'] });

    const newHands = this.boundingBoxSubject
      .asObservable()
      .pipe(
        filter(box => !!this.renderingContext && !!this.croppedCanvas?.nativeElement),
        map((box) => new BoundingBox(
          Math.round(parseFloat(box.topLeft[0])),
          Math.round(parseFloat(box.topLeft[1])),
          Math.round(parseFloat(box.bottomRight[0])),
          Math.round(parseFloat(box.bottomRight[1]))
        )),
        tap((box) => {
          if (box.bottomRightX - box.topLeftX > 0) {

            let width = box.bottomRightX - box.topLeftX;
            let height = box.bottomRightY - box.topLeftY;

            this.renderingContext.beginPath();
            this.renderingContext.rect(box.topLeftX, box.topLeftY, box.bottomRightX - box.topLeftX, box.bottomRightY - box.topLeftY);
            this.renderingContext.stroke();

            if (width > height) {
              height = width;
            } else {
              width = height;
            }

            // if (box.topLeftX + width > this.VIDEO_WIDTH) {
            //   const toWide = box.topLeftX + width - this.VIDEO_WIDTH;
            //   box.topLeftX -= toWide;
            // }

            // if (box.topLeftX < 0) {
            //   const toWide = box.topLeftX + width - this.VIDEO_WIDTH;
            //   width += toWide;
            // }

            // if (box.topLeftX + width > this.VIDEO_WIDTH) {
            //   const toWide = box.topLeftX + width - this.VIDEO_WIDTH;
            //   box.topLeftX -= toWide;
            // }

            this.croppedCanvas.nativeElement.width = width;
            this.croppedCanvas.nativeElement.height = height;


            const imageData = this.renderingContext
              .getImageData(box.topLeftX,
                box.topLeftY, width, height);

            this.croppedRenderingContext.putImageData(imageData, 0, 0);
          }
        })
      );

    zip(newHands, this.countDown)
      .pipe(
        map(([box, _]) => box),
        map(box => ({ image: this.croppedCanvas?.nativeElement?.toDataURL() })),
        filter(box => !!box.image),
      ).subscribe((box: any) => this.handDetected.next(box.image));
  }

  ngAfterViewInit(): void {
    this.croppedRenderingContext = this.croppedCanvas.nativeElement.getContext('2d');
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


      this.croppedRenderingContext.clearRect(0, 0,
        this.croppedCanvas?.nativeElement.width,
        this.croppedCanvas?.nativeElement.height);

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
        width: this.isMobile ? undefined : this.VIDEO_WIDTH,
        height: this.isMobile ? undefined : this.VIDEO_HEIGHT
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

    // this.renderingContext.translate(canvas.width, 0);
    // this.renderingContext.scale(-1, 1);
  }
}

export class BoundingBox {
  constructor(public topLeftX = 0, public topLeftY = 0, public bottomRightX = 0, public bottomRightY = 0) { }
}

interface TfBoundingBox {
  topLeft: Array<string>;
  bottomRight: Array<string>;
}
