export function checkEmail(email){
        if (!email.includes("@")) return false
        let emailParts = email.split("@")
        const [local, domain] = emailParts
        const [platform, topLevelDomain] = domain.split(".")
        function containConsecDots(str) {
            for (const i in str) {
                if (str[i] === '.') {
                if (str[i] === str[i - 1]) {
                    return true;
                }
                }
            }
            return false;
        }

        if (emailParts.length - 1 > 1) return false
        if ((local.startsWith(".")) || (local.endsWith("."))) return false
        if (containConsecDots(local)) return false
        if (containConsecDots(domain)) return false
        if ((domain.startsWith("-"))|| (domain.endsWith("-"))) return false
        if (email !== email.toLowerCase()) return false
        if (email.split(" ").length > 1) return false
        if (/[^a-zA-Z0-9@.]/.test(email)) return false;
        if (topLevelDomain.length < 2) return false

        return true
    }

export default checkEmail;