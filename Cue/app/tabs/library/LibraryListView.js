// @flow

'use strict';

import React from 'react'
import { Navigator, View, Text, Platform, ListView, Dimensions, RefreshControl, StyleSheet } from 'react-native'

import type { Deck, Card } from '../../api/types'

import CueColors from '../../common/CueColors'
import CueIcons from '../../common/CueIcons'
import EmptyView from '../../common/EmptyView'
import ListViewHeader from '../../common/ListViewHeader'

import DeckThumbnail from '../../common/DeckThumbnail'

const styles = {
  list: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    paddingLeft: 16,

    // FAB height (56) + FAB padding (16) - to avoid crashing into FAB
    paddingBottom: Platform.OS === 'android' ? 72 : undefined,
  },
  cardContainer: {
    marginBottom: 16,
    marginRight: 16,
  }
}

const SECTION_PRIVATE = 'Your Decks'
const SECTION_SHARED = 'Shared With You'
const SECTION_PUBLIC = 'Public'

type Props = {
  navigator: Navigator,
  decks: Array<Deck>,
  editing: boolean,
  refreshing: boolean,
  onSwipeToRefresh: () => void,
  onDeleteDeck: (deck: Deck) => void,
}

class LibraryListView extends React.Component {
  props: Props

  state: {
    dataSource: ListView.DataSource,
    deviceOrientation: 'LANDSCAPE' | 'PORTRAIT' | 'UNKNOWN',
  }

  _onLayout = () => {
    const windowDimensions = Dimensions.get('window')
    this.setState({
      ...this.state,
      deviceOrientation: windowDimensions.width > windowDimensions.height ? 'LANDSCAPE' : 'PORTRAIT'
    })
  }

  _categorizeDecks(decks: Array<Deck>) {
    decks = decks.slice().sort((a: Deck, b: Deck) => {
      let left = (a.name || '').toUpperCase()
      let right = (b.name || '').toUpperCase()

      if (left < right) return -1
      if (left > right) return 1
      return 0
    })

    let data = {}
    let addToData = (section, deck) => {
      if (!data[section]) {
        data[section] = []
      }
      data[section].push(deck)
    }

    decks.forEach((deck) => {
      if (deck.accession === 'private') {
        addToData(SECTION_PRIVATE, deck)
      } else if (deck.accession === 'shared') {
        addToData(SECTION_SHARED, deck)
      } else {
        addToData(SECTION_PUBLIC, deck)
      }
    })

    // RN will throw an error if we specify a section header which doesn't
    // have any elements in it, so only add the section headers which should
    // appear.
    let headers = [];
    [SECTION_PRIVATE, SECTION_SHARED, SECTION_PUBLIC].forEach(header => {
      if (data[header]) {
        headers.push(header)
      }
    })

    return { data, headers }
  }

  _getDataSource (decks: Array<Deck>) {
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })
    let { data, headers } = this._categorizeDecks(decks)
    return ds.cloneWithRowsAndSections(data, headers)
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      dataSource: this._getDataSource(props.decks),
      deviceOrientation: 'UNKNOWN'
    }
  }

  componentWillReceiveProps(newProps: Props) {
    this.setState({
      ...this.state,
      dataSource: this._getDataSource(newProps.decks)
    })
  }

  _renderRow = (deck: Deck) => {
    return (
      <View style={styles.cardContainer}>
        <DeckThumbnail
          deck={deck}
          deletable={this.props.editing}
          onPress={() => this.props.navigator.push({deck: deck})}
          onPressDelete={() => this.props.onDeleteDeck(deck)}/>
      </View>
    )
  }

  render() {
    let removeClippedSubviews
    if (Platform.OS === 'ios') {
      removeClippedSubviews = false
    }

    let refreshControl = (
      <RefreshControl
        colors={[CueColors.primaryTint]}
        refreshing={this.props.refreshing}
        onRefresh={this.props.onSwipeToRefresh}
      />
    )

    if (this.state.dataSource.getRowCount() == 0) {
      return (
        <View style={{flex: 1}}>
          <EmptyView
            icon={CueIcons.emptyLibrary}
            titleText={'You don’t have any decks yet.'}
            subtitleText={Platform.OS === 'android'
              ? 'Create one or add one to your Library from Discover in the menu.'
              : 'Create one or add one to your Library from the Discover tab.'} />
          <ListView
            style={StyleSheet.absoluteFill}
            dataSource={this.state.dataSource}
            renderRow={() => {}}
            refreshControl={refreshControl}
            removeClippedSubviews={removeClippedSubviews} />
        </View>
      )
    }

    return (
      <ListView
        key={this.state.deviceOrientation}
        onLayout={this._onLayout}
        automaticallyAdjustContentInsets={false}
        contentInset={{bottom: 49}}
        contentContainerStyle={styles.list}
        dataSource={this.state.dataSource}
        initialListSize={8}
        pageSize={2}
        refreshControl={refreshControl}
        renderSectionHeader={(decks, category) => <ListViewHeader style={{marginLeft: -16}} section={category} />}
        renderRow={this._renderRow}
        removeClippedSubviews={removeClippedSubviews} />
      )
  }
};

module.exports = LibraryListView;
