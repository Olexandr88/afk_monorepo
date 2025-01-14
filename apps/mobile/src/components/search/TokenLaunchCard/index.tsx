import {NDKEvent, NDKUserProfile} from '@nostr-dev-kit/ndk';
import {useNavigation} from '@react-navigation/native';
import {useAccount} from '@starknet-react/core';
import {useProfile} from 'afk_nostr_sdk';
import * as Clipboard from 'expo-clipboard';
import {ImageSourcePropType, TouchableOpacity, View} from 'react-native';

import {CopyIconStack} from '../../../assets/icons';
import {useStyles, useTheme} from '../../../hooks';
import {useToast} from '../../../hooks/modals';
import {MainStackNavigationProps} from '../../../types';
import {TokenDeployInterface, TokenLaunchInterface} from '../../../types/keys';
import {feltToAddress} from '../../../utils/format';
import {Button} from '../..';
import {Text} from '../../Text';
import stylesheet from './styles';

export type LaunchCoinProps = {
  imageProps?: ImageSourcePropType;
  name?: string;
  event?: NDKEvent;
  profileProps?: NDKUserProfile;
  token?: TokenDeployInterface;
  launch?: TokenLaunchInterface;
  isViewDetailDisabled?: boolean;
};

enum AmountType {
  QUOTE_AMOUNT,
  COIN_AMOUNT_TO_BUY,
}

export const TokenLaunchCard: React.FC<LaunchCoinProps> = ({
  token,
  launch,
  imageProps,
  name,
  profileProps,
  event,
  isViewDetailDisabled,
}) => {
  const {data: profile} = useProfile({publicKey: event?.pubkey});
  const account = useAccount();
  const {showToast} = useToast();
  const {theme} = useTheme();
  const styles = useStyles(stylesheet);
  const navigation = useNavigation<MainStackNavigationProps>();

  const handleCopy = async () => {
    if (!token?.memecoin_address) return;
    await Clipboard.setStringAsync(token?.memecoin_address);
    showToast({type: 'info', title: 'Copied to clipboard'});
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tokenName}>{token?.name || 'Unnamed Token'}</Text>
        <View style={styles.addressContainer}>
          <Text numberOfLines={1} ellipsizeMode="middle" style={{color: '#808080', flex: 1}}>
            {token?.memecoin_address ? feltToAddress(BigInt(token.memecoin_address)) : ''}
          </Text>
          <TouchableOpacity onPress={handleCopy}>
            <CopyIconStack color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.priceTag}>
          <Text style={{color: '#4CAF50'}}>${Number(token?.price || 0).toFixed(4)}</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Supply</Text>
          <Text style={styles.statValue}>{Number(token?.total_supply || 0).toLocaleString()}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Raised</Text>
          <Text style={styles.statValue}>
            {Number(token?.liquidity_raised || 0).toLocaleString()}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Threshold</Text>
          <Text style={styles.statValue}>
            {Number(token?.threshold_liquidity || 0).toLocaleString()}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Network</Text>
          <Text style={styles.statValue}>{token?.network || '-'}</Text>
        </View>
      </View>

      {!isViewDetailDisabled && (
        <Button
          onPress={() => {
            if (token && token?.memecoin_address) {
              navigation.navigate('LaunchDetail', {
                coinAddress: token?.memecoin_address,
              });
            }
          }}
          style={styles.actionButton}
        >
          View details
        </Button>
      )}
    </View>
  );
};
