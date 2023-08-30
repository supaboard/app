import crypto from "crypto"
const key = crypto.createHash("sha512").update(process.env.CRYPTO_SECRET_KEY).digest("hex").substring(0, 32)
const encryptionIV = crypto.createHash("sha512").update(process.env.CRYPRO_SECRET_IV).digest("hex").substring(0, 16)

export function encrypt(data) {
	const cipher = crypto.createCipheriv(process.env.CRYPTO_ENCRYPTION_METHOD, key, encryptionIV)
	return Buffer.from(cipher.update(data, "utf8", "hex") + cipher.final("hex")).toString("base64")
}

export function decrypt(encryptedData) {
	const buff = Buffer.from(encryptedData, "base64")
	const decipher = crypto.createDecipheriv(process.env.CRYPTO_ENCRYPTION_METHOD, key, encryptionIV)
	return (decipher.update(buff.toString("utf8"), "hex", "utf8") + decipher.final("utf8"))
}
