import raw from '../generated/designSystemInventory.json'
import urls from '../generated/designSystemAssets'

const inventory = {
  ...raw,
  assets: raw.assets.map(asset => {
    const url = urls[asset.file] ?? asset.url
    return { ...asset, url, kind: /\.mp4(?:[?#]|$)/i.test(url) ? 'Video' : asset.kind }
  }),
}
export default inventory
