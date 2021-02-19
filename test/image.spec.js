import path from 'path'
import initStoryshots from '@storybook/addon-storyshots'
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer'

const getMatchOptions = ({ context: { fileName } }) => {
  // Generates a custom path based on the file name and the custom directory.
  const snapshotPath = path.join(
    path.dirname(fileName),
    '__tests__',
    '__image_snapshots__',
  )
  return {
    customSnapshotsDir: snapshotPath,
  }
}

initStoryshots({
  suite: 'Image storyshots',
  test: imageSnapshot({
    getMatchOptions,
    storybookUrl: `file://${path.resolve(__dirname, '..', 'storybook-static')}`,
  }),
  configPath: path.resolve(__dirname, '..', '.storybook'),
})
