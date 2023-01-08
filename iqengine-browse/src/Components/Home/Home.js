import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <main>
        <p>
          <mark>What is IQEngine</mark>: IQEngine is a web app that provides RF engineers and researchers with a way to store and share RF recordings
          easily.
        </p>
        <p>
          These RF recordings are in the form of binary IQ files, with a metadata file for each one, that contains information about how the recording
          was taken, as well as any annotations that label interesting portions of the recording. IQEngine uses the SigMF standard for the metadata
          and annotations, and as such, the IQEngine tooling is very SigMF-specific. The entry-point into IQEngine is a file browser web app that
          shows you all of the RF recordings in your cloud storage account (currently only supports Azure), with important metadata displayed in
          columns. Using this screen, anyone can get a quick glimpse into the dataset. You can click on a single recording to be brought into a
          spectrogram viewer, which is an interactive web-based viewer, inspired by popular desktop apps such as Inspectrum and Baudline.
        </p>
        <p>
          The real power behind having this kind of interface be web-based is that the user doesn't have to download the entire RF recording to view
          it, they only download the portions they are viewing at any given time. This makes it much easier to share recordings and collaborate with
          others, by lowering the level of effort needed to check out a new RF dataset. In the past, you would have to download a large zip file full
          of RF recordings, usually several GB in size, and then open each file in a desktop app, assuming you already have it installed and know how
          to use it. Now, you can simply link people to a web page where they can immediately see the entire list of RF recordings, and view each one
          individually, without installing any software or downloading massive files. Lastly, for convinience, IQEngine comes with a detection
          algorithm that can automatically add annotations to an RF recording based on a few detection parameters such as threshold and minimum
          bandwidth, as well as a way to insert metadata into a mongodb database and perform queries.{' '}
        </p>
        <p>
          IQEngine is a work in progress. Click 
          <Link to="/browser" className='main-text-link'>
            Browser
          </Link>
          to try it out   
        </p>
      </main>
  )
}

export default Home