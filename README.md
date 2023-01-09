# IQEngine

<h4 style="text-align: center;"><i>Browse terabytes of RF recordings without having to install anything or download any files</i></h4>

* Analyze RF recordings
* Organize *lots* of RF recordings
* Test signal detection/classification algorithms and visualize results
* Education - play around with different Fourier and wavelet transforms and filters by applying them to interesting signals
* Share your RF recordings/datasets with others, without them having to download files or install software

Try IQEngine using [this instance](todo) hosted by GNU Radio and connected to the official SigMF examples repository.

IQEngine is a web app that provides a way to store, share, and analyze RF recordings.  You can view recordings stored on your local machine, or store them in Azure blob storage so that anyone with the credentials can view them.

IQEngine uses the SigMF standard for the metadata and annotations.  The main page of IQEngine is a listing of the SigMF recordings, either in a blob storage container or local directory, providing a quick glimpse of the recordings, using spectrogram thumbnails and metadata summary.  You can click on a recording to be brought into a spectrogram viewer, which is an interactive web-based viewer.  The user only downloads the portions they are viewing at any given time. 

No more downloading large zip files full of RF recordings and installing software. 

IQEngine also comes with signal detection algorithms that can automatically add annotations to an RF recording based on a few detection parameters such as threshold and minimum bandwidth.  

For those who have *lots* of RF recordings, IQEngine can automatically insert metadata into a MongoDB database when files are uploaded to blob storage.  You can then perform queries in the IQEngine web app.

IQEngine is a work in progress, check back again soon!