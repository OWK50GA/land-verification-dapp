#[derive(Clone, Drop, Serde, PartialEq, Default, starknet::Store)]
pub struct Land {
    pub land_id: u256, //token_id of the nft
    pub parcel_number: felt252, // this is for uniqueness from an external government or something. There will be a map based on this to prevent duplication
    pub gps_coordinate: felt252,
    pub area_square_meters: u256,
    // pub current_owner: ContractAddress, // Not needed. NFT token holder covers it
    // pub legal_doc_hash: ByteArray, // IPFS Hash -> Actually already stored in the token_uris map
    pub current_valuation: u256,
    pub purpose: LandPurposeResitrictions,
    pub encumberance: Encumberance, // Things that make a holder legally unable to sell a land
}

#[derive(Copy, Drop, Serde, PartialEq, Default, starknet::Store)]
pub enum LandPurposeResitrictions {
    #[default]
    NONE,
    RESIDENTIAL,
    COMMERCIAL,
    AGRICULTURAL,
}

#[derive(Copy, Drop, Serde, PartialEq, Default, starknet::Store)]
pub enum Encumberance {
    #[default]
    NONE,
    LIENS,
    MORTGAGE,
    DISPUTE,
}
