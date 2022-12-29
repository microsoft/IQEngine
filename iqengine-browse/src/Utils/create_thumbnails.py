# Copyright (c) Microsoft Corporation.
# Licensed under the MIT License.

import numpy as np
import matplotlib.pyplot as plt
import os, uuid
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
import io

accountURL = 'https://sigmffilerecordings.blob.core.windows.net'
containerName = 'testsigmfrecordings'
SASToken = os.env.REACT_APP_AZURE_BLOB_SAS_URL


blob_service_client = BlobServiceClient(account_url=accountURL, credential=SASToken)
container_client = blob_service_client.get_container_client(containerName)

print("\nListing blobs...")

# List the blobs in the container
blob_list = container_client.list_blobs()
for blob in blob_list:
    print("\t" + blob.name)
    if '.sigmf-data' in blob.name and '/' not in blob.name:
        stream = io.BytesIO()
        download_stream = container_client.download_blob(blob, offset = 0, length=1000000)
        download_stream.download_to_stream(stream)
        dat_float32 = np.frombuffer(stream.getbuffer(), dtype=np.float32)
        dat_int16 = np.frombuffer(stream.getbuffer(), dtype=np.int16)
        if not np.isnan(np.max(dat_float32)):
            dat = dat_float32
        else:
            dat = dat_int16
        x = dat[::2] + 1j*dat[1::2]

        # Create spectrogram
        fft_size = 1024
        sample_rate = 1e6
        num_rows = int(np.floor(len(x)/fft_size))
        spectrogram = np.zeros((num_rows, fft_size))
        for i in range(num_rows):
            spectrogram[i,:] = 10*np.log10(np.abs(np.fft.fftshift(np.fft.fft(x[i*fft_size:(i+1)*fft_size])))**2)
        fig = plt.figure(frameon=False)
        ax = plt.Axes(fig, [0., 0., 1., 1.])
        ax.set_axis_off()
        fig.add_axes(ax)
        ax.imshow(spectrogram, aspect='auto')
        ax.set_xlabel("Frequency [MHz]")
        ax.set_ylabel("Time [s]")
        new_name = blob.name.split('.')[0] + '.png'
        fig.savefig(new_name)

        # for now, due to not having write permission, im just manually uploading them
        #blob_client = blob_service_client.get_blob_client(container=containerName, blob=new_name)
        #with open(new_name, "rb") as data:
        #    blob_client.upload_blob(data)