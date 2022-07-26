import { FC, SetStateAction, useEffect, useState } from 'react'
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Badge } from 'react-native-paper'
import Constants from 'expo-constants'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import AppBar from '../components/AppBar'
import { getToken } from '../utils/getFromStorage'
import { getRestaurantItems } from '../services/restaurant'
import { Colors } from '../config/theme'
import { RootStackParams } from '../components/Routes'
import Button from '../components/common/Button'
import { RFPercentage } from 'react-native-responsive-fontsize'
import ItemSelectModal from '../components/itemSelectModal'

interface CurrentItems {
  __v: number
  _id: string
  name: string
  price: number
  restId: string
  selected: boolean
  quantity: number
}

type Props = NativeStackScreenProps<RootStackParams, 'Home'>

const SelectItems: FC<Props> = (props: Props) => {
  const [currentItems, setCurrentItems] = useState<CurrentItems[]>([])
  const [showSelectItemModal, setShowSelectItemModal] = useState(false)
  const [restId, setRestId] = useState()

  useEffect(() => {
    setRestId(props.route.params.rest_id)
  }, [])

  const ItemComponent = (item: CurrentItems) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemWrapper}>
        <Text style={styles.itemLabel}>{item.name}</Text>
        <Text style={styles.itemLabel}>{item.price} pkr</Text>
        <View style={styles.quantityWrapper}>
          <Button
            name='-'
            fontSize={RFPercentage(3.3)}
            width={RFPercentage(4)}
            height={RFPercentage(4)}
            backgroundColor={Colors.danger}
          />
          <Text style={styles.quantity}>1</Text>
          <Button
            name='+'
            width={RFPercentage(4)}
            height={RFPercentage(4)}
            backgroundColor={Colors.primary}
          />
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} />
      <AppBar navigation={props.navigation} title='Name' />
      <ItemSelectModal
        show={showSelectItemModal}
        restId={restId || ''}
        setShowItemModal={setShowSelectItemModal}
        selectItems={setCurrentItems}
      />
      <View style={styles.headingContainer}>
        <View style={styles.restHeadingWrap}>
          <Text style={styles.restHeading}>Select Items</Text>
          <View style={styles.headingIconContainer}>
            <TouchableOpacity
              onPress={() => setShowSelectItemModal(true)}
              activeOpacity={0.7}
              style={styles.itemAddIcon}
            >
              <Badge
                size={18}
                style={{
                  position: 'absolute',
                  top: -10,
                  right: -5,
                  backgroundColor: Colors.primary
                }}
              >
                {currentItems.length}
              </Badge>
              <MaterialCommunityIcons name='food' color={Colors.primary} size={RFPercentage(3.5)} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={[styles.itemContainer, styles.itemHeadingContainer]}>
        <View style={styles.itemWrapper}>
          <Text style={styles.itemLabelTitle}>Name</Text>
          <Text style={styles.itemLabelTitle}>Price</Text>
          <View style={styles.quantityWrapper}>
            <Text style={styles.itemLabelTitle}>Quantity</Text>
          </View>
        </View>
      </View>

      {currentItems.length !== 0 ? (
        <FlatList
          data={currentItems}
          keyExtractor={item => item._id}
          renderItem={({ item }) => ItemComponent(item)}
        />
      ) : (
        <View style={styles.itemNot}>
          <Text style={styles.itemNotDesc}>No Item Selected!</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    backgroundColor: Colors.white
  },

  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
    justifyContent: 'space-around'
  },

  itemContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: RFPercentage(1.5)
  },

  itemHeadingContainer: {
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 0.5
  },

  itemWrapper: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 0.5,
    padding: RFPercentage(2)
  },

  quantity: {
    fontSize: RFPercentage(2.2)
  },

  restHeadingWrap: {
    flexDirection: 'row',
    width: '100%',
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    backgroundColor: Colors.white,
    padding: RFPercentage(2)
  },

  restHeading: {
    width: '50%',
    fontSize: RFPercentage(3),
    alignSelf: 'flex-start',
    marginTop: RFPercentage(2),
    marginBottom: RFPercentage(2),
    fontWeight: '600',
    color: Colors.secondary
  },

  itemAddIcon: {
    backgroundColor: Colors.white,
    padding: 5,
    borderRadius: 5,
    elevation: 5
  },

  headingIconContainer: {
    flexDirection: 'row'
  },

  headingContainer: {
    width: '100%',
    alignItems: 'center',
    elevation: 2
  },

  itemLabel: {
    fontSize: RFPercentage(2.2)
  },

  itemLabelTitle: {
    fontSize: RFPercentage(2.5),
    fontWeight: '600'
  },

  itemNot: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RFPercentage(5)
  },

  itemNotDesc: {
    fontSize: RFPercentage(3),
    color: Colors.grey
  }
})

export default SelectItems
