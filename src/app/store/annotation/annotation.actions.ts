import { createAction, props } from '@ngrx/store';
import { Annotation } from '../../annotation/annotation.model';

//For using this action, need to use ngrx/effects
export const drawImageAndannotationAction = createAction(
  '[Annotation Component] DrawImageAndAnnotationsButtonClicked'
);
export const loadImageSuccessAction = createAction(
  '[Annotation Component] LoadImageSuccess'
);
export const loadImageErrorAction = createAction(
  '[Annotation Component] LoadImageError'
);
export const loadAnnotationSuccessAction = createAction(
  '[Annotation Component] LoadAnnotationsSuccess',
  props<{ annotations: Annotation[] }>()
);
export const loadAnnotationErrorAction = createAction(
  '[Annotation Component] LoadAnnotationsError'
);
