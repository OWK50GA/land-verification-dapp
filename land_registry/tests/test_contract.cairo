use starknet::SyscallResultTrait;
use land_registry::iland_registry::{ILandRegistryDispatcher, ILandRegistryDispatcherTrait};
// use openzeppelin::token::erc721::{ERC721ABIDispatcher, ERC721ABIDispatcherTrait};
use land_registry::types::{Encumberance, LandPurposeResitrictions};
use snforge_std::{ContractClassTrait, DeclareResultTrait, declare, start_cheat_caller_address, stop_cheat_caller_address, start_cheat_block_timestamp, stop_cheat_block_timestamp};
use starknet::{ContractAddress};
// use snforge_std::{ContractClassTrait, DeclareResultTrait, declare, start_cheat_caller_address, stop_cheat_caller_address,};

fn deploy_contract(owner: ContractAddress, name: ByteArray, symbol: ByteArray, base_uri: ByteArray) -> ContractAddress {
    let contract = declare("LandRegistry").unwrap_syscall().contract_class();
    let mut constructor_args = array![];
    owner.serialize(ref constructor_args);
    name.serialize(ref constructor_args);
    symbol.serialize(ref constructor_args);
    base_uri.serialize(ref constructor_args);
    let (contract_address, _) = contract.deploy(@constructor_args).unwrap_syscall();
    contract_address
}

fn owner() -> ContractAddress {
    'owner'.try_into().unwrap()
}

fn setup() -> (ContractAddress, ContractAddress) {
    let owner: ContractAddress = owner();
    let name: ByteArray = "Test Land Registry";
    let symbol: ByteArray = "TLR";
    let base_uri: ByteArray = "random_base_uri";
    let contract_address = deploy_contract(owner, name, symbol, base_uri);
    (contract_address, owner)
}

// test_register_land
// test_register_lands_same_parcel_number
// test_register_land_with_encumberance

// test_transfer_land
// test_transfer_land_to_self
// test_transfer_land_not_owner
// test_transfer_land_with_encumberance

// test_update_document
// test_update_document_not_owner
// test_update_document_with_encumberance

// test_get_total_lands
// test_get_user_lands
// test_get_transfer_history
// test_get_land

#[test]
fn test_register_land() {
    let (contract_address, owner) = setup();
    let dispatcher = ILandRegistryDispatcher { contract_address };

    // Set the caller to owner
    start_cheat_caller_address(contract_address, owner);

    // Register a land
    let parcel_number: felt252 = 'PARCEL001';
    let gps_coordinate: felt252 = 'GPS123';
    let area_square_meters: u256 = 1000;
    let legal_doc_hash: ByteArray = "QmHash123";
    let current_valuation: u256 = 500000;
    let encumberance = Encumberance::NONE;
    let purpose = LandPurposeResitrictions::RESIDENTIAL;

    dispatcher.register_land(
        parcel_number,
        gps_coordinate,
        area_square_meters,
        legal_doc_hash.clone(),
        current_valuation,
        encumberance,
        purpose
    );

    // Verify the land was registered
    let land = dispatcher.get_land(1);
    assert(land.land_id == 1, 'Invalid land_id');
    assert(land.parcel_number == parcel_number, 'Invalid parcel_number');
    assert(land.gps_coordinate == gps_coordinate, 'Invalid gps_coordinate');
    assert(land.area_square_meters == area_square_meters, 'Invalid area');
    assert(land.current_valuation == current_valuation, 'Invalid valuation');
    assert(land.purpose == purpose, 'Invalid purpose');
    assert(land.encumberance == encumberance, 'Invalid encumberance');

    // Verify token URI
    let token_uri = dispatcher.token_uri(1);
    assert(token_uri == legal_doc_hash, 'Invalid token_uri');

    // Verify total lands
    let total_lands = dispatcher.get_total_lands();
    assert(total_lands == 1, 'Invalid total_lands');

    // Verify user lands
    let user_lands = dispatcher.get_user_lands(owner);
    assert(user_lands.len() == 1, 'Invalid user_lands length');
    assert(*user_lands.at(0) == 1, 'Invalid user land_id');

    stop_cheat_caller_address(contract_address);
}



