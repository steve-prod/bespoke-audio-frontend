import lamejs from 'lamejs';

// The AudioRecorder function below is based on Daniel Storey's webrtc-audio-recording
// https://github.com/danielstorey/webrtc-audio-recording
// (fork with MIT license available at https://github.com/steve-prod/webrtc-audio-recording)
// which is in turn based on Muaz Khan's RecordRTC Repository
// https://github.com/muaz-khan/RecordRTC
// // (fork with MIT license available at https://github.com/steve-prod/RecordRTC)
export default function AudioRecorder(context) {
    var self = this;
    var mediaStream, audioInput, jsAudioNode, messageBlob;
    var bufferSize = 4096;
    var sampleRate = 44100;
    var numberOfAudioChannels = 1;
    var leftChannel = [];
    var recordingLength = 0;
    var Storage = {};
    var AudioContext = window.AudioContext || window.webkitAudioContext;

    var kbps = 32; // originally encoded to 128kbps mp3
    var mp3encoder = new lamejs.Mp3Encoder(numberOfAudioChannels, sampleRate, kbps);
    var mp3Data = [];
    var samples;
    var sampleBlockSize = 1152;

    this.start = function() {
        messageBlob = null;
        setupStorage();
        navigator.mediaDevices.getUserMedia({audio: true})
        .then(onMicrophoneCaptured)
        .catch(onMicrophoneCaptureError);
    };

    this.stop = function() {
        stopRecording(function(blob) {
            messageBlob = blob
            document.getElementById("recorded-message").src = URL.createObjectURL(blob);
        });
    };

    this.getBlob = function () {
            return messageBlob;
    }

    function stopRecording(callback) {
        context.handleIsRecordingChange(false);
        context.handleIsLoadedChange(true);
        audioInput.disconnect(); // to make sure onaudioprocess stops firing
        jsAudioNode.disconnect();

        mergeLeftRightBuffers({
            sampleRate: sampleRate,
            internalInterleavedLength: recordingLength,
            leftBuffers: leftChannel
        }, function(buffer, view) {
            samples = new Int16Array(view.buffer)
            var sampleChunk, mp3buf;
            for (var i = 0; i < samples.length; i += sampleBlockSize) {
                sampleChunk = samples.subarray(i, i + sampleBlockSize);
                mp3buf = mp3encoder.encodeBuffer(sampleChunk);
                if (mp3buf.length > 0) mp3Data.push(mp3buf);
            }
            mp3buf = mp3encoder.flush();
            if (mp3buf.length > 0) mp3Data.push(new Int8Array(mp3buf));
            self.blob = new Blob(mp3Data, {type: 'audio/mp3'});
            callback(self.blob);
            clearRecordedData();
        });
    }

    function clearRecordedData() {
        leftChannel = [];
        recordingLength = 0;
        mp3Data = [];
    }

    function CreateStorageException(message) {
        this.message = message;
        this.name = 'CreateStorageException';
    }

    function setupStorage() {
        Storage.context = new AudioContext();
        if (Storage.context.createJavaScriptNode) {
            jsAudioNode = Storage.context.createJavaScriptNode(bufferSize, numberOfAudioChannels, numberOfAudioChannels);
        } else if (Storage.context.createScriptProcessor) {
            jsAudioNode = Storage.context.createScriptProcessor(bufferSize, numberOfAudioChannels, numberOfAudioChannels);
        } else {
            throw new CreateStorageException('WebAudio API has no support on this browser.');
        }
        jsAudioNode.connect(Storage.context.destination);
    }

    function onMicrophoneCaptured(microphone) {
        mediaStream = microphone;
        audioInput = Storage.context.createMediaStreamSource(microphone);
        audioInput.connect(jsAudioNode);
        jsAudioNode.onaudioprocess = onAudioProcess;
        context.handleIsRecordingChange(true);
        context.handleIsLoadedChange(false);
    }

    function onMicrophoneCaptureError(err) {
        console.log("There was an error accessing the microphone. You may need to allow the browser access.");
        console.log(err)
    }

    function onAudioProcess(e) {
        if (!context.state.isRecording) return;
        if ('active' in mediaStream) {
            if (!mediaStream.active) {
                console.log('MediaStream has stopped.');
                return;
            }
        } else if ('ended' in mediaStream) { // old hack
            if (mediaStream.ended) {
                console.log('MediaStream has stopped.');
                return;
            }
        }
        leftChannel.push(new Float32Array(e.inputBuffer.getChannelData(0)));
        recordingLength += bufferSize;
        self.recordingLength = recordingLength;
    }

    function mergeLeftRightBuffers(config, callback) {
        function mergeAudioBuffers(config, cb) {
            var leftBuffers = config.leftBuffers;
            var sampleRate = config.sampleRate;
            var internalInterleavedLength = config.internalInterleavedLength;
            var desiredSampRate = config.desiredSampRate;

            leftBuffers = mergeBuffers(leftBuffers, internalInterleavedLength);
            if (desiredSampRate) leftBuffers = interpolateArray(leftBuffers, desiredSampRate, sampleRate);
            if (desiredSampRate) sampleRate = desiredSampRate;
            var buffer = new ArrayBuffer(leftBuffers.length * 2);
            var view = new DataView(buffer);

            // write the pulse-code modulation (PCM) samples
            var index = 0;
            for (var i = 0; i < leftBuffers.length; i++) {
                view.setInt16(index, leftBuffers[i] * 0x7FFF, true);
                index += 2;
            }

            if (cb) return cb({buffer: buffer,view: view});

            postMessage({buffer: buffer,view: view});

            // **************** End mergeAudioBuffers code *********************
            // **************** Begin web worker functions *********************
            // for changing the sampling rate, reference:
            // http://stackoverflow.com/a/28977136/552182
            function interpolateArray(data, newSampleRate, oldSampleRate) {
                var fitCount = Math.round(data.length * (newSampleRate / oldSampleRate));
                var newData = [];
                var springFactor = Number((data.length - 1) / (fitCount - 1));
                newData[0] = data[0]; // for new allocation
                var tmp, before, after, atPoint;
                for (var i = 1; i < fitCount - 1; i++) {
                    tmp = i * springFactor;
                    before = Number(Math.floor(tmp)).toFixed();
                    after = Number(Math.ceil(tmp)).toFixed();
                    atPoint = tmp - before;
                    newData[i] = data[before] + (data[after] - data[before]) * atPoint; // linearly interpolate
                }
                newData[fitCount - 1] = data[data.length - 1]; // for new allocation
                return newData;
            }

            function mergeBuffers(channelBuffer, rLength) {
                var result = new Float64Array(rLength);
                var offset = 0;
                for (var i = 0; i < channelBuffer.length; i++) {
                    result.set(channelBuffer[i], offset);
                    offset += channelBuffer[i].length;
                }
                return result;
            }
        }

        var webWorker = processInWebWorker(mergeAudioBuffers);
        webWorker.onmessage = function(event) {
            callback(event.data.buffer, event.data.view);
            URL.revokeObjectURL(webWorker.workerURL); // release memory
        };
        webWorker.postMessage(config);
    }

    function processInWebWorker(_function) {
        var workerURL = URL.createObjectURL(new Blob([_function.toString(),
            ';this.onmessage =  function (e) {' + _function.name + '(e.data);}'
        ], {type: 'application/javascript'}));
        var worker = new Worker(workerURL);
        worker.workerURL = workerURL;
        return worker;
    }
}
