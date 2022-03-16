import { getClassName } from 'question/utils/dom';
import { PREFIX } from 'question/constants';

describe('getClassName method ', () => {
    it(`returns a new string after adding prefix ${PREFIX} to each of the children string`, () => {
        expect(getClassName('class-1 class-2')).toEqual(`${PREFIX}class-1 ${PREFIX}class-2`);
    });
});
