/**
 * @fileoverview 通过重力感应数据计算坐标系旋转位置
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 */
define('mods/util/computeOrientationToTransform',function(require,exports,module){

	var deviceOrientationData = {
		alpha : 0,
		beta : 0,
		gamma : 0
	};
	var currentScreenOrientation = 0;

	// Degree-to-Radian conversion
	var degtorad = Math.PI / 180;

	function getBaseRotationMatrix( alpha, beta, gamma ) {
		// beta value
		var _x = beta  ? beta  * degtorad : 0;
		// gamma value
		var _y = gamma ? gamma * degtorad : 0;
		// alpha value
		var _z = alpha ? alpha * degtorad : 0;

		var cX = Math.cos( _x );
		var cY = Math.cos( _y );
		var cZ = Math.cos( _z );
		var sX = Math.sin( _x );
		var sY = Math.sin( _y );
		var sZ = Math.sin( _z );

		//
		// ZXY-ordered rotation matrix construction.
		//

		var m11 = cZ * cY - sZ * sX * sY;
		var m12 = - cX * sZ;
		var m13 = cY * sZ * sX + cZ * sY;

		var m21 = cY * sZ + cZ * sX * sY;
		var m22 = cZ * cX;
		var m23 = sZ * sY - cZ * cY * sX;

		var m31 = - cX * sY;
		var m32 = sX;
		var m33 = cX * cY;

		return [
			m11,    m12,    m13,
			m21,    m22,    m23,
			m31,    m32,    m33
		];
	}

	function getScreenTransformationMatrix( screenOrientation ) {
		var orientationAngle = screenOrientation ? screenOrientation * degtorad : 0;

		var cA = Math.cos( orientationAngle );
		var sA = Math.sin( orientationAngle );

		// Construct our screen transformation matrix
		var r_s = [
			cA,    -sA,    0,
			sA,    cA,     0,
			0,     0,      1
		];

		return r_s;
	}

	function getWorldTransformationMatrix() {
		var x = 90 * degtorad;

		var cA = Math.cos( x );
		var sA = Math.sin( x );

		// Construct our world transformation matrix
		var r_w = [
			1,     0,    0,
			0,     cA,   -sA,
			0,     sA,   cA
		];

		return r_w;
	}

	function matrixMultiply( a, b ) {
		var final = [];

		final[0] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
		final[1] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
		final[2] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];

		final[3] = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
		final[4] = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
		final[5] = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];

		final[6] = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
		final[7] = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
		final[8] = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];

		return final;
	}

	function computeMatrix() {
		// R
		var rotationMatrix = getBaseRotationMatrix(
			deviceOrientationData.alpha,
			deviceOrientationData.beta,
			deviceOrientationData.gamma
		);

		// r_s
		var screenTransform = getScreenTransformationMatrix( currentScreenOrientation );
		// R_s
		var screenAdjustedMatrix = matrixMultiply( rotationMatrix, screenTransform );
		// r_w
		var worldTransform = getWorldTransformationMatrix();
		// R_w
		var finalMatrix = matrixMultiply( screenAdjustedMatrix, worldTransform );

		// [ m11, m12, m13, m21, m22, m23, m31, m32, m33 ]
		return finalMatrix;
	}

	var computeOrientationToTransform = function(event){
		deviceOrientationData.alpha = event.alpha;
		deviceOrientationData.beta = event.beta;
		deviceOrientationData.gamma = event.gamma;

		var matrix = computeMatrix();

		var cssMatrix = [
			matrix[0],	matrix[1],	matrix[2],	0,
			matrix[3],	matrix[4],	matrix[5],	0,
			matrix[6],	matrix[7],	matrix[8],	0,
			0,			0,			0,			1
		];

		var transform = 'rotateX(90deg) rotateY(0deg) rotateZ(180deg) matrix3d(' + cssMatrix.join(',') + ')';
		return transform;
	};

	//IOS:
	//alpha [0,360]
	//beta [-90, 90]
	//gamma [-180, 180]

	module.exports = computeOrientationToTransform;

});

