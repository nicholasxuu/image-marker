// import Immutable from 'immutable';
// import reducer from '../MarkedResultReducer';
// import * as types from '../../constants/ActionTypes';
//
// describe('sample reducer test', () => {
//   it('should return the initial state', () => {
//     expect(reducer(undefined, {}))
//       .toEqual(Immutable.fromJS({}));
//   });
//
//   it('should update state', () => {
//     const paramA = 'a';
//     expect(reducer(undefined, { type: types.SAMPLE_ACTION, param1: paramA }))
//       .toEqual(Immutable.fromJS({
//         param1: paramA,
//       }));
//
//     const paramB = 'b';
//     expect(
//       reducer(
//         Immutable.fromJS({
//           param1: paramA,
//         }),
//         { type: types.SAMPLE_ACTION, param1: paramB },
//       ))
//       .toEqual(Immutable.fromJS({
//         param1: paramB,
//       }));
//   });
// });
