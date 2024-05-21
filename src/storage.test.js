
import * as storage from './storage'

test('stores data', async () => {
    // TODO use a polyfill to actually test this on node
    storage.getStorageData('abc').then((data) => console.log(data))
    storage.setStorageData({abc: 123}).then(() => console.log("saved"))
})