#[test]
#[should_panic(expected: ('Land already exists',))]
fn test_register_lands_same_parcel_number() {
    let (contract_address, owner) = setup();
    let dispatcher = ILandRegistryDispatcher { contract_address };

    start_cheat_caller_address(contract_address, owner);

    // Register first land
    let parcel_number: felt252 = 'PARCEL001';
    let gps_coordinate: felt252 = 'GPS123';
    let area_square_meters: u256 = 1000;
    let legal_doc_hash: ByteArray = "QmHash123";
    let current_valuation: u256 = 500000;
    let encumberance = Encumberance::NONE;
    let purpose = LandPurposeResitrictions::RESIDENTIAL;

    dispatcher.register_land(
        parcel_number,
        gps_coordinate,
        area_square_meters,
        legal_doc_hash.clone(),
        current_valuation,
        encumberance,
        purpose
    );

    // Try to register another land with the same parcel number - should panic
    dispatcher.register_land(
        parcel_number, // Same parcel number
        'GPS456', // Different GPS
        2000,
        "QmHash456",
        750000,
        encumberance,
        LandPurposeResitrictions::COMMERCIAL
    );

    stop_cheat_caller_address(contract_address);
}

#[test]
#[should_panic(expected: ('Bad land state',))]
fn test_register_land_with_encumberance() {
    let (contract_address, owner) = setup();
    let dispatcher = ILandRegistryDispatcher { contract_address };

    start_cheat_caller_address(contract_address, owner);

    // Try to register land with encumberance - should panic
    let parcel_number: felt252 = 'PARCEL002';
    let gps_coordinate: felt252 = 'GPS789';
    let area_square_meters: u256 = 1500;
    let legal_doc_hash: ByteArray = "QmHash789";
    let current_valuation: u256 = 600000;
    let encumberance = Encumberance::DISPUTE; // Not NONE
    let purpose = LandPurposeResitrictions::COMMERCIAL;

    dispatcher.register_land(
        parcel_number,
        gps_coordinate,
        area_square_meters,
        legal_doc_hash,
        current_valuation,
        encumberance,
        purpose
    );

    stop_cheat_caller_address(contract_address);
}

#[test]
fn test_transfer_land() {
    let (contract_address, owner) = setup();
    let dispatcher = ILandRegistryDispatcher { contract_address };

    start_cheat_caller_address(contract_address, owner);

    // Register a land
    let parcel_number: felt252 = 'PARCEL003';
    let gps_coordinate: felt252 = 'GPS111';
    let area_square_meters: u256 = 2000;
    let legal_doc_hash: ByteArray = "QmHash111";
    let current_valuation: u256 = 800000;
    let encumberance = Encumberance::NONE;
    let purpose = LandPurposeResitrictions::AGRICULTURAL;

    dispatcher.register_land(
        parcel_number,
        gps_coordinate,
        area_square_meters,
        legal_doc_hash,
        current_valuation,
        encumberance,
        purpose
    );

    // Create recipient address
    let recipient = 'recipient'.try_into().unwrap();

    // Transfer the land (land_id = 1)
    dispatcher.transfer_land(recipient, 1);

    stop_cheat_caller_address(contract_address);

    // Verify the land was transferred
    let land = dispatcher.get_land(1);
    assert(land.land_id == 1, 'Invalid land_id');

    // Verify recipient now owns the land
    let recipient_lands = dispatcher.get_user_lands(recipient);
    assert(recipient_lands.len() == 1, 'Recipient should have 1 land');
    assert(*recipient_lands.at(0) == 1, 'Invalid recipient land_id');

    // Verify original owner no longer has the land
    let owner_lands = dispatcher.get_user_lands(owner);
    assert(owner_lands.len() == 0, 'Owner should have 0 lands');

    // Verify transfer history
    let history = dispatcher.get_transfer_history(1);
    assert(history.len() == 2, 'History should have 2 entries');
    let (first_owner, _) = *history.at(0);
    let (second_owner, _) = *history.at(1);
    assert(first_owner == owner, 'First owner incorrect');
    assert(second_owner == recipient, 'Second owner incorrect');
}

