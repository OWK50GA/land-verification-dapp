export const CONTRACT_ADDRESS =
  "0x724ca48dede8bc51fa1bbe2e9a7fb35f08611ee2c9a421e047fa30c9c8cf24c";

export const LAND_REGISTRY_ABI = [
  {
    type: "impl",
    name: "LandRegistryImpl",
    interface_name: "land_registry::iland_registry::ILandRegistry",
  },
  {
    type: "struct",
    name: "core::integer::u256",
    members: [
      { name: "low", type: "core::integer::u128" },
      { name: "high", type: "core::integer::u128" },
    ],
  },
  {
    type: "struct",
    name: "core::byte_array::ByteArray",
    members: [
      { name: "data", type: "core::array::Array::<core::bytes_31::bytes31>" },
      { name: "pending_word", type: "core::felt252" },
      {
        name: "pending_word_len",
        type: "core::internal::bounded_int::BoundedInt::<0, 30>",
      },
    ],
  },
  {
    type: "enum",
    name: "land_registry::types::LandPurposeResitrictions",
    variants: [
      { name: "NONE", type: "()" },
      { name: "RESIDENTIAL", type: "()" },
      { name: "COMMERCIAL", type: "()" },
      { name: "AGRICULTURAL", type: "()" },
    ],
  },
  {
    type: "enum",
    name: "land_registry::types::Encumberance",
    variants: [
      { name: "NONE", type: "()" },
      { name: "LIENS", type: "()" },
      { name: "MORTGAGE", type: "()" },
      { name: "DISPUTE", type: "()" },
    ],
  },
  {
    type: "struct",
    name: "land_registry::types::Land",
    members: [
      { name: "land_id", type: "core::integer::u256" },
      { name: "parcel_number", type: "core::felt252" },
      { name: "gps_coordinate", type: "core::felt252" },
      { name: "area_square_meters", type: "core::integer::u256" },
      { name: "current_valuation", type: "core::integer::u256" },
      {
        name: "purpose",
        type: "land_registry::types::LandPurposeResitrictions",
      },
      { name: "encumberance", type: "land_registry::types::Encumberance" },
    ],
  },
  {
    type: "struct",
    name: "core::array::Span::<(core::starknet::contract_address::ContractAddress, core::integer::u64)>",
    members: [
      {
        name: "snapshot",
        type: "@core::array::Array::<(core::starknet::contract_address::ContractAddress, core::integer::u64)>",
      },
    ],
  },
  {
    type: "struct",
    name: "core::array::Span::<core::integer::u256>",
    members: [
      { name: "snapshot", type: "@core::array::Array::<core::integer::u256>" },
    ],
  },
  {
    type: "interface",
    name: "land_registry::iland_registry::ILandRegistry",
    items: [
      {
        type: "function",
        name: "register_land",
        inputs: [
          { name: "parcel_number", type: "core::felt252" },
          { name: "gps_coordinate", type: "core::felt252" },
          { name: "area_square_meters", type: "core::integer::u256" },
          { name: "legal_doc_hash", type: "core::byte_array::ByteArray" },
          { name: "current_valuation", type: "core::integer::u256" },
          { name: "encumberance", type: "core::integer::u8" },
          { name: "purpose", type: "core::integer::u8" },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "transfer_land",
        inputs: [
          {
            name: "recipient",
            type: "core::starknet::contract_address::ContractAddress",
          },
          { name: "land_id", type: "core::integer::u256" },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "update_document",
        inputs: [
          { name: "new_hash", type: "core::byte_array::ByteArray" },
          { name: "land_id", type: "core::integer::u256" },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "flag_dispute",
        inputs: [{ name: "land_id", type: "core::integer::u256" }],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "resolve_dispute",
        inputs: [{ name: "land_id", type: "core::integer::u256" }],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_land",
        inputs: [{ name: "land_id", type: "core::integer::u256" }],
        outputs: [{ type: "land_registry::types::Land" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_transfer_history",
        inputs: [{ name: "land_id", type: "core::integer::u256" }],
        outputs: [
          {
            type: "core::array::Span::<(core::starknet::contract_address::ContractAddress, core::integer::u64)>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_user_lands",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [{ type: "core::array::Span::<core::integer::u256>" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_total_lands",
        inputs: [],
        outputs: [{ type: "core::integer::u256" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "token_uri",
        inputs: [{ name: "token_id", type: "core::integer::u256" }],
        outputs: [{ type: "core::byte_array::ByteArray" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "upgrade",
        inputs: [
          {
            name: "new_class_hash",
            type: "core::starknet::class_hash::ClassHash",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "impl",
    name: "OwnableImpl",
    interface_name: "openzeppelin_access::ownable::interface::IOwnable",
  },
  {
    type: "interface",
    name: "openzeppelin_access::ownable::interface::IOwnable",
    items: [
      {
        type: "function",
        name: "owner",
        inputs: [],
        outputs: [
          { type: "core::starknet::contract_address::ContractAddress" },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "transfer_ownership",
        inputs: [
          {
            name: "new_owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "renounce_ownership",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "impl",
    name: "PausableImpl",
    interface_name: "openzeppelin_security::interface::IPausable",
  },
  {
    type: "enum",
    name: "core::bool",
    variants: [
      { name: "False", type: "()" },
      { name: "True", type: "()" },
    ],
  },
  {
    type: "interface",
    name: "openzeppelin_security::interface::IPausable",
    items: [
      {
        type: "function",
        name: "is_paused",
        inputs: [],
        outputs: [{ type: "core::bool" }],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      { name: "name", type: "core::byte_array::ByteArray" },
      { name: "symbol", type: "core::byte_array::ByteArray" },
      { name: "base_uri", type: "core::byte_array::ByteArray" },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    kind: "struct",
    members: [
      {
        name: "previous_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "new_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    kind: "struct",
    members: [
      {
        name: "previous_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "new_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "OwnershipTransferred",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
        kind: "nested",
      },
      {
        name: "OwnershipTransferStarted",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_security::pausable::PausableComponent::Paused",
    kind: "struct",
    members: [
      {
        name: "account",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_security::pausable::PausableComponent::Unpaused",
    kind: "struct",
    members: [
      {
        name: "account",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_security::pausable::PausableComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "Paused",
        type: "openzeppelin_security::pausable::PausableComponent::Paused",
        kind: "nested",
      },
      {
        name: "Unpaused",
        type: "openzeppelin_security::pausable::PausableComponent::Unpaused",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_token::erc721::erc721::ERC721Component::Transfer",
    kind: "struct",
    members: [
      {
        name: "from",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "to",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      { name: "token_id", type: "core::integer::u256", kind: "key" },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_token::erc721::erc721::ERC721Component::Approval",
    kind: "struct",
    members: [
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "approved",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      { name: "token_id", type: "core::integer::u256", kind: "key" },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_token::erc721::erc721::ERC721Component::ApprovalForAll",
    kind: "struct",
    members: [
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "operator",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      { name: "approved", type: "core::bool", kind: "data" },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_token::erc721::erc721::ERC721Component::Event",
    kind: "enum",
    variants: [
      {
        name: "Transfer",
        type: "openzeppelin_token::erc721::erc721::ERC721Component::Transfer",
        kind: "nested",
      },
      {
        name: "Approval",
        type: "openzeppelin_token::erc721::erc721::ERC721Component::Approval",
        kind: "nested",
      },
      {
        name: "ApprovalForAll",
        type: "openzeppelin_token::erc721::erc721::ERC721Component::ApprovalForAll",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_introspection::src5::SRC5Component::Event",
    kind: "enum",
    variants: [],
  },
  {
    type: "event",
    name: "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event",
    kind: "enum",
    variants: [],
  },
  {
    type: "event",
    name: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
    kind: "struct",
    members: [
      {
        name: "class_hash",
        type: "core::starknet::class_hash::ClassHash",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "Upgraded",
        type: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "land_registry::land_registry::LandRegistry::LandRegistered",
    kind: "struct",
    members: [
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      { name: "parcel_number", type: "core::felt252", kind: "data" },
      { name: "land_id", type: "core::integer::u256", kind: "data" },
    ],
  },
  {
    type: "event",
    name: "land_registry::land_registry::LandRegistry::LandTransferred",
    kind: "struct",
    members: [
      { name: "land_id", type: "core::integer::u256", kind: "data" },
      {
        name: "recipient",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "land_registry::land_registry::LandRegistry::DocumentUpdated",
    kind: "struct",
    members: [{ name: "land_id", type: "core::integer::u256", kind: "data" }],
  },
  {
    type: "event",
    name: "land_registry::land_registry::LandRegistry::Flagged",
    kind: "struct",
    members: [
      { name: "land_id", type: "core::integer::u256", kind: "data" },
      {
        name: "encumberance",
        type: "land_registry::types::Encumberance",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "land_registry::land_registry::LandRegistry::LandCleared",
    kind: "struct",
    members: [{ name: "land_id", type: "core::integer::u256", kind: "data" }],
  },
  {
    type: "event",
    name: "land_registry::land_registry::LandRegistry::DisputeResolved",
    kind: "struct",
    members: [{ name: "land_id", type: "core::integer::u256", kind: "data" }],
  },
  {
    type: "event",
    name: "land_registry::land_registry::LandRegistry::Event",
    kind: "enum",
    variants: [
      {
        name: "OwnableEvent",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
        kind: "flat",
      },
      {
        name: "PausableEvent",
        type: "openzeppelin_security::pausable::PausableComponent::Event",
        kind: "flat",
      },
      {
        name: "ERC721Event",
        type: "openzeppelin_token::erc721::erc721::ERC721Component::Event",
        kind: "flat",
      },
      {
        name: "SRC5Event",
        type: "openzeppelin_introspection::src5::SRC5Component::Event",
        kind: "flat",
      },
      {
        name: "ReentrancyGuardEvent",
        type: "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event",
        kind: "flat",
      },
      {
        name: "UpgradeableEvent",
        type: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
        kind: "flat",
      },
      {
        name: "LandRegistered",
        type: "land_registry::land_registry::LandRegistry::LandRegistered",
        kind: "nested",
      },
      {
        name: "LandTransferred",
        type: "land_registry::land_registry::LandRegistry::LandTransferred",
        kind: "nested",
      },
      {
        name: "DocumentUpdated",
        type: "land_registry::land_registry::LandRegistry::DocumentUpdated",
        kind: "nested",
      },
      {
        name: "Flagged",
        type: "land_registry::land_registry::LandRegistry::Flagged",
        kind: "nested",
      },
      {
        name: "LandCleared",
        type: "land_registry::land_registry::LandRegistry::LandCleared",
        kind: "nested",
      },
      {
        name: "DisputeResolved",
        type: "land_registry::land_registry::LandRegistry::DisputeResolved",
        kind: "nested",
      },
    ],
  },
] as const;
