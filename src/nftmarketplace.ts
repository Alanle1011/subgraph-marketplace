import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  BidItemBought as BidItemBoughtEvent,
  BidItemListed as BidItemListedEvent,
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
  RaiseBidPrice as RaiseBidPriceEvent
} from "../generated/nftmarketplace/nftmarketplace"
import {
  ActiveItem,
  BidItemListed,
  ItemListed,
  ItemBought,
  BidItemBought,
  ItemCanceled,
  RaiseBidPrice
} from "../generated/schema"

export function handleItemListed(event: ItemListedEvent): void {
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )
  
  if (!activeItem) {
    activeItem = new ActiveItem(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }

  let itemListed = new ItemListed(
    getIdFromEventParams(event.block.timestamp, event.params.nftAddress)
  )

  itemListed.seller = event.params.seller
  activeItem.seller = event.params.seller

  itemListed.nftAddress = event.params.nftAddress
  activeItem.nftAddress = event.params.nftAddress

  itemListed.tokenId = event.params.tokenId
  activeItem.tokenId = event.params.tokenId

  itemListed.price = event.params.price
  activeItem.price = event.params.price

  itemListed.blockNumber = event.block.number
  activeItem.blockNumber = event.block.number
  itemListed.blockTimestamp = event.block.timestamp
  activeItem.blockTimestamp = event.block.timestamp
  itemListed.transactionHash = event.transaction.hash
  activeItem.transactionHash = event.transaction.hash


  activeItem.buyer = Address.fromString("0x0000000000000000000000000000000000000000")
  activeItem.isBidding = false

  itemListed.save()
  activeItem.save()
}

export function handleBidItemListed(event: BidItemListedEvent): void {
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )
   
  if (!activeItem) {
    activeItem = new ActiveItem(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }

  let bidItemListed = new BidItemListed(
    getIdFromEventParams(event.block.timestamp, event.params.nftAddress)
  )

  bidItemListed.seller = event.params.seller
  activeItem.seller = event.params.seller

  bidItemListed.nftAddress = event.params.nftAddress
  activeItem.nftAddress = event.params.nftAddress

  bidItemListed.tokenId = event.params.tokenId
  activeItem.tokenId = event.params.tokenId

  bidItemListed.price = event.params.price
  activeItem.price = event.params.price

  bidItemListed.blockNumber = event.block.number
  activeItem.blockNumber = event.block.number
  bidItemListed.blockTimestamp = event.block.timestamp
  activeItem.blockTimestamp = event.block.timestamp
  bidItemListed.transactionHash = event.transaction.hash
  activeItem.transactionHash = event.transaction.hash

  activeItem.buyer = Address.fromString("0x0000000000000000000000000000000000000000")
  activeItem.highestBidder = Address.fromString("0x0000000000000000000000000000000000000000")
  activeItem.isBidding = true
  activeItem.startBuyTime = BigInt.fromString("0")
  activeItem.endBuyTime = BigInt.fromString("0")
  activeItem.isFinishedBidding = false

  bidItemListed.save()
  activeItem.save()
}

export function handleItemBought(event: ItemBoughtEvent): void {
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )
  
  let  itemBought = new ItemBought(
      getIdFromEventParams(event.block.timestamp, event.params.nftAddress)
  )
  
  itemBought.buyer = event.params.buyer
  itemBought.nftAddress = event.params.nftAddress
  itemBought.tokenId = event.params.tokenId
  itemBought.price = event.params.price
  itemBought.blockNumber = event.block.number
  itemBought.blockTimestamp = event.block.timestamp
  itemBought.transactionHash = event.transaction.hash

  activeItem!.buyer = event.params.buyer

  itemBought.save()
  activeItem!.save()
}

export function handleBidItemBought(event: BidItemBoughtEvent): void {
  
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )
  
  let bidItemBought = new BidItemBought(
    getIdFromEventParams(event.block.timestamp, event.params.nftAddress)
  )
  
  bidItemBought.buyyer = event.params.buyyer
  bidItemBought.nftAddress = event.params.nftAddress
  bidItemBought.tokenId = event.params.tokenId
  bidItemBought.price = event.params.price
  bidItemBought.blockNumber = event.block.number
  bidItemBought.blockTimestamp = event.block.timestamp
  bidItemBought.transactionHash = event.transaction.hash


  activeItem!.isFinishedBidding = true
  activeItem!.buyer = event.params.buyyer;

  bidItemBought.save()
  activeItem!.save()
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )
 
  let itemCanceled = new ItemCanceled(
    getIdFromEventParams(event.block.timestamp, event.params.nftAddress)
  )
  
  itemCanceled.seller = event.params.seller
  itemCanceled.nftAddress = event.params.nftAddress
  itemCanceled.tokenId = event.params.tokenId
  itemCanceled.blockNumber = event.block.number
  itemCanceled.blockTimestamp = event.block.timestamp
  itemCanceled.transactionHash = event.transaction.hash

  activeItem!.buyer = Address.fromString("0x000000000000000000000000000000000000dEaD")

  itemCanceled.save()
  activeItem!.save()
}

export function handleRaiseBidPrice(event: RaiseBidPriceEvent): void {
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )

  //GET NEW ENTITY EVERY TIME
  let raiseBidPrice = new RaiseBidPrice(
    getIdFromEventParams(event.block.timestamp, event.params.nftAddress)
  )
  
  raiseBidPrice.buyer = event.params.buyer
  activeItem!.highestBidder = event.params.buyer
  
  raiseBidPrice.price = event.params.price
  activeItem!.price = event.params.price

  raiseBidPrice.startBuyTime = event.params.startBuyTime
  activeItem!.startBuyTime = event.params.startBuyTime

  raiseBidPrice.endBuyTime = event.params.endBuyTime
  activeItem!.endBuyTime = event.params.endBuyTime

  raiseBidPrice.nftAddress = event.params.nftAddress
  raiseBidPrice.tokenId = event.params.tokenId

  raiseBidPrice.blockNumber = event.block.number
  raiseBidPrice.blockTimestamp = event.block.timestamp
  raiseBidPrice.transactionHash = event.transaction.hash

  raiseBidPrice.save()
  activeItem!.save()
}

function getIdFromEventParams(id: BigInt, nftAddress: Address): Bytes {
  return Bytes.fromUTF8(nftAddress.toHexString() + "_" + id.toHexString())
}
