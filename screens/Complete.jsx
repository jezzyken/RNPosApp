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
        await BLEPrinter.connectPrinter('86:67:7A:CE:B4:A1' || '');
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
      const {change, customerName, paidAmount, saleItems, totalSalesAmount} =
        data;

      const orderList = saleItems.map(item => [
        item.name,
        item.quantity.toString(),
        'Php' + item.price,
      ]);
      const columnAlignment = [
        ColumnAlignment.LEFT,
        ColumnAlignment.CENTER,
        ColumnAlignment.RIGHT,
      ];
      const columnWidth = [30 - (7 + 12), 7, 12];
      BLEPrinter.printText(`Customer: ${customerName}\n`);

      const header = ['Items', 'Qty', 'Price'];

      BLEPrinter.printText(
        `${CENTER}--------------------------------${CENTER}`,
      );
      BLEPrinter.printColumnsText(header, columnWidth, columnAlignment, [
        `${BOLD_ON}`,
      ]);
      BLEPrinter.printText(
        `${CENTER}--------------------------------${CENTER}`,
      );
      for (const order of orderList) {
        BLEPrinter.printColumnsText(order, columnWidth, columnAlignment, [
          `${BOLD_OFF}`,
        ]);
      }
      BLEPrinter.printText('\n');
      BLEPrinter.printText(`Total Sales Amount: Php${totalSalesAmount}\n`);
      BLEPrinter.printText(`Paid Amount: Php${paidAmount}\n`);
      BLEPrinter.printText(`Change: Php${change}\n`);
      BLEPrinter.printBill(`${CENTER}Thank you\n`);
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
      <Text style={styles.amount}>Paid $450</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>View Receipt</Text>
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
