// @flow

'use strict';

import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'

import CueColors from './CueColors'

const STATUS_BAR_HEIGHT = 20
const HEADER_HEIGHT = 44 + STATUS_BAR_HEIGHT

/// How the item should be displayed. (Default = text on iOS, icon on Android)
type Display = 'default' | 'icon' | 'text'

type HeaderItem = {
  title?: string,
  icon?: any,
  display?: Display,
  onPress?: () => void
}

type Props = {
  title?: string,
  customTitleComponent?: React.Component,
  leftItem?: HeaderItem,
  rightItems?: Array<HeaderItem>,
  overflowItems?: Array<HeaderItem>,
  containerStyles?: Object
}

let styles = {}

class CueHeader extends React.Component {
  props: Props

  render() {
    const { title, leftItem, rightItems } = this.props;

    if (this.props.customTitleComponent) {
      return (
        <View style={[styles.headerContainer, this.props.containerStyles]}>
          {this.props.customTitleComponent}
        </View>
      )
    } else {
      return (
        <View style={[styles.headerContainer, this.props.containerStyles]}>
          <View style={styles.leftItemContainer}>
            <HeaderItemIOS item={leftItem} />
          </View>
          <View style={styles.titleItemContainer}>
            <Text
              style={styles.titleTextItem}
              numberOfLines={1}>
              {title}
            </Text>
            {this.props.customTitleComponent}
          </View>
          <View style={styles.rightItemContainer}>
            {(rightItems || []).map((item) => <HeaderItemIOS key={item.title} item={item} />)}
          </View>
        </View>
      )
    }
  }
}

class HeaderItemIOS extends React.Component {
  props: {
    item?: HeaderItem
  }

  render() {
    const { item } = this.props
    if (!item) {
      return null
    }

    const { title, icon, display, onPress } = item

    let content
    if (display === 'icon') {
      content = <Image source={icon} />
    } else {
      content = (
        <Text
          style={styles.textItem}
          numberOfLines={1}>
          {title}
        </Text>
      )
    }

    return (
      <TouchableOpacity
        accessibilityLabel={title}
        accessibilityTraits='button'
        style={styles.headerItem}
        onPress={onPress}>
        {content}
      </TouchableOpacity>
    )
  }
}

styles = {
  headerContainer: {
    backgroundColor: CueColors.primaryTint,
    paddingTop: STATUS_BAR_HEIGHT,
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4
  },
  leftItemContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  titleItemContainer: {
    flex: 2,
    alignItems: 'center'
  },
  rightItemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  headerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 6,
  },
  textItem: {
    color: 'white',
    fontSize: 18,
    fontWeight: "400", // regular
    paddingHorizontal: 6,
  },
  titleTextItem: {
    color: 'white',
    fontSize: 18,
    fontWeight: "500", // medium
    letterSpacing: 0.5
  }
}

module.exports = CueHeader
