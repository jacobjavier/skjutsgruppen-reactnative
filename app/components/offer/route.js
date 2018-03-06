import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import PropTypes from 'prop-types';
import { RoundedButton } from '@components/common';
import PlaceInput from '@components/search/place/placeInput';
import Colors from '@theme/colors';
import Radio from '@components/add/radio';
import SectionLabel from '@components/add/sectionLabel';
import _pullAt from 'lodash/pullAt';

import DragIcon from '@assets/icons/ic_drag.png';
import AddIcon from '@assets/icons/ic_add_pink.png';
import CrossIcon from '@assets/icons/ic_cross_pink.png';

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: '5%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.pink,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  stops: {
    paddingHorizontal: 4,
    marginBottom: 24,
  },
  stop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  index: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 56,
    zIndex: 2,
  },
  indexText: {
    color: Colors.text.pink,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconWrapper: {
    height: 60,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  icon: {
    maxWidth: '100%',
    resizeMode: 'contain',
  },
  addStopWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  addStop: {
    flex: 1,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.fullWhite,
    borderBottomWidth: 1,
    borderColor: Colors.border.lightGray,
  },
  addStopIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginLeft: 15,
    marginRight: 23,
  },
  returnSection: {
    paddingTop: 24,
  },
  returnInfo: {
    lineHeight: 24,
    marginBottom: 8,
    marginHorizontal: 20,
    color: Colors.text.gray,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: '5%',
  },
  button: {
    width: 200,
    alignSelf: 'center',
    marginTop: '10%',
    marginBottom: 50,
    marginHorizontal: 20,
  },
});

