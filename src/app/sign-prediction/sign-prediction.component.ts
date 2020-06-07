import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HandPose } from '@tensorflow-models/handpose';

@Component({
  selector: 'app-sign-prediction',
  templateUrl: './sign-prediction.component.html',
  styleUrls: ['./sign-prediction.component.scss']
})
export class SignPredictionComponent implements OnInit {

  VIDEO_WIDTH = 640;
  VIDEO_HEIGHT = 500;
  mobile = false;

  constructor() {
    this.mobile = this.isMobile();

  }


  ngOnInit(): void {
  }

  async startWebcam() {
    const video = document.querySelector('video');
    await this.loadVideo();
    await this.predictHands();
  }

  async predictHands() {
    const model = (window as any).tensorflowModel;
    const video = document.querySelector('video');
    const hands = await model.estimateHands(video);
    console.log(hands);
    if (hands.length > 0) {
      console.log(`${hands.length} Patsches gefunden`);
    }
    // Each hand object contains a `landmarks` property,
    // which is an array of 21 3-D landmarks.
    // hands.forEach((hand: any) => console.log(hand.landmarks));
    requestAnimationFrame(this.predictHands.bind(this));
  }

  async setupCamera(): Promise<HTMLVideoElement> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available');
    }

    const video: HTMLVideoElement = document.getElementById('video');
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
    video.srcObject = stream;

    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
  }

  async loadVideo() {
    const video = await this.setupCamera();
    video.play();
    return video;
  }

  isAndroid() {
    return /Android/i.test(navigator.userAgent);
  }

  isiOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  isMobile() {
    return this.isAndroid() || this.isiOS();
  }


}