#[test]
#[should_panic(expected: ('Cannot transfer to oneself',))]
fn test_transfer_land_to_self() {
    let (contract_address, owner) = setup();
    let dispatcher = ILandRegistryDispatcher { contract_address };

    start_cheat_caller_address(contract_address, owner);

    // Register a land
    let parcel_number: felt252 = 'PARCEL004';
    let gps_coordinate: felt252 = 'GPS222';
    let area_square_meters: u256 = 1500;
    let legal_doc_hash: ByteArray = "QmHash222";
    let current_valuation: u256 = 700000;
    let encumberance = Encumberance::NONE;
    let purpose = LandPurposeResitrictions::RESIDENTIAL;

    dispatcher.register_land(
        parcel_number,
        gps_coordinate,
        area_square_meters,
        legal_doc_hash,
        current_valuation,
        encumberance,
        purpose
    );

    // Try to transfer to self - should panic
    dispatcher.transfer_land(owner, 1);

    stop_cheat_caller_address(contract_address);
}

#[test]
#[should_panic(expected: ('Caller not land owner',))]
fn test_transfer_land_not_owner() {
    let (contract_address, owner) = setup();
    let dispatcher = ILandRegistryDispatcher { contract_address };

    start_cheat_caller_address(contract_address, owner);

    // Register a land
    let parcel_number: felt252 = 'PARCEL005';
    let gps_coordinate: felt252 = 'GPS333';
    let area_square_meters: u256 = 1800;
    let legal_doc_hash: ByteArray = "QmHash333";
    let current_valuation: u256 = 900000;
    let encumberance = Encumberance::NONE;
    let purpose = LandPurposeResitrictions::COMMERCIAL;

    dispatcher.register_land(
        parcel_number,
        gps_coordinate,
        area_square_meters,
        legal_doc_hash,
        current_valuation,
        encumberance,
        purpose
    );

    stop_cheat_caller_address(contract_address);

    // Try to transfer as non-owner - should panic
    let non_owner = 'non_owner'.try_into().unwrap();
    let recipient = 'recipient'.try_into().unwrap();
    
    start_cheat_caller_address(contract_address, non_owner);
    dispatcher.transfer_land(recipient, 1);
    stop_cheat_caller_address(contract_address);
}

#[test]
#[should_panic(expected: ('Land cannot be transferred',))]
fn test_transfer_land_with_encumberance() {
    let (contract_address, owner) = setup();
    let dispatcher = ILandRegistryDispatcher { contract_address };

    start_cheat_caller_address(contract_address, owner);

    // Register first land
    let parcel_number: felt252 = 'PARCEL006';
    let gps_coordinate: felt252 = 'GPS444';
    let area_square_meters: u256 = 2500;
    let legal_doc_hash: ByteArray = "QmHash444";
    let current_valuation: u256 = 1000000;
    let encumberance = Encumberance::NONE;
    let purpose = LandPurposeResitrictions::AGRICULTURAL;

    dispatcher.register_land(
        parcel_number,
        gps_coordinate,
        area_square_meters,
        legal_doc_hash,
        current_valuation,
        encumberance,
        purpose
    );

    // Register second land
    dispatcher.register_land(
        'PARCEL007',
        'GPS555',
        3000,
        "QmHash555",
        1200000,
        Encumberance::NONE,
        LandPurposeResitrictions::COMMERCIAL
    );

    stop_cheat_caller_address(contract_address);

    // Contract owner flags the first land with a dispute
    let contract_owner = owner;
    start_cheat_caller_address(contract_address, contract_owner);
    dispatcher.flag_dispute(1);
    stop_cheat_caller_address(contract_address);

    // Verify first land has DISPUTE encumberance
    let land1 = dispatcher.get_land(1);
    assert(land1.encumberance == Encumberance::DISPUTE, 'Land1 should have DISPUTE');

    // Verify second land still has no encumberance
    let land2 = dispatcher.get_land(2);
    assert(land2.encumberance == Encumberance::NONE, 'Land2 should have no encumb');

    // Try to transfer first land with encumberance - should panic
    start_cheat_caller_address(contract_address, owner);
    let recipient = 'recipient'.try_into().unwrap();
    dispatcher.transfer_land(recipient, 1);
    stop_cheat_caller_address(contract_address);
}

