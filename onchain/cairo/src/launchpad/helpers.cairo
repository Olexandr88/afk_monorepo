use afk::launchpad::errors;

use afk::launchpad::math::PercentageMath;
// use afk::tokens::erc20::{ERC20, IERC20Dispatcher, IERC20DispatcherTrait};
use afk::launchpad::utils::{
    unique_count, sort_tokens, get_initial_tick_from_starting_price, get_next_tick_bounds
};
use afk::tokens::erc20::{ERC20, IERC20Dispatcher, IERC20DispatcherTrait, IERC20};
use afk::tokens::memecoin::{Memecoin, IMemecoinDispatcher, IMemecoinDispatcherTrait};

use afk::types::launchpad_types::{
    MINTER_ROLE, ADMIN_ROLE, StoredName, BuyToken, SellToken, CreateToken, LaunchUpdated,
    TokenQuoteBuyCoin, TokenLaunch, SharesTokenUser, BondingType, Token, CreateLaunch,
    SetJediwapNFTRouterV2, SetJediwapV2Factory, SupportedExchanges, LiquidityCreated,
    LiquidityCanBeAdded, MetadataLaunch, TokenClaimed, MetadataCoinAdded, EkuboPoolParameters,
    LaunchParameters, EkuboLP, LiquidityType, CallbackData, EkuboLaunchParameters, LaunchCallback
};

use ekubo::types::bounds::Bounds;
use ekubo::types::i129::i129;

use starknet::ContractAddress;


/// Checks the launch parameters and calculates the team allocation.
///
/// This function checks that the memecoin and quote addresses are valid,
/// that the caller is the owner of the memecoin,
/// that the memecoin has not been launched,
/// and that the lengths of the initial holders and their amounts are equal and do not exceed the
/// maximum allowed.
/// It then calculates the maximum team allocation as a percentage of the total supply,
/// and iteratively adds the amounts of the initial holders to the team allocation,
/// ensuring that the total allocation does not exceed the maximum.
/// It finally returns the total team allocation and the count of unique initial holders.
///
/// # Arguments
///
/// * `self` - A reference to the ContractState struct.
/// * `launch_parameters` - The parameters for the token launch.
///
/// # Returns
///
/// * `(u256, u8)` - The total amount of memecoin allocated to the team and the count of unique
/// initial holders.
///
/// # Panics
///
/// * If the memecoin address is not a memecoin.
/// * If the quote address is a memecoin.
/// * If the caller is not the owner of the memecoin.
/// * If the memecoin has been launched.
/// * If the lengths of the initial holders and their amounts are not equal.
/// * If the number of initial holders exceeds the maximum allowed.
/// * If the total team allocation exceeds the maximum allowed.
///
// fn check_common_launch_parameters(
//     self: @ContractState, launch_parameters: LaunchParameters
// ) -> (u256, u8) {
//     let LaunchParameters { memecoin_address,
//     transfer_restriction_delay,
//     max_percentage_buy_launch,
//     quote_address,
//     initial_holders,
//     initial_holders_amounts } =
//         launch_parameters;
//     let memecoin = IMemecoinDispatcher { contract_address: memecoin_address };

//     assert(self.is_memecoin(memecoin_address), errors::NOT_UNRUGGABLE);
//     assert(!self.is_memecoin(quote_address), errors::QUOTE_TOKEN_IS_MEMECOIN);
//     assert(!memecoin.is_launched(), errors::ALREADY_LAUNCHED);
//     assert(get_caller_address() == memecoin.owner(), errors::CALLER_NOT_OWNER);
//     assert(initial_holders.len() == initial_holders_amounts.len(), errors::ARRAYS_LEN_DIF);
//     assert(initial_holders.len() <= MAX_HOLDERS_LAUNCH.into(), errors::MAX_HOLDERS_REACHED);

//     let initial_supply = memecoin.total_supply();

//     // Check that the sum of the amounts of initial holders does not exceed the max allocatable
//     // supply for a team.
//     let max_team_allocation = initial_supply
//         .percent_mul(MAX_SUPPLY_PERCENTAGE_TEAM_ALLOCATION.into());
//     let mut team_allocation: u256 = 0;
//     let mut i: usize = 0;
//     loop {
//         if i == initial_holders.len() {
//             break;
//         }

//         let address = *initial_holders.at(i);
//         let amount = *initial_holders_amounts.at(i);

//         team_allocation += amount;
//         assert(team_allocation <= max_team_allocation, errors::MAX_TEAM_ALLOCATION_REACHED);
//         i += 1;
//     };

//     (team_allocation, unique_count(initial_holders).try_into().unwrap())
// }

pub fn distribute_team_alloc(
    // memecoin: IMemecoinDispatcher,
    memecoin: IERC20Dispatcher,
    mut initial_holders: Span<ContractAddress>,
    mut initial_holders_amounts: Span<u256>
) {
    loop {
        match initial_holders.pop_front() {
            Option::Some(holder) => {
                match initial_holders_amounts.pop_front() {
                    Option::Some(amount) => { memecoin.transfer(*holder, *amount); },
                    // Should never happen as the lengths of the spans are equal.
                    Option::None => { break; }
                }
            },
            Option::None => { break; }
        }
    }
}