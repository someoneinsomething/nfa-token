const { expect } = require('chai');
const { ethers } = require('hardhat');

const MAX_SUPPLY = '500000000000000000000000000000';

describe('Not Fair Token', () => {
    let provider;
    let notFairContract;

    let owner;
    let user;
    let user2;

    before('setup', async () => {
        provider = ethers.getDefaultProvider('http://localhost:8545');
        const accounts = await ethers.getSigners();

        owner = accounts[0];
        user = accounts[1];
        user2 = accounts[2];

        const NotFairArtifact = await ethers.getContractFactory('NotFairToken');
        notFairContract = await NotFairArtifact.connect(owner).deploy();
        await notFairContract.deployed();
    });

    describe('NFA', () => {
        it('Mint initial supply', async () => {
            const contract = await notFairContract.connect(owner);
            await contract.mint(owner.address);

            const ownerBalance = await contract.balanceOf(owner.address);

            expect((await contract.totalSupply()).toString()).to.equal(MAX_SUPPLY);

            expect(ownerBalance.toString()).to.be.equal(MAX_SUPPLY);
        })

        it('Mint should be reverted with supply exceed error', async () => {
            const contract = await notFairContract.connect(owner);

            await expect(
                contract.mint(owner.address)
            ).to.be.revertedWith('Exceeds maximum supply');

        })

        it('Transfer less than 1% of the supply', async () => {
            const initialUsrBalErc20 = ethers.utils.parseUnits('1000', 18);
            await notFairContract.connect(owner).transfer(user.address, initialUsrBalErc20.toString());

            const lessThanPercent = ethers.utils.parseUnits('1000', 18);
            
            await expect(
                notFairContract.connect(user).transfer(user2.address, lessThanPercent.toString())
            ).to.not.be.revertedWith('Exceeds maximum buy percentage');
        })

        it('Transfer more than 1% of the supply', async () => {
            const initialUsrBalErc20 = ethers.utils.parseUnits('100000000000', 18);
            await notFairContract.connect(owner).transfer(user.address, initialUsrBalErc20.toString());

            const moreThanPercent = ethers.utils.parseUnits('1000000000000', 18);

            await expect(
                notFairContract.connect(user).transfer(user2.address, moreThanPercent.toString())
            ).to.be.revertedWith('Exceeds maximum buy percentage');
        })
    })
})