#[test]
fn test_update_document() {
    let (contract_address, owner) = setup();
    let dispatcher = ILandRegistryDispatcher { contract_address };

    start_cheat_caller_address(contract_address, owner);

    // Register a land
    let parcel_number: felt252 = 'PARCEL008';
    let gps_coordinate: felt252 = 'GPS666';
    let area_square_meters: u256 = 1200;
    let legal_doc_hash: ByteArray = "QmHash666";
    let current_valuation: u256 = 550000;
    let encumberance = Encumberance::NONE;
    let purpose = LandPurposeResitrictions::RESIDENTIAL;

    dispatcher.register_land(
        parcel_number,
        gps_coordinate,
        area_square_meters,
        legal_doc_hash.clone(),
        current_valuation,
        encumberance,
        purpose
    );

    // Verify initial token URI
    let initial_uri = dispatcher.token_uri(1);
    assert(initial_uri == legal_doc_hash, 'Initial URI incorrect');

    // Update the document
    let new_hash: ByteArray = "QmNewHash999";
    dispatcher.update_document(new_hash.clone(), 1);

    // Verify the token URI was updated
    let updated_uri = dispatcher.token_uri(1);
    assert(updated_uri == new_hash, 'Updated URI incorrect');
    assert(updated_uri != legal_doc_hash, 'URI should have changed');

    stop_cheat_caller_address(contract_address);
}

#[test]
#[should_panic(expected: ('Caller not land owner',))]
fn test_update_document_not_owner() {
    let (contract_address, owner) = setup();
    let dispatcher = ILandRegistryDispatcher { contract_address };

    start_cheat_caller_address(contract_address, owner);

    // Register a land
    let parcel_number: felt252 = 'PARCEL009';
    let gps_coordinate: felt252 = 'GPS777';
    let area_square_meters: u256 = 1400;
    let legal_doc_hash: ByteArray = "QmHash777";
    let current_valuation: u256 = 650000;
    let encumberance = Encumberance::NONE;
    let purpose = LandPurposeResitrictions::COMMERCIAL;

    dispatcher.register_land(
        parcel_number,
        gps_coordinate,
        area_square_meters,
        legal_doc_hash,
        current_valuation,
        encumberance,
        purpose
    );

    stop_cheat_caller_address(contract_address);

    // Try to update document as non-owner - should panic
    let non_owner = 'non_owner'.try_into().unwrap();
    start_cheat_caller_address(contract_address, non_owner);
    
    let new_hash: ByteArray = "QmUnauthorized";
    dispatcher.update_document(new_hash, 1);
    
    stop_cheat_caller_address(contract_address);
}

