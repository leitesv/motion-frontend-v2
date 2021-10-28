
import ky from 'ky-universal';

const apiUrl = "https://unifiedapi.qredit.cloud/";


const kyi = ky.extend({
	prefixUrl: apiUrl,
	retry: {
		limit: 10
	},
	hooks: {
		beforeRequest: [
			
			request => {

				let accessToken = localStorage.getItem('accessToken');
				let token = 'Bearer ' + accessToken;

				if (accessToken)
				{

						request.headers.set('Authorization', token);
						request.headers.set('x-access-token', accessToken);

				}

			}
			
		]
	}
});


var userService = {

    get: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873"
        };
        let res = await kyi.post(`api/user`, {json: data}).json();
        return res || [];
    },

    gettottoken: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873"
        };
        let res = await kyi.post(`api/usertottoken`, {json: data}).json();
        return res || [];
    },

    savepersonasettings: async (settings) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            settings: JSON.stringify(settings)
        };
        let res = await kyi.post(`api/usersavepersonasettings`, {json: data}).json();
        return res || [];
    },

    invalidatesessions: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873"
        };
        let res = await kyi.post(`api/userinvalidatesessions`, {json: data}).json();
        return res || [];
    },

    logout: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873"
        };
        let res = await kyi.post(`api/userlogout`, {json: data}).json();
        return res || [];
    },

    getimages: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873"
        };
        let res = await kyi.post(`api/userimages`, {json: data}).json();
        return res || [];
    },

    getloginhistory: async (skip, limit) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            skip: skip,
            limit: limit
        };
        let res = await kyi.post(`api/usergetloginhistory`, {json: data}).json();
        return res || [];
    },

    getcontacts: async (skip, limit) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            skip: skip,
            limit: limit
        };
        let res = await kyi.post(`api/usergetcontacts`, {json: data}).json();
        return res || [];
    },

    getcontact: async (contactid) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            contactid: contactid
        };
        let res = await kyi.post(`api/usergetcontact`, {json: data}).json();
        return res || [];
    },

    getpendingcontacts: async (skip, limit) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            skip: skip,
            limit: limit
        };
        let res = await kyi.post(`api/usergetpendingcontacts`, {json: data}).json();
        return res || [];
    },

    findcontact: async (email) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            email: email,
        };
        let res = await kyi.post(`api/userfindcontact`, {json: data}).json();
        return res || [];
    },

    newcontact: async (otheruserid) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            otheruserid: otheruserid,
        };
        let res = await kyi.post(`api/usernewcontact`, {json: data}).json();
        return res || [];
    },

    approvecontact: async (contactid) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            contactid: contactid,
        };
        let res = await kyi.post(`api/userapprovecontact`, {json: data}).json();
        return res || [];
    },

    declinecontact: async (contactid) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            contactid: contactid,
        };
        let res = await kyi.post(`api/userdeclinecontact`, {json: data}).json();
        return res || [];
    },

    bip39recorded: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873"
        };
        let res = await kyi.post(`api/userbip39recorded`, {json: data}).json();
        return res || [];
    },

    getpassphrase: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            password: rdata.password
        };
        let res = await kyi.post(`api/userpassphrase`, {json: data}).json();
        return res || [];
    },

    changepassword: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            password: rdata.password,
            newpass: rdata.newpass
        };
        let res = await kyi.post(`api/userchangepassword`, {json: data}).json();
        return res || [];
    },

    usertwofactor: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873"
        };
        let res = await kyi.post(`api/usertwofactor`, {json: data}).json();
        return res || [];
    },

    usertwofactorsave: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            password: rdata.password,
            pincode: rdata.pincode
        };
        let res = await kyi.post(`api/usertwofactorsave`, {json: data}).json();
        return res || [];
    },

    usertwofactordisable: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            pincode: rdata.pincode
        };
        let res = await kyi.post(`api/usertwofactordisable`, {json: data}).json();
        return res || [];
    },

    usergetemailauth: async (rdata) => {
        let data = {
            email: rdata.email,
            serviceid: "60ead773c06b18e7e103d873"
        };
        let res = await kyi.post(`api/usergetemailauth`, {json: data}).json();
        return res || [];
    },

    userresetpasspassphrase: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            email: rdata.email,
            word1: rdata.word1,
            word2: rdata.word2,
            word3: rdata.word3,
            word4: rdata.word4,
            word5: rdata.word5,
            word6: rdata.word6,
            word7: rdata.word7,
            word8: rdata.word8,
            word9: rdata.word9,
            word10: rdata.word10,
            word11: rdata.word11,
            word12: rdata.word12,
            password: rdata.password,
            authcode: rdata.authcode
        };
        let res = await kyi.post(`api/userresetpasspassphrase`, {json: data}).json();
        return res || [];
    },

    userresetpassnopassphrase: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            email: rdata.email,
            password: rdata.password,
            authcode: rdata.authcode
        };
        let res = await kyi.post(`api/userresetpassnopassphrase`, {json: data}).json();
        return res || [];
    },

    userresettwofactor: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            email: rdata.email,
            password: rdata.password,
            authcode: rdata.authcode,
            word1: rdata.word1
        };
        let res = await kyi.post(`api/userresettwofactor`, {json: data}).json();
        return res || [];
    },

    register: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            entity: rdata.entity,
            email: rdata.email,
            companyname: rdata.companyname,
            familyname: rdata.familyname,
            givenname: rdata.givenname,
            residence_country: rdata.residence_country,
            password: rdata.password,
            invitecode: rdata.invitecode
        };
        let res = await kyi.post(`api/auth/signup`, {json: data}).json();
        return res || [];
    },

    login: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            email: rdata.email,
            password: rdata.password,
            tfapin: rdata.tfapin
        };
        let res = await kyi.post(`api/auth/signin`, {json: data}).json();
        return res || [];
    },

    createrevolutorder: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            plan: rdata.plan,
            period: rdata.period,
            amount: rdata.amount
        };
        let res = await kyi.post(`api/usercreaterevolutorder`, {json: data}).json();
        return res || [];
    },

    revolutpaymentapproved: async (rdata) => {

        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            plan: rdata.plan,
            period: rdata.period,
            amount: rdata.amount,
            provider: rdata.provider,
            orderid: rdata.orderid
        };
        let res = await kyi.post(`api/userrevolutpaymentapproved`, {json: data}).json();
        return res || [];
    },

    createcoinpaymentsorder: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            plan: rdata.plan,
            period: rdata.period,
            amount: rdata.amount,
            ticker: rdata.ticker
        };
        let res = await kyi.post(`api/usercreatecoinpaymentsorder`, {json: data}).json();
        return res || [];
    },

    selectdowngradeplan: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            plan: rdata.plan,
            period: rdata.period,
            amount: rdata.amount
        };
        let res = await kyi.post(`api/userselectdowngradeplan`, {json: data}).json();
        return res || [];
    },

    updateprofilepic: async (image) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            image: image
        };
        let res = await kyi.post(`api/userupdateprofilepic`, {json: data}).json();
        return res || [];
    },

    updateprofilebg: async (image) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            image: image
        };
        let res = await kyi.post(`api/userupdateprofilebg`, {json: data}).json();
        return res || [];
    },

    setlanguage: async (language) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            language: language
        };
        let res = await kyi.post(`api/usersetlanguage`, {json: data}).json();
        return res || [];
    },
    
    setcurrency: async (currency) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            currency: currency
        };
        let res = await kyi.post(`api/usersetcurrency`, {json: data}).json();
        return res || [];
    },
    
    getnotificationcount: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
        };
        let res = await kyi.post(`api/usergetnotificationcount`, {json: data}).json();
        return res || [];
    },

    getnotification: async (id) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            id: id
        };
        let res = await kyi.post(`api/usergetnotification`, {json: data}).json();
        return res || [];
    },

    getnotificationhistory: async (skip, limit) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            skip: skip,
            limit: limit
        };
        let res = await kyi.post(`api/usergetnotificationhistory`, {json: data}).json();
        return res || [];
    },

    getwalletaddresses: async (id) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            id: id
        };
        let res = await kyi.post(`api/usergetwalletaddresses`, {json: data}).json();
        return res || [];
    },

    getwalletbalance: async (id) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            id: id
        };
        let res = await kyi.post(`api/usergetwalletbalance`, {json: data}).json();
        return res || [];
    },

    getwallettransactions: async (walletid, skip, limit) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            walletid: walletid,
            skip: skip,
            limit: limit
        };
        let res = await kyi.post(`api/usergetwallettransactions`, {json: data}).json();
        return res || [];
    },

    gettransaction: async (walletid, id) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            walletid: walletid,
            id: id
        };
        let res = await kyi.post(`api/usergettransaction`, {json: data}).json();
        return res || [];
    },

    sendtransaction: async (walletid, contactid, address, amount, pass, vendor = '') => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            walletid: walletid,
            contactid: contactid,
            address: address,
            amount: amount,
            pass: pass,
            vendor: vendor
            
        };
        let res = await kyi.post(`api/usersendtransaction`, {json: data}).json();
        return res || [];
    },

    sendqreditvote: async (walletid, tovote, pass) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            walletid: walletid,
            tovote: tovote,
            pass: pass
        };
        let res = await kyi.post(`api/usersendqreditvote`, {json: data}).json();
        return res || [];
    },

    getdelegatelist: async (walletid) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            walletid: walletid
        };
        let res = await kyi.post(`api/usergetdelegatelist`, {json: data}).json();
        return res || [];
    },

    getwalletvotes: async (walletid) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            walletid: walletid
        };
        let res = await kyi.post(`api/usergetwalletvotes`, {json: data}).json();
        return res || [];
    },

    doqreditswap: async (passphrase) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            passphrase: passphrase
        };
        let res = await kyi.post(`api/userdoqreditswap`, {json: data}).json();
        return res || [];
    },

    getswaptransactions: async (skip, limit) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            skip: skip,
            limit: limit
        };
        let res = await kyi.post(`api/usergetswaptransactions`, {json: data}).json();
        return res || [];
    },

    getalltransactions: async (skip, limit) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            skip: skip,
            limit: limit
        };
        let res = await kyi.post(`api/usergetalltransactions`, {json: data}).json();
        return res || [];
    },

    createinvitation: async (emailphone) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            emailphone: emailphone
        };
        let res = await kyi.post(`api/usercreateinvitation`, {json: data}).json();
        return res || [];
    },

    getinvitations: async (skip, limit) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            skip: skip,
            limit: limit
        };
        let res = await kyi.post(`api/usergetinvitations`, {json: data}).json();
        return res || [];
    },

    getreferrals: async (skip, limit) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            skip: skip,
            limit: limit
        };
        let res = await kyi.post(`api/usergetreferrals`, {json: data}).json();
        return res || [];
    },

    getuserphones: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873"
        };
        let res = await kyi.post(`api/usergetphones`, {json: data}).json();
        return res || [];
    },

    getpincode: async (phone) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            phone: phone
        };
        let res = await kyi.post(`api/usergetpincode`, {json: data}).json();
        return res || [];
    },

    submitpincode: async (phone, pin) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            phone: phone,
            pin: pin
        };
        let res = await kyi.post(`api/usersubmitpincode`, {json: data}).json();
        return res || [];
    },

    setprimaryphone: async (id) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            id: id
        };
        let res = await kyi.post(`api/usersetprimaryphone`, {json: data}).json();
        return res || [];
    },

    getuseraddresses: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
        };
        let res = await kyi.post(`api/usergetaddresses`, {json: data}).json();
        return res || [];
    },

    addnewaddress: async (fields) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            line1: fields.line1,
            line2: fields.line2,
            city: fields.city,
            province: fields.province,
            postalcode: fields.postalcode,
            country: fields.country
        };
        let res = await kyi.post(`api/useraddnewaddress`, {json: data}).json();
        return res || [];
    },

    setprimaryaddress: async (id) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            id: id
        };
        let res = await kyi.post(`api/usersetprimaryaddress`, {json: data}).json();
        return res || [];
    },

    setnotification: async (item, value) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            item: item,
            value: value
        };
        let res = await kyi.post(`api/usersetnotification`, {json: data}).json();
        return res || [];
    },

    upgradeplan: async (plan) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            plan: plan,
        };
        let res = await kyi.post(`api/userupgradeplan`, {json: data}).json();
        return res || [];
    },

    getplans: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
        };
        let res = await kyi.post(`api/usergetplans`, {json: data}).json();
        return res || [];
    },

    getavailcryptocurr: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
        };
        let res = await kyi.post(`api/usergetavailablecryptocurrencies`, {json: data}).json();
        return res || [];
    },

    createcryptowallet: async (ticker, password) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            ticker: ticker,
            password: password
        };
        let res = await kyi.post(`api/usercreatecryptowallet`, {json: data}).json();
        return res || [];
    },

    getqslptokens: async (addr) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            address: addr
        };
        let res = await kyi.post(`api/usergetqslptokens`, {json: data}).json();
        return res || [];
    },

    getaslptokens: async (addr) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            address: addr
        };
        let res = await kyi.post(`api/usergetaslptokens`, {json: data}).json();
        return res || [];
    },

    getqslptokeninfo: async (id) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            idHex: id
        };
        let res = await kyi.post(`api/usergetqslptokeninfo`, {json: data}).json();
        return res || [];
    },

    getaslptokeninfo: async (id) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            idHex: id
        };
        let res = await kyi.post(`api/usergetaslptokeninfo`, {json: data}).json();
        return res || [];
    },
    
}

export default userService;
