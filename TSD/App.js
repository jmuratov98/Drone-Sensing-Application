/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

import MapView, { Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

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
    button: {
        position: 'absolute',
        left: 400,
    }
});

const MyMap = ({
    points
}) => {
    return (
        <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialregion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            }}
        >
            <Heatmap
                points={points}
            />
        </MapView>
    )
}

const App = () => {
    const [points, setPoints] = useState([{ longitude: 0, latitude: 0 }]);

    const handleOpenFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });

            const split = res.uri.split('/');
            const name = split.pop();
            let str = name.startsWith('raw%3A') ? name.substr(6) : name;
            str = str.split(/%2F/g).join('/');

            parseCSV(str)
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }

    }

    const parseCSV = async (uri) => {
        try {
            const data = await RNFS.readFile(uri, 'utf8');

            Papa.parse(data, {
                // worker: true,
                fastMode: true,
                header: true,
                complete: function (res) {
                    const points = res.data.map(dp => (
                        { longitude: parseLatLong(dp.Longitude), latitude: parseLatLong(dp.Latitude) }
                    ));
                    points.pop();
                    setPoints(points);
                }
            })

        } catch (error) {
            throw error;
        } finally { }

    }

    const convertCoord = (coord) => {
        console.log(coord);
        const indexOfNegative = coord.indexOf('-');
        const [negSign, num] = indexOfNegative ? [coord.substr(0, indexOfNegative), coord.substr(indexOfNegative + 1)] : ['', coord];
        const i = num.length == 9 ? 2 : 3;
        const [leftOfDecimal, rightOfDecimal] = [num.substr(0, i), num.substr(i)];
        console.log([negSign, leftOfDecimal, '.', rightOfDecimal].join(''))
        return [negSign, leftOfDecimal, '.', rightOfDecimal].join('');
    }

    const parseLatLong = (str) => {
        if (!str) return;
        str = str.trim();
        str = convertCoord(str);
        let int = parseFloat(str);
        return int;
    }

    return (
        <View>
            <View style={styles.container}>
                <MyMap
                    points={points}
                />
            </View>
            <View style={styles.button}>
                <TouchableOpacity
                    onPress={() => handleOpenFile()}
                >
                    <Text>Open File</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default App;
