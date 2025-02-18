import {FlatList, View} from 'react-native';
import {useStyles} from '../../../hooks';
import {TokenTxInterface} from '../../../types/keys';
import {AddressComponent} from '../../AddressComponent';
import Loading from '../../Loading';
import {Text} from '../../Text';
import stylesheet from './styles';

export type TokenTxProps = {
  loading: boolean;
  tx?: TokenTxInterface[];
};

export const TokenTx: React.FC<TokenTxProps> = ({tx, loading}) => {
  const styles = useStyles(stylesheet);

  if (loading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={tx}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <View style={styles.container}>
          <View style={styles.txRow}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Memecoin Address</Text>
              <View style={styles.addressContainer}>
                <AddressComponent address={item.memecoin_address} />
              </View>
            </View>

            <View style={styles.rowItem}>
              <Text style={styles.label}>Owner Address</Text>
              <View style={styles.addressContainer}>
                <AddressComponent address={item.owner_address} />
              </View>
            </View>

            <View style={styles.rowItem}>
              <Text style={styles.label}>Transaction Type</Text>
              <View style={styles.txType}>
                <Text style={styles.txTypeText}>{item.transaction_type}</Text>
              </View>
            </View>

            <View style={styles.rowItem}>
              <Text style={styles.label}>Amount</Text>
              <Text style={styles.value}>{item.amount}</Text>
            </View>
          </View>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No transactions available</Text>
        </View>
      }
    />
  );
};
