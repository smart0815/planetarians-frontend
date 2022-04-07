export interface Attribute {
    trait_type: string
    value: string
}

export interface Collection {
    name: string
    family: string
}

export interface File {
    uri: string
    type: string
}

export interface Creator {
    address: string
    share: number
}

export interface Properties {
    files: File[]
    category: string
    creators: Creator[]
}

export interface NFT {
    name: string
    image: string
    symbol: string
    description: string
    seller_fee_basis_points: number
    external_url: string
    attributes: Attribute[]
    collection: Collection
    properties: Properties
}

export interface NFTmap {
    NFT: NFT
    mint: string
    isStaked: boolean
}