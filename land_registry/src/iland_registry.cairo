use starknet::ContractAddress;
use crate::types::{Encumberance, Land, LandPurposeResitrictions};

#[starknet::interface]
pub trait ILandRegistry<TContractState> {
    fn register_land(
        ref self: TContractState,
        parcel_number: felt252,
        gps_coordinate: felt252,
        area_square_meters: u256,
        legal_doc_hash: ByteArray,
        current_valuation: u256,
        encumberance: Encumberance,
        purpose: LandPurposeResitrictions,
    );
    fn transfer_land(
        ref self: TContractState, recipient: ContractAddress, land_id: u256
    );

    fn update_document(ref self: TContractState, new_hash: ByteArray, land_id: u256);

    fn flag_dispute(ref self: TContractState, land_id: u256);
    fn resolve_dispute(ref self: TContractState, land_id: u256);

    // Use the pausable component for pause and unpause

    fn get_land(self: @TContractState, land_id: u256) -> Land;
    fn get_transfer_history(self: @TContractState, land_id: u256) -> Span<(ContractAddress, u64)>;
    fn get_user_lands(self: @TContractState, user: ContractAddress) -> Span<u256>;
    fn get_total_lands(self: @TContractState) -> u256;
    fn token_uri(self: @TContractState, token_id: u256) -> ByteArray;
}
