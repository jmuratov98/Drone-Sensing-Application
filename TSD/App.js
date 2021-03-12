/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

import MapView, { Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import RNFileSelector from 'react-native-file-selector';
import RNFS from 'react-native-fs'

import Papa from 'papaparse';

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: 400,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

const App = () => {
    const [csv, setCSV] = useState({});

    const handleOpenFile = () => {
        RNFileSelector.Show({
            path: Platform.OS == 'android' ? RNFS.DownloadDirectoryPath : MainBundlePath,
            title: 'Select CSV File',
            closeMenu: true,
            editable: true,
            onDone: (path) => {
              console.log('file selected: ' + path)
            },
            onCancel: () => {
              console.log('cancelled')
            }
        });
    }

    const parseCSV = () => {
        setCSV(() => Papa.parse('./temp/data.csv'));
    }

    useEffect(() => {
        parseCSV();
    }, []);

    console.log(csv);

    return (
        <View>
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialregion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}>
                    <Heatmap
                        points={[
                            { latitude: 37.782, longitude: -122.447, weight: Math.random() },
                            { latitude: 37.782, longitude: -122.445, weight: Math.random() },
                            { latitude: 37.782, longitude: -122.443, weight: Math.random() },
                            { latitude: 37.782, longitude: -122.441, weight: Math.random() },
                            { latitude: 37.782, longitude: -122.439, weight: Math.random() },
                            { latitude: 37.782, longitude: -122.437, weight: Math.random() },
                            { latitude: 37.782, longitude: -122.435, weight: Math.random() },
                            { latitude: 37.785, longitude: -122.447, weight: Math.random() },
                            { latitude: 37.785, longitude: -122.445, weight: Math.random() },
                            { latitude: 37.785, longitude: -122.443, weight: Math.random() },
                            { latitude: 37.785, longitude: -122.441, weight: Math.random() },
                            { latitude: 37.785, longitude: -122.439, weight: Math.random() },
                            { latitude: 37.785, longitude: -122.437, weight: Math.random() },
                            { latitude: 37.785, longitude: -122.435, weight: Math.random() },
                        ]}
                    />
                </MapView>
            </View>
            <View>
                <TouchableOpacity
                    onPress={handleOpenFile}
                >
                    <Text>Open File</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default App;
