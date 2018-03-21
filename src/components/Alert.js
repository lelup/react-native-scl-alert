import React from 'react'
import PropTypes from 'prop-types'

import {
  Animated,
  Modal,
  View,
  ViewPropTypes,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'

import {
  AlertHeader,
  AlertTitle,
  AlertSubtitle
} from '../components'

import {
  height
} from '../helpers/dimensions'

import variables from './../config/variables'

class Alert extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    show: PropTypes.bool,
    cancellable: PropTypes.bool,
    onRequestClose: PropTypes.func.isRequired,
    slideAnimationDuration: PropTypes.number,
    overlayStyle: ViewPropTypes.style
  }

  static defaultProps = {
    children: null,
    show: false,
    cancellable: true,
    slideAnimationDuration: 250,
    overlayStyle: {}
  }

  constructor (props) {
    super(props)
    this.state = { show: props.show }
    this.slideAnimation = new Animated.Value(0)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.show !== this.state.show) {
      return this[this.props.show ? 'show' : 'hide']()
    }
  }

  /**
   * @description
   */
  get interpolationTranslate () {
    const move = this.slideAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [height, height / -3.5]
    })

    return [{ translateY: move }]
  }

  /**
   * @description
   */
  show = () => {
    this._runAnimationAsync()
    this.setState({ show: true })
  }

  /**
   * @description
   */
  hide = async () => {
    await this._runAnimationAsync()
    this.setState({ show: false })
  }

  /**
   * @description run slide animation to show action sheet contetn
   * @param { Boolean } show - Show / Hide content
   * @return { Void }
   */
  _runAnimationAsync = () => {
    return new Promise(resolve => {
      const options = {
        toValue: this.state.show ? 0 : 1,
        duration: this.props.slideAnimationDuration,
        animation: variables.translateEasing
      }

      Animated.timing(
        this.slideAnimation,
        options
      ).start(resolve)
    })
  }

  handleOnClose = () => {
    this.props.cancellable && this.props.onRequestClose()
  }

  render () {
    return (
      <Modal
        transparent
        animationType="fade"
        visible={this.state.show}
        onRequestClose={this.props.onRequestClose}
      >
        <View style={styles.inner}>
          <TouchableWithoutFeedback onPress={this.handleOnClose}>
            <View
              style={[
                styles.overlay,
                this.props.overlayStyle
              ]}
            />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.contentContainer,
              { transform: this.interpolationTranslate }
            ]}
          >
            <View style={styles.innerContent}>
              <AlertHeader
                {...this.props}
              />
              <AlertTitle
                {...this.props}
              />
              <AlertSubtitle
                {...this.props}
              />
              <View style={styles.bodyContainer}>
                {this.props.children}
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  inner: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: variables.containerPadding
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: variables.overlayBackgroundColor,
    justifyContent: 'center',
    zIndex: 100
  },
  contentContainer: {
    zIndex: 150,
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerContent: {
    padding: variables.gutter,
    paddingTop: variables.gutter * 4,
    borderRadius: variables.baseBorderRadius,
    backgroundColor: variables.baseBackgroundColor,
    width: variables.contentWidth
  },
  bodyContainer: {
    marginTop: variables.gutter,
    justifyContent: 'flex-end'
  }
})

export default Alert
