
const A0 = 0x67452301;
const B0 = 0xefcdab89;
const C0 = 0x98badcfe;
const D0 = 0x10325476;

const S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
           5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
           4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
           6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];

const K = new Uint32Array([0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
                           0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
                           0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
                           0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
                           0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
                           0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
                           0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
                           0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
                           0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
                           0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
                           0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
                           0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
                           0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
                           0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
                           0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
                           0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391]);

const PADDING = new Uint8Array([0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);

export default function md5(input){
	// Always convert input to a string
	input = input.toString();

	// Initialize digest buffers
	var A = A0;
	var B = B0;
	var C = C0;
	var D = D0;

	// Determine the size of the message in bytes
	var size = input.length;
	var paddingLength = size % 64 < 56 ? 56 - (size % 64) : (56 + 64) - (size % 64);
	var inputBytes = new Uint8Array(size + paddingLength + 8);

	// Copy the number values of the characters into an array
	for(let i = 0; i < input.length; ++i){
		inputBytes[i] = input.charCodeAt(i);
	}

	// Pad the array to be congruent to 56 mod 64 (bytes)
	for(let i = 0; i < paddingLength; ++i){
		inputBytes[size + i] = PADDING[i];
	}

	// Separate the size in bits into two 32-bit unsigned integers
	var sizeBitsLower = (size * 8) >>> 0;
	var sizeBitsUpper = ((size * 8) / (Math.pow(2, 32))) >>> 0;

	// Append the size in bits
	inputBytes[size + paddingLength + 0] = (sizeBitsLower >>>  0) & 0xff;
	inputBytes[size + paddingLength + 1] = (sizeBitsLower >>>  8) & 0xff;
	inputBytes[size + paddingLength + 2] = (sizeBitsLower >>> 16) & 0xff;
	inputBytes[size + paddingLength + 3] = (sizeBitsLower >>> 24) & 0xff;
	inputBytes[size + paddingLength + 4] = (sizeBitsUpper >>>  0) & 0xff;
	inputBytes[size + paddingLength + 5] = (sizeBitsUpper >>>  8) & 0xff;
	inputBytes[size + paddingLength + 6] = (sizeBitsUpper >>> 16) & 0xff;
	inputBytes[size + paddingLength + 7] = (sizeBitsUpper >>> 24) & 0xff;

	for(let i = 0; i < (size + paddingLength) / 64; ++i){
		// Turn the input into an array of words
		var m = getChunk(i, inputBytes);

		var AA = A;
		var BB = B;
		var CC = C;
		var DD = D;

		var E;
		var g;

		for(let j = 0; j < 64; ++j){
			switch(Math.floor(j / 16)){
				case 0:
					E = F(BB, CC, DD);
					g = j;
					break;
				case 1:
					E = G(BB, CC, DD);
					g = ((j * 5) + 1) % 16;
					break;
				case 2:
					E = H(BB, CC, DD);
					g = ((j * 3) + 5) % 16;
					break;
				default:
					E = I(BB, CC, DD);
					g = (j * 7) % 16;
					break;
			}

			var temp = DD;
			DD = CC;
			CC = BB;
			BB = unsigned32Add(BB, rotateLeft(unsigned32Add(AA, E, K[j], m[g]), S[j]));
			AA = temp;
		}

		A += AA;
		B += BB;
		C += CC;
		D += DD;
	}

	var result = new ArrayBuffer(16);
	var view = new Uint32Array(result);
	view[0] = A;
	view[1] = B;
	view[2] = C;
	view[3] = D;

	return result;
}

/*
 * Functions defined by the algorithm
 */
function F(X, Y, Z){
	return (X & Y) | (~X & Z);
}

function G(X, Y, Z){
	return (X & Z) | (Y & ~Z);
}

function H(X, Y, Z){
	return X ^ Y ^ Z;
}

function I(X, Y, Z){
	return Y ^ (X | ~Z);
}

/*
 * Rotates a word x left by n bits
 */
function rotateLeft(x, n){
	if(n != Math.floor(n) || n < 0){
		throw 'Invalid argument (n): requires positive integer'
	}

	return ((x << n) | (x >>> (32 - n))) >>> 0;
}

/*
 * Returns an array of words from chunk i of the provided message
 */
function getChunk(i, message){
	var m = [];
	for(let j = 0; j < 16; ++j){
		m[j] = message[(i * 64) + (j * 4) + 0] <<  0 |
		       message[(i * 64) + (j * 4) + 1] <<  8 |
		       message[(i * 64) + (j * 4) + 2] << 16 |
		       message[(i * 64) + (j * 4) + 3] << 24;
	}
	return m;
}


function unsigned32Add(){
	return Array.from(arguments).reduce(function (a, b){
		return ((a >>> 0) + (b >>> 0)) >>> 0;
	}, 0);
}

//funcion
const hola = 'Hola'
const res = generateMD5Hash(hola)

function generateMD5Hash(input) {
    // Obtener el hash MD5 como ArrayBuffer
    const hashBuffer = md5(input);

    // Convertir el ArrayBuffer a string hexadecimal
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

