import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, fromEvent } from 'rxjs';

import {
  loadImageErrorAction,
  loadImageSuccessAction,
  loadAnnotationSuccessAction,
  loadAnnotationErrorAction,
  drawImageAndannotationAction,
} from '../store/annotation/annotation.actions';
import { AnnotationsServise } from './annotation.service';
import { Annotation } from './annotation.model';
import { AppStore } from '../store/types';

@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss'],
})
export class AppAnnotation implements AfterViewInit {
  @ViewChild('ref')
  private canvas: ElementRef = {} as ElementRef;
  context: CanvasRenderingContext2D;
  backgroundImage: HTMLImageElement;

  constructor(
    private store: Store<AppStore>,
    private annotationServise: AnnotationsServise
  ) {
    this.backgroundImage = new Image();
  }

  // For doing this business logic outside of component, we need do dispatch drawImageAndannotationAction, catch it, and and do logic inside ngrx/effects
  // But ngrx/effects in not allowed in documentation
  draw() {
    this.store.dispatch(drawImageAndannotationAction());
    this.backgroundImage.src = 'https://image.dummyjson.com/512x512/101010';

    const getImageSuccess$ = fromEvent(this.backgroundImage, 'load');

    const imageError$ = fromEvent(this.backgroundImage, 'error').subscribe({
      next: () => {
        //LoadImageError : Dispatched when an error occurs while loading the PNG image.
        this.store.dispatch(loadImageErrorAction());
        window.alert('Image loading error');
      },
    });

    const combine$ = combineLatest([
      this.annotationServise.getAnnotations(),
      getImageSuccess$,
    ]).subscribe({
      next: ([data]) => {
        const annotations: Annotation[] = JSON.parse(data.message);
        //LoadAnnotationsSuccess : Dispatched when the annotations are successfully loaded from theAPI.
        this.store.dispatch(loadAnnotationSuccessAction({ annotations }));
        //LoadImageSuccess : Dispatched when the PNG image are successfully loaded from the API
        this.store.dispatch(loadImageSuccessAction());
        imageError$.unsubscribe();

        this.context.drawImage(this.backgroundImage, 0, 0);

        // Draw the ellipse
        annotations.forEach((item) => {
          this.context.beginPath();
          this.context.strokeStyle = 'red';
          this.context.ellipse(
            item.x,
            item.y,
            item.radiusX,
            item.radiusY,
            Math.PI,
            0,
            2 * Math.PI
          );
          this.context.stroke();
        });
      },
      error: () => {
        //LoadAnnotationsError: Dispatched when an error occurs while loading the annotations.
        this.store.dispatch(loadAnnotationErrorAction());
        window.alert('Annotation loading error');
      },
      complete: () => {
        combine$.unsubscribe();
      },
    });
  }

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
  }
}
