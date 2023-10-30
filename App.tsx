/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import YoutubePlayer, {PLAYER_STATES} from 'react-native-youtube-iframe';
import ModalMessage from './components/ModalMessage';
import axios from 'axios';
//import {downloadFile, stopDownload} from 'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util';

function App(): JSX.Element {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [playerReady, setPlayerReady] = useState(true);
  const [playing, setPlaying] = useState(true);
  //const [jodID, setJobID] = useState(0);
  //const [cancelled, setCancelled] = useState(false);

  const downloadFile1 = (videoId: String) => {
    //   const downloadTask = downloadFile({
    //     fromUrl: `https://intraytdlp.servicecloudlmex.co/api/v1/yt/videos-uploaded/${videoId}`,
    //     toFile: '/storage/emulated/0/Download/' + '/myvideo1.mp4',
    //   });
    //   setJobID(downloadTask.jobId);
    //   console.log('Task: ' + downloadTask.jobId);
    //   downloadTask.promise
    //     .then(() => {
    //       Alert.alert('downloaded');
    //     })
    //     .catch(e => {
    //       Alert.alert(e.message);
    //     });
    axios
      .get(
        `https://intraytdlp.servicecloudlmex.co/api/v1/yt/videos-uploaded/${videoId}`,
        {timeout: 120000, responseType: 'blob'},
      )
      .then(response => {
        const blob = new Blob([response.data], {
          type: 'application/octet-stream',
          lastModified: Date.now(),
        });
        const reader = new FileReader();
        reader.readAsText(blob, 'utf-8');
        reader.onload = () => {
          const path =
            ReactNativeBlobUtil.fs.dirs.LegacyDownloadDir + '/myvideo.mp4';
          if (typeof reader.result === 'string') {
            ReactNativeBlobUtil.fs.writeFile(path, reader.result);
            Alert.alert('downloaded');
          }
        };

        reader.onerror = () => {
          console.log(reader.error);
        };
      })
      .catch(e => {
        console.log('error');
        Alert.alert(e.message);
      });

    //let dirs = ReactNativeBlobUtil.fs.dirs;

    // ReactNativeBlobUtil.config({
    //   path: dirs.LegacyDownloadDir + '/myvideo.mp4',
    //   timeout: 120000,
    // })
    //   .fetch(
    //     'GET',
    //     `https://intraytdlp.servicecloudlmex.co/api/v1/yt/videos-uploaded/${videoId}`,
    //     {
    //       responseType: 'blob',
    //     },
    //   )
    //   .then(res => {
    //     setLoading(false);
    //     Alert.alert('Se completo la descarga', res.path());
    //   });
  };
  const handleDownload = () => {
    // setCancelled(false);
    if (youtubeUrl) {
      setLoading(true);
      axios
        .post(
          'https://intraytdlp.servicecloudlmex.co/api/v1/yt/videos-uploaded/',
          {url: youtubeUrl},
        )
        .then(response => {
          console.log('url del resnpose ', response.data.id);
          //setDownloadUrl(response.data);
          // if (!cancelled) {
          //   console.log('descargando...');
          //   downloadFile1(response.data.id);
          // }

          downloadFile1(response.data.id);
        })
        .catch(error => {
          console.error('Error:', error);
          //setLoading(false);
          //setDownloadUrl('');
        });
    }
  };
  const handleClean = () => {
    let a = 1;
    if (a === 3) {
    }
    setYoutubeUrl('');
  };
  const onStateChange = (state: PLAYER_STATES) => {
    console.log(state);
    if (state === 'ended') {
      setPlaying(false);
    } else {
      setPlayerReady(true);
    }
  };
  const handlePlayerError = (error: String) => {
    if (error) {
      console.log({error} + youtubeUrl);
      setPlayerReady(false);
    }
  };
  const handlePlayerReady = () => {
    console.log('player is ready');
    setPlayerReady(true);
  };

  const onPressCancelButton = () => {
    //setCancelled(true);
    //stopDownload(jodID);
    setLoading(false);
  };

  return (
    <ScrollView>
      <TextInput
        placeholder="Introduzca una URL"
        style={styles.input}
        onChangeText={setYoutubeUrl}
        value={youtubeUrl}
      />
      <View style={styles.viewRow}>
        <Button title="Limpiar" onPress={handleClean} />
      </View>
      {youtubeUrl && (
        <View style={styles.video}>
          <YoutubePlayer
            height={300}
            play={playing}
            videoId={youtubeUrl.slice(-11)}
            onChangeState={onStateChange}
            onError={handlePlayerError}
            onReady={handlePlayerReady}
          />
          {playerReady && <Button title="Descargar" onPress={handleDownload} />}
        </View>
      )}
      <ModalMessage
        visible={loading}
        message={'Cargando...'}
        onPress={onPressCancelButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  viewRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  video: {
    marginTop: 5,
    marginHorizontal: 2,
  },
});

export default App;
