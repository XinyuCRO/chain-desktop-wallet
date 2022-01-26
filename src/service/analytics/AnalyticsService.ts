/* eslint-disable @typescript-eslint/no-unused-vars */
import { Session } from '../../models/Session';
import { isRunningInElectron } from '../../utils/env';

let actionEvent = (..._: any[]) => {};
let transactionEvent = (..._: any[]) => {};
let pageView = (..._: any[]) => ({ send: () => {} });

if (isRunningInElectron()) {
  const electron = window.require('electron');

  // Load all analytics functions from the main electron process
  transactionEvent = electron.remote.getGlobal('transactionEvent');
  actionEvent = electron.remote.getGlobal('actionEvent');
  pageView = electron.remote.getGlobal('pageView');
}

export enum AnalyticsTxType {
  TransferTransaction = 'TransferTransaction',
  StakingTransaction = 'StakingTransaction',
  NftTransaction = 'NftTransaction',
  BridgeTransaction = 'BridgeTransaction',
}

export enum AnalyticsActions {
  FundsTransfer = 'FundsTransfer',
  FundsStaked = 'FundsStaked',
  NftTransfer = 'NftTransfer',
  NftIssue = 'NftIssue',
  NftMint = 'NftMint',
  BridgeTransfer = 'BridgeTransfer',
}

export enum AnalyticsCategory {
  Transfer = 'Transfer',
  Delegate = 'Delegate',
  PageView = 'PageView',
  Voting = 'Voting',
  Nft = 'Nft',
  Bridge = 'Bridge',
}

export class AnalyticsService {
  private readonly currentSession: Session;

  public constructor(session: Session) {
    this.currentSession = session;
  }

  // eslint-disable-next-line class-methods-use-this
  public logTransactionEvent(
    txHash: string,
    txAmount: string,
    analyticsTxType: AnalyticsTxType,
    analyticsAction: AnalyticsActions,
    analyticsCategory: AnalyticsCategory,
  ) {
    if (this.currentSession.wallet.config.analyticsDisabled) {
      // DONT RECORD WHEN ANALYTICS IS DISABLED
      return;
    }

    try {
      actionEvent(
        analyticsTxType.toString(),
        analyticsCategory.toString(),
        analyticsAction.toString(),
        txAmount,
      );

      transactionEvent(txHash, txAmount, analyticsTxType.toString());
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Error logging event', e);
    }
  }

  public logPage(pageName: string) {
    try {
      if (this.currentSession.wallet.config.analyticsDisabled) {
        // DONT RECORD WHEN ANALYTICS IS DISABLED
        return;
      }

      pageView(pageName).send();
    } catch (e) {
      // Ignore
    }
  }
}