class Route extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      start: {
        name: '',
        countryCode: '',
        coordinates: [],
      },
      end: {
        name: '',
        countryCode: '',
        coordinates: [],
      },
      stops: [{
        name: '',
        countryCode: '',
        coordinates: [],
      }],
      stopsCount: 1,
      isReturning: true,
      hideReturnTripOption: false,
      currentLocationSelected: '',
    };
  }

  componentWillMount() {
    const { defaultValue, hideReturnTripOption } = this.props;
    const { start, end, currentLocationSelected = '', isReturning } = defaultValue;

    let { stops } = defaultValue;
    let stopsCount = stops.length;

    if (stopsCount === 0) {
      stopsCount = 1;
      stops = this.state.stops;
    }

    this.setState({
      start,
      end,
      stops,
      stopsCount,
      currentLocationSelected,
      hideReturnTripOption,
      isReturning,
    });
  }

  onNext = () => {
    const { onNext } = this.props;
    const state = this.state;
    let stops = [];

    if (state.stops.length > 0) {
      stops = state.stops.filter(k => k.coordinates && k.coordinates.length);
    }

    const value = { ...state, ...{ stops } };
    onNext(value);
  };

  onChangeText = (i, { place }) => {
    this.setStops(i, place, this.state.stopsCount);
  };

  setEndPlace = ({ place, source }) => {
    let { currentLocationSelected } = this.state;

    if (source === 'currentLocation') {
      currentLocationSelected = 'end';
    } else if (currentLocationSelected === 'end' && source !== 'currentLocation') {
      currentLocationSelected = '';
    }

    currentLocationSelected = source === 'currentLocation' ? 'end' : currentLocationSelected;
    this.setState({ end: place, currentLocationSelected });
  }

  setStartPlace = ({ place, source }) => {
    let { currentLocationSelected } = this.state;
    currentLocationSelected = source === 'currentLocation' ? 'start' : currentLocationSelected;
    this.setState({ start: place, currentLocationSelected });
  }

  setStops = (count, stop, stopsCount) => {
    const { stops } = this.state;
    stops[count] = stop;
    this.setState({ stops, stopsCount });
  };

  handleReturnChange = (isReturning) => {
    this.setState({ isReturning });
  };

  removeStop = (key) => {
    const { stops, stopsCount } = this.state;
    _pullAt(stops, key);
    this.setState({ stops, stopsCount: stopsCount - 1 });
  }

  addStops = () => {
    let { stopsCount } = this.state;
    stopsCount = isNaN(stopsCount) ? 0 : stopsCount;
    this.setStops(stopsCount, {}, stopsCount + 1);
  };

  currentLocation = (type) => {
    const { currentLocationSelected } = this.state;
    return (type === currentLocationSelected || currentLocationSelected === '');
  }

  renderStops() {
    const { stops } = this.state;
    let j = 0;

    return stops.map((place, i) => {
      j += 1;
      return (
        <View key={j} style={styles.stop}>
          <View style={styles.iconWrapper}>
            <Image source={DragIcon} style={[styles.icon, styles.drag]} />
          </View>
          <View style={styles.index}>
            <Text style={styles.indexText}>{j}</Text>
          </View>
          <PlaceInput
            placeholder="Place"
            currentLocation={false}
            height={60}
            defaultValue={place}
            inputStyle={{ paddingLeft: 68 }}
            label="Stop"
            onChangeText={(stop) => { this.onChangeText(i, stop); }}
          />
          <TouchableOpacity
            onPress={() => this.removeStop(i)}
            style={[styles.iconWrapper, styles.remove]}
          >
            <Image source={CrossIcon} />
          </TouchableOpacity>
        </View>
      );
    });
  }
  render() {
    const { isOffer } = this.props;
    const { start, end, isReturning, hideReturnTripOption } = this.state;

    return (
      <View style={styles.wrapper}>
        <SectionLabel label="From" color={isOffer ? Colors.text.pink : Colors.text.blue} />
        <PlaceInput
          placeholder="Start here"
          label="From"
          inputStyle={{ paddingLeft: 20 }}
          currentLocation={this.currentLocation('start')}
          defaultValue={start}
          onChangeText={this.setStartPlace}
        />
        {
          isOffer &&
          <View>
            <SectionLabel label="Stops In" color={isOffer ? Colors.text.pink : Colors.text.blue} />
            <View style={styles.stops}>
              {this.renderStops()}
              <View style={styles.addStopWrapper}>
                <View style={styles.iconWrapper} />
                <TouchableHighlight onPress={this.addStops} style={{ flex: 1 }}>
                  <View style={styles.addStop}>
                    <Image source={AddIcon} style={styles.addStopIcon} />
                    <Text>Add stop</Text>
                  </View>
                </TouchableHighlight>
                <View style={styles.iconWrapper} />
              </View>
            </View>
          </View>
        }
        <SectionLabel label="To" color={isOffer ? Colors.text.pink : Colors.text.blue} />
        <PlaceInput
          placeholder="Destination"
          label="To"
          inputStyle={{ paddingLeft: 20 }}
          currentLocation={this.currentLocation('end')}
          defaultValue={end}
          onChangeText={this.setEndPlace}
        />
        {!hideReturnTripOption &&
          <View style={styles.returnSection}>
            <SectionLabel label="Are you making a return ride?" color={isOffer ? Colors.text.pink : Colors.text.blue} />
            <View style={styles.radioRow}>
              <Radio
                active={isReturning}
                label="Yes"
                onPress={() => this.handleReturnChange(true)}
                color={isOffer ? 'pink' : 'blue'}
              />
              <Radio
                active={!isReturning}
                label="No"
                onPress={() => this.handleReturnChange(false)}
                color={isOffer ? 'pink' : 'blue'}
              />
            </View>
            <Text style={styles.returnInfo}>
              If yes you will get to make a new card after you
              are done filling in this one.
            </Text>
          </View>
        }
        <RoundedButton
          onPress={this.onNext}
          bgColor={Colors.background.pink}
          style={styles.button}
        >
          Next
        </RoundedButton>
      </View>
    );
  }
}

Route.propTypes = {
  onNext: PropTypes.func.isRequired,
  defaultValue: PropTypes.shape({
    start: PropTypes.shape({
      name: PropTypes.string,
      countryCode: PropTypes.string,
      coordinates: PropTypes.array,
    }).isRequired,
    end: PropTypes.shape({
      name: PropTypes.string,
      countryCode: PropTypes.string,
      coordinates: PropTypes.array,
    }).isRequired,
    stops: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        countryCode: PropTypes.string,
        coordinates: PropTypes.array,
      })),
  }).isRequired,
  hideReturnTripOption: PropTypes.bool.isRequired,
  isOffer: PropTypes.bool,
};

Route.defaultProps = {
  isOffer: false,
};

export default Route;