import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent
} from "../generated/NftMarketplace/NftMarketplace"
import { ItemBought, ItemCanceled, ItemListed, ActiveItem } from "../generated/schema"

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

  itemListed.save()
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



function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): Bytes {
  return Bytes.fromUTF8(nftAddress.toHexString() + "_" + tokenId.toHexString())
}