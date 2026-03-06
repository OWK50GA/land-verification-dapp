#[starknet::contract]
pub mod LandRegistry {
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::security::PausableComponent;
    use openzeppelin::token::erc721::{ERC721Component, ERC721HooksEmptyImpl};
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::security::ReentrancyGuardComponent;
    use openzeppelin::upgrades::UpgradeableComponent;
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp, ClassHash};
    use starknet::storage::{
        Map, MutableVecTrait, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
        Vec, VecTrait,
    };
    use crate::iland_registry::ILandRegistry;
    use crate::types::{Encumberance, Land, LandPurposeResitrictions};

    #[storage]
    pub struct Storage {
        pub token_ids_to_land: Map::<u256, Land>,
        pub parcel_numbers_to_land: Map::<felt252, u256>, // instead of storing the land, also store the land_id/token_id
        pub owners_to_lands: Map::<ContractAddress, Vec<u256>>, //instead of storing the land, store a reference, which is the land id
        pub next_land_id: u256,
        token_uris: Map::<u256, ByteArray>, // token_id to token_uri
        pub land_transfer_history: Map::<u256, Vec<(ContractAddress, u64)>>, // owner, and at what time they started to own it
        #[substorage(v0)]
        pub ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        pub pausable: PausableComponent::Storage,
        #[substorage(v0)]
        pub erc721: ERC721Component::Storage,
        #[substorage(v0)]
        pub src5: SRC5Component::Storage,
        #[substorage(v0)]
        pub reentrancyguard: ReentrancyGuardComponent::Storage,
        #[substorage(v0)]
        pub upgradeable: UpgradeableComponent::Storage
    }

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: PausableComponent, storage: pausable, event: PausableEvent);
    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    component!(path: ReentrancyGuardComponent, storage: reentrancyguard, event: ReentrancyGuardEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        PausableEvent: PausableComponent::Event,
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        #[flat]
        ReentrancyGuardEvent: ReentrancyGuardComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
        LandRegistered: LandRegistered,
        LandTransferred: LandTransferred,
        DocumentUpdated: DocumentUpdated,
        Flagged: Flagged,
        LandCleared: LandCleared,
        DisputeResolved: DisputeResolved
    }

    #[derive(Drop, starknet::Event)]
    pub struct LandRegistered {
        pub owner: ContractAddress,
        pub parcel_number: felt252,
        pub land_id: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct LandTransferred {
        pub land_id: u256,
        pub recipient: ContractAddress
    }

    #[derive(Drop, starknet::Event)]
    pub struct DocumentUpdated {
        pub land_id: u256
    }

    #[derive(Drop, starknet::Event)]
    pub struct Flagged {
        pub land_id: u256,
        pub encumberance: Encumberance
    }

    #[derive(Drop, starknet::Event)]
    pub struct LandCleared {
        pub land_id: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct DisputeResolved {
        pub land_id: u256,
    }

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[abi(embed_v0)]
    impl PausableImpl = PausableComponent::PausableImpl<ContractState>;
    impl PausableInternalImpl = PausableComponent::InternalImpl<ContractState>;

    // #[abi(embed_v0)]
    impl ERC721Impl = ERC721Component::ERC721MixinImpl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;

    impl ReentrancyGuardImpl = ReentrancyGuardComponent::InternalImpl<ContractState>;

    // #[abi(embed_v0)]
    impl UpgradeableImpl = UpgradeableComponent::InternalImpl<ContractState>;

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress, name: ByteArray, symbol: ByteArray, base_uri: ByteArray) {
        self.ownable.initializer(owner);
        self.erc721.initializer(
            name,
            symbol,
            base_uri
        );
        self.next_land_id.write(1);
    }

    #[abi(embed_v0)]
    pub impl LandRegistryImpl of ILandRegistry<ContractState> {
        fn register_land(
            ref self: ContractState,
            parcel_number: felt252,
            gps_coordinate: felt252,
            area_square_meters: u256,
            legal_doc_hash: ByteArray,
            current_valuation: u256,
            encumberance: u8,
            purpose: u8,
        ) {
            let existing_land_id = self.parcel_numbers_to_land.entry(parcel_number).read();

            let encumberance = match encumberance {
                0 => Encumberance::NONE,
                1 => Encumberance::LIENS,
                2 => Encumberance::MORTGAGE,
                3 => Encumberance::DISPUTE,
                _ => Encumberance::NONE
            };

            let purpose = match purpose {
                0 => LandPurposeResitrictions::NONE,
                1 => LandPurposeResitrictions::RESIDENTIAL,
                2 => LandPurposeResitrictions::COMMERCIAL,
                3 => LandPurposeResitrictions::AGRICULTURAL,
                _ => LandPurposeResitrictions::NONE,
            };

            assert(existing_land_id == 0, 'Land already exists');
            assert(encumberance == Encumberance::NONE, 'Bad land state');
            let current_owner = get_caller_address();

            let land_id = self.next_land_id.read();

            let land = Land {
                land_id,
                parcel_number,
                gps_coordinate,
                area_square_meters,
                // current_owner,
                // legal_doc_hash,
                current_valuation,
                purpose,
                encumberance 
            };

            self.token_ids_to_land.entry(land_id).write(land);
            self.parcel_numbers_to_land.entry(parcel_number).write(land_id);
            self.owners_to_lands.entry(current_owner).push(land_id);
            self.token_uris.entry(land_id).write(legal_doc_hash);
            self.next_land_id.write(land_id + 1);
            self.land_transfer_history.entry(land_id).push((current_owner, get_block_timestamp()));
            self.erc721.mint(current_owner, land_id);

            self.emit(
                LandRegistered {
                    owner: current_owner,
                    parcel_number,
                    land_id
                }
            )
        }
        fn transfer_land(
            ref self: ContractState, recipient: ContractAddress, land_id: u256
        ) {
            self.reentrancyguard.start();
            let caller = get_caller_address();
            assert(caller != recipient, 'Cannot transfer to oneself');
            assert(self.erc721.owner_of(land_id) == caller, 'Caller not land owner');
            let land = self.token_ids_to_land.entry(land_id).read();
            assert(land.encumberance == Encumberance::NONE, 'Land cannot be transferred');

            self.erc721.transfer_from(caller, recipient, land_id);
            self.owners_to_lands.entry(recipient).push(land_id);
            self.land_transfer_history.entry(land_id).push((recipient, get_block_timestamp()));

            self.reentrancyguard.end();

            self.emit(
                LandTransferred {
                    land_id,
                    recipient
                }
            );
        }

        fn update_document(ref self: ContractState, new_hash: ByteArray, land_id: u256) {
            let caller = get_caller_address();
            assert(self.erc721.owner_of(land_id) == caller, 'Caller not land owner');
            let land = self.token_ids_to_land.entry(land_id).read();
            assert(land.encumberance == Encumberance::NONE, 'Land cannot be edited now');
            self.token_uris.entry(land_id).write(new_hash);
            // Emit event here
            self.emit(
                DocumentUpdated {
                    land_id
                }
            );
        }

        fn flag_dispute(ref self: ContractState, land_id: u256) {
            self.ownable.assert_only_owner();
            let mut land = self.token_ids_to_land.entry(land_id).read();
            land.encumberance = Encumberance::DISPUTE;
            self.token_ids_to_land.entry(land_id).write(land);
            self.emit(
                Flagged {
                    encumberance: Encumberance::DISPUTE,
                    land_id
                }
            );
        }

        fn resolve_dispute(ref self: ContractState, land_id: u256) {
            let mut land = self.token_ids_to_land.entry(land_id).read();
            land.encumberance = Encumberance::NONE;
            self.token_ids_to_land.entry(land_id).write(land);

            self.emit(
                LandCleared {
                    land_id
                }
            );
        }

        // Use the pausable component for pause and unpause

        fn get_land(self: @ContractState, land_id: u256) -> Land {
            self.token_ids_to_land.entry(land_id).read()
        }

        fn get_transfer_history(self: @ContractState, land_id: u256) -> Span<(ContractAddress, u64)> {
            let mut history_array = array![];

            for i in 0..self.land_transfer_history.entry(land_id).len() {
                let current_step = self.land_transfer_history.entry(land_id)[i].read();
                history_array.append(current_step);
            }

            history_array.span()
        }

        fn get_user_lands(self: @ContractState, user: ContractAddress) -> Span<u256> {
            let mut lands_array = array![];

            for i in 0..self.owners_to_lands.entry(user).len() {
                let current_land = self.owners_to_lands.entry(user)[i].read();
                // Check if land still belongs to user
                if (self.erc721.owner_of(current_land) == user) {
                    lands_array.append(current_land);
                }
            }

            lands_array.span()
        }

        fn get_total_lands(self: @ContractState) -> u256 {
            // Since we use incremental ids
            let mut total_lands = 0;

            let next_land_id = self.next_land_id.read();

            for i in 0..next_land_id {
                if (self.token_ids_to_land.entry(i).read() != Default::default()) {
                    total_lands += 1;
                }
            }

            total_lands
        }

        fn token_uri(self: @ContractState, token_id: u256) -> ByteArray {
            assert(self.erc721.exists(token_id), 'Token id does not exist');
            self.token_uris.entry(token_id).read()
        }

        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.upgradeable.upgrade(new_class_hash);
        }
    }
}
