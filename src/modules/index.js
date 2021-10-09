import { routes } from '../shared/constants';

// import Homepage from './Homepage';
import Dashboard from './Dashboard';
import Welcome from './Welcome';
import LogIn from './LogIn';
import AddCurrency from './AddCurrency';
import Wallets from './Wallets';
import Transactions from './Transactions';
import Setting from './Settings';
//import Currency from './Currency';
import AccountSupport from './AccountSupport';
import Placeholder from './Placeholder';
import PrivacyPolicy from './PrivacyPolicy';
import GetBIP39 from './GetBIP39';
//import Language from './Language';
import LoginHistory from './LoginHistory';
///import MyAddresses from './MyAddresses';
//import MyPhonenumbers from './MyPhonenumbers';
import NotificationSettings from './NotificationSettings';
import Persona from './Persona';
import Priceplan from './Priceplan';
//import SecuritySettings from './SecuritySettings';
import SwapOldXQR from './SwapOldXQR';
import TermsAndConditions from './TermsAndConditions';
//import TwoFactorAuthentication from './TwoFactorAuthentication';
import ReferralProgram from './ReferralProgram';
import Contacts from './Contacts';
import QreditNFT from './QreditNFT';
import QSLP1 from './QSLP1';
import CreateTokens from './CreateTokens';
import Tokenoftrust from './Tokenoftrust';
import Viewcontact from './Viewcontact';
import Register from './Register';
import LoginHelp from './LoginHelp';
//import TwoFactor from './TwoFactor';
import Security from './Security';
import Phone from './Phone';

export default {
	// [routes.homepage]: Homepage,
	[routes.dashboardpage]: Dashboard,
	[routes.welcomepage]: Welcome,
	[routes.loginpage]: LogIn,
	[routes.addcurrencypage]: AddCurrency,
	[routes.walletspage]: Wallets,

	[routes.settingspage]: Setting,
	//[routes.currencypage]: Currency,
	[routes.accountsupportpage]: AccountSupport,

	[routes.transactions]: Transactions,
	[routes.getbip39]: GetBIP39,
	//[routes.language]: Language,
	[routes.loginhistory]: LoginHistory,
	//[routes.myaddresses]: MyAddresses,
	//[routes.myphonenumbers]: MyPhonenumbers,
	[routes.notificationsettings]: NotificationSettings,
	[routes.persona]: Persona,
	[routes.priceplan]: Priceplan,
	//[routes.securitysettings]: SecuritySettings,
	[routes.swapoldxqr]: SwapOldXQR,
	[routes.termsandconditions]: TermsAndConditions,
	//[routes.twofactorauthentication]: TwoFactorAuthentication,
	[routes.privacypolicy]: PrivacyPolicy,
	[routes.placeholder]: Placeholder,
	[routes.referralprogram]: ReferralProgram,
	[routes.contacts]: Contacts,
	[routes.qreditnft]: QreditNFT,
	[routes.qslp1]: QSLP1,
	[routes.createtokens]: CreateTokens,
	[routes.tokenoftrust]: Tokenoftrust,
	[routes.viewcontact]: Viewcontact,
	[routes.register]: Register,
	[routes.loginhelp]: LoginHelp,
	//[routes.twofactor]: TwoFactor,
	[routes.security]: Security,
	[routes.phone]: Phone,
};