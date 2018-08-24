import React from "react";
import { Platform, StyleSheet, Text, View, Image, WebView, Button } from "react-native";
import {  Constants, Location, Permissions , MapView } from "expo";
import { UrlTile, LocalTile } from 'react-native-maps';
import  { createStackNavigator } from 'react-navigation';

export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
    });
};

const defaultRegion = {
  latitude: 50.18154571314337,
  longitude:-125.05610634556518,
  latitudeDelta: 0.6,
  longitudeDelta: 0.6,
}


class MapScreen extends React.Component {
	
    constructor(props) {
      super(props);
      this.state = {
        region: defaultRegion,
      isLoading: true,
      markers: [],
	  location: null,
      errorMessage: null,
      };
    }
  
  
  render() {
    return (
	
	<View         style={{
          flex: 1 
        }}>

      <MapView
        style={{
          flex: 1 
        }}
        initialRegion={defaultRegion}
		//mapType={Platform.OS == "android" ? "none" : "standard"}
		mapType={"terrain"}
		
		showsUserLocation={true} 
		showsPointsOfInterest={false}
      >

		
	  <UrlTile
	   /**
	   * The url template of the tile server. The patterns {x} {y} {z} will be replaced at runtime
	   * For example, http://c.tile.openstreetmap.org/{z}/{x}/{y}.png
	   	   */
		urlTemplate={'http://192.168.1.73:8081/images/{z}/{x}/{y}.png'}

		/**
		 * The maximum zoom level for this tile overlay. Corresponds to the maximumZ setting in
		 * MKTileOverlay. iOS only.
		 */
		maximumZ={19}
	  />
	  
	  	
	{
	  this.state.isLoading ? null : this.state.markers.map((marker, index) => {
        const coords = {
         latitude: parseFloat(marker.latitude),
         longitude: parseFloat(marker.longitude),
        };

		const metadata = `Status: ${marker.title}`;
	 

		//TODO callout image works only with WebView, not with local image source https://github.com/react-community/react-native-maps/issues/1870
		// Adapt for portrait photos
		return (
          <MapView.Marker
            key={index}
            coordinate={coords}
            title={marker.tags}
			image={require('./measle_blue.png')}
            description={metadata}
			 onCalloutPress={() => console.log('Clicked')}
			  onPress={() => this.props.navigation.navigate('Second', {imageLink: marker.media.m, title: marker.title})}
          >
		  
		  </MapView.Marker>
		);
	  })
  }
  </MapView> 
  
  
  
  </View>

    );
  }
  
    
  
  fetchMarkerData() { 
	const flickrUri = encodeURIComponent('https://api.flickr.com/services/feeds/geo/?id=156388485@N08&lang=en-us&format=json&georss=true&tagmode=any&tags=plants');
    fetch('https://e3oy6adsxc.execute-api.eu-central-1.amazonaws.com/prod/JSONPProxyCall?url=' + flickrUri)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ 
          isLoading: false,
          markers: responseJson.items, 
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
    componentDidMount() {
		this.fetchMarkerData();
		/*
      return getCurrentLocation().then(position => {
        if (position) {
          this.setState({
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.003,
              longitudeDelta: 0.003,
            },
          });
        }
      });
	  */
    } 
}


class SecondActivity extends React.Component
{
	static navigationOptions = ({ navigation }) => {
  const {state} = navigation;
  return {
    title: `${state.params.title}`,
  };
};

	

 
render() {
	
	const { navigation } = this.props;
	const link = navigation.getParam('imageLink', './test.jpg');
	const stringLink = JSON.stringify(link).replace(/"/g,"");
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

    <Image
      style={{width: 240, height: 180}}
      source={{uri: stringLink}}
    />

      </View>
    );
  }
}

export default createStackNavigator({
  Home: {
    screen: MapScreen
  },
  Second: { screen: SecondActivity }
  
});


 