#[test]
#[should_panic(expected: ('Land cannot be edited now',))]
fn test_update_document_with_encumberance() {
    let (contract_address, owner) = setup();
    let dispatcher = ILandRegistryDispatcher { contract_address };

    start_cheat_caller_address(contract_address, owner);

    // Register a land
    let parcel_number: felt252 = 'PARCEL010';
    let gps_coordinate: felt252 = 'GPS888';
    let area_square_meters: u256 = 1600;
    let legal_doc_hash: ByteArray = "QmHash888";
    let current_valuation: u256 = 750000;
    let encumberance = Encumberance::NONE;
    let purpose = LandPurposeResitrictions::AGRICULTURAL;

    dispatcher.register_land(
        parcel_number,
        gps_coordinate,
        area_square_meters,
        legal_doc_hash,
        current_valuation,
        encumberance,
        purpose
    );

    stop_cheat_caller_address(contract_address);

    // Contract owner flags the land with a dispute
    start_cheat_caller_address(contract_address, owner);
    dispatcher.flag_dispute(1);
    stop_cheat_caller_address(contract_address);

    // Verify land has DISPUTE encumberance
    let land = dispatcher.get_land(1);
    assert(land.encumberance == Encumberance::DISPUTE, 'Land should have DISPUTE');

    // Try to update document with encumberance - should panic
    start_cheat_caller_address(contract_address, owner);
    let new_hash: ByteArray = "QmNewHash888";
    dispatcher.update_document(new_hash, 1);
    stop_cheat_caller_address(contract_address);
}

#[test]
fn test_get_land() {
    let (contract_address, owner) = setup();
    let dispatcher = ILandRegistryDispatcher { contract_address };

    start_cheat_caller_address(contract_address, owner);

    // Register a land
    let parcel_number: felt252 = 'PARCEL011';
    let gps_coordinate: felt252 = 'GPS999';
    let area_square_meters: u256 = 1800;
    let legal_doc_hash: ByteArray = "QmHash999";
    let current_valuation: u256 = 850000;
    let encumberance = Encumberance::NONE;
    let purpose = LandPurposeResitrictions::RESIDENTIAL;

    dispatcher.register_land(
        parcel_number,
        gps_coordinate,
        area_square_meters,
        legal_doc_hash,
        current_valuation,
        encumberance,
        purpose
    );

    // Test getting existing land
    let land = dispatcher.get_land(1);
    assert(land.land_id == 1, 'Invalid land_id');
    assert(land.parcel_number == parcel_number, 'Invalid parcel_number');
    assert(land.gps_coordinate == gps_coordinate, 'Invalid gps_coordinate');
    assert(land.area_square_meters == area_square_meters, 'Invalid area');
    assert(land.current_valuation == current_valuation, 'Invalid valuation');
    assert(land.purpose == purpose, 'Invalid purpose');
    assert(land.encumberance == encumberance, 'Invalid encumberance');

    // Test getting non-existent land (should return default/zero values)
    let non_existent_land = dispatcher.get_land(999);
    assert(non_existent_land.land_id == 0, 'Should be default land_id');
    assert(non_existent_land.parcel_number == 0, 'Should be default parcel');
    assert(non_existent_land.area_square_meters == 0, 'Should be default area');

    stop_cheat_caller_address(contract_address);
}

