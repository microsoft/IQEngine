# Copyright (c) Microsoft Corporation.
# Licensed under the MIT License. hello world I am a unnessessary comment

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

app = FastAPI()
 
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect/{detectorname}")
async def detect(info : Request, detectorname):
    try:
        detect_func = getattr(__import__(detectorname, fromlist=["detect"]), "detect")
    except ModuleNotFoundError as e:
        return {"status" : "FAILED - detector does not exist", "annotations": []}

    function_input = await info.json()
    samples = function_input["samples"] # Assumed to be real or floats in IQIQIQIQ (cant send complex over JSON)
    samples = np.asarray(samples)
    if len(samples) % 2 == 1: # in case it comes in odd just remove the last element
        samples = samples[:-1]
    samples = samples[::2] + 1j*samples[1::2]
    samples = samples.astype(np.complex64)
    annotations = detect_func(samples,
                              function_input["sample_rate"],
                              function_input["center_freq"],
                              function_input["detector_settings"])
    print(annotations)
    return {
        "status" : "SUCCESS",
        "annotations" : annotations
    }