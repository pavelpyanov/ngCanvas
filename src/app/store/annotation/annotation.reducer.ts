import { createReducer, on } from '@ngrx/store';

import { loadAnnotationSuccessAction } from './annotation.actions';
import { Annotation } from '../../annotation/annotation.model';

export const initialState: Annotation[] = [];

export const annotationReducer = createReducer(
  initialState,
  on(loadAnnotationSuccessAction, (_state, { annotations }) => annotations)
);
