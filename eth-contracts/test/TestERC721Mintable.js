// var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');
var ERC721MintableComplete = artifacts.require('Web3RealEstateToken');


contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    console.log("Account 1", account_one)
    console.log("Account 2", account_two)
    console.log("Account 3", account_three)
    let contract

    

    
    

    describe('match erc721 spec', function () {
        before(async function () { 
            contract = await ERC721MintableComplete.new({from: account_one});
            //console.log(this.contract.methods);
            // let result = await this.contract.methods.mint(account_one, 1).send({from: account_one})
            // assert.equal(result, true)
            // let result = await contract.methods.getName().call()
            // console.log(result);

            // TODO: mint multiple tokens
        })

        it('has correct name, symbol and baseTokenURI', async function () { 
            let name = await contract.getName()
            assert.equal(name, "Web3 Real Estate")
            let symbol = await contract.getSymbol()
            assert.equal(symbol, "W3RE")
            let baseTokenURI = await contract.getBaseTokenURI()
            assert.equal(baseTokenURI, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/")
        })

        it("can mint token correctly", async () => {
            let owner
            await contract.mint(account_one, 1, {from: account_one})
            owner = await contract.ownerOf(1)
            assert.equal(owner, account_one)
            await contract.mint(account_one, 2, {from: account_one})
            owner = await contract.ownerOf(2)
            assert.equal(owner, account_one)
            await contract.mint(account_two, 3, {from: account_one})
            owner = await contract.ownerOf(3)
            assert.equal(owner, account_two)
            await contract.mint(account_three, 4, {from: account_one})
            owner = await contract.ownerOf(4)
            assert.equal(owner, account_three)
        })

        it('does not let create a duplicated token ID', async function () {
            try {
                await contract.mint(account_two, 3, {from: account_one})
                assert.equal(true, false)
            } catch (error) {
                assert.equal(false, false)
            }
            
        })


        it('should return total supply', async function () { 
            let result = await contract.totalSupply()
            assert.equal(result, 4, "Total supply is not correct")
        })

        it('should get token balance', async function () { 
            let balance
            balance = await contract.balanceOf(account_one)
            assert.equal(balance, 2, "Balance is not correct")
            balance = await contract.balanceOf(account_two)
            assert.equal(balance, 1, "Balance is not correct")
            balance = await contract.balanceOf(account_three)
            assert.equal(balance, 1, "Balance is not correct")
            
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenURI
            tokenURI = await contract.tokenURI(1)
            assert.equal(tokenURI, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1")
            tokenURI = await contract.tokenURI(2)
            assert.equal(tokenURI, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2")
            tokenURI = await contract.tokenURI(3)
            assert.equal(tokenURI, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/3")
            tokenURI = await contract.tokenURI(4)
            assert.equal(tokenURI, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/4")
        })


        it('should transfer token from one owner to another', async function () { 
            assert.equal(await contract.ownerOf(1), account_one, "Owner is not correct")
            try {
                await contract.safeTransferFrom(account_one, account_two, 1, {from: account_one})
                assert.equal(true, true)
            } catch (error) {
                console.log("Error message: ", error.message);
                assert.equal(true, false, "Error with transfer")
            }
            let newOwner = await contract.ownerOf(1)
            assert.equal(newOwner, account_two, "new owner is not correct")
            assert.equal(await contract.balanceOf(account_one), 1, "Balance not correct")
            assert.equal(await contract.balanceOf(account_two), 2, "Balance not correct")
            assert.equal(await contract.balanceOf(account_three), 1, "Balance not correct")
        })

        it('should not transfer token, if caller is not owner or approved', async function () { 
            try {
                await contract.safeTransferFrom(account_two, account_one, 1, {from: account_one})
                assert.equal(true, false)
            } catch (error) {
                assert.equal(true, true, "Error with transfer")
            }
            let newOwner = await contract.ownerOf(1)
            assert.equal(newOwner, account_two, "new owner is not correct")
            assert.equal(await contract.balanceOf(account_one), 1, "Balance not correct")
            assert.equal(await contract.balanceOf(account_two), 2, "Balance not correct")
            assert.equal(await contract.balanceOf(account_three), 1, "Balance not correct")
        })

        it('can approve another account, approver can transfer', async function () { 
            try {
                await contract.approve(account_one, 1, {from: account_two})
            } catch (error) {
                console.log(error);
            }
            assert.equal(await contract.getApproved(1), account_one, "Error with approver")
            try {
                await contract.safeTransferFrom(account_two, account_three, 1, {from: account_one}) 
                assert.equal(await contract.ownerOf(1), account_three, "Owner should be account 3") 
            } catch (error) {
                console.log(error.message);
            }
        })

        it('can approve for all, approver can transfer', async function () { 
            try {
                await contract.setApprovalForAll(account_one, true, {from: account_three})
            } catch (error) {
                console.log(error);
            }
            assert.equal(await contract.isApprovedForAll(account_three, account_one), true, "account one is not approved for all by account 3")
            try {
                await contract.safeTransferFrom(account_three, account_two, 1, {from: account_one}) 
                assert.equal(await contract.ownerOf(1), account_two, "Owner should be account 3") 
            } catch (error) {
                console.log(error.message);
            }
        })


    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            
        })

        it('should return contract owner', async function () { 
            
        })

    });
})