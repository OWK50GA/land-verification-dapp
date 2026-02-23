export const CONTRACT_ADDRESS =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export const LAND_REGISTRY_ABI = [
  {
    type: "function",
    name: "register_land",
    inputs: [
      { name: "parcel_number", type: "core::felt252" },
      { name: "gps_coordinate", type: "core::felt252" },
      { name: "area_square_meters", type: "core::integer::u256" },
      { name: "legal_doc_hash", type: "core::byte_array::ByteArray" },
      { name: "current_valuation", type: "core::integer::u256" },
      { name: "encumberance", type: "land_registry::types::Encumberance" },
      { name: "purpose", type: "land_registry::types::LandPurposeResitrictions" },
    ],
    outputs: [],
    state_mutability: "external",
  },
  {
    type: "function",
    name: "transfer_land",
    inputs: [
      { name: "recipient", type: "core::starknet::contract_address::ContractAddress" },
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
      { type: "core::array::Span::<(core::starknet::contract_address::ContractAddress, core::integer::u64)>" },
    ],
    state_mutability: "view",
  },
  {
    type: "function",
    name: "get_user_lands",
    inputs: [{ name: "user", type: "core::starknet::contract_address::ContractAddress" }],
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
    type: "struct",
    name: "land_registry::types::Land",
    members: [
      { name: "land_id", type: "core::integer::u256" },
      { name: "parcel_number", type: "core::felt252" },
      { name: "gps_coordinate", type: "core::felt252" },
      { name: "area_square_meters", type: "core::integer::u256" },
      { name: "current_valuation", type: "core::integer::u256" },
      { name: "purpose", type: "land_registry::types::LandPurposeResitrictions" },
      { name: "encumberance", type: "land_registry::types::Encumberance" },
    ],
  },
] as const;
