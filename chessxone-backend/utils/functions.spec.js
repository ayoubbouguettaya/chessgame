const { generateNewTagID } = require(".");

let tagsID = [];

jest.useRealTimers();

const findByTagID = (tagIDparams) => tagsID.indexOf(tagIDparams) !== -1;

it('generate tagID', async ()=>{
    jest.setTimeout(10000)
    let tagID = '';
    for (let index = 0; index < 20000; index++) {
        tagID = await  generateNewTagID(findByTagID)
        expect(tagsID).not.toContain(tagID)
        tagsID.push(tagID)        
    }
    
    return;
})
