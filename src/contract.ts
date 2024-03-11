import { Address, BigInt, Bytes, bigInt } from "@graphprotocol/graph-ts"
import {
  BidItemBought as BidItemBoughtEvent,
  BidItemListed as BidItemListedEvent,
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
  RaiseBidPrice as RaiseBidPriceEvent
} from "../generated/Contract/Contract"
import {
  BidItemBought,
  BidItemListed,
  ItemBought,
  ItemCanceled,
  ItemListed,
  RaiseBidPrice,
  ActiveItem
} from "../generated/schema"

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed = ItemListed.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )
  if (!itemListed) {
    itemListed = new ItemListed(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }
  if (!activeItem) {
    activeItem = new ActiveItem(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }
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
  let bidItemListed = BidItemListed.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )
  if (!bidItemListed) {
    bidItemListed = new BidItemListed(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }
  if (!activeItem) {
    activeItem = new ActiveItem(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }

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
  activeItem.isBidding = true
  activeItem.endTime = BigInt.fromString("0")
  activeItem.isFinishedBidding = false

  bidItemListed.save()
  activeItem.save()
}

export function handleItemBought(event: ItemBoughtEvent): void {
  let itemBought = ItemBought.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )
  if (!itemBought) {
    itemBought = new ItemBought(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }
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
  let bidItemBought = new BidItemBought(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )
  if (!bidItemBought) {
    bidItemBought = new BidItemBought(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }
  bidItemBought.buyyer = event.params.buyyer
  bidItemBought.nftAddress = event.params.nftAddress
  bidItemBought.tokenId = event.params.tokenId
  bidItemBought.price = event.params.price

  bidItemBought.blockNumber = event.block.number
  bidItemBought.blockTimestamp = event.block.timestamp
  bidItemBought.transactionHash = event.transaction.hash

  activeItem!.isFinishedBidding = true

  bidItemBought.save()
  activeItem!.save()
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let itemCanceled = ItemCanceled.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )
  if (!itemCanceled) {
    itemCanceled = new ItemCanceled(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }
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
  //GET NEW ENTITY EVERY
  let raiseBidPrice = new RaiseBidPrice(
    getIdFromEventParams(event.block.timestamp, event.params.nftAddress)
  )

  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )
  
  raiseBidPrice.buyer = event.params.buyer
  activeItem!.buyer = event.params.buyer
  
  raiseBidPrice.price = event.params.price
  activeItem!.price = event.params.price

  raiseBidPrice.endTime = event.params.endTime
  activeItem!.endTime = event.params.endTime

  raiseBidPrice.nftAddress = event.params.nftAddress
  raiseBidPrice.tokenId = event.params.tokenId

  raiseBidPrice.blockNumber = event.block.number
  raiseBidPrice.blockTimestamp = event.block.timestamp
  raiseBidPrice.transactionHash = event.transaction.hash

  raiseBidPrice.save()
  activeItem!.save()
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): Bytes {
  return Bytes.fromUTF8(nftAddress.toHexString() + "_" + tokenId.toHexString())
}