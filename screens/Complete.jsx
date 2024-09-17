import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  BLEPrinter,
  ColumnAlignment,
  COMMANDS,
} from 'react-native-thermal-receipt-printer-image-qr';
import {useNavigation} from '@react-navigation/native';

const Complete = ({route}) => {
  const {data} = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    handleConnectSelectedPrinter();

    const unsubscribe = navigation.addListener('beforeRemove', e => {
      e.preventDefault();
    });

    return unsubscribe;
  }, []);

  const handleConnectSelectedPrinter = async () => {
    await BLEPrinter.init();
    const connect = async () => {
      try {
        await BLEPrinter.connectPrinter('86:67:7A:60:CE:C7' || '');
        await handlePrint();
      } catch (err) {
        console.warn(err);
      }
    };
    connect();
  };

  const handlePrint = async () => {
    try {
      const BOLD_ON = COMMANDS.TEXT_FORMAT.TXT_BOLD_ON;
      const BOLD_OFF = COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF;
      const CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT;
      const SMALL_FONT = COMMANDS.TEXT_FORMAT.TXT_SIZE_SMALL;
      const {change, customer, amountReceived, stocks, salesTotal} = data;

      const header = ['Items', 'Qty', 'Price'];
      const columnAlignment = [
        ColumnAlignment.LEFT,
        ColumnAlignment.CENTER,
        ColumnAlignment.RIGHT,
      ];
      const columnWidth = [30 - (7 + 12), 7, 12];

      const orderList = stocks.map(item => [
        item.variant
          ? `${item.name || 'Unknown item'} (${
              item.variantName || 'Unknown variant'
            })`
          : item.name || 'Unknown item',
        item.quantity?.toString() || '0',
        'P' + (item.price || 0), 
        'P' + (item.price || 0) * (item.quantity || 0), 
      ]);

      await BLEPrinter.printText(`Customer: ${customer}\n`);

      await BLEPrinter.printColumnsText(header, columnWidth, columnAlignment, [
        `${BOLD_ON}`,
      ]);

      await BLEPrinter.printText(
        `${CENTER}--------------------------------${CENTER}\n`,
      );

      for (const order of orderList) {
        await BLEPrinter.printColumnsText(order, columnWidth, columnAlignment, [
          `${BOLD_OFF}`,
        ]);
      }

      await BLEPrinter.printText('\n');
      await BLEPrinter.printText(`Total Sales Amount: P${salesTotal}\n`);
      await BLEPrinter.printText(`Paid Amount: Php${amountReceived}\n`);
      await BLEPrinter.printText(`Change: Php${change}\n`);
      await BLEPrinter.printBill(`${CENTER}Thank you\n`);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.checkmark}>✔️</Text>
      </View>
      <Text style={styles.title}>ORDER COMPLETED!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Back to Main</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  iconContainer: {
    backgroundColor: '#2ECC71',
    borderRadius: 50,
    padding: 20,
    marginBottom: 20,
  },
  checkmark: {
    fontSize: 40,
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  amount: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Complete;