#[test]
fn test_get_user_lands() {
    let (contract_address, _owner) = setup();
    let dispatcher = ILandRegistryDispatcher { contract_address };

    // Create multiple users
    let user1 = 'user1'.try_into().unwrap();
    let user2 = 'user2'.try_into().unwrap();
    let user3 = 'user3'.try_into().unwrap();
    let user_no_lands = 'user_no_lands'.try_into().unwrap();

    // User1 registers 2 lands
    start_cheat_caller_address(contract_address, user1);
    dispatcher.register_land(
        'PARCEL_U1_1',
        'GPS_U1_1',
        1000,
        "QmHashU1_1",
        500000,
        Encumberance::NONE,
        LandPurposeResitrictions::RESIDENTIAL
    );
    dispatcher.register_land(
        'PARCEL_U1_2',
        'GPS_U1_2',
        1500,
        "QmHashU1_2",
        750000,
        Encumberance::NONE,
        LandPurposeResitrictions::COMMERCIAL
    );
    stop_cheat_caller_address(contract_address);

    // User2 registers 3 lands
    start_cheat_caller_address(contract_address, user2);
    dispatcher.register_land(
        'PARCEL_U2_1',
        'GPS_U2_1',
        2000,
        "QmHashU2_1",
        800000,
        Encumberance::NONE,
        LandPurposeResitrictions::AGRICULTURAL
    );
    dispatcher.register_land(
        'PARCEL_U2_2',
        'GPS_U2_2',
        2500,
        "QmHashU2_2",
        900000,
        Encumberance::NONE,
        LandPurposeResitrictions::RESIDENTIAL
    );
    dispatcher.register_land(
        'PARCEL_U2_3',
        'GPS_U2_3',
        3000,
        "QmHashU2_3",
        1000000,
        Encumberance::NONE,
        LandPurposeResitrictions::COMMERCIAL
    );
    stop_cheat_caller_address(contract_address);

    // User3 registers 1 land
    start_cheat_caller_address(contract_address, user3);
    dispatcher.register_land(
        'PARCEL_U3_1',
        'GPS_U3_1',
        1200,
        "QmHashU3_1",
        600000,
        Encumberance::NONE,
        LandPurposeResitrictions::RESIDENTIAL
    );
    stop_cheat_caller_address(contract_address);

    // Verify initial land counts
    let user1_lands = dispatcher.get_user_lands(user1);
    assert(user1_lands.len() == 2, 'User1 should have 2 lands');
    assert(*user1_lands.at(0) == 1, 'User1 land1 should be id 1');
    assert(*user1_lands.at(1) == 2, 'User1 land2 should be id 2');

    let user2_lands = dispatcher.get_user_lands(user2);
    assert(user2_lands.len() == 3, 'User2 should have 3 lands');
    assert(*user2_lands.at(0) == 3, 'User2 land1 should be id 3');
    assert(*user2_lands.at(1) == 4, 'User2 land2 should be id 4');
    assert(*user2_lands.at(2) == 5, 'User2 land3 should be id 5');

    let user3_lands = dispatcher.get_user_lands(user3);
    assert(user3_lands.len() == 1, 'User3 should have 1 land');
    assert(*user3_lands.at(0) == 6, 'User3 land should be id 6');

    // User with no lands
    let no_lands = dispatcher.get_user_lands(user_no_lands);
    assert(no_lands.len() == 0, 'User should have 0 lands');

    // User1 transfers one land to User3
    start_cheat_caller_address(contract_address, user1);
    dispatcher.transfer_land(user3, 1); // Transfer land_id 1
    stop_cheat_caller_address(contract_address);

    // User2 transfers one land to User1
    start_cheat_caller_address(contract_address, user2);
    dispatcher.transfer_land(user1, 4); // Transfer land_id 4
    stop_cheat_caller_address(contract_address);

    // Verify land counts after transfers
    let user1_lands_after = dispatcher.get_user_lands(user1);
    assert(user1_lands_after.len() == 2, 'User1 should have 2 lands'); // Lost 1, gained 1
    assert(*user1_lands_after.at(0) == 2, 'User1 should have land 2');
    assert(*user1_lands_after.at(1) == 4, 'User1 should have land 4');

    let user2_lands_after = dispatcher.get_user_lands(user2);
    assert(user2_lands_after.len() == 2, 'User2 should have 2 lands'); // Lost 1
    assert(*user2_lands_after.at(0) == 3, 'User2 should have land 3');
    assert(*user2_lands_after.at(1) == 5, 'User2 should have land 5');

    let user3_lands_after = dispatcher.get_user_lands(user3);
    assert(user3_lands_after.len() == 2, 'User3 should have 2 lands'); // Gained 1
    assert(*user3_lands_after.at(0) == 6, 'User3 should have land 6');
    assert(*user3_lands_after.at(1) == 1, 'User3 should have land 1');
}

