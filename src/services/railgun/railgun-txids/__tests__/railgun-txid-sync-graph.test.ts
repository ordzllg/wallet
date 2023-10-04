import { Chain, RailgunTransaction } from '@railgun-community/engine';
import { NetworkName, NETWORK_CONFIG } from '@railgun-community/shared-models';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {
  getRailgunTxidsForUnshields,
  quickSyncRailgunTransactions,
} from '../railgun-txid-sync-graph';

chai.use(chaiAsPromised);
const { expect } = chai;

const ETH_CHAIN: Chain = NETWORK_CONFIG[NetworkName.Ethereum].chain;

const ETH_GOERLI_CHAIN: Chain =
  NETWORK_CONFIG[NetworkName.EthereumGoerli].chain;

describe('railgun-txid-sync-graph', () => {
  before(() => {
    NETWORK_CONFIG[NetworkName.Ethereum].poi = { launchBlock: 1000 };
  });

  it('Should pull railgun txs subgraph query - Ethereum', async () => {
    const railgunTxs: RailgunTransaction[] = await quickSyncRailgunTransactions(
      ETH_CHAIN,
      undefined,
    );

    expect(railgunTxs).to.be.an('array');
    expect(railgunTxs.length).to.equal(5000);

    expect(railgunTxs[0].commitments).to.deep.equal([
      '0x1afd01a29faf22dcc5678694092a08d38de99fc97d07b9281fa66f956ce43579',
      '0x2ffc716d8ae767995961bbde4a208dbae438783065bbd200f51a8d4e97cc2289',
      '0x078f9824c86b2488714eb76dc15199c3fa21903517d5f3e19ab2035d264400b6',
    ]);
    expect(railgunTxs[0].nullifiers).to.deep.equal([
      '0x1e52cee52f67c37a468458671cddde6b56390dcbdc4cf3b770badc0e78d66401',
      '0x0ac9f5ab5bcb5a115a3efdd0475f6c22dc6a6841caf35a52ecf86a802bfce8ee',
    ]);
    expect(railgunTxs[0].graphID).to.equal(
      '0x0000000000000000000000000000000000000000000000000000000000e1285000000000000000000000000000000000000000000000000000000000000001500000000000000000000000000000000000000000000000000000000000000000',
    );
    expect(railgunTxs[0].boundParamsHash).to.equal(
      '0x2c72a0bcce4f1169dd988204775483938ded5f5899cec84829b1cc667a683784',
    );
    expect(railgunTxs[0].utxoTreeIn).to.equal(0);
    expect(railgunTxs[0].utxoTreeOut).to.equal(0);
    expect(railgunTxs[0].utxoBatchStartPositionOut).to.equal(2);
    expect(railgunTxs[0].hasUnshield).to.equal(false);
    expect(railgunTxs[0].blockNumber).to.equal(14755920);
    expect(railgunTxs[0].unshieldTokenHash).to.equal(undefined);
  }).timeout(20000);

  it('Should pull unshield railgun txids - Ethereum', async () => {
    const unshieldRailgunTxids: string[] = await getRailgunTxidsForUnshields(
      ETH_CHAIN,
      '0x0b3b7179df1377c0a13058508e7dff2dbe8f73c39d68f569bc90b1c8b277082e',
    );

    expect(unshieldRailgunTxids).to.deep.equal([
      '065bcb1a9d4cfa110f05b480f79f27fe2ad672868d3d1bdec05df2ddaec8333d',
    ]);
  }).timeout(20000);

  it('Should pull railgun txs subgraph query - Goerli', async () => {
    const railgunTxs: RailgunTransaction[] = await quickSyncRailgunTransactions(
      ETH_GOERLI_CHAIN,
      undefined,
    );

    expect(railgunTxs).to.be.an('array');
    expect(railgunTxs.length).to.be.greaterThan(1000);

    expect(railgunTxs[0].commitments).to.deep.equal([
      '0x0f6104cf7b8f304e8a5fe224f3c291dedc7ff7f0865edb154171bcfa0d299e67',
      '0x165bf0d1cc1061ee5efa4037fbb9217e70f2c681f4b0d013adbcb115722709e2',
      '0x285a55d56266817bbf781452979e472a5fcca7fc5bb4582a33e4a7572b6f3e46',
    ]);
    expect(railgunTxs[0].nullifiers).to.deep.equal([
      '0x1e52cee52f67c37a468458671cddde6b56390dcbdc4cf3b770badc0e78d66401',
    ]);
    expect(railgunTxs[0].graphID).to.equal(
      '0x0000000000000000000000000000000000000000000000000000000000776be700000000000000000000000000000000000000000000000000000000000000290000000000000000000000000000000000000000000000000000000000000000',
    );
    expect(railgunTxs[0].boundParamsHash).to.equal(
      '0x0241df5c3ddca93c4bc340a10f628c7dff4acb0657469836836a2e824a4a000b',
    );
    expect(railgunTxs[0].utxoTreeIn).to.equal(0);
    expect(railgunTxs[0].utxoTreeOut).to.equal(0);
    expect(railgunTxs[0].utxoBatchStartPositionOut).to.equal(2);
    expect(railgunTxs[0].hasUnshield).to.equal(false);
    expect(railgunTxs[0].blockNumber).to.equal(7826407);
    expect(railgunTxs[0].unshieldTokenHash).to.equal(undefined);

    // Test transaction with unshield
    expect(railgunTxs[2].hasUnshield).to.equal(true);
    expect(railgunTxs[2].unshieldTokenHash).to.equal(
      '000000000000000000000000b4fbf271143f4fbf7b91a5ded31805e42b2208d6',
    );
  }).timeout(20000);

  it('Should pull unshield railgun txids - Goerli', async () => {
    const unshieldRailgunTxids: string[] = await getRailgunTxidsForUnshields(
      ETH_GOERLI_CHAIN,
      '0x3f0648eec7be61c7154013f5ecdf01cec48f0b0161f235b240c0f1ae94c3bbc1',
    );

    expect(unshieldRailgunTxids).to.deep.equal([
      '08fd7312f96ac8b36f2544a0acaeba0ed0ea57eb5bde0452a240c7a0f3640ae3',
    ]);
  }).timeout(20000);
});