#[test]
fn test_get_transfer_history() {
    let (contract_address, _owner) = setup();
    let dispatcher = ILandRegistryDispatcher { contract_address };

    // Create users
    let user1 = 'user1'.try_into().unwrap();
    let user2 = 'user2'.try_into().unwrap();
    let user3 = 'user3'.try_into().unwrap();
    let user4 = 'user4'.try_into().unwrap();

    // Set initial timestamp to 1000
    start_cheat_block_timestamp(contract_address, 1000);

    // User1 registers a land at timestamp 1000
    start_cheat_caller_address(contract_address, user1);
    dispatcher.register_land(
        'PARCEL_HIST',
        'GPS_HIST',
        2000,
        "QmHashHist",
        1000000,
        Encumberance::NONE,
        LandPurposeResitrictions::RESIDENTIAL
    );
    stop_cheat_caller_address(contract_address);

    // Verify initial history (only user1 at timestamp 1000)
    let history1 = dispatcher.get_transfer_history(1);
    assert(history1.len() == 1, 'History should have 1 entry');
    let (owner1, time1) = *history1.at(0);
    assert(owner1 == user1, 'First owner should be user1');
    assert(time1 == 1000, 'First timestamp should be 1000');

    // Set timestamp to 2000 and transfer to user2
    stop_cheat_block_timestamp(contract_address);
    start_cheat_block_timestamp(contract_address, 2000);
    start_cheat_caller_address(contract_address, user1);
    dispatcher.transfer_land(user2, 1);
    stop_cheat_caller_address(contract_address);

    // Verify history after first transfer
    let history2 = dispatcher.get_transfer_history(1);
    assert(history2.len() == 2, 'History should have 2 entries');
    let (owner2_1, time2_1) = *history2.at(0);
    let (owner2_2, time2_2) = *history2.at(1);
    assert(owner2_1 == user1, 'First owner should be user1');
    assert(time2_1 == 1000, 'First timestamp should be 1000');
    assert(owner2_2 == user2, 'Second owner should be user2');
    assert(time2_2 == 2000, 'Second timestamp should be 2000');

    // Set timestamp to 3500 and transfer to user3
    stop_cheat_block_timestamp(contract_address);
    start_cheat_block_timestamp(contract_address, 3500);
    start_cheat_caller_address(contract_address, user2);
    dispatcher.transfer_land(user3, 1);
    stop_cheat_caller_address(contract_address);

    // Verify history after second transfer
    let history3 = dispatcher.get_transfer_history(1);
    assert(history3.len() == 3, 'History should have 3 entries');
    let (owner3_1, time3_1) = *history3.at(0);
    let (owner3_2, time3_2) = *history3.at(1);
    let (owner3_3, time3_3) = *history3.at(2);
    assert(owner3_1 == user1, 'First owner should be user1');
    assert(time3_1 == 1000, 'First timestamp should be 1000');
    assert(owner3_2 == user2, 'Second owner should be user2');
    assert(time3_2 == 2000, 'Second timestamp should be 2000');
    assert(owner3_3 == user3, 'Third owner should be user3');
    assert(time3_3 == 3500, 'Third timestamp should be 3500');

    // Set timestamp to 5000 and transfer to user4
    stop_cheat_block_timestamp(contract_address);
    start_cheat_block_timestamp(contract_address, 5000);
    start_cheat_caller_address(contract_address, user3);
    dispatcher.transfer_land(user4, 1);
    stop_cheat_caller_address(contract_address);

    // Verify final history after third transfer
    let history4 = dispatcher.get_transfer_history(1);
    assert(history4.len() == 4, 'History should have 4 entries');
    let (owner4_1, time4_1) = *history4.at(0);
    let (owner4_2, time4_2) = *history4.at(1);
    let (owner4_3, time4_3) = *history4.at(2);
    let (owner4_4, time4_4) = *history4.at(3);
    assert(owner4_1 == user1, 'First owner should be user1');
    assert(time4_1 == 1000, 'First timestamp should be 1000');
    assert(owner4_2 == user2, 'Second owner should be user2');
    assert(time4_2 == 2000, 'Second timestamp should be 2000');
    assert(owner4_3 == user3, 'Third owner should be user3');
    assert(time4_3 == 3500, 'Third timestamp should be 3500');
    assert(owner4_4 == user4, 'Fourth owner should be user4');
    assert(time4_4 == 5000, 'Fourth timestamp should be 5000');

    stop_cheat_block_timestamp(contract_address);

    // Test history for non-existent land (should be empty)
    let empty_history = dispatcher.get_transfer_history(999);
    assert(empty_history.len() == 0, 'Non-existent land history');
}

#[test]
fn test_get_total_lands() {
    let (contract_address, _owner) = setup();
    let dispatcher = ILandRegistryDispatcher { contract_address };

    // Create users
    let user1 = 'user1'.try_into().unwrap();
    let user2 = 'user2'.try_into().unwrap();
    let user3 = 'user3'.try_into().unwrap();

    // Initially, no lands should exist
    let initial_total = dispatcher.get_total_lands();
    assert(initial_total == 0, 'Initial total should be 0');

    // User1 registers 1 land
    start_cheat_caller_address(contract_address, user1);
    dispatcher.register_land(
        'PARCEL_T1',
        'GPS_T1',
        1000,
        "QmHashT1",
        500000,
        Encumberance::NONE,
        LandPurposeResitrictions::RESIDENTIAL
    );
    stop_cheat_caller_address(contract_address);

    let total_after_1 = dispatcher.get_total_lands();
    assert(total_after_1 == 1, 'Total should be 1');

    // User2 registers 2 lands
    start_cheat_caller_address(contract_address, user2);
    dispatcher.register_land(
        'PARCEL_T2',
        'GPS_T2',
        1500,
        "QmHashT2",
        600000,
        Encumberance::NONE,
        LandPurposeResitrictions::COMMERCIAL
    );
    dispatcher.register_land(
        'PARCEL_T3',
        'GPS_T3',
        2000,
        "QmHashT3",
        700000,
        Encumberance::NONE,
        LandPurposeResitrictions::AGRICULTURAL
    );
    stop_cheat_caller_address(contract_address);

    let total_after_3 = dispatcher.get_total_lands();
    assert(total_after_3 == 3, 'Total should be 3');

    // User3 registers 3 lands
    start_cheat_caller_address(contract_address, user3);
    dispatcher.register_land(
        'PARCEL_T4',
        'GPS_T4',
        2500,
        "QmHashT4",
        800000,
        Encumberance::NONE,
        LandPurposeResitrictions::RESIDENTIAL
    );
    dispatcher.register_land(
        'PARCEL_T5',
        'GPS_T5',
        3000,
        "QmHashT5",
        900000,
        Encumberance::NONE,
        LandPurposeResitrictions::COMMERCIAL
    );
    dispatcher.register_land(
        'PARCEL_T6',
        'GPS_T6',
        3500,
        "QmHashT6",
        1000000,
        Encumberance::NONE,
        LandPurposeResitrictions::AGRICULTURAL
    );
    stop_cheat_caller_address(contract_address);

    let total_after_6 = dispatcher.get_total_lands();
    assert(total_after_6 == 6, 'Total should be 6');

    // Transfer lands between users (total should remain the same)
    start_cheat_caller_address(contract_address, user1);
    dispatcher.transfer_land(user2, 1);
    stop_cheat_caller_address(contract_address);

    start_cheat_caller_address(contract_address, user3);
    dispatcher.transfer_land(user1, 4);
    stop_cheat_caller_address(contract_address);

    let total_after_transfers = dispatcher.get_total_lands();
    assert(total_after_transfers == 6, 'Total should still be 6');
